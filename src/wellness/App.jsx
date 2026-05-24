import { useState, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

import {
  patientProfile,
  buildAppointmentFromProfile,
  buildInitialNotifications,
} from './continuity/patientProfile.js';
import {
  resolveChatInput,
  buildDemoJourneyMessages,
  getTrackCheckInSummary,
  readDemoUserMode,
} from './continuity/auraEngine.js';
import NotificationsPanel from './components/NotificationsPanel';
import AppointmentCard from './components/AppointmentCard';
import QuickActions from './components/QuickActions';
import BrowseCard from './components/BrowseCard';
import FavoritesSection from './components/FavoritesSection';
import ChatFooter from './components/ChatFooter';
import DrawerBook from './components/DrawerBook';
import DrawerChat from './components/DrawerChat';
import DrawerExplore from './components/DrawerExplore';
import DrawerClaims from './components/DrawerClaims';
import DrawerFavorites from './components/DrawerFavorites';
import DrawerProfile from './components/DrawerProfile';
import ModalWrapper from './components/ModalWrapper';

// ── Initial data (seeded from vascular continuity profile) ───────────────────

const INITIAL_APPOINTMENT = buildAppointmentFromProfile(patientProfile);
const INITIAL_NOTIFICATIONS = buildInitialNotifications(patientProfile);

const INITIAL_FAVORITES = [
  {
    name: 'Dr. Sarah Lim',
    role: 'Endocrinologist',
    rating: '4.9',
    signature: 'Diabetes Review & HbA1c Check',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=200&auto=format&fit=crop',
  },
  {
    name: 'Dr. Marcus Tan',
    role: 'Cardiologist',
    rating: '4.8',
    signature: 'Cardiac Risk Assessment',
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=200&auto=format&fit=crop',
  },
];

// Claims now loaded from Supabase per user (blank slate by default)


// ── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  // Active drawer/modal state
  const [activeDrawer, setActiveDrawer] = useState(null); // 'book' | 'chat' | 'explore' | 'claims' | 'favorites' | 'profile'

  // Notifications
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [notifCount, setNotifCount] = useState(INITIAL_NOTIFICATIONS.length);

  // Appointment
  const [appointment, setAppointment] = useState(INITIAL_APPOINTMENT);

  // Chat messages — 3-message guided demo journey keyed to login vs signup
  const [messages, setMessages] = useState(() =>
    buildDemoJourneyMessages(patientProfile, readDemoUserMode()),
  );
  const [chatInput, setChatInput] = useState('');

  // Favorites
  const [favorites, setFavorites] = useState(INITIAL_FAVORITES);

  // Claims
  const [claims, setClaims] = useState([]);
  const [claimsLoading, setClaimsLoading] = useState(false);

  // Toast notification
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  // Booking pre-selection (from Explore or Favorites)
  const [bookingParams, setBookingParams] = useState(null);

  // User state from Supabase
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      const name = user.user_metadata?.name || user.user_metadata?.full_name || 'Joel';
      setMessages(prev => {
        const newMsgs = [...prev];
        if (newMsgs[0] && newMsgs[0].sender === 'drclaw') {
          newMsgs[0] = {
            ...newMsgs[0],
            text: `Hi ${name}! 👋 I'm Dr Claw, your chronic care assistant. How can I support you today?`
          };
        }
        return newMsgs;
      });
    }
  }, [user]);

  // Load claims for current user
  const loadClaims = async (uid) => {
    if (!uid) { setClaims([]); return; }
    setClaimsLoading(true);
    const { data, error } = await supabase
      .from('claims')
      .select('*')
      .eq('user_id', uid)
      .order('created_at', { ascending: false });
    if (!error && data) {
      setClaims(data.map(c => ({
        id: c.id,
        date: new Date(c.claim_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        service: c.service,
        amount: Number(c.amount).toFixed(2),
        stage: c.stage,
        insurer: c.insurer,
        claimType: c.claim_type,
        remarks: c.remarks,
        filePath: c.file_path,
        fileName: c.file_name,
      })));
    }
    setClaimsLoading(false);
  };

  useEffect(() => {
    loadClaims(user?.id);
  }, [user?.id]);

  const userName = user?.user_metadata?.name || user?.user_metadata?.full_name || 'Joel';

  // ── Helpers ────────────────────────────────────────────────────────────────

  const openDrawer = (name) => {
    setActiveDrawer(name);
    setShowNotifications(false);
  };

  const handleOpenDrawer = (name) => {
    if (name === 'track') {
      handleTrackCheckIn();
      return;
    }
    openDrawer(name);
  };

  const closeDrawer = () => setActiveDrawer(null);

  const showToast = (message, type = 'success') => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ message, type });
    toastTimer.current = setTimeout(() => setToast(null), 3500);
  };

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleCheckIn = () => {
    setAppointment((prev) => ({ ...prev, checkedIn: true }));
    showToast('✅ Checked in! See you at KPJ Damansara Specialist.');
    setNotifications((prev) => [
      {
        icon: '📍',
        color: 'text-emerald-600',
        bg: 'bg-emerald-50',
        title: 'Checked in successfully',
        desc: `${appointment.title} — ${appointment.time}`,
        time: 'Just now',
      },
      ...prev,
    ]);
    setNotifCount((n) => n + 1);
  };

  const handleReschedule = () => {
    setBookingParams({
      serviceName: appointment.title,
      practitioner: appointment.practitioner,
    });
    openDrawer('book');
  };

  const handleBookingConfirm = (params) => {
    setAppointment({
      title: params.serviceName,
      practitioner: params.practitioner,
      date: params.date,
      time: params.time,
      location: 'KPJ Damansara Specialist',
      avatar: params.avatar,
      checkedIn: false,
    });
    closeDrawer();
    showToast(`🗓 Booked ${params.serviceName} on ${params.date} at ${params.time}!`);
    setNotifications((prev) => [
      {
        icon: '✅',
        color: 'text-green-600',
        bg: 'bg-green-50',
        title: 'Appointment confirmed!',
        desc: `${params.serviceName} — ${params.date} at ${params.time}`,
        time: 'Just now',
      },
      ...prev,
    ]);
    setNotifCount((n) => n + 1);
    setBookingParams(null);
  };

  const appendDrClawReply = (replyText) => {
    setTimeout(() => {
      setMessages((prev) => [...prev, { sender: 'drclaw', text: replyText }]);
    }, 800);
  };

  const handleSendMessage = (text) => {
    setChatInput('');
    setMessages((prev) => [...prev, { sender: 'user', text }]);
    const result = resolveChatInput({ message: text, profile: patientProfile });
    appendDrClawReply(result.text);
    if (result.workflow === 'booking') {
      setTimeout(() => openDrawer('book'), 900);
    }
    if (result.workflow === 'claims') {
      setTimeout(() => openDrawer('claims'), 900);
    }
  };

  const handleSuggestedClick = (text) => {
    handleSendMessage(text);
  };

  const handleTrackCheckIn = () => {
    appendDrClawReply(getTrackCheckInSummary(patientProfile));
  };

  const handleSimulateVoice = () => {
    openDrawer('chat');
    setTimeout(() => handleSendMessage('How are my steps this week compared to last week?'), 300);
  };

  const handleSubmitClaim = async (claimData) => {
    if (!user) { showToast('Please sign in to submit a claim', 'error'); return; }
    let filePath = null;
    let fileName = null;
    if (claimData.file) {
      const ext = claimData.file.name.split('.').pop();
      const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from('claim-receipts').upload(path, claimData.file, { upsert: false });
      if (upErr) { showToast('Upload failed: ' + upErr.message, 'error'); return; }
      filePath = path;
      fileName = claimData.file.name;
    }
    const { data, error } = await supabase.from('claims').insert({
      user_id: user.id,
      service: claimData.treatmentType,
      amount: parseFloat(claimData.amount || '0'),
      insurer: claimData.insurer,
      claim_type: claimData.claimType || 'self',
      stage: 'submitted',
      file_path: filePath,
      file_name: fileName,
      claim_date: claimData.claimDate || new Date().toISOString().split('T')[0],
    }).select().single();
    if (error) { showToast('Submit failed: ' + error.message, 'error'); return; }
    await loadClaims(user.id);
    showToast('📋 Claim submitted successfully!');
    return data;
  };


  const handleToggleFavorite = (name) => {
    setFavorites((prev) => prev.filter((f) => f.name !== name));
    showToast('Removed from favourites');
  };

  const handleBookPractitioner = (practitioner) => {
    setBookingParams({
      serviceName: practitioner.signature,
      practitioner: practitioner.name,
    });
    closeDrawer();
    setTimeout(() => openDrawer('book'), 200);
  };

  const handleClearNotifications = () => {
    setNotifications([]);
    setNotifCount(0);
  };

  const handleLogout = () => {
    // Optimistic: clear local session synchronously and redirect immediately.
    // Fire the server sign-out in the background — no need to await the network.
    try {
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const k = localStorage.key(i);
        if (k && k.startsWith('sb-')) localStorage.removeItem(k);
      }
    } catch {}
    supabase.auth.signOut().catch(() => {});
    window.location.replace('/');
  };



  const handleNotifBell = () => {
    setShowNotifications((prev) => !prev);
    setNotifCount(0);
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  const hasOverlay = activeDrawer !== null && activeDrawer !== 'chat';

  return (
    <div className="h-svh w-screen flex bg-cream overflow-hidden text-brown-800">
      
      {/* ── Left Navigation Sidebar (desktop only) ── */}
      <div className="hidden md:flex md:w-64 bg-brown-800 text-white flex-col justify-between p-6 flex-shrink-0 relative z-30">
        <div className="space-y-8">
          {/* Brand Header */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-terracotta-500 to-sage-500 flex items-center justify-center shadow-lg border border-white/20">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white/90 font-serif">Dr Claw</h2>
              <p className="text-[10px] text-white/50 tracking-wider">CHRONIC CARE PORTAL</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2">
            <button
              onClick={() => { closeDrawer(); }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 text-white font-medium text-sm transition-all text-left"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Dashboard
            </button>
            <button
              onClick={() => openDrawer('book')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-white/80 hover:text-white font-medium text-sm transition-all text-left"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Book Specialist
            </button>
            <button
              onClick={() => openDrawer('explore')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-white/80 hover:text-white font-medium text-sm transition-all text-left"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M12 16v1" />
              </svg>
              Explore Conditions
            </button>
            <button
              onClick={() => openDrawer('claims')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-white/80 hover:text-white font-medium text-sm transition-all text-left"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Insurance Claims
            </button>
            <button
              onClick={() => openDrawer('favorites')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-white/80 hover:text-white font-medium text-sm transition-all text-left"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Saved Favorites
            </button>
          </nav>
        </div>

        {/* User Info / Logout */}
        <div className="pt-6 border-t border-white/10 space-y-4">
          <button
            onClick={() => openDrawer('profile')}
            className="w-full flex items-center gap-3 text-left hover:bg-white/5 p-2 rounded-xl transition-all cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-sage-500/30 flex items-center justify-center font-bold text-white text-lg">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">{userName} 🌿</h4>
              <p className="text-xs text-white/50">Premium Member</p>
            </div>
          </button>
          <button
            onClick={handleLogout}
            className="w-full text-left text-xs text-white/40 hover:text-white transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* ── Center Content Panel (Scrollable Main Feed) ── */}
      <div className="flex-1 flex flex-col bg-cream relative min-h-0 min-w-0 overflow-hidden">
        
        {/* Header — sticky */}
        <header className="sticky top-0 flex items-center justify-between px-5 pt-6 pb-3 mp-anim-header flex-shrink-0 z-30 bg-cream md:px-8">
          <div className="text-left">
            <p className="text-xs font-semibold uppercase tracking-widest text-brown-400">Good morning</p>
            <h1 className="text-2xl text-brown-800 font-serif leading-tight">{userName} 👋</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              id="notification-btn"
              onClick={handleNotifBell}
              className="relative w-10 h-10 rounded-full bg-white shadow-soft flex items-center justify-center text-brown-600 hover:bg-brown-100/50 transition-colors"
              aria-label="Notifications"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {notifCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {notifCount > 9 ? '9+' : notifCount}
                </span>
              )}
            </button>

            {/* Profile icon — hidden on desktop navigation since it's already in sidebar */}
            <button
              onClick={() => openDrawer('profile')}
              className="relative w-10 h-10 rounded-full bg-white shadow-soft flex items-center justify-center text-brown-600 hover:bg-brown-100/50 transition-colors md:hidden"
              aria-label="Profile"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </button>
          </div>
        </header>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
          
          {/* Top section — sticky, stays put as sheet scrolls over */}
          <div className="sticky top-0 z-10 pt-2 pb-6 bg-cream">
            <div className="max-w-4xl mx-auto px-5 md:px-8 grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Appointment card */}
              <div className="md:col-span-7 mp-anim mp-anim-1">
                <AppointmentCard
                  appointment={appointment}
                  onCheckIn={handleCheckIn}
                  onOpenReschedule={handleReschedule}
                />
              </div>

              {/* Quick actions */}
              <div className="md:col-span-5 flex flex-col justify-between">
                <QuickActions onOpenDrawer={handleOpenDrawer} />
                
                {/* Desktop-only secondary widget */}
                <div className="hidden md:block bg-white rounded-2xl p-4 shadow-soft border border-white mt-auto">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-bold text-brown-600 uppercase tracking-wide">Claims Overview</h3>
                    <button onClick={() => openDrawer('claims')} className="text-[10px] text-sage-500 font-semibold hover:underline">View All</button>
                  </div>
                  <div className="space-y-1.5 text-xs text-brown-800">
                    <div className="flex justify-between items-center py-1 border-b border-brown-100/50">
                      <span>Diabetes Review</span>
                      <span className="font-semibold text-terracotta-500">RM 120.00</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* White sheet — flows below, scrolls up over the sticky top */}
          <div className="relative z-20 bg-white rounded-t-[28px] shadow-[0_-4px_24px_-6px_rgba(31,58,77,0.10)] mt-2 min-h-[100%]">
            <div className="max-w-4xl mx-auto px-5 md:px-8 pt-6 pb-28 md:pb-12 space-y-6">
              <BrowseCard />
              <FavoritesSection
                favCount={favorites.length}
                onOpenFavorites={() => openDrawer('favorites')}
              />
            </div>
          </div>

        </div>

        {/* Chat / AI footer — mobile only */}
        <div className="absolute bottom-0 inset-x-0 z-30 mp-anim-footer md:hidden">
          <ChatFooter
            chatInput={chatInput}
            setChatInput={setChatInput}
            onFocus={() => openDrawer('chat')}
            onSend={() => {
              if (chatInput.trim()) {
                openDrawer('chat');
                setTimeout(() => handleSendMessage(chatInput.trim()), 100);
              }
            }}
            onSimulateVoice={handleSimulateVoice}
            onSimulateAttachment={() => openDrawer('chat')}
          />
        </div>

        {/* ── Notifications overlay ── */}
        <NotificationsPanel
          show={showNotifications}
          onClose={() => setShowNotifications(false)}
          notifications={notifications}
          onClear={handleClearNotifications}
        />

        {/* ── Drawers backdrop ── */}
        {hasOverlay && (
          <div
            className="absolute inset-0 bg-brown-800/40 backdrop-blur-[2px] z-40"
            onClick={closeDrawer}
          />
        )}

        {/* ── Drawers ── */}
        <DrawerBook
          show={activeDrawer === 'book'}
          onClose={closeDrawer}
          preselectedParams={bookingParams}
          onConfirm={handleBookingConfirm}
        />

        <DrawerChat
          show={activeDrawer === 'chat'}
          onClose={closeDrawer}
          messages={messages}
          onSendMessage={handleSendMessage}
          onSuggestedClick={handleSuggestedClick}
        />

        <DrawerExplore
          show={activeDrawer === 'explore'}
          onClose={closeDrawer}
          onQuickBook={(params) => {
            setBookingParams(params);
            closeDrawer();
            setTimeout(() => openDrawer('book'), 200);
          }}
        />

        <DrawerClaims
          show={activeDrawer === 'claims'}
          onClose={closeDrawer}
          claims={claims}
          claimsLoading={claimsLoading}
          onSubmitClaim={handleSubmitClaim}
          showToast={showToast}
          isAuthed={!!user}
        />


        <DrawerFavorites
          show={activeDrawer === 'favorites'}
          onClose={closeDrawer}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
          onBookPractitioner={handleBookPractitioner}
        />

        <DrawerProfile
          show={activeDrawer === 'profile'}
          onClose={closeDrawer}
          onLogout={handleLogout}
          user={user}
        />
      </div>

      {/* ── Right AI Chat Sidebar (desktop only) ── */}
      <div className="hidden md:flex md:w-80 lg:w-96 flex-shrink-0 relative z-30">
        <DrawerChat
          show={true}
          onClose={() => {}}
          messages={messages}
          onSendMessage={handleSendMessage}
          onSuggestedClick={handleSuggestedClick}
          inline={true}
        />
      </div>

      {/* ── Global Toast ── */}
      {toast && (
        <div
          className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] px-5 py-3 rounded-2xl shadow-premium text-sm font-medium text-white transition-all animate-fade-in whitespace-nowrap ${
            toast.type === 'error' ? 'bg-red-500' : 'bg-brown-800'
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}
