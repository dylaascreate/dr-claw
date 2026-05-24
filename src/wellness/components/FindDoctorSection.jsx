import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MapPin, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

function avatarFor(doc) {
  if (doc.avatar_url) return doc.avatar_url;
  const name = encodeURIComponent(`${doc.title || 'Dr'} ${doc.full_name}`);
  return `https://ui-avatars.com/api/?name=${name}&background=B8C5A6&color=3C2A1E&size=160&bold=true`;
}

export default function FindDoctorSection({ onBookDoctor }) {
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState([]);
  const [openSlug, setOpenSlug] = useState(null);

  useEffect(() => {
    (async () => {
      const [{ data: conditions }, { data: doctors }, { data: specialties }] = await Promise.all([
        supabase.from('conditions').select('id,name,slug,primary_specialty_id'),
        supabase.from('doctors').select('id,full_name,title,avatar_url,bio,years_experience,clinic_location,languages,specialty_id'),
        supabase.from('specialties').select('id,name,slug'),
      ]);
      const specById = new Map((specialties || []).map(s => [s.id, s]));
      const docsBySpec = new Map();
      (doctors || []).forEach(d => {
        if (!docsBySpec.has(d.specialty_id)) docsBySpec.set(d.specialty_id, []);
        docsBySpec.get(d.specialty_id).push(d);
      });
      const grouped = (conditions || []).map(c => ({
        slug: c.slug,
        name: c.name,
        specialty: specById.get(c.primary_specialty_id),
        doctors: (docsBySpec.get(c.primary_specialty_id) || []).slice(0, 3),
      })).filter(g => g.doctors.length > 0);
      setGroups(grouped);
      setLoading(false);
    })();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="w-full space-y-3"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl text-brown-800 font-serif">Find a Doctor</h2>
        <span className="text-xs text-brown-400">Grouped by condition</span>
      </div>

      {loading ? (
        <div className="text-sm text-brown-400 py-4">Loading specialists…</div>
      ) : (
        <div className="space-y-2">
          {groups.map((g) => {
            const open = openSlug === g.slug;
            return (
              <div key={g.slug} className="bg-white rounded-2xl shadow-soft border border-brown-100/60 overflow-hidden">
                <button
                  onClick={() => setOpenSlug(open ? null : g.slug)}
                  className="w-full flex items-center justify-between px-4 py-3.5 text-left hover:bg-cream/60 transition-colors"
                >
                  <div>
                    <p className="text-sm font-semibold text-brown-800">{g.name}</p>
                    <p className="text-[11px] text-brown-400 mt-0.5">
                      {g.specialty?.name} • {g.doctors.length} specialist{g.doctors.length > 1 ? 's' : ''}
                    </p>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-brown-400 transition-transform ${open ? 'rotate-180' : ''}`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 pt-1 space-y-2 border-t border-brown-100/60">
                        {g.doctors.map((d) => (
                          <div
                            key={d.id}
                            className="flex items-center gap-3 p-3 rounded-xl bg-cream/40 hover:bg-cream transition-colors"
                          >
                            <img
                              src={avatarFor(d)}
                              alt={d.full_name}
                              className="w-12 h-12 rounded-full object-cover flex-shrink-0 border border-white shadow-sm"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-brown-800 truncate">
                                {d.title} {d.full_name}
                              </p>
                              <p className="text-[11px] text-brown-500 truncate">
                                {g.specialty?.name} • {d.years_experience}y exp
                              </p>
                              {d.clinic_location && (
                                <p className="text-[11px] text-brown-400 flex items-center gap-1 mt-0.5 truncate">
                                  <MapPin className="w-3 h-3 flex-shrink-0" />
                                  <span className="truncate">{d.clinic_location}</span>
                                </p>
                              )}
                            </div>
                            <button
                              onClick={() => onBookDoctor({
                                practitioner: `${d.title} ${d.full_name}`,
                                role: g.specialty?.name,
                                avatar: avatarFor(d),
                                serviceName: g.name,
                              })}
                              className="px-3 py-1.5 rounded-lg bg-sage-500 text-white text-xs font-semibold shadow-sm hover:bg-sage-500/90 active:scale-95 transition-all flex-shrink-0"
                            >
                              Book
                            </button>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
