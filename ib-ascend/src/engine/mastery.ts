import { MASTERY } from '../config/gameConfig';
import { daysBetween, toLocalDate } from '../lib/dates';
import { isNewFlashcard } from './srs';
import type { Attempt, Card, ISODate } from '../types/models';

const DAY = 86_400_000;

type ScoredAttempt = Pick<Attempt, 'score' | 'difficulty' | 'mode' | 'createdAt'>;

/**
 * Recency- and difficulty-weighted accuracy (0–1), scaled down when there are
 * fewer than `confidenceAttempts` attempts so a 2/2 start isn't 100%.
 */
export function quizComponent(
  attempts: ScoredAttempt[],
  now: Date,
  confidenceAttempts: number = MASTERY.confidenceAttempts,
): number {
  if (attempts.length === 0) return 0;
  const recent = [...attempts]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, MASTERY.maxAttempts);
  let num = 0;
  let den = 0;
  for (const a of recent) {
    const ageDays = Math.max(0, (now.getTime() - new Date(a.createdAt).getTime()) / DAY);
    const w =
      MASTERY.difficultyWeight[a.difficulty] *
      Math.pow(0.5, ageDays / MASTERY.attemptHalfLifeDays) *
      (a.mode === 'pre' ? MASTERY.preQuizAttemptWeight : 1);
    num += w * a.score;
    den += w;
  }
  const accuracy = den > 0 ? num / den : 0;
  const confidence = Math.min(1, recent.length / confidenceAttempts);
  return accuracy * confidence;
}

/** Boss Fight component: blend of best and recent mock scores. Null if no mocks. */
export function mockComponent(mockScores: number[]): number | null {
  if (mockScores.length === 0) return null;
  const best = Math.max(...mockScores);
  const recent = mockScores.slice(-MASTERY.mockRecentCount);
  const avg = recent.reduce((a, b) => a + b, 0) / recent.length;
  return MASTERY.mockBestWeight * best + (1 - MASTERY.mockBestWeight) * avg;
}

type RetentionCard = Pick<Card, 'repetitions' | 'due' | 'intervalDays' | 'source' | 'lastReviewedAt'>;

/**
 * Spaced-repetition retention (0–1). A card that has never been recalled
 * (including a missed question not yet re-answered) scores 0; an overdue card
 * fades with how overdue it is relative to its interval. Flashcards not yet
 * introduced don't count. Null if there are no cards in rotation.
 */
export function retentionComponent(cards: RetentionCard[], today: ISODate): number | null {
  const active = cards.filter((c) => !isNewFlashcard(c));
  if (active.length === 0) return null;
  let sum = 0;
  for (const c of active) {
    if (c.repetitions === 0) continue;
    const overdue = Math.max(0, daysBetween(c.due, today));
    sum += Math.exp(-overdue / Math.max(1, c.intervalDays));
  }
  return sum / active.length;
}

/** Multiplier from inactivity: 1 during the grace period, then halving every halfLifeDays. */
export function decayFactor(lastActivity: Date | null, now: Date): number {
  if (!lastActivity) return 1;
  const idleDays = (now.getTime() - lastActivity.getTime()) / DAY;
  const over = idleDays - MASTERY.decay.graceDays;
  return over <= 0 ? 1 : Math.pow(0.5, over / MASTERY.decay.halfLifeDays);
}

export interface MasteryInput {
  attempts: ScoredAttempt[];
  /** Finished Boss Fight scores, oldest first. */
  mockScores: number[];
  cards: RetentionCard[];
  preQuizScore: number | null;
  /** Highest mastery ever reached in this section. */
  peak: number;
  lastActivity: Date | null;
  now: Date;
}

export interface MasteryResult {
  /** Final mastery, 0–1. */
  mastery: number;
  /** Before decay. */
  raw: number;
  quiz: number;
  mock: number | null;
  retention: number | null;
  decay: number;
}

export function sectionMastery(input: MasteryInput): MasteryResult {
  const quiz = quizComponent(input.attempts, input.now);
  const mock = mockComponent(input.mockScores);
  const retention = retentionComponent(input.cards, toLocalDate(input.now));

  const w = MASTERY.weights;
  // A missing mock counts as 0 (the Boss Fight is required for high mastery);
  // missing retention just means no cards yet, so its weight is redistributed.
  let raw =
    retention === null
      ? (w.quiz * quiz + w.mock * (mock ?? 0)) / (w.quiz + w.mock)
      : w.quiz * quiz + w.mock * (mock ?? 0) + w.retention * retention;

  if (input.preQuizScore !== null) raw = Math.max(raw, input.preQuizScore * MASTERY.preQuizStartFactor);
  raw = clamp01(raw);

  const decay = decayFactor(input.lastActivity, input.now);
  const floor = Math.min(raw, MASTERY.decay.floorOfPeak * input.peak);
  const mastery = clamp01(Math.max(raw * decay, floor));

  return { mastery, raw, quiz, mock, retention, decay };
}

/** Subtopic mastery: accuracy only, with a smaller confidence requirement. */
export function subtopicMastery(attempts: ScoredAttempt[], now: Date): number {
  return quizComponent(attempts, now, MASTERY.subtopicConfidenceAttempts);
}

function clamp01(x: number): number {
  return Math.min(1, Math.max(0, x));
}
