import { describe, expect, it } from 'vitest';
import { analyzeDelivery, hireVueScore } from '../hirevue/delivery';
import { buildHireVue } from '../hirevue/build';
import { HIREVUE_QUESTIONS } from '../../content/hirevue/questions';
import { mulberry32 } from '../../lib/random';

describe('analyzeDelivery', () => {
  it('counts words, pace and fillers', () => {
    const text = 'Um so I started Ayah Apparel in 2023, you know, and I basically built the model. '.repeat(3);
    const s = analyzeDelivery(text, 30, 90);
    expect(s.words).toBe(48);
    expect(s.wpm).toBe(96);
    expect(s.pace).toBe('slow');
    expect(s.fillers).toEqual([
      { phrase: 'um', count: 3 },
      { phrase: 'you know', count: 3 },
      { phrase: 'basically', count: 3 },
    ]);
    expect(s.fillerCount).toBe(9);
    expect(s.timeUsed).toBeCloseTo(1 / 3);
  });

  it('does not count words that merely contain a filler', () => {
    const s = analyzeDelivery('Umbrella under errand', 20, 60);
    expect(s.fillerCount).toBe(0);
  });

  it('withholds pace for very short answers', () => {
    expect(analyzeDelivery('Too short', 5, 60).wpm).toBeNull();
  });

  it('flags a fast pace', () => {
    const s = analyzeDelivery('word '.repeat(200), 60, 90);
    expect(s.pace).toBe('fast');
  });
});

describe('hireVueScore', () => {
  it('weights content 70% and delivery 30%', () => {
    expect(hireVueScore(1, ['answer-first', 'structure', 'camera', 'energy', 'close'])).toBe(1);
    expect(hireVueScore(1, [])).toBe(0.7);
    expect(hireVueScore(0.5, ['camera'])).toBeCloseTo(0.35 + 0.06);
  });
});

describe('buildHireVue', () => {
  it('builds a realistic mixed set: motivation/resume first, technical/markets/curveball last', () => {
    for (let seed = 0; seed < 20; seed++) {
      const qs = buildHireVue(HIREVUE_QUESTIONS, 'mixed', 5, mulberry32(seed));
      expect(qs).toHaveLength(5);
      expect(new Set(qs.map((q) => q.id)).size).toBe(5);
      expect(['motivation', 'resume']).toContain(qs[0]!.category);
      expect(['technical', 'markets', 'curveball']).toContain(qs[4]!.category);
      expect(qs.slice(2, 4).every((q) => q.category === 'behavioral')).toBe(true);
    }
  });

  it('always includes behavioral questions in short mixed sessions', () => {
    for (let seed = 0; seed < 20; seed++) {
      const qs = buildHireVue(HIREVUE_QUESTIONS, 'mixed', 3, mulberry32(seed));
      expect(qs.map((q) => q.category)[1]).toBe('behavioral');
    }
  });

  it('respects a focus', () => {
    const qs = buildHireVue(HIREVUE_QUESTIONS, 'behavioral', 7, mulberry32(1));
    expect(qs.every((q) => q.category === 'behavioral')).toBe(true);
    expect(qs).toHaveLength(7);
  });
});
