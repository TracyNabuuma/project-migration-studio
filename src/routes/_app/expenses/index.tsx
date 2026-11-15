import { createFileRoute } from "@tanstack/react-router";
import { ExpensesList } from "@/features/expenses/ExpensesList";

export const Route = createFileRoute("/_app/expenses/")({
  head: () => ({
    meta: [
      { title: "Expenses · Kuku Ledger" },
      { name: "description", content: "Farm spending by category and supplier." },
      { property: "og:title", content: "Expenses · Kuku Ledger" },
      { property: "og:description", content: "Farm spending by category and supplier." },
    ],
  }),
  component: ExpensesList,
});
