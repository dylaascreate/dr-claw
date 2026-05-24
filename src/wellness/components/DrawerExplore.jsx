import React from 'react';
import { Link } from '@tanstack/react-router';
import { CONDITIONS } from '../data/conditions';


const CONDITIONS = [
  {
    name: "Alzheimer's Disease",
    desc: 'Memory care, cognitive assessments, and caregiver support resources.',
    img: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?q=80&w=200&auto=format&fit=crop',
  },
  {
    name: 'Arthritis',
    desc: 'Joint pain management, mobility programs, and rheumatology follow-ups.',
    img: 'https://images.unsplash.com/photo-1599045118108-bf9954418b76?q=80&w=200&auto=format&fit=crop',
  },
  {
    name: 'Cancer',
    desc: 'Oncology care plans, screening reminders, and survivorship support.',
    img: 'https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?q=80&w=200&auto=format&fit=crop',
  },
  {
    name: 'Chronic Kidney Disease',
    desc: 'eGFR monitoring, nephrology reviews, and dietary guidance.',
    img: 'https://images.unsplash.com/photo-1666214280391-8ff5bd3c0bf0?q=80&w=200&auto=format&fit=crop',
  },
  {
    name: 'Chronic Liver Disease',
    desc: 'Hepatology consults, LFT tracking, and lifestyle interventions.',
    img: 'https://images.unsplash.com/photo-1581595219315-a187dd40c322?q=80&w=200&auto=format&fit=crop',
  },
  {
    name: 'Chronic Respiratory Diseases',
    desc: 'COPD & asthma management, spirometry, and pulmonology care.',
    img: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?q=80&w=200&auto=format&fit=crop',
  },
  {
    name: 'Diabetes',
    desc: 'HbA1c monitoring, endocrinology reviews, and nutrition coaching.',
    img: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=200&auto=format&fit=crop',
  },
  {
    name: 'Heart Disease',
    desc: 'Cardiac risk reviews, BP tracking, and cardiology follow-ups.',
    img: 'https://images.unsplash.com/photo-1628348070889-cb656235b4eb?q=80&w=200&auto=format&fit=crop',
  },
  {
    name: 'Mental Health Disorders',
    desc: 'Therapy access, mood tracking, and psychiatric care coordination.',
    img: 'https://images.unsplash.com/photo-1494256997604-768d1f608cac?q=80&w=200&auto=format&fit=crop',
  },
  {
    name: 'Obesity',
    desc: 'Weight management programs, metabolic health, and lifestyle support.',
    img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=200&auto=format&fit=crop',
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
        <div>
          <h3 className="text-xl font-bold text-brown-800 font-serif">Explore Chronic Disease Management</h3>
          <p className="text-xs text-brown-500 mt-0.5">Pick a condition to learn more and book care.</p>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-brown-100 flex items-center justify-center text-brown-600 hover:bg-brown-100/80 flex-shrink-0 ml-3"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-6 text-left">
        {/* Learn-all banner */}
        <button
          onClick={() => onQuickBook('All Chronic Conditions')}
          className="w-full text-left relative bg-gradient-to-tr from-sage-500 to-terracotta-500 text-white rounded-3xl p-5 overflow-hidden shadow-soft hover:shadow-md transition-shadow active:scale-[0.99]"
        >
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full pointer-events-none"></div>
          <span className="inline-block px-2.5 py-0.5 bg-white/25 backdrop-blur-md rounded-full text-white text-[10px] font-semibold mb-2 border border-white/30 uppercase tracking-wider">
            Overview
          </span>
          <h4 className="text-lg font-bold mb-1 font-serif">Learn About All Chronic Conditions</h4>
          <p className="text-xs text-white/85 leading-relaxed max-w-[85%]">
            A complete guide to managing long-term conditions — symptoms, monitoring, and care pathways.
          </p>
        </button>

        {/* Condition grid */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-brown-400 uppercase tracking-wider px-1">
            Common Chronic Diseases
          </h4>

          <div className="grid grid-cols-2 gap-3">
            {CONDITIONS.map((c) => (
              <button
                key={c.name}
                onClick={() => onQuickBook(c.name)}
                className="text-left p-3 bg-white rounded-2xl shadow-sm border border-brown-100/40 hover:shadow-md hover:border-sage-500/40 transition-all active:scale-[0.98] flex flex-col"
              >
                <div className="w-full aspect-[4/3] rounded-xl overflow-hidden mb-3 bg-brown-100/40">
                  <img src={c.img} alt={c.name} className="w-full h-full object-cover" />
                </div>
                <h5 className="text-sm font-semibold text-brown-800 font-serif leading-tight">{c.name}</h5>
                <p className="text-[11px] text-brown-500 mt-1 leading-snug line-clamp-2">{c.desc}</p>
                <span className="mt-2 text-[11px] font-semibold text-terracotta-500">Learn more →</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
