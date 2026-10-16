import { SRS } from '../config/gameConfig';
import { addDays, toLocalDate } from '../lib/dates';
import type { Card, CardSource, ISODate, SectionId } from '../types/models';

/**
 * SM-2 spaced repetition (Wozniak, 1987), the algorithm behind SuperMemo 2
 * and early Anki:
 *
 *   quality q ∈ 0–5. q < 3 is a lapse: repetitions reset and the card comes
 *   back tomorrow. Otherwise the interval goes 1 day → 6 days → previous ×
 *   ease. Ease moves by 0.1 − (5 − q)(0.08 + 0.02(5 − q)), floored at 1.3.
 *
 * One tweak: Easy on a card's first successful review gives 4 days rather
 * than 1, so cards you already know don't come back tomorrow.
 */

export type SchedulingFields = Pick<Card, 'easiness' | 'intervalDays' | 'repetitions' | 'lapses' | 'due'>;

/** Deterministic card id, so enrolling twice never duplicates. */
export function cardId(source: CardSource, sourceId: string): string {
  return `${source}:${sourceId}`;
}

export function newCard(
  source: CardSource,
  sourceId: string,
  sectionId: SectionId | null,
  now: Date,
  due: ISODate = toLocalDate(now),
): Card {
  return {
    id: cardId(source, sourceId),
    source,
    sourceId,
    sectionId,
    easiness: SRS.initialEase,
    intervalDays: 0,
    repetitions: 0,
    lapses: 0,
    due,
    lastReviewedAt: null,
    firstReviewedAt: null,
    createdAt: now.toISOString(),
  };
}

export function nextEase(ease: number, quality: number): number {
  const d = 5 - quality;
  return Math.max(SRS.minEase, ease + 0.1 - d * (0.08 + d * 0.02));
}

/** Apply one review. Pure: returns the updated scheduling fields. */
export function schedule(card: SchedulingFields, quality: number, today: ISODate): SchedulingFields {
  const q = Math.max(0, Math.min(5, Math.round(quality)));
  const easiness = nextEase(card.easiness, q);
  if (q < 3) {
    return {
      easiness,
      intervalDays: SRS.firstIntervalDays,
      repetitions: 0,
      lapses: card.lapses + (card.repetitions > 0 ? 1 : 0),
      due: addDays(today, SRS.firstIntervalDays),
    };
  }
  const repetitions = card.repetitions + 1;
  const raw =
    repetitions === 1
      ? q === 5
        ? SRS.easyFirstIntervalDays
        : SRS.firstIntervalDays
      : repetitions === 2
        ? SRS.secondIntervalDays
        : Math.round(card.intervalDays * easiness);
  const intervalDays = Math.min(SRS.maxIntervalDays, Math.max(1, raw));
  return { easiness, intervalDays, repetitions, lapses: card.lapses, due: addDays(today, intervalDays) };
}

/** Days until the card returns for a given quality, for the review buttons. */
export function previewInterval(card: SchedulingFields, quality: number, today: ISODate): number {
  return schedule(card, quality, today).intervalDays;
}

/**
 * A question answered wrong outside the review queue: treat as a lapse, but
 * bring it back after the configured delay rather than straight away (the
 * explanation was just shown).
 */
export function lapseFromQuiz(card: SchedulingFields, today: ISODate): SchedulingFields {
  const s = schedule(card, SRS.quality.again, today);
  return { ...s, due: addDays(today, SRS.missedQuestionDelayDays) };
}

/** A flashcard that has never been reviewed is "new" and subject to the daily limit. */
export function isNewFlashcard(card: Pick<Card, 'source' | 'lastReviewedAt'>): boolean {
  return card.source === 'flashcard' && card.lastReviewedAt === null;
}

export function introducedOn(cards: Pick<Card, 'firstReviewedAt'>[], day: ISODate): number {
  return cards.filter((c) => c.firstReviewedAt && toLocalDate(new Date(c.firstReviewedAt)) === day).length;
}

export interface ReviewQueue<C> {
  /** Due cards already in rotation (plus missed questions and stories), most overdue first. */
  due: C[];
  /** New flashcards to introduce today, within the daily limit. */
  fresh: C[];
}

/**
 * Today's queue. `newLimit` is the remaining allowance after cards already
 * introduced today. Optional section filter.
 */
export function buildQueue<C extends Card>(
  cards: C[],
  today: ISODate,
  opts: { newLimit?: number; sectionId?: SectionId | null } = {},
): ReviewQueue<C> {
  const scoped = opts.sectionId ? cards.filter((c) => c.sectionId === opts.sectionId) : cards;
  const limit = Math.max(0, opts.newLimit ?? SRS.newCardsPerDay - introducedOn(cards, today));
  const due = scoped
    .filter((c) => !isNewFlashcard(c) && c.due <= today)
    .sort((a, b) => a.due.localeCompare(b.due) || a.createdAt.localeCompare(b.createdAt));
  const fresh = scoped
    .filter((c) => isNewFlashcard(c) && c.due <= today)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt) || a.id.localeCompare(b.id))
    .slice(0, limit);
  return { due, fresh };
}

/**
 * Cards coming due on each of the next `days` days (index 0 = today,
 * including overdue). New flashcards aren't forecast: they enter at the daily
 * rate when you choose to study them.
 */
export function forecast(cards: Card[], today: ISODate, days: number): { date: ISODate; count: number }[] {
  const out = Array.from({ length: days }, (_, i) => ({ date: addDays(today, i), count: 0 }));
  for (const c of cards) {
    if (isNewFlashcard(c)) continue;
    const idx = c.due <= today ? 0 : out.findIndex((d) => d.date === c.due);
    if (idx >= 0) out[idx]!.count += 1;
  }
  return out;
}
