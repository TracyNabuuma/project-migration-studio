import { useState, type FormEvent } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { Plus, X } from "lucide-react";
import { getDb, save, today, uid } from "../../lib/db";
import { useAuth } from "../auth/AuthProvider";

const INPUT =
  "w-full rounded-lg border border-[var(--input)] bg-[var(--color-background)] px-3 py-2 text-sm text-[var(--foreground)] focus:border-[var(--ring)] focus:outline-none";

const METHODS = ["Cash", "Mobile money", "Bank"] as const;
const ROLES = ["Manager", "Attendant", "Casual", "Cleaner", "Security", "Driver"] as const;

export function StaffPaymentsScreen() {
  const { user } = useAuth();
  const canManage = user?.role === "owner";
  const rows = useLiveQuery(() => getDb().staffPayments.orderBy("date").reverse().toArray(), []) ?? [];
  const [adding, setAdding] = useState(false);
  const [date, setDate] = useState(today());
  const [name, setName] = useState("");
  const [role, setRole] = useState("Attendant");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<string>("Cash");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const byPerson = rows.reduce<Record<string, { name: string; role: string; total: number; count: number }>>((acc, r) => {
    const entry = acc[r.name] ?? { name: r.name, role: r.role, total: 0, count: 0 };
    entry.total += r.amount;
    entry.count += 1;
    entry.role = r.role;
    acc[r.name] = entry;
    return acc;
  }, {});

  async function submit(event: FormEvent) {
    event.preventDefault();
    const a = Number(amount);
    if (!Number.isFinite(a) || a <= 0) {
      setError("Enter a valid amount.");
      return;
    }
    if (!name.trim()) {
      setError("Enter a staff name.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await save(
        "staffPayments",
        { id: uid(), date, name: name.trim(), role, amount: a, method },
        user?.name ?? "Unknown",
        "recorded staff payment",
      );
      setDate(today());
      setName("");
      setAmount("");
      setAdding(false);
    } finally {
      setSaving(false);
    }
  }

  const total = rows.reduce((s, r) => s + r.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-[var(--foreground)]">Staff payments</h1>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Record wages and allowances. Sums are shown by person so payroll stays easy to check.
          </p>
        </div>
        {canManage && (
          <button
            type="button"
            onClick={() => setAdding((v) => !v)}
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--primary-foreground)] transition-colors hover:bg-[var(--secondary)]"
          >
            {adding ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {adding ? "Cancel" : "Record payment"}
          </button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--color-card)] p-5 shadow-sm">
          <div className="text-sm text-[var(--muted-foreground)]">Total paid</div>
          <div className="mt-1 font-display text-2xl font-semibold text-[var(--foreground)] num">
            UGX {total.toLocaleString()}
          </div>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--color-card)] p-5 shadow-sm">
          <div className="text-sm text-[var(--muted-foreground)]">Payments</div>
          <div className="mt-1 font-display text-2xl font-semibold text-[var(--foreground)] num">{rows.length}</div>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--color-card)] p-5 shadow-sm">
          <div className="text-sm text-[var(--muted-foreground)]">People paid</div>
          <div className="mt-1 font-display text-2xl font-semibold text-[var(--foreground)] num">{Object.keys(byPerson).length}</div>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--color-card)] p-5 shadow-sm">
          <div className="text-sm text-[var(--muted-foreground)]">Average per person</div>
          <div className="mt-1 font-display text-2xl font-semibold text-[var(--foreground)] num">
            UGX {Object.keys(byPerson).length ? Math.round(total / Object.keys(byPerson).length).toLocaleString() : "—"}
          </div>
        </div>
      </div>

      {adding && canManage && (
        <form onSubmit={submit} className="space-y-4 rounded-xl border border-[var(--border)] bg-[var(--color-card)] p-5 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <label className="block space-y-1">
              <span className="block text-sm font-medium text-[var(--foreground)]">Date</span>
              <input type="date" className={INPUT} value={date} onChange={(e) => setDate(e.target.value)} />
            </label>
            <label className="block space-y-1">
              <span className="block text-sm font-medium text-[var(--foreground)]">Name</span>
              <input className={INPUT} value={name} onChange={(e) => setName(e.target.value)} placeholder="Joseph" />
            </label>
            <label className="block space-y-1">
              <span className="block text-sm font-medium text-[var(--foreground)]">Role</span>
              <select className={INPUT} value={role} onChange={(e) => setRole(e.target.value)}>
                {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </label>
            <label className="block space-y-1">
              <span className="block text-sm font-medium text-[var(--foreground)]">Amount (UGX)</span>
              <input type="number" min={1} className={INPUT} value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="350000" />
            </label>
            <label className="block space-y-1">
              <span className="block text-sm font-medium text-[var(--foreground)]">Method</span>
              <select className={INPUT} value={method} onChange={(e) => setMethod(e.target.value)}>
                {METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </label>
          </div>
          {error && <p className="text-sm text-[var(--destructive)]">{error}</p>}
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setAdding(false)} className="rounded-lg bg-[var(--background)] px-4 py-2 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--muted)]">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="rounded-lg bg-[var(--success)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--success)]/90 disabled:cursor-not-allowed disabled:opacity-50">
              {saving ? "Saving…" : "Save payment"}
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--color-card)] p-5 shadow-sm">
          <h2 className="text-base font-semibold text-[var(--foreground)]">By person</h2>
          <div className="mt-4 space-y-3">
            {Object.values(byPerson)
              .sort((a, b) => b.total - a.total)
              .map((entry) => (
                <div key={entry.name} className="flex items-center justify-between rounded-lg bg-[var(--background)] px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="grid size-8 place-items-center rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold text-sm">
                      {entry.name[0]}
                    </div>
                    <div>
                      <div className="font-medium text-[var(--foreground)]">{entry.name}</div>
                      <div className="text-xs text-[var(--muted-foreground)]">{entry.role} · {entry.count} payment{entry.count === 1 ? "" : "s"}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-[var(--foreground)] num">UGX {entry.total.toLocaleString()}</div>
                    <div className="text-xs text-[var(--muted-foreground)]">{entry.count} × avg</div>
                  </div>
                </div>
              ))}
            {Object.keys(byPerson).length === 0 && (
              <p className="text-sm text-[var(--muted-foreground)]">No staff payments recorded yet.</p>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--color-card)] shadow-sm">
          <h2 className="px-4 py-3 text-base font-semibold text-[var(--foreground)]">Payments</h2>
          <div className="divide-y divide-[var(--border)]">
            {rows.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-[var(--muted-foreground)]">No payments yet.</div>
            ) : (
              rows.map((row) => (
                <div key={row.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3 text-sm">
                  <span className="text-[var(--muted-foreground)]">{row.date}</span>
                  <span className="font-medium text-[var(--foreground)]">{row.name}</span>
                  <span className="text-[var(--muted-foreground)]">{row.role}</span>
                  <span className="text-[var(--muted-foreground)]">{row.method}</span>
                  <span className="ml-auto font-medium text-[var(--foreground)] num">UGX {row.amount.toLocaleString()}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
