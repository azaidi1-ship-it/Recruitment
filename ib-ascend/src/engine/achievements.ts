import { ACHIEVEMENTS, TECHNICAL_SECTION_IDS, eliteAchievementId } from '../content/achievements';
import type { Grade } from '../config/gameConfig';
import type { RankId } from '../config/gameConfig';
import { RANKS } from '../config/gameConfig';
import type { SectionId } from '../types/models';

/** Facts about the player, gathered from the database by the progression service. */
export interface AchievementContext {
  totalAttempts: number;
  flawlessWalkthroughs: number;
  fastTrackedSections: number;
  /** Best Boss Fight score per section (0–1). */
  mockBest: Partial<Record<SectionId, number>>;
  grades: Partial<Record<SectionId, Grade | null>>;
  passedSections: SectionId[];
  /** Sections where every Elite Boutique question has been answered correctly at least once. */
  eliteClearedSections: SectionId[];
  /** Fastest correct Paper LBO, in seconds. */
  paperLboBestSec: number | null;
  longestStreak: number;
  rankId: RankId;
  /** Smallest number of stories covering any one competency. */
  minStoriesPerCompetency: number;
  behavioralPractices: number;
  superdayAdvances: number;
  weeklyBossClears: number;
  personalBests: number;
  cardsReviewed: number;
  mistakesResolved: number;
  questsCompleted: number;
}

function rankAtLeast(current: RankId, target: RankId): boolean {
  const idx = (id: RankId) => RANKS.findIndex((r) => r.id === id);
  return idx(current) >= idx(target);
}

const RULES: Record<string, (c: AchievementContext) => boolean> = {
  'first-answer': (c) => c.totalAttempts >= 1,
  'answers-100': (c) => c.totalAttempts >= 100,
  'answers-1000': (c) => c.totalAttempts >= 1000,
  'flawless-walkthrough': (c) => c.flawlessWalkthroughs >= 1,
  'walkthroughs-10': (c) => c.flawlessWalkthroughs >= 10,
  'fast-track': (c) => c.fastTrackedSections >= 1,
  'first-boss': (c) => Object.values(c.mockBest).some((s) => (s ?? 0) >= 0.8),
  's-rank': (c) => Object.values(c.grades).some((g) => g === 'S'),
  'technicals-cleared': (c) => TECHNICAL_SECTION_IDS.every((id) => c.passedSections.includes(id)),
  's-rank-all': (c) => TECHNICAL_SECTION_IDS.every((id) => c.grades[id] === 'S'),
  'paper-lbo-5': (c) => c.paperLboBestSec !== null && c.paperLboBestSec < 300,
  'paper-lbo-3': (c) => c.paperLboBestSec !== null && c.paperLboBestSec < 180,
  'streak-7': (c) => c.longestStreak >= 7,
  'streak-30': (c) => c.longestStreak >= 30,
  'streak-100': (c) => c.longestStreak >= 100,
  'rank-associate': (c) => rankAtLeast(c.rankId, 'associate'),
  'rank-md': (c) => rankAtLeast(c.rankId, 'md'),
  'rank-rainmaker': (c) => rankAtLeast(c.rankId, 'rainmaker'),
  'full-coverage': (c) => c.minStoriesPerCompetency >= 2,
  'story-reps-25': (c) => c.behavioralPractices >= 25,
  'would-advance': (c) => c.superdayAdvances >= 1,
  'weekly-boss': (c) => c.weeklyBossClears >= 1,
  'comeback-5': (c) => c.personalBests >= 5,
  'cards-500': (c) => c.cardsReviewed >= 500,
  'mistakes-25': (c) => c.mistakesResolved >= 25,
  'quests-10': (c) => c.questsCompleted >= 10,
};

for (const id of TECHNICAL_SECTION_IDS) {
  RULES[eliteAchievementId(id)] = (c) => c.eliteClearedSections.includes(id);
}

/** Ids of achievements that are earned in `ctx` but not yet in `unlocked`. */
export function newlyEarned(ctx: AchievementContext, unlocked: Set<string>): string[] {
  return ACHIEVEMENTS.filter((a) => !unlocked.has(a.id) && RULES[a.id]?.(ctx)).map((a) => a.id);
}

/** Exposed for tests: every definition must have a rule. */
export function hasRule(id: string): boolean {
  return id in RULES;
}
