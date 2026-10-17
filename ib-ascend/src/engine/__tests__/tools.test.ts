import { describe, expect, it } from 'vitest';
import { ARCADE_DRILLS, isCorrect } from '../arcade';
import { PAPER_LBO_YEARS, checkStep, generateScenario, solveScenario } from '../paperLbo';
import { mulberry32 } from '../../lib/random';

describe('paper LBO', () => {
  it('solves the textbook case', () => {
    const steps = solveScenario({ ebitda0: 100, entryMultiple: 10, leverage: 5, interestRate: 0.08, taxRate: 0.25, da: 10, growthStep: 10, exitMultiple: 10 });
    const a = Object.fromEntries(steps.map((s) => [s.id, s.answer]));
    // EV 1,000; equity 500; interest 40; EBITDA 110..150 sums to 650;
    // FCF (650 − 50 − 200) × 0.75 = 300; exit 150 × 10 = 1,500; equity 1,500 − 200 = 1,300.
    expect(a).toEqual({ ev: 1000, equity: 500, interest: 40, fcf: 300, exitEv: 1500, exitEquity: 1300, moic: 2.6, irr: 21.1 });
  });

  it('generates hand-solvable scenarios with sensible returns', () => {
    const rng = mulberry32(7);
    for (let k = 0; k < 300; k++) {
      const s = generateScenario(rng);
      const steps = solveScenario(s);
      const moic = steps.find((x) => x.id === 'moic')!.answer;
      expect(moic).toBeGreaterThanOrEqual(1.5);
      expect(moic).toBeLessThanOrEqual(4);
      expect(s.leverage).toBeLessThanOrEqual(s.entryMultiple - 3);
      // Entry numbers are whole dollars.
      for (const id of ['ev', 'equity', 'exitEv']) expect(Number.isInteger(steps.find((x) => x.id === id)!.answer)).toBe(true);
      expect(steps).toHaveLength(8);
    }
    expect(PAPER_LBO_YEARS).toBe(5);
  });

  it('checks answers within tolerance', () => {
    const [ev, , , , , , moic, irr] = solveScenario({ ebitda0: 100, entryMultiple: 10, leverage: 5, interestRate: 0.08, taxRate: 0.25, da: 10, growthStep: 10, exitMultiple: 10 });
    expect(checkStep(ev!, 1005)).toBe(true);
    expect(checkStep(ev!, 1020)).toBe(false);
    expect(checkStep(moic!, 2.5)).toBe(true);
    expect(checkStep(irr!, 20)).toBe(true);
    expect(checkStep(irr!, 15)).toBe(false);
  });
});

describe('arcade drills', () => {
  it('generate well-formed problems for every drill', () => {
    const rng = mulberry32(42);
    for (const d of ARCADE_DRILLS) {
      for (let k = 0; k < 300; k++) {
        const p = d.generate(rng);
        expect(p.prompt.length).toBeGreaterThan(3);
        expect(Number.isFinite(p.answer)).toBe(true);
        expect(p.tolerance).toBeGreaterThanOrEqual(0);
        expect(isCorrect(p, p.answer)).toBe(true);
      }
    }
  });

  it('builds prompts whose arithmetic matches the answer', () => {
    const rng = mulberry32(3);
    const drill = (id: string) => ARCADE_DRILLS.find((d) => d.id === id)!;
    for (let k = 0; k < 300; k++) {
      const m = drill('multiplication').generate(rng);
      const [a, b] = m.prompt.split(' × ').map(Number);
      expect(a! * b!).toBe(m.answer);
      const dv = drill('division').generate(rng);
      if (dv.prompt.includes('÷')) {
        const [x, y] = dv.prompt.split(' ÷ ').map((s) => Number(s.replace(/,/g, '')));
        expect(x! / y!).toBe(dv.answer);
      }
      const pc = drill('percentages').generate(rng);
      const of = pc.prompt.match(/^([\d.]+)% of ([\d,]+)$/);
      if (of) expect((Number(of[1]) * Number(of[2]!.replace(/,/g, ''))) / 100).toBeCloseTo(pc.answer, 9);
    }
  });
});
