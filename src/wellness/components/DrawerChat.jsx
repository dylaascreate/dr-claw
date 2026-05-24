import React, { useState, useEffect, useRef } from 'react';

export default function DrawerChat({ show, onClose, messages, onSendMessage, onSuggestedClick, inline = false }) {
  const [inputVal, setInputVal] = useState('');
  const historyRef = useRef(null);

  // Auto-scroll chat history on new messages
  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [messages, show, inline]);

  const handleSend = () => {
    if (inputVal.trim()) {
      onSendMessage(inputVal.trim());
      setInputVal('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const chatHeader = (
    <div className="px-5 py-4 border-b border-brown-100 flex items-center justify-between bg-white flex-shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-terracotta-500 to-sage-500 flex items-center justify-center text-white relative">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M14 12a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></span>
        </div>
        <div className="text-left">
          <h3 className="text-base font-semibold text-brown-800 font-serif">Aura AI</h3>
          <p className="text-xs text-brown-400">Chronic Care Assistant • Online</p>
        </div>
      </div>
      {!inline && (
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-brown-100 flex items-center justify-center text-brown-600 hover:bg-brown-100/80"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );

  const chatHistory = (
    <div ref={historyRef} className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-4 bg-cream/30">
      {messages.map((msg, index) => {
        const isUser = msg.sender === 'user';
        return (
          <div key={index} className={`flex items-start gap-3 ${isUser ? 'justify-end' : ''}`}>
            {!isUser && (
              <div className="w-8 h-8 rounded-full bg-sage-100 flex items-center justify-center text-sage-500 flex-shrink-0 text-xs font-semibold">
                A
              </div>
            )}
            <div
              className={`rounded-2xl p-3 max-w-[85%] text-sm shadow-sm ${
                isUser
                  ? 'bg-sage-500 text-white'
                  : 'bg-white text-brown-800 border border-brown-100/30 text-left'
              }`}
            >
              {msg.text}
            </div>
          </div>
        );
      })}
    </div>
  );

  const suggestionsPills = (
    <div className="px-5 py-3 flex gap-2 overflow-x-auto scrollbar-hide border-t border-brown-100 bg-white flex-shrink-0">
      <button
        onClick={() => onSuggestedClick('What is my HbA1c trend?')}
        className="px-3.5 py-1.5 bg-cream rounded-full text-xs font-medium text-brown-600 shadow-sm border border-brown-100 hover:bg-brown-100/30 whitespace-nowrap"
      >
        📊 HbA1c Trend
      </button>
      <button
        onClick={() => onSuggestedClick('How do I submit a claim?')}
        className="px-3.5 py-1.5 bg-cream rounded-full text-xs font-medium text-brown-600 shadow-sm border border-brown-100 hover:bg-brown-100/30 whitespace-nowrap"
      >
        📋 Submit Claim
      </button>
      <button
        onClick={() => onSuggestedClick('Remind me about my medication')}
        className="px-3.5 py-1.5 bg-cream rounded-full text-xs font-medium text-brown-600 shadow-sm border border-brown-100 hover:bg-brown-100/30 whitespace-nowrap"
      >
        💊 Medication
      </button>
      <button
        onClick={() => onSuggestedClick('Book a cardiology appointment')}
        className="px-3.5 py-1.5 bg-cream rounded-full text-xs font-medium text-brown-600 shadow-sm border border-brown-100 hover:bg-brown-100/30 whitespace-nowrap"
      >
        🫀 Book Cardiology
      </button>
    </div>
  );

  const activeInput = (
    <div className="px-4 pb-6 pt-3 bg-white border-t border-brown-100 flex-shrink-0">
      <div className="flex items-end gap-2">
        <div className="flex-1 flex items-end bg-cream rounded-3xl border border-brown-100/70 pl-3 pr-2 py-1.5 min-h-[44px]">
          <button
            onClick={() => setInputVal((prev) => prev + '😊')}
            type="button"
            className="w-8 h-8 flex items-center justify-center text-brown-600 hover:text-brown-800 hover:scale-110 transition-all flex-shrink-0"
            aria-label="Emoji"
          >
            <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
          </button>
          <input
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            type="text"
            placeholder="Message Aura AI..."
            className="flex-1 bg-transparent outline-none text-sm text-brown-800 placeholder:text-brown-400 px-2 py-1.5"
            aria-label="Message"
          />
          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center text-brown-600 hover:text-brown-800 hover:scale-110 transition-all flex-shrink-0"
            aria-label="Attach"
          >
            <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </button>
        </div>
        <button
          onClick={handleSend}
          type="button"
          className="w-11 h-11 rounded-full bg-sage-500 hover:bg-sage-500/90 flex items-center justify-center text-white shadow-soft flex-shrink-0 transition-all active:scale-95"
          aria-label={inputVal.trim().length > 0 ? 'Send' : 'Voice message'}
        >
          {inputVal.trim().length > 0 ? (
            <svg className="w-5 h-5 -ml-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          ) : (
            <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
          )}
        </button>
      </div>
    </div>
  );

  if (inline) {
    return (
      <div className="w-full h-full flex flex-col overflow-hidden bg-white border-l border-brown-100">
        {chatHeader}
        {chatHistory}
        {suggestionsPills}
        {activeInput}
      </div>
    );
  }

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
      {chatHeader}
      {chatHistory}
      {suggestionsPills}
      {activeInput}
    </div>
  );
}
