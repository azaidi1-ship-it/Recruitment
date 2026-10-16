import { cx } from './ui';

/** Mastery → color band. */
export function masteryTone(m: number): string {
  if (m <= 0) return 'bg-faint/40';
  if (m < 0.4) return 'bg-bad';
  if (m < 0.7) return 'bg-warn';
  if (m < 0.9) return 'bg-ok';
  return 'bg-accent';
}

export function ProgressBar({
  value,
  className,
  barClassName,
  label,
}: {
  /** 0–1 */
  value: number;
  className?: string;
  barClassName?: string;
  label?: string;
}) {
  const pct = Math.round(Math.min(1, Math.max(0, value)) * 100);
  return (
    <div
      className={cx('h-2 w-full overflow-hidden rounded-full bg-sunk', className)}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <div className={cx('h-full rounded-full transition-[width] duration-500', barClassName ?? 'bg-accent')} style={{ width: `${pct}%` }} />
    </div>
  );
}
