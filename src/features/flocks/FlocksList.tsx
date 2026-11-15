import { useNavigate } from "@/lib/router-compat";
import { useAuth } from "../auth/AuthProvider";
import { Plus, Egg, Percent } from "lucide-react";
interface FlockTile {
  id: string;
  name: string;
  type: "layer" | "broiler";
  breed: string;
  status: "active" | "sold_out" | "closed";
  birdsReceived: number;
  receivedAt: string;
  targetWeightKg?: number;
  currentWeightKg?: number;
}

const SAMPLE: FlockTile[] = [
  {
    id: "fl-001",
    name: "Kampala Layer 01",
    type: "layer",
    breed: "ISA Brown",
    status: "active",
    birdsReceived: 500,
    receivedAt: "2026-01-10",
    targetWeightKg: 2.0,
    currentWeightKg: 1.8,
  },
  {
    id: "fl-002",
    name: "Entebbe Broiler 02",
    type: "broiler",
    breed: "Kuroiler",
    status: "active",
    birdsReceived: 620,
    receivedAt: "2026-10-12",
    targetWeightKg: 2.5,
    currentWeightKg: 1.6,
  },
  {
    id: "fl-003",
    name: "Jinja Layer 03",
    type: "layer",
    breed: "Lohmann",
    status: "sold_out",
    birdsReceived: 450,
    receivedAt: "2025-03-02",
    targetWeightKg: 2.0,
  },
];

export function FlocksList() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const canManage = user?.role === "owner" || user?.role === "manager";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-[var(--foreground)]">Flocks</h1>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Track birds, weight targets, and flock lifecycle.
          </p>
        </div>
        {canManage && (
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--primary-foreground)] transition-colors hover:bg-[var(--secondary)]"
            onClick={() => navigate("/flocks/new")}
          >
            <Plus className="h-4 w-4" />
            Add flock
          </button>
        )}
      </div>

      <FlocksTable rows={SAMPLE} />
    </div>
  );
}

function FlocksTable({ rows }: { rows: FlockTile[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--color-card)] shadow-sm">
      <div className="divide-y divide-[var(--border)]">
        {rows.map((row) => (
          <FlockRow key={row.id} row={row} />
        ))}
      </div>
      {rows.length === 0 && (
        <div className="px-4 py-8 text-center text-sm text-[var(--muted-foreground)]">
          No flocks yet. Add your first flock to start tracking.
        </div>
      )}
    </div>
  );
}

function FlockRow({ row }: { row: FlockTile }) {
  const navigate = useNavigate();
  const progress =
    row.type === "broiler" && row.currentWeightKg && row.targetWeightKg
      ? Math.round((row.currentWeightKg / row.targetWeightKg) * 100)
      : null;

  return (
    <div
      className="cursor-pointer transition-colors hover:bg-[var(--muted)]"
      onClick={() => navigate(`/flocks/${row.id}`)}
    >
      <div className="flex items-center gap-4 p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--primary)]/10 text-[var(--primary)]">
          {row.type === "layer" ? <Egg className="h-5 w-5" /> : <Percent className="h-5 w-5" />}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate font-medium text-[var(--foreground)]">{row.name}</span>
            <Badge type={row.type} />
            <StatusBadge status={row.status} />
          </div>
          <div className="mt-0.5 flex flex-wrap gap-x-4 gap-y-1 text-sm text-[var(--muted-foreground)]">
            <span>{row.breed}</span>
            <span>{row.birdsReceived.toLocaleString()} birds received</span>
            <span>{row.receivedAt}</span>
          </div>
        </div>

        {progress !== null && (
          <div className="w-24 shrink-0">
            <div className="flex items-baseline justify-between text-xs mb-1">
              <span className="text-[var(--muted-foreground)]">Weight target</span>
              <span className="font-medium text-[var(--foreground)] num">{progress}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--muted)]">
              <div className="h-full w-0 transition-[width] bg-[var(--primary)]" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        <div className="shrink-0 text-right">
          <span className="rounded-full bg-[var(--muted)] px-2 py-1 text-xs text-[var(--muted-foreground)]">
            {row.id}
          </span>
        </div>
      </div>
    </div>
  );
}

function Badge({ type }: { type: "layer" | "broiler" }) {
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${type === "layer" ? "bg-[var(--accent)] text-[var(--foreground)]" : "bg-[var(--secondary)] text-[var(--primary-foreground)]"}`}>
      {type}
    </span>
  );
}

function StatusBadge({ status }: { status: FlockTile["status"] }) {
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${status === "active" ? "bg-[var(--success)]/10 text-[var(--success)]" : status === "sold_out" ? "bg-[var(--warning)]/10 text-[var(--warning)]" : "bg-[var(--muted)] text-[var(--muted-foreground)]"}`}>
      {status === "sold_out" ? "Sold out" : status}
    </span>
  );
}
