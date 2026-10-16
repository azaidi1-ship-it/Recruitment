import type { WalkthroughQuestion } from '../../types/questions';

export interface WalkthroughGrade {
  correct: boolean;
  score: number;
  /** Per line key: whether the entered value was right. */
  lines: Record<string, boolean>;
}

/** A blank line counts as 0 ("no change"). */
export function gradeWalkthrough(q: WalkthroughQuestion, values: Record<string, number | null>): WalkthroughGrade {
  const tol = q.lineTolerance ?? 0.01;
  const lines: Record<string, boolean> = {};
  let right = 0;
  for (const line of q.lines) {
    const v = values[line.key] ?? 0;
    const ok = Math.abs(v - line.expected) <= tol + 1e-9;
    lines[line.key] = ok;
    if (ok) right++;
  }
  const score = q.lines.length ? right / q.lines.length : 0;
  return { correct: right === q.lines.length, score, lines };
}

/** Sum of balance sheet changes on each side, for the live "does it balance?" check. */
export function balanceCheck(
  q: WalkthroughQuestion,
  values: Record<string, number | null>,
): { assets: number; liabEquity: number; balanced: boolean } {
  let assets = 0;
  let liabEquity = 0;
  for (const line of q.lines) {
    if (line.statement !== 'BS') continue;
    const v = values[line.key] ?? 0;
    if (line.side === 'A') assets += v;
    else if (line.side === 'LE') liabEquity += v;
  }
  return { assets, liabEquity, balanced: Math.abs(assets - liabEquity) < 0.005 };
}
