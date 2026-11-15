import { createFileRoute } from "@tanstack/react-router";
import { HealthList } from "@/features/health/HealthList";

export const Route = createFileRoute("/_app/health")({
  head: () => ({
    meta: [
      { title: "Health · Kuku Ledger" },
      { name: "description", content: "Flock health, treatments and visits." },
      { property: "og:title", content: "Health · Kuku Ledger" },
      { property: "og:description", content: "Flock health, treatments and visits." },
    ],
  }),
  component: HealthList,
});
