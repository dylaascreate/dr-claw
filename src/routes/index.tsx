import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Cat, Lock } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Login,
  head: () => ({
    meta: [
      { title: "M.A.D. Terminal — Access" },
      { name: "description", content: "Restricted access. Authorized M.A.D. agents only." },
    ],
  }),
});

function Login() {
  const [agentId, setAgentId] = useState("");
  const [passphrase, setPassphrase] = useState("");
  const [status, setStatus] = useState<null | "ok" | "deny">(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(agentId && passphrase ? "ok" : "deny");
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-claw-vignette" />
      <div className="pointer-events-none absolute inset-0 bg-claw-scanlines opacity-[0.08]" />

      <div className="relative mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16">
        <div className="mb-10 flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-accent/40 bg-card shadow-glow">
            <Cat className="h-8 w-8 text-accent" strokeWidth={1.5} />
          </div>
          <p className="text-[0.65rem] uppercase tracking-[0.4em] text-muted-foreground">
            M.A.D. Secure Terminal
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">
            Dr. Claw
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Identify yourself, agent.
          </p>
        </div>

        <form
          onSubmit={submit}
          className="rounded-lg border border-border/60 bg-card/70 p-6 shadow-claw backdrop-blur"
        >
          <label className="block text-[0.7rem] uppercase tracking-[0.25em] text-muted-foreground">
            Agent ID
          </label>
          <input
            value={agentId}
            onChange={(e) => setAgentId(e.target.value)}
            placeholder="AGENT-00X"
            className="mt-2 w-full rounded-md border border-input bg-background/60 px-3 py-2 font-mono text-sm text-foreground outline-none transition focus:border-accent focus:shadow-glow"
          />

          <label className="mt-5 block text-[0.7rem] uppercase tracking-[0.25em] text-muted-foreground">
            Passphrase
          </label>
          <input
            type="password"
            value={passphrase}
            onChange={(e) => setPassphrase(e.target.value)}
            placeholder="••••••••"
            className="mt-2 w-full rounded-md border border-input bg-background/60 px-3 py-2 font-mono text-sm text-foreground outline-none transition focus:border-accent focus:shadow-glow"
          />

          <button
            type="submit"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-medium uppercase tracking-[0.2em] text-accent-foreground transition hover:brightness-110 active:translate-y-px"
          >
            <Lock className="h-4 w-4" />
            Authenticate
          </button>

          {status === "deny" && (
            <p className="mt-4 text-center text-xs uppercase tracking-[0.2em] text-destructive">
              Access denied
            </p>
          )}
          {status === "ok" && (
            <p className="mt-4 text-center text-xs uppercase tracking-[0.2em] text-accent">
              Welcome back, Doctor.
            </p>
          )}
        </form>

        <p className="mt-8 text-center text-[0.65rem] uppercase tracking-[0.35em] text-muted-foreground">
          "I'll get you next time, Gadget… next time!"
        </p>
      </div>
    </main>
  );
}
