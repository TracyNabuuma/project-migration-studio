import { createFileRoute } from "@tanstack/react-router";
import { SettingsScreen } from "@/features/settings/SettingsScreen";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({
    meta: [
      { title: "Settings · Kuku Ledger" },
      { name: "description", content: "Farm and account settings." },
      { property: "og:title", content: "Settings · Kuku Ledger" },
      { property: "og:description", content: "Farm and account settings." },
    ],
  }),
  component: SettingsScreen,
});
