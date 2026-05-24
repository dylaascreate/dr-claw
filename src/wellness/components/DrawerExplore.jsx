import React from 'react';

const TREATMENTS = [
  {
    name: 'Endocrinology Consultation',
    short: 'Endocrinology',
    price: 280,
    duration: 45,
    desc: 'Specialist review for diabetes, thyroid, and hormonal conditions. Includes medication assessment and HbA1c interpretation.',
    img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=200&auto=format&fit=crop',
  },
  {
    name: 'Cardiology Follow-up',
    short: 'Cardiology',
    price: 320,
    duration: 45,
    desc: 'Cardiac risk review for hypertension and heart disease management. ECG and blood pressure monitoring included.',
    img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=200&auto=format&fit=crop',
  },
  {
    name: 'Nephrology Assessment',
    short: 'Nephrology',
    price: 260,
    duration: 40,
    desc: 'Kidney function evaluation for CKD monitoring. Includes eGFR, creatinine, and urine protein review.',
    img: 'https://images.unsplash.com/photo-1666214280391-8ff5bd3c0bf0?q=80&w=200&auto=format&fit=crop',
  },
];

export default function DrawerExplore({ show, onClose, onQuickBook }) {
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
        <h3 className="text-xl font-bold text-brown-800 font-serif">Explore Specialists</h3>
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
        {/* Membership Banner */}
        <div className="relative bg-gradient-to-tr from-sage-500 to-terracotta-500 text-white rounded-3xl p-5 overflow-hidden shadow-soft">
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full pointer-events-none"></div>
          <h4 className="text-lg font-bold mb-1 font-serif">Care Plan Active</h4>
          <p className="text-xs text-white/80 leading-relaxed max-w-[80%]">
            You have 2 unused specialist consultations. Book your next follow-up to stay on track with your care plan.
          </p>
        </div>

        {/* Treatment list */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-brown-400 uppercase tracking-wider">
            Specialist Departments
          </h4>

          {TREATMENTS.map((t) => (
            <div
              key={t.name}
              className="p-4 bg-white rounded-2xl shadow-sm border border-brown-100/40 flex gap-4 hover:shadow-md transition-shadow"
            >
              <img src={t.img} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" alt={t.name} />
              <div className="flex-1">
                <h5 className="text-base font-semibold text-brown-800 font-serif">{t.name}</h5>
                <p className="text-xs text-brown-500 mt-1 leading-relaxed">{t.desc}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-sm font-bold text-sage-500">${t.price} • {t.duration} min</span>
                  <button
                    onClick={() => onQuickBook(t.short)}
                    className="text-xs font-semibold text-terracotta-500 hover:underline active:scale-95 transition-transform"
                  >
                    Quick Book
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
