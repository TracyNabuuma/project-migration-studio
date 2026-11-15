import { createFileRoute } from "@tanstack/react-router";
import { EquipmentList } from "@/features/equipment/EquipmentList";

export const Route = createFileRoute("/_app/equipment")({
  head: () => ({
    meta: [
      { title: "Equipment · Kuku Ledger" },
      { name: "description", content: "Farm equipment and maintenance." },
      { property: "og:title", content: "Equipment · Kuku Ledger" },
      { property: "og:description", content: "Farm equipment and maintenance." },
    ],
  }),
  component: EquipmentList,
});
