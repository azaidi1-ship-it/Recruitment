import type { Persona, RoundKind, ScoreWeights } from '../content/superday/personas';
import type { Difficulty, SectionId } from '../types/models';
import type { Question } from '../types/questions';
import { pickOne as pick, shuffle } from '../lib/random';
import { timeBudgetSec } from './quiz/builder';

export type ItemKind = 'technical' | 'behavioral';

export interface SuperdayItem {
  question: Question;
  kind: ItemKind;
  /** Set for interviewer follow-ups and curveballs: the question they build on. */
  followUpOf?: string;
  curveball?: boolean;
  probe?: boolean;
}

export interface SuperdayRound {
  index: number;
  kind: RoundKind;
  /** Hard time limit for the round. */
  minutes: number;
  items: SuperdayItem[];
}

export interface BuildInput {
  persona: Persona;
  rounds: number;
  minutes: number;
  /** Technical questions available, by section (already filtered to the chosen scope). */
  technical: Partial<Record<SectionId, Question[]>>;
  /** Fit & Behavioral bank. */
  behavioral: Question[];
  /** Generated resume probes. */
  probes: Question[];
  rng: () => number;
}

const HARD: Difficulty[] = ['advanced', 'elite'];
const isCurveball = (q: Question) => q.tags?.includes('curveball') ?? false;
const WALKTHROUGH_ID = 'fit-q-007';

/**
 * Build a Superday: each round is filled to roughly its time limit (using the
 * same per-question budgets as the Boss Fight), following the persona's
 * section mix, depth of follow-ups and curveball rate. No question repeats
 * within the day.
 */
export function buildSuperday(input: BuildInput): SuperdayRound[] {
  const { persona, rng } = input;
  const used = new Set<string>();
  const byId = new Map<string, Question>();
  for (const qs of Object.values(input.technical)) for (const q of qs ?? []) byId.set(q.id, q);

  const lineup = persona.rounds.slice(0, input.rounds);
  let walkthroughAsked = false;

  function technicalItems(budget: number): SuperdayItem[] {
    const items: SuperdayItem[] = [];
    let spent = 0;
    const sections = (Object.entries(persona.sectionWeights) as [SectionId, number][]).filter(([id]) =>
      (input.technical[id] ?? []).some((q) => !isCurveball(q)),
    );
    if (sections.length === 0) return items;
    let guard = 0;
    while (spent < budget * 0.95 && guard++ < 200) {
      const section = weighted(sections, rng);
      const pool = (input.technical[section] ?? []).filter((q) => !used.has(q.id) && !isCurveball(q));
      if (pool.length === 0) continue;
      const wantHard = rng() < persona.hardShare;
      const tier = pool.filter((q) => HARD.includes(q.difficulty) === wantHard);
      const lead = pick(tier.length ? tier : pool, rng);
      used.add(lead.id);
      items.push({ question: lead, kind: 'technical' });
      spent += timeBudgetSec(lead);
      for (const fid of (lead.followUps ?? []).slice(0, persona.followUps)) {
        const f = byId.get(fid);
        if (!f || used.has(fid)) continue;
        used.add(fid);
        items.push({ question: f, kind: 'technical', followUpOf: lead.id });
        spent += timeBudgetSec(f);
      }
      if (rng() < persona.curveballRate) {
        const cbs = (input.technical[section] ?? []).filter((q) => isCurveball(q) && !used.has(q.id));
        if (cbs.length) {
          const cb = pick(cbs, rng);
          used.add(cb.id);
          items.push({ question: cb, kind: 'technical', followUpOf: lead.id, curveball: true });
          spent += timeBudgetSec(cb);
        }
      }
    }
    return items;
  }

  function behavioralItems(budget: number): SuperdayItem[] {
    const items: SuperdayItem[] = [];
    let spent = 0;
    const add = (q: Question, extra: Partial<SuperdayItem> = {}) => {
      used.add(q.id);
      items.push({ question: q, kind: 'behavioral', ...extra });
      spent += timeBudgetSec(q);
    };
    const walkthrough = input.behavioral.find((q) => q.id === WALKTHROUGH_ID);
    if (!walkthroughAsked && walkthrough && !used.has(walkthrough.id)) {
      walkthroughAsked = true;
      add(walkthrough);
    }
    const probes = shuffle(input.probes.filter((q) => !used.has(q.id)), rng);
    const fitPool = shuffle(
      input.behavioral.filter((q) => q.pools.includes('mock') && !used.has(q.id) && !isCurveball(q)),
      rng,
    );
    const curveballs = shuffle(input.behavioral.filter((q) => isCurveball(q) && !used.has(q.id)), rng);
    // Interleave: two fit questions, then a resume probe; one curveball late in the round.
    const queue: [Question, Partial<SuperdayItem>][] = [];
    while (fitPool.length || probes.length) {
      for (let k = 0; k < 2 && fitPool.length; k++) queue.push([fitPool.shift()!, {}]);
      if (probes.length) queue.push([probes.shift()!, { probe: true }]);
    }
    let curveballDone = false;
    for (const [q, extra] of queue) {
      if (spent >= budget * 0.95) break;
      if (used.has(q.id)) continue;
      add(q, extra);
      if (!curveballDone && spent >= budget * 0.6 && curveballs.length) {
        curveballDone = true;
        add(curveballs[0]!, { curveball: true });
      }
    }
    return items;
  }

  return lineup.map((kind, index) => {
    const budget = input.minutes * 60;
    let items: SuperdayItem[];
    if (kind === 'technical') items = technicalItems(budget);
    else if (kind === 'behavioral') items = behavioralItems(budget);
    else items = [...behavioralItems(budget / 2), ...technicalItems(budget / 2)];
    return { index, kind, minutes: input.minutes, items };
  });
}

