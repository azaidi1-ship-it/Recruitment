import { useEffect, useMemo, useState } from 'react';
import { CheckSquare, Mic, Square } from 'lucide-react';
import type { FreeTextQuestion } from '../../types/questions';
import { matchRubric, scoreRubric, RUBRIC_PASS } from '../../engine/grading/rubric';
import { Button, cx } from '../../components/ui';
import type { QuestionProps } from './types';

/**
 * Verbal answer: type it as you'd say it, then self-grade against the rubric.
 * Points detected by keyword matching are pre-ticked; you confirm or adjust.
 * TODO(Phase 10): LLM grading when an API key is set.
 */
export function FreeText({ question, submitted, reveal, onSubmit }: QuestionProps<FreeTextQuestion>) {
  const [text, setText] = useState('');
  const [stage, setStage] = useState<'answer' | 'grade'>('answer');
  const [hits, setHits] = useState<string[]>([]);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (stage !== 'answer' || submitted) return;
    const start = Date.now();
    const t = setInterval(() => setElapsed((Date.now() - start) / 1000), 500);
    return () => clearInterval(t);
  }, [stage, submitted, question.id]);

  const detected = useMemo(() => matchRubric(question.rubric, text), [question.rubric, text]);
  const final = submitted?.response.type === 'freeText' ? submitted.response : null;
  const shownHits = final?.hitPointIds ?? hits;
  const score = scoreRubric(question.rubric, shownHits);
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;

  if (stage === 'answer' && !final) {
    return (
      <div>
        <div className="mb-2 flex items-center justify-between text-xs text-muted">
          <span className="flex items-center gap-1.5">
            <Mic size={14} /> Type it the way you’d say it out loud.
          </span>
          <span className="tabular">
            {Math.floor(elapsed)}s{question.targetSeconds ? ` / aim for ~${question.targetSeconds}s spoken` : ''} · {words} words
          </span>
        </div>
        <textarea
          autoFocus
          rows={7}
          value={text}
          onChange={(e) => setText(e.target.value)}
          aria-label="Your answer"
          className="w-full rounded-lg border border-line bg-sunk p-3 text-sm leading-relaxed"
          placeholder="Start talking…"
        />
        <Button
          variant="primary"
          className="mt-3"
          disabled={words < 3}
          onClick={() => {
            setHits(detected);
            setStage('grade');
          }}
        >
          Submit and grade
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h4 className="mb-1 text-xs font-medium uppercase tracking-wide text-muted">Your answer</h4>
        <p className="whitespace-pre-wrap rounded-lg border border-line bg-sunk p-3 text-sm">{final?.text ?? text}</p>
      </div>
      <div>
        <h4 className="mb-1 text-xs font-medium uppercase tracking-wide text-muted">
          {final ? 'Rubric' : 'Which of these did you cover? (detected points are pre-ticked)'}
        </h4>
        <ul className="space-y-1.5">
          {question.rubric.map((p) => {
            const on = shownHits.includes(p.id);
            return (
              <li key={p.id}>
                <button
                  type="button"
                  disabled={Boolean(final)}
                  onClick={() => setHits((h) => (h.includes(p.id) ? h.filter((x) => x !== p.id) : [...h, p.id]))}
                  className={cx('flex w-full items-start gap-2 rounded-md px-2 py-1.5 text-left text-sm', !final && 'hover:bg-sunk')}
                >
                  {on ? <CheckSquare size={16} className="mt-0.5 shrink-0 text-ok" /> : <Square size={16} className="mt-0.5 shrink-0 text-faint" />}
                  <span className={on ? '' : 'text-muted'}>{p.point}</span>
                </button>
              </li>
            );
          })}
        </ul>
        <p className={cx('mt-2 text-sm font-medium tabular', score >= RUBRIC_PASS ? 'text-ok' : 'text-warn')}>
          Score {Math.round(score * 100)}% {score >= RUBRIC_PASS ? '— strong answer' : '— below the 70% bar'}
        </p>
      </div>
      {(reveal || !final) && (
        <div>
          <h4 className="mb-1 text-xs font-medium uppercase tracking-wide text-muted">Model answer</h4>
          <p className="rounded-lg border border-accent/30 bg-accent-soft/40 p-3 text-sm leading-relaxed">{question.modelAnswer}</p>
        </div>
      )}
      {!final && (
        <Button
          variant="primary"
          onClick={() => onSubmit({ type: 'freeText', text, hitPointIds: hits, selfScore: score })}
        >
          Confirm score
        </Button>
      )}
    </div>
  );
}
