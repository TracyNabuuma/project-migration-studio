import { createFileRoute } from "@tanstack/react-router";
import { ReportsScreen } from "@/features/reports/ReportsScreen";

export const Route = createFileRoute("/_app/reports")({
  head: () => ({
    meta: [
      { title: "Reports · Kuku Ledger" },
      { name: "description", content: "Printable farm reports." },
      { property: "og:title", content: "Reports · Kuku Ledger" },
      { property: "og:description", content: "Printable farm reports." },
    ],
  }),
  component: ReportsScreen,
});
