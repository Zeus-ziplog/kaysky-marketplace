import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type AuthCtx = {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
};

const Ctx = createContext<AuthCtx>({
  user: null, session: null, isAdmin: false, loading: true, signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, s) => {
      setSession(s);
      
      // Sync auth state to cookies so server functions/loaders can read the session
      if (typeof window !== "undefined") {
        if (s) {
          document.cookie = `sb-access-token=${s.access_token}; path=/; max-age=${s.expires_in}; SameSite=Lax; Secure`;
          document.cookie = `sb-refresh-token=${s.refresh_token}; path=/; max-age=604800; SameSite=Lax; Secure`;
        } else {
          document.cookie = "sb-access-token=; path=/; max-age=0; path=/;";
          document.cookie = "sb-refresh-token=; path=/; max-age=0; path=/;";
        }
      }

      if (s?.user) {
        supabase.from("user_roles").select("role").eq("user_id", s.user.id)
          .then(({ data }) => {
            setIsAdmin(Boolean(data?.some((r) => r.role === "admin")));
            setLoading(false);
          });
      } else {
        setIsAdmin(false);
        setLoading(false);
      }
    });

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session?.user) {
        supabase.from("user_roles").select("role").eq("user_id", data.session.user.id)
          .then(({ data: roles }) => {
            setIsAdmin(Boolean(roles?.some((r) => r.role === "admin")));
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    if (typeof window !== "undefined") {
      document.cookie = "sb-access-token=; path=/; max-age=0; path=/;";
      document.cookie = "sb-refresh-token=; path=/; max-age=0; path=/;";
    }
  };

  return (
    <Ctx.Provider value={{ user: session?.user ?? null, session, isAdmin, loading, signOut }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => useContext(Ctx);