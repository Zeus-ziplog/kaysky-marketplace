import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Mail, Lock } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — KAYSKY Market" }] }),
  component: LoginPage,
});

function LoginPage() {
  const nav = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const google = async () => {
    setBusy(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) {
      toast.error(error.message);
    }
    setBusy(false);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    if (mode === "up") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin },
      });
      if (error) toast.error(error.message);
      else {
        toast.success("Check your email to confirm");
        setMode("in");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) toast.error(error.message);
      else {
        toast.success("Signed in");
        nav({ to: "/" });
      }
    }
    setBusy(false);
  };

  return (
    <div className="grid min-h-screen place-items-center px-4">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-foreground/70 hover:text-primary"
        >
          <ArrowLeft className="size-4" /> Back
        </Link>
        <div className="glass-strong rounded-3xl p-8">
          <h1 className="font-display text-5xl leading-none">
            {mode === "in" ? "Welcome back" : "Join the drop"}
          </h1>
          <p className="mt-2 text-sm text-foreground/70">
            {mode === "in"
              ? "Sign in to buy & track orders."
              : "Create an account to shop."}
          </p>

          <button
            onClick={google}
            disabled={busy}
            className="mt-6 flex w-full items-center justify-center gap-3 rounded-full bg-white px-6 py-3 text-sm font-bold uppercase tracking-widest text-black hover:bg-white/90 disabled:opacity-50"
          >
            <GoogleIcon /> Continue with Google
          </button>

          <div className="my-6 flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-foreground/50">
            <span className="h-px flex-1 bg-border" />or
            <span className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={submit} className="space-y-3">
            <Field
              icon={<Mail className="size-4" />}
              type="email"
              placeholder="Email"
              value={email}
              onChange={setEmail}
            />
            <Field
              icon={<Lock className="size-4" />}
              type="password"
              placeholder="Password"
              value={password}
              onChange={setPassword}
            />
            <button
              disabled={busy}
              className="btn-neon w-full rounded-full px-6 py-3 text-sm disabled:opacity-50"
            >
              {mode === "in" ? "Sign in" : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-foreground/70">
            {mode === "in" ? "New to KAYSKY?" : "Already have an account?"}{" "}
            <button
              onClick={() => setMode(mode === "in" ? "up" : "in")}
              className="font-bold text-primary underline-offset-2 hover:underline"
            >
              {mode === "in" ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({
  icon,
  type,
  placeholder,
  value,
  onChange,
}: {
  icon: React.ReactNode;
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="glass flex items-center gap-3 rounded-full px-4 py-3 focus-within:ring-2 focus-within:ring-primary">
      <span className="text-foreground/60">{icon}</span>
      <input
        type={type}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-sm outline-none placeholder:text-foreground/50"
      />
    </label>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" className="size-5">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.4 4 9.9 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35 26.7 36 24 36c-5.2 0-9.7-3.1-11.3-8l-6.5 5C9.9 39.6 16.4 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.6l6.2 5.2c-.4.4 6.7-4.9 6.7-14.8 0-1.2-.1-2.4-.4-3.5z"
      />
    </svg>
  );
}