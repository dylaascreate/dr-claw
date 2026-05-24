import { createFileRoute } from "@tanstack/react-router";
// @ts-expect-error - JSX module without types
import WellnessApp from "../wellness/App.jsx";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
  head: () => ({
    meta: [
      { title: "CareTrack — Chronic Care Portal" },
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

function DashboardPage() {
  return (
    <div className="wellness-root">
      <WellnessApp />
    </div>
  );
}
