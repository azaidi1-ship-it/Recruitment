import { shuffle } from '../../lib/random';
import type { Difficulty } from '../../types/models';
import type { Question, QuestionPool } from '../../types/questions';

export interface QuizItem {
  question: Question;
  /** Set when this question is an interviewer follow-up to the given question id. */
  followUpOf?: string;
}

export interface BuiltQuiz {
  items: QuizItem[];
  /** Whole-quiz time limit in seconds, or null for untimed. */
  timeLimitSec: number | null;
}

const DIFF_RANK: Record<Difficulty, number> = { basic: 0, intermediate: 1, advanced: 2, elite: 3 };

export const PRE_QUIZ_SIZE = { min: 8, max: 12 } as const;
export const POST_QUIZ_SIZE = { min: 15, max: 20 } as const;
export const MOCK_SHAPE = { leads: 6, maxFollowUps: 2 } as const;

/** Seconds an interviewer would reasonably allow for a question. */
export function timeBudgetSec(q: Question): number {
  switch (q.type) {
    case 'rapidFire':
      return q.timeLimitSec;
    case 'freeText':
      return (q.targetSeconds ?? 90) + 30;
    case 'walkthrough':
      return 150;
    default:
      return { basic: 45, intermediate: 75, advanced: 120, elite: 180 }[q.difficulty];
  }
}

/** Round-robin across subtopics so a quiz covers the section, not one corner of it. */
function stratifiedPick(questions: Question[], count: number, rng: () => number): Question[] {
  const bySub = new Map<string, Question[]>();
  for (const q of shuffle(questions, rng)) {
    const list = bySub.get(q.subtopic) ?? [];
    list.push(q);
    bySub.set(q.subtopic, list);
  }
  const groups = shuffle([...bySub.values()], rng);
  const out: Question[] = [];
  while (out.length < count && groups.some((g) => g.length)) {
    for (const g of groups) {
      const q = g.shift();
      if (q) out.push(q);
      if (out.length >= count) break;
    }
  }
  return out;
}

function byDifficulty(a: Question, b: Question): number {
  return DIFF_RANK[a.difficulty] - DIFF_RANK[b.difficulty];
}

function inPool(questions: Question[], pool: QuestionPool): Question[] {
  return questions.filter((q) => q.pools.includes(pool));
}

/** Diagnostic: 8–12 questions across subtopics, easiest first, untimed. */
export function buildPreQuiz(questions: Question[], rng: () => number): BuiltQuiz {
  const pool = inPool(questions, 'pre');
  const picked = stratifiedPick(pool, Math.min(PRE_QUIZ_SIZE.max, pool.length), rng).sort(byDifficulty);
  return { items: picked.map((question) => ({ question })), timeLimitSec: null };
}

/** Post-reading quiz: 15–20 questions across subtopics and formats, easiest first, untimed. */
export function buildPostQuiz(questions: Question[], rng: () => number): BuiltQuiz {
  const pool = inPool(questions, 'post');
  const picked = stratifiedPick(pool, Math.min(POST_QUIZ_SIZE.max, pool.length), rng).sort(byDifficulty);
  return { items: picked.map((question) => ({ question })), timeLimitSec: null };
}

/**
 * Boss Fight: lead questions drawn at random from the mock pool, each
 * followed by up to two of its follow-ups (the way an interviewer digs into
 * an answer). Questions that only exist as follow-ups are never leads.
 * Timed: the sum of each question's budget.
 */
export function buildMock(questions: Question[], rng: () => number, shape = MOCK_SHAPE): BuiltQuiz {
  const byId = new Map(questions.map((q) => [q.id, q]));
  const mockPool = inPool(questions, 'mock');
  const followUpIds = new Set(mockPool.flatMap((q) => q.followUps ?? []));
  const leads = stratifiedPick(
    mockPool.filter((q) => !followUpIds.has(q.id)),
    shape.leads,
    rng,
  ).sort(byDifficulty);

  const used = new Set<string>();
  const items: QuizItem[] = [];
  for (const lead of leads) {
    if (used.has(lead.id)) continue;
    used.add(lead.id);
    items.push({ question: lead });
    for (const fid of (lead.followUps ?? []).slice(0, shape.maxFollowUps)) {
      const f = byId.get(fid);
      if (!f || used.has(fid)) continue;
      used.add(fid);
      items.push({ question: f, followUpOf: lead.id });
    }
  }
  const timeLimitSec = items.reduce((n, i) => n + timeBudgetSec(i.question), 0);
  return { items, timeLimitSec };
}

/**
 * Subtopic drill: up to `size` questions from one subtopic across every pool,
 * favoring ones you haven't answered correctly yet, easiest first, untimed.
 */
export function buildDrill(
  questions: Question[],
  subtopic: string,
  rng: () => number,
  size: number,
  correctIds: ReadonlySet<string> = new Set(),
): BuiltQuiz {
  const pool = shuffle(
    questions.filter((q) => q.subtopic === subtopic),
    rng,
  );
  const fresh = pool.filter((q) => !correctIds.has(q.id));
  const seen = pool.filter((q) => correctIds.has(q.id));
  const picked = [...fresh, ...seen].slice(0, size).sort(byDifficulty);
  return { items: picked.map((question) => ({ question })), timeLimitSec: null };
}

/** Redo My Mistakes: each distinct missed question once, most recent first. */
export function buildMistakeQuiz(questions: Question[], mistakeQuestionIds: string[]): BuiltQuiz {
  const byId = new Map(questions.map((q) => [q.id, q]));
  const seen = new Set<string>();
  const items: QuizItem[] = [];
  for (const id of mistakeQuestionIds) {
    const q = byId.get(id);
    if (!q || seen.has(id)) continue;
    seen.add(id);
    items.push({ question: q });
  }
  return { items, timeLimitSec: null };
}
