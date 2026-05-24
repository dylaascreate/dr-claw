import React from 'react';
import { Link } from '@tanstack/react-router';
import { CATEGORIES, getConditionsByCategory } from '../data/conditions';

export default function DrawerExplore({ show, onClose }) {
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
          <h3 className="text-xl font-bold text-brown-800 font-serif">
            Explore Chronic Disease Management
          </h3>
          <p className="text-xs text-brown-500 mt-0.5">
            Grouped by the 4 main vascular families + other chronic conditions.
          </p>
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

      <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-8 text-left">
        {CATEGORIES.map((cat, idx) => {
          const items = getConditionsByCategory(cat.id);
          if (items.length === 0) return null;
          const isOther = cat.id === 'other';
          return (
            <section key={cat.id} className="space-y-3">
              <div className="flex items-baseline gap-2 px-1">
                <span className="text-[10px] font-bold text-terracotta-500 tabular-nums">
                  {isOther ? '+' : `0${idx + 1}`}
                </span>
                <h4 className="text-sm font-semibold text-brown-800 uppercase tracking-wider">
                  {cat.label}
                </h4>
              </div>
              <p className="text-[11px] text-brown-500 px-1 -mt-1">{cat.blurb}</p>

              <div className="grid grid-cols-2 gap-3">
                {items.map((c) => (
                  <Link
                    key={c.slug}
                    to="/conditions/$slug"
                    params={{ slug: c.slug }}
                    onClick={onClose}
                    className="text-left p-3 bg-white rounded-2xl shadow-sm border border-brown-100/40 hover:shadow-md hover:border-sage-500/40 transition-all active:scale-[0.98] flex flex-col"
                  >
                    <div className="w-full aspect-[4/3] rounded-xl overflow-hidden mb-3 bg-brown-100/40">
                      <img src={c.img} alt={c.name} className="w-full h-full object-cover" />
                    </div>
                    <h5 className="text-sm font-semibold text-brown-800 font-serif leading-tight">
                      {c.name}
                    </h5>
                    <p className="text-[11px] text-brown-500 mt-1 leading-snug line-clamp-2">
                      {c.desc}
                    </p>
                    <span className="mt-2 text-[11px] font-semibold text-terracotta-500">
                      Learn more →
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
