import { createFileRoute } from "@tanstack/react-router";
import { DailyReportWizard } from "@/features/daily-operations/DailyReportWizard";

export const Route = createFileRoute("/_app/daily")({
  head: () => ({
    meta: [
      { title: "Daily operations · Kuku Ledger" },
      { name: "description", content: "Record today's eggs, deaths, feed and water per flock." },
      { property: "og:title", content: "Daily operations · Kuku Ledger" },
      { property: "og:description", content: "Record today's eggs, deaths, feed and water per flock." },
    ],
  }),
  component: DailyReportWizard,
});
