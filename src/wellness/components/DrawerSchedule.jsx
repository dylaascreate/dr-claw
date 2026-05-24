import React, { useMemo, useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

function parseApptDate(str) {
  if (!str) return null;
  const d = new Date(str);
  if (isNaN(d.getTime())) {
    // Try appending current year e.g. "Fri, Oct 24"
    const withYear = new Date(`${str} ${new Date().getFullYear()}`);
    return isNaN(withYear.getTime()) ? null : withYear;
  }
  return d;
}

function isSameDay(a, b) {
  return a && b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

function ScheduleListItem({ appt }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-soft border border-brown-100 flex items-center gap-3">
      <div className="w-12 h-12 rounded-xl bg-sage-100 flex-shrink-0 overflow-hidden">
        {appt.avatar_url ? (
          <img src={appt.avatar_url} alt={appt.practitioner} className="w-full h-full object-cover" />
        ) : null}
      </div>
      <div className="flex-1 min-w-0 text-left">
        <h4 className="text-sm font-semibold text-brown-800 truncate">{appt.title}</h4>
        <p className="text-xs text-brown-600">with {appt.practitioner}</p>
        <p className="text-xs text-brown-400 mt-1">{appt.date} • {appt.time}</p>
      </div>
      {appt.checked_in ? (
        <span className="text-[10px] font-semibold text-sage-500 bg-sage-100 px-2 py-1 rounded-full">Checked in</span>
      ) : (
        <span className="text-[10px] font-semibold text-terracotta-500 bg-terracotta-50 px-2 py-1 rounded-full">Upcoming</span>
      )}
    </div>
  );
}

export default function DrawerSchedule({ show, onClose, appointments = [] }) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const { upcoming, history, bookedDates } = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const upcoming = [];
    const history = [];
    const bookedDates = [];
    for (const a of appointments) {
      const d = parseApptDate(a.date);
      if (d) bookedDates.push(d);
      const isPast = d && d < now;
      if (a.checked_in || isPast) history.push(a);
      else upcoming.push(a);
    }
    upcoming.sort((a, b) => (parseApptDate(a.date)?.getTime() ?? 0) - (parseApptDate(b.date)?.getTime() ?? 0));
    history.sort((a, b) => (parseApptDate(b.date)?.getTime() ?? 0) - (parseApptDate(a.date)?.getTime() ?? 0));
    return { upcoming, history, bookedDates };
  }, [appointments]);

  const apptsOnSelected = useMemo(
    () => upcoming.filter((a) => isSameDay(parseApptDate(a.date), selectedDate)),
    [upcoming, selectedDate]
  );

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
        <h3 className="text-xl font-bold text-brown-800 font-serif">My Schedule</h3>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-brown-100 flex items-center justify-center text-brown-600 hover:bg-brown-100/80"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-5 text-left">
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="w-full grid grid-cols-2 mb-4">
            <TabsTrigger value="upcoming">Upcoming ({upcoming.length})</TabsTrigger>
            <TabsTrigger value="history">History ({history.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            <div className="bg-white rounded-2xl shadow-soft border border-brown-100 p-2 flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(d) => d && setSelectedDate(d)}
                modifiers={{ booked: bookedDates }}
                modifiersClassNames={{ booked: 'bg-sage-100 text-sage-500 font-bold rounded-md' }}
                className="p-3 pointer-events-auto"
              />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-brown-400 mb-2">
                {apptsOnSelected.length > 0
                  ? `On ${selectedDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}`
                  : 'All upcoming'}
              </p>
              <div className="space-y-2">
                {(apptsOnSelected.length > 0 ? apptsOnSelected : upcoming).map((a) => (
                  <ScheduleListItem key={a.id} appt={a} />
                ))}
                {upcoming.length === 0 && (
                  <p className="text-sm text-brown-400 text-center py-6">No upcoming appointments.</p>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-2">
            {history.map((a) => (
              <ScheduleListItem key={a.id} appt={a} />
            ))}
            {history.length === 0 && (
              <p className="text-sm text-brown-400 text-center py-6">No past appointments yet.</p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}