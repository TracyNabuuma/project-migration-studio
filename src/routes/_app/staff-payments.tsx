import { createFileRoute } from "@tanstack/react-router";
import { StaffPaymentsScreen } from "@/features/staff-payments/StaffPaymentsScreen";

export const Route = createFileRoute("/_app/staff-payments")({
  head: () => ({
    meta: [
      { title: "Staff payments · Kuku Ledger" },
      { name: "description", content: "Wages and payments to farm workers." },
      { property: "og:title", content: "Staff payments · Kuku Ledger" },
      { property: "og:description", content: "Wages and payments to farm workers." },
    ],
  }),
  component: StaffPaymentsScreen,
});
