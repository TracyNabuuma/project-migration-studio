import { createFileRoute } from "@tanstack/react-router";
import { FlocksList } from "@/features/flocks/FlocksList";

export const Route = createFileRoute("/_app/flocks/")({
  head: () => ({
    meta: [
      { title: "Flocks · Kuku Ledger" },
      { name: "description", content: "All layer and broiler flocks with live counts and health." },
      { property: "og:title", content: "Flocks · Kuku Ledger" },
      { property: "og:description", content: "All layer and broiler flocks with live counts and health." },
    ],
  }),
  component: FlocksList,
});
