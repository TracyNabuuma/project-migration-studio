import { createFileRoute } from "@tanstack/react-router";
import { PhotoGallery } from "@/features/photos/PhotoGallery";

export const Route = createFileRoute("/_app/photos")({
  head: () => ({
    meta: [
      { title: "Photos · Kuku Ledger" },
      { name: "description", content: "Flock and farm photos." },
      { property: "og:title", content: "Photos · Kuku Ledger" },
      { property: "og:description", content: "Flock and farm photos." },
    ],
  }),
  component: PhotoGallery,
});
