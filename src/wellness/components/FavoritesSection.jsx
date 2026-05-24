import React from 'react';

export default function FavoritesSection({ favCount, onOpenFavorites }) {
  return (
    <button
      onClick={onOpenFavorites}
      className="w-full bg-white rounded-2xl p-4 shadow-soft flex items-center justify-between group active:scale-[0.98] transition-transform mp-anim mp-anim-4 hover:shadow-md border border-white"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-terracotta-100 flex items-center justify-center text-terracotta-500">
          <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="rgba(68, 146, 128, 0.2)" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        </div>
        <div className="text-left">
          <h3 className="text-lg text-brown-800 font-semibold leading-tight font-serif">Your Favorites</h3>
          <p className="text-sm text-brown-600">
            {favCount} saved practitioner{favCount !== 1 ? 's' : ''}
          </p>
        </div>
      </div>
      <div className="w-8 h-8 rounded-full bg-brown-100/50 flex items-center justify-center text-brown-600 group-hover:bg-brown-100 transition-colors">
        <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
      </div>
    </button>
  );
}
