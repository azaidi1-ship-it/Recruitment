import { useState } from 'react';
import type { NumericQuestion } from '../../types/questions';
import { parseNumberInput } from '../../lib/numberInput';
import { Button, cx } from '../../components/ui';
import type { QuestionProps } from './types';

export function NumericInput({ question, submitted, reveal, onSubmit }: QuestionProps<NumericQuestion>) {
  const [raw, setRaw] = useState('');
  const value = parseNumberInput(raw);
  const invalid = raw.trim() !== '' && value === null;
  const submit = () => value !== null && onSubmit({ type: 'numeric', value });

  return (
    <div>
      <form
        className="flex flex-wrap items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        {question.unit === '$' && <span className="text-muted">$</span>}
        <input
          inputMode="decimal"
          autoFocus
          aria-label="Your answer"
          disabled={Boolean(submitted)}
          value={submitted?.response.type === 'numeric' ? String(submitted.response.value ?? '') : raw}
          onChange={(e) => setRaw(e.target.value)}
          className={cx(
            'w-44 rounded-lg border bg-sunk px-3 py-2 text-base tabular',
            submitted && reveal ? (submitted.grade.correct ? 'border-ok' : 'border-bad') : invalid ? 'border-bad' : 'border-line',
          )}
          placeholder="Your answer"
        />
        {question.unit && question.unit !== '$' && <span className="text-muted">{question.unit}</span>}
        {!submitted && (
          <Button variant="primary" type="submit" disabled={value === null}>
            Submit
          </Button>
        )}
      </form>
      {invalid && !submitted && <p className="mt-1 text-xs text-bad">Enter a number, e.g. 135, -40, (40) or 12.5%.</p>}
    </div>
  );
}
