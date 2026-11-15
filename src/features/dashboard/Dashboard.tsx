import { Wallet, Egg, Users, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";
export function Dashboard() {

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-[var(--foreground)]">
          Overview
        </h1>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Good {timeGreeting()}. Here is how the farm is tracking today.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card icon={<Wallet className="h-5 w-5" />} label="Cash on hand" value="UGX 12,450,000" change="+2.1%" up />
        <Card icon={<Egg className="h-5 w-5" />} label="Eggs today" value="2,340" change="+8%" up />
        <Card icon={<Users className="h-5 w-5" />} label="Active flocks" value="8" change="2 closed" neutral />
        <Card icon={<AlertTriangle className="h-5 w-5" />} label="Pending actions" value="3" change="2 need cash-up" warn />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section>
          <h2 className="mb-3 font-display text-lg font-semibold text-[var(--foreground)]">Flocks</h2>
          <FlockRow name="Kampala Layer 01" status="active" birds={480} ageDays={124} />
          <FlockRow name="Entebbe Broiler 02" status="active" birds={620} ageDays={32} />
          <FlockRow name="Jinja Layer 03" status="closed" birds={0} ageDays={0} />
        </section>

        <section>
          <h2 className="mb-3 font-display text-lg font-semibold text-[var(--foreground)]">Recent sales</h2>
          <p className="text-sm text-[var(--muted-foreground)]">
            Latest recorded sales appear here once sales screens are wired to data.
          </p>
        </section>
      </div>
    </div>
  );
}

function Card({ icon, label, value, change, up, warn }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  change?: string;
  up?: boolean;
  neutral?: boolean;
  warn?: boolean;
}) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--color-card)] p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-[var(--muted-foreground)]">{label}</p>
          <p className="mt-1 font-display text-2xl font-semibold text-[var(--foreground)] num">{value}</p>
        </div>
        <div className="rounded-full bg-[var(--muted)] p-2 text-[var(--muted-foreground)]">{icon}</div>
      </div>
      {change && (
        <p className={`mt-2 flex items-center text-sm ${up ? "text-[var(--success)]" : warn ? "text-[var(--destructive)]" : "text-[var(--muted-foreground)]"}`}>
          {up && <TrendingUp className="h-3.5 w-3.5 mr-1" />}
          {warn && <TrendingDown className="h-3.5 w-3.5 mr-1" />}
          {change}
        </p>
      )}
    </div>
  );
}

function FlockRow({ name, status, birds, ageDays }: {
  name: string;
  status: "active" | "closed";
  birds: number;
  ageDays: number;
}) {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--color-background)] px-3 py-2.5 text-sm">
      <div className="flex items-center justify-between">
        <span className="font-medium text-[var(--foreground)]">{name}</span>
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${status === "active" ? "bg-[var(--success)]/10 text-[var(--success)]" : "bg-[var(--muted)] text-[var(--muted-foreground)]"}`}>
          {status}
        </span>
      </div>
      <div className="mt-1 flex gap-4 text-[var(--muted-foreground)]">
        {birds > 0 && <span>{birds.toLocaleString()} birds</span>}
        {ageDays > 0 && <span>{ageDays} days</span>}
      </div>
    </div>
  );
}

function timeGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}
