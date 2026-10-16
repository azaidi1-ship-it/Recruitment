/**
 * Question content model. Every question in every section is one of these
 * shapes. Content lives in src/content/sections/<section>/questions.ts and is
 * validated by src/content/schema.ts — components never hardcode questions.
 */
import type { SectionId, Difficulty } from './models';

/** Which quiz pools a question can be drawn into. */
export type QuestionPool = 'pre' | 'post' | 'mock';

interface QuestionBase {
  /** Globally unique, stable id, e.g. "acc-q-014". Never reuse or renumber. */
  id: string;
  sectionId: SectionId;
  /** Subtopic id defined on the section (e.g. "working-capital"). */
  subtopic: string;
  difficulty: Difficulty;
  /** The question exactly as an interviewer would ask it. */
  prompt: string;
  /** Why the correct answer is correct. Shown after answering. */
  explanation: string;
  pools: QuestionPool[];
  /**
   * Mock follow-ups: ids of questions an interviewer would ask next if this
   * one is answered (in a Boss Fight / Superday they are chained in order).
   */
  followUps?: string[];
  /** Free-form tags for search and achievements (e.g. "nol", "paper-lbo"). */
  tags?: string[];
  /** Firms whose interviewers are known to like this question type. */
  firmStyles?: string[];
}

export interface McqOption {
  id: string;
  text: string;
  correct?: boolean;
  /** Required for every option: why it is right, or exactly why it is wrong. */
  explanation: string;
}

export interface MultipleChoiceQuestion extends QuestionBase {
  type: 'mcq';
  options: McqOption[];
}

export type Tolerance =
  | { kind: 'pct'; value: number } // ±value% of the answer, e.g. 1 = ±1%
  | { kind: 'abs'; value: number }; // ±value absolute

export interface NumericQuestion extends QuestionBase {
  type: 'numeric';
  answer: number;
  tolerance: Tolerance;
  /** Display unit, e.g. "$mm", "%", "x". */
  unit?: string;
  /** Optional step-by-step solution shown after answering. */
  solution?: string[];
}

export interface OrderingQuestion extends QuestionBase {
  type: 'ordering';
  /** Items in the CORRECT order. The UI shuffles them. */
  items: { id: string; text: string }[];
}

export type StatementKind = 'IS' | 'CFS' | 'BS';

export interface WalkthroughLine {
  statement: StatementKind;
  /** Stable key, e.g. "is.da", "cfs.cfo", "bs.ppe". */
  key: string;
  label: string;
  /** Signed change. Positive = increase. */
  expected: number;
}

export interface WalkthroughQuestion extends QuestionBase {
  type: 'walkthrough';
  /** Tax rate assumed by this question, as a decimal (0.25 = 25%). */
  taxRate: number;
  /** Every line the user must fill in, in display order. */
  lines: WalkthroughLine[];
  /** Absolute tolerance per line (handles rounding), default 0.01. */
  lineTolerance?: number;
}

export interface RubricPoint {
  id: string;
  /** What a strong answer must cover. */
  point: string;
  /**
   * Keyword groups for offline matching. The point is hit if ANY group
   * matches, and a group matches when ALL its terms appear (case-insensitive).
   */
  keywords: string[][];
  weight: number;
}

export interface FreeTextQuestion extends QuestionBase {
  type: 'freeText';
  rubric: RubricPoint[];
  /** A model answer written as you would say it aloud. */
  modelAnswer: string;
  /** Suggested speaking time in seconds. */
  targetSeconds?: number;
}

export interface RapidFireQuestion extends QuestionBase {
  type: 'rapidFire';
  answer: number;
  tolerance: Tolerance;
  timeLimitSec: number;
  unit?: string;
}

export type Question =
  | MultipleChoiceQuestion
  | NumericQuestion
  | OrderingQuestion
  | WalkthroughQuestion
  | FreeTextQuestion
  | RapidFireQuestion;

export type QuestionType = Question['type'];

/** What the user submitted, keyed by question type. Stored on Attempt. */
export type QuestionResponse =
  | { type: 'mcq'; optionId: string }
  | { type: 'numeric'; value: number | null }
  | { type: 'ordering'; order: string[] }
  | { type: 'walkthrough'; values: Record<string, number | null> }
  | { type: 'freeText'; text: string; selfScore?: number; llmScore?: number; hitPointIds?: string[] }
  | { type: 'rapidFire'; value: number | null };
