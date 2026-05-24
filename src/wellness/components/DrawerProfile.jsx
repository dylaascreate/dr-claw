import React, { useState } from 'react';

// ── Icons ─────────────────────────────────────────────────────────────────────

const IconChevron = () => (
  <svg className="w-4 h-4 text-brown-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

const IconBack = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);

const IconClose = ({ onClick }) => (
  <button
    onClick={onClick}
    className="w-8 h-8 rounded-full bg-brown-100 flex items-center justify-center text-brown-600 hover:bg-brown-200 transition-colors"
  >
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
  </button>
);

// ── Toggle Switch ─────────────────────────────────────────────────────────────

function Toggle({ enabled, onChange }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
        enabled ? 'bg-sage-500' : 'bg-brown-200'
      }`}
      aria-checked={enabled}
      role="switch"
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
          enabled ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

// ── Row helpers ───────────────────────────────────────────────────────────────

function MenuRow({ icon, label, sublabel, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-4 bg-white rounded-2xl border border-brown-100/50 shadow-sm hover:bg-brown-50/50 active:scale-[0.99] transition-all text-left ${
        danger ? 'border-red-100' : ''
      }`}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
        danger ? 'bg-red-50 text-red-500' : 'bg-cream text-brown-600'
      }`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold ${danger ? 'text-red-500' : 'text-brown-800'}`}>{label}</p>
        {sublabel && <p className="text-xs text-brown-400 mt-0.5">{sublabel}</p>}
      </div>
      {!danger && <IconChevron />}
    </button>
  );
}

function SettingRow({ label, sublabel, children }) {
  return (
    <div className="flex items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-brown-100/50 shadow-sm">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-brown-800">{label}</p>
        {sublabel && <p className="text-xs text-brown-400 mt-0.5">{sublabel}</p>}
      </div>
      {children}
    </div>
  );
}

// ── Sub-screens ───────────────────────────────────────────────────────────────

