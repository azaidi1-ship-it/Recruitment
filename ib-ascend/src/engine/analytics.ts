import { addDays, parseLocalDate, toLocalDate } from '../lib/dates';
import type { ISODate, Section, SectionId, Session } from '../types/models';

// ───────────────────────────── Activity heatmap ─────────────────────────────

export interface HeatCell {
  date: ISODate;
  count: number;
  /** 0 (none) to 4 (most). */
  level: number;
}

/** Shade for a day's activity count: 0 for none, then one level per threshold passed. */
export function heatLevel(count: number, bins: readonly number[]): number {
  let level = 0;
  for (const b of bins) if (count >= b) level += 1;
  return level;
}

/**
 * Daily activity counts for a `weeks`-column heatmap ending today. Columns
 * are Monday–Sunday weeks; the grid starts on the Monday `weeks − 1` weeks
 * before this week's Monday and stops at today.
 */
export function activityGrid(
  timestamps: string[],
  today: ISODate,
  weeks: number,
  bins: readonly number[],
): { weeks: HeatCell[][]; total: number; activeDays: number } {
  const counts = new Map<ISODate, number>();
  for (const t of timestamps) {
    const d = toLocalDate(new Date(t));
    counts.set(d, (counts.get(d) ?? 0) + 1);
  }
  const dow = (parseLocalDate(today).getDay() + 6) % 7; // Monday = 0
  const start = addDays(today, -dow - (weeks - 1) * 7);
  const cols: HeatCell[][] = [];
  let total = 0;
  let activeDays = 0;
  for (let w = 0; w < weeks; w++) {
    const col: HeatCell[] = [];
    for (let d = 0; d < 7; d++) {
      const date = addDays(start, w * 7 + d);
      if (date > today) break;
      const count = counts.get(date) ?? 0;
      total += count;
      if (count > 0) activeDays += 1;
      col.push({ date, count, level: heatLevel(count, bins) });
    }
    cols.push(col);
  }
  return { weeks: cols, total, activeDays };
}

// ───────────────────────────── Mock trends ─────────────────────────────

export interface MockPoint {
  date: ISODate;
  /** 0–100 */
  score: number;
  run: number;
}

/** Finished Boss Fight scores for a section, oldest first. */
export function mockSeries(sessions: Pick<Session, 'mode' | 'sectionId' | 'finishedAt' | 'score' | 'startedAt'>[], sectionId: SectionId): MockPoint[] {
  return sessions
    .filter((s) => s.mode === 'mock' && s.sectionId === sectionId && s.finishedAt && s.score !== null)
    .sort((a, b) => a.startedAt.localeCompare(b.startedAt))
    .map((s, i) => ({ date: toLocalDate(new Date(s.finishedAt as string)), score: Math.round((s.score as number) * 100), run: i + 1 }));
}

// ───────────────────────────── Weak subtopics ─────────────────────────────

export interface WeakSubtopic {
  sectionId: SectionId;
  sectionTitle: string;
  subtopicId: string;
  title: string;
  mastery: number;
  attempts: number;
}

/**
 * The weakest subtopics in unlocked sections: attempted subtopics below the
 * ceiling, lowest mastery first, then untested subtopics in sections you've
 * already started. Subtopics with no questions are skipped.
 */
export function weakestSubtopics(input: {
  sections: Pick<Section, 'id' | 'shortTitle' | 'subtopics'>[];
  unlocked: SectionId[];
  subtopicMastery: Record<string, number>;
  subtopicAttempts: Record<string, number>;
  questionCounts: Record<string, number>;
  ceiling: number;
  n: number;
}): WeakSubtopic[] {
  const tested: WeakSubtopic[] = [];
  const untested: WeakSubtopic[] = [];
  for (const s of input.sections) {
    if (!input.unlocked.includes(s.id)) continue;
    const started = s.subtopics.some((t) => (input.subtopicAttempts[`${s.id}/${t.id}`] ?? 0) > 0);
    for (const t of s.subtopics) {
      const key = `${s.id}/${t.id}`;
      if (!(input.questionCounts[key] ?? 0)) continue;
      const attempts = input.subtopicAttempts[key] ?? 0;
      const mastery = input.subtopicMastery[key] ?? 0;
      const row = { sectionId: s.id, sectionTitle: s.shortTitle, subtopicId: t.id, title: t.title, mastery, attempts };
      if (attempts > 0 && mastery < input.ceiling) tested.push(row);
      else if (attempts === 0 && started) untested.push(row);
    }
  }
  tested.sort((a, b) => a.mastery - b.mastery || b.attempts - a.attempts);
  return [...tested, ...untested].slice(0, input.n);
}
