import React from 'react';

export default function AppointmentCard({ appointment, onCheckIn, onOpenReschedule }) {
  const { title, practitioner, date, time, location, avatar, checkedIn } = appointment;

  return (
    <div className="bg-card rounded-3xl p-5 shadow-soft relative overflow-hidden mp-anim mp-anim-1 hover:shadow-md transition-shadow duration-300">
      <div className="absolute -right-10 -top-10 w-32 h-32 bg-sage-100 rounded-full opacity-50 pointer-events-none"></div>

      <div className="flex items-center gap-4 relative z-10">
        <div className="w-16 h-16 rounded-2xl bg-sage-100 flex-shrink-0 overflow-hidden shadow-sm">
          <img src={avatar} alt={practitioner} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg text-brown-800 leading-tight mb-1 font-semibold">{title}</h3>
          <p className="text-sm text-brown-600 mb-3 font-medium">with {practitioner}</p>

          <div className="space-y-2">
            <div className="flex items-center text-xs text-brown-600">
              <svg className="w-3.5 h-3.5 mr-2 text-sage-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <span>{date}</span>
            </div>
            <div className="flex items-center text-xs text-brown-600">
              <svg className="w-3.5 h-3.5 mr-2 text-sage-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span>{time}</span>
            </div>
            <div className="flex items-center text-xs text-brown-600">
              <svg className="w-3.5 h-3.5 mr-2 text-sage-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <span>{location}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-brown-100 flex gap-3 relative z-10">
        <button
          onClick={onOpenReschedule}
          className="flex-1 py-2.5 rounded-xl text-sm font-medium text-brown-800 bg-brown-100 hover:bg-brown-100/80 active:scale-95 transition-all"
        >
          Reschedule
        </button>
        {checkedIn ? (
          <button
            disabled
            className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-sage-100 text-sage-500 cursor-default flex items-center justify-center gap-1.5"
          >
            <svg className="w-4 h-4 text-sage-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4" />
            </svg>
            Checked in
          </button>
        ) : (
          <button
            onClick={onCheckIn}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white bg-sage-500 hover:bg-sage-500/90 active:scale-95 transition-all shadow-sm flex items-center justify-center gap-1.5"
          >
            Check in
          </button>
        )}
      </div>
    </div>
  );
}
