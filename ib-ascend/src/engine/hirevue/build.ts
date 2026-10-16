import type { HireVueCategory, HireVueQuestion } from '../../content/hirevue/types';
import { shuffle } from '../../lib/random';

export type HireVueFocus = 'mixed' | 'behavioral' | 'motivation-resume' | 'technical-markets';

export const FOCUS_LABEL: Record<HireVueFocus, string> = {
  mixed: 'Mixed (like a real bank HireVue)',
  behavioral: 'Behavioral only',
  'motivation-resume': 'Motivation and resume',
  'technical-markets': 'Technical and markets',
};

/** Category mix per focus, in the order a real HireVue usually runs. */
function plan(focus: HireVueFocus, count: number): HireVueCategory[][] {
  if (focus === 'behavioral') return Array.from({ length: count }, () => ['behavioral']);
  if (focus === 'motivation-resume') return Array.from({ length: count }, (_, i) => (i % 2 === 0 ? ['motivation', 'resume'] : ['resume', 'motivation']));
  if (focus === 'technical-markets') return Array.from({ length: count }, (_, i) => (i % 2 === 0 ? ['technical'] : ['markets', 'technical']));
  // Mixed: open with motivation/resume (two openers from 5 questions up), then behavioral,
  // and close with one technical/markets/curveball question.
  const slots: HireVueCategory[][] = [['resume', 'motivation']];
  if (count >= 5) slots.push(['motivation', 'resume']);
  while (slots.length < count - 1) slots.push(['behavioral']);
  if (count >= 2) slots.push(['technical', 'markets', 'curveball']);
  return slots.slice(0, count);
}

/** Pick `count` distinct questions matching the focus. Categories in each slot are tried in random order. */
export function buildHireVue(bank: HireVueQuestion[], focus: HireVueFocus, count: number, rng: () => number): HireVueQuestion[] {
  const used = new Set<string>();
  const pools = new Map<HireVueCategory, HireVueQuestion[]>();
  for (const q of shuffle(bank, rng)) {
    const list = pools.get(q.category) ?? [];
    list.push(q);
    pools.set(q.category, list);
  }
  const out: HireVueQuestion[] = [];
  for (const slot of plan(focus, count)) {
    for (const cat of shuffle(slot, rng)) {
      const q = (pools.get(cat) ?? []).find((x) => !used.has(x.id));
      if (q) {
        used.add(q.id);
        out.push(q);
        break;
      }
    }
  }
  return out;
}