function weighted<T>(entries: [T, number][], rng: () => number): T {
  const total = entries.reduce((n, [, w]) => n + w, 0);
  let r = rng() * total;
  for (const [v, w] of entries) {
    r -= w;
    if (r < 0) return v;
  }
  return entries[entries.length - 1]![0];
}

// ───────────────────────────── Scorecard ─────────────────────────────

export interface SuperdayAnswer {
  questionId: string;
  round: number;
  kind: ItemKind;
  type: Question['type'];
  /** 0–1; 0 if unanswered. */
  score: number;
  /** Null if the round ended before it was answered. */
  timeMs: number | null;
  budgetMs: number;
}

export type Category = keyof ScoreWeights;

export const CATEGORY_LABEL: Record<Category, string> = {
  technical: 'Technical accuracy',
  structure: 'Structure',
  speed: 'Speed',
  story: 'Story quality',
};

export interface Scorecard {
  categories: Record<Category, number | null>;
  overall: number;
  rounds: { index: number; kind: RoundKind; score: number; answered: number; total: number }[];
  wouldAdvance: boolean;
  /** Plain-language reasons for the verdict. */
  reasons: string[];
  strongest: Category | null;
  weakest: Category | null;
}

/** Minimum for any single category or round before one weak spot sinks the day. */
export const SUPERDAY_FLOOR = 0.5;

export function scoreSuperday(
  answers: SuperdayAnswer[],
  rounds: { index: number; kind: RoundKind }[],
  persona: Pick<Persona, 'weights' | 'bar'>,
): Scorecard {
  const mean = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null);
  const answered = answers.filter((a) => a.timeMs !== null);
  const technical = mean(answers.filter((a) => a.kind === 'technical').map((a) => a.score));
  const story = mean(answers.filter((a) => a.kind === 'behavioral').map((a) => a.score));
  const structure = mean(answers.filter((a) => a.type === 'freeText').map((a) => a.score));
  const pace = mean(answered.map((a) => Math.min(1, a.budgetMs / Math.max(1, a.timeMs as number))));
  const speed = answers.length && pace !== null ? (answered.length / answers.length) * pace : answers.length ? 0 : null;
  const categories: Record<Category, number | null> = { technical, structure, speed, story };

  let num = 0;
  let den = 0;
  for (const [k, v] of Object.entries(categories) as [Category, number | null][]) {
    if (v === null) continue;
    num += persona.weights[k] * v;
    den += persona.weights[k];
  }
  const overall = den ? num / den : 0;

  const roundRows = rounds.map((r) => {
    const own = answers.filter((a) => a.round === r.index);
    return {
      index: r.index,
      kind: r.kind,
      score: mean(own.map((a) => a.score)) ?? 0,
      answered: own.filter((a) => a.timeMs !== null).length,
      total: own.length,
    };
  });

  const reasons: string[] = [];
  const pct = (x: number) => `${Math.round(x * 100)}%`;
  if (overall >= persona.bar) reasons.push(`Overall ${pct(overall)} clears this interviewer’s bar of ${pct(persona.bar)}.`);
  else reasons.push(`Overall ${pct(overall)} is below this interviewer’s bar of ${pct(persona.bar)}.`);
  const weakCats = (Object.entries(categories) as [Category, number | null][]).filter(([, v]) => v !== null && v < SUPERDAY_FLOOR);
  for (const [k, v] of weakCats) reasons.push(`${CATEGORY_LABEL[k]} at ${pct(v as number)} is a red flag on its own.`);
  const weakRounds = roundRows.filter((r) => r.score < SUPERDAY_FLOOR);
  for (const r of weakRounds) reasons.push(`Round ${r.index + 1} (${r.kind}) scored ${pct(r.score)}; one bad round can sink a Superday.`);

  const scored = (Object.entries(categories) as [Category, number | null][]).filter(([, v]) => v !== null) as [Category, number][];
  scored.sort((a, b) => b[1] - a[1]);

  return {
    categories,
    overall,
    rounds: roundRows,
    wouldAdvance: overall >= persona.bar && weakCats.length === 0 && weakRounds.length === 0,
    reasons,
    strongest: scored[0]?.[0] ?? null,
    weakest: scored.length > 1 ? scored[scored.length - 1]![0] : null,
  };
}
