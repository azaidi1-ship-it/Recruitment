import { CheckCircle2, XCircle } from 'lucide-react';
import type { Question } from '../../types/questions';
import { correctAnswerText, type GradeResult } from '../../engine/grading';
import { cx } from '../../components/ui';

/** Verdict, correct answer, solution steps and explanation after a question. */
export function Feedback({ question, grade, xp }: { question: Question; grade: GradeResult; xp: number | null }) {
  const partial = !grade.correct && grade.score > 0;
  return (
    <div className={cx('mt-4 rounded-lg border p-4 text-sm', grade.correct ? 'border-ok/40 bg-ok-soft/50' : 'border-bad/40 bg-bad-soft/50')}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className={cx('flex items-center gap-2 font-semibold', grade.correct ? 'text-ok' : 'text-bad')}>
          {grade.correct ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
          {grade.correct ? 'Correct' : partial ? `Partly right (${Math.round(grade.score * 100)}%)` : grade.timedOut ? 'Out of time' : 'Not quite'}
        </p>
        {xp !== null && <span className="text-xs text-accent tabular">{xp > 0 ? `+${xp} XP` : '0 XP'}</span>}
      </div>
      {!grade.correct && (question.type === 'numeric' || question.type === 'rapidFire') && (
        <p className="mt-2">
          Answer: <span className="font-semibold tabular">{correctAnswerText(question)}</span>
        </p>
      )}
      {question.type === 'numeric' && question.solution && (
        <ol className="mt-2 list-decimal space-y-0.5 pl-5 text-muted">
          {question.solution.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      )}
      <p className="mt-2 text-muted">{question.explanation}</p>
    </div>
  );
}
