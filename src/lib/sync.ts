import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/features/auth/AuthProvider";
import { getDb } from "./db";
import { useSyncStatus } from "../sync/SyncStatusStore";

/**
 * Offline-first sync against the Express API.
 *
 * - push: drains the Dexie outbox into `POST /sync/push` (the server keeps the
 *   newest `updatedAt` per record, so replays are safe).
 * - pull: fetches rows newer than the stored cursor from `GET /sync/pull` and
 *   writes them straight into Dexie, so screens read local data only.
 */

/** Dexie table -> server sync table name. */
const SERVER_TABLE: Record<string, string> = {
  flocks: "flocks",
  reports: "dailyReports",
  eggRecords: "eggRecords",
  mortalityRecords: "mortalityRecords",
  feedUsage: "feedUsage",
  weightSamples: "weightSamples",
  customers: "customers",
  sales: "sales",
  payments: "salePayments",
  expenses: "expenses",
  feedStock: "feedStock",
  feedDeliveries: "feedPurchases",
  medications: "medicineStock",
  vaccinations: "vaccinations",
  treatments: "medicationApplications",
  visits: "biosecurityLog",
  alerts: "alerts",
  documents: "documents",
  equipment: "equipment",
  cashups: "cashLogs",
  photos: "photos",
  suppliers: "suppliers",
  expenseCategories: "expenseCategories",
  expensePayments: "expensePayments",
  priceHistory: "priceHistory",
  staffPayments: "staffPayments",
  maintenanceRecords: "maintenanceRecords",
  pushSubscriptions: "pushSubscriptions",
  audit: "auditLog",
};

const LOCAL_TABLE: Record<string, string> = Object.fromEntries(
  Object.entries(SERVER_TABLE).map(([local, remote]) => [remote, local]),
);

const PULL_CURSOR_KEY = "kuku:last-pull";

interface OutboxRow {
  id?: number;
  at: string;
  table: string;
  op: string;
  recordId: string;
}

interface PushResponse {
  applied: number;
  rejected: { table: string; id: string; reason: string }[];
}

interface PullResponse {
  serverTime: string;
  changes: Record<string, Record<string, unknown>[]>;
}

export interface PullResult {
  written: number;
  removed: number;
}

export interface SyncResult {
  pushed: number;
  pulled: number;
  removed: number;
}

/** Push every queued local write. Rows the server refuses stay queued. */
export async function pushOutbox(): Promise<number> {
  const db = getDb();
  const items = (await db.outbox.orderBy("id").toArray()) as OutboxRow[];
  const pending = items.filter((item) => SERVER_TABLE[item.table]);

  if (!pending.length) {
    if (items.length) await db.outbox.bulkDelete(items.map((item) => item.id!));
    return 0;
  }

  const grouped = new Map<string, Record<string, unknown>[]>();
  for (const item of pending) {
    const record = (await db.table(item.table).get(item.recordId)) as
      | Record<string, unknown>
      | undefined;
    if (!record) continue;
    const remote = SERVER_TABLE[item.table];
    const rows = grouped.get(remote) ?? [];
    rows.push({ ...record, updatedAt: new Date(item.at).toISOString(), deletedAt: null });
    grouped.set(remote, rows);
  }

  if (!grouped.size) {
    await db.outbox.bulkDelete(pending.map((item) => item.id!));
    return 0;
  }

  const { data, error } = await supabase.rpc("sync_push", {
    _changes: [...grouped].map(([table, rows]) => ({ table, rows })) as never,
  });
  if (error) throw new Error(`Push failed (${error.message})`);

  const body = data as unknown as PushResponse;
  const rejectedTables = new Set(body.rejected.filter((r) => r.id === "*").map((r) => r.table));
  const rejectedRows = new Set(
    body.rejected.filter((r) => r.id !== "*").map((r) => `${r.table}:${r.id}`),
  );

  const settled = pending.filter((item) => {
    const remote = SERVER_TABLE[item.table];
    return !rejectedTables.has(remote) && !rejectedRows.has(`${remote}:${item.recordId}`);
  });
  if (settled.length) await db.outbox.bulkDelete(settled.map((item) => item.id!));

  return body.applied;
}

/** Pull server changes newer than the last cursor into Dexie. */
export async function pullChanges(): Promise<PullResult> {
  const since = localStorage.getItem(PULL_CURSOR_KEY) ?? new Date(0).toISOString();
  const changes: Record<string, Record<string, unknown>[]> = {};
  let serverTime = since;
  const PAGE = 1000;
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await supabase
      .from("record_store")
      .select("table_name, data, deleted_at, server_updated_at")
      .gt("server_updated_at", since)
      .order("server_updated_at", { ascending: true })
      .range(from, from + PAGE - 1);
    if (error) throw new Error(`Pull failed (${error.message})`);
    for (const row of data ?? []) {
      const bucket = changes[row.table_name] ?? (changes[row.table_name] = []);
      bucket.push({ ...(row.data as Record<string, unknown>), deletedAt: row.deleted_at });
      if (row.server_updated_at > serverTime) serverTime = row.server_updated_at;
    }
    if (!data || data.length < PAGE) break;
  }
  const body: PullResponse = { serverTime, changes };
  const db = getDb();
  let written = 0;
  let removed = 0;

  for (const [remote, rows] of Object.entries(body.changes)) {
    const local = LOCAL_TABLE[remote];
    if (!local || !rows.length) continue;

    const alive: Record<string, unknown>[] = [];
    const tombstones: string[] = [];
    for (const row of rows) {
      const { updatedAt: _updatedAt, deletedAt, ...record } = row;
      if (deletedAt) tombstones.push(String(row.id));
      else alive.push(record);
    }

    if (alive.length) {
      await db.table(local).bulkPut(alive);
      written += alive.length;
    }
    // Tombstones are the server's source of truth, so drop the local copy.
    for (const id of tombstones) {
      await db.table(local).delete(id);
      removed += 1;
    }
  }

  localStorage.setItem(PULL_CURSOR_KEY, body.serverTime);
  return { written, removed };
}

/**
 * Run a full sync cycle. Safe to call often: it no-ops when offline or signed out,
 * and the outbox survives failures so nothing is lost.
 */
export async function syncNow(): Promise<SyncResult> {
  const status = useSyncStatus.getState();
  status.setPending(await getDb().outbox.count());

  if (!navigator.onLine || !useAuthStore.getState().user?.role) {
    return { pushed: 0, pulled: 0, removed: 0 };
  }

  status.setSyncing(true);
  try {
    const pull = await pullChanges();
    const pushed = await pushOutbox();
    status.setPending(await getDb().outbox.count());
    status.markSynced();
    return { pushed, pulled: pull.written, removed: pull.removed };
  } catch (error) {
    status.setError(error instanceof Error ? error.message : "Sync failed");
    throw error;
  } finally {
    useSyncStatus.getState().setSyncing(false);
  }
}
