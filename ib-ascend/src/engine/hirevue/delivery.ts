/** Filler words and phrases that reviewers notice. "like" is counted separately: it is often legitimate. */
export const FILLERS = ['um', 'uh', 'er', 'erm', 'you know', 'sort of', 'kind of', 'basically', 'literally', 'i mean'] as const;

export type PaceBand = 'slow' | 'good' | 'fast';

export interface DeliveryStats {
  words: number;
  /** Words per minute over the recorded time; null if too short to judge. */
  wpm: number | null;
  pace: PaceBand | null;
  fillers: { phrase: string; count: number }[];
  fillerCount: number;
  /** Fillers per 100 words. */
  fillerRate: number;
  likeCount: number;
  /** Share of the allowed answer time used, 0–1. */
  timeUsed: number;
}

/** Comfortable spoken pace for a recorded interview. */
export const PACE = { slowBelow: 120, fastAbove: 170 } as const;

function countPhrase(text: string, phrase: string): number {
  const re = new RegExp(`(?:^|\\s)${phrase.replace(/ /g, '\\s+')}(?=\\s|$)`, 'g');
  return (text.match(re) ?? []).length;
}

export function analyzeDelivery(transcript: string, durationSec: number, allowedSec: number): DeliveryStats {
  const text = transcript
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const words = text ? text.split(' ').length : 0;
  const fillers = FILLERS.map((phrase) => ({ phrase, count: countPhrase(text, phrase) })).filter((f) => f.count > 0);
  const fillerCount = fillers.reduce((n, f) => n + f.count, 0);
  const enough = words >= 20 && durationSec >= 10;
  const wpm = enough ? Math.round((words / durationSec) * 60) : null;
  const pace: PaceBand | null = wpm === null ? null : wpm < PACE.slowBelow ? 'slow' : wpm > PACE.fastAbove ? 'fast' : 'good';
  return {
    words,
    wpm,
    pace,
    fillers,
    fillerCount,
    fillerRate: words ? (fillerCount / words) * 100 : 0,
    likeCount: countPhrase(text, 'like'),
    timeUsed: allowedSec > 0 ? Math.min(1, durationSec / allowedSec) : 0,
  };
}

/** Self-review checklist for on-camera delivery. */
export const DELIVERY_CHECKS = [
  { id: 'answer-first', label: 'Answered the question in my first sentence' },
  { id: 'structure', label: 'Clear structure the listener could follow' },
  { id: 'camera', label: 'Looked at the camera lens, not my own face' },
  { id: 'energy', label: 'Steady pace, good energy, no long pauses' },
  { id: 'close', label: 'Finished with a clear close, not trailing off' },
] as const;

export type DeliveryCheckId = (typeof DELIVERY_CHECKS)[number]['id'];

/** Overall HireVue answer score: 70% content (rubric), 30% delivery (checklist). */
export function hireVueScore(contentScore: number, deliveryChecks: string[]): number {
  const delivery = deliveryChecks.filter((id) => DELIVERY_CHECKS.some((c) => c.id === id)).length / DELIVERY_CHECKS.length;
  return Math.round((0.7 * contentScore + 0.3 * delivery) * 1000) / 1000;
}
