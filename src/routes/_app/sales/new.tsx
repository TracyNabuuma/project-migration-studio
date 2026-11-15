import { createFileRoute } from "@tanstack/react-router";
import { SalesNew } from "@/features/sales/SalesNew";

export const Route = createFileRoute("/_app/sales/new")({
  head: () => ({
    meta: [
      { title: "New sale · Kuku Ledger" },
      { name: "description", content: "Record a new egg or bird sale." },
      { property: "og:title", content: "New sale · Kuku Ledger" },
      { property: "og:description", content: "Record a new egg or bird sale." },
    ],
  }),
  component: SalesNew,
});
