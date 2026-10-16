import { useEffect, useRef, useState } from 'react';
import { Timer } from 'lucide-react';
import type { RapidFireQuestion } from '../../types/questions';
import { parseNumberInput } from '../../lib/numberInput';
import { Button, cx } from '../../components/ui';
import type { QuestionProps } from './types';

/** Countdown answer box. Submits automatically when time runs out. */
export function RapidFire({ question, submitted, reveal, onSubmit }: QuestionProps<RapidFireQuestion>) {
  const [raw, setRaw] = useState('');
  const [left, setLeft] = useState(question.timeLimitSec);
  const rawRef = useRef(raw);
  rawRef.current = raw;
  const done = Boolean(submitted);

  useEffect(() => {
    if (done) return;
    const started = Date.now();
    const t = setInterval(() => {
      const remaining = question.timeLimitSec - (Date.now() - started) / 1000;
      if (remaining <= 0) {
        clearInterval(t);
        setLeft(0);
        onSubmit({ type: 'rapidFire', value: parseNumberInput(rawRef.current) });
      } else setLeft(remaining);
    }, 100);
    return () => clearInterval(t);
    // onSubmit identity changes per render; the timer must only start once per question.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id, done]);

  const value = parseNumberInput(raw);
  return (
    <div>
      <div className="mb-3 flex items-center gap-2 text-sm">
        <Timer size={16} className={left < 5 ? 'text-bad' : 'text-accent'} />
        <span className={cx('tabular font-semibold', left < 5 && 'text-bad')}>{Math.ceil(left)}s</span>
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-sunk">
          <div className="h-full bg-accent transition-[width] duration-100" style={{ width: `${(left / question.timeLimitSec) * 100}%` }} />
        </div>
      </div>
      <form
        className="flex items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (value !== null) onSubmit({ type: 'rapidFire', value });
        }}
      >
        <input
          inputMode="decimal"
          autoFocus
          aria-label="Your answer"
          disabled={done}
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          className={cx(
            'w-40 rounded-lg border bg-sunk px-3 py-2 text-lg tabular',
            submitted && reveal ? (submitted.grade.correct ? 'border-ok' : 'border-bad') : 'border-line',
          )}
        />
        {!done && (
          <Button variant="primary" type="submit" disabled={value === null}>
            Submit
          </Button>
        )}
      </form>
      {submitted?.grade.timedOut && <p className="mt-2 text-xs text-bad">Time’s up.</p>}
    </div>
  );
}
