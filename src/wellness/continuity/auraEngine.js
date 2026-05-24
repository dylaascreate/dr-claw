import { getMissedMeds, getLowAdherenceMeds, hasConcerningPattern } from './patientProfile.js';

const ACTIONS = {
  swellingLog: 'Reply with 0–3 for today\'s right-leg swelling so I can update your trend.',
  elevate: 'Elevate your right leg on two pillows for 15 minutes after your next meal.',
  walk: 'Take 3 minutes of slow indoor steps — stop if calf pain appears.',
  clopidogrel: 'Take this morning\'s Clopidogrel 75mg with water now if you haven\'t yet.',
  woundPhoto: 'Send a wound photo from the same angle as last time when you can.',
  painLog: 'After resting, tell me the calf pain score 0–10 and whether it eased.',
  claimGuide: 'Open Claims from the home screen, tap New Submission, and upload your vascular invoice.',
  bookGuide: 'Use Book on your dashboard to confirm or change your vascular follow-up slot.',
  trackGuide: 'Tap Track on your dashboard anytime for a structured recovery snapshot.',
};

function name(profile) {
  return profile.patient.firstName;
}

function edemaLabel(profile, score) {
  return profile.edema.scoreLabels[score] ?? 'unrecorded';
}

function stepDropPct(profile) {
  const { priorWeekAvg, sevenDayAvg } = profile.activity;
  return Math.round(((priorWeekAvg - sevenDayAvg) / priorWeekAvg) * 100);
}

function statusSnapshot(profile) {
  const missed = getMissedMeds(profile);
  return (
    `${edemaLabel(profile, profile.edema.scoreToday)} swelling on the right leg, ` +
    `${profile.activity.sevenDayAvg.toLocaleString()}-step weekly average, ` +
    `${missed.length ? `${missed.length} medication gap(s) yesterday` : 'medications logged yesterday'}, ` +
    `${profile.engagement.daysSinceAppCheckIn} days since your last check-in`
  );
}

function domainMenu() {
  return (
    '\n\nPlease choose one:\n' +
    '1. Track my recovery\n' +
    '2. Medication & symptoms\n' +
    '3. Appointments\n' +
    '4. Insurance claims'
  );
}

function formatClinical(metric, interpretation, actionKey) {
  return `${metric} ${interpretation} One step for now: ${ACTIONS[actionKey]}`;
}

function swellingArc(profile) {
  const { history, edema } = profile;
  return (
    `Since discharge: ${edemaLabel(profile, history.swellingAtDischarge)} → ` +
    `${edemaLabel(profile, history.swellingSevenDaysAgo)} (week ago) → ` +
    `${edemaLabel(profile, edema.scoreToday)} today (${edema.trend}).`
  );
}

function walkingArc(profile) {
  const { activity } = profile;
  const drop = stepDropPct(profile);
  return (
    `7-day average ${activity.sevenDayAvg.toLocaleString()} steps (${drop}% below last week); ` +
    `today ${activity.todaySteps.toLocaleString()} of ${activity.dailyGoalSteps.toLocaleString()} goal — ${activity.trend}.`
  );
}

function medArc(profile) {
  const missed = getMissedMeds(profile);
  const clop = profile.medications.find((m) => m.id === 'clopidogrel');
  if (missed.length) {
    return (
      `Yesterday: ${missed.map((m) => m.name).join(' and ')} not logged. ` +
      `Clopidogrel adherence ${Math.round(clop.adherence7d * 100)}% this week.`
    );
  }
  return `Yesterday's doses logged. Clopidogrel adherence ${Math.round(clop.adherence7d * 100)}% this week.`;
}

function escalationTail(profile) {
  if (!hasConcerningPattern(profile)) return '';
  return (
    ' Swelling, walking, and medications are trending together — flagged for Dr. Hassan. ' +
    'Sudden calf pain, pale/cold foot, or rapid one-sided swelling: contact vascular team or emergency.'
  );
}

// ── Strict input classification ─────────────────────────────────────────────

/**
 * @returns {{
 *   category: 'vascular_recovery_related' | 'workflow_request' | 'off_topic',
 *   intent?: string,
 *   workflow?: 'track' | 'booking' | 'claims',
 *   reason?: string
 * }}
 */
