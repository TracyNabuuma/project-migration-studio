import { createFileRoute } from "@tanstack/react-router";
import { AnalyticsScreen } from "@/features/analytics/AnalyticsScreen";

export const Route = createFileRoute("/_app/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics · Kuku Ledger" },
      { name: "description", content: "Production and profit trends." },
      { property: "og:title", content: "Analytics · Kuku Ledger" },
      { property: "og:description", content: "Production and profit trends." },
    ],
  }),
  component: AnalyticsScreen,
});
