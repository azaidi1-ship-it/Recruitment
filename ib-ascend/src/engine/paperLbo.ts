import { pickOne as pick } from '../lib/random';

/**
 * Paper LBO scenarios: numbers chosen so every step is doable by hand,
 * under the standard simplifying rules stated to the user:
 *  - Interest is paid on the starting debt every year (no paydown benefit).
 *  - D&A equals capex and working capital doesn't change, so
 *    FCF = (EBITDA − D&A − interest) × (1 − tax).
 *  - EBITDA grows by the same dollar amount each year.
 *  - All free cash flow repays debt (any excess sits as cash).
 *  - No fees, no dividends; exit at the end of year 5.
 */

export const PAPER_LBO_YEARS = 5;

export interface PaperLboScenario {
  ebitda0: number;
  entryMultiple: number;
  leverage: number;
  interestRate: number;
  taxRate: number;
  /** Annual D&A (= capex), in $. */
  da: number;
  /** EBITDA increase per year, in $. */
  growthStep: number;
  exitMultiple: number;
}

export interface PaperLboStep {
  id: string;
  label: string;
  prompt: string;
  answer: number;
  unit: '$' | 'x' | '%';
  /** Accepted error: relative for $, absolute otherwise. */
  tolerance: { kind: 'rel' | 'abs'; value: number };
  /** How to get there, shown after answering. */
  working: string[];
}

export function generateScenario(rng: () => number): PaperLboScenario {
  for (let tries = 0; tries < 500; tries++) {
    const ebitda0 = pick([50, 80, 100, 120, 150, 200], rng);
    const entryMultiple = pick([8, 9, 10, 11, 12], rng);
    const leverage = pick([4, 5, 6].filter((l) => l <= entryMultiple - 3), rng);
    const s: PaperLboScenario = {
      ebitda0,
      entryMultiple,
      leverage,
      interestRate: pick([0.06, 0.08, 0.1], rng),
      taxRate: pick([0.25, 0.4], rng),
      da: ebitda0 * pick([0.1, 0.2], rng),
      growthStep: ebitda0 * pick([0.05, 0.1], rng),
      exitMultiple: entryMultiple + pick([-1, 0, 0, 1], rng),
    };
    // Keep the inputs whole dollars so the arithmetic stays pen-and-paper.
    const wholes = [s.da, s.growthStep, s.ebitda0 * s.leverage * s.interestRate];
    if (!wholes.every((x) => Math.abs(x - Math.round(x)) < 1e-9)) continue;
    const sol = solveScenario(s);
    const moic = sol.find((x) => x.id === 'moic')!.answer;
    const fcf = sol.find((x) => x.id === 'fcf')!.answer;
    if (moic >= 1.5 && moic <= 4 && fcf > 0) return s;
  }
  // Fallback (never reached in practice): a known-good scenario.
  return { ebitda0: 100, entryMultiple: 10, leverage: 5, interestRate: 0.08, taxRate: 0.25, da: 10, growthStep: 10, exitMultiple: 10 };
}

const money = (x: number) => `$${round(x).toLocaleString()}`;
const pct = (x: number) => `${round(x * 100)}%`;
function round(x: number, dp = 2): number {
  const f = 10 ** dp;
  return Math.round(x * f) / f;
}

