import React, { useState } from 'react';

export default function DrawerClaims({ show, onClose, claims, onSubmitClaim, showToast }) {
  const [showForm, setShowForm] = useState(false);
  const [treatmentType, setTreatmentType] = useState('Endocrinology Consultation');
  const [amount, setAmount] = useState('');
  const [claimDate, setClaimDate] = useState('');
  const [uploadText, setUploadText] = useState('Select file (PDF, JPG or PNG)');
  const [uploadProgress, setUploadProgress] = useState(null);

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
          }, 500);
          return 100;
        }
        return prev + 20;
      });
    }, 150);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalAmount = amount || '120.00';
    const finalDate = claimDate || new Date().toISOString().split('T')[0];
    const parsedDate = new Date(finalDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const ref = Math.floor(Math.random() * 9000) + 1000;

    onSubmitClaim({
      id: ref,
      title: treatmentType,
      refCode: `CLM-${ref}`,
      date: parsedDate,
      amount: parseFloat(finalAmount).toFixed(2),
      status: 'Processing'
    });

    // Reset Form
    setAmount('');
    setClaimDate('');
    setShowForm(false);
    setUploadText('Select file (PDF, JPG or PNG)');
    setUploadProgress(null);
    showToast('Document uploaded and claim filed!');
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
      ></div>

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
        {/* Submit New Claim Card */}
        <div className="bg-card border border-brown-100/70 rounded-2xl p-4 shadow-soft">
          <h4 className="text-sm font-semibold text-brown-800 mb-2 font-serif">File a New Claim</h4>
          <p className="text-xs text-brown-500 mb-4">
            Submit specialist invoices from your chronic care consultations for reimbursement under your insurance plan.
          </p>
          <button
            onClick={() => setShowForm(!showForm)}
            className="w-full py-2.5 bg-sage-500 text-white rounded-xl text-xs font-bold shadow hover:bg-sage-500/90 active:scale-95 transition-all"
          >
            {showForm ? 'Cancel Submission' : '+ Start New Submission'}
          </button>

          {/* Claim Form */}
          {showForm && (
            <form onSubmit={handleSubmit} className="mt-4 pt-4 border-t border-brown-100 space-y-4">
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
                  <option>General Chronic Care Review</option>
                  <option>HbA1c Blood Panel</option>
                  <option>Comprehensive Metabolic Screen</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-brown-600 block mb-1">Amount ($)</label>
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
                  <span className="text-[10px] text-brown-500 font-medium">{uploadText}</span>
                  {uploadProgress !== null && (
                    <div className="w-full bg-brown-100 h-1 rounded-full overflow-hidden mt-2">
                      <div className="bg-terracotta-500 h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                  )}
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-terracotta-500 text-white text-xs font-bold rounded-xl shadow hover:bg-terracotta-500/90 active:scale-95 transition-all"
              >
                Submit Document
              </button>
            </form>
          )}
        </div>

        {/* Claims list */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-brown-400">Previous Claims</h4>

          <div className="space-y-2">
            {claims.map((claim) => (
              <div
                key={claim.id}
                className="p-3 bg-white rounded-xl border border-brown-100/50 flex items-center justify-between shadow-sm animate-fade-in"
              >
                <div>
                  <p className="text-xs font-bold text-brown-800 font-serif">{claim.title}</p>
                  <p className="text-[10px] text-brown-400">Claim Ref: {claim.refCode} • {claim.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-brown-800">${claim.amount}</p>
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold ${
                      claim.status === 'Approved'
                        ? 'bg-terracotta-100 text-terracotta-500'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {claim.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
