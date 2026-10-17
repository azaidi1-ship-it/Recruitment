import { useCallback, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Sparkles } from 'lucide-react';
import { applyGrade, type AppliedGrade, type GradeInput } from '../../engine/ai';
import { gradeAnswer, llmEnabled } from '../../services/llm';
import { useSettingsStore } from '../../store/useSettingsStore';
import { cx } from '../../components/ui';

export type AiGradeState =
  | { status: 'off' }
  | { status: 'loading' }
  | { status: 'done'; grade: AppliedGrade; score: number }
  | { status: 'error'; message: string };

/**
 * Claude grading for a verbal answer, when a key is set and auto-grading is
 * on. The caller keeps its keyword grade until (and unless) Claude answers,
 * and the user still confirms every score.
 */
export function useAiGrade(onGraded?: (g: AppliedGrade) => void, opts: { manual?: boolean } = {}) {
  // Manual (button-triggered) grading only needs a key; automatic grading also respects the setting.
  const enabled = useSettingsStore((s) => llmEnabled(s.settings) && (opts.manual || s.settings.llmAutoGrade));
  const [state, setState] = useState<AiGradeState>({ status: 'off' });
  const latest = useRef(0);

  const run = useCallback(
    async (input: GradeInput, weights?: Record<string, number>) => {
      if (!enabled) return;
      const ticket = ++latest.current;
      setState({ status: 'loading' });
      try {
        const grade = applyGrade(input.rubric, await gradeAnswer(input));
        if (ticket !== latest.current) return;
        const total = input.rubric.reduce((n, r) => n + (weights?.[r.id] ?? 1), 0) || 1;
        const score = input.rubric.reduce((n, r) => n + (grade.hits.includes(r.id) ? (weights?.[r.id] ?? 1) : 0), 0) / total;
        setState({ status: 'done', grade, score });
        onGraded?.(grade);
      } catch (e) {
        if (ticket !== latest.current) return;
        setState({ status: 'error', message: e instanceof Error ? e.message : String(e) });
      }
    },
    [enabled, onGraded],
  );

  return { enabled, state, run };
}

/** Status and feedback from Claude, shown above the rubric. */
export function AiFeedback({ state }: { state: AiGradeState }) {
  if (state.status === 'off') return null;
  return (
    <div className={cx('rounded-lg border p-3 text-sm', state.status === 'error' ? 'border-warn/40 bg-warn-soft/40' : 'border-info/40 bg-info-soft/40')} aria-live="polite">
      <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-info">
        {state.status === 'loading' ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}
        {state.status === 'loading' ? 'Claude is grading your answer…' : state.status === 'error' ? 'AI grading unavailable' : 'Claude’s feedback'}
      </p>
      {state.status === 'done' && <p className="leading-relaxed">{state.grade.feedback}</p>}
      {state.status === 'done' && <p className="mt-1.5 text-xs text-muted">Rubric points below are ticked from Claude’s grade. Adjust anything you disagree with, then confirm.</p>}
      {state.status === 'error' && (
        <p className="text-muted">
          {state.message} Keyword detection is used instead.{' '}
          <Link to="/settings" className="text-accent hover:underline">
            Settings
          </Link>
        </p>
      )}
    </div>
  );
}

/** Claude's one-line note for a rubric point, if any. */
export function PointNote({ state, id }: { state: AiGradeState; id: string }) {
  if (state.status !== 'done' || !state.grade.notes[id]) return null;
  return <span className="mt-0.5 block text-xs text-muted">{state.grade.notes[id]}</span>;
}
