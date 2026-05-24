import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';

const TREATMENT_TYPES = [
  { key: 'consultation', name: 'Consultation', blurb: 'New assessment', duration: '45m', price: 280 },
  { key: 'surgery', name: 'Surgery', blurb: 'Procedure booking', duration: '90m', price: 1800 },
  { key: 'follow-up', name: 'Follow-up', blurb: 'Review visit', duration: '30m', price: 180 },
];

const DATES = [
  { weekday: 'Fri', day: '24', full: 'Fri, Oct 24' },
  { weekday: 'Sat', day: '25', full: 'Sat, Oct 25' },
  { weekday: 'Sun', day: '26', full: 'Sun, Oct 26' },
  { weekday: 'Mon', day: '27', full: 'Mon, Oct 27' },
];

const TIMES = ['10:00 AM', '11:30 AM', '2:00 PM', '4:30 PM'];

function avatarFor(doc) {
  if (doc?.avatar_url) return doc.avatar_url;
  const name = encodeURIComponent(`${doc?.title || 'Dr'} ${doc?.full_name || ''}`);
  return `https://ui-avatars.com/api/?name=${name}&background=B8C5A6&color=3C2A1E&size=160&bold=true`;
}

export default function DrawerBook({ show, onClose, preselectedParams, onConfirm }) {
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedTreatment, setSelectedTreatment] = useState(TREATMENT_TYPES[0]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [injectedDoctor, setInjectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(DATES[0]);
  const [selectedTime, setSelectedTime] = useState(TIMES[0]);

  // Load doctors + specialties once
  useEffect(() => {
    let mounted = true;
    (async () => {
      const [{ data: d, error: de }, { data: s, error: se }] = await Promise.all([
        supabase.from('doctors').select('id,full_name,title,avatar_url,years_experience,clinic_location,specialty_id'),
        supabase.from('specialties').select('id,name,slug'),
      ]);
      if (!mounted) return;
      if (de) console.error('[DrawerBook] doctors error', de);
      if (se) console.error('[DrawerBook] specialties error', se);
      setDoctors(d || []);
      setSpecialties(s || []);
      setLoading(false);
    })();
    return () => { mounted = false; };
  }, []);

  const specById = useMemo(() => new Map(specialties.map(s => [s.id, s])), [specialties]);

  // Combined list (injected from "Find a doctor" appears first)
  const practitioners = useMemo(() => {
    const fromDb = doctors.map(d => ({
      id: d.id,
      name: `${d.title || 'Dr.'} ${d.full_name}`,
      role: specById.get(d.specialty_id)?.name || 'Specialist',
      avatar: avatarFor(d),
      rating: '4.9',
    }));
    if (injectedDoctor && !fromDb.some(p => p.name.toLowerCase() === injectedDoctor.name.toLowerCase())) {
      return [injectedDoctor, ...fromDb];
    }
    return fromDb;
  }, [doctors, specById, injectedDoctor]);

  // Default doctor when list loads
  useEffect(() => {
    if (!selectedDoctor && practitioners.length > 0) {
      setSelectedDoctor(practitioners[0]);
    }
  }, [practitioners, selectedDoctor]);

  // Apply preselectedParams when drawer opens
  useEffect(() => {
    if (!show || !preselectedParams) return;

    if (preselectedParams.treatmentType) {
      const match = TREATMENT_TYPES.find(t =>
        t.key === preselectedParams.treatmentType.toLowerCase() ||
        t.name.toLowerCase() === preselectedParams.treatmentType.toLowerCase()
      );
      if (match) setSelectedTreatment(match);
    } else if (preselectedParams.serviceName) {
      const s = preselectedParams.serviceName.toLowerCase();
      const match = TREATMENT_TYPES.find(t => s.includes(t.key));
      if (match) setSelectedTreatment(match);
    }

    if (preselectedParams.practitioner) {
      const existing = practitioners.find(p => p.name.toLowerCase() === preselectedParams.practitioner.toLowerCase());
      if (existing) {
        setSelectedDoctor(existing);
      } else {
        const injected = {
          id: 'injected',
          name: preselectedParams.practitioner,
          role: preselectedParams.role || 'Specialist',
          rating: preselectedParams.rating || '4.9',
          avatar: preselectedParams.avatar || avatarFor({ full_name: preselectedParams.practitioner }),
        };
        setInjectedDoctor(injected);
        setSelectedDoctor(injected);
      }
    }

    if (preselectedParams.date) {
      const match = DATES.find(d => d.full.toLowerCase() === preselectedParams.date.toLowerCase());
      if (match) setSelectedDate(match);
    }
    if (preselectedParams.time && TIMES.includes(preselectedParams.time)) {
      setSelectedTime(preselectedParams.time);
    }
  }, [preselectedParams, show]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleConfirm = () => {
    if (!selectedDoctor) return;
    onConfirm({
      serviceName: selectedTreatment.name,
      treatmentType: selectedTreatment.key,
      price: selectedTreatment.price,
      practitioner: selectedDoctor.name,
      date: selectedDate.full,
      time: selectedTime,
      avatar: selectedDoctor.avatar,
    });
  };

  return (
    <div
      className={`absolute bottom-0 left-0 right-0 h-[85%] bg-cream rounded-t-[32px] shadow-premium z-50 transform transition-transform duration-300 ease-out flex flex-col overflow-hidden ${
        show ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div
        className="w-12 h-1.5 bg-brown-400/30 rounded-full mx-auto my-3 flex-shrink-0 cursor-pointer"
        onClick={onClose}
      />

      <div className="px-5 pb-3 border-b border-brown-100 flex items-center justify-between">
        <h3 className="text-xl font-bold text-brown-800 font-serif">Book Appointment</h3>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-brown-100 flex items-center justify-center text-brown-600 hover:bg-brown-100/80"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-6 text-left">
        {/* Step 1: Treatment Type */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-brown-400 block mb-2">
            1. Treatment Type
          </label>
          <div className="grid grid-cols-3 gap-2">
            {TREATMENT_TYPES.map(t => {
              const isSelected = selectedTreatment.key === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setSelectedTreatment(t)}
                  className={`p-3 bg-white border rounded-2xl text-left shadow-sm transition-all ${
                    isSelected ? 'border-sage-500' : 'border-brown-100 hover:border-brown-400'
                  }`}
                >
                  <p className="text-sm font-semibold text-brown-800 font-serif">{t.name}</p>
                  <p className="text-[11px] text-brown-500 mt-0.5">{t.blurb}</p>
                  <p className="text-[11px] font-bold text-sage-500 mt-1.5">${t.price} · {t.duration}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Doctor */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-brown-400 block mb-2">
            2. Practitioner
          </label>
          {loading ? (
            <p className="text-sm text-brown-400 py-3">Loading doctors…</p>
          ) : practitioners.length === 0 ? (
            <p className="text-sm text-brown-400 py-3">No doctors available.</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar pr-1">
              {practitioners.map(p => {
                const isSelected = selectedDoctor?.name === p.name;
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedDoctor(p)}
                    className={`p-3 bg-white border rounded-2xl flex items-center justify-between cursor-pointer transition-all shadow-sm ${
                      isSelected ? 'border-sage-500' : 'border-brown-100 hover:border-brown-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img src={p.avatar} className="w-10 h-10 rounded-full object-cover" alt={p.name} />
                      <div>
                        <p className="text-sm font-semibold text-brown-800 font-serif">{p.name}</p>
                        <p className="text-xs text-brown-500">{p.role} · ★ {p.rating}</p>
                      </div>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-full border ${
                        isSelected ? 'border-4 border-sage-500' : 'border-brown-400'
                      }`}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Step 3: Date & Time */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-brown-400 block mb-2">
            3. Date & Time
          </label>
          <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
            {DATES.map(d => {
              const isSelected = selectedDate.full === d.full;
              return (
                <button
                  key={d.full}
                  onClick={() => setSelectedDate(d)}
                  className={`px-4 py-3 bg-white border text-brown-800 rounded-xl text-center shadow-sm flex-shrink-0 ${
                    isSelected ? 'border-sage-500' : 'border-brown-100 hover:border-brown-400'
                  }`}
                >
                  <p className="text-[10px] uppercase text-brown-400 font-bold">{d.weekday}</p>
                  <p className="text-sm font-bold">{d.day}</p>
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-3 gap-2 mt-3">
            {TIMES.map(t => {
              const isSelected = selectedTime === t;
              return (
                <button
                  key={t}
                  onClick={() => setSelectedTime(t)}
                  className={`py-2.5 bg-white border text-brown-800 rounded-xl text-xs font-semibold text-center shadow-sm ${
                    isSelected ? 'border-sage-500' : 'border-brown-100 hover:border-brown-400'
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="p-5 bg-white border-t border-brown-100 flex items-center justify-between pb-8">
        <div className="text-left">
          <p className="text-xs text-brown-400 uppercase font-semibold">Total Price</p>
          <p className="text-xl font-bold text-brown-800">${selectedTreatment.price.toFixed(2)}</p>
        </div>
        <button
          onClick={handleConfirm}
          disabled={!selectedDoctor}
          className="py-3 px-6 rounded-xl bg-sage-500 hover:bg-sage-500/90 text-white font-semibold text-sm shadow-md transition-all active:scale-95 disabled:opacity-50"
        >
          Confirm Appointment
        </button>
      </div>
    </div>
  );
}
