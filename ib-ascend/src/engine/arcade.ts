import { pickOne as pick, randInt } from '../lib/random';

/**
 * Mental Math Arcade: timed sprints of randomly generated problems. Every
 * generator builds the numbers first and the prompt from them, so answers are
 * exact by construction.
 */

export interface ArcadeProblem {
  prompt: string;
  answer: number;
  /** Accepted absolute error. */
  tolerance: number;
  unit?: string;
  /** The shortcut, shown after a miss. */
  hint: string;
}

export interface ArcadeDrill {
  id: string;
  title: string;
  description: string;
  seconds: number;
  generate: (rng: () => number) => ArcadeProblem;
}

const fmt = (x: number) => (Number.isInteger(x) ? x.toLocaleString('en-US') : String(x));

function percentages(rng: () => number): ArcadeProblem {
  if (rng() < 0.6) {
    const p = pick([5, 10, 12.5, 15, 20, 25, 30, 40, 60, 75], rng);
    const base = p === 12.5 ? 8 * randInt(2, 30, rng) : p === 15 ? 20 * randInt(1, 25, rng) : 20 * randInt(1, 40, rng);
    const answer = (p * base) / 100;
    return { prompt: `${p}% of ${fmt(base)}`, answer, tolerance: 0, hint: p === 12.5 ? '12.5% = 1/8' : `Take 10% (${fmt(base / 10)}) and scale` };
  }
  const from = pick([40, 50, 80, 120, 160, 200, 250, 400], rng);
  const change = pick([-50, -25, -20, -10, 10, 20, 25, 50, 75], rng);
  const to = (from * (100 + change)) / 100;
  return { prompt: `% change from ${fmt(from)} to ${fmt(to)}`, answer: change, tolerance: 0, unit: '%', hint: `(${fmt(to)} − ${fmt(from)}) / ${fmt(from)}` };
}

function multiplication(rng: () => number): ArcadeProblem {
  const form = randInt(0, 3, rng);
  if (form === 0) {
    const a = randInt(12, 99, rng);
    const b = randInt(3, 9, rng);
    return { prompt: `${a} × ${b}`, answer: a * b, tolerance: 0, hint: `${Math.floor(a / 10) * 10} × ${b} + ${a % 10} × ${b}` };
  }
  if (form === 1) {
    const mid = pick([20, 30, 40, 50, 60, 70, 100], rng);
    const d = randInt(1, 4, rng);
    return { prompt: `${mid - d} × ${mid + d}`, answer: mid * mid - d * d, tolerance: 0, hint: `${mid}² − ${d}² (difference of squares)` };
  }
  if (form === 2) {
    const a = randInt(4, 48, rng) * 2;
    return { prompt: `${a} × 25`, answer: a * 25, tolerance: 0, hint: '× 25 = × 100 ÷ 4' };
  }
  const a = randInt(12, 95, rng);
  return { prompt: `${a} × 11`, answer: a * 11, tolerance: 0, hint: `${a} × 10 + ${a}` };
}

function division(rng: () => number): ArcadeProblem {
  if (rng() < 0.7) {
    const d = pick([4, 6, 7, 8, 12, 15, 16, 25], rng);
    const q = randInt(3, 40, rng);
    return { prompt: `${fmt(q * d)} ÷ ${d}`, answer: q, tolerance: 0, hint: `${d} × ${q} = ${fmt(q * d)}` };
  }
  const [frac, pct] = pick(
    [
      ['1/8', 12.5],
      ['3/8', 37.5],
      ['1/6', 16.7],
      ['5/6', 83.3],
      ['1/7', 14.3],
      ['1/9', 11.1],
      ['1/12', 8.3],
      ['1/16', 6.25],
      ['2/3', 66.7],
      ['5/8', 62.5],
    ] as const,
    rng,
  );
  return { prompt: `${frac} as a % (1 dp)`, answer: pct, tolerance: 0.1, unit: '%', hint: `${frac} ≈ ${pct}%` };
}

const IRR_TABLE: [moic: number, years: number, irr: number][] = [
  [1.5, 3, 14.5],
  [2, 3, 26],
  [2.5, 3, 35.7],
  [3, 3, 44.2],
  [1.5, 5, 8.4],
  [2, 5, 14.9],
  [2.5, 5, 20.1],
  [3, 5, 24.6],
  [3.5, 5, 28.5],
  [4, 5, 32],
  [2, 4, 18.9],
  [3, 4, 31.6],
];

function returns(rng: () => number): ArcadeProblem {
  if (rng() < 0.7) {
    const [m, y, irr] = pick(IRR_TABLE, rng);
    return { prompt: `IRR of ${m}x over ${y} years (±2.5%)`, answer: irr, tolerance: 2.5, unit: '%', hint: `${m}^(1/${y}) − 1 ≈ ${irr}%` };
  }
  const r = pick([6, 8, 9, 12, 18, 24], rng);
  return { prompt: `Rule of 72: years to double at ${r}%`, answer: 72 / r, tolerance: 0.1, unit: 'yrs', hint: `72 / ${r}` };
}

function valuation(rng: () => number): ArcadeProblem {
  const ebitda = pick([40, 50, 60, 80, 120, 150], rng);
  const mult = randInt(6, 12, rng);
  const ev = ebitda * mult;
  const form = randInt(0, 2, rng);
  if (form === 0) return { prompt: `EBITDA ${ebitda} at ${mult}x: EV?`, answer: ev, tolerance: 0, hint: `${ebitda} × ${mult}` };
  const netDebt = pick([50, 100, 150, 200], rng);
  const equity = ev - netDebt;
  if (form === 1) return { prompt: `EV ${fmt(ev)}, net debt ${netDebt}: equity value?`, answer: equity, tolerance: 0, hint: 'Equity = EV − net debt' };
  const shares = pick([10, 20, 25, 40, 50], rng);
  return {
    prompt: `EBITDA ${ebitda} × ${mult}x, net debt ${netDebt}, ${shares} shares: price per share?`,
    answer: Math.round((equity / shares) * 100) / 100,
    tolerance: 0.05,
    unit: '$',
    hint: `(${fmt(ev)} − ${netDebt}) / ${shares}`,
  };
}

const BASE: ArcadeDrill[] = [
  { id: 'percentages', title: 'Percentages', description: 'x% of y and percentage changes.', seconds: 60, generate: percentages },
  { id: 'multiplication', title: 'Multiplication', description: 'Splits, ×11, ×25 and differences of squares.', seconds: 60, generate: multiplication },
  { id: 'division', title: 'Division & fractions', description: 'Clean divisions and fraction-to-percent anchors.', seconds: 60, generate: division },
  { id: 'returns', title: 'IRR & doubling', description: 'MOIC-to-IRR rules of thumb and the rule of 72.', seconds: 60, generate: returns },
  { id: 'valuation', title: 'Valuation chains', description: 'EV, equity value and share price from a multiple.', seconds: 90, generate: valuation },
];

export const ARCADE_DRILLS: ArcadeDrill[] = [
  ...BASE,
  {
    id: 'mixed',
    title: 'Mixed sprint',
    description: 'Everything above, shuffled.',
    seconds: 90,
    generate: (rng) => pick(BASE, rng).generate(rng),
  },
];

export function isCorrect(p: ArcadeProblem, value: number): boolean {
  return Math.abs(value - p.answer) <= p.tolerance + 1e-9;
}
