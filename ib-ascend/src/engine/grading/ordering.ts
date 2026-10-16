/**
 * Ordering is correct only if every item is in place. Partial credit is the
 * share of item pairs in the right relative order (so one swap of neighbours
 * still scores highly, a fully reversed list scores 0).
 */
export function gradeOrdering(correct: string[], given: string[]): { correct: boolean; score: number } {
  const n = correct.length;
  if (n < 2) return { correct: true, score: 1 };
  const pos = new Map(given.map((id, i) => [id, i]));
  let good = 0;
  let total = 0;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      total++;
      const a = pos.get(correct[i]!);
      const b = pos.get(correct[j]!);
      if (a !== undefined && b !== undefined && a < b) good++;
    }
  }
  const exact = n === given.length && correct.every((id, i) => given[i] === id);
  return { correct: exact, score: exact ? 1 : good / total };
}
