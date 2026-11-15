import { createFileRoute } from "@tanstack/react-router";
import { AlertsScreen } from "@/features/alerts/AlertsScreen";

export const Route = createFileRoute("/_app/alerts")({
  head: () => ({
    meta: [
      { title: "Alerts · Kuku Ledger" },
      { name: "description", content: "Warnings about mortality, stock and payments." },
      { property: "og:title", content: "Alerts · Kuku Ledger" },
      { property: "og:description", content: "Warnings about mortality, stock and payments." },
    ],
  }),
  component: AlertsScreen,
});
