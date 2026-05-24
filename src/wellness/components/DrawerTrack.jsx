import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';

// ── Condition profile (vascular / hypertension default for Joel) ────────────
// Easy to extend: add more profiles keyed by condition slug.
const CONDITION_PROFILE = {
  label: 'Vascular + Hypertension',
  measurements: [
    { key: 'bp_systolic', label: 'BP Systolic', unit: 'mmHg', placeholder: '120', min: 60, max: 250 },
    { key: 'bp_diastolic', label: 'BP Diastolic', unit: 'mmHg', placeholder: '80', min: 40, max: 150 },
    { key: 'heart_rate', label: 'Heart Rate', unit: 'bpm', placeholder: '72', min: 30, max: 200 },
    { key: 'weight_kg', label: 'Weight', unit: 'kg', placeholder: '70', min: 20, max: 300 },
  ],
  symptoms: [
    { key: 'leg_swelling', label: 'Leg swelling', emoji: '🦵' },
    { key: 'calf_pain', label: 'Calf pain when walking', emoji: '🚶' },
    { key: 'headache', label: 'Headache', emoji: '🤕' },
    { key: 'dizziness', label: 'Dizziness', emoji: '💫' },
    { key: 'chest_pain', label: 'Chest pain', emoji: '❤️‍🩹', triggersFollowUp: true },
    { key: 'shortness_breath', label: 'Shortness of breath', emoji: '🫁', triggersFollowUp: true },
    { key: 'blurred_vision', label: 'Blurred vision', emoji: '👁️' },
    { key: 'fatigue', label: 'Unusual fatigue', emoji: '😴' },
  ],
};

const FEELINGS = [
  { key: 'good', label: 'Good', emoji: '😊', color: 'bg-sage-500/15 border-sage-500 text-sage-700' },
  { key: 'okay', label: 'Okay', emoji: '😐', color: 'bg-amber-100 border-amber-400 text-amber-700' },
  { key: 'unwell', label: 'Unwell', emoji: '🤒', color: 'bg-red-100 border-red-400 text-red-700' },
];

const STEPS = ['Essentials', 'Measurements', 'Symptoms', 'Follow-up', 'Review'];

