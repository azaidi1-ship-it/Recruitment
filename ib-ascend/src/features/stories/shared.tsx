import type { ReactNode } from 'react';
import { COMPETENCIES } from '../../content/behavioral/competencies';
import type { CompetencyId } from '../../types/models';
import { cx } from '../../components/ui';

export const COMPETENCY_LABEL = Object.fromEntries(COMPETENCIES.map((c) => [c.id, c.label])) as Record<CompetencyId, string>;

/** Text with every "[FILL IN: …]" highlighted so open questions stand out. */
export function FillInText({ text, className }: { text: string; className?: string }) {
  const parts = text.split(/(\[FILL IN: [^\]]+\])/g);
  return (
    <span className={cx('whitespace-pre-line', className)}>
      {parts.map((p, k) =>
        p.startsWith('[FILL IN: ') ? (
          <mark key={k} className="rounded bg-warn-soft px-1 text-warn">
            {p}
          </mark>
        ) : (
          <span key={k}>{p}</span>
        ),
      )}
    </span>
  );
}

export function CompetencyChip({ id, children }: { id: CompetencyId; children?: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-line bg-sunk px-2 py-0.5 text-[11px] text-muted">
      {COMPETENCY_LABEL[id]}
      {children}
    </span>
  );
}

export const wordCount = (s: string) => (s.trim() ? s.trim().split(/\s+/).length : 0);
/** Speaking time at ~150 words per minute. */
export const speakSeconds = (s: string) => Math.round((wordCount(s) / 150) * 60);
