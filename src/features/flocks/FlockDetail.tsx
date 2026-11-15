import { useAuth } from "../auth/AuthProvider";
import { Link } from "@/lib/router-compat";
import { ArrowLeft, Plus, Egg, Trash2, Scale } from "lucide-react";
interface EggRecord {
  id: string;
  date: string;
  trays: number;
  gradeAMix: number;
  gradeBMix: number;
  gradeCMix: number;
  remarks: string;
}

interface MortalityRecord {
  id: string;
  date: string;
  count: number;
  cause: string;
}

interface WeightSample {
  id: string;
  date: string;
  avgKg: number;
  minKg: number;
  maxKg: number;
}

export function FlockDetail() {
  const { user } = useAuth();
  const canManage = user?.role === "owner" || user?.role === "manager";

  return (
    <div className="space-y-6">
      <Link
        to="/flocks"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to flocks
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-[var(--foreground)]">Kampala Layer 01</h1>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            ISA Brown · received 2026-01-10 · 500 birds
          </p>
        </div>
        {canManage && (
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--primary-foreground)] transition-colors hover:bg-[var(--secondary)]"
          >
            <Plus className="h-4 w-4" />
            Record
          </button>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--color-card)] p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-[var(--foreground)]">Flock overview</h2>
            <span className="rounded-full bg-[var(--success)]/10 px-2 py-0.5 text-xs font-medium text-[var(--success)]">Active</span>
          </div>
          <dl className="grid gap-3 text-sm">
            <div className="flex justify-between"><dt className="text-[var(--muted-foreground)]">Birds received</dt><dd className="font-medium text-[var(--foreground)] num">500</dd></div>
            <div className="flex justify-between"><dt className="text-[var(--muted-foreground)]">Current count</dt><dd className="font-medium text-[var(--foreground)] num">488</dd></div>
            <div className="flex justify-between"><dt className="text-[var(--muted-foreground)]">Age (days)</dt><dd className="font-medium text-[var(--foreground)] num">124</dd></div>
            <div className="flex justify-between"><dt className="text-[var(--muted-foreground)]">Target weight</dt><dd className="font-medium text-[var(--foreground)] num">2.0 kg</dd></div>
            <div className="flex justify-between"><dt className="text-[var(--muted-foreground)]">Current weight</dt><dd className="font-medium text-[var(--foreground)] num">1.8 kg</dd></div>
          </dl>
        </div>

        <div className="space-y-4">
          <RecordCard
            title="Eggs"
            icon={<Egg className="h-4 w-4" />}
            rows={eggRows}
            onManage={() => {}}
            canManage={canManage}
          />
          <RecordCard
            title="Mortality"
            icon={<Trash2 className="h-4 w-4" />}
            rows={mortalityRows}
            onManage={() => {}}
            canManage={canManage}
          />
          <RecordCard
            title="Weights"
            icon={<Scale className="h-4 w-4" />}
            rows={weightRows}
            onManage={() => {}}
            canManage={canManage}
          />
        </div>
      </div>
    </div>
  );
}

interface RecordCardProps {
  title: string;
  icon: React.ReactNode;
  rows: { id: string; date: string }[];
  onManage: () => void;
  canManage: boolean;
}

function RecordCard({ title, icon, rows, onManage, canManage }: RecordCardProps) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--color-card)] p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-[var(--muted)] p-1.5 text-[var(--muted-foreground)]">{icon}</div>
          <h2 className="font-display text-base font-semibold text-[var(--foreground)]">{title}</h2>
        </div>
        {canManage && (
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-md bg-[var(--background)] px-2 py-1 text-xs font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--muted)]"
            onClick={onManage}
          >
            <Plus className="h-3.5 w-3.5" />
            Add
          </button>
        )}
      </div>
      <div className="space-y-2">
        {rows.map((r) => (
          <RecordRow key={r.id} row={r} />
        ))}
      </div>
    </div>
  );
}

function RecordRow({ row }: { row: { id: string; date: string } }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-[var(--background)] px-3 py-2 text-sm">
      <span className="font-medium text-[var(--foreground)]">{row.date}</span>
      <button
        type="button"
        className="rounded-md text-[var(--muted-foreground)] transition-colors hover:text-[var(--destructive)]"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

const eggRows: EggRecord[] = [
  { id: "e1", date: "2026-11-09", trays: 234, gradeAMix: 62, gradeBMix: 28, gradeCMix: 10, remarks: "" },
];
const mortalityRows: MortalityRecord[] = [
  { id: "m1", date: "2026-11-07", count: 2, cause: "Disease" },
];
const weightRows: WeightSample[] = [
  { id: "w1", date: "2026-11-09", avgKg: 1.8, minKg: 1.5, maxKg: 2.2 },
];
