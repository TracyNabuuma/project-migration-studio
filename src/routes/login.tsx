import { createFileRoute } from "@tanstack/react-router";
import { LoginPage as Page } from "@/features/auth/LoginPage";
import { Navigate } from "@tanstack/react-router";
import { useAuth } from "@/features/auth/AuthProvider";

function LoginPage() {
  const { user, loading } = useAuth();
  if (!loading && user) return <Navigate to="/" />;
  return <Page />;
}

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in · Kuku Ledger" },
      { name: "description", content: "Sign in to Kuku Ledger, the poultry farm ledger." },
      { property: "og:title", content: "Sign in · Kuku Ledger" },
      { property: "og:description", content: "Sign in to Kuku Ledger, the poultry farm ledger." },
    ],
  }),
  ssr: false,
  component: LoginPage,
});
