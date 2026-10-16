import type { Grade } from '../config/gameConfig';
import { cx } from './ui';

const TONE: Record<Grade, string> = {
  S: 'bg-accent text-accent-ink border-accent',
  A: 'bg-ok-soft text-ok border-ok/40',
  B: 'bg-info-soft text-info border-info/40',
  C: 'bg-warn-soft text-warn border-warn/40',
  D: 'bg-bad-soft text-bad border-bad/40',
  F: 'bg-bad-soft text-bad border-bad/40',
};

export function GradeBadge({ grade }: { grade: Grade | null }) {
  if (!grade) return <span className="inline-grid size-6 place-items-center rounded-md border border-line text-[11px] text-faint" title="No mock yet">–</span>;
  return (
    <span className={cx('inline-grid size-6 place-items-center rounded-md border text-xs font-bold', TONE[grade])} title={`Grade ${grade}`}>
      {grade}
    </span>
  );
}
