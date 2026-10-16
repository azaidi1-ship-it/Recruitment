import { describe, expect, it } from 'vitest';
import { ACHIEVEMENTS } from '../../content/achievements';
import { hasRule, newlyEarned, type AchievementContext } from '../achievements';

const empty: AchievementContext = {
  totalAttempts: 0,
  flawlessWalkthroughs: 0,
  fastTrackedSections: 0,
  mockBest: {},
  grades: {},
  passedSections: [],
  eliteClearedSections: [],
  paperLboBestSec: null,
  longestStreak: 0,
  rankId: 'intern',
  minStoriesPerCompetency: 0,
  behavioralPractices: 0,
  superdayAdvances: 0,
  weeklyBossClears: 0,
  personalBests: 0,
  cardsReviewed: 0,
  mistakesResolved: 0,
  questsCompleted: 0,
};

describe('achievements', () => {
  it('has a rule for every definition and unique ids', () => {
    for (const a of ACHIEVEMENTS) expect(hasRule(a.id), a.id).toBe(true);
    expect(new Set(ACHIEVEMENTS.map((a) => a.id)).size).toBe(ACHIEVEMENTS.length);
  });

  it('unlocks nothing for a new player', () => {
    expect(newlyEarned(empty, new Set())).toEqual([]);
  });

  it('unlocks on thresholds and skips already-unlocked ones', () => {
    expect(newlyEarned({ ...empty, totalAttempts: 1 }, new Set())).toEqual(['first-answer']);
    expect(newlyEarned({ ...empty, totalAttempts: 1 }, new Set(['first-answer']))).toEqual([]);
  });

  it('handles ranks cumulatively', () => {
    expect(newlyEarned({ ...empty, rankId: 'associate' }, new Set())).toEqual(['rank-associate']);
    expect(newlyEarned({ ...empty, rankId: 'rainmaker' }, new Set()).sort()).toEqual(
      ['rank-associate', 'rank-md', 'rank-rainmaker'].sort(),
    );
  });

  it('awards the M&A elite badge and Paper LBO time badges', () => {
    expect(newlyEarned({ ...empty, eliteClearedSections: ['mna'] }, new Set())).toEqual(['elite-mna']);
    expect(newlyEarned({ ...empty, paperLboBestSec: 240 }, new Set())).toEqual(['paper-lbo-5']);
    expect(newlyEarned({ ...empty, paperLboBestSec: 170 }, new Set()).sort()).toEqual(['paper-lbo-3', 'paper-lbo-5']);
  });

  it('awards Full Coverage at 2+ stories per competency', () => {
    expect(newlyEarned({ ...empty, minStoriesPerCompetency: 2 }, new Set())).toEqual(['full-coverage']);
  });
});
