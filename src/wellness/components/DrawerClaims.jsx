import React, { useState } from 'react';

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

function stageIndex(stage) {
  const i = STAGES.findIndex((s) => s.key === stage);
  return i === -1 ? 0 : i;
}

function ClaimStepper({ stage }) {
  const current = stageIndex(stage);
  return (
    <div className="flex items-center gap-1 mt-3">
      {STAGES.map((s, i) => {
        const done = i <= current;
        const isCurrent = i === current;
        return (
          <React.Fragment key={s.key}>
            <div className="flex flex-col items-center flex-shrink-0">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold border ${
                  done
                    ? 'bg-sage-500 border-sage-500 text-white'
                    : 'bg-white border-brown-100 text-brown-400'
                } ${isCurrent ? 'ring-2 ring-sage-500/30' : ''}`}
              >
                {done && i < current ? '✓' : i + 1}
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

export default function DrawerClaims({ show, onClose, claims, onSubmitClaim, showToast }) {
  const [showForm, setShowForm] = useState(false);
  const [insurer, setInsurer] = useState(INSURERS[0]);
  const [treatmentType, setTreatmentType] = useState('Endocrinology Consultation');
  const [amount, setAmount] = useState('');
  const [claimDate, setClaimDate] = useState('');
  const [uploadText, setUploadText] = useState('Select file (PDF, JPG or PNG)');
  const [uploadProgress, setUploadProgress] = useState(null);
  const [fileUploaded, setFileUploaded] = useState(false);

  const simulateFileUpload = () => {
    setUploadText('Uploading Invoice Receipt...');
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setUploadText('invoice_rec_8832.pdf (1.2 MB) Uploaded');
            setUploadProgress(null);
            setFileUploaded(true);
          }, 400);
          return 100;
        }
        return prev + 20;
      });
    }, 130);
  };

  const resetForm = () => {
    setAmount('');
    setClaimDate('');
    setInsurer(INSURERS[0]);
    setTreatmentType('Endocrinology Consultation');
    setUploadText('Select file (PDF, JPG or PNG)');
    setUploadProgress(null);
    setFileUploaded(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalAmount = amount || '120.00';
    onSubmitClaim({
      treatmentType,
      amount: finalAmount,
      insurer,
      claimType: 'self',
    });
    resetForm();
    setShowForm(false);
    showToast('📋 Claim submitted — now in stage 1: Submitted');
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
            className="w-full py-2.5 bg-sage-500 text-white rounded-xl text-xs font-bold shadow hover:bg-sage-500/90 active:scale-95 transition-all"
          >
            {showForm ? 'Cancel Submission' : '+ Start New Submission'}
          </button>

          {showForm && (
            <form onSubmit={handleSubmit} className="mt-4 pt-4 border-t border-brown-100 space-y-4">
              {/* Upload first */}
              <div>
                <label className="text-xs font-semibold text-brown-600 block mb-1">
                  Upload Practitioner Invoice Receipt
                </label>
                <div
                  className="relative border-2 border-dashed border-brown-100 hover:border-brown-400 bg-cream rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors"
                  onClick={simulateFileUpload}
                >
                  <svg className="w-6 h-6 text-brown-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span className="text-[10px] text-brown-500 font-medium text-center">{uploadText}</span>
                  {uploadProgress !== null && (
                    <div className="w-full bg-brown-100 h-1 rounded-full overflow-hidden mt-2">
                      <div className="bg-terracotta-500 h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                    </div>
                  )}
                </div>
              </div>

              {/* Insurer dropdown */}
              <div>
                <label className="text-xs font-semibold text-brown-600 block mb-1">Select Insurer</label>
                <select
                  value={insurer}
                  onChange={(e) => setInsurer(e.target.value)}
                  className="w-full bg-cream border border-brown-100 rounded-xl p-2.5 text-xs text-brown-800 focus:outline-none focus:border-sage-500"
                >
                  {INSURERS.map((i) => (
                    <option key={i}>{i}</option>
                  ))}
                </select>
              </div>

              {/* Agent — disabled */}
              <div className="opacity-50 pointer-events-none">
                <label className="text-xs font-semibold text-brown-600 block mb-1 flex items-center gap-2">
                  Agent
                  <span className="text-[9px] font-bold uppercase tracking-wider text-brown-400 bg-brown-100 px-1.5 py-0.5 rounded">
                    Coming soon
                  </span>
                </label>
                <select
                  disabled
                  className="w-full bg-brown-100/40 border border-brown-100 rounded-xl p-2.5 text-xs text-brown-400 cursor-not-allowed"
                >
                  <option>Assign agent (unavailable)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-brown-600 block mb-1">Treatment Type</label>
                <select
                  value={treatmentType}
                  onChange={(e) => setTreatmentType(e.target.value)}
                  className="w-full bg-cream border border-brown-100 rounded-xl p-2.5 text-xs text-brown-800 focus:outline-none focus:border-sage-500"
                >
                  <option>Endocrinology Consultation</option>
                  <option>Cardiology Follow-up</option>
                  <option>Nephrology Assessment</option>
                  <option>Vascular Surgeon Review</option>
                  <option>General Chronic Care Review</option>
                  <option>HbA1c Blood Panel</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-brown-600 block mb-1">Amount (RM)</label>
                  <input
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    type="number"
                    placeholder="120.00"
                    className="w-full bg-cream border border-brown-100 rounded-xl p-2.5 text-xs text-brown-800 focus:outline-none focus:border-sage-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-brown-600 block mb-1">Date</label>
                  <input
                    value={claimDate}
                    onChange={(e) => setClaimDate(e.target.value)}
                    type="date"
                    className="w-full bg-cream border border-brown-100 rounded-xl p-2.5 text-xs text-brown-800 focus:outline-none focus:border-sage-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={!fileUploaded}
                className="w-full py-2 bg-terracotta-500 text-white text-xs font-bold rounded-xl shadow hover:bg-terracotta-500/90 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {fileUploaded ? 'Submit Claim' : 'Upload receipt to continue'}
              </button>
            </form>
          )}
        </div>

        {/* Claims list */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-brown-400">Your Claims</h4>

          <div className="space-y-3">
            {claims.map((claim, idx) => {
              const stage = claim.stage || (claim.status === 'approved' ? 'credited' : 'review');
              const claimType = claim.claimType || 'self';
              return (
                <div
                  key={claim.id ?? idx}
                  className="p-4 bg-white rounded-2xl border border-brown-100/50 shadow-sm animate-fade-in"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-brown-800 font-serif truncate">
                        {claim.service || claim.title}
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
                          claimType === 'self'
                            ? 'bg-sage-500/10 text-sage-500'
                            : 'bg-brown-100 text-brown-600'
                        }`}
                      >
                        {claimType === 'self' ? 'Self claim' : claimType}
                      </span>
                    </div>
                  </div>
                  <ClaimStepper stage={stage} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
