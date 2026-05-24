import React from 'react';

export default function NotificationsPanel({ show, onClose, notifications, onClear }) {
  if (!show) return null;

  return (
    <div className="absolute top-20 right-5 left-5 bg-white/95 backdrop-blur-md rounded-2xl shadow-premium border border-brown-100/50 p-4 z-50 transition-all duration-300">
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-sm font-semibold text-brown-800">Recent Notifications</h4>
        {notifications.length > 0 && (
          <button onClick={onClear} className="text-xs text-sage-500 hover:underline">
            Mark all read
          </button>
        )}
      </div>
      <div className="space-y-3 max-h-[220px] overflow-y-auto custom-scrollbar pr-1">
        {notifications.length === 0 ? (
          <p className="text-xs text-brown-400 text-center py-4">No new notifications</p>
        ) : (
          notifications.map((notif) => (
            <div key={notif.id} className="flex items-start gap-3 p-2 bg-cream/50 rounded-xl">
              <div className="w-2.5 h-2.5 mt-2 rounded-full bg-terracotta-500 flex-shrink-0"></div>
              <div>
                <p className="text-xs text-brown-800 font-medium">{notif.text}</p>
                <p className="text-[10px] text-brown-400 mt-0.5">{notif.time}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
