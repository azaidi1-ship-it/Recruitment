import { XP } from '../config/gameConfig';
import type { AttemptMode, Difficulty } from '../types/models';

export interface XpLine {
  label: string;
  /** Multiplier lines carry a factor; flat lines carry an amount. */
  amount?: number;
  factor?: number;
}

export interface XpResult {
  xp: number;
  lines: XpLine[];
  /** True when anti-farming zeroed the award. */
  farmed: boolean;
}

export interface AttemptXpInput {
  difficulty: Difficulty;
  mode: AttemptMode;
  /** 0–1 (partial credit for walk-throughs and rubric answers). */
  score: number;
  correct: boolean;
  /** No previous attempt at this question exists. */
  firstTry: boolean;
  /** Subtopic mastery (0–1) before this attempt. */
  subtopicMastery: number;
  /** Most recent previous CORRECT attempt at this question, if any. */
  lastCorrectAt: Date | null;
  streakDays: number;
  now: Date;
}

const HOUR = 3_600_000;
const DAY = 24 * HOUR;

export function streakMultiplier(streakDays: number): number {
  return 1 + Math.min(XP.streakBonusCap, Math.max(0, streakDays) * XP.streakBonusPerDay);
}

/** XP for one answered question. */
export function attemptXp(input: AttemptXpInput): XpResult {
  const score = Math.min(1, Math.max(0, input.score));
  if (score === 0) return { xp: 0, lines: [{ label: 'No credit', amount: 0 }], farmed: false };

  const sinceCorrect = input.lastCorrectAt ? input.now.getTime() - input.lastCorrectAt.getTime() : Infinity;

  if (
    input.difficulty === 'basic' &&
    input.subtopicMastery >= XP.farm.masteryThreshold &&
    sinceCorrect <= XP.farm.recentCorrectDays * DAY
  ) {
    return { xp: 0, lines: [{ label: 'Already mastered — try harder questions', amount: 0 }], farmed: true };
  }

  const base = XP.base[input.difficulty];
  const lines: XpLine[] = [{ label: `${input.difficulty} × ${Math.round(score * 100)}%`, amount: base * score }];
  let xp = base * score;

  const modeMult = XP.modeMultiplier[input.mode];
  if (modeMult !== 1) {
    xp *= modeMult;
    lines.push({ label: `${input.mode} mode`, factor: modeMult });
  }
  if (input.firstTry && input.correct) {
    xp *= XP.firstTryMultiplier;
    lines.push({ label: 'First-try correct', factor: XP.firstTryMultiplier });
  }
  if (sinceCorrect <= XP.repeatWindowHours * HOUR) {
    xp *= XP.repeatMultiplier;
    lines.push({ label: 'Repeat within 24h', factor: XP.repeatMultiplier });
  }
  const streak = streakMultiplier(input.streakDays);
  if (streak > 1) {
    xp *= streak;
    lines.push({ label: `${input.streakDays}-day streak`, factor: streak });
  }
  return { xp: Math.round(xp), lines, farmed: false };
}

export interface SessionBonusInput {
  mode: AttemptMode;
  /** 0–1 */
  score: number;
  questionCount: number;
  /** Best previous score in this mode + section, or null if none. */
  previousBest: number | null;
}

export interface SessionBonus {
  xp: number;
  lines: XpLine[];
  personalBest: boolean;
}

/** Bonus XP when a quiz, mock or Superday round is finished. */
export function sessionBonus(input: SessionBonusInput): SessionBonus {
  const lines: XpLine[] = [];
  let personalBest = false;
  const cfg = XP.session;
  if (cfg.personalBestModes.includes(input.mode)) {
    if (input.previousBest === null) {
      lines.push({ label: 'First clear', amount: cfg.firstClear });
    } else if (input.score > input.previousBest + 1e-9) {
      const points = Math.round((input.score - input.previousBest) * 100);
      lines.push({ label: `New best (+${points} pts)`, amount: cfg.personalBestFlat + cfg.personalBestPerPoint * points });
      personalBest = true;
    }
  }
  if (input.score >= 1 - 1e-9 && input.questionCount >= cfg.perfectMinQuestions) {
    lines.push({ label: 'Perfect score', amount: cfg.perfect });
  }
  return { xp: lines.reduce((n, l) => n + (l.amount ?? 0), 0), lines, personalBest };
}

export function lessonXp(): number {
  return XP.lessonRead;
}

export function exampleXp(difficulty: Difficulty): number {
  return XP.exampleCompleted[difficulty];
}

export function flashcardXp(quality: number): number {
  return quality >= 3 ? XP.flashcardRecalled : XP.flashcardLapsed;
}

export function storyPracticeXp(score: number): number {
  const s = Math.min(1, Math.max(0, score));
  return Math.round(XP.storyPractice * (0.5 + 0.5 * s));
}

export function arcadeXp(correct: number): number {
  return Math.max(0, Math.round(correct * XP.arcadeRunPerCorrect));
}
