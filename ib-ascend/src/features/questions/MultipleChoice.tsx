import { useMemo, useState } from 'react';
import { Check, X } from 'lucide-react';
import type { MultipleChoiceQuestion } from '../../types/questions';
import { Button, cx } from '../../components/ui';
import { mulberry32, shuffle } from '../../lib/random';
import type { QuestionProps } from './types';

export function MultipleChoice({ question, submitted, reveal, onSubmit }: QuestionProps<MultipleChoiceQuestion>) {
  const [choice, setChoice] = useState<string | null>(null);
  // Shuffle once per mount so the correct answer's position can't be learned.
  const options = useMemo(() => shuffle(question.options, mulberry32((Math.random() * 2 ** 32) >>> 0)), [question]);
  const picked = submitted?.response.type === 'mcq' ? submitted.response.optionId : choice;

  return (
    <div>
      <ul className="space-y-2" role="radiogroup" aria-label="Answer options">
        {options.map((o, i) => {
          const isPicked = picked === o.id;
          const showRight = submitted && reveal && o.correct;
          const showWrong = submitted && reveal && isPicked && !o.correct;
          return (
            <li key={o.id}>
              <button
                type="button"
                role="radio"
                aria-checked={isPicked}
                disabled={Boolean(submitted)}
                onClick={() => setChoice(o.id)}
                className={cx(
                  'flex w-full items-start gap-3 rounded-lg border px-3.5 py-3 text-left text-sm transition',
                  showRight
                    ? 'border-ok bg-ok-soft'
                    : showWrong
                      ? 'border-bad bg-bad-soft'
                      : isPicked
                        ? 'border-accent bg-accent-soft'
                        : 'border-line bg-sunk hover:border-faint',
                  submitted && 'cursor-default',
                )}
              >
                <span className="mt-px grid size-5 shrink-0 place-items-center rounded border border-line text-[11px] font-semibold text-muted">
                  {showRight ? <Check size={13} className="text-ok" /> : showWrong ? <X size={13} className="text-bad" /> : String.fromCharCode(65 + i)}
                </span>
                <span className="min-w-0">
                  <span className="block">{o.text}</span>
                  {submitted && reveal && (isPicked || o.correct) && (
                    <span className={cx('mt-1 block text-xs', o.correct ? 'text-ok' : 'text-bad')}>{o.explanation}</span>
                  )}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      {submitted && reveal && (
        <details className="mt-3 text-xs text-muted">
          <summary className="cursor-pointer select-none">Why the other options are wrong</summary>
          <ul className="mt-2 space-y-1.5">
            {options
              .filter((o) => !o.correct && o.id !== picked)
              .map((o) => (
                <li key={o.id}>
                  <span className="text-ink">{o.text}:</span> {o.explanation}
                </li>
              ))}
          </ul>
        </details>
      )}
      {!submitted && (
        <Button variant="primary" className="mt-4" disabled={!choice} onClick={() => choice && onSubmit({ type: 'mcq', optionId: choice })}>
          Submit
        </Button>
      )}
    </div>
  );
}
