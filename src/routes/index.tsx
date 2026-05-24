import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import logo from "@/assets/dr-claw-logo.png";

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
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<null | "deny">(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && password) {
      setTimeout(() => navigate({ to: "/dashboard" }), 300);
    } else {
      setStatus("deny");
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="relative mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16">
        <div className="mb-8 flex flex-col items-center text-center">
          <img
            src={logo}
            alt="Dr. Claw Health AI"
            className="h-40 w-40 object-contain"
          />
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
          <label className="block text-sm font-medium">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="mt-2 w-full rounded-md border border-input bg-background/60 px-3 py-2 text-sm text-foreground outline-none transition focus:border-accent focus:shadow-glow"
          />

          <label className="mt-4 block text-sm font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="mt-2 w-full rounded-md border border-input bg-background/60 px-3 py-2 text-sm text-foreground outline-none transition focus:border-accent focus:shadow-glow"
          />

          <button
            type="submit"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-accent-foreground transition hover:brightness-110 active:translate-y-px"
          >
            Login
          </button>

          {status === "deny" && (
            <p className="mt-4 text-center text-xs text-destructive">
              Please enter your name and password.
            </p>
          )}

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/" className="font-medium text-accent hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
