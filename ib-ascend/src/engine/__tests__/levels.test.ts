import { describe, expect, it } from 'vitest';
import { describeXpChange, levelFromXp, nextRank, rankForLevel, totalXpForLevel, xpToNext } from '../levels';

describe('level curve: round(100 × L^1.5)', () => {
  it('matches hand-computed values', () => {
    expect(xpToNext(1)).toBe(100);
    expect(xpToNext(2)).toBe(283); // 282.84
    expect(xpToNext(3)).toBe(520); // 519.62
    expect(xpToNext(4)).toBe(800);
    expect(xpToNext(9)).toBe(2700);
    expect(xpToNext(16)).toBe(6400);
  });

  it('accumulates totals', () => {
    expect(totalXpForLevel(1)).toBe(0);
    expect(totalXpForLevel(2)).toBe(100);
    expect(totalXpForLevel(3)).toBe(383);
    expect(totalXpForLevel(4)).toBe(903);
    expect(totalXpForLevel(12)).toBe(17916);
  });

  it('derives level and progress from total XP', () => {
    expect(levelFromXp(0)).toMatchObject({ level: 1, xpIntoLevel: 0, xpForNext: 100, progress: 0 });
    expect(levelFromXp(99).level).toBe(1);
    expect(levelFromXp(100)).toMatchObject({ level: 2, xpIntoLevel: 0, xpForNext: 283 });
    expect(levelFromXp(382)).toMatchObject({ level: 2, xpIntoLevel: 282 });
    expect(levelFromXp(383).level).toBe(3);
    expect(levelFromXp(-50).level).toBe(1);
  });

  it('is calibrated: Associate in ~2–3 weeks, Rainmaker as a season-long goal (at ~1,000 XP/day)', () => {
    const associate = totalXpForLevel(12);
    const rainmaker = totalXpForLevel(30);
    expect(associate / 1000).toBeGreaterThan(14);
    expect(associate / 1000).toBeLessThan(21);
    expect(rainmaker).toBeGreaterThan(150_000);
    expect(rainmaker).toBeLessThan(220_000);
  });
});

describe('ranks', () => {
  it('maps levels to the nine ranks', () => {
    expect(rankForLevel(1).title).toBe('Intern');
    expect(rankForLevel(2).title).toBe('Intern');
    expect(rankForLevel(3).title).toBe('Analyst 1');
    expect(rankForLevel(6).title).toBe('Analyst 2');
    expect(rankForLevel(9).title).toBe('Analyst 3');
    expect(rankForLevel(11).title).toBe('Analyst 3');
    expect(rankForLevel(12).title).toBe('Associate');
    expect(rankForLevel(16).title).toBe('VP');
    expect(rankForLevel(20).title).toBe('Director');
    expect(rankForLevel(24).title).toBe('MD');
    expect(rankForLevel(30).title).toBe('Rainmaker');
    expect(rankForLevel(99).title).toBe('Rainmaker');
  });

  it('knows the next rank', () => {
    expect(nextRank(1)?.title).toBe('Analyst 1');
    expect(nextRank(30)).toBeNull();
  });

  it('flags level-ups and rank-ups', () => {
    const lvl = describeXpChange(90, 120);
    expect(lvl.leveledUp).toBe(true);
    expect(lvl.newRank).toBeNull();
    const rank = describeXpChange(300, 400); // L2 → L3
    expect(rank.newRank?.title).toBe('Analyst 1');
    expect(describeXpChange(10, 20).leveledUp).toBe(false);
  });
});