export function classifyInput(message) {
  const lower = message.toLowerCase().trim();

  // Menu selections (structured demo paths)
  if (/^1[\.\)\:]?\s*$|^1\.?\s*track|track my recovery|track recovery/.test(lower)) {
    return { category: 'workflow_request', workflow: 'track' };
  }
  if (/^2[\.\)\:]?\s*$|^2\.?\s*med|medication.*symptom|meds.*symptom/.test(lower)) {
    return { category: 'vascular_recovery_related', intent: 'medication' };
  }
  if (/^3[\.\)\:]?\s*$|^3\.?\s*appoint|book.*appoint|book.*visit|book.*specialist/.test(lower)) {
    return { category: 'workflow_request', workflow: 'booking' };
  }
  if (/^4[\.\)\:]?\s*$|^4\.?\s*claim|insurance claim|submit.*claim/.test(lower)) {
    return { category: 'workflow_request', workflow: 'claims' };
  }

  // Workflow requests (explicit)
  if (/^track\b|continuity check|check.?in|recovery snapshot|how am i doing|how've i been/.test(lower)) {
    return { category: 'workflow_request', workflow: 'track' };
  }
  if (/^book\b|schedule.*visit|open booking|reschedule|make an appoint/.test(lower)) {
    return { category: 'workflow_request', workflow: 'booking' };
  }
  if (/^claims?\b|insur|reimburs|submit.*bill|upload.*invoice/.test(lower)) {
    return { category: 'workflow_request', workflow: 'claims' };
  }

  // Vascular recovery (strict allow-list)
  if (/^[0-3]$/.test(lower)) {
    return { category: 'vascular_recovery_related', intent: 'swelling' };
  }

  const vascularIntent = detectVascularIntent(lower);
  if (vascularIntent) {
    return { category: 'vascular_recovery_related', intent: vascularIntent };
  }

  // Off-topic signals
  if (/^(hi|hello|hey|good morning|good evening|howdy)\b/.test(lower)) {
    return { category: 'off_topic', reason: 'greeting' };
  }
  if (/^(thanks|thank you|ok|okay|got it|will do|done)\b/.test(lower)) {
    return { category: 'off_topic', reason: 'ack' };
  }
  if (/\d+\s*[\+\-\*\/x]\s*\d+/.test(lower)) {
    return { category: 'off_topic', reason: 'math' };
  }
  if (/capital of|who won|tell me a joke|write (me )?(a )?(poem|story|code|essay)/.test(lower)) {
    return { category: 'off_topic', reason: 'trivia' };
  }
  if (/weather|bitcoin|stock price|recipe for|translate this|meaning of life|chatgpt|what is ai/.test(lower)) {
    return { category: 'off_topic', reason: 'general' };
  }
  if (/^(what|who|why|where|when) (is|are|was|were) (the|a|an) /.test(lower)) {
    return { category: 'off_topic', reason: 'general_knowledge' };
  }

  // Strict lock: unknown input is off-topic
  return { category: 'off_topic', reason: 'unknown' };
}

function detectVascularIntent(lower) {
  if (
    /swell|edema|puff|ankle|fluid|tight shoe|heavy leg|right leg feels/.test(lower) ||
    (/\b[0-3]\b/.test(lower) && /leg|swell|score|rate|feel/.test(lower))
  ) {
    return 'swelling';
  }
  if (/walk|step|mobil|exercise|activity|claudicat|how far/.test(lower)) return 'walk';
  if (/wound|dressing|bandage|photo|redness|surgical site|incision|malleolus/.test(lower)) return 'wound';
  if (/med|pill|dose|clopidogrel|statin|furosemide|forgot|missed|adherence|symptom|take my/.test(lower)) {
    return 'medication';
  }
  if (/pain|hurt|cramp|calf|numb|cold foot|pale foot|colour|color/.test(lower)) return 'pain';
  if (/appoint|follow.?up|abi|dr\.?\s*amira|vascular|see (the )?doctor|friday visit/.test(lower)) {
    return 'appointment';
  }
  return null;
}

// ── Domain-locked replies ─────────────────────────────────────────────────────

