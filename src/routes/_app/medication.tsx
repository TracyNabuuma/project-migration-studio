import { createFileRoute } from "@tanstack/react-router";
import { MedicationList } from "@/features/health/MedicationList";

export const Route = createFileRoute("/_app/medication")({
  head: () => ({
    meta: [
      { title: "Medication · Kuku Ledger" },
      { name: "description", content: "Medicine stock and treatments." },
      { property: "og:title", content: "Medication · Kuku Ledger" },
      { property: "og:description", content: "Medicine stock and treatments." },
    ],
  }),
  component: MedicationList,
});
