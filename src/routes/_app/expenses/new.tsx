import { createFileRoute } from "@tanstack/react-router";
import { ExpensesNew } from "@/features/expenses/ExpensesNew";

export const Route = createFileRoute("/_app/expenses/new")({
  head: () => ({
    meta: [
      { title: "New expense · Kuku Ledger" },
      { name: "description", content: "Record a new farm expense." },
      { property: "og:title", content: "New expense · Kuku Ledger" },
      { property: "og:description", content: "Record a new farm expense." },
    ],
  }),
  component: ExpensesNew,
});
