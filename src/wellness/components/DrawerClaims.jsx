import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CONDITIONS } from '@/wellness/data/conditions';

const VISIT_TYPES = ['Consultation', 'Surgery', 'Follow-up'];


const INSURERS = [
  'AIA / AIA Public Takaful (A-Plus Health)',
  'Allianz Malaysia (MediSafe Infinite+)',
  'Prudential / PRUMalaysia (PRUValue Med)',
  'Great Eastern / GE Takaful (Smart Medic)',
  'Etiqa Insurance & Takaful (Elite Medical Plus)',
  'Manulife (ManuHealth Elite)',
  'Generali Malaysia (eMedic Plus, SmartCare)',
  'Tokio Marine (Medic Plus)',
  'Zurich Malaysia (Zurich Takaful)',
  'Hong Leong Assurance (HLA)',
];

const STAGES = [
  { key: 'submitted', label: 'Submitted' },
  { key: 'review', label: 'In Review' },
  { key: 'approved', label: 'Approved' },
  { key: 'credited', label: 'Credited' },
];

const FAILURE_STAGES = ['rejected', 'failed', 'returned'];

function stageIndex(stage) {
  const i = STAGES.findIndex((s) => s.key === stage);
  return i === -1 ? 0 : i;
}

function ClaimStepper({ stage }) {
  const isFailed = FAILURE_STAGES.includes(stage);
  const current = stageIndex(stage);
  return (
    <div className="flex items-center gap-1 mt-3">
      {STAGES.map((s, i) => {
        const done = !isFailed && i <= current;
        const isCurrent = !isFailed && i === current;
        return (
          <React.Fragment key={s.key}>
            <div className="flex flex-col items-center flex-shrink-0">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold border ${
                  isFailed && i === 0
                    ? 'bg-red-500 border-red-500 text-white'
                    : done
                    ? 'bg-sage-500 border-sage-500 text-white'
                    : 'bg-white border-brown-100 text-brown-400'
                } ${isCurrent ? 'ring-2 ring-sage-500/30' : ''}`}
              >
                {isFailed && i === 0 ? '!' : done && i < current ? '✓' : i + 1}
              </div>
              <span
                className={`text-[8px] mt-1 font-semibold text-center w-14 leading-tight ${
                  done ? 'text-brown-800' : 'text-brown-400'
                }`}
              >
                {s.label}
              </span>
            </div>
            {i < STAGES.length - 1 && (
              <div
                className={`flex-1 h-0.5 mb-4 rounded-full ${
                  i < current ? 'bg-sage-500' : 'bg-brown-100'
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default function DrawerClaims({ show, onClose, claims, claimsLoading, onSubmitClaim, showToast, isAuthed }) {
  const [showForm, setShowForm] = useState(false);
  const [insurer, setInsurer] = useState(INSURERS[0]);
  const [conditionSlug, setConditionSlug] = useState(CONDITIONS[0].slug);
  const [visitType, setVisitType] = useState(VISIT_TYPES[0]);

  const [amount, setAmount] = useState('');
  const [claimDate, setClaimDate] = useState('');
  const [uploadText, setUploadText] = useState('Select file (PDF, JPG or PNG)');
  const [uploadProgress, setUploadProgress] = useState(null);
  const [pickedFile, setPickedFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setPickedFile(f);
    setUploadText('Uploading...');
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setUploadText(`${f.name} (${(f.size / 1024).toFixed(0)} KB) ready`);
            setUploadProgress(null);
          }, 300);
          return 100;
        }
        return prev + 25;
      });
    }, 100);
  };

  const resetForm = () => {
    setAmount('');
    setClaimDate('');
    setInsurer(INSURERS[0]);
    setConditionSlug(CONDITIONS[0].slug);
    setVisitType(VISIT_TYPES[0]);

    setUploadText('Select file (PDF, JPG or PNG)');
    setUploadProgress(null);
    setPickedFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pickedFile) return;
    setSubmitting(true);
    const cond = CONDITIONS.find((c) => c.slug === conditionSlug) || CONDITIONS[0];
    const treatmentType = `${cond.name} — ${visitType}`;
    await onSubmitClaim({
      treatmentType,
      amount: amount || '120.00',
      insurer,
      claimType: 'self',
      file: pickedFile,
      claimDate: claimDate || undefined,
    });
    setSubmitting(false);
    resetForm();
    setShowForm(false);
  };


  const handleDownload = async (claim) => {
    if (!claim.filePath) { showToast('No file attached', 'error'); return; }
    const { data, error } = await supabase.storage
      .from('claim-receipts')
      .createSignedUrl(claim.filePath, 60);
    if (error) { showToast('Download failed: ' + error.message, 'error'); return; }
    window.open(data.signedUrl, '_blank');
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
        <h3 className="text-xl font-bold text-brown-800 font-serif">Your Claims</h3>
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
        {/* New submission */}
        <div className="bg-card border border-brown-100/70 rounded-2xl p-4 shadow-soft">
          <h4 className="text-sm font-semibold text-brown-800 mb-2 font-serif">File a New Claim</h4>
          <p className="text-xs text-brown-500 mb-4">
            Upload your specialist invoice and select your insurer. We'll route it through your plan.
          </p>
          <button
            onClick={() => setShowForm(!showForm)}
            disabled={!isAuthed}
            className="w-full py-2.5 bg-sage-500 text-white rounded-xl text-xs font-bold shadow hover:bg-sage-500/90 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {!isAuthed ? 'Sign in to submit a claim' : showForm ? 'Cancel Submission' : '+ Start New Submission'}
          </button>

          {showForm && (
            <form onSubmit={handleSubmit} className="mt-4 pt-4 border-t border-brown-100 space-y-4">
              <div>
                <label className="text-xs font-semibold text-brown-600 block mb-1">
                  Upload Practitioner Invoice Receipt
                </label>
                <label className="relative block border-2 border-dashed border-brown-100 hover:border-brown-400 bg-cream rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors">
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={handleFileChange} />
                  <svg className="w-6 h-6 text-brown-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span className="text-[10px] text-brown-500 font-medium text-center">{uploadText}</span>
                  {uploadProgress !== null && (
                    <div className="w-full bg-brown-100 h-1 rounded-full overflow-hidden mt-2">
                      <div className="bg-terracotta-500 h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                    </div>
                  )}
                </label>
              </div>

              <div>
                <label className="text-xs font-semibold text-brown-600 block mb-1">Select Insurer</label>
                <select
                  value={insurer}
                  onChange={(e) => setInsurer(e.target.value)}
                  className="w-full bg-cream border border-brown-100 rounded-xl p-2.5 text-xs text-brown-800 focus:outline-none focus:border-sage-500"
                >
                  {INSURERS.map((i) => (<option key={i}>{i}</option>))}
                </select>
              </div>

              <div className="opacity-50 pointer-events-none">
                <label className="text-xs font-semibold text-brown-600 mb-1 flex items-center gap-2">
                  Agent
                  <span className="text-[9px] font-bold uppercase tracking-wider text-brown-400 bg-brown-100 px-1.5 py-0.5 rounded">
                    Coming soon
                  </span>
                </label>
                <select disabled className="w-full bg-brown-100/40 border border-brown-100 rounded-xl p-2.5 text-xs text-brown-400 cursor-not-allowed">
                  <option>Assign agent (unavailable)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-brown-600 block mb-1">Condition</label>
                <select
                  value={conditionSlug}
                  onChange={(e) => setConditionSlug(e.target.value)}
                  className="w-full bg-cream border border-brown-100 rounded-xl p-2.5 text-xs text-brown-800 focus:outline-none focus:border-sage-500"
                >
                  {CONDITIONS.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name} • {c.specialist}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-brown-600 block mb-1">Visit Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {VISIT_TYPES.map((v) => {
                    const active = visitType === v;
                    return (
                      <button
                        type="button"
                        key={v}
                        onClick={() => setVisitType(v)}
                        className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                          active
                            ? 'bg-sage-500 text-white border-sage-500'
                            : 'bg-cream text-brown-600 border-brown-100 hover:border-brown-400'
                        }`}
                      >
                        {v}
                      </button>
                    );
                  })}
                </div>
              </div>


              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-brown-600 block mb-1">Amount (RM)</label>
                  <input value={amount} onChange={(e) => setAmount(e.target.value)} type="number" placeholder="120.00"
                    className="w-full bg-cream border border-brown-100 rounded-xl p-2.5 text-xs text-brown-800 focus:outline-none focus:border-sage-500" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-brown-600 block mb-1">Date</label>
                  <input value={claimDate} onChange={(e) => setClaimDate(e.target.value)} type="date"
                    className="w-full bg-cream border border-brown-100 rounded-xl p-2.5 text-xs text-brown-800 focus:outline-none focus:border-sage-500" />
                </div>
              </div>

              <button
                type="submit"
                disabled={!pickedFile || submitting}
                className="w-full py-2 bg-terracotta-500 text-white text-xs font-bold rounded-xl shadow hover:bg-terracotta-500/90 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : pickedFile ? 'Submit Claim' : 'Upload receipt to continue'}
              </button>
            </form>
          )}
        </div>

        {/* Claims list */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-brown-400">Your Claims</h4>

          {claimsLoading ? (
            <p className="text-xs text-brown-400 italic px-1">Loading your claims...</p>
          ) : claims.length === 0 ? (
            <div className="p-6 bg-white rounded-2xl border border-dashed border-brown-100 text-center">
              <p className="text-xs font-semibold text-brown-600 mb-1">No claims yet</p>
              <p className="text-[10px] text-brown-400">
                {isAuthed ? 'Submit your first claim above to get started.' : 'Sign in to see and file claims.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {claims.map((claim) => {
                const stage = claim.stage || 'review';
                const claimType = claim.claimType || 'self';
                const isExpanded = expandedId === claim.id;
                const isFailed = FAILURE_STAGES.includes(stage);
                return (
                  <div
                    key={claim.id}
                    className="bg-white rounded-2xl border border-brown-100/50 shadow-sm animate-fade-in overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : claim.id)}
                      className="w-full p-4 text-left hover:bg-cream/40 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-brown-800 font-serif truncate">
                            {claim.service}
                          </p>
                          <p className="text-[10px] text-brown-400 mt-0.5">
                            {claim.date}
                            {claim.insurer ? ` • ${claim.insurer.split(' (')[0]}` : ''}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-xs font-bold text-brown-800">RM {claim.amount}</p>
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold mt-1 ${
                              isFailed
                                ? 'bg-red-100 text-red-600'
                                : claimType === 'self'
                                ? 'bg-sage-500/10 text-sage-500'
                                : 'bg-brown-100 text-brown-600'
                            }`}
                          >
                            {isFailed ? stage : claimType === 'self' ? 'Self claim' : claimType}
                          </span>
                        </div>
                      </div>
                      <ClaimStepper stage={stage} />
                    </button>

                    {isExpanded && (
                      <div className="px-4 pb-4 pt-2 border-t border-brown-100/60 space-y-3 bg-cream/30">
                        {(isFailed || claim.remarks) && (
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-brown-400 mb-1">
                              {isFailed ? 'Failure remarks' : 'Remarks'}
                            </p>
                            <p className={`text-xs leading-relaxed p-2.5 rounded-lg ${
                              isFailed ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-white text-brown-600 border border-brown-100'
                            }`}>
                              {claim.remarks || 'No remarks added yet.'}
                            </p>
                          </div>
                        )}

                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-brown-400 mb-1">
                            Receipt
                          </p>
                          {claim.filePath ? (
                            <button
                              onClick={() => handleDownload(claim)}
                              className="w-full flex items-center justify-between gap-2 p-2.5 bg-white rounded-lg border border-brown-100 hover:border-sage-500 transition-colors"
                            >
                              <span className="text-xs text-brown-700 truncate">{claim.fileName || 'Receipt file'}</span>
                              <span className="flex items-center gap-1 text-[10px] font-bold text-sage-500 flex-shrink-0">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
                                </svg>
                                Download
                              </span>
                            </button>
                          ) : (
                            <p className="text-[10px] text-brown-400 italic">No file attached.</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
