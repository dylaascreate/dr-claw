import { createFileRoute, useNavigate, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import logo from "@/assets/dr-claw-logo.png";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  component: Login,
  head: () => ({
    meta: [
      { title: "Dr. Claw Health AI — Login" },
      { name: "description", content: "Sign in to Dr. Claw Health AI." },
    ],
  }),
});

function Login() {
  const navigate = useNavigate();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    router.preloadRoute({ to: "/dashboard" }).catch(() => {});
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard" });
    });
  }, [navigate, router]);


  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    navigate({ to: "/dashboard" });
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="relative mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16">
        <div className="mb-8 flex flex-col items-center text-center">
          <img src={logo} alt="Dr. Claw Health AI" className="h-40 w-40 object-contain" />
          <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign in to continue to your dashboard.
          </p>
        </div>

        <form
          onSubmit={submit}
          className="rounded-lg border border-border/60 bg-card/70 p-6 shadow-claw backdrop-blur"
        >
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            className="mt-2 w-full rounded-md border border-input bg-background/60 px-3 py-2 text-sm text-foreground outline-none transition focus:border-accent focus:shadow-glow"
          />

          <label className="mt-4 block text-sm font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            className="mt-2 w-full rounded-md border border-input bg-background/60 px-3 py-2 text-sm text-foreground outline-none transition focus:border-accent focus:shadow-glow"
          />

          <button
            type="submit"
            disabled={loading}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-accent-foreground transition hover:brightness-110 active:translate-y-px disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Login"}
          </button>

          {error && (
            <p className="mt-4 text-center text-xs text-destructive">{error}</p>
          )}

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="font-medium text-accent hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
