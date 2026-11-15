import { Link } from "@/lib/router-compat";
import { ArrowLeft, Mail, Phone, Clock } from "lucide-react";
interface StatementRow {
  id: string;
  date: string;
  ref: string;
  type: "sale" | "payment";
  item: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  status?: string;
}

const SAMPLE: StatementRow[] = [
  { id: "s1", date: "2026-11-09", ref: "S001", type: "sale", item: "eggs", quantity: 120, unitPrice: 15000, amount: 1_800_000, status: "partly_paid" },
  { id: "p1", date: "2026-11-09", ref: "P001", type: "payment", item: "payment", quantity: 0, unitPrice: 0, amount: 800_000 },
  { id: "s2", date: "2026-10-28", ref: "S002", type: "sale", item: "eggs", quantity: 200, unitPrice: 14000, amount: 2_800_000, status: "paid" },
];

export function CustomerStatement() {

  const customer = SAMPLE.length ? { name: "Nakato Store", email: "nakato@example.com", phone: "+256 772 123 456", balance: 1_000_000, overdueDays: 12 } : null;

  return (
    <div className="space-y-6">
      <Link
        to="/customers"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to customers
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-[var(--foreground)]">
            {customer?.name ?? "Customer"}
          </h1>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            {customer?.email ? <span className="inline-flex items-center gap-1"><Mail className="h-3 w-3" />{customer.email}</span> : "No contact details"}
          </p>
          <p className="mt-0.5 text-sm text-[var(--muted-foreground)]">
            {customer?.phone ? <span className="inline-flex items-center gap-1"><Phone className="h-3 w-3" />{customer.phone}</span> : ""}
          </p>
        </div>

        {customer && (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--color-card)] px-4 py-3 shadow-sm">
            <p className="text-xs text-[var(--muted-foreground)]">Outstanding balance</p>
            <p className={`font-display text-xl font-semibold num ${customer.balance > 0 ? "text-[var(--destructive)]" : "text-[var(--success)]"}`}>
              UGX {customer.balance.toLocaleString()}
            </p>
            {customer.overdueDays > 0 && (
              <p className="mt-1 flex items-center gap-1 text-sm text-[var(--destructive)]">
                <Clock className="h-3.5 w-3.5" />
                {customer.overdueDays} days overdue
              </p>
            )}
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--color-card)] p-5 shadow-sm">
          <h2 className="mb-3 font-display text-lg font-semibold text-[var(--foreground)]">Statement</h2>
          <div className="space-y-1">
            {SAMPLE.map((row) => (
              <div key={row.id} className="flex items-center justify-between rounded-lg bg-[var(--background)] px-3 py-2 text-sm">
                <div>
                  <span className="font-medium text-[var(--foreground)]">{row.ref}</span>
                  <span className="ml-2 text-[var(--muted-foreground)]">{row.date}</span>
                </div>
                <div className="text-right">
                  <span className="block text-[var(--muted-foreground)]">{row.type === "sale" ? `${row.quantity} ${row.item}` : "Payment"}</span>
                  <span className={`font-medium num ${row.type === "sale" ? "text-[var(--foreground)]" : "text-[var(--success)]"}`}>
                    {row.type === "payment" ? "-" : "+"}{" "}
                    UGX {row.amount.toLocaleString()}
                  </span>
                  {row.status && row.type === "sale" && (
                    <span className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${row.status === "paid" ? "bg-[var(--success)]/10 text-[var(--success)]" : row.status === "partly_paid" ? "bg-[var(--warning)]/10 text-[var(--warning)]" : "bg-[var(--destructive)]/10 text-[var(--destructive)]"}`}>
                      {row.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--color-card)] p-5 shadow-sm">
          <h2 className="mb-3 font-display text-lg font-semibold text-[var(--foreground)]">Ageing</h2>
          <p className="mb-3 text-sm text-[var(--muted-foreground)]">How long each balance has been outstanding.</p>
          <div className="space-y-3">
            {[
              { label: "Current (0–30 days)", amount: 0 },
              { label: "1–30 days", amount: 0 },
              { label: "31–60 days", amount: 400_000 },
              { label: "61–90 days", amount: 600_000 },
              { label: "Over 90 days", amount: 0 },
            ].map((a) => (
              <div key={a.label} className="flex items-center justify-between rounded-lg bg-[var(--background)] px-3 py-2">
                <span className="text-sm text-[var(--muted-foreground)]">{a.label}</span>
                <span className="font-medium text-[var(--foreground)] num">
                  {a.amount === 0 ? "—" : `UGX ${a.amount.toLocaleString()}`}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-[var(--border)] pt-3">
            <span className="font-medium text-[var(--foreground)]">Total outstanding</span>
            <span className="font-display text-base font-semibold text-[var(--destructive)] num">
              UGX {customer?.balance.toLocaleString() ?? "0"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
