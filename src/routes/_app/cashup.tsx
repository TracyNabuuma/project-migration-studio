import { createFileRoute } from "@tanstack/react-router";
import { CashupScreen } from "@/features/cash-up/CashupScreen";

export const Route = createFileRoute("/_app/cashup")({
  head: () => ({
    meta: [
      { title: "Cash-up · Kuku Ledger" },
      { name: "description", content: "Daily cash count against recorded sales and spending." },
      { property: "og:title", content: "Cash-up · Kuku Ledger" },
      { property: "og:description", content: "Daily cash count against recorded sales and spending." },
    ],
  }),
  component: CashupScreen,
});
