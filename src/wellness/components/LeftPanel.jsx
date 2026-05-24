import React from 'react';

export default function LeftPanel() {
  return (
    <div className="hidden md:flex md:w-7/12 p-12 flex-col justify-between bg-gradient-to-tr from-[#0D2D45] to-[#1A6FA8] text-white relative overflow-hidden">
      {/* Decor circles */}
      <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-sage-500/10 blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-terracotta-500/15 blur-3xl pointer-events-none"></div>
      
      {/* Top Brand Header */}
      <div className="flex items-center gap-3 relative z-10">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-terracotta-500 to-sage-500 flex items-center justify-center shadow-lg border border-white/20">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white/90" style={{ fontFamily: "'Inter', sans-serif" }}>Dr Claw</h2>
          <p className="text-xs text-white/50">Chronic Disease Management</p>
        </div>
      </div>

      {/* Mid Section: Interactive Info */}
      <div className="space-y-6 max-w-md relative z-10 my-auto">
        <span className="inline-block px-3 py-1 bg-white/10 rounded-full text-xs font-semibold tracking-wider text-white/80 border border-white/20">DEMO ENVIRONMENT</span>
        <h1 className="text-5xl leading-tight font-light text-white">Manage your chronic conditions with confidence.</h1>
        <p className="text-white/70 text-base leading-relaxed">
          Welcome to Joel's care dashboard. Track specialist appointments, monitor lab results, submit insurance claims, and get personalised guidance from <strong>Dr Claw</strong> — your chronic care companion.
        </p>

        {/* Feature pills */}
        <div className="grid grid-cols-2 gap-3 pt-4">
          <div className="p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
            <h4 className="text-sm font-semibold text-white/90">Dr Claw Assistant</h4>
            <p className="text-xs text-white/60 mt-1">AI-guided chronic disease queries & medication reminders.</p>
          </div>
          <div className="p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
            <h4 className="text-sm font-semibold text-white/90">Specialist Scheduling</h4>
            <p className="text-xs text-white/60 mt-1">Book follow-ups with your care team instantly.</p>
          </div>
          <div className="p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
            <h4 className="text-sm font-semibold text-white/90">Insurance Claims</h4>
            <p className="text-xs text-white/60 mt-1">Submit specialist invoices with guided upload flows.</p>
          </div>
          <div className="p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
            <h4 className="text-sm font-semibold text-white/90">Lab Result Tracking</h4>
            <p className="text-xs text-white/60 mt-1">Monitor HbA1c, BP, cholesterol trends over time.</p>
          </div>
        </div>
      </div>

      {/* Bottom footer metadata */}
      <div className="flex items-center justify-between text-xs text-white/40 pt-6 border-t border-white/10 relative z-10">
        <span>Designed for iOS & Android</span>
        <span>Version 2.4.1</span>
      </div>
    </div>
  );
}
