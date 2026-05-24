/**
 * Mock continuity profile — PAD / vascular recovery (hackathon demo).
 * Single source of truth for Aura / Dr Claw local reasoning.
 */

export const patientProfile = {
  patient: {
    firstName: 'Joel',
    condition: 'Peripheral artery disease — recovery after right-leg angioplasty',
    weeksPostProcedure: 6,
  },

  careTeam: {
    vascularSurgeon: 'Dr. Amira Hassan',
    woundNurse: 'Sister Lina Wong',
  },

  appointment: {
    title: 'Vascular Follow-up & ABI Review',
    practitioner: 'Dr. Amira Hassan',
    date: 'Fri, Oct 24',
    time: '10:00 AM',
    location: 'KPJ Damansara Specialist',
    avatar:
      'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=200&auto=format&fit=crop',
    checkedIn: false,
  },

  medications: [
    {
      id: 'clopidogrel',
      name: 'Clopidogrel',
      dose: '75mg',
      schedule: 'once each morning',
      adherence7d: 0.71,
      missedYesterday: true,
    },
    {
      id: 'atorvastatin',
      name: 'Atorvastatin',
      dose: '40mg',
      schedule: 'once each evening',
      adherence7d: 0.86,
      missedYesterday: false,
    },
    {
      id: 'furosemide',
      name: 'Furosemide',
      dose: '20mg',
      schedule: 'when swelling rises',
      adherence7d: 0.57,
      missedYesterday: true,
    },
  ],

  activity: {
    dailyGoalSteps: 2500,
    todaySteps: 890,
    sevenDayAvg: 1420,
    priorWeekAvg: 2100,
    trend: 'declining',
    daysBelowGoal: 4,
  },

  edema: {
    affectedLeg: 'right',
    scoreToday: 2,
    scoreYesterday: 1,
    scoreLabels: ['none', 'mild', 'moderate', 'severe'],
    trend: 'worsening',
    daysSinceCheckIn: 3,
  },

  wound: {
    site: 'Right lateral malleolus (surgical site)',
    daysSincePhoto: 4,
    rednessReported: false,
    dressingChangedToday: false,
  },

  vitals: {
    abiRight: 0.78,
    abiLeft: 0.92,
    lastAbiDate: 'Oct 10',
  },

  engagement: {
    daysSinceAppCheckIn: 3,
    daysSinceChatReply: 2,
    ignoredNudges: 2,
    riskLevel: 'elevated',
    lastCheckInLabel: 'Tuesday, Oct 21',
  },

  /** Continuity arc — referenced so replies feel like they remember the journey */
  history: {
    daysSinceAngioplasty: 42,
    swellingAtDischarge: 0,
    swellingSevenDaysAgo: 1,
    stepsSevenDaysAgoAvg: 1680,
    clopidogrelAdherenceAtDischarge: 0.95,
  },
};

export function getMissedMeds(profile) {
  return profile.medications.filter((m) => m.missedYesterday);
}

export function getLowAdherenceMeds(profile) {
  return profile.medications.filter((m) => m.adherence7d < 0.75);
}

export function hasConcerningPattern(profile) {
  const swellingUp = profile.edema.trend === 'worsening' && profile.edema.scoreToday >= 2;
  const stepsDown = profile.activity.trend === 'declining';
  const medsSlipping = getMissedMeds(profile).length >= 1;
  return swellingUp && stepsDown && medsSlipping;
}

export function buildAppointmentFromProfile(profile) {
  return { ...profile.appointment };
}

export function buildInitialNotifications(profile) {
  const { appointment, edema } = profile;
  const missed = getMissedMeds(profile);
  const missedNames = missed.map((m) => m.name).join(' & ');

  return [
    {
      icon: '✅',
      color: 'text-green-600',
      bg: 'bg-green-50',
      title: 'Vascular follow-up confirmed',
      desc: `${appointment.title} — ${appointment.date} at ${appointment.time}`,
      time: 'Just now',
    },
    {
      icon: '🦵',
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      title: 'Swelling trend noted',
      desc: `Right leg: mild → moderate since your last check-in (${edema.daysSinceCheckIn}d ago)`,
      time: '4h ago',
    },
    {
      icon: '💊',
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      title: 'Medication gap',
      desc: missed.length
        ? `${missedNames} not logged yesterday — tap Track for a 30s check-in`
        : 'All doses logged yesterday',
      time: '1d ago',
    },
  ];
}
