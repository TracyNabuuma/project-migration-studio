import { createFileRoute } from "@tanstack/react-router";
import { SalesList } from "@/features/sales/SalesList";

export const Route = createFileRoute("/_app/sales/")({
  head: () => ({
    meta: [
      { title: "Sales · Kuku Ledger" },
      { name: "description", content: "Egg and bird sales with payment status." },
      { property: "og:title", content: "Sales · Kuku Ledger" },
      { property: "og:description", content: "Egg and bird sales with payment status." },
    ],
  }),
  component: SalesList,
});
