import { createFileRoute } from "@tanstack/react-router";
import { VaccinationList } from "@/features/health/VaccinationList";

export const Route = createFileRoute("/_app/vaccination")({
  head: () => ({
    meta: [
      { title: "Vaccination · Kuku Ledger" },
      { name: "description", content: "Vaccination schedule per flock." },
      { property: "og:title", content: "Vaccination · Kuku Ledger" },
      { property: "og:description", content: "Vaccination schedule per flock." },
    ],
  }),
  component: VaccinationList,
});
