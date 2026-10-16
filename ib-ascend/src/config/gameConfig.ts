import type { AttemptMode, Difficulty } from '../types/models';

/**
 * Every tunable number in the gamification system lives here.
 *
 * Calibration target: a focused 60–90 minute day (one post-quiz, one mock,
 * two or three chapters, ~40 flashcards, three quests) earns ~1,000 XP.
 */

export const LEVEL = {
  /** XP needed to go from level L to L+1 = round(base × L^exponent). */
  base: 100,
  exponent: 1.5,
} as const;

/** Rank bands by player level (inclusive lower bound). */
export const RANKS = [
  { id: 'intern', title: 'Intern', minLevel: 1 },
  { id: 'analyst-1', title: 'Analyst 1', minLevel: 3 },
  { id: 'analyst-2', title: 'Analyst 2', minLevel: 6 },
  { id: 'analyst-3', title: 'Analyst 3', minLevel: 9 },
  { id: 'associate', title: 'Associate', minLevel: 12 },
  { id: 'vp', title: 'VP', minLevel: 16 },
  { id: 'director', title: 'Director', minLevel: 20 },
  { id: 'md', title: 'MD', minLevel: 24 },
  { id: 'rainmaker', title: 'Rainmaker', minLevel: 30 },
] as const;

export type RankId = (typeof RANKS)[number]['id'];

export const XP = {
  /** Base XP for a fully correct answer, by difficulty. */
  base: { basic: 5, intermediate: 10, advanced: 20, elite: 35 } satisfies Record<Difficulty, number>,
  modeMultiplier: {
    pre: 0.5,
    post: 1,
    mock: 1.25,
    review: 0.6,
    mistakes: 0.8,
    drill: 1,
    superday: 1.5,
    weeklyBoss: 1.5,
    arcade: 1,
    behavioral: 1,
  } satisfies Record<AttemptMode, number>,
  /** Correct on the very first attempt at a question. */
  firstTryMultiplier: 1.5,
  /** +2% per streak day, capped at +20%. */
  streakBonusPerDay: 0.02,
  streakBonusCap: 0.2,
  /** Already answered correctly in the last 24h: heavily reduced. */
  repeatWindowHours: 24,
  repeatMultiplier: 0.25,
  /**
   * Anti-farming: a Basic question earns nothing if its subtopic mastery is at
   * least this high and it was answered correctly within the last N days.
   */
  farm: { masteryThreshold: 0.85, recentCorrectDays: 14 },

  lessonRead: 15,
  exampleCompleted: { basic: 5, intermediate: 8, advanced: 12, elite: 15 } satisfies Record<Difficulty, number>,
  /** Per flashcard review; lapses (quality < 3) earn the smaller amount. */
  flashcardRecalled: 2,
  flashcardLapsed: 1,
  /** Behavioral practice: scaled from half to full by the answer's score. */
  storyPractice: 20,
  arcadeRunPerCorrect: 1,
  dealLogged: 10,

  session: {
    /** Mock-style modes where personal bests count. */
    personalBestModes: ['mock', 'weeklyBoss', 'superday'] as AttemptMode[],
    firstClear: 50,
    personalBestFlat: 50,
    /** Per percentage point above the previous best. */
    personalBestPerPoint: 5,
    /** 100% on a session with at least `perfectMinQuestions` questions. */
    perfect: 50,
    perfectMinQuestions: 5,
  },
} as const;

export const MASTERY = {
  /** Component weights. If a section has no SRS cards yet, retention's weight is split across the others. */
  weights: { quiz: 0.35, mock: 0.35, retention: 0.3 },
  /** Older attempts count less: weight halves every N days. */
  attemptHalfLifeDays: 21,
  /** Only the most recent N attempts in a section are used. */
  maxAttempts: 80,
  /** Full confidence needs this many attempts; fewer scales accuracy down. */
  confidenceAttempts: 20,
  subtopicConfidenceAttempts: 8,
  difficultyWeight: { basic: 0.7, intermediate: 1, advanced: 1.3, elite: 1.6 } satisfies Record<Difficulty, number>,
  /** Diagnostic answers count half as much as later practice. */
  preQuizAttemptWeight: 0.5,
  /** Mock component = bestWeight × best + (1 − bestWeight) × average of last 3. */
  mockBestWeight: 0.6,
  mockRecentCount: 3,
  /** Pre-quiz sets a starting mastery of score × factor. */
  preQuizStartFactor: 0.5,
  decay: {
    /** No decay for this many idle days. */
    graceDays: 7,
    /** After the grace period mastery halves every N idle days… */
    halfLifeDays: 60,
    /** …but never drops below this fraction of the peak. */
    floorOfPeak: 0.5,
  },
} as const;

export const UNLOCK = {
  /** Post-quiz score needed to unlock the mock and clear the section for prerequisites. */
  postQuizPass: 0.8,
  /** Pre-quiz score that allows skipping straight to the post-quiz. */
  fastTrack: 0.9,
} as const;

export const STREAK = {
  /** One freeze is earned per ISO week of activity, up to this many banked. */
  maxFreezes: 2,
} as const;

/** Section grades from best mock + consistency. Composite = 0.6 × best + 0.4 × avg(last 3). */
export const GRADES = [
  { grade: 'S', min: 0.93, minMocks: 3 },
  { grade: 'A', min: 0.85, minMocks: 1 },
  { grade: 'B', min: 0.75, minMocks: 1 },
  { grade: 'C', min: 0.65, minMocks: 1 },
  { grade: 'D', min: 0.55, minMocks: 1 },
  { grade: 'F', min: 0, minMocks: 1 },
] as const;

export type Grade = (typeof GRADES)[number]['grade'];

export const STATS = {
  /** Speed = section mastery blended with recent arcade accuracy. */
  speedArcadeWeight: 0.3,
  /** Polish = Fit mastery + Story Bank coverage + behavioral practice scores. */
  polish: { fitMastery: 0.5, storyCoverage: 0.25, practice: 0.25 },
  /** A competency is "covered" with at least this many stories. */
  storiesPerCompetency: 2,
} as const;

export const QUESTS = {
  perDay: 3,
  /** Swap the third quest for a review quest when this many cards are due. */
  reviewQuestDueThreshold: 10,
  /** Otherwise swap it for a Redo Mistakes quest when this many are open. */
  mistakeQuestThreshold: 5,
} as const;
