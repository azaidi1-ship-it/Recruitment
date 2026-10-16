import type { QuestMetric, SectionId, StatKey } from '../types/models';

export interface QuestTemplate {
  id: string;
  /** Stat it trains; null = general (picked by special rules, not by weakest stat). */
  stat: StatKey | null;
  metric: QuestMetric;
  target: number;
  xpReward: number;
  /** "{section}" is replaced with the chosen section's short title. */
  title: string;
  /**
   * If set, the quest is tied to one section: the weakest unlocked section that
   * feeds `stat`, restricted to this list when given.
   */
  sectionScope?: 'byStat' | SectionId[];
  minScore?: number;
}

export const QUEST_TEMPLATES: QuestTemplate[] = [
  // Accounting
  { id: 'acc-correct', stat: 'accounting', metric: 'correctAnswers', target: 10, xpReward: 80, title: 'Answer 10 {section} questions correctly', sectionScope: 'byStat' },
  { id: 'acc-score', stat: 'accounting', metric: 'sessionScore', target: 1, minScore: 0.8, xpReward: 100, title: 'Score 80%+ on a {section} quiz', sectionScope: 'byStat' },
  { id: 'acc-flawless', stat: 'accounting', metric: 'flawlessWalkthroughs', target: 3, xpReward: 100, title: 'Nail 3 walk-throughs with every line right', sectionScope: ['walkthroughs'] },
  // Valuation
  { id: 'val-correct', stat: 'valuation', metric: 'correctAnswers', target: 10, xpReward: 80, title: 'Answer 10 {section} questions correctly', sectionScope: 'byStat' },
  { id: 'val-score', stat: 'valuation', metric: 'sessionScore', target: 1, minScore: 0.8, xpReward: 100, title: 'Score 80%+ on a {section} drill', sectionScope: 'byStat' },
  { id: 'val-read', stat: 'valuation', metric: 'lessonsRead', target: 2, xpReward: 60, title: 'Read 2 {section} chapters', sectionScope: 'byStat' },
  // Modeling
  { id: 'mod-correct', stat: 'modeling', metric: 'correctAnswers', target: 8, xpReward: 80, title: 'Answer 8 {section} questions correctly', sectionScope: 'byStat' },
  { id: 'mod-score', stat: 'modeling', metric: 'sessionScore', target: 1, minScore: 0.8, xpReward: 100, title: 'Score 80%+ on a {section} drill', sectionScope: 'byStat' },
  { id: 'mod-examples', stat: 'modeling', metric: 'examplesCompleted', target: 2, xpReward: 60, title: 'Work through 2 {section} examples', sectionScope: 'byStat' },
  // Speed
  { id: 'spd-arcade', stat: 'speed', metric: 'arcadeRuns', target: 2, xpReward: 60, title: 'Finish 2 Mental Math Arcade runs' },
  { id: 'spd-correct', stat: 'speed', metric: 'correctAnswers', target: 15, xpReward: 70, title: 'Get 15 mental math answers right', sectionScope: ['mental-math'] },
  // Market IQ
  { id: 'mkt-correct', stat: 'marketIq', metric: 'correctAnswers', target: 6, xpReward: 70, title: 'Answer 6 Markets questions correctly', sectionScope: ['markets'] },
  { id: 'mkt-deal', stat: 'marketIq', metric: 'dealsLogged', target: 1, xpReward: 60, title: 'Log a deal in your Deal Journal' },
  // Polish
  { id: 'pol-stories', stat: 'polish', metric: 'storiesPracticed', target: 2, xpReward: 80, title: 'Practice 2 behavioral stories out loud' },
  { id: 'pol-score', stat: 'polish', metric: 'sessionScore', target: 1, minScore: 0.8, xpReward: 100, title: 'Score 80%+ on a Fit & Behavioral quiz', sectionScope: ['fit'] },
  // General (special rules)
  { id: 'gen-review', stat: null, metric: 'cardsReviewed', target: 10, xpReward: 60, title: 'Clear 10 flashcards due' },
  { id: 'gen-mistakes', stat: null, metric: 'mistakesResolved', target: 5, xpReward: 80, title: 'Redo 5 questions from your Mistake Log' },
];
