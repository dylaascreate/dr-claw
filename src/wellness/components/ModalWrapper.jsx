import React from 'react';

export default function ModalWrapper({ show, onClose, children }) {
  if (!show) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-brown-800/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 transition-opacity duration-300"
    >
      <div
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking modal content
        className="w-full max-w-sm"
      >
        {children}
      </div>
    </div>
  );
}