function replyDomainRedirect(profile, reason) {
  const n = name(profile);
  const prefix =
    reason === 'greeting'
      ? `${n}, I'm Dr Claw — your vascular continuity assistant. I don't handle general conversation.`
      : reason === 'math' || reason === 'trivia' || reason === 'general_knowledge'
        ? `${n}, I can't answer general questions — I'm locked to your vascular recovery record only.`
        : `${n}, that request is outside my clinical scope. I only support PAD recovery continuity.`;

  return (
    `${prefix}\n\n` +
    `Current status: ${statusSnapshot(profile)}.` +
    domainMenu()
  );
}

function replyVascular(profile, intent, message) {
  switch (intent) {
    case 'swelling':
      return replySwelling(profile, message);
    case 'walk':
      return replyWalk(profile);
    case 'wound':
      return replyWound(profile);
    case 'medication':
      return replyMedication(profile);
    case 'pain':
      return replyPain(profile);
    case 'appointment':
      return replyAppointment(profile);
    default:
      return replyDomainRedirect(profile, 'unknown');
  }
}

function replySwelling(profile, message) {
  const n = name(profile);
  const { edema } = profile;
  const scoreMatch = message.trim().match(/^([0-3])$/) || message.match(/\b([0-3])\b/);

  if (scoreMatch) {
    const score = Number(scoreMatch[1]);
    if (score >= 3) {
      return (
        `${n}, ` +
        formatClinical(
          `Logged swelling ${score}/3 (severe).`,
          `${swellingArc(profile)} This needs same-day review.`,
          'elevate',
        ) +
        escalationTail(profile) +
        domainMenu()
      );
    }
    if (score > edema.scoreYesterday) {
      return (
        `${n}, ` +
        formatClinical(
          `Logged ${score}/3 (${edemaLabel(profile, score)}), up from yesterday's ${edema.scoreYesterday}.`,
          `Pattern is ${edema.trend} — often linked to ${profile.activity.todaySteps.toLocaleString()} steps today.`,
          'elevate',
        ) +
        escalationTail(profile)
      );
    }
    return (
      `${n}, ` +
      formatClinical(
        `Logged ${score}/3 (${edemaLabel(profile, score)}), improved from yesterday's ${edema.scoreYesterday}.`,
        'First stabilising signal this week — keep monitoring daily.',
        'walk',
      )
    );
  }

  return (
    `${n}, ` +
    formatClinical(
      `Right-leg swelling: ${edemaLabel(profile, edema.scoreToday)} (${edema.scoreToday}/3).`,
      `${swellingArc(profile)} Last check-in ${profile.edema.daysSinceCheckIn} days ago.`,
      'swellingLog',
    ) +
    escalationTail(profile)
  );
}

function replyWalk(profile) {
  const n = name(profile);
  const { activity } = profile;

  return (
    `${n}, ` +
    formatClinical(
      `Steps: ${activity.todaySteps.toLocaleString()} today; ${walkingArc(profile)}`,
      `${activity.daysBelowGoal} days below goal — reduced mobility can worsen ${edemaLabel(profile, profile.edema.scoreToday)} swelling.`,
      'walk',
    ) +
    escalationTail(profile)
  );
}

function replyWound(profile) {
  const n = name(profile);
  const { wound, vitals } = profile;

  return (
    `${n}, ` +
    formatClinical(
      `Wound site: ${wound.site}; last photo ${wound.daysSincePhoto} days ago; right ABI ${vitals.abiRight}.`,
      `${wound.dressingChangedToday ? 'Dressing changed today.' : 'No dressing change logged today.'} Healing depends on blood flow and daily monitoring.`,
      'woundPhoto',
    ) +
    escalationTail(profile)
  );
}

function replyMedication(profile) {
  const n = name(profile);
  const missed = getMissedMeds(profile);
  const low = getLowAdherenceMeds(profile);

  const metric = `Medications: ${medArc(profile)}${low.length ? ` Lowest: ${low.map((m) => `${m.name} ${Math.round(m.adherence7d * 100)}%`).join(', ')}.` : ''}`;
  const interpretation = `Swelling is ${edemaLabel(profile, profile.edema.scoreToday)} at ${profile.activity.todaySteps.toLocaleString()} steps — antiplatelet consistency matters after angioplasty.`;

  return (
    `${n}, ${formatClinical(metric, interpretation, missed.length ? 'clopidogrel' : 'swellingLog')}` +
    escalationTail(profile)
  );
}

