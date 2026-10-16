import { describe, expect, it } from 'vitest';
import { attemptXp, sessionBonus, storyPracticeXp, streakMultiplier, type AttemptXpInput } from '../xp';

const now = new Date('2026-10-16T12:00:00Z');
const hoursAgo = (h: number) => new Date(now.getTime() - h * 3_600_000);

const base: AttemptXpInput = {
  difficulty: 'basic',
  mode: 'post',
  score: 1,
  correct: true,
  firstTry: true,
  subtopicMastery: 0,
  lastCorrectAt: null,
  streakDays: 0,
  now,
};

describe('attemptXp', () => {
  it('basic, first-try correct: 5 × 1.5 = 7.5 → 8', () => {
    expect(attemptXp(base).xp).toBe(8);
  });

  it('advanced in a mock, not first try: 20 × 1.25 = 25', () => {
    expect(attemptXp({ ...base, difficulty: 'advanced', mode: 'mock', firstTry: false }).xp).toBe(25);
  });

  it('elite drill, first try, 20-day streak (capped +20%): 35 × 1.5 × 1.2 = 63', () => {
    expect(attemptXp({ ...base, difficulty: 'elite', mode: 'drill', streakDays: 20 }).xp).toBe(63);
  });

  it('scales by partial credit and gives no first-try bonus when not fully correct', () => {
    expect(attemptXp({ ...base, difficulty: 'intermediate', score: 0.5, correct: false }).xp).toBe(5);
  });

  it('gives nothing for a wrong answer', () => {
    expect(attemptXp({ ...base, score: 0, correct: false }).xp).toBe(0);
  });

  it('pre-quiz answers earn half: 10 × 0.5 × 1.5 = 7.5 → 8', () => {
    expect(attemptXp({ ...base, difficulty: 'intermediate', mode: 'pre' }).xp).toBe(8);
  });

  it('anti-farming: mastered Basic question answered correctly in the last 14 days earns 0', () => {
    const r = attemptXp({ ...base, firstTry: false, subtopicMastery: 0.9, lastCorrectAt: hoursAgo(72) });
    expect(r.xp).toBe(0);
    expect(r.farmed).toBe(true);
  });

  it('anti-farming does not apply to harder questions', () => {
    const r = attemptXp({
      ...base,
      difficulty: 'intermediate',
      firstTry: false,
      subtopicMastery: 0.9,
      lastCorrectAt: hoursAgo(72),
    });
    expect(r.farmed).toBe(false);
    expect(r.xp).toBe(10);
  });

  it('anti-farming lapses after 14 days', () => {
    const r = attemptXp({ ...base, firstTry: false, subtopicMastery: 0.9, lastCorrectAt: hoursAgo(20 * 24) });
    expect(r.xp).toBe(5);
  });

  it('repeats within 24h earn 25%: 10 × 0.25 = 2.5 → 3', () => {
    const r = attemptXp({ ...base, difficulty: 'intermediate', firstTry: false, lastCorrectAt: hoursAgo(2) });
    expect(r.xp).toBe(3);
  });

  it('explains every multiplier it applied', () => {
    const r = attemptXp({ ...base, difficulty: 'elite', mode: 'mock', streakDays: 3 });
    expect(r.lines.map((l) => l.label)).toEqual(['elite × 100%', 'mock mode', 'First-try correct', '3-day streak']);
  });
});

describe('streakMultiplier', () => {
  it('adds 2% per day, capped at 20%', () => {
    expect(streakMultiplier(0)).toBe(1);
    expect(streakMultiplier(5)).toBeCloseTo(1.1);
    expect(streakMultiplier(50)).toBeCloseTo(1.2);
  });
});

describe('sessionBonus', () => {
  it('gives a first-clear bonus on the first mock', () => {
    expect(sessionBonus({ mode: 'mock', score: 0.7, questionCount: 10, previousBest: null })).toMatchObject({
      xp: 50,
      personalBest: false,
    });
  });

  it('rewards beating the previous best: 50 + 5 × 15 pts = 125', () => {
    expect(sessionBonus({ mode: 'mock', score: 0.85, questionCount: 10, previousBest: 0.7 })).toMatchObject({
      xp: 125,
      personalBest: true,
    });
  });

  it('gives nothing for a mock below the previous best', () => {
    expect(sessionBonus({ mode: 'mock', score: 0.6, questionCount: 10, previousBest: 0.7 }).xp).toBe(0);
  });

  it('gives a perfect-score bonus with at least 5 questions', () => {
    expect(sessionBonus({ mode: 'post', score: 1, questionCount: 15, previousBest: 0.9 }).xp).toBe(50);
    expect(sessionBonus({ mode: 'post', score: 1, questionCount: 3, previousBest: null }).xp).toBe(0);
    expect(sessionBonus({ mode: 'mock', score: 1, questionCount: 10, previousBest: null }).xp).toBe(100);
  });
});

describe('storyPracticeXp', () => {
  it('scales from 10 to 20', () => {
    expect(storyPracticeXp(0)).toBe(10);
    expect(storyPracticeXp(1)).toBe(20);
  });
});