function ScreenPersonalSettings({ onBack }) {
  const [name, setName] = useState('Joel');
  const [email, setEmail] = useState('joel@example.com');
  const [phone, setPhone] = useState('+60 12-345 6789');
  const [dob, setDob] = useState('1990-04-15');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-5 pb-3 border-b border-brown-100 flex items-center gap-3">
        <button onClick={onBack} className="w-8 h-8 rounded-full bg-brown-100 flex items-center justify-center text-brown-600 hover:bg-brown-200 transition-colors">
          <IconBack />
        </button>
        <h3 className="text-xl font-bold text-brown-800 font-serif flex-1">Personal Settings</h3>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-5 pb-10 space-y-4">
        {/* Avatar */}
        <div className="flex flex-col items-center py-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-terracotta-500 to-sage-500 flex items-center justify-center text-white text-3xl font-bold shadow-soft mb-3">
            J
          </div>
          <button className="text-xs font-semibold text-sage-500 hover:underline">Change Photo</button>
        </div>

        {/* Fields */}
        <div className="space-y-3">
          {[
            { label: 'Full Name', value: name, setter: setName, type: 'text', placeholder: 'Your name' },
            { label: 'Email Address', value: email, setter: setEmail, type: 'email', placeholder: 'you@example.com' },
            { label: 'Phone Number', value: phone, setter: setPhone, type: 'tel', placeholder: '+60 12-345 6789' },
            { label: 'Date of Birth', value: dob, setter: setDob, type: 'date', placeholder: '' },
          ].map(({ label, value, setter, type, placeholder }) => (
            <div key={label}>
              <label className="text-xs font-semibold text-brown-500 block mb-1">{label}</label>
              <input
                type={type}
                value={value}
                onChange={(e) => setter(e.target.value)}
                placeholder={placeholder}
                className="w-full bg-white border border-brown-100 rounded-xl px-4 py-3 text-sm text-brown-800 focus:outline-none focus:border-sage-500 transition-colors"
              />
            </div>
          ))}

          <div>
            <label className="text-xs font-semibold text-brown-500 block mb-1">Gender</label>
            <select className="w-full bg-white border border-brown-100 rounded-xl px-4 py-3 text-sm text-brown-800 focus:outline-none focus:border-sage-500 transition-colors">
              <option>Prefer not to say</option>
              <option>Male</option>
              <option>Female</option>
              <option>Non-binary</option>
            </select>
          </div>
        </div>

        {/* Password section */}
        <div className="pt-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-brown-400 mb-3">Security</p>
          <button className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-brown-100/50 shadow-sm hover:bg-brown-50/50 transition-all">
            <span className="text-sm font-semibold text-brown-800">Change Password</span>
            <IconChevron />
          </button>
        </div>

        <button
          onClick={handleSave}
          className={`w-full py-3.5 rounded-2xl text-sm font-bold shadow transition-all active:scale-95 ${
            saved ? 'bg-green-500 text-white' : 'bg-terracotta-500 text-white hover:bg-terracotta-500/90'
          }`}
        >
          {saved ? '✓ Saved' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}

function ScreenNotifications({ onBack }) {
  const [prefs, setPrefs] = useState({
    appointments: true,
    claims: true,
    wellness: false,
    promotions: false,
    reminders: true,
    email: true,
    sms: false,
    push: true,
  });

  const toggle = (key) => setPrefs((p) => ({ ...p, [key]: !p[key] }));

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 pb-3 border-b border-brown-100 flex items-center gap-3">
        <button onClick={onBack} className="w-8 h-8 rounded-full bg-brown-100 flex items-center justify-center text-brown-600 hover:bg-brown-200 transition-colors">
          <IconBack />
        </button>
        <h3 className="text-xl font-bold text-brown-800 font-serif flex-1">Notifications</h3>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-5 pb-10 space-y-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-brown-400 mb-3">Activity</p>
          <div className="space-y-2">
            <SettingRow label="Appointment Updates" sublabel="Confirmations, reminders & changes">
              <Toggle enabled={prefs.appointments} onChange={() => toggle('appointments')} />
            </SettingRow>
            <SettingRow label="Claims Status" sublabel="Processing and approval updates">
              <Toggle enabled={prefs.claims} onChange={() => toggle('claims')} />
            </SettingRow>
            <SettingRow label="Wellness Tips" sublabel="Daily health & mindfulness content">
              <Toggle enabled={prefs.wellness} onChange={() => toggle('wellness')} />
            </SettingRow>
            <SettingRow label="Promotions & Offers" sublabel="Deals on packages and services">
              <Toggle enabled={prefs.promotions} onChange={() => toggle('promotions')} />
            </SettingRow>
            <SettingRow label="Session Reminders" sublabel="1 hour before your appointment">
              <Toggle enabled={prefs.reminders} onChange={() => toggle('reminders')} />
            </SettingRow>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-brown-400 mb-3">Channels</p>
          <div className="space-y-2">
            <SettingRow label="Push Notifications" sublabel="In-app alerts">
              <Toggle enabled={prefs.push} onChange={() => toggle('push')} />
            </SettingRow>
            <SettingRow label="Email" sublabel="Sent to joel@example.com">
              <Toggle enabled={prefs.email} onChange={() => toggle('email')} />
            </SettingRow>
            <SettingRow label="SMS" sublabel="Sent to +60 12-345 6789">
              <Toggle enabled={prefs.sms} onChange={() => toggle('sms')} />
            </SettingRow>
          </div>
        </div>
      </div>
    </div>
  );
}

const FAQ_ITEMS = [
  {
    q: 'How do I book an appointment?',
    a: 'Tap the "Book" quick action on the home screen, choose your service and preferred practitioner, then pick a date and time that works for you.',
  },
  {
    q: 'How do I submit an insurance claim?',
    a: 'Open the Claims section from the quick actions. Tap "Start New Submission", fill in the treatment details, upload your invoice receipt, and submit.',
  },
  {
    q: 'Can I reschedule or cancel an appointment?',
    a: 'Yes. Tap "Reschedule" on your appointment card. Cancellations made more than 24 hours in advance are free of charge.',
  },
  {
    q: 'How long does a claim take to process?',
    a: 'Most claims are reviewed within 3–5 business days. You\'ll receive a push notification and email once a decision is made.',
  },
  {
    q: 'What is Aura AI?',
    a: 'Aura AI is your personal wellness assistant. It can help you book appointments, answer health questions, guide breathing exercises, and navigate your insurance benefits.',
  },
  {
    q: 'How do I add a practitioner to Favourites?',
    a: 'Browse practitioners in the Explore section and tap the heart icon on any profile to save them to your Favourites list.',
  },
  {
    q: 'Is my health data secure?',
    a: 'Yes. All data is encrypted in transit and at rest. We comply with local health data regulations and never share your information with third parties without consent.',
  },
];

