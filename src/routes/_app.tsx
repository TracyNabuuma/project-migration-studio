import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";
import { AppShell } from "@/components/farm/AppShell";
import { useAuth } from "@/features/auth/AuthProvider";

// The farm app reads its offline store (IndexedDB) in the browser, so it renders client-side only.
export const Route = createFileRoute("/_app")({
  ssr: false,
  component: AppLayout,
});

function AppLayout() {
  const { user, loading, logout } = useAuth();
  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">Loading…</div>;
  }
  if (!user) return <Navigate to="/login" replace />;
  if (!user.role) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="max-w-sm text-center">
          <h1 className="font-display text-xl font-semibold">Waiting for access</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            You're signed in as {user.email}. Ask the farm owner to give you access, then sign in again.
          </p>
          <button onClick={() => void logout()} className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground">
            Sign out
          </button>
        </div>
      </div>
    );
  }
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
