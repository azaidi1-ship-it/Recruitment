/**
 * Pure helpers for the optional Claude features: prompt text and how results
 * map back onto the app's own rubrics and scorecards. The API calls live in
 * services/llm.ts; nothing here touches the network.
 */
import type { Persona } from '../content/superday/personas';
import { CATEGORY_LABEL, SUPERDAY_FLOOR, type Category, type Scorecard } from './superday';
import type { Resume } from '../types/models';
import type { RubricPoint } from '../types/questions';

export const LLM_MODELS = [
  { id: 'claude-opus-5-5', label: 'Claude Opus 5.5', note: 'Most capable (default)' },
  { id: 'claude-sonnet-5-5', label: 'Claude Sonnet 5.5', note: 'Faster and cheaper' },
  { id: 'claude-haiku-5-5', label: 'Claude Haiku 5.5', note: 'Fastest and cheapest' },
] as const;

export const DEFAULT_MODEL = 'claude-opus-5-5';

// ───────────────────────────── Grading ─────────────────────────────

export const GRADER_SYSTEM = `You grade practice answers for investment banking interviews (technical and behavioral) for a university student preparing for recruiting.

Grade the candidate's answer against each rubric point:
- "met" is true only if the answer clearly conveys the point in substance. Different wording, synonyms and examples count; a vague gesture toward it does not.
- For each point, give a one-sentence note: what they said that earns it, or what was missing.
- Judge only what is written. Never assume knowledge the answer doesn't show, and never invent facts about the candidate.
- Technical answers must be correct to earn a point: a confident but wrong mechanism does not count.

Then give 2–3 sentences of overall feedback in plain language, as a senior banker coaching a candidate: the single most important thing to fix first, then one strength. Be direct and specific; no generic praise.`;

export interface GradeInput {
  prompt: string;
  rubric: Pick<RubricPoint, 'id' | 'point'>[];
  modelAnswer?: string;
  answer: string;
  /** Extra context, e.g. "This is a behavioral answer; the candidate's best story is …". */
  context?: string;
}

export function gradeRequestText(g: GradeInput): string {
  return [
    `<question>\n${g.prompt}\n</question>`,
    `<rubric>\n${g.rubric.map((r) => `- id: ${r.id} | ${r.point}`).join('\n')}\n</rubric>`,
    g.modelAnswer ? `<reference_answer>\nA strong answer for comparison (it may contain [placeholders] for the candidate’s own details; don’t penalize the candidate for using their own real details instead):\n${g.modelAnswer}\n</reference_answer>` : '',
    g.context ? `<context>\n${g.context}\n</context>` : '',
    `<candidate_answer>\n${g.answer}\n</candidate_answer>`,
    'Grade every rubric point by its id.',
  ]
    .filter(Boolean)
    .join('\n\n');
}

export interface GradeResult {
  points: { id: string; met: boolean; note: string }[];
  feedback: string;
}

export interface AppliedGrade {
  hits: string[];
  notes: Record<string, string>;
  feedback: string;
}

/** Keep only rubric ids we know; unknown or missing ids count as not met. */
export function applyGrade(rubric: Pick<RubricPoint, 'id'>[], result: GradeResult): AppliedGrade {
  const known = new Set(rubric.map((r) => r.id));
  const hits: string[] = [];
  const notes: Record<string, string> = {};
  for (const p of result.points) {
    if (!known.has(p.id)) continue;
    notes[p.id] = p.note;
    if (p.met && !hits.includes(p.id)) hits.push(p.id);
  }
  return { hits, notes, feedback: result.feedback.trim() };
}

// ───────────────────────────── AI interviewer ─────────────────────────────

/** The resume as compact text for the interviewer: facts only. */
export function resumeBrief(resume: Resume): string {
  const lines = [`Candidate: ${resume.name}`];
  for (const i of resume.items) {
    lines.push(`- ${i.role}, ${i.org} (${i.start} – ${i.end})`);
    for (const b of i.bullets) lines.push(`  • ${b}`);
    for (const n of i.confirmedNotes ?? []) lines.push(`  • Confirmed: ${n}`);
  }
  lines.push(`Skills: ${[...resume.skills.finance, ...resume.skills.technical].join(', ')}`);
  return lines.join('\n');
}

export interface InterviewerSetup {
  persona: Persona;
  minutes: number;
  /** Section titles to draw technicals from, most weighted first. */
  topics: string[];
  resume: Resume;
  /** Titles of the candidate's prepared stories (so the interviewer can probe them). */
  storyTitles: string[];
}

export const INTERVIEW_DONE = '[END OF INTERVIEW]';

export function interviewerSystem(s: InterviewerSetup): string {
  return `You are a ${s.persona.title.toLowerCase()} investment banking interviewer running one ${s.minutes}-minute Superday interview with a university candidate. Interview style: ${s.persona.description}

How to run it:
- Ask exactly one question per turn, in 1–3 sentences, as you would out loud. No lists, no headings, no feedback, no praise during the interview.
- Mix behavioral and technical questions in roughly the proportions this style implies. Technical topics, most important first: ${s.topics.join(', ')}.
- Follow up on what the candidate actually says: ask for specifics ("What exactly did you do?", "Which assumption mattered most?"), push on vague or wrong answers, and add a curveball after a correct technical answer ("What changes if the company has NOLs?", "Why might a DCF be wrong here?").
- Probe the resume below at least twice. Treat everything in it as the candidate's claims; ask about it, don't restate it.
- If the candidate gives a wrong technical answer, don't correct them; ask a follow-up that tests whether they understand.
- After about ${Math.max(6, Math.round(s.minutes / 2.5))} questions, or when the candidate asks to finish, thank them in one sentence and end your message with ${INTERVIEW_DONE}.
- Open with a one-sentence greeting in this spirit: "${s.persona.openers.mixed}" Then ask the first question.

The candidate's resume:
${resumeBrief(s.resume)}

Stories the candidate has prepared (titles only): ${s.storyTitles.join('; ') || 'none listed'}.`;
}

