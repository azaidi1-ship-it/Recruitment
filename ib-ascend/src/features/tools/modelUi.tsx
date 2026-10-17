import { useEffect, useState, type ReactNode } from 'react';
import { parseNumberInput } from '../../lib/numberInput';
import { Card, cx } from '../../components/ui';

/**
 * Shared pieces for the Model Builders: labeled numeric inputs (percent
 * fields are shown and typed as percentages but stored as decimals), output
 * rows and sensitivity tables.
 */

export function NumberField({
  label,
  value,
  onChange,
  percent = false,
  suffix,
  hint,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  /** Display ×100 with a % suffix; store as a decimal. */
  percent?: boolean;
  suffix?: string;
  hint?: string;
}) {
  const shown = percent ? round(value * 100, 4) : value;
  const [text, setText] = useState(String(shown));
  // Follow outside changes (presets, reset) without fighting the user's typing.
  useEffect(() => {
    const parsed = parseNumberInput(text);
    if (parsed === null || Math.abs(parsed - shown) > 1e-9) setText(String(shown));
  }, [shown]);
  const invalid = parseNumberInput(text) === null;
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-xs text-muted">{label}</span>
      <span className={cx('flex items-center rounded-md border bg-sunk px-2.5 focus-within:border-accent', invalid ? 'border-bad/60' : 'border-line')}>
        <input
          inputMode="decimal"
          className="w-full bg-transparent py-1.5 text-right tabular outline-none"
          value={text}
          aria-invalid={invalid}
          onChange={(e) => {
            setText(e.target.value);
            const v = parseNumberInput(e.target.value);
            if (v !== null) onChange(percent ? v / 100 : v);
          }}
        />
        <span className="ml-1.5 shrink-0 text-xs text-faint">{percent ? '%' : suffix}</span>
      </span>
      {hint && <span className="mt-0.5 block text-[11px] text-faint">{hint}</span>}
    </label>
  );
}

export function InputGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="mb-4 last:mb-0">
      <legend className="mb-2 text-xs font-semibold uppercase tracking-wide text-faint">{title}</legend>
      <div className="grid grid-cols-2 gap-x-3 gap-y-2.5">{children}</div>
    </fieldset>
  );
}

export function Output({ label, value, strong = false, note }: { label: string; value: string; strong?: boolean; note?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-1.5 text-sm">
      <span className="text-muted">
        {label}
        {note && <span className="ml-1 text-[11px] text-faint">{note}</span>}
      </span>
      <span className={cx('tabular', strong ? 'text-lg font-semibold' : '')}>{value}</span>
    </div>
  );
}

/**
 * A two-way sensitivity table. Cells are shaded with one hue by value (a
 * sequential ramp, darker = lower) and the base case is outlined.
 */
export function SensitivityTable({
  title,
  rowLabel,
  colLabel,
  rows,
  cols,
  values,
  format,
  baseRow,
  baseCol,
}: {
  title: string;
  rowLabel: string;
  colLabel: string;
  rows: string[];
  cols: string[];
  values: (number | null)[][];
  format: (v: number) => string;
  baseRow: number;
  baseCol: number;
}) {
  const flat = values.flat().filter((v): v is number => v !== null);
  const min = Math.min(...flat);
  const max = Math.max(...flat);
  const shade = (v: number) => {
    const t = max > min ? (v - min) / (max - min) : 0.5;
    return `color-mix(in srgb, var(--c-accent) ${Math.round(8 + t * 40)}%, var(--c-surface))`;
  };
  return (
    <Card>
      <h3 className="mb-1 text-sm font-semibold">{title}</h3>
      <p className="mb-3 text-xs text-muted">
        Rows: {rowLabel}. Columns: {colLabel}. Base case outlined.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-[2px] text-xs tabular">
          <caption className="sr-only">{title}</caption>
          <thead>
            <tr>
              <th className="px-2 py-1 text-left font-medium text-faint">
                <span className="sr-only">{rowLabel} by {colLabel}</span>
              </th>
              {cols.map((c) => (
                <th key={c} scope="col" className="px-2 py-1 text-right font-medium text-muted">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {values.map((row, r) => (
              <tr key={rows[r]}>
                <th scope="row" className="px-2 py-1 text-left font-medium text-muted">
                  {rows[r]}
                </th>
                {row.map((v, c) => (
                  <td
                    key={c}
                    className={cx('rounded px-2 py-1.5 text-right text-ink', r === baseRow && c === baseCol && 'font-semibold outline outline-2 outline-accent')}
                    style={{ background: v === null ? undefined : shade(v) }}
                  >
                    {v === null ? '—' : format(v)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export function round(x: number, dp = 2): number {
  const f = 10 ** dp;
  return Math.round(x * f) / f;
}

export const money = (x: number, dp = 1) => `${x < 0 ? '−' : ''}$${Math.abs(x).toLocaleString('en-US', { minimumFractionDigits: dp, maximumFractionDigits: dp })}`;
export const pct = (x: number, dp = 1) => `${(x * 100).toFixed(dp)}%`;
export const mult = (x: number) => `${x.toFixed(1)}x`;

/** Evenly spaced values around a base, e.g. around(0.1, 0.01, 2) → [0.08, 0.09, 0.10, 0.11, 0.12]. */
export function around(base: number, step: number, each = 2): number[] {
  return Array.from({ length: each * 2 + 1 }, (_, i) => round(base + (i - each) * step, 6));
}
