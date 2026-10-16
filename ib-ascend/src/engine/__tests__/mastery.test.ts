import { describe, expect, it } from 'vitest';
import {
  decayFactor,
  mockComponent,
  quizComponent,
  retentionComponent,
  sectionMastery,
  subtopicMastery,
  type MasteryInput,
} from '../mastery';
import type { Difficulty, AttemptMode } from '../../types/models';

const now = new Date('2026-10-16T12:00:00Z');
/** A card in rotation (reviewed at least once). */
const rc = { source: 'flashcard' as const, lastReviewedAt: '2026-10-01T00:00:00Z' };
const daysAgo = (d: number) => new Date(now.getTime() - d * 86_400_000);

function attempts(n: number, score: number, opts: { difficulty?: Difficulty; mode?: AttemptMode; ageDays?: number } = {}) {
  return Array.from({ length: n }, () => ({
    score,
    difficulty: opts.difficulty ?? 'intermediate',
    mode: opts.mode ?? 'post',
    createdAt: daysAgo(opts.ageDays ?? 0).toISOString(),
  }));
}

describe('quizComponent', () => {
  it('is 0 with no attempts', () => {
    expect(quizComponent([], now)).toBe(0);
  });

  it('is 1 for 20 perfect recent attempts', () => {
    expect(quizComponent(attempts(20, 1), now)).toBeCloseTo(1);
  });

  it('scales down with fewer than 20 attempts (10 perfect → 0.5)', () => {
    expect(quizComponent(attempts(10, 1), now)).toBeCloseTo(0.5);
  });

  it('weights recent attempts more (10 wrong 60 days ago + 10 right today ≈ 0.88)', () => {
    const v = quizComponent([...attempts(10, 0, { ageDays: 60 }), ...attempts(10, 1)], now);
    // old weight = 0.5^(60/21) = 0.1382 → 10 / (10 + 1.382) = 0.8786
    expect(v).toBeCloseTo(0.8786, 3);
  });

  it('weights harder questions more (10 elite right + 10 basic wrong = 1.6 / 2.3)', () => {
    const v = quizComponent([...attempts(10, 1, { difficulty: 'elite' }), ...attempts(10, 0, { difficulty: 'basic' })], now);
    expect(v).toBeCloseTo(1.6 / 2.3, 5);
  });

  it('counts pre-quiz answers at half weight (10 pre right + 10 post wrong = 0.5 / 1.5)', () => {
    const v = quizComponent([...attempts(10, 1, { mode: 'pre' }), ...attempts(10, 0)], now);
    expect(v).toBeCloseTo(1 / 3, 5);
  });
});

describe('mockComponent', () => {
  it('is null with no mocks', () => {
    expect(mockComponent([])).toBeNull();
  });

  it('blends best (60%) with the average of the last 3 (40%)', () => {
    // 0.6 × 0.9 + 0.4 × (0.6 + 0.9 + 0.8) / 3 = 0.54 + 0.30667
    expect(mockComponent([0.6, 0.9, 0.8])).toBeCloseTo(0.84667, 4);
  });
});

describe('retentionComponent', () => {
  const today = '2026-10-16';
  it('is null with no cards', () => {
    expect(retentionComponent([], today)).toBeNull();
  });
  it('scores never-recalled cards 0 and on-schedule cards 1', () => {
    expect(retentionComponent([{ ...rc, repetitions: 0, due: today, intervalDays: 0 }], today)).toBe(0);
    expect(retentionComponent([{ ...rc, repetitions: 2, due: '2026-10-20', intervalDays: 6 }], today)).toBe(1);
  });
  it('fades overdue cards: 5 days overdue on a 5-day interval → e^-1', () => {
    expect(retentionComponent([{ ...rc, repetitions: 2, due: '2026-10-11', intervalDays: 5 }], today)).toBeCloseTo(Math.exp(-1));
  });
  it('ignores flashcards not yet introduced but counts unrecalled missed questions', () => {
    const unseen = { source: 'flashcard' as const, lastReviewedAt: null, repetitions: 0, due: today, intervalDays: 0 };
    expect(retentionComponent([unseen], today)).toBeNull();
    const missed = { ...unseen, source: 'question' as const };
    expect(retentionComponent([unseen, missed], today)).toBe(0);
  });
});

describe('decayFactor', () => {
  it('is 1 within the 7-day grace period', () => {
    expect(decayFactor(daysAgo(7), now)).toBe(1);
  });
  it('halves 60 days after the grace period', () => {
    expect(decayFactor(daysAgo(67), now)).toBeCloseTo(0.5);
  });
  it('is 1 with no activity recorded', () => {
    expect(decayFactor(null, now)).toBe(1);
  });
});

describe('sectionMastery', () => {
  const base: MasteryInput = {
    attempts: attempts(20, 1),
    mockScores: [],
    cards: [],
    preQuizScore: null,
    peak: 0,
    lastActivity: now,
    now,
  };

  it('caps at 50% without a Boss Fight (mock missing counts as 0)', () => {
    expect(sectionMastery(base).mastery).toBeCloseTo(0.5);
  });

  it('reaches 100% with perfect quizzes and mocks', () => {
    expect(sectionMastery({ ...base, mockScores: [1] }).mastery).toBeCloseTo(1);
  });

  it('includes retention when cards exist: 0.35 + 0.35 + 0.3 × 0', () => {
    const r = sectionMastery({ ...base, mockScores: [1], cards: [{ ...rc, repetitions: 0, due: '2026-10-16', intervalDays: 0 }] });
    expect(r.mastery).toBeCloseTo(0.7);
  });

  it('starts from half the pre-quiz score', () => {
    expect(sectionMastery({ ...base, attempts: [], preQuizScore: 0.8 }).mastery).toBeCloseTo(0.4);
  });

  it('decays when idle but never below 50% of peak', () => {
    const idle67 = sectionMastery({ ...base, mockScores: [1], peak: 1, lastActivity: daysAgo(67) });
    expect(idle67.mastery).toBeCloseTo(0.5);
    const idle127 = sectionMastery({ ...base, mockScores: [1], peak: 1, lastActivity: daysAgo(127) });
    expect(idle127.decay).toBeCloseTo(0.25);
    expect(idle127.mastery).toBeCloseTo(0.5);
  });

  it('decays slowly: 2 weeks idle loses under 8%', () => {
    const r = sectionMastery({ ...base, mockScores: [1], peak: 1, lastActivity: daysAgo(14) });
    expect(r.mastery).toBeGreaterThan(0.92);
    expect(r.mastery).toBeLessThan(1);
  });

  it('the peak floor never lifts mastery above its raw value', () => {
    const r = sectionMastery({ ...base, attempts: attempts(20, 0.3), peak: 1 });
    expect(r.mastery).toBeCloseTo(0.15);
  });
});

describe('subtopicMastery', () => {
  it('needs only 8 attempts for full confidence', () => {
    expect(subtopicMastery(attempts(8, 1), now)).toBeCloseTo(1);
    expect(subtopicMastery(attempts(4, 1), now)).toBeCloseTo(0.5);
  });
});
