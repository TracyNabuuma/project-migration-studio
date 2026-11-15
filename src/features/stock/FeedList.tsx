import { useAuth } from "../auth/AuthProvider";
import { useState } from "react";
import { Plus } from "lucide-react";
interface FeedRow {
  id: string;
  date: string;
  type: "layer_mash" | "broiler_feed" | "chick_mash";
  quantityKg: number;
  pricePerKg: number;
  supplier: string;
  status: "paid" | "partly_paid" | "unsettled";
}

const SAMPLE: FeedRow[] = [
  { id: "fp-1", date: "2026-11-08", type: "layer_mash", quantityKg: 200, pricePerKg: 1_200, supplier: "Kuku Feeds Ltd", status: "partly_paid" },
  { id: "fp-2", date: "2026-11-01", type: "broiler_feed", quantityKg: 150, pricePerKg: 1_250, supplier: "Kuku Feeds Ltd", status: "paid" },
  { id: "fp-3", date: "2026-10-25", type: "chick_mash", quantityKg: 100, pricePerKg: 1_300, supplier: "Kuku Feeds Ltd", status: "paid" },
];

export function FeedList() {
  const { user } = useAuth();
  const canManage = user?.role === "owner" || user?.role === "manager";
  const [filter, setFilter] = useState("all");

  const totalKg = SAMPLE.reduce((s, r) => s + r.quantityKg, 0);
  const totalCost = SAMPLE.reduce((s, r) => s + r.quantityKg * r.pricePerKg, 0);
  const avgPricePerKg = totalKg > 0 ? totalCost / totalKg : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-[var(--foreground)]">Feed</h1>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Track feed purchases and usage in kg. Cost per kg feeds FCR and feed-cost analytics.
          </p>
        </div>
        {canManage && (
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--primary-foreground)] transition-colors hover:bg-[var(--secondary)]"
          >
            <Plus className="h-4 w-4" />
            Add purchase
          </button>
        )}
      </div>

      <div className="flex items-center gap-3">
        <select
          className="rounded-lg border border-[var(--input)] bg-[var(--color-background)] py-2 px-3 text-sm text-[var(--foreground)] focus:border-[var(--ring)] focus:outline-none"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All types</option>
          <option value="layer_mash">Layer mash</option>
          <option value="broiler_feed">Broiler feed</option>
          <option value="chick_mash">Chick mash</option>
        </select>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--color-card)] shadow-sm">
        <div className="divide-y divide-[var(--border)]">
          <div className="bg-[var(--muted)] px-4 py-2 text-left text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wide">
            <div className="flex items-center gap-2">
              <span>Date</span>
              <span>Type</span>
              <span className="hidden sm:inline">Supplier</span>
              <span className="hidden md:inline">Qty (kg)</span>
              <span className="hidden lg:inline">Price / kg</span>
              <span>Total</span>
              <span className="hidden sm:inline">Status</span>
            </div>
          </div>
          {SAMPLE.map((row) => (
            <div key={row.id} className="flex items-center gap-4 px-4 py-3 text-sm">
              <span className="text-[var(--muted-foreground)]">{row.date}</span>
              <span className="font-medium text-[var(--foreground)]">{row.type.replace("_", " ")}</span>
              <span className="hidden sm:inline text-[var(--muted-foreground)]">{row.supplier}</span>
              <span className="hidden md:inline text-[var(--muted-foreground)] num">{row.quantityKg}</span>
              <span className="hidden lg:inline text-[var(--muted-foreground)] num">UGX {row.pricePerKg.toLocaleString()}</span>
              <span className="font-medium text-[var(--foreground)] num">UGX {(row.quantityKg * row.pricePerKg).toLocaleString()}</span>
              <span className="ml-auto hidden sm:inline">
                <StatusBadge status={row.status} />
              </span>
            </div>
          ))}
        </div>
        {SAMPLE.length === 0 && (
          <div className="px-4 py-8 text-center text-sm text-[var(--muted-foreground)]">
            No feed purchases yet. Add your first purchase to start tracking feed costs.
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3 rounded-xl border border-[var(--border)] bg-[var(--color-card)] p-5 shadow-sm">
        <div className="text-center">
          <p className="text-sm text-[var(--muted-foreground)]">Total feed purchased</p>
          <p className="mt-1 font-display text-2xl font-semibold text-[var(--foreground)] num">{totalKg.toLocaleString()} kg</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-[var(--muted-foreground)]">Average price per kg</p>
          <p className="mt-1 font-display text-2xl font-semibold text-[var(--foreground)] num">
            UGX {Math.round(avgPricePerKg).toLocaleString()}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-[var(--muted-foreground)]">Total feed cost</p>
          <p className="mt-1 font-display text-2xl font-semibold text-[var(--foreground)] num">
            UGX {totalCost.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: FeedRow["status"] }) {
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${status === "paid" ? "bg-[var(--success)]/10 text-[var(--success)]" : status === "partly_paid" ? "bg-[var(--warning)]/10 text-[var(--warning)]" : "bg-[var(--destructive)]/10 text-[var(--destructive)]"}`}>
      {status === "partly_paid" ? "Partly paid" : status}
    </span>
  );
}
