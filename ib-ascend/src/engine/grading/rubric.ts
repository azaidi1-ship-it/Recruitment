import type { RubricPoint } from '../../types/questions';

/**
 * Lowercase; keep letters, digits, %, & and decimal points; everything else
 * (including hyphens) becomes a space. Padded with spaces so whole-word
 * matching can use " term ".
 */
export function normalizeText(s: string): string {
  return ` ${s
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/(?<!\d)\.|\.(?!\d)/g, ' ')
    .replace(/[^a-z0-9%&.*\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()} `;
}

/**
 * A term matches if any of its "|"-separated alternatives appears as a whole
 * word or phrase. A trailing "*" matches a stem ("generat*" → generates,
 * generation). "non-cash" and "non cash" are equivalent.
 */
function termMatches(text: string, term: string): boolean {
  return term.split('|').some((alt) => {
    const stem = alt.trim().endsWith('*');
    const t = normalizeText(alt.replace(/\*$/, '')).trim();
    if (!t) return false;
    return stem ? text.includes(` ${t}`) : text.includes(` ${t} `);
  });
}

/** Rubric point ids whose keywords appear in `answer` (offline grading). */
export function matchRubric(rubric: RubricPoint[], answer: string): string[] {
  const text = normalizeText(answer);
  return rubric
    .filter((p) => p.keywords.some((group) => group.length > 0 && group.every((term) => termMatches(text, term))))
    .map((p) => p.id);
}

/** Weighted share of rubric points hit, 0–1. */
export function scoreRubric(rubric: RubricPoint[], hitIds: string[]): number {
  const total = rubric.reduce((n, p) => n + p.weight, 0);
  if (total <= 0) return 0;
  const hit = new Set(hitIds);
  return rubric.reduce((n, p) => n + (hit.has(p.id) ? p.weight : 0), 0) / total;
}

/** A verbal answer "passes" at 70% of the rubric. */
export const RUBRIC_PASS = 0.7;