export default function DrawerTrack({ show, onClose, onSubmitted, showToast, needsMonitoring = true, onBookAppointment }) {
  const [step, setStep] = useState(0);

  // Step 1 — Daily essentials
  const [medsTaken, setMedsTaken] = useState(null); // true/false
  const [missedDoses, setMissedDoses] = useState(null);
  const [feeling, setFeeling] = useState(null);
  const [energy, setEnergy] = useState(7);

  // Step 2 — Measurements
  const [measurements, setMeasurements] = useState({});

  // Step 3 — Symptoms
  const [symptoms, setSymptoms] = useState([]);

  // Step 4 — Conditional follow-up
  const [followUp, setFollowUp] = useState({});

  // Recent check-ins (for tiny insight in review step)
  const [recent, setRecent] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // Reset on open
  useEffect(() => {
    if (show) {
      setStep(0);
      setMedsTaken(null);
      setMissedDoses(null);
      setFeeling(null);
      setEnergy(7);
      setMeasurements({});
      setSymptoms([]);
      setFollowUp({});
    }
  }, [show]);

  // Load last 7 check-ins for insight panel
  useEffect(() => {
    if (!show) return;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from('check_ins')
        .select('check_in_date, meds_taken, feeling, measurements, symptoms')
        .eq('user_id', user.id)
        .order('check_in_date', { ascending: false })
        .limit(7);
      setRecent(data || []);
    })();
  }, [show]);

  const triggersFollowUp = useMemo(
    () => symptoms.some(s => CONDITION_PROFILE.symptoms.find(x => x.key === s)?.triggersFollowUp),
    [symptoms]
  );

  // Skip follow-up step if not triggered
  const effectiveSteps = useMemo(
    () => triggersFollowUp ? STEPS : STEPS.filter(s => s !== 'Follow-up'),
    [triggersFollowUp]
  );

  const canAdvance = () => {
    if (step === 0) return medsTaken !== null && feeling !== null;
    return true;
  };

  const handleNext = () => {
    const nextLabel = effectiveSteps[Math.min(effectiveSteps.indexOf(STEPS[step]) + 1, effectiveSteps.length - 1)];
    const nextIdx = STEPS.indexOf(nextLabel);
    setStep(nextIdx);
  };

  const handleBack = () => {
    const curLabel = STEPS[step];
    const curIdxInEff = effectiveSteps.indexOf(curLabel);
    const prevLabel = effectiveSteps[Math.max(curIdxInEff - 1, 0)];
    setStep(STEPS.indexOf(prevLabel));
  };

  const toggleSymptom = (key) => {
    setSymptoms(prev => prev.includes(key) ? prev.filter(s => s !== key) : [...prev, key]);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      showToast?.('Please sign in to save your check-in', 'error');
      setSubmitting(false);
      return;
    }
    const { error } = await supabase.from('check_ins').insert({
      user_id: user.id,
      check_in_date: new Date().toISOString().split('T')[0],
      meds_taken: medsTaken,
      missed_doses: missedDoses,
      feeling,
      energy_level: energy,
      measurements,
      symptoms,
      follow_up: followUp,
    });
    setSubmitting(false);
    if (error) {
      showToast?.('Could not save: ' + error.message, 'error');
      return;
    }
    showToast?.('✅ Check-in saved!');
    onSubmitted?.({ feeling, symptoms, measurements });
    onClose();
  };

  // ── Insight summary (last 7 days) ──────────────────────────────────────────
  const insight = useMemo(() => {
    if (!recent.length) return null;
    const medsCount = recent.filter(r => r.meds_taken).length;
    const bps = recent
      .map(r => r.measurements?.bp_systolic)
      .filter(Boolean)
      .map(Number);
    const avgBp = bps.length ? Math.round(bps.reduce((a, b) => a + b, 0) / bps.length) : null;
    return { medsCount, total: recent.length, avgBp };
  }, [recent]);

  return (
    <div
      className={`absolute bottom-0 left-0 right-0 h-[88%] bg-cream rounded-t-[32px] shadow-premium z-50 transform transition-transform duration-300 ease-out flex flex-col overflow-hidden ${
        show ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div
        className="w-12 h-1.5 bg-brown-400/30 rounded-full mx-auto my-3 flex-shrink-0 cursor-pointer"
        onClick={onClose}
      />

      {!needsMonitoring ? (
        <NoMonitoringView onClose={onClose} onBookAppointment={onBookAppointment} />
      ) : (
      <>


      {/* Header */}
      <div className="px-5 pb-3 border-b border-brown-100 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-brown-800 font-serif">Daily Check-In</h3>
          <p className="text-[11px] text-brown-500 mt-0.5">{CONDITION_PROFILE.label}</p>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-brown-100 flex items-center justify-center text-brown-600 hover:bg-brown-100/80"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Progress dots */}
      <div className="px-5 pt-3 pb-1 flex items-center gap-1.5">
        {effectiveSteps.map((label, i) => {
          const stepIdx = STEPS.indexOf(label);
          const isActive = stepIdx === step;
          const isDone = STEPS.indexOf(STEPS[step]) > stepIdx;
          return (
            <div key={label} className="flex items-center gap-1.5 flex-1">
              <div
                className={`h-1.5 flex-1 rounded-full transition-all ${
                  isActive ? 'bg-sage-500' : isDone ? 'bg-sage-500/60' : 'bg-brown-100'
                }`}
              />
            </div>
          );
        })}
      </div>
      <p className="px-5 pt-2 text-xs font-semibold uppercase tracking-wider text-brown-400">
        Step {effectiveSteps.indexOf(STEPS[step]) + 1} of {effectiveSteps.length} · {STEPS[step]}
      </p>

      {/* Body */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-6 text-left">

        {/* STEP 0 — Daily Essentials */}
        {STEPS[step] === 'Essentials' && (
          <>
            <Section title="Did you take your medication today?">
              <YesNo value={medsTaken} onChange={setMedsTaken} />
            </Section>

            {medsTaken === true && (
              <Section title="Any missed doses?">
                <YesNo value={missedDoses} onChange={setMissedDoses} />
              </Section>
            )}

            <Section title="How are you feeling?">
              <div className="grid grid-cols-1 gap-2">
                {FEELINGS.map(f => (
                  <button
                    key={f.key}
                    onClick={() => setFeeling(f.key)}
                    className={`p-3 bg-white border rounded-2xl text-left shadow-sm transition-all flex items-center gap-3 ${
                      feeling === f.key ? f.color : 'border-brown-100 hover:border-brown-400'
                    }`}
                  >
                    <div className="text-2xl">{f.emoji}</div>
                    <p className="text-sm font-semibold text-brown-800">{f.label}</p>
                  </button>
                ))}
              </div>
            </Section>

            <Section title={`Energy level: ${energy}/10`} subtle>
              <input
                type="range"
                min="1"
                max="10"
                value={energy}
                onChange={(e) => setEnergy(Number(e.target.value))}
                className="w-full accent-sage-500"
              />
              <div className="flex justify-between text-[10px] text-brown-400 mt-1">
                <span>Drained</span><span>Energised</span>
              </div>
            </Section>
          </>
        )}

        {/* STEP 1 — Measurements */}
        {STEPS[step] === 'Measurements' && (
          <Section title="Today's readings" hint="Skip any you don't have right now.">
            <div className="grid grid-cols-1 gap-3">
              {CONDITION_PROFILE.measurements.map(m => (
                <label key={m.key} className="bg-white border border-brown-100 rounded-2xl p-3 shadow-sm">
                  <p className="text-xs font-semibold text-brown-600">{m.label}</p>
                  <div className="flex items-baseline gap-1.5 mt-1.5">
                    <input
                      type="number"
                      inputMode="decimal"
                      placeholder={m.placeholder}
                      min={m.min}
                      max={m.max}
                      value={measurements[m.key] ?? ''}
                      onChange={(e) => setMeasurements(prev => ({ ...prev, [m.key]: e.target.value }))}
                      className="w-full text-lg font-bold text-brown-800 font-serif bg-transparent outline-none border-b border-brown-100 focus:border-sage-500"
                    />
                    <span className="text-[10px] text-brown-400 font-medium">{m.unit}</span>
                  </div>
                </label>
              ))}
            </div>
          </Section>
        )}

        {/* STEP 2 — Symptoms */}
        {STEPS[step] === 'Symptoms' && (
          <Section title="Any symptoms today?" hint="Tap all that apply. Leave empty if you feel fine.">
            <div className="grid grid-cols-1 gap-2">
              {CONDITION_PROFILE.symptoms.map(s => {
                const isOn = symptoms.includes(s.key);
                return (
                  <button
                    key={s.key}
                    onClick={() => toggleSymptom(s.key)}
                    className={`p-3 bg-white border rounded-2xl text-left shadow-sm transition-all flex items-center gap-3 ${
                      isOn ? 'border-sage-500 bg-sage-500/5' : 'border-brown-100 hover:border-brown-400'
                    }`}
                  >
                    <span className="text-xl">{s.emoji}</span>
                    <span className="text-sm font-medium text-brown-800">{s.label}</span>
                  </button>
                );
              })}
            </div>
          </Section>
        )}

        {/* STEP 3 — Conditional Follow-up */}
        {STEPS[step] === 'Follow-up' && (
          <>
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 flex items-start gap-2">
              <span className="text-lg">⚠️</span>
              <p className="text-xs text-amber-800">
                You flagged a serious symptom. A few quick questions help us understand the urgency.
              </p>
            </div>

            {symptoms.includes('chest_pain') && (
              <Section title="Chest pain — how severe?">
                <SeverityPicker
                  value={followUp.chest_pain_severity}
                  onChange={(v) => setFollowUp(p => ({ ...p, chest_pain_severity: v }))}
                />
                <p className="text-xs font-semibold text-brown-600 mt-3 mb-1.5">How long has it lasted?</p>
                <ChipRow
                  options={['<1 min', '1–5 min', '5–15 min', '>15 min']}
                  value={followUp.chest_pain_duration}
                  onChange={(v) => setFollowUp(p => ({ ...p, chest_pain_duration: v }))}
                />
              </Section>
            )}

            {symptoms.includes('shortness_breath') && (
              <Section title="Shortness of breath — when?">
                <ChipRow
                  options={['At rest', 'When walking', 'Lying flat', 'Only on stairs']}
                  value={followUp.sob_trigger}
                  onChange={(v) => setFollowUp(p => ({ ...p, sob_trigger: v }))}
                />
              </Section>
            )}

            <div className="bg-red-50 border border-red-200 rounded-2xl p-3 text-xs text-red-800">
              <strong>Emergency:</strong> if pain is crushing, spreading to arm/jaw, or you feel faint —
              call emergency services now.
            </div>
          </>
        )}

        {/* STEP 4 — Review */}
        {STEPS[step] === 'Review' && (
          <>
            <Section title="Quick summary">
              <ul className="space-y-1.5 text-sm text-brown-800">
                <li>💊 Medication: <strong>{medsTaken ? 'Taken' : 'Not taken'}</strong>{missedDoses ? ' (missed doses)' : ''}</li>
                <li>{FEELINGS.find(f => f.key === feeling)?.emoji} Feeling: <strong>{feeling}</strong> · energy {energy}/10</li>
                {Object.keys(measurements).length > 0 && (
                  <li>📊 Measurements: <strong>{Object.entries(measurements).filter(([_,v]) => v).map(([k,v]) => `${k.replace(/_/g,' ')} ${v}`).join(', ') || 'none'}</strong></li>
                )}
                <li>🩺 Symptoms: <strong>{symptoms.length ? symptoms.length + ' flagged' : 'none'}</strong></li>
              </ul>
            </Section>

            {insight && (
              <Section title="Your trend (last 7 days)" subtle>
                <div className="space-y-2 text-sm text-brown-800">
                  <div className="flex justify-between bg-white p-2.5 rounded-xl border border-brown-100">
                    <span>Medication consistency</span>
                    <strong className="text-sage-600">{insight.medsCount}/{insight.total} days</strong>
                  </div>
                  {insight.avgBp && (
                    <div className="flex justify-between bg-white p-2.5 rounded-xl border border-brown-100">
                      <span>Avg systolic BP</span>
                      <strong className={insight.avgBp > 140 ? 'text-red-600' : 'text-sage-600'}>{insight.avgBp} mmHg</strong>
                    </div>
                  )}
                </div>
              </Section>
            )}
          </>
        )}
      </div>

      {/* Footer nav */}
      <div className="px-5 py-3 border-t border-brown-100 bg-white flex items-center gap-2 flex-shrink-0">
        {effectiveSteps.indexOf(STEPS[step]) > 0 && (
          <button
            onClick={handleBack}
            className="px-4 py-3 rounded-2xl bg-brown-100 text-brown-700 text-sm font-semibold hover:bg-brown-100/80"
          >
            Back
          </button>
        )}
        {STEPS[step] !== 'Review' ? (
          <button
            onClick={handleNext}
            disabled={!canAdvance()}
            className="flex-1 py-3 rounded-2xl bg-brown-800 text-white text-sm font-semibold disabled:opacity-40 hover:bg-brown-700 transition-all"
          >
            Continue
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 py-3 rounded-2xl bg-sage-500 text-white text-sm font-semibold disabled:opacity-40 hover:bg-sage-600 transition-all"
          >
            {submitting ? 'Saving…' : 'Submit check-in'}
          </button>
        )}
      </div>
    </div>
  );
}

// ── Small presentational helpers ────────────────────────────────────────────

function Section({ title, hint, subtle, children }) {
  return (
    <div>
      <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${subtle ? 'text-brown-400' : 'text-brown-600'}`}>
        {title}
      </label>
      {hint && <p className="text-[11px] text-brown-400 -mt-1 mb-2">{hint}</p>}
      {children}
    </div>
  );
}