export interface Turn {
  role: 'interviewer' | 'candidate';
  text: string;
  /** Candidate turns only: ms from the question appearing to sending the answer. */
  ms?: number;
}

export function transcriptText(turns: Turn[]): string {
  return turns.map((t) => `${t.role === 'interviewer' ? 'INTERVIEWER' : 'CANDIDATE'}: ${t.text.replace(INTERVIEW_DONE, '').trim()}`).join('\n\n');
}

export const SCORER_SYSTEM = `You are the interviewer writing up a Superday interview for an investment banking candidate. Score fairly against what a strong university candidate would say at a top advisory firm.

Score each category from 0 to 100:
- technical_accuracy: correctness and depth of technical answers (null if no technical questions were asked).
- structure: whether answers were organized, direct and complete (answer first, then support).
- story_quality: behavioral answers — specific, first person, clear actions and results, link to banking (null if no behavioral questions were asked).
An unanswered or "I don't know" answer scores as a miss, not as skipped.
Then: would_advance (your honest call), two to four specific strengths, two to four specific improvements, and a one-sentence note per question asked.

Quote or paraphrase the candidate when explaining. Never invent things they didn't say.`;

export function scoreRequestText(personaTitle: string, transcript: string): string {
  return `Interview style: ${personaTitle}.\n\n<transcript>\n${transcript}\n</transcript>`;
}

export interface AiScoreInput {
  technical_accuracy: number | null;
  structure: number | null;
  story_quality: number | null;
  would_advance: boolean;
}

/** Seconds a spoken-style answer should take; slower answers lose speed credit. */
export const AI_ANSWER_BUDGET_MS = 120_000;

/**
 * Turn Claude's write-up into the app's own scorecard: Claude scores
 * technical, structure and story (0–100); speed comes from the measured
 * answer times; the verdict uses the persona's weights, bar and the same
 * one-weak-spot floor as the offline Superday. Advancing needs both the
 * numbers and Claude's own call as the interviewer.
 */
export function aiScorecard(score: AiScoreInput, turns: Turn[], persona: Pick<Persona, 'weights' | 'bar'>): Scorecard {
  const unit = (x: number | null) => (x === null || !Number.isFinite(x) ? null : Math.min(1, Math.max(0, x / 100)));
  const answers = turns.filter((t) => t.role === 'candidate');
  // The closing message (with the end marker) is not a question.
  const questions = turns.filter((t) => t.role === 'interviewer' && t.text.trim() && !t.text.includes(INTERVIEW_DONE)).length;
  const timed = answers.filter((t) => typeof t.ms === 'number');
  const pace = timed.length ? timed.reduce((n, t) => n + Math.min(1, AI_ANSWER_BUDGET_MS / Math.max(1, t.ms as number)), 0) / timed.length : null;
  const categories: Record<Category, number | null> = {
    technical: unit(score.technical_accuracy),
    structure: unit(score.structure),
    speed: answers.length ? pace : null,
    story: unit(score.story_quality),
  };

  let num = 0;
  let den = 0;
  for (const [k, v] of Object.entries(categories) as [Category, number | null][]) {
    if (v === null) continue;
    num += persona.weights[k] * v;
    den += persona.weights[k];
  }
  const overall = den ? num / den : 0;

  const pct = (x: number) => `${Math.round(x * 100)}%`;
  const reasons = [overall >= persona.bar ? `Overall ${pct(overall)} clears this interviewer’s bar of ${pct(persona.bar)}.` : `Overall ${pct(overall)} is below this interviewer’s bar of ${pct(persona.bar)}.`];
  const weak = (Object.entries(categories) as [Category, number | null][]).filter(([, v]) => v !== null && v < SUPERDAY_FLOOR);
  for (const [k, v] of weak) reasons.push(`${CATEGORY_LABEL[k]} at ${pct(v as number)} is a red flag on its own.`);
  if (!answers.length) reasons.push('No answers were given.');
  reasons.push(score.would_advance ? 'The interviewer’s own call: would advance.' : 'The interviewer’s own call: would not advance, which decides it on its own.');

  const scored = (Object.entries(categories) as [Category, number | null][]).filter(([, v]) => v !== null) as [Category, number][];
  scored.sort((a, b) => b[1] - a[1]);
  return {
    categories,
    overall,
    rounds: [{ index: 0, kind: 'mixed', score: overall, answered: answers.length, total: Math.max(questions, answers.length) }],
    wouldAdvance: answers.length > 0 && overall >= persona.bar && weak.length === 0 && score.would_advance,
    reasons,
    strongest: scored[0]?.[0] ?? null,
    weakest: scored.length > 1 ? scored[scored.length - 1]![0] : null,
  };
}
