import { describe, expect, it } from 'vitest';
import { SRS } from '../../config/gameConfig';
import { buildQueue, forecast, lapseFromQuiz, newCard, nextEase, previewInterval, schedule } from '../srs';
import type { Card } from '../../types/models';

const now = new Date('2026-10-16T12:00:00');
const today = '2026-10-16';

function card(over: Partial<Card> = {}): Card {
  return { ...newCard('flashcard', 'x', 'accounting', now), ...over };
}

describe('SM-2 ease', () => {
  it('matches the SM-2 formula', () => {
    expect(nextEase(2.5, 5)).toBeCloseTo(2.6);
    expect(nextEase(2.5, 4)).toBeCloseTo(2.5);
    expect(nextEase(2.5, 3)).toBeCloseTo(2.36);
    expect(nextEase(2.5, 1)).toBeCloseTo(1.96);
  });

  it('never drops below 1.3', () => {
    expect(nextEase(1.35, 0)).toBe(SRS.minEase);
  });
});

describe('schedule', () => {
  it('goes 1 day → 6 days → interval × ease on Good', () => {
    let c = schedule(card(), 4, today);
    expect(c).toMatchObject({ intervalDays: 1, repetitions: 1, due: '2026-10-17' });
    c = schedule(c, 4, '2026-10-17');
    expect(c).toMatchObject({ intervalDays: 6, repetitions: 2, due: '2026-10-23' });
    c = schedule(c, 4, '2026-10-23');
    expect(c).toMatchObject({ intervalDays: 15, repetitions: 3, due: '2026-11-07' }); // 6 × 2.5
  });

  it('lets Easy skip ahead on the first review', () => {
    expect(schedule(card(), 5, today)).toMatchObject({ intervalDays: SRS.easyFirstIntervalDays, repetitions: 1, due: '2026-10-20' });
  });

  it('uses the updated ease for the third interval', () => {
    const c = schedule({ ...card(), repetitions: 2, intervalDays: 6 }, 5, today);
    expect(c.easiness).toBeCloseTo(2.6);
    expect(c.intervalDays).toBe(16); // round(6 × 2.6) = 15.6 → 16
  });

  it('resets on a lapse and counts it only if the card had been learned', () => {
    const learned = schedule({ ...card(), repetitions: 3, intervalDays: 15 }, 1, today);
    expect(learned).toMatchObject({ repetitions: 0, intervalDays: 1, lapses: 1, due: '2026-10-17' });
    const fresh = schedule(card(), 1, today);
    expect(fresh.lapses).toBe(0);
  });

  it('caps the interval', () => {
    const c = schedule({ ...card(), repetitions: 10, intervalDays: 300, easiness: 2.5 }, 5, today);
    expect(c.intervalDays).toBe(SRS.maxIntervalDays);
  });

  it('previews intervals for the buttons', () => {
    const c = { ...card(), repetitions: 2, intervalDays: 6 };
    expect(previewInterval(c, SRS.quality.again, today)).toBe(1);
    expect(previewInterval(c, SRS.quality.hard, today)).toBe(14); // 6 × 2.36 = 14.16
    expect(previewInterval(c, SRS.quality.good, today)).toBe(15);
    expect(previewInterval(c, SRS.quality.easy, today)).toBe(16);
  });

  it('brings a question missed in a quiz back after the delay', () => {
    const c = lapseFromQuiz({ ...card(), repetitions: 2, intervalDays: 6 }, today);
    expect(c).toMatchObject({ repetitions: 0, lapses: 1, due: '2026-10-17' });
  });
});

describe('buildQueue', () => {
  const learnedDue = card({ id: 'a', lastReviewedAt: '2026-10-10T10:00:00Z', due: '2026-10-15', repetitions: 2 });
  const learnedLater = card({ id: 'b', lastReviewedAt: '2026-10-10T10:00:00Z', due: '2026-10-20', repetitions: 2 });
  const missed = { ...newCard('question', 'q1', 'dcf', now), id: 'c' };
  const fresh = Array.from({ length: 30 }, (_, i) => card({ id: `n${String(i).padStart(2, '0')}` }));

  it('puts due cards first and limits new flashcards per day', () => {
    const q = buildQueue([learnedDue, learnedLater, missed, ...fresh], today);
    expect(q.due.map((c) => c.id)).toEqual(['a', 'c']);
    expect(q.fresh).toHaveLength(SRS.newCardsPerDay);
  });

  it('subtracts cards already introduced today', () => {
    const introduced = card({ id: 'i', firstReviewedAt: '2026-10-16T09:00:00', lastReviewedAt: '2026-10-16T09:00:00', due: '2026-10-17' });
    const q = buildQueue([introduced, ...fresh], today);
    expect(q.fresh).toHaveLength(SRS.newCardsPerDay - 1);
  });

  it('filters by section', () => {
    const q = buildQueue([learnedDue, missed], today, { sectionId: 'dcf' });
    expect(q.due.map((c) => c.id)).toEqual(['c']);
  });
});

describe('forecast', () => {
  it('rolls overdue cards into today and skips new flashcards', () => {
    const f = forecast(
      [
        card({ id: 'a', lastReviewedAt: 'x', due: '2026-10-10' }),
        card({ id: 'b', lastReviewedAt: 'x', due: '2026-10-18' }),
        card({ id: 'c' }),
        card({ id: 'd', lastReviewedAt: 'x', due: '2026-12-01' }),
      ],
      today,
      7,
    );
    expect(f.map((d) => d.count)).toEqual([1, 0, 1, 0, 0, 0, 0]);
    expect(f[2]!.date).toBe('2026-10-18');
  });
});
