import type { Question, QuestionResponse } from '../../types/questions';
import { withinTolerance } from './numeric';
import { gradeOrdering } from './ordering';
import { RUBRIC_PASS, scoreRubric } from './rubric';
import { gradeWalkthrough } from './walkthrough';

export interface GradeResult {
  correct: boolean;
  /** 0–1 */
  score: number;
  /** Walk-through only: per-line correctness. */
  lines?: Record<string, boolean>;
  /** Rapid-fire only: answered after the time limit. */
  timedOut?: boolean;
}

/**
 * Grade any question. Free-text answers are graded on the rubric points the
 * user confirmed (keyword pre-match + self-grade, or LLM in Phase 10).
 */
export function grade(q: Question, r: QuestionResponse, elapsedMs = 0): GradeResult {
  if (q.type !== r.type) return { correct: false, score: 0 };
  switch (q.type) {
    case 'mcq': {
      const opt = q.options.find((o) => o.id === (r as { optionId: string }).optionId);
      const ok = Boolean(opt?.correct);
      return { correct: ok, score: ok ? 1 : 0 };
    }
    case 'numeric': {
      const ok = withinTolerance((r as { value: number | null }).value, q.answer, q.tolerance);
      return { correct: ok, score: ok ? 1 : 0 };
    }
    case 'rapidFire': {
      const timedOut = elapsedMs > q.timeLimitSec * 1000;
      const ok = !timedOut && withinTolerance((r as { value: number | null }).value, q.answer, q.tolerance);
      return { correct: ok, score: ok ? 1 : 0, timedOut };
    }
    case 'ordering':
      return gradeOrdering(
        q.items.map((i) => i.id),
        (r as { order: string[] }).order,
      );
    case 'walkthrough':
      return gradeWalkthrough(q, (r as { values: Record<string, number | null> }).values);
    case 'freeText': {
      const fr = r as Extract<QuestionResponse, { type: 'freeText' }>;
      const score = fr.llmScore ?? fr.selfScore ?? scoreRubric(q.rubric, fr.hitPointIds ?? []);
      return { correct: score >= RUBRIC_PASS - 1e-9, score };
    }
  }
}

/** Human-readable correct answer, for feedback and the Mistake Log. */
export function correctAnswerText(q: Question): string {
  switch (q.type) {
    case 'mcq':
      return q.options.find((o) => o.correct)?.text ?? '';
    case 'numeric':
    case 'rapidFire':
      return `${q.answer.toLocaleString('en-US', { maximumFractionDigits: 4 })}${q.unit ? ` ${q.unit}` : ''}`;
    case 'ordering':
      return q.items.map((i, n) => `${n + 1}. ${i.text}`).join('\n');
    case 'walkthrough':
      return q.lines.map((l) => `${l.statement} · ${l.label}: ${signed(l.expected)}`).join('\n');
    case 'freeText':
      return q.modelAnswer;
  }
}

/** Human-readable version of what the user answered. */
export function responseText(q: Question, r: QuestionResponse): string {
  switch (r.type) {
    case 'mcq':
      return q.type === 'mcq' ? (q.options.find((o) => o.id === r.optionId)?.text ?? '—') : '—';
    case 'numeric':
    case 'rapidFire':
      return r.value === null ? '(no answer)' : r.value.toLocaleString('en-US', { maximumFractionDigits: 4 });
    case 'ordering':
      return q.type === 'ordering'
        ? r.order.map((id, n) => `${n + 1}. ${q.items.find((i) => i.id === id)?.text ?? id}`).join('\n')
        : '—';
    case 'walkthrough':
      return q.type === 'walkthrough'
        ? q.lines.map((l) => `${l.statement} · ${l.label}: ${signed(r.values[l.key] ?? 0)}`).join('\n')
        : '—';
    case 'freeText':
      return r.text || '(no answer)';
  }
}

function signed(n: number): string {
  if (n === 0) return '0';
  const s = Math.abs(n).toLocaleString('en-US', { maximumFractionDigits: 2 });
  return n > 0 ? `+${s}` : `−${s}`;
}
