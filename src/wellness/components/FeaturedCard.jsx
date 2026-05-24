import React from 'react';

export default function FeaturedCard({ onOpenExplore }) {
  return (
    <div className="space-y-3 mp-anim mp-anim-3">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-2xl text-brown-800">Browse</h2>
        <button
          onClick={onOpenExplore}
          className="text-sm font-semibold text-sage-500 flex items-center gap-1 hover:opacity-80 transition-opacity"
        >
          See all
          <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </button>
      </div>

      <div
        onClick={onOpenExplore}
        className="relative h-48 rounded-3xl overflow-hidden shadow-soft group cursor-pointer border border-white/20"
      >
        <img
          src="https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?q=80&w=800&auto=format&fit=crop"
          alt="Spa treatments"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brown-800/90 via-brown-800/35 to-transparent"></div>

        <div className="absolute bottom-0 left-0 right-0 p-5">
          <span className="inline-block px-3 py-1 bg-white/25 backdrop-blur-md rounded-full text-white text-xs font-semibold mb-2 border border-white/30">
            Featured
          </span>
          <h3 className="text-white text-2xl mb-1 leading-tight">Signature Treatments</h3>
          <p className="text-white/80 text-sm">Discover our most popular relaxing experiences.</p>
        </div>
      </div>
    </div>
  );
}
