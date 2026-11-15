import { createFileRoute } from "@tanstack/react-router";
import { SuppliersList } from "@/features/expenses/SuppliersList";

export const Route = createFileRoute("/_app/suppliers")({
  head: () => ({
    meta: [
      { title: "Suppliers · Kuku Ledger" },
      { name: "description", content: "Feed, chick and medicine suppliers." },
      { property: "og:title", content: "Suppliers · Kuku Ledger" },
      { property: "og:description", content: "Feed, chick and medicine suppliers." },
    ],
  }),
  component: SuppliersList,
});
