import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
// @ts-expect-error - JSX module without types
import WellnessApp from "../wellness/App.jsx";

export const Route = createFileRoute("/dashboard")({
  ssr: false,
  component: DashboardPage,
  head: () => ({
    meta: [
      { title: "Dr Claw — Chronic Care Portal" },
      { name: "description", content: "Your personalized chronic care dashboard." },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Inter:wght@400;500;600;700&display=swap",
      },
    ],
  }),
});

function hasStoredSession() {
  if (typeof window === "undefined") return true;
  try {
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (k && k.startsWith("sb-") && k.endsWith("-auth-token")) return true;
    }
  } catch {
    // ignore
  }
  return false;
}

function DashboardPage() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!hasStoredSession()) {
      navigate({ to: "/" });
      return;
    }
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) navigate({ to: "/" });
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="wellness-root">
      <WellnessApp />
    </div>
  );
}
