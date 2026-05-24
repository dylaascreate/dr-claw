import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, MapPin } from 'lucide-react';
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
  const [view, setView] = useState({ level: 'umbrella' }); // 'umbrella' | 'conditions' | 'doctors'

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

  const currentUmbrella = view.level !== 'umbrella' ? UMBRELLAS.find(u => u.key === view.umbrella) : null;
  const conditionsInView = currentUmbrella ? conditions.filter(c => c.category === currentUmbrella.key) : [];
  const currentCondition = view.level === 'doctors' ? conditions.find(c => c.slug === view.conditionSlug) : null;
  const doctorsInView = currentCondition
    ? (docsBySpec.get(currentCondition.primary_specialty_id) || []).slice(0, 6)
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="w-full space-y-3"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {view.level !== 'umbrella' && (
            <button
              onClick={() => setView(v => v.level === 'doctors'
                ? { level: 'conditions', umbrella: v.umbrella }
                : { level: 'umbrella' })}
              className="w-7 h-7 rounded-full bg-white border border-brown-100 flex items-center justify-center hover:bg-cream transition-colors"
              aria-label="Back"
            >
              <ChevronLeft className="w-4 h-4 text-brown-600" />
            </button>
          )}
          <h2 className="text-2xl text-brown-800 font-serif">
            {view.level === 'umbrella' && 'Find a Doctor'}
            {view.level === 'conditions' && currentUmbrella?.title}
            {view.level === 'doctors' && currentCondition?.name}
          </h2>
        </div>
        <span className="text-xs text-brown-400">
          {view.level === 'umbrella' && 'Pick what feels off'}
          {view.level === 'conditions' && 'Choose a concern'}
          {view.level === 'doctors' && `${doctorsInView.length} specialists`}
        </span>
      </div>

      {loading ? (
        <div className="text-sm text-brown-400 py-4">Loading…</div>
      ) : (
        <AnimatePresence mode="wait">
          {view.level === 'umbrella' && (
            <motion.div
              key="umbrella"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 gap-3"
            >
              {UMBRELLAS.map(u => {
                const c = countsByUmbrella[u.key] || { conditions: 0, doctors: 0 };
                return (
                  <button
                    key={u.key}
                    onClick={() => setView({ level: 'conditions', umbrella: u.key })}
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
            </motion.div>
          )}

          {view.level === 'conditions' && (
            <motion.div
              key="conditions"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 gap-2"
            >
              {conditionsInView.map(c => {
                const spec = specById.get(c.primary_specialty_id);
                const dcount = (docsBySpec.get(c.primary_specialty_id) || []).length;
                return (
                  <button
                    key={c.id}
                    onClick={() => setView({ level: 'doctors', umbrella: currentUmbrella.key, conditionSlug: c.slug })}
                    className="text-left p-3.5 rounded-2xl bg-white border border-brown-100/60 shadow-soft hover:bg-cream/60 active:scale-[0.99] transition-all"
                  >
                    <p className="text-sm font-semibold text-brown-800">{c.name}</p>
                    <p className="text-[11px] text-brown-400 mt-0.5">
                      {spec?.name} · {dcount} doctor{dcount !== 1 ? 's' : ''}
                    </p>
                  </button>
                );
              })}
            </motion.div>
          )}

          {view.level === 'doctors' && (
            <motion.div
              key="doctors"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-2 gap-3"
            >
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
                      onClick={() => onBookDoctor({
                        practitioner: `${d.title} ${d.full_name}`,
                        role: spec?.name,
                        avatar: avatarFor(d),
                        serviceName: currentCondition.name,
                      })}
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
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.div>
  );
}
