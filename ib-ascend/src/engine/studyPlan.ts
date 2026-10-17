import { daysBetween } from '../lib/dates';
import type { CalendarEvent, ISODate } from '../types/models';

export type PlanPhase = 'normal' | 'build' | 'ramp' | 'final-week' | 'taper';

export interface StudyPlan {
  /** Suggested minutes today. */
  minutes: number;
  phase: PlanPhase;
  /** The next interview or Superday, if any. */
  next: { event: CalendarEvent; daysLeft: number } | null;
  /** Application deadlines in the next 7 days. */
  deadlines: { event: CalendarEvent; daysLeft: number }[];
  focus: string[];
}

export const PHASE_LABEL: Record<PlanPhase, string> = {
  normal: 'Steady practice',
  build: 'Building up',
  ramp: 'Ramping up',
  'final-week': 'Final week',
  taper: 'Taper',
};

/**
 * Daily study load from the recruiting calendar. The closer the next
 * interview, the more time and the more interview-like the practice, until
 * the last two days, which taper so you arrive rested.
 */
export function studyPlan(events: CalendarEvent[], today: ISODate, baseMinutes: number, firmName?: (id: string) => string | undefined): StudyPlan {
  const upcoming = events.filter((e) => e.date >= today).sort((a, b) => a.date.localeCompare(b.date));
  const interview = upcoming.find((e) => e.kind === 'interview' || e.kind === 'superday');
  const next = interview ? { event: interview, daysLeft: daysBetween(today, interview.date) } : null;
  const deadlines = upcoming
    .filter((e) => e.kind === 'deadline')
    .map((event) => ({ event, daysLeft: daysBetween(today, event.date) }))
    .filter((d) => d.daysLeft <= 7);
  const firm = next?.event.firmId ? firmName?.(next.event.firmId) : undefined;

  let phase: PlanPhase = 'normal';
  let minutes = baseMinutes;
  const focus: string[] = [];
  if (next) {
    const d = next.daysLeft;
    if (d <= 2) {
      phase = 'taper';
      minutes = Math.max(30, Math.round(baseMinutes / 2));
      focus.push('Light review only: cheat sheets and your review queue', 'Rehearse your 60-second walkthrough and Why IB out loud', firm ? `Re-read your ${firm} notes and Why ${firm}` : 'Re-read your notes on the firm', 'Sleep well; no new material');
    } else if (d <= 7) {
      phase = 'final-week';
      minutes = Math.max(baseMinutes, 120);
      focus.push('A Boss Fight or Superday round every day', 'Clear your review queue daily', 'Practice your top 6 stories out loud', firm ? `Prepare Why ${firm} and two questions to ask` : 'Prepare Why [firm] and two questions to ask');
    } else if (d <= 21) {
      phase = 'ramp';
      minutes = Math.max(baseMinutes, 90);
      focus.push('Close your weakest sections (see Weakest subtopics)', 'Two Boss Fights a week', 'One Superday simulation a week', 'Fill in the [FILL IN] gaps in your stories');
    } else if (d <= 45) {
      phase = 'build';
      minutes = Math.max(baseMinutes, 75);
      focus.push('Finish the remaining sections on the skill tree', 'Log a deal and a market note each week', 'Practice three behavioral questions a week');
    }
  }
  if (phase === 'normal') focus.push('Follow the next best action on the dashboard', 'Keep your streak and review queue going');
  for (const dl of deadlines) focus.unshift(`Submit: ${dl.event.title} (${dl.daysLeft === 0 ? 'today' : `in ${dl.daysLeft} day${dl.daysLeft === 1 ? '' : 's'}`})`);
  return { minutes, phase, next, deadlines, focus };
}
