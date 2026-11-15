import { useState } from "react";
import { CheckCircle, Bell, AlertTriangle, Clock, X } from "lucide-react";
interface Alert {
  id: string;
  type: "info" | "warning" | "critical";
  message: string;
  time: string;
  read: boolean;
}

const SAMPLE: Alert[] = [
  { id: "a1", type: "critical", message: "Low feed stock: layer mash at 4 bags", time: "2026-11-10T08:12:00Z", read: false },
  { id: "a2", type: "warning", message: "Egg production down 8% vs last week for Kampala Layer 01", time: "2026-11-09T19:40:00Z", read: false },
  { id: "a3", type: "info", message: "Vaccine batch NV-2026-041 expires 2027-05-12", time: "2026-11-08T14:05:00Z", read: true },
  { id: "a4", type: "warning", message: "Two unpaid expense invoices from VetCare Uganda", time: "2026-11-07T11:20:00Z", read: true },
];

export function AlertsScreen() {
  const [alerts, setAlerts] = useState<Alert[]>(SAMPLE);

  const markRead = (id: string) =>
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, read: true } : a)));

  const dismiss = (id: string) => setAlerts((prev) => prev.filter((a) => a.id !== id));

  const pending = alerts.filter((a) => !a.read).length;
  const critical = alerts.filter((a) => a.type === "critical" && !a.read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-[var(--foreground)]">Alerts</h1>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Notifications about stock, production, payments, and reminders.
          </p>
        </div>
        {critical > 0 && (
          <span className="rounded-full bg-[var(--destructive)]/10 px-3 py-1 text-sm text-[var(--destructive)]">
            {critical} critical
          </span>
        )}
      </div>

      {pending > 0 && (
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--primary-foreground)] transition-colors hover:bg-[var(--secondary)]"
          onClick={() => setAlerts((prev) => prev.map((a) => ({ ...a, read: true })))}
        >
          <CheckCircle className="h-4 w-4" />
          Mark all as read ({pending})
        </button>
      )}

      <div className="space-y-3">
        {alerts.map((alert) => (
          <AlertCard key={alert.id} alert={alert} onMarkRead={() => markRead(alert.id)} onDismiss={() => dismiss(alert.id)} />
        ))}
      </div>

      {alerts.length === 0 && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--color-card)] p-8 text-center shadow-sm">
          <Bell className="mx-auto h-8 w-8 text-[var(--muted)]" />
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">No alerts right now.</p>
        </div>
      )}
    </div>
  );
}

function AlertCard({ alert, onMarkRead, onDismiss }: {
  alert: Alert;
  onMarkRead: () => void;
  onDismiss: () => void;
}) {
  const border = alert.type === "critical" ? "border-l-[var(--destructive)]" : alert.type === "warning" ? "border-l-[var(--warning)]" : "border-l-[var(--primary)]";

  return (
    <div className={`rounded-lg border border-[var(--border)] bg-[var(--color-card)] border-l-4 ${border} px-4 py-3 shadow-sm ${alert.read ? "opacity-60" : ""}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {alert.type === "critical" ? <AlertTriangle className="h-4 w-4 text-[var(--destructive)]" /> : alert.type === "warning" ? <Clock className="h-4 w-4 text-[var(--warning)]" /> : <Bell className="h-4 w-4 text-[var(--primary)]" />}
            <span className={`text-sm font-medium ${alert.type === "critical" ? "text-[var(--destructive)]" : alert.type === "warning" ? "text-[var(--warning)]" : "text-[var(--foreground)]"}`}>
              {alert.message}
            </span>
          </div>
          <p className="mt-1 text-xs text-[var(--muted-foreground)]">{timeAgo(alert.time)}</p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {!alert.read && (
            <button type="button" onClick={onMarkRead} className="rounded-md p-1 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)]">
              <CheckCircle className="h-4 w-4" />
            </button>
          )}
          <button type="button" onClick={onDismiss} className="rounded-md p-1 text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)]">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const h = Math.floor(mins / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}
