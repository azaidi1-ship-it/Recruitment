import type { Tolerance } from '../../types/questions';

/** True if `value` is within tolerance of `answer`. */
export function withinTolerance(value: number | null, answer: number, tol: Tolerance): boolean {
  if (value === null || !Number.isFinite(value)) return false;
  const allowed = tol.kind === 'abs' ? tol.value : Math.abs(answer) * (tol.value / 100);
  // Tiny epsilon so 0.1 + 0.2 style float noise never fails an exact answer.
  return Math.abs(value - answer) <= allowed + 1e-9;
}

export function describeTolerance(tol: Tolerance, unit = ''): string {
  return tol.kind === 'abs' ? `±${tol.value}${unit ? ` ${unit}` : ''}` : `±${tol.value}%`;
}
