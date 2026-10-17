import { describe, expect, it } from 'vitest';
import { dcfSensitivity, runDcf, type DcfInputs } from '../models/dcf';
import { accretionSensitivity, runAccretion, type AccretionInputs } from '../models/accretion';
import { lboSensitivity, runLbo, type LboInputs } from '../models/lbo';

// Reference values computed independently (Python) from the same assumptions.

const dcf: DcfInputs = {
  revenue0: 1000,
  growth: [0.1, 0.1, 0.1, 0.1, 0.1],
  ebitdaMargin: 0.2,
  daPct: 0.05,
  capexPct: 0.05,
  nwcPct: 0.1,
  taxRate: 0.25,
  wacc: 0.1,
  terminal: { method: 'gordon', growth: 0.02 },
  netDebt: 500,
  shares: 100,
  midYear: false,
};

describe('runDcf', () => {
  it('matches a hand-built model', () => {
    const r = runDcf(dcf);
    expect(r.rows.map((x) => x.ufcf)).toEqual([expect.closeTo(113.75, 6), expect.closeTo(125.125, 6), expect.closeTo(137.6375, 4), expect.closeTo(151.4013, 3), expect.closeTo(166.5414, 3)]);
    expect(r.sumPv).toBeCloseTo(517.0455, 3);
    expect(r.terminalValue).toBeCloseTo(2123.4025, 3);
    expect(r.pvTerminal).toBeCloseTo(1318.4659, 3);
    expect(r.enterpriseValue).toBeCloseTo(1835.5114, 3);
    expect(r.perShare).toBeCloseTo(13.3551, 3);
    expect(r.tvShare).toBeCloseTo(1318.4659 / 1835.5114, 5);
  });

  it('applies mid-year discounting to the explicit years only', () => {
    const r = runDcf({ ...dcf, midYear: true });
    expect(r.sumPv).toBeCloseTo(542.2818, 3);
    expect(r.perShare).toBeCloseTo(13.6075, 3);
  });

  it('supports an exit multiple and reports the implied growth', () => {
    const r = runDcf({ ...dcf, terminal: { method: 'multiple', multiple: 10 } });
    expect(r.enterpriseValue).toBeCloseTo(2517.0455, 3);
    const back = runDcf({ ...dcf, terminal: { method: 'gordon', growth: r.impliedCheck } });
    expect(back.terminalValue).toBeCloseTo(r.terminalValue, 6);
  });

  it('flags WACC at or below growth', () => {
    expect(runDcf({ ...dcf, wacc: 0.02 }).error).toMatch(/WACC/);
    expect(dcfSensitivity(dcf, [0.02, 0.1], [0.02])).toEqual([[null], [expect.closeTo(13.3551, 3)]]);
  });

  it('falls as WACC rises', () => {
    const grid = dcfSensitivity(dcf, [0.09, 0.11], [0.02]);
    expect(grid[0]![0]!).toBeGreaterThan(grid[1]![0]!);
  });
});

const ad: AccretionInputs = {
  acquirerPrice: 50,
  acquirerShares: 100,
  acquirerNetIncome: 250,
  targetNetIncome: 40,
  purchasePrice: 600,
  pctCash: 0.3,
  pctDebt: 0.2,
  pctStock: 0.5,
  debtRate: 0.06,
  cashRate: 0.02,
  taxRate: 0.25,
  synergies: 10,
};

describe('runAccretion', () => {
  it('matches a hand-built example', () => {
    const r = runAccretion(ad);
    expect(r.newShares).toBeCloseTo(6);
    expect(r.afterTaxInterest).toBeCloseTo(5.4);
    expect(r.forgoneInterest).toBeCloseTo(2.7);
    expect(r.proFormaNetIncome).toBeCloseTo(289.4);
    expect(r.standaloneEps).toBe(2.5);
    expect(r.proFormaEps).toBeCloseTo(2.730189, 5);
    expect(r.accretion).toBeCloseTo(0.092075, 5);
    expect(r.breakevenSynergies).toBe(0);
  });

  it('computes breakeven synergies for a dilutive all-stock deal', () => {
    const r = runAccretion({ ...ad, pctCash: 0, pctDebt: 0, pctStock: 1, purchasePrice: 1000, synergies: 0 });
    // 20 new shares; pro forma NI 290 / 120 = 2.4167 < 2.50 → need (2.5 × 120 − 290) / 0.75 = 13.33
    expect(r.accretion).toBeLessThan(0);
    expect(r.breakevenSynergies).toBeCloseTo(13.3333, 3);
    const fixed = runAccretion({ ...ad, pctCash: 0, pctDebt: 0, pctStock: 1, purchasePrice: 1000, synergies: r.breakevenSynergies });
    expect(fixed.accretion).toBeCloseTo(0, 9);
  });

  it('shows accretion falling as more stock is used when the acquirer P/E is low', () => {
    const grid = accretionSensitivity(ad, [0, 1], [600]);
    expect(grid[0]![0]!).toBeGreaterThan(grid[1]![0]!);
  });
});

const lbo: LboInputs = {
  ebitda0: 100,
  growth: 0.05,
  entryMultiple: 10,
  exitMultiple: 10,
  leverage: 5,
  interestRate: 0.08,
  taxRate: 0.25,
  daPct: 0.1,
  capexPct: 0.1,
  nwcPct: 0,
  years: 5,
  sweep: 1,
  feesPct: 0.02,
};

describe('runLbo', () => {
  it('matches a hand-built model', () => {
    const r = runLbo(lbo);
    expect(r.equity0).toBe(520);
    expect(r.rows[0]).toMatchObject({ ebitda: 105, interest: 40, fcf: expect.closeTo(40.875, 6), debt: expect.closeTo(459.125, 6) });
    expect(r.rows[4]!.debt).toBeCloseTo(230.0846, 3);
    expect(r.exitEv).toBeCloseTo(1276.2816, 3);
    expect(r.exitEquity).toBeCloseTo(1046.197, 3);
    expect(r.moic).toBeCloseTo(2.011917, 5);
    expect(r.irr).toBeCloseTo(0.150064, 5);
  });

  it('builds cash instead of repaying when the sweep is off', () => {
    const r = runLbo({ ...lbo, sweep: 0 });
    expect(r.rows[4]!.debt).toBe(500);
    expect(r.rows[4]!.cash).toBeGreaterThan(0);
    // No paydown means more interest, so returns are lower.
    expect(r.irr).toBeLessThan(runLbo(lbo).irr);
  });

  it('flags a deal with no equity and fills sensitivity grids', () => {
    expect(runLbo({ ...lbo, leverage: 11, feesPct: 0 }).error).toMatch(/equity/);
    const grid = lboSensitivity(lbo, 'entryMultiple', [9, 10, 11], 'exitMultiple', [9, 10, 11]);
    expect(grid[1]![1]).toBeCloseTo(0.150064, 5);
    expect(grid[0]![2]!).toBeGreaterThan(grid[2]![0]!);
  });
});