function replyPain(profile) {
  const n = name(profile);
  const { activity, vitals } = profile;

  return (
    `${n}, ` +
    formatClinical(
      `Right ABI ${vitals.abiRight}; averaging ${activity.sevenDayAvg.toLocaleString()} steps (${activity.trend}).`,
      'Calf pain on walking may be claudication — track severity and rest relief. Sudden severe pain or pale foot: call vascular team today.',
      'painLog',
    ) +
    escalationTail(profile)
  );
}

function replyAppointment(profile) {
  const n = name(profile);
  const { appointment, vitals, edema, activity } = profile;

  return (
    `${n}, ` +
    formatClinical(
      `Next visit: ${appointment.practitioner}, ${appointment.date} at ${appointment.time} (${appointment.title}).`,
      `She'll review ABI (R ${vitals.abiRight} / L ${vitals.abiLeft}), swelling ${edemaLabel(profile, edema.scoreYesterday)}→${edemaLabel(profile, edema.scoreToday)}, steps ${activity.sevenDayAvg.toLocaleString()} avg.`,
      'swellingLog',
    )
  );
}

function replyWorkflowTrack(profile) {
  return getTrackCheckInSummary(profile);
}

function replyWorkflowBooking(profile) {
  const n = name(profile);
  const { appointment } = profile;

  return (
    `${n}, ` +
    formatClinical(
      `Scheduled: ${appointment.practitioner}, ${appointment.date} — ${appointment.title}.`,
      'Opening booking so you can confirm or reschedule your vascular follow-up.',
      'bookGuide',
    )
  );
}

