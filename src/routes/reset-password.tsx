import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Set a new password · Kuku Ledger" },
      { name: "description", content: "Choose a new password for your Kuku Ledger account." },
      { property: "og:title", content: "Set a new password · Kuku Ledger" },
      { property: "og:description", content: "Choose a new password for your Kuku Ledger account." },
    ],
  }),
  component: ResetPassword,
});

function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const { error } = await supabase.auth.updateUser({ password });
    setSaving(false);
    if (error) return setError(error.message);
    void navigate({ to: "/" });
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 rounded-xl border bg-card p-6">
        <h1 className="font-display text-xl font-semibold">Set a new password</h1>
        <input
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="New password"
          className="w-full rounded-lg border border-input bg-background px-3 py-2"
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
        <button disabled={saving} className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-60">
          {saving ? "Saving…" : "Save password"}
        </button>
      </form>
    </div>
  );
}
