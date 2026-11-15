import { useAuth } from "./AuthProvider";
import { useState, FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { EyeOff, Eye, Loader2 } from "lucide-react";
export function LoginPage() {
  const { login, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup" | "reset">("signin");
  const [notice, setNotice] = useState("");


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const addr = email.trim().toLowerCase();
      if (mode === "signin") {
        await login(addr, password);
      } else if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: addr,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        setNotice("Check your email to confirm your account, then sign in.");
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(addr, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        setNotice("We sent a link to set a new password. Check your email.");
      }
    } catch (err: any) {
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-background)] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--primary)] text-[var(--primary-foreground)]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9l6-6 6 6" />
              <path d="M4 13h16" />
              <path d="M8 17h8" />
            </svg>
          </div>
          <h1 className="font-display text-2xl font-semibold text-[var(--foreground)]">
            Kuku Ledger
          </h1>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            {mode === "signin" ? "Sign in to manage your farm" : mode === "signup" ? "Create your account" : "Set a new password by email"}
          </p>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--color-card)] p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-[var(--input)] bg-[var(--color-background)] px-3 py-2 text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--ring)] focus:outline-none"
                placeholder="you@farm.co"
              />
            </div>

            {mode !== "reset" && <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">
                Password
              </label>
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-[var(--input)] bg-[var(--color-background)] px-3 py-2 pr-10 text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--ring)] focus:outline-none"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]"
                  onClick={() => setShow(!show)}
                  aria-label={show ? "Hide password" : "Show password"}
                >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>}

            {notice && <p className="text-sm text-[var(--primary)]">{notice}</p>}
            {error && (
              <p className="text-sm text-[var(--destructive)]">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center rounded-lg bg-[var(--primary)] px-4 py-2.5 text-sm font-medium text-[var(--primary-foreground)] transition-colors hover:bg-[var(--secondary)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : mode === "signin" ? "Sign in" : mode === "signup" ? "Create account" : "Send link"}
            </button>
          </form>

          {mode !== "reset" && (
            <button
              type="button"
              onClick={async () => {
                setError("");
                const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
                if (result.error) setError(result.error.message ?? "Google sign-in failed");
              }}
              className="mt-3 flex w-full items-center justify-center rounded-lg border border-[var(--input)] px-4 py-2.5 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--muted)]"
            >
              Continue with Google
            </button>
          )}
          <div className="mt-4 flex flex-col items-center gap-1 text-xs text-[var(--muted-foreground)]">
            {mode === "signin" && (
              <>
                <button type="button" className="underline" onClick={() => { setMode("reset"); setNotice(""); setError(""); }}>
                  Moving from the old Kuku Ledger, or forgot your password? Set a new one
                </button>
                <button type="button" className="underline" onClick={() => { setMode("signup"); setNotice(""); setError(""); }}>
                  New here? Create an account
                </button>
              </>
            )}
            {mode !== "signin" && (
              <button type="button" className="underline" onClick={() => { setMode("signin"); setNotice(""); setError(""); }}>
                Back to sign in
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
