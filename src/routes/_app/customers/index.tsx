import { createFileRoute } from "@tanstack/react-router";
import { CustomersList } from "@/features/customers/CustomersList";

export const Route = createFileRoute("/_app/customers/")({
  head: () => ({
    meta: [
      { title: "Customers · Kuku Ledger" },
      { name: "description", content: "Customers and what they owe." },
      { property: "og:title", content: "Customers · Kuku Ledger" },
      { property: "og:description", content: "Customers and what they owe." },
    ],
  }),
  component: CustomersList,
});