/** The ordered steps and their answers. */
export function solveScenario(s: PaperLboScenario): PaperLboStep[] {
  const n = PAPER_LBO_YEARS;
  const ev = s.ebitda0 * s.entryMultiple;
  const debt = s.ebitda0 * s.leverage;
  const equity = ev - debt;
  const interest = debt * s.interestRate;
  const exitEbitda = s.ebitda0 + n * s.growthStep;
  // Σ EBITDA over years 1..n = n × EBITDA0 + step × n(n+1)/2
  const sumEbitda = n * s.ebitda0 + (s.growthStep * n * (n + 1)) / 2;
  const cumFcf = (sumEbitda - n * s.da - n * interest) * (1 - s.taxRate);
  const exitEv = exitEbitda * s.exitMultiple;
  const exitEquity = exitEv - (debt - cumFcf);
  const moic = exitEquity / equity;
  const irr = Math.pow(moic, 1 / n) - 1;
  const rel = { kind: 'rel' as const, value: 0.01 };

  return [
    {
      id: 'ev',
      label: 'Purchase price',
      prompt: 'What is the purchase enterprise value?',
      answer: ev,
      unit: '$',
      tolerance: rel,
      working: [`EBITDA × entry multiple = ${money(s.ebitda0)} × ${s.entryMultiple}x = ${money(ev)}`],
    },
    {
      id: 'equity',
      label: 'Equity check',
      prompt: 'How much equity does the sponsor put in?',
      answer: equity,
      unit: '$',
      tolerance: rel,
      working: [`Debt = ${money(s.ebitda0)} × ${s.leverage}x = ${money(debt)}`, `Equity = ${money(ev)} − ${money(debt)} = ${money(equity)}`],
    },
    {
      id: 'interest',
      label: 'Annual interest',
      prompt: 'What is the annual interest expense?',
      answer: interest,
      unit: '$',
      tolerance: rel,
      working: [`${money(debt)} × ${pct(s.interestRate)} = ${money(interest)} a year (on starting debt, per the rules)`],
    },
    {
      id: 'fcf',
      label: 'Cumulative FCF',
      prompt: `What is total free cash flow over the ${n} years?`,
      answer: cumFcf,
      unit: '$',
      tolerance: rel,
      working: [
        `EBITDA runs ${Array.from({ length: n }, (_, i) => round(s.ebitda0 + (i + 1) * s.growthStep)).join(', ')}: total ${money(sumEbitda)} (average × ${n})`,
        `Less D&A ${n} × ${money(s.da)} = ${money(n * s.da)} and interest ${n} × ${money(interest)} = ${money(n * interest)}`,
        `Pre-tax ${money(sumEbitda - n * s.da - n * interest)} × (1 − ${pct(s.taxRate)}) = ${money(cumFcf)}`,
        'D&A is added back and capex is the same amount, so they cancel.',
      ],
    },
    {
      id: 'exitEv',
      label: 'Exit value',
      prompt: 'What is the exit enterprise value?',
      answer: exitEv,
      unit: '$',
      tolerance: rel,
      working: [`Year-${n} EBITDA = ${money(s.ebitda0)} + ${n} × ${money(s.growthStep)} = ${money(exitEbitda)}`, `× ${s.exitMultiple}x = ${money(exitEv)}`],
    },
    {
      id: 'exitEquity',
      label: 'Exit equity',
      prompt: 'What is the sponsor’s equity worth at exit?',
      answer: exitEquity,
      unit: '$',
      tolerance: rel,
      working: [
        `Net debt at exit = ${money(debt)} − ${money(cumFcf)} = ${money(debt - cumFcf)}`,
        `Exit equity = ${money(exitEv)} − ${money(debt - cumFcf)} = ${money(exitEquity)}`,
      ],
    },
    {
      id: 'moic',
      label: 'MOIC',
      prompt: 'What is the multiple of invested capital?',
      answer: round(moic, 2),
      unit: 'x',
      tolerance: { kind: 'abs', value: 0.1 },
      working: [`${money(exitEquity)} / ${money(equity)} = ${round(moic, 2)}x`],
    },
    {
      id: 'irr',
      label: 'IRR',
      prompt: 'Roughly what IRR is that?',
      answer: round(irr * 100, 1),
      unit: '%',
      tolerance: { kind: 'abs', value: 3 },
      working: [
        'Over 5 years: 2x ≈ 15%, 2.5x ≈ 20%, 3x ≈ 25%, 3.5x ≈ 28%, 4x ≈ 32%. Interpolate.',
        `Exact: ${round(moic, 2)}^(1/5) − 1 = ${round(irr * 100, 1)}%`,
      ],
    },
  ];
}

export function checkStep(step: PaperLboStep, value: number): boolean {
  const err = Math.abs(value - step.answer);
  return step.tolerance.kind === 'rel' ? err <= Math.abs(step.answer) * step.tolerance.value + 1e-9 : err <= step.tolerance.value + 1e-9;
}

export function describeScenario(s: PaperLboScenario): string[] {
  return [
    `A sponsor buys a company with ${money(s.ebitda0)} of EBITDA at ${s.entryMultiple}x, using ${s.leverage}x debt at ${pct(s.interestRate)}.`,
    `EBITDA grows by ${money(s.growthStep)} a year. D&A is ${money(s.da)} a year and equals capex; working capital doesn’t change.`,
    `The tax rate is ${pct(s.taxRate)}. All free cash flow repays debt. The sponsor exits after ${PAPER_LBO_YEARS} years at ${s.exitMultiple}x EBITDA.`,
  ];
}
