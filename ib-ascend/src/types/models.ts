/**
 * Core data models for IB Ascend.
 *
 * Two kinds of data:
 *  - CONTENT (Section, Lesson, WorkedExample, Question, Flashcard, behavioral
 *    questions, achievement definitions): authored in src/content, shipped
 *    with the app, never written to the database.
 *  - USER DATA (everything with a `createdAt`): stored in IndexedDB via Dexie
 *    (src/db/db.ts) and included in JSON backups.
 */
import type { QuestionResponse } from './questions';

/** ISO-8601 timestamp, e.g. "2026-10-16T14:03:00.000Z". */
export type ISODateTime = string;
/** Local calendar date, "YYYY-MM-DD". */
export type ISODate = string;

// ───────────────────────────── Content ─────────────────────────────

export type SectionId =
  | 'accounting'
  | 'walkthroughs'
  | 'ev-equity'
  | 'valuation'
  | 'comps'
  | 'dcf'
  | 'mna'
  | 'lbo'
  | 'restructuring'
  | 'mental-math'
  | 'markets'
  | 'fit';

export type Difficulty = 'basic' | 'intermediate' | 'advanced' | 'elite';

export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  basic: 'Basic',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
  elite: 'Elite Boutique',
};

/** RPG stats shown on the radar chart. */
export type StatKey = 'accounting' | 'valuation' | 'modeling' | 'speed' | 'marketIq' | 'polish';

export const STAT_LABEL: Record<StatKey, string> = {
  accounting: 'Accounting',
  valuation: 'Valuation',
  modeling: 'Modeling',
  speed: 'Speed',
  marketIq: 'Market IQ',
  polish: 'Polish',
};

export interface Subtopic {
  id: string;
  title: string;
}

export interface Section {
  id: SectionId;
  /** 1–12, matches the skill-tree numbering. */
  number: number;
  title: string;
  shortTitle: string;
  description: string;
  /** Every listed section must be unlocked (post-quiz passed) first. */
  prerequisites: SectionId[];
  /** Sections 10–12 are always open regardless of prerequisites. */
  alwaysOpen: boolean;
  /** How much this section's mastery feeds each stat (weights per stat). */
  statWeights: Partial<Record<StatKey, number>>;
  /** Relative frequency in real interviews; drives the Readiness Score. */
  interviewWeight: number;
  subtopics: Subtopic[];
}

export type LessonBlock =
  | { kind: 'p'; text: string }
  | { kind: 'h'; text: string }
  | { kind: 'list'; items: string[]; ordered?: boolean }
  | { kind: 'formula'; title: string; lines: string[]; note?: string }
  | { kind: 'trap'; title: string; text: string }
  | { kind: 'table'; headers: string[]; rows: string[][]; caption?: string }
  | { kind: 'example'; title?: string; text: string };

export interface Lesson {
  id: string;
  sectionId: SectionId;
  order: number;
  title: string;
  /** Estimated reading time, 5–8 minutes. */
  minutes: number;
  blocks: LessonBlock[];
  /** "60-second version" summary at the end of the chapter. */
  sixtySecond: string;
}

export interface WorkedExampleStep {
  title: string;
  body: string;
}

export interface WorkedExample {
  id: string;
  sectionId: SectionId;
  subtopic: string;
  difficulty: Difficulty;
  title: string;
  prompt: string;
  /** Revealed one at a time. */
  steps: WorkedExampleStep[];
  answer: string;
}

export interface Flashcard {
  id: string;
  sectionId: SectionId;
  subtopic: string;
  front: string;
  back: string;
}

export interface CheatSheet {
  sectionId: SectionId;
  blocks: LessonBlock[];
}

export interface Competency {
  id: CompetencyId;
  label: string;
}

export type CompetencyId =
  | 'leadership'
  | 'teamwork'
  | 'conflict'
  | 'failure'
  | 'initiative'
  | 'pressure'
  | 'detail'
  | 'analytical'
  | 'persuasion'
  | 'ethics'
  | 'adaptability'
  | 'criticism'
  | 'time-management'
  | 'client-focus'
  | 'greatest-achievement';

