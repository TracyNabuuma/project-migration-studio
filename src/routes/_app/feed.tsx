import { createFileRoute } from "@tanstack/react-router";
import { FeedList } from "@/features/stock/FeedList";

export const Route = createFileRoute("/_app/feed")({
  head: () => ({
    meta: [
      { title: "Feed and inventory · Kuku Ledger" },
      { name: "description", content: "Feed stock, deliveries and usage." },
      { property: "og:title", content: "Feed and inventory · Kuku Ledger" },
      { property: "og:description", content: "Feed stock, deliveries and usage." },
    ],
  }),
  component: FeedList,
});
