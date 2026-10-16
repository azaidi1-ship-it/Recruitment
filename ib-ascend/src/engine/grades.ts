import { GRADES, MASTERY, type Grade } from '../config/gameConfig';

export interface GradeResult {
  grade: Grade | null;
  composite: number;
  best: number;
  recentAvg: number;
}

/**
 * Section grade from Boss Fight history (scores 0–1, oldest first).
 * Composite = 0.6 × best + 0.4 × average of the last 3, so one lucky run
 * isn't enough for a top grade. S additionally needs at least 3 mocks.
 */
export function sectionGrade(mockScores: number[]): GradeResult {
  if (mockScores.length === 0) return { grade: null, composite: 0, best: 0, recentAvg: 0 };
  const best = Math.max(...mockScores);
  const recent = mockScores.slice(-MASTERY.mockRecentCount);
  const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
  const composite = 0.6 * best + 0.4 * recentAvg;
  const match = GRADES.find((g) => composite >= g.min - 1e-9 && mockScores.length >= g.minMocks);
  return { grade: match?.grade ?? 'F', composite, best, recentAvg };
}

/** Ordering helper: S highest. */
export const GRADE_ORDER: Record<Grade, number> = { S: 5, A: 4, B: 3, C: 2, D: 1, F: 0 };