export interface BehavioralQuestion {
  id: string;
  prompt: string;
  category: 'core' | 'resume' | 'motivation' | 'competency' | 'curveball';
  competencies: CompetencyId[];
  /** Best 1–2 stories with a note on how to angle each for this question. */
  storyMatches: { storyId: string; angle: string }[];
  rubric: { point: string; keywords: string[][]; weight: number }[];
}

export interface AchievementDef {
  id: string;
  title: string;
  description: string;
  /** lucide-react icon name. */
  icon: string;
  xpReward: number;
  /** Hidden until unlocked. */
  secret?: boolean;
}

// ───────────────────────────── User data ─────────────────────────────

export interface Streak {
  current: number;
  longest: number;
  /** Last local date with qualifying activity. */
  lastActiveDate: ISODate | null;
  freezes: number;
  /** ISO week ("2026-W42") a freeze was last granted, so we grant one per week. */
  lastFreezeGrantWeek: string | null;
}

export interface UserProfile {
  id: 'me';
  displayName: string;
  createdAt: ISODateTime;
  totalXp: number;
  streak: Streak;
}

export type SectionStep = 'preQuiz' | 'reading' | 'examples' | 'postQuiz' | 'mock';

export interface SectionProgress {
  sectionId: SectionId;
  preQuizScore: number | null;
  fastTracked: boolean;
  lessonsRead: string[];
  examplesCompleted: string[];
  postQuizBest: number | null;
  /** Section is "cleared" for prerequisite purposes once post-quiz ≥ 80%. */
  postQuizPassedAt: ISODateTime | null;
  mockBest: number | null;
  /** Highest mastery reached; decay never drops below a fraction of this. */
  masteryPeak: number;
  lastActivityAt: ISODateTime | null;
  updatedAt: ISODateTime;
}

export type AttemptMode =
  | 'pre'
  | 'post'
  | 'mock'
  | 'review'
  | 'mistakes'
  | 'drill'
  | 'superday'
  | 'weeklyBoss'
  | 'arcade'
  /** Behavioral story practice (Story Bank practice mode). */
  | 'behavioral'
  /** HireVue-style one-way video interview practice. */
  | 'hirevue';

export interface Attempt {
  id: string;
  questionId: string;
  sectionId: SectionId;
  subtopic: string;
  difficulty: Difficulty;
  mode: AttemptMode;
  sessionId: string;
  response: QuestionResponse;
  correct: boolean;
  /** 0–1 partial credit (walkthrough lines, rubric points). */
  score: number;
  /** True if this was the user's first ever attempt at this question. */
  firstTry: boolean;
  timeMs: number;
  xpAwarded: number;
  createdAt: ISODateTime;
}

/** One quiz, mock, drill, Superday round or arcade run. */
export interface Session {
  id: string;
  mode: AttemptMode;
  sectionId: SectionId | null;
  title: string;
  startedAt: ISODateTime;
  finishedAt: ISODateTime | null;
  questionIds: string[];
  /** 0–1 */
  score: number | null;
  xpAwarded: number;
  /** Superday scorecard etc. */
  meta?: Record<string, unknown>;
}

export interface Mistake {
  id: string;
  questionId: string;
  sectionId: SectionId;
  attemptId: string;
  response: QuestionResponse;
  createdAt: ISODateTime;
  /** Set when the question is later answered correctly in Redo mode. */
  resolvedAt: ISODateTime | null;
}

export type CardSource = 'flashcard' | 'question' | 'story';

/** Spaced-repetition card (SM-2). */
export interface Card {
  id: string;
  source: CardSource;
  /** Flashcard id, question id or story id. */
  sourceId: string;
  sectionId: SectionId | null;
  easiness: number;
  intervalDays: number;
  repetitions: number;
  lapses: number;
  due: ISODate;
  lastReviewedAt: ISODateTime | null;
  createdAt: ISODateTime;
}

/** One SRS review, kept for streaks, quests, achievements and the activity heatmap. */
export interface ReviewLog {
  id: string;
  cardId: string;
  source: CardSource;
  sectionId: SectionId | null;
  /** SM-2 quality, 0–5. */
  quality: number;
  reviewedAt: ISODateTime;
}

export interface UnlockedAchievement {
  id: string;
  unlockedAt: ISODateTime;
}