function YesNo({ value, onChange }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {[
        { v: true, label: 'Yes', emoji: '✅' },
        { v: false, label: 'No', emoji: '❌' },
      ].map(opt => (
        <button
          key={String(opt.v)}
          onClick={() => onChange(opt.v)}
          className={`p-3 bg-white border rounded-2xl shadow-sm transition-all ${
            value === opt.v ? 'border-sage-500 bg-sage-500/5' : 'border-brown-100 hover:border-brown-400'
          }`}
        >
          <span className="text-lg mr-1.5">{opt.emoji}</span>
          <span className="text-sm font-semibold text-brown-800">{opt.label}</span>
        </button>
      ))}
    </div>
  );
}

function ChipRow({ options, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(o => (
        <button
          key={o}
          onClick={() => onChange(o)}
          className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${
            value === o
              ? 'bg-sage-500 text-white border-sage-500'
              : 'bg-white text-brown-700 border-brown-100 hover:border-brown-400'
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

function SeverityPicker({ value, onChange }) {
  return (
    <div className="flex gap-1.5">
      {[1,2,3,4,5,6,7,8,9,10].map(n => (
        <button
          key={n}
          onClick={() => onChange(n)}
          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
            value === n
              ? n >= 7 ? 'bg-red-500 text-white' : n >= 4 ? 'bg-amber-400 text-white' : 'bg-sage-500 text-white'
              : 'bg-white border border-brown-100 text-brown-600 hover:border-brown-400'
          }`}
        >
          {n}
        </button>
      ))}
    </div>
  );
}
