import { describe, expect, it } from 'vitest';
import { computeStats, storyCoverage, type StatsInput } from '../stats';
import { SECTIONS } from '../../content/sections';
import type { SectionId } from '../../types/models';

function mastery(values: Partial<Record<SectionId, number>> = {}): Record<SectionId, number> {
  return Object.fromEntries(SECTIONS.map((s) => [s.id, values[s.id] ?? 0])) as Record<SectionId, number>;
}

const base: StatsInput = { mastery: mastery(), storyCoverage: 0, behavioralPractice: null, arcadeAccuracy: null };

describe('computeStats', () => {
  it('is all zeros for a new player', () => {
    expect(computeStats(base)).toEqual({ accounting: 0, valuation: 0, modeling: 0, speed: 0, marketIq: 0, polish: 0 });
  });

  it('drives Accounting from sections 1–2', () => {
    expect(computeStats({ ...base, mastery: mastery({ accounting: 1, walkthroughs: 1 }) }).accounting).toBe(100);
    expect(computeStats({ ...base, mastery: mastery({ accounting: 1 }) }).accounting).toBe(50);
  });

  it('splits Restructuring across Modeling, Valuation and Market IQ', () => {
    const s = computeStats({ ...base, mastery: mastery({ restructuring: 1 }) });
    expect(s.modeling).toBe(17); // 0.4 / 2.4
    expect(s.valuation).toBe(7); // 0.3 / 4.3
    expect(s.marketIq).toBe(23); // 0.3 / 1.3
  });

  it('blends Speed with arcade accuracy (70/30)', () => {
    expect(computeStats({ ...base, mastery: mastery({ 'mental-math': 1 }), arcadeAccuracy: 0 }).speed).toBe(70);
  });

  it('builds Polish from Fit mastery, story coverage and practice', () => {
    expect(computeStats({ ...base, mastery: mastery({ fit: 1 }) }).polish).toBe(50);
    expect(
      computeStats({ ...base, mastery: mastery({ fit: 1 }), storyCoverage: 1, behavioralPractice: 1 }).polish,
    ).toBe(100);
  });
});

describe('storyCoverage', () => {
  it('counts competencies with 2+ stories', () => {
    const stories = [
      { competencies: ['leadership' as const, 'teamwork' as const] },
      { competencies: ['leadership' as const] },
    ];
    expect(storyCoverage(stories, ['leadership', 'teamwork'])).toBe(0.5);
  });
});
