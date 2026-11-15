import { useState, type FormEvent } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { Plus, X, Check, Circle } from "lucide-react";
import { getDb, save, uid, type ExpenseCategoryRow } from "../../lib/db";
import { useAuth } from "../auth/AuthProvider";

const INPUT =
  "w-full rounded-lg border border-[var(--input)] bg-[var(--color-background)] px-3 py-2 text-sm text-[var(--foreground)] focus:border-[var(--ring)] focus:outline-none";

export function ExpenseCategoriesScreen() {
  const { user } = useAuth();
  const canManage = user?.role === "owner";
  const rows = useLiveQuery(() => getDb().expenseCategories.toArray(), []) ?? [];
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!name.trim()) {
      setError("Enter a category name.");
      return;
    }
    if (rows.some((r) => r.name.toLowerCase() === name.trim().toLowerCase())) {
      setError("That category already exists.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await save(
        "expenseCategories",
        { id: uid(), name: name.trim(), active: true },
        user?.name ?? "Unknown",
        "added expense category",
      );
      setName("");
      setAdding(false);
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(row: ExpenseCategoryRow) {
    if (!canManage) return;
    await save(
      "expenseCategories",
      { ...row, active: !row.active },
      user?.name ?? "Unknown",
      row.active ? "deactivated expense category" : "reactivated expense category",
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-[var(--foreground)]">Expense categories</h1>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Categories used when recording expenses. Owners can add and toggle them on or off.
        </p>
      </div>

      {canManage && (
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setAdding((v) => !v)}
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--primary-foreground)] transition-colors hover:bg-[var(--secondary)]"
          >
            {adding ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {adding ? "Cancel" : "Add category"}
          </button>
        </div>
      )}

      {adding && canManage && (
        <form onSubmit={submit} className="space-y-4 rounded-xl border border-[var(--border)] bg-[var(--color-card)] p-5 shadow-sm">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-[var(--foreground)]">Category name</label>
            <input
              className={INPUT}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Transport"
            />
          </div>
          {error && <p className="text-sm text-[var(--destructive)]">{error}</p>}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setAdding(false)}
              className="rounded-lg bg-[var(--background)] px-4 py-2 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--muted)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-[var(--success)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--success)]/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save category"}
            </button>
          </div>
        </form>
      )}

      <div className="rounded-xl border border-[var(--border)] bg-[var(--color-card)] shadow-sm">
        <div className="divide-y divide-[var(--border)]">
          {rows.map((row) => (
            <div key={row.id} className="flex items-center gap-4 px-4 py-3 text-sm">
              <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${row.active ? "bg-[var(--success)]/10 text-[var(--success)]" : "bg-[var(--muted)] text-[var(--muted-foreground)]"}`}>
                {row.active ? <Check className="h-3 w-3" /> : <Circle className="h-3 w-3" />}
              </span>
              <span className={`font-medium ${row.active ? "text-[var(--foreground)]" : "text-[var(--muted-foreground)]"}`}>{row.name}</span>
              <span className="text-[var(--muted-foreground)] text-xs">{row.id}</span>
              {canManage && (
                <button
                  type="button"
                  onClick={() => toggleActive(row)}
                  className={`rounded-md px-2 py-1 text-xs font-medium transition-colors ${
                    row.active ? "bg-[var(--destructive)]/5 text-[var(--destructive)] hover:bg-[var(--destructive)]/10" : "bg-[var(--success)]/5 text-[var(--success)] hover:bg-[var(--success)]/10"
                  }`}
                >
                  {row.active ? "Hide" : "Show"}
                </button>
              )}
            </div>
          ))}
        </div>
        {rows.length === 0 && (
          <div className="px-4 py-8 text-center text-sm text-[var(--muted-foreground)]">
            No categories yet. Add one to use when recording expenses.
          </div>
        )}
      </div>
    </div>
  );
}