function ScreenFAQ({ onBack }) {
  const [open, setOpen] = useState(null);

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 pb-3 border-b border-brown-100 flex items-center gap-3">
        <button onClick={onBack} className="w-8 h-8 rounded-full bg-brown-100 flex items-center justify-center text-brown-600 hover:bg-brown-200 transition-colors">
          <IconBack />
        </button>
        <h3 className="text-xl font-bold text-brown-800 font-serif flex-1">FAQ</h3>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-5 pb-10 space-y-2">
        <p className="text-xs text-brown-400 pb-2">Tap a question to expand the answer.</p>
        {FAQ_ITEMS.map((item, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-brown-100/50 shadow-sm overflow-hidden"
          >
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left"
            >
              <span className="text-sm font-semibold text-brown-800 flex-1">{item.q}</span>
              <svg
                className={`w-4 h-4 text-brown-400 flex-shrink-0 transition-transform duration-200 ${open === i ? 'rotate-180' : ''}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {open === i && (
              <div className="px-4 pb-4 text-xs text-brown-500 leading-relaxed border-t border-brown-100/50 pt-3">
                {item.a}
              </div>
            )}
          </div>
        ))}

        {/* Contact support */}
        <div className="pt-2">
          <div className="p-4 bg-gradient-to-tr from-terracotta-500/10 to-sage-500/10 rounded-2xl border border-brown-100/50 text-center">
            <p className="text-sm font-semibold text-brown-800 mb-1">Still need help?</p>
            <p className="text-xs text-brown-500 mb-3">Our support team is available Mon–Fri, 9am–6pm.</p>
            <button className="px-5 py-2 bg-sage-500 text-white text-xs font-bold rounded-xl shadow hover:bg-sage-500/90 active:scale-95 transition-all">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Drawer ───────────────────────────────────────────────────────────────

export default function DrawerProfile({ show, onClose, onLogout }) {
  const [screen, setScreen] = useState('menu'); // 'menu' | 'settings' | 'notifications' | 'faq'

  const handleClose = () => {
    setScreen('menu');
    onClose();
  };

  const renderScreen = () => {
    switch (screen) {
      case 'settings':
        return <ScreenPersonalSettings onBack={() => setScreen('menu')} />;
      case 'notifications':
        return <ScreenNotifications onBack={() => setScreen('menu')} />;
      case 'faq':
        return <ScreenFAQ onBack={() => setScreen('menu')} />;
      default:
        return <MenuScreen onClose={handleClose} onNavigate={setScreen} onLogout={onLogout} />;
    }
  };

  return (
    <div
      className={`absolute bottom-0 left-0 right-0 h-[85%] bg-cream rounded-t-[32px] shadow-premium z-50 transform transition-transform duration-300 ease-out flex flex-col overflow-hidden ${
        show ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div
        className="w-12 h-1.5 bg-brown-400/30 rounded-full mx-auto my-3 flex-shrink-0 cursor-pointer"
        onClick={handleClose}
      />
      {renderScreen()}
    </div>
  );
}

function MenuScreen({ onClose, onNavigate, onLogout }) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-5 pb-3 border-b border-brown-100 flex items-center justify-between">
        <h3 className="text-xl font-bold text-brown-800 font-serif">Profile</h3>
        <IconClose onClick={onClose} />
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-5 pb-10 space-y-5">
        {/* User card */}
        <div className="flex items-center gap-4 p-4 bg-gradient-to-tr from-terracotta-500/10 to-sage-500/10 rounded-2xl border border-brown-100/50">
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-terracotta-500 to-sage-500 flex items-center justify-center text-white text-2xl font-bold shadow-soft flex-shrink-0">
            J
          </div>
          <div className="text-left">
            <h4 className="text-base font-bold text-brown-800 font-serif">Joel</h4>
            <p className="text-xs text-brown-500">joel@example.com</p>
            <span className="inline-block mt-1 px-2 py-0.5 bg-sage-500/10 text-sage-500 text-[10px] font-bold rounded-full border border-sage-500/20">
              Premium Member
            </span>
          </div>
        </div>

        {/* Menu items */}
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-brown-400 px-1">Account</p>
          <MenuRow
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
            label="Personal Settings"
            sublabel="Name, email, phone & password"
            onClick={() => onNavigate('settings')}
          />
          <MenuRow
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>}
            label="Notifications"
            sublabel="Manage alerts and channels"
            onClick={() => onNavigate('notifications')}
          />
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-brown-400 px-1">Support</p>
          <MenuRow
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            label="FAQ"
            sublabel="Common questions & answers"
            onClick={() => onNavigate('faq')}
          />
          <MenuRow
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
            label="Terms & Privacy"
            sublabel="Legal information"
            onClick={() => {}}
          />
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-brown-400 px-1">Session</p>
          <MenuRow
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>}
            label="Log Out"
            onClick={onLogout}
            danger
          />
        </div>

        {/* App version */}
        <p className="text-center text-[10px] text-brown-300">Aura Wellness v2.4.1</p>
      </div>
    </div>
  );
}
