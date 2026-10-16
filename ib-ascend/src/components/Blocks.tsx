import { AlertTriangle, Sigma } from 'lucide-react';
import type { LessonBlock } from '../types/models';

/** Right-align numeric cells like "1,000.0", "(400.0)", "25%", "12.5x". */
const NUMERIC = /^[\s$(−\-+]*[\d,.]+[)%x]*\s*$/;

/** Renders lesson / cheat-sheet blocks: paragraphs, formula callouts, Interview Trap boxes, tables. */
export function Blocks({ blocks, compact = false }: { blocks: LessonBlock[]; compact?: boolean }) {
  return (
    <div className={compact ? 'space-y-3' : 'space-y-4'}>
      {blocks.map((b, i) => (
        <Block key={i} block={b} />
      ))}
    </div>
  );
}

function Block({ block: b }: { block: LessonBlock }) {
  switch (b.kind) {
    case 'p':
      return <p className="leading-relaxed">{b.text}</p>;
    case 'h':
      return <h3 className="pt-2 text-lg font-semibold">{b.text}</h3>;
    case 'list': {
      const Tag = b.ordered ? 'ol' : 'ul';
      return (
        <Tag className={`space-y-1.5 pl-5 leading-relaxed ${b.ordered ? 'list-decimal' : 'list-disc'}`}>
          {b.items.map((it) => (
            <li key={it}>{it}</li>
          ))}
        </Tag>
      );
    }
    case 'formula':
      return (
        <div className="break-inside-avoid rounded-lg border border-info/40 bg-info-soft/50 p-4">
          <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-info">
            <Sigma size={14} /> {b.title}
          </p>
          <div className="space-y-1 font-mono text-sm">
            {b.lines.map((l) => (
              <p key={l}>{l}</p>
            ))}
          </div>
          {b.note && <p className="mt-2 text-xs text-muted">{b.note}</p>}
        </div>
      );
    case 'trap':
      return (
        <div className="break-inside-avoid rounded-lg border border-warn/40 bg-warn-soft/50 p-4">
          <p className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-warn">
            <AlertTriangle size={14} /> Interview trap: {b.title}
          </p>
          <p className="text-sm leading-relaxed">{b.text}</p>
        </div>
      );
    case 'table': {
      // A column is numeric when every non-blank cell is numeric; numeric columns are right-aligned.
      const numeric = b.headers.map((_, i) => b.rows.some((r) => (r[i] ?? '').trim()) && b.rows.every((r) => !(r[i] ?? '').trim() || NUMERIC.test(r[i]!)));
      return (
        <figure className="break-inside-avoid overflow-x-auto">
          <table className="w-full min-w-[320px] border-collapse text-sm">
            <thead>
              <tr>
                {b.headers.map((h, i) => (
                  <th key={h || i} className={`border-b border-line px-3 py-2 font-semibold ${numeric[i] ? 'text-right' : 'text-left'}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {b.rows.map((r, ri) => (
                <tr key={ri} className="border-b border-line/60">
                  {r.map((c, ci) => (
                    <td key={ci} className={`px-3 py-1.5 ${numeric[ci] ? 'text-right tabular' : ''}`}>
                      {c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {b.caption && <figcaption className="mt-1 text-xs text-faint">{b.caption}</figcaption>}
        </figure>
      );
    }
    case 'example':
      return (
        <div className="break-inside-avoid rounded-lg border border-line bg-sunk p-4">
          {b.title && <p className="mb-1 text-sm font-semibold">{b.title}</p>}
          <p className="text-sm leading-relaxed">{b.text}</p>
        </div>
      );
  }
}
