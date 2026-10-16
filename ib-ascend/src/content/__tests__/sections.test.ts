import { describe, expect, it } from 'vitest';
import { SECTIONS } from '../sections';
import { SEED_RESUME } from '../resume/resume';
import type { SectionId } from '../../types/models';

describe('skill tree', () => {
  it('has 12 sections numbered 1–12 with unique ids', () => {
    expect(SECTIONS.map((s) => s.number)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    expect(new Set(SECTIONS.map((s) => s.id)).size).toBe(12);
  });

  it('encodes 1 → 2 → 3 → 4 → (5, 6) → 7 → 8 → 9 with 10–12 always open', () => {
    const pre = Object.fromEntries(SECTIONS.map((s) => [s.number, s.prerequisites]));
    const num = Object.fromEntries(SECTIONS.map((s) => [s.id, s.number])) as Record<SectionId, number>;
    const asNums = (n: number) => (pre[n] ?? []).map((id: SectionId) => num[id]).sort();
    expect(asNums(1)).toEqual([]);
    expect(asNums(2)).toEqual([1]);
    expect(asNums(3)).toEqual([2]);
    expect(asNums(4)).toEqual([3]);
    expect(asNums(5)).toEqual([4]);
    expect(asNums(6)).toEqual([4]);
    expect(asNums(7)).toEqual([5, 6]);
    expect(asNums(8)).toEqual([7]);
    expect(asNums(9)).toEqual([8]);
    for (const n of [10, 11, 12]) {
      const s = SECTIONS.find((x) => x.number === n);
      expect(s?.alwaysOpen).toBe(true);
      expect(s?.prerequisites).toEqual([]);
    }
  });

  it('only references sections that come earlier (no cycles)', () => {
    const order = new Map(SECTIONS.map((s) => [s.id, s.number]));
    for (const s of SECTIONS) {
      for (const p of s.prerequisites) expect(order.get(p)!).toBeLessThan(s.number);
    }
  });

  it('gives every section subtopics, a stat mapping and a positive interview weight', () => {
    for (const s of SECTIONS) {
      expect(s.subtopics.length).toBeGreaterThanOrEqual(4);
      expect(new Set(s.subtopics.map((t) => t.id)).size).toBe(s.subtopics.length);
      expect(Object.keys(s.statWeights).length).toBeGreaterThan(0);
      expect(s.interviewWeight).toBeGreaterThan(0);
    }
  });
});

describe('seed resume', () => {
  it('has unique item ids and the confirmed corrections', () => {
    const ids = SEED_RESUME.items.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
    const stratus = SEED_RESUME.items.find((i) => i.id === 'exp-stratus');
    expect(stratus?.confirmedNotes?.join(' ')).toMatch(/closed/);
    expect(SEED_RESUME.rawText).toContain('Stratus Labs');
  });
});
