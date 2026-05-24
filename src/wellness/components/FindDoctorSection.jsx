import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, MapPin, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

// Human-friendly umbrella groups mapped from condition.category
const UMBRELLAS = [
  {
    key: 'arterial',
    title: 'Heart & Artery',
    blurb: 'Chest pain, blocked arteries, circulation',
    emoji: '🫀',
    bg: 'from-rose-100 to-rose-50',
    ring: 'ring-rose-200',
  },
  {
    key: 'venous',
    title: 'Vein Problems',
    blurb: 'Varicose veins, leg swelling, heaviness',
    emoji: '🦵',
    bg: 'from-violet-100 to-violet-50',
    ring: 'ring-violet-200',
  },
  {
    key: 'clot',
    title: 'Blood Clots',
    blurb: 'DVT, clotting issues, post-clot care',
    emoji: '🩸',
    bg: 'from-amber-100 to-amber-50',
    ring: 'ring-amber-200',
  },
  {
    key: 'systemic-vascular',
    title: 'Diabetes, Kidney & BP',
    blurb: 'Long-term conditions affecting blood vessels',
    emoji: '💉',
    bg: 'from-emerald-100 to-emerald-50',
    ring: 'ring-emerald-200',
  },
];

function avatarFor(doc) {
  if (doc.avatar_url) return doc.avatar_url;
  const name = encodeURIComponent(`${doc.title || 'Dr'} ${doc.full_name}`);
  return `https://ui-avatars.com/api/?name=${name}&background=B8C5A6&color=3C2A1E&size=160&bold=true`;
}