function replyWorkflowClaims(profile) {
  const n = name(profile);
  const { appointment } = profile;

  return (
    `${n}, ` +
    formatClinical(
      `Upcoming claimable visit: ${appointment.title} on ${appointment.date}.`,
      'Recovery logs in CareTrack can support insurer continuity documentation.',
      'claimGuide',
    )
  );
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * @param {{ message: string, profile: object }} ctx
 * @returns {{ text: string, workflow?: 'booking' | 'claims' | null }}
 */
export function resolveChatInput({ message, profile }) {
  const classification = classifyInput(message);

  if (classification.category === 'off_topic') {
    return { text: replyDomainRedirect(profile, classification.reason), workflow: null };
  }

  if (classification.category === 'workflow_request') {
    switch (classification.workflow) {
      case 'track':
        return { text: replyWorkflowTrack(profile), workflow: null };
      case 'booking':
        return { text: replyWorkflowBooking(profile), workflow: 'booking' };
      case 'claims':
        return { text: replyWorkflowClaims(profile), workflow: 'claims' };
      default:
        return { text: replyDomainRedirect(profile, 'unknown'), workflow: null };
    }
  }

  return {
    text: replyVascular(profile, classification.intent, message),
    workflow: null,
  };
}

/** @returns {string} */
export function getContinuityReply(ctx) {
  return resolveChatInput(ctx).text;
}

export function getTrackCheckInSummary(profile) {
  const n = name(profile);
  const missed = getMissedMeds(profile);
  const { activity, edema, appointment } = profile;
  const clop = profile.medications.find((m) => m.id === 'clopidogrel');
  const nextAction = missed.some((m) => m.id === 'clopidogrel')
    ? ACTIONS.clopidogrel
    : ACTIONS.swellingLog;

  return (
    `${n} — vascular continuity snapshot\n\n` +
    `Walking\n` +
    `• Today: ${activity.todaySteps.toLocaleString()} steps (goal ${activity.dailyGoalSteps.toLocaleString()})\n` +
    `• 7-day average: ${activity.sevenDayAvg.toLocaleString()} — ${activity.trend} (${stepDropPct(profile)}% vs last week)\n` +
    `• Interpretation: reduced walking may be contributing to fluid retention.\n\n` +
    `Swelling (right leg)\n` +
    `• Current: ${edemaLabel(profile, edema.scoreToday)} (score ${edema.scoreToday}/3)\n` +
    `• Trend: ${edemaLabel(profile, edema.scoreYesterday)} → ${edemaLabel(profile, edema.scoreToday)} — ${edema.trend}\n` +
    `• Interpretation: mild worsening since last check-in — monitor daily.\n\n` +
    `Medications\n` +
    `• Yesterday: ${missed.length ? missed.map((m) => `${m.name} ${m.dose} not logged`).join('; ') : 'all doses logged'}\n` +
    `• Clopidogrel adherence (7d): ${Math.round(clop.adherence7d * 100)}%\n` +
    `• Interpretation: ${missed.length ? 'gaps in antiplatelet therapy increase recovery risk.' : 'adherence stable this week.'}\n\n` +
    `Next visit: ${appointment.practitioner}, ${appointment.date}\n\n` +
    `One step for now: ${nextAction}` +
    escalationTail(profile)
  );
}

export function buildDemoJourneyMessages(profile, mode = 'returning_user') {
  if (mode === 'new_user') {
    return buildNewUserJourney(profile);
  }
  return buildReturningUserJourney(profile);
}

function buildNewUserJourney(profile) {
  const n = name(profile);
  const { patient, appointment, careTeam } = profile;

  return [
    {
      sender: 'drclaw',
      text:
        `Welcome, ${n}. I'm Dr Claw — your vascular continuity assistant after right-leg angioplasty. ` +
        `I only handle recovery monitoring between clinic visits.`,
    },
    {
      sender: 'drclaw',
      text:
        `I track four areas: walking activity, leg swelling, medications, and wound healing. ` +
        `Week ${patient.weeksPostProcedure} is when daily habits shape your outcome.`,
    },
    {
      sender: 'drclaw',
      text:
        `${careTeam.vascularSurgeon} is booked ${appointment.date} (${appointment.title}). ` +
        `Tap Track for a recovery snapshot, or choose an option:\n` +
        `1. Track my recovery\n2. Medication & symptoms\n3. Appointments\n4. Insurance claims`,
    },
  ];
}

function buildReturningUserJourney(profile) {
  const n = name(profile);
  const missed = getMissedMeds(profile);
  const { edema, activity, engagement, appointment, patient } = profile;

  return [
    {
      sender: 'drclaw',
      text:
        `Good to see you, ${n}. Week ${patient.weeksPostProcedure} post-angioplasty — ` +
        `chart current since ${engagement.lastCheckInLabel}.`,
    },
    {
      sender: 'drclaw',
      text:
        `Status: swelling ${edemaLabel(profile, profile.history.swellingSevenDaysAgo)} → ${edemaLabel(profile, edema.scoreToday)} (${edema.trend}); ` +
        `steps ${activity.sevenDayAvg.toLocaleString()}/day (${stepDropPct(profile)}% below prior week); ` +
        `${missed.length ? `${missed.map((m) => m.name).join(' + ')} missed yesterday.` : 'medications complete yesterday.'}`,
    },
    {
      sender: 'drclaw',
      text:
        `${appointment.practitioner} follow-up: ${appointment.date}. ` +
        `Tap Track for a structured snapshot, or reply with a number:\n` +
        `1. Track my recovery\n2. Medication & symptoms\n3. Appointments\n4. Insurance claims`,
    },
  ];
}

export const DEMO_USER_MODE_KEY = 'drclaw_demo_user_mode';

export function readDemoUserMode() {
  try {
    return sessionStorage.getItem(DEMO_USER_MODE_KEY) === 'new_user' ? 'new_user' : 'returning_user';
  } catch {
    return 'returning_user';
  }
}

export function writeDemoUserMode(mode) {
  try {
    sessionStorage.setItem(DEMO_USER_MODE_KEY, mode);
  } catch {
    /* demo-only */
  }
}

/** Context-aware suggestion pills — vascular intents only */
export const SUGGESTION_PROMPTS = [
  {
    label: '🦵 Swelling trend',
    prompt: 'My right leg feels heavier — how is my swelling trend since discharge?',
  },
  {
    label: '👟 Steps this week',
    prompt: 'How are my steps this week compared to last week?',
  },
  {
    label: '💊 Missed doses',
    prompt: 'Did I miss any medications yesterday?',
  },
  {
    label: '🩹 Wound check',
    prompt: 'When should I send my next wound photo?',
  },
];
