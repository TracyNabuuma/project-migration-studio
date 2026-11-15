import { createFileRoute } from "@tanstack/react-router";
import { Dashboard } from "@/features/dashboard/Dashboard";

export const Route = createFileRoute("/_app/")({
  head: () => ({
    meta: [
      { title: "Farm overview · Kuku Ledger" },
      { name: "description", content: "Today's eggs, birds, money and alerts across your poultry farm." },
      { property: "og:title", content: "Farm overview · Kuku Ledger" },
      { property: "og:description", content: "Today's eggs, birds, money and alerts across your poultry farm." },
    ],
  }),
  component: Dashboard,
});
