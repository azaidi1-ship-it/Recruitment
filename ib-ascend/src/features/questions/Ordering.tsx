import { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, Check, X } from 'lucide-react';
import type { OrderingQuestion } from '../../types/questions';
import { mulberry32, hashString, shuffle } from '../../lib/random';
import { Button, cx } from '../../components/ui';
import type { QuestionProps } from './types';

export function Ordering({ question, submitted, reveal, onSubmit }: QuestionProps<OrderingQuestion>) {
  const initial = useMemo(() => {
    const ids = question.items.map((i) => i.id);
    // Shuffle deterministically per mount, and never start in the correct order.
    let order = shuffle(ids, mulberry32(hashString(question.id) ^ Date.now()));
    if (order.every((id, i) => id === ids[i])) order = [...order.slice(1), order[0]!];
    return order;
  }, [question]);
  const [order, setOrder] = useState(initial);
  const shown = submitted?.response.type === 'ordering' ? submitted.response.order : order;
  const text = new Map(question.items.map((i) => [i.id, i.text]));

  const move = (idx: number, dir: -1 | 1) => {
    const j = idx + dir;
    if (j < 0 || j >= order.length) return;
    const next = [...order];
    [next[idx], next[j]] = [next[j]!, next[idx]!];
    setOrder(next);
  };

  return (
    <div>
      <ol className="space-y-2">
        {shown.map((id, idx) => {
          const right = submitted && reveal && question.items[idx]?.id === id;
          const wrong = submitted && reveal && !right;
          return (
            <li
              key={id}
              className={cx(
                'flex items-center gap-3 rounded-lg border px-3 py-2.5 text-sm',
                right ? 'border-ok bg-ok-soft' : wrong ? 'border-bad bg-bad-soft' : 'border-line bg-sunk',
              )}
            >
              <span className="w-5 text-center text-xs font-semibold text-muted tabular">{idx + 1}</span>
              <span className="flex-1">{text.get(id)}</span>
              {submitted ? (
                reveal && (right ? <Check size={16} className="text-ok" /> : <X size={16} className="text-bad" />)
              ) : (
                <span className="flex gap-1">
                  <button type="button" aria-label={`Move “${text.get(id)}” up`} disabled={idx === 0} onClick={() => move(idx, -1)} className="rounded p-1 text-muted hover:bg-surface hover:text-ink disabled:opacity-30">
                    <ArrowUp size={16} />
                  </button>
                  <button type="button" aria-label={`Move “${text.get(id)}” down`} disabled={idx === shown.length - 1} onClick={() => move(idx, 1)} className="rounded p-1 text-muted hover:bg-surface hover:text-ink disabled:opacity-30">
                    <ArrowDown size={16} />
                  </button>
                </span>
              )}
            </li>
          );
        })}
      </ol>
      {!submitted && (
        <Button variant="primary" className="mt-4" onClick={() => onSubmit({ type: 'ordering', order })}>
          Submit order
        </Button>
      )}
    </div>
  );
}
