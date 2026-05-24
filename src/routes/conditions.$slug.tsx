// @ts-nocheck
import { createFileRoute, Link, notFound, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { CONDITIONS, getConditionBySlug } from '@/wellness/data/conditions';
import { supabase } from '@/integrations/supabase/client';

export const Route = createFileRoute('/conditions/$slug')({
  ssr: false,
  component: ConditionPage,
  head: ({ params }) => {
    const c = getConditionBySlug(params.slug);
    const title = c ? `${c.name} — Dr Claw` : 'Condition — Dr Claw';
    const description = c?.tagline ?? 'Learn about chronic disease management.';
    return {
      meta: [
        { title },
        { name: 'description', content: description },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        ...(c?.img ? [{ property: 'og:image', content: c.img }] : []),
      ],
      links: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Inter:wght@400;500;600;700&display=swap',
        },
      ],
    };
  },
});

const SECTIONS = [
  { id: 'definition', label: 'Definition' },
  { id: 'symptoms', label: 'How it looks' },
  { id: 'causes', label: 'Causes' },
  { id: 'management', label: 'Management' },
];

function ConditionPage() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const condition = getConditionBySlug(slug);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      if (!data.session) navigate({ to: '/' });
    });
    return () => {
      mounted = false;
    };
  }, [navigate]);

  if (!condition) throw notFound();

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div
      className="min-h-screen bg-[#FBF7F1] text-brown-800"
      style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
    >
      <header className="sticky top-0 z-30 bg-[#FBF7F1]/85 backdrop-blur-md border-b border-brown-100/60">
        <div className="max-w-5xl mx-auto px-5 py-4 flex items-center justify-between">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-medium text-brown-600 hover:text-brown-800"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to dashboard
          </Link>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-brown-400">
            Chronic Care
          </span>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-5 pt-8 pb-10 md:pt-14 md:pb-16 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-sage-500/15 text-sage-600 text-[11px] font-semibold uppercase tracking-wider mb-4">
              {condition.specialist}
            </span>
            <h1
              className="text-4xl md:text-5xl font-bold text-brown-800 leading-[1.05] mb-4"
              style={{ fontFamily: 'DM Serif Display, serif' }}
            >
              {condition.name}
            </h1>
            <p className="text-base md:text-lg text-brown-500 leading-relaxed max-w-prose">
              {condition.tagline}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => navigate({ to: '/dashboard' })}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-terracotta-500 text-white text-sm font-semibold shadow-soft hover:bg-terracotta-500/90 active:scale-[0.98] transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Book a {condition.specialist}
              </button>
              <button
                onClick={() => scrollTo('definition')}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-brown-200 bg-white/60 text-brown-700 text-sm font-semibold hover:bg-white transition-all"
              >
                Learn more
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[5/4] rounded-3xl overflow-hidden shadow-premium bg-brown-100">
              <img src={condition.img} alt={condition.name} className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-4 -left-4 w-24 h-24 rounded-3xl bg-sage-500/20 -z-0" />
            <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-terracotta-500/15 -z-0" />
          </div>
        </div>
      </section>

      <nav className="sticky top-[57px] z-20 bg-[#FBF7F1]/85 backdrop-blur-md border-y border-brown-100/60">
        <div className="max-w-5xl mx-auto px-5 py-3 flex gap-2 overflow-x-auto custom-scrollbar">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              className="px-4 py-1.5 rounded-full text-xs font-semibold text-brown-600 bg-white/70 border border-brown-100 hover:bg-white hover:border-sage-500/40 transition-all whitespace-nowrap"
            >
              {s.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-5 py-12 space-y-14">
        <Section id="definition" eyebrow="Definition" title={`What is ${condition.name}?`}>
          <p className="text-base md:text-lg text-brown-600 leading-relaxed">{condition.definition}</p>
        </Section>

        <Section id="symptoms" eyebrow="How it looks" title="Common signs & symptoms">
          <BulletGrid items={condition.symptoms} accent="sage" />
        </Section>

        <Section id="causes" eyebrow="Causes" title="What causes it">
          <BulletGrid items={condition.causes} accent="terracotta" />
        </Section>

        <Section id="management" eyebrow="Management" title="How to manage it">
          <BulletGrid items={condition.management} accent="sage" />
        </Section>

        <section className="relative bg-gradient-to-tr from-sage-500 to-terracotta-500 text-white rounded-3xl p-8 md:p-12 overflow-hidden shadow-premium">
          <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-white/10 rounded-full pointer-events-none" />
          <div className="relative max-w-2xl">
            <h3
              className="text-2xl md:text-3xl font-bold mb-3"
              style={{ fontFamily: 'DM Serif Display, serif' }}
            >
              Ready to take the next step?
            </h3>
            <p className="text-white/85 text-sm md:text-base mb-6 leading-relaxed">
              Connect with a {condition.specialist.toLowerCase()} who specialises in {condition.name.toLowerCase()} care.
              We'll match you with the right specialist and handle the booking.
            </p>
            <button
              onClick={() => navigate({ to: '/dashboard' })}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-brown-800 text-sm font-semibold shadow-soft hover:bg-white/95 active:scale-[0.98] transition-all"
            >
              Book a {condition.specialist}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </section>

        <section>
          <h4 className="text-xs font-semibold text-brown-400 uppercase tracking-wider mb-4">
            Other chronic conditions
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {CONDITIONS.filter((c) => c.slug !== condition.slug)
              .slice(0, 4)
              .map((c) => (
                <Link
                  key={c.slug}
                  to="/conditions/$slug"
                  params={{ slug: c.slug }}
                  className="group text-left p-3 bg-white rounded-2xl shadow-sm border border-brown-100/40 hover:shadow-md hover:border-sage-500/40 transition-all"
                >
                  <div className="aspect-[4/3] rounded-xl overflow-hidden mb-3 bg-brown-100/40">
                    <img
                      src={c.img}
                      alt={c.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <h5
                    className="text-sm font-semibold text-brown-800 leading-tight"
                    style={{ fontFamily: 'DM Serif Display, serif' }}
                  >
                    {c.name}
                  </h5>
                  <span className="mt-1 inline-block text-[11px] font-semibold text-terracotta-500">
                    Learn more →
                  </span>
                </Link>
              ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-brown-100/60 py-8 text-center text-xs text-brown-400">
        Dr Claw — Chronic Care Portal
      </footer>
    </div>
  );
}

function Section({ id, eyebrow, title, children }) {
  return (
    <section id={id} className="scroll-mt-32">
      <span className="inline-block text-[11px] font-semibold text-sage-600 uppercase tracking-wider mb-2">
        {eyebrow}
      </span>
      <h2
        className="text-2xl md:text-3xl font-bold text-brown-800 mb-5"
        style={{ fontFamily: 'DM Serif Display, serif' }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

function BulletGrid({ items, accent = 'sage' }) {
  const dot = accent === 'terracotta' ? 'bg-terracotta-500' : 'bg-sage-500';
  return (
    <ul className="grid md:grid-cols-2 gap-3">
      {items.map((it) => (
        <li
          key={it}
          className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-brown-100/40 shadow-sm"
        >
          <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${dot}`} />
          <span className="text-sm text-brown-700 leading-relaxed">{it}</span>
        </li>
      ))}
    </ul>
  );
}
