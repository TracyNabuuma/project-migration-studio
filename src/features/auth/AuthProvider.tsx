import { useEffect, type ReactNode } from "react";
import { create } from "zustand";
import { supabase } from "@/integrations/supabase/client";

export interface User {
  id: string;
  email: string;
  name: string;
  /** null = signed in but the Owner has not granted a role yet. */
  role: "owner" | "manager" | null;
  farmName?: string;
  createdAt: string;
}

/** Shape the older screens read through `@/lib/store`. */
export interface LegacyUser {
  name: string;
  email: string;
  role: "Owner" | "Manager";
}

interface AuthState {
  user: User | null;
  legacyUser: LegacyUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  restore: () => Promise<void>;
}

async function loadUser(userId: string, email: string, createdAt: string): Promise<User> {
  const [{ data: profile }, { data: roles }] = await Promise.all([
    supabase.from("profiles").select("name").eq("id", userId).maybeSingle(),
    supabase.from("user_roles").select("role").eq("user_id", userId),
  ]);
  const list = (roles ?? []).map((r) => r.role);
  const role = list.includes("owner") ? "owner" : list.includes("manager") ? "manager" : null;
  return { id: userId, email, name: profile?.name || email.split("@")[0], role, createdAt };
}

function toLegacy(user: User | null): LegacyUser | null {
  if (!user || !user.role) return null;
  return { name: user.name, email: user.email, role: user.role === "owner" ? "Owner" : "Manager" };
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  legacyUser: null,
  token: null,
  loading: true,

  login: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
    await get().restore();
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, legacyUser: null, token: null, loading: false });
  },

  restore: async () => {
    const { data } = await supabase.auth.getSession();
    const session = data.session;
    if (!session) {
      set({ user: null, legacyUser: null, token: null, loading: false });
      return;
    }
    const user = await loadUser(session.user.id, session.user.email ?? "", session.user.created_at);
    set({ user, legacyUser: toLegacy(user), token: session.access_token, loading: false });
  },
}));

export function AuthProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Listener first, then the initial restore. Work is deferred out of the callback.
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      useAuthStore.setState({ token: session?.access_token ?? null });
      if (event === "SIGNED_OUT") {
        useAuthStore.setState({ user: null, legacyUser: null, loading: false });
      } else if (event === "SIGNED_IN" || event === "USER_UPDATED") {
        setTimeout(() => void useAuthStore.getState().restore(), 0);
      }
    });
    void useAuthStore.getState().restore();
    return () => sub.subscription.unsubscribe();
  }, []);
  return <>{children}</>;
}

export function useAuth() {
  return useAuthStore();
}
