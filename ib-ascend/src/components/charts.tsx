import type { ReactNode } from 'react';

/**
 * Shared chart styling. Colors come from the theme tokens (CSS variables), so
 * charts follow light and dark mode without separate palettes.
 */
export const CHART = {
  series: 'var(--c-accent)',
  grid: 'var(--c-line)',
  axis: 'var(--c-faint)',
  tick: { fill: 'var(--c-muted)', fontSize: 11 },
  reference: 'var(--c-faint)',
} as const;

/** Tooltip box used by every chart; text uses ink tokens, never the series color. */
export function TooltipBox({ title, children }: { title: ReactNode; children: ReactNode }) {
  return (
    <div className="rounded-md border border-line bg-surface px-2.5 py-1.5 text-xs shadow-lg">
      <p className="font-medium text-ink">{title}</p>
      <div className="mt-0.5 text-muted tabular">{children}</div>
    </div>
  );
}

/** Visually hidden data table so every chart has a screen-reader equivalent. */
export function SrTable({ caption, headers, rows }: { caption: string; headers: string[]; rows: (string | number)[][] }) {
  return (
    <table className="sr-only">
      <caption>{caption}</caption>
      <thead>
        <tr>
          {headers.map((h) => (
            <th key={h}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>
            {r.map((c, j) => (
              <td key={j}>{c}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