export default function FindDoctorSection({ onBookDoctor }) {
  const [loading, setLoading] = useState(true);
  const [conditions, setConditions] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  // Drawer state: null | { umbrella, conditionSlug? }
  const [drawer, setDrawer] = useState(null);

  useEffect(() => {
    (async () => {
      const [{ data: c }, { data: d }, { data: s }] = await Promise.all([
        supabase.from('conditions').select('id,name,slug,category,primary_specialty_id'),
        supabase.from('doctors').select('id,full_name,title,avatar_url,years_experience,clinic_location,specialty_id'),
        supabase.from('specialties').select('id,name,slug'),
      ]);
      setConditions(c || []);
      setDoctors(d || []);
      setSpecialties(s || []);
      setLoading(false);
    })();
  }, []);

  const specById = useMemo(() => new Map(specialties.map(s => [s.id, s])), [specialties]);
  const docsBySpec = useMemo(() => {
    const m = new Map();
    doctors.forEach(d => {
      if (!m.has(d.specialty_id)) m.set(d.specialty_id, []);
      m.get(d.specialty_id).push(d);
    });
    return m;
  }, [doctors]);

  const countsByUmbrella = useMemo(() => {
    const m = {};
    UMBRELLAS.forEach(u => {
      const conds = conditions.filter(c => c.category === u.key);
      const docCount = new Set();
      conds.forEach(c => (docsBySpec.get(c.primary_specialty_id) || []).forEach(d => docCount.add(d.id)));
      m[u.key] = { conditions: conds.length, doctors: docCount.size };
    });
    return m;
  }, [conditions, docsBySpec]);

  const currentUmbrella = drawer ? UMBRELLAS.find(u => u.key === drawer.umbrella) : null;
  const conditionsInView = currentUmbrella ? conditions.filter(c => c.category === currentUmbrella.key) : [];
  const currentCondition = drawer?.conditionSlug ? conditions.find(c => c.slug === drawer.conditionSlug) : null;
  const doctorsInView = currentCondition
    ? (docsBySpec.get(currentCondition.primary_specialty_id) || []).slice(0, 6)
    : [];

  const showDrawer = !!drawer;
  const drawerStage = currentCondition ? 'doctors' : 'conditions';

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="w-full space-y-3"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl text-brown-800 font-serif">Find a Doctor</h2>
          <span className="text-xs text-brown-400">Pick what feels off</span>
        </div>

        {loading ? (
          <div className="text-sm text-brown-400 py-4">Loading…</div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {UMBRELLAS.map(u => {
              const c = countsByUmbrella[u.key] || { conditions: 0, doctors: 0 };
              return (
                <button
                  key={u.key}
                  onClick={() => setDrawer({ umbrella: u.key })}
                  className={`text-left p-4 rounded-2xl bg-gradient-to-br ${u.bg} ring-1 ${u.ring} hover:scale-[1.02] active:scale-95 transition-transform shadow-soft`}
                >
                  <div className="text-3xl mb-2">{u.emoji}</div>
                  <p className="text-sm font-semibold text-brown-800 leading-tight">{u.title}</p>
                  <p className="text-[11px] text-brown-500 mt-1 leading-snug">{u.blurb}</p>
                  <p className="text-[10px] text-brown-400 mt-2">
                    {c.conditions} concern{c.conditions !== 1 ? 's' : ''} · {c.doctors} doctor{c.doctors !== 1 ? 's' : ''}
                  </p>
                </button>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* ── Drawer ── */}
      <AnimatePresence>
        {showDrawer && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/40 z-[60]"
              onClick={() => setDrawer(null)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 280 }}
              className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[440px] h-[85%] bg-cream rounded-t-[32px] shadow-premium z-[61] flex flex-col overflow-hidden"
            >
              <div
                className="w-12 h-1.5 bg-brown-400/30 rounded-full mx-auto my-3 flex-shrink-0 cursor-pointer"
                onClick={() => setDrawer(null)}
              />

              <div className="px-5 pb-3 border-b border-brown-100 flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  {drawerStage === 'doctors' && (
                    <button
                      onClick={() => setDrawer({ umbrella: drawer.umbrella })}
                      className="w-8 h-8 rounded-full bg-white border border-brown-100 flex items-center justify-center hover:bg-cream flex-shrink-0"
                      aria-label="Back"
                    >
                      <ChevronLeft className="w-4 h-4 text-brown-600" />
                    </button>
                  )}
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold text-brown-800 font-serif truncate">
                      {drawerStage === 'conditions' ? currentUmbrella?.title : currentCondition?.name}
                    </h3>
                    <p className="text-[11px] text-brown-500 mt-0.5 truncate">
                      {drawerStage === 'conditions'
                        ? 'Choose a concern'
                        : `${doctorsInView.length} specialist${doctorsInView.length !== 1 ? 's' : ''}`}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setDrawer(null)}
                  className="w-8 h-8 rounded-full bg-brown-100 flex items-center justify-center text-brown-600 hover:bg-brown-100/80 flex-shrink-0 ml-3"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-5">
                {drawerStage === 'conditions' && (
                  <div className="grid grid-cols-1 gap-2">
                    {conditionsInView.map(c => {
                      const spec = specById.get(c.primary_specialty_id);
                      const dcount = (docsBySpec.get(c.primary_specialty_id) || []).length;
                      return (
                        <button
                          key={c.id}
                          onClick={() => setDrawer({ umbrella: drawer.umbrella, conditionSlug: c.slug })}
                          className="text-left p-3.5 rounded-2xl bg-white border border-brown-100/60 shadow-soft hover:bg-cream/60 active:scale-[0.99] transition-all"
                        >
                          <p className="text-sm font-semibold text-brown-800">{c.name}</p>
                          <p className="text-[11px] text-brown-400 mt-0.5">
                            {spec?.name} · {dcount} doctor{dcount !== 1 ? 's' : ''}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                )}

                {drawerStage === 'doctors' && (
                  <div className="grid grid-cols-2 gap-3">
                    {doctorsInView.map(d => {
                      const spec = specById.get(d.specialty_id);
                      return (
                        <div
                          key={d.id}
                          className="p-3 rounded-2xl bg-white border border-brown-100/60 shadow-soft flex flex-col items-center text-center"
                        >
                          <img
                            src={avatarFor(d)}
                            alt={d.full_name}
                            className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
                          />
                          <p className="text-sm font-semibold text-brown-800 mt-2 leading-tight">
                            {d.title} {d.full_name}
                          </p>
                          <p className="text-[10px] text-brown-500 mt-0.5">{spec?.name}</p>
                          <p className="text-[10px] text-brown-400 mt-0.5">{d.years_experience}y exp</p>
                          {d.clinic_location && (
                            <p className="text-[10px] text-brown-400 flex items-center gap-0.5 mt-1 truncate max-w-full">
                              <MapPin className="w-2.5 h-2.5 flex-shrink-0" />
                              <span className="truncate">{d.clinic_location}</span>
                            </p>
                          )}
                          <button
                            onClick={() => {
                              onBookDoctor({
                                practitioner: `${d.title} ${d.full_name}`,
                                role: spec?.name,
                                avatar: avatarFor(d),
                                serviceName: currentCondition.name,
                              });
                              setDrawer(null);
                            }}
                            className="mt-2 w-full px-3 py-1.5 rounded-lg bg-sage-500 text-white text-xs font-semibold shadow-sm hover:bg-sage-500/90 active:scale-95 transition-all"
                          >
                            Book
                          </button>
                        </div>
                      );
                    })}
                    {doctorsInView.length === 0 && (
                      <p className="col-span-2 text-sm text-brown-400 py-4 text-center">No doctors available yet.</p>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
