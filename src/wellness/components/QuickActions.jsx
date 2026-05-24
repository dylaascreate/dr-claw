import React from 'react';

const actions = [
  {
    key: 'book',
    label: 'Book',
    icon: (
      <svg className="w-5 h-5 text-brown-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="12" y1="14" x2="12" y2="18"/><line x1="10" y1="16" x2="14" y2="16"/>
      </svg>
    ),
  },
  {
    key: 'explore',
    label: 'Explore',
    icon: (
      <svg className="w-5 h-5 text-brown-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
      </svg>
    ),
  },
  {
    key: 'claims',
    label: 'Claims',
    icon: (
      <svg className="w-5 h-5 text-brown-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/>
      </svg>
    ),
  },
  {
    key: 'track',
    label: 'Track',
    icon: (
      <svg className="w-5 h-5 text-brown-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
      </svg>
    ),
  },
];

export default function QuickActions({ onOpenDrawer }) {
  return (
    <div className="bg-white rounded-2xl shadow-soft p-3 mp-anim mp-anim-2">
      <div className="flex gap-1">
        {actions.map((action) => (
          <button
            key={action.key}
            onClick={() => onOpenDrawer(action.key)}
            className="flex-1 flex flex-col items-center justify-center py-3 px-2 rounded-xl hover:bg-cream active:scale-95 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-2 bg-cream group-hover:bg-brown-100/60 transition-colors">
              {action.icon}
            </div>
            <span className="text-xs font-semibold text-brown-600">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
