import { useState } from 'react';
import { Check, Scale, X } from 'lucide-react';
import type { StatementKind, WalkthroughQuestion } from '../../types/questions';
import { balanceCheck } from '../../engine/grading/walkthrough';
import { parseNumberInput, formatNumber } from '../../lib/numberInput';
import { Button, cx } from '../../components/ui';
import type { QuestionProps } from './types';

const STATEMENTS: { kind: StatementKind; title: string; hint: string }[] = [
  { kind: 'IS', title: 'Income statement', hint: 'Enter expenses as positive when the expense goes up.' },
  { kind: 'CFS', title: 'Cash flow statement', hint: 'Effect on cash: + inflow, − outflow.' },
  { kind: 'BS', title: 'Balance sheet', hint: 'Change in each balance.' },
];

/**
 * Line-by-line statement walk-through. Blank lines count as 0 (no change).
 * A live check shows whether the balance sheet changes balance.
 */
export function WalkthroughBuilder({ question, submitted, reveal, onSubmit }: QuestionProps<WalkthroughQuestion>) {
  const [raw, setRaw] = useState<Record<string, string>>({});
  const values: Record<string, number | null> = submitted?.response.type === 'walkthrough'
    ? submitted.response.values
    : Object.fromEntries(question.lines.map((l) => [l.key, parseNumberInput(raw[l.key] ?? '')]));
  const invalid = question.lines.some((l) => (raw[l.key] ?? '').trim() !== '' && values[l.key] === null);
  const balance = balanceCheck(question, values);
  const lineOk = submitted?.grade.lines;

  return (
    <div>
      <p className="mb-3 text-xs text-muted">
        Tax rate {Math.round(question.taxRate * 100)}%.{' '}
        {question.assumptions?.join(' ')} Leave a line blank if it doesn’t change.
      </p>
      <div className="grid gap-4 lg:grid-cols-3">
        {STATEMENTS.map((st) => {
          const lines = question.lines.filter((l) => l.statement === st.kind);
          if (!lines.length) return null;
          return (
            <fieldset key={st.kind} className="rounded-lg border border-line bg-sunk p-3">
              <legend className="px-1 text-sm font-semibold">{st.title}</legend>
              <p className="mb-2 text-[11px] text-faint">{st.hint}</p>
              <ul className="space-y-2">
                {lines.map((l) => {
                  const ok = lineOk?.[l.key];
                  return (
                    <li key={l.key}>
                      <label className="flex items-center gap-2 text-sm">
                        <span className="flex-1 leading-tight">
                          {l.label}
                          {l.side && <span className="ml-1 text-[10px] text-faint">({l.side === 'A' ? 'asset' : 'L+E'})</span>}
                        </span>
                        <input
                          inputMode="decimal"
                          disabled={Boolean(submitted)}
                          value={submitted ? (values[l.key] === null || values[l.key] === undefined ? '' : String(values[l.key])) : (raw[l.key] ?? '')}
                          onChange={(e) => setRaw((r) => ({ ...r, [l.key]: e.target.value }))}
                          placeholder="0"
                          aria-label={`${st.title}: ${l.label}`}
                          className={cx(
                            'w-24 rounded-md border bg-surface px-2 py-1.5 text-right text-sm tabular',
                            submitted && reveal ? (ok ? 'border-ok' : 'border-bad') : 'border-line',
                          )}
                        />
                        {submitted && reveal && (ok ? <Check size={15} className="text-ok" /> : <X size={15} className="text-bad" />)}
                      </label>
                      {submitted && reveal && !ok && (
                        <p className="mt-0.5 text-right text-[11px] text-bad">Should be {l.expected > 0 ? '+' : ''}{formatNumber(l.expected)}</p>
                      )}
                    </li>
                  );
                })}
              </ul>
            </fieldset>
          );
        })}
      </div>
      <p className={cx('mt-3 flex items-center gap-2 text-xs', balance.balanced ? 'text-ok' : 'text-warn')}>
        <Scale size={14} />
        Assets {signed(balance.assets)} vs liabilities + equity {signed(balance.liabEquity)}
        {balance.balanced ? ' — balances' : ' — doesn’t balance yet'}
      </p>
      {!submitted && (
        <>
          {invalid && <p className="mt-2 text-xs text-bad">Some entries aren’t numbers.</p>}
          <Button variant="primary" className="mt-3" disabled={invalid} onClick={() => onSubmit({ type: 'walkthrough', values })}>
            Check my walk-through
          </Button>
        </>
      )}
    </div>
  );
}

function signed(n: number): string {
  return n === 0 ? '0' : `${n > 0 ? '+' : '−'}${formatNumber(Math.abs(n))}`;
}