export type QuestMetric =
  | 'correctAnswers'
  | 'sessionScore'
  | 'flawlessWalkthroughs'
  | 'lessonsRead'
  | 'examplesCompleted'
  | 'cardsReviewed'
  | 'mistakesResolved'
  | 'storiesPracticed'
  | 'arcadeRuns'
  | 'dealsLogged'
  | 'mocksCompleted';

export interface Quest {
  id: string;
  date: ISODate;
  templateId: string;
  title: string;
  /** Stat this quest trains; null for general quests (reviews, mistakes). */
  stat: StatKey | null;
  sectionId: SectionId | null;
  metric: QuestMetric;
  target: number;
  progress: number;
  xpReward: number;
  completedAt: ISODateTime | null;
  /** For sessionScore quests: minimum score (0–1) that counts. */
  minScore?: number;
}

// ── Resume & Story Bank ──

export type ResumeItemCategory = 'experience' | 'project' | 'leadership' | 'achievement' | 'education';

export interface ResumeItem {
  id: string;
  category: ResumeItemCategory;
  role: string;
  org: string;
  location?: string;
  start: string;
  end: string;
  bullets: string[];
  /** Notes confirmed by the user that are not on the resume itself. */
  confirmedNotes?: string[];
}

export interface Resume {
  id: string;
  version: number;
  importedAt: ISODateTime;
  name: string;
  contact: { location: string; phones: string[]; email: string };
  items: ResumeItem[];
  skills: { finance: string[]; technical: string[] };
  languages: { language: string; level: string }[];
  certifications: string[];
  /** Plain text of the source document, used to diff re-imports. */
  rawText: string;
}

export interface Story {
  id: string;
  resumeItemId: string;
  title: string;
  /** e.g. "leadership", "conflict", "failure". */
  angle: string;
  competencies: CompetencyId[];
  situation: string;
  task: string;
  action: string;
  result: string;
  /** 60–90 second spoken version (~150–225 words). */
  spoken: string;
  /** 20-second version. */
  short: string;
  /** Open "[FILL IN: …]" questions for the user. */
  fillIns: string[];
  /**
   * Details drafted by the app that are NOT on the resume. Shown as
   * "unverified" until the user confirms or rewrites them.
   */
  unverifiedDetails: string[];
  /** Latest practice self/LLM score, 0–1. Low scores flag a rewrite. */
  practiceScore: number | null;
  needsRewrite: boolean;
  userEdited: boolean;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export interface StoryVersion {
  id: string;
  storyId: string;
  snapshot: Omit<Story, 'id'>;
  note: string;
  createdAt: ISODateTime;
}

// ── Tools ──

export interface FirmContact {
  id: string;
  name: string;
  role: string;
  date: ISODate | null;
  notes: string;
}

export interface Firm {
  id: string;
  name: string;
  tier: 'elite-boutique' | 'bulge-bracket' | 'middle-market' | 'international' | 'gcc';
  focusAreas: string[];
  /** Interviewer persona id from src/content/firms/personas.ts. */
  personaId: string | null;
  researchedDeals: string[];
  contacts: FirmContact[];
  interviewNotes: string;
  whyFirmDraft: string;
  careersUrl?: string;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export interface DealEntry {
  id: string;
  acquirer: string;
  target: string;
  /** $ millions. */
  valueMm: number | null;
  /** e.g. "14.2x EBITDA". */
  multiple: string;
  sector: string;
  announcedOn: ISODate | null;
  rationale: string;
  myView: string;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export interface MarketNote {
  id: string;
  weekOf: ISODate;
  text: string;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export interface CalendarEvent {
  id: string;
  title: string;
  kind: 'deadline' | 'interview' | 'superday' | 'networking' | 'other';
  date: ISODate;
  firmId: string | null;
  notes: string;
  createdAt: ISODateTime;
}

export interface ArcadeScore {
  id: string;
  drillId: string;
  score: number;
  correct: number;
  total: number;
  durationSec: number;
  createdAt: ISODateTime;
}

export type LlmProvider = 'anthropic';

export interface Settings {
  id: 'settings';
  theme: 'dark' | 'light';
  /** Default tax rate for statement walk-throughs, as a decimal. */
  defaultTaxRate: number;
  dailyGoalMinutes: number;
  llmProvider: LlmProvider;
  /** Stored only in this browser. Never exported unless the user opts in. */
  llmApiKey: string;
  llmModel: string;
  reduceMotion: boolean;
}
