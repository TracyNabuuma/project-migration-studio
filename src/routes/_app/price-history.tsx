import { createFileRoute } from "@tanstack/react-router";
import { PriceHistoryScreen } from "@/features/price-history/PriceHistoryScreen";

export const Route = createFileRoute("/_app/price-history")({
  head: () => ({
    meta: [
      { title: "Price history · Kuku Ledger" },
      { name: "description", content: "Egg and bird prices over time." },
      { property: "og:title", content: "Price history · Kuku Ledger" },
      { property: "og:description", content: "Egg and bird prices over time." },
    ],
  }),
  component: PriceHistoryScreen,
});
