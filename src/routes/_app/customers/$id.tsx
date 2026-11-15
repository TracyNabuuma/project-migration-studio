import { createFileRoute } from "@tanstack/react-router";
import { CustomerStatement } from "@/features/customers/CustomerStatement";

export const Route = createFileRoute("/_app/customers/$id")({
  head: () => ({
    meta: [
      { title: "Customer statement · Kuku Ledger" },
      { name: "description", content: "Sales and payments for one customer." },
      { property: "og:title", content: "Customer statement · Kuku Ledger" },
      { property: "og:description", content: "Sales and payments for one customer." },
    ],
  }),
  component: CustomerStatement,
});
