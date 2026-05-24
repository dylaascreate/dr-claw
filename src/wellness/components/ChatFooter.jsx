import React from 'react';

export default function ChatFooter({ chatInput, setChatInput, onSend, onFocus, onSimulateVoice, onSimulateAttachment }) {
  const hasContent = chatInput.trim().length > 0;

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSend();
    }
  };

  const insertEmoji = (emoji) => {
    setChatInput((prev) => prev + emoji);
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 z-40 mp-anim-footer bg-cream/90 backdrop-blur-md border-t border-brown-100/20">
      <div className="h-4 bg-gradient-to-t from-cream to-transparent pointer-events-none -mt-4"></div>
      <div className="px-3 pb-4 pt-2">
        <div className="flex items-end gap-2">
          <div className="flex-1 flex items-end bg-card rounded-3xl shadow-soft border border-brown-100/70 pl-3 pr-2 py-1.5 min-h-[44px]">
            <button
              onClick={() => { onFocus?.(); insertEmoji('😊'); }}
              type="button"
              className="w-8 h-8 flex items-center justify-center text-brown-600 hover:text-brown-800 hover:scale-110 transition-all flex-shrink-0"
              aria-label="Emoji"
            >
              <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
            </button>
            <input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={handleKeyPress}
              onFocus={onFocus}
              type="text"
              placeholder="Message Aura AI..."
              className="flex-1 bg-transparent outline-none text-sm text-brown-800 placeholder:text-brown-400 px-2 py-1.5"
              aria-label="Message"
            />
            <button
              onClick={() => { onFocus?.(); onSimulateAttachment?.(); }}
              type="button"
              className="w-8 h-8 flex items-center justify-center text-brown-600 hover:text-brown-800 hover:scale-110 transition-all flex-shrink-0"
              aria-label="Attach"
            >
              <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </button>
          </div>
          <button
            onClick={() => { onFocus?.(); hasContent ? onSend() : onSimulateVoice?.(); }}
            type="button"
            className="w-11 h-11 rounded-full bg-sage-500 hover:bg-sage-500/90 flex items-center justify-center text-white shadow-soft flex-shrink-0 transition-all active:scale-95"
            aria-label={hasContent ? 'Send' : 'Voice message'}
          >
            {hasContent ? (
              <svg className="w-5 h-5 -ml-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            ) : (
              <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
