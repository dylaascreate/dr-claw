import React, { useState, useEffect, useMemo } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { isBefore, isAfter, startOfDay, addMonths, parse } from 'date-fns';
import {
  useGetAllAppointments,
  useGetPractitionerSchedule,
  useCancelAppointment,
  useRescheduleAppointment,
} from '@/hooks/useAppointments';

const SERVICES = [
  { name: 'Diabetes Review & HbA1c Check', short: 'Diabetes Review', p: 'Dr. Sarah Lim', price: 280, duration: '45m' },
  { name: 'Cardiac Risk Assessment', short: 'Cardiology', p: 'Dr. Marcus Tan', price: 320, duration: '45m' },
  { name: 'Nephrology Follow-up', short: 'Nephrology', p: 'Dr. Priya Nair', price: 260, duration: '40m' },
  { name: 'General Chronic Care Review', short: 'General Review', p: 'Dr. Sarah Lim', price: 180, duration: '30m' },
];

const PRACTITIONERS = [
  { name: 'Dr. Sarah Lim', role: 'Endocrinologist', rating: '4.9', avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=200&auto=format&fit=crop' },
  { name: 'Dr. Marcus Tan', role: 'Cardiologist', rating: '4.8', avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=200&auto=format&fit=crop' },
  { name: 'Dr. Priya Nair', role: 'Nephrologist', rating: '4.7', avatar: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=200&auto=format&fit=crop' },
];

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function formatDateFull(d) {
  if (!d) return '';
  return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

function dateKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function parseApptDate(str) {
  if (!str) return null;
  // Try common formats with date-fns first to avoid timezone/parse ambiguity.
  const ref = new Date();
  const formats = [
    'EEE, MMM d, yyyy', // "Fri, Oct 24, 2026"
    'EEE, MMM d',       // "Fri, Oct 24"
    'MMM d, yyyy',      // "Oct 24, 2026"
    'MMM d',            // "Oct 24"
    'd MMM yyyy',       // "24 Oct 2026"
    'd MMM',            // "24 Oct"
    'yyyy-MM-dd',
  ];
  for (const fmt of formats) {
    const d = parse(str, fmt, ref);
    if (!isNaN(d.getTime())) return d;
  }
  const d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
}

function isSameDay(a, b) {
  return a && b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

function statusOf(appt) {
  if (appt.status && appt.status !== 'scheduled') return appt.status;
  if (appt.checked_in) return 'attended';
  return 'scheduled';
}

function StatusBadge({ status }) {
  const map = {
    attended: { label: 'Attended', cls: 'bg-sage-500 text-white border-transparent' },
    cancelled: { label: 'Cancelled', cls: 'bg-brown-100 text-brown-600 border-transparent' },
    rescheduled: { label: 'Rescheduled', cls: 'bg-terracotta-500 text-white border-transparent' },
    scheduled: { label: 'Upcoming', cls: 'bg-terracotta-50 text-terracotta-500 border-transparent' },
  };
  const { label, cls } = map[status] ?? map.scheduled;
  return <Badge className={`text-[10px] font-semibold ${cls}`}>{label}</Badge>;
}

function ScheduleListItem({ appt, actions = null }) {
  const status = statusOf(appt);
  return (
    <div className="bg-white rounded-2xl p-3 shadow-sm border border-brown-100">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-sage-100 flex-shrink-0 overflow-hidden">
          {appt.avatar_url ? (
            <img src={appt.avatar_url} alt={appt.practitioner} className="w-full h-full object-cover" />
          ) : null}
        </div>
        <div className="flex-1 min-w-0 text-left">
          <h4 className="text-sm font-semibold text-brown-800 truncate font-serif">{appt.title}</h4>
          <p className="text-xs text-brown-600 truncate">with {appt.practitioner}</p>
          <p className="text-xs text-brown-400 mt-0.5">{appt.date} • {appt.time}</p>
        </div>
        <StatusBadge status={status} />
      </div>
      {actions && <div className="mt-2 flex items-center justify-end gap-2">{actions}</div>}
    </div>
  );
}

export default function DrawerBook({ show, onClose, preselectedParams, onConfirm }) {
  const [selectedService, setSelectedService] = useState(SERVICES[0]);
  const [selectedPractitioner, setSelectedPractitioner] = useState(PRACTITIONERS[0]);
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [selectedBookingDate, setSelectedBookingDate] = useState(today);
  const [selectedTime, setSelectedTime] = useState(null);
  const [activeTab, setActiveTab] = useState('book');
  const [calendarDate, setCalendarDate] = useState(new Date());

  const { data: allAppointments = [] } = useGetAllAppointments();
  const { data: practitionerSchedule } = useGetPractitionerSchedule(
    selectedPractitioner.name,
    selectedMonth,
    selectedYear,
  );
  const availableTimes = practitionerSchedule?.availableTimes ?? ['10:00 AM', '2:00 PM'];
  const availableDayKeys = useMemo(
    () => new Set(practitionerSchedule?.availableDays ?? []),
    [practitionerSchedule],
  );
  const remainingSlotsByDate = useMemo(() => {
    const m = new Map();
    for (const s of practitionerSchedule?.slots ?? []) {
      if (!m.has(s.dateKey)) m.set(s.dateKey, new Set());
      m.get(s.dateKey).add(s.time);
    }
    return m;
  }, [practitionerSchedule]);

  const cancelMutation = useCancelAppointment();
  const rescheduleMutation = useRescheduleAppointment();
  const [rescheduleTarget, setRescheduleTarget] = useState(null);

  const yearOptions = useMemo(() => {
    const y = today.getFullYear();
    return [y, y + 1];
  }, [today]);

  // Keep selectedBookingDate inside the selected month/year
  useEffect(() => {
    if (
      selectedBookingDate.getMonth() !== selectedMonth ||
      selectedBookingDate.getFullYear() !== selectedYear
    ) {
      setSelectedBookingDate(new Date(selectedYear, selectedMonth, 1));
      setSelectedTime(null);
    }
  }, [selectedMonth, selectedYear]);

  const availableTimesForSelectedDate = useMemo(() => {
    const key = dateKey(selectedBookingDate);
    return remainingSlotsByDate.get(key) ?? new Set();
  }, [remainingSlotsByDate, selectedBookingDate]);

  const { upcoming, history, bookedDates } = useMemo(() => {
    const today = startOfDay(new Date());
    const upcoming = [];
    const history = [];
    const bookedDates = [];
    for (const a of allAppointments) {
      const d = parseApptDate(a.date);
      if (d) bookedDates.push(startOfDay(d));
      const isPast = d ? isBefore(startOfDay(d), today) : false;
      const status = a.status ?? (a.checked_in ? 'attended' : 'scheduled');
      const isTerminal = status === 'cancelled' || status === 'attended' || status === 'rescheduled';
      if (isTerminal || isPast) history.push(a);
      else upcoming.push(a);
    }
    upcoming.sort((a, b) => (parseApptDate(a.date)?.getTime() ?? 0) - (parseApptDate(b.date)?.getTime() ?? 0));
    history.sort((a, b) => (parseApptDate(b.date)?.getTime() ?? 0) - (parseApptDate(a.date)?.getTime() ?? 0));
    return { upcoming, history, bookedDates };
  }, [allAppointments]);

  const apptsOnSelected = useMemo(
    () => upcoming.filter((a) => isSameDay(parseApptDate(a.date), calendarDate)),
    [upcoming, calendarDate]
  );

  // Sync state if preselectedParams change from parent
  useEffect(() => {
    if (preselectedParams && show) {
      setActiveTab('book');
      if (preselectedParams.serviceName) {
        const match = SERVICES.find(s => s.name.toLowerCase().includes(preselectedParams.serviceName.toLowerCase()) || preselectedParams.serviceName.toLowerCase().includes(s.short.toLowerCase()));
        if (match) setSelectedService(match);
      }
      if (preselectedParams.practitioner) {
        const match = PRACTITIONERS.find(p => p.name.toLowerCase() === preselectedParams.practitioner.toLowerCase());
        if (match) setSelectedPractitioner(match);
      }
      if (preselectedParams.date) {
        const d = parseApptDate(preselectedParams.date);
        if (d) {
          setSelectedBookingDate(d);
          setSelectedMonth(d.getMonth());
          setSelectedYear(d.getFullYear());
        }
      }
      if (preselectedParams.time && availableTimes.includes(preselectedParams.time)) {
        setSelectedTime(preselectedParams.time);
      }
    }
  }, [preselectedParams, show]);

  const handleConfirm = async () => {
    if (!selectedTime) return;
    const payload = {
      serviceName: selectedService.name,
      price: selectedService.price,
      practitioner: selectedPractitioner.name,
      date: formatDateFull(selectedBookingDate),
      time: selectedTime,
      avatar: selectedPractitioner.avatar,
    };
    if (rescheduleTarget) {
      try {
        await rescheduleMutation.mutateAsync({
          appointmentId: rescheduleTarget.id,
          newDate: payload.date,
          newTime: payload.time,
        });
        toast.success('Appointment rescheduled');
        setRescheduleTarget(null);
        setActiveTab('schedule');
      } catch (e) {
        toast.error('Could not reschedule', { description: e?.message });
      }
      return;
    }
    onConfirm(payload);
  };

  const handleCancel = async (appt) => {
    try {
      await cancelMutation.mutateAsync(appt.id);
      toast.success('Appointment cancelled', { description: `${appt.title} • ${appt.date}` });
    } catch (e) {
      toast.error('Could not cancel', { description: e?.message });
    }
  };

  const handleReschedule = (appt) => {
    setRescheduleTarget(appt);
    const match = PRACTITIONERS.find((p) => p.name === appt.practitioner);
    if (match) setSelectedPractitioner(match);
    const svc = SERVICES.find((s) => s.name === appt.title);
    if (svc) setSelectedService(svc);
    setSelectedTime(null);
    setActiveTab('book');
    toast('Pick a new date & time', { description: `Rescheduling with ${appt.practitioner}` });
  };

  return (
    <div
      className={`absolute bottom-0 left-0 right-0 h-[85%] bg-cream rounded-t-[32px] shadow-premium z-50 transform transition-transform duration-300 ease-out flex flex-col overflow-hidden ${
        show ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div
        className="w-12 h-1.5 bg-brown-400/30 rounded-full mx-auto my-3 flex-shrink-0 cursor-pointer"
        onClick={onClose}
      ></div>

      <div className="px-5 pb-3 border-b border-brown-100 flex items-center justify-between">
        <h3 className="text-xl font-bold text-brown-800 font-serif">
          {activeTab === 'book' ? 'Book Appointment' : 'My Schedule'}
        </h3>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-brown-100 flex items-center justify-center text-brown-600 hover:bg-brown-100/80"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
        <div className="px-5 pt-4">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="book">Book Appointment</TabsTrigger>
            <TabsTrigger value="schedule">My Schedule</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="book" className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-6 text-left mt-0">
        {rescheduleTarget && (
          <div className="bg-terracotta-50 border border-terracotta-500/30 rounded-2xl p-3 flex items-center justify-between">
            <div className="text-left">
              <p className="text-xs font-semibold text-terracotta-500 uppercase">Rescheduling</p>
              <p className="text-sm text-brown-800 font-serif">{rescheduleTarget.title} • {rescheduleTarget.date} {rescheduleTarget.time}</p>
            </div>
            <button
              onClick={() => setRescheduleTarget(null)}
              className="text-xs font-semibold text-brown-600 hover:text-brown-800"
            >
              Cancel
            </button>
          </div>
        )}
        {/* Step 1: Select Service */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-brown-400 block mb-2">
            1. Select Treatment
          </label>
          <div className="grid grid-cols-2 gap-3">
            {SERVICES.map((s) => {
              const isSelected = selectedService.name === s.name;
              return (
                <button
                  key={s.name}
                  onClick={() => setSelectedService(s)}
                  className={`p-3.5 bg-white border rounded-2xl text-left shadow-sm transition-all relative block ${
                    isSelected ? 'border-sage-500' : 'border-brown-100 hover:border-brown-400'
                  }`}
                >
                  {isSelected && (
                    <span className="absolute top-2 right-2 text-sage-500 bg-sage-100/50 rounded-full p-1">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                  )}
                  <p className="text-sm font-semibold text-brown-800 font-serif">{s.short}</p>
                  <p className="text-xs text-brown-600">{s.p}</p>
                  <p className="text-xs font-bold text-sage-500 mt-2">${s.price} / {s.duration}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Choose Practitioner */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-brown-400 block mb-2">
            2. Practitioner Preference
          </label>
          <div className="space-y-2">
            {PRACTITIONERS.map((p) => {
              const isSelected = selectedPractitioner.name === p.name;
              return (
                <div
                  key={p.name}
                  onClick={() => setSelectedPractitioner(p)}
                  className={`p-3 bg-white border rounded-2xl flex items-center justify-between cursor-pointer transition-all shadow-sm ${
                    isSelected ? 'border-sage-500' : 'border-brown-100 hover:border-brown-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img src={p.avatar} className="w-10 h-10 rounded-full object-cover" alt={p.name} />
                    <div>
                      <p className="text-sm font-semibold text-brown-800 font-serif">{p.name}</p>
                      <p className="text-xs text-brown-500">{p.role} • ★ {p.rating}</p>
                    </div>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border ${
                      isSelected ? 'border-4 border-sage-500' : 'border-brown-400'
                    }`}
                  ></div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 3: Date & Time */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-brown-400 block mb-2">
            3. Month, Date & Session
          </label>
          <div className="grid grid-cols-2 gap-2">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="bg-white border border-brown-100 rounded-xl px-3 py-2.5 text-sm text-brown-800 font-semibold shadow-sm focus:outline-none focus:border-sage-500"
            >
              {MONTHS.map((m, i) => (
                <option key={m} value={i}>{m}</option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="bg-white border border-brown-100 rounded-xl px-3 py-2.5 text-sm text-brown-800 font-semibold shadow-sm focus:outline-none focus:border-sage-500"
            >
              {yearOptions.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          <div className="mt-3 bg-white rounded-2xl shadow-sm border border-brown-100 p-2 flex justify-center">
            <Calendar
              mode="single"
              month={new Date(selectedYear, selectedMonth, 1)}
              onMonthChange={(d) => {
                setSelectedMonth(d.getMonth());
                setSelectedYear(d.getFullYear());
              }}
              selected={selectedBookingDate}
              onSelect={(d) => {
                if (!d) return;
                setSelectedBookingDate(d);
                setSelectedTime(null);
              }}
              disabled={(d) => {
                const today = startOfDay(new Date());
                const maxDate = addMonths(today, 3);
                const day = startOfDay(d);
                if (isBefore(day, today)) return true;
                if (isAfter(day, maxDate)) return true;
                if (d.getMonth() !== selectedMonth || d.getFullYear() !== selectedYear) return true;
                if (!availableDayKeys.has(dateKey(d))) return true;
                return false;
              }}
              className="p-3 pointer-events-auto"
            />
          </div>

          <p className="text-[11px] text-brown-500 mt-3 mb-2">
            Available sessions on{' '}
            <span className="font-semibold text-brown-800">{formatDateFull(selectedBookingDate)}</span>
          </p>
          {availableDayKeys.has(dateKey(selectedBookingDate)) ? (
            <div className="grid grid-cols-2 gap-2">
              {availableTimes.map((t) => {
                const isAvailable = availableTimesForSelectedDate.has(t);
                const isSelected = selectedTime === t;
                return (
                  <button
                    key={t}
                    type="button"
                    disabled={!isAvailable}
                    onClick={() => setSelectedTime(t)}
                    className={`py-2.5 border rounded-xl text-xs font-semibold text-center shadow-sm transition-all ${
                      !isAvailable
                        ? 'bg-brown-100/60 text-brown-400 border-brown-100 cursor-not-allowed line-through'
                        : isSelected
                          ? 'bg-sage-500 text-white border-sage-500'
                          : 'bg-white text-brown-800 border-brown-100 hover:border-brown-400'
                    }`}
                  >
                    {t}
                    {!isAvailable && <span className="block text-[9px] font-normal mt-0.5">Full</span>}
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-brown-500 bg-brown-100/50 rounded-xl p-3 text-center">
              No sessions available on this date. Pick a highlighted day.
            </p>
          )}
        </div>
        </TabsContent>

        <TabsContent value="schedule" className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-4 text-left mt-0">
          <div className="bg-white rounded-2xl shadow-sm border border-brown-100 p-2 flex justify-center">
            <Calendar
              mode="single"
              selected={calendarDate}
              onSelect={(d) => d && setCalendarDate(d)}
              modifiers={{ booked: bookedDates }}
              modifiersClassNames={{ booked: 'bg-sage-500 text-white font-bold rounded-full' }}
              className="p-3 pointer-events-auto"
            />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-brown-400 mb-2">
              {apptsOnSelected.length > 0
                ? `On ${calendarDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}`
                : `Upcoming (${upcoming.length})`}
            </p>
            <div className="space-y-2">
              {(apptsOnSelected.length > 0 ? apptsOnSelected : upcoming).map((a) => (
                <ScheduleListItem
                  key={a.id}
                  appt={a}
                  actions={
                    <>
                      <button
                        onClick={() => handleReschedule(a)}
                        className="text-[11px] font-semibold px-3 py-1.5 rounded-lg bg-terracotta-50 text-terracotta-500 hover:bg-terracotta-500/10 transition-colors"
                      >
                        Reschedule
                      </button>
                      <button
                        onClick={() => handleCancel(a)}
                        disabled={cancelMutation.isPending}
                        className="text-[11px] font-semibold px-3 py-1.5 rounded-lg bg-brown-100 text-brown-600 hover:bg-brown-100/70 transition-colors disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </>
                  }
                />
              ))}
              {upcoming.length === 0 && (
                <p className="text-sm text-brown-400 text-center py-6">No upcoming appointments.</p>
              )}
            </div>
          </div>

          {history.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-brown-400 mb-2 mt-4">
                History ({history.length})
              </p>
              <div className="space-y-2">
                {history.map((a) => (
                  <ScheduleListItem key={a.id} appt={a} />
                ))}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Booking CTA Footer - only visible on Book tab */}
      {activeTab === 'book' && (
        <div className="p-5 bg-white border-t border-brown-100 flex items-center justify-between pb-8 flex-shrink-0">
          <div className="text-left">
            <p className="text-xs text-brown-400 uppercase font-semibold">Total Price</p>
            <p className="text-xl font-bold text-brown-800">${selectedService.price.toFixed(2)}</p>
          </div>
          <button
            onClick={handleConfirm}
            disabled={!selectedTime}
            className="py-3 px-6 rounded-xl bg-sage-500 hover:bg-sage-500/90 text-white font-semibold text-sm shadow-md transition-all active:scale-95 animate-fade-in disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {selectedTime
              ? (rescheduleTarget ? 'Confirm Reschedule' : 'Confirm Appointment')
              : 'Select a session'}
          </button>
        </div>
      )}
    </div>
  );
}
