import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const APPOINTMENTS_KEY = ['appointments', 'active'];
const APPOINTMENTS_ALL_KEY = ['appointments', 'all'];

// Strict dummy availability — exactly 2 days per month, 2 sessions per day.
const AVAILABLE_TIMES = ['10:00 AM', '2:00 PM'];

// Returns the date (1-31) of the Nth weekday of a given month.
// weekday: 0=Sun..6=Sat. occurrence: 1=first, 2=second, etc.
function nthWeekdayOfMonth(year, month, weekday, occurrence) {
  const first = new Date(year, month, 1);
  const offset = (weekday - first.getDay() + 7) % 7;
  const day = 1 + offset + (occurrence - 1) * 7;
  const d = new Date(year, month, day);
  if (d.getMonth() !== month) return null;
  return d;
}

// Procedural availability: 2nd Tuesday + 4th Thursday of selected month.
export function getAvailableSlotsForMonth(year, month) {
  const days = [
    nthWeekdayOfMonth(year, month, 2, 2), // 2nd Tuesday
    nthWeekdayOfMonth(year, month, 4, 4), // 4th Thursday
  ].filter(Boolean);

  const slots = [];
  for (const d of days) {
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    for (const t of AVAILABLE_TIMES) {
      slots.push({ date: d, dateKey: key, time: t });
    }
  }
  return slots;
}

async function fetchActiveAppointment() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data;
}

async function fetchAllAppointments() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export function useGetAllAppointments() {
  return useQuery({
    queryKey: APPOINTMENTS_ALL_KEY,
    queryFn: fetchAllAppointments,
  });
}

function parseDateLoose(str, fallbackYear) {
  if (!str) return null;
  const d = new Date(str);
  if (!isNaN(d.getTime())) return d;
  const withYear = new Date(`${str} ${fallbackYear ?? new Date().getFullYear()}`);
  return isNaN(withYear.getTime()) ? null : withYear;
}

export function useGetPractitionerSchedule(practitionerName, selectedMonth, selectedYear) {
  return useQuery({
    queryKey: ['appointments', 'practitioner', practitionerName, selectedYear, selectedMonth],
    enabled: !!practitionerName && selectedMonth != null && selectedYear != null,
    queryFn: async () => {
      // Strict dummy availability: only the procedurally-generated slots are
      // bookable. Everything else is unavailable by default.
      const available = getAvailableSlotsForMonth(selectedYear, selectedMonth);
      const availableByKey = new Map();
      for (const s of available) {
        if (!availableByKey.has(s.dateKey)) availableByKey.set(s.dateKey, new Set());
        availableByKey.get(s.dateKey).add(s.time);
      }

      // Remove any slots already booked for this practitioner.
      const { data, error } = await supabase
        .from('appointments')
        .select('date, time, practitioner, status')
        .eq('practitioner', practitionerName);
      if (error) throw error;

      for (const row of data ?? []) {
        if (row.status === 'cancelled') continue;
        const d = parseDateLoose(row.date, selectedYear);
        if (!d) continue;
        if (d.getFullYear() !== selectedYear || d.getMonth() !== selectedMonth) continue;
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        availableByKey.get(key)?.delete(row.time);
      }

      const remaining = [];
      for (const [dateKey, times] of availableByKey.entries()) {
        for (const time of times) remaining.push({ dateKey, time });
      }
      return {
        availableDays: Array.from(new Set(available.map((s) => s.dateKey))),
        availableTimes: AVAILABLE_TIMES,
        slots: remaining,
      };
    },
  });
}

export function useGetAppointments() {
  return useQuery({
    queryKey: APPOINTMENTS_KEY,
    queryFn: fetchActiveAppointment,
  });
}

export function useBookAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('appointments')
        .insert({
          user_id: user.id,
          title: params.serviceName,
          practitioner: params.practitioner,
          date: params.date,
          time: params.time,
          location: 'KPJ Damansara Specialist',
          avatar_url: params.avatar,
          checked_in: false,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APPOINTMENTS_KEY });
      queryClient.invalidateQueries({ queryKey: APPOINTMENTS_ALL_KEY });
    },
  });
}

export function useCheckInAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (appointmentId) => {
      const { data, error } = await supabase
        .from('appointments')
        .update({ checked_in: true })
        .eq('id', appointmentId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APPOINTMENTS_KEY });
      queryClient.invalidateQueries({ queryKey: APPOINTMENTS_ALL_KEY });
    },
  });
}

export function useCancelAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (appointmentId) => {
      const { data, error } = await supabase
        .from('appointments')
        .update({ status: 'cancelled' })
        .eq('id', appointmentId)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APPOINTMENTS_KEY });
      queryClient.invalidateQueries({ queryKey: APPOINTMENTS_ALL_KEY });
      queryClient.invalidateQueries({ queryKey: ['appointments', 'practitioner'] });
    },
  });
}

export function useRescheduleAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ appointmentId, newDate, newTime }) => {
      const update = { status: 'rescheduled' };
      if (newDate) update.date = newDate;
      if (newTime) update.time = newTime;
      // When rescheduled to a fresh slot, treat it as active again.
      if (newDate && newTime) update.status = 'scheduled';
      const { data, error } = await supabase
        .from('appointments')
        .update(update)
        .eq('id', appointmentId)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APPOINTMENTS_KEY });
      queryClient.invalidateQueries({ queryKey: APPOINTMENTS_ALL_KEY });
      queryClient.invalidateQueries({ queryKey: ['appointments', 'practitioner'] });
    },
  });
}