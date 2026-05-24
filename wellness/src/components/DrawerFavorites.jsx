import React from 'react';

export default function DrawerFavorites({ show, onClose, favorites, onToggleFavorite, onBookPractitioner }) {
  return (
    <div
      className={`absolute bottom-0 left-0 right-0 h-[80%] bg-cream rounded-t-[32px] shadow-premium z-50 transform transition-transform duration-300 ease-out flex flex-col overflow-hidden ${
        show ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div
        className="w-12 h-1.5 bg-brown-400/30 rounded-full mx-auto my-3 flex-shrink-0 cursor-pointer"
        onClick={onClose}
      ></div>

      <div className="px-5 pb-3 border-b border-brown-100 flex items-center justify-between">
        <h3 className="text-xl font-bold text-brown-800 font-serif">Your Favorites</h3>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-brown-100 flex items-center justify-center text-brown-600 hover:bg-brown-100/80"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-4 text-left">
        {favorites.length === 0 ? (
          <p className="text-xs text-brown-400 text-center py-12">You have no saved favorites.</p>
        ) : (
          favorites.map((fav) => (
            <div
              key={fav.id}
              className="p-3.5 bg-white rounded-2xl border border-brown-100/50 flex justify-between items-center shadow-sm transition-all"
            >
              <div className="flex items-center gap-3">
                <img
                  src={fav.avatar}
                  className="w-11 h-11 rounded-full object-cover border border-brown-100 flex-shrink-0"
                  alt={fav.name}
                />
                <div>
                  <h4 className="text-sm font-semibold text-brown-800 font-serif">{fav.name}</h4>
                  <p className="text-xs text-brown-500">
                    {fav.specialty} • ★ {fav.rating}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onBookPractitioner(fav.name, fav.defaultService)}
                  className="px-3 py-1.5 bg-sage-500 text-white rounded-lg text-xs font-medium hover:bg-sage-500/90 active:scale-95 transition-all"
                >
                  Book
                </button>
                <button
                  onClick={() => onToggleFavorite(fav.id)}
                  className="p-1.5 text-terracotta-500 hover:scale-115 active:scale-95 transition-all"
                  aria-label="Remove from favorites"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
