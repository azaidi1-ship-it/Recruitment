import { describe, expect, it } from 'vitest';
import { SECTIONS, SECTION_BY_ID } from '../../content/sections';
import { emptySectionProgress } from '../../db/seed';
import { isSectionUnlocked, missingPrerequisites, sectionSteps, type ProgressMap } from '../unlocks';
import type { SectionId, SectionProgress } from '../../types/models';

function progress(passed: SectionId[] = []): ProgressMap {
  const map = Object.fromEntries(SECTIONS.map((s) => [s.id, emptySectionProgress(s.id)])) as ProgressMap;
  for (const id of passed) map[id] = { ...map[id], postQuizPassedAt: '2026-10-16T00:00:00.000Z' };
  return map;
}

const unlocked = (p: ProgressMap) => SECTIONS.filter((s) => isSectionUnlocked(s, p)).map((s) => s.id);

describe('section unlocks', () => {
  it('opens Accounting and the always-open sections at the start', () => {
    expect(unlocked(progress())).toEqual(['accounting', 'mental-math', 'markets', 'fit']);
  });

  it('opens Comps and DCF together after Valuation', () => {
    const u = unlocked(progress(['accounting', 'walkthroughs', 'ev-equity', 'valuation']));
    expect(u).toContain('comps');
    expect(u).toContain('dcf');
    expect(u).not.toContain('mna');
  });

  it('requires BOTH Comps and DCF for M&A', () => {
    const chain: SectionId[] = ['accounting', 'walkthroughs', 'ev-equity', 'valuation', 'comps'];
    expect(missingPrerequisites(SECTION_BY_ID.mna, progress(chain))).toEqual(['dcf']);
    expect(unlocked(progress([...chain, 'dcf']))).toContain('mna');
  });
});

describe('sectionSteps', () => {
  const counts = { lessons: 3, examples: 5 };
  const p = (patch: Partial<SectionProgress> = {}): SectionProgress => ({ ...emptySectionProgress('dcf'), ...patch });

  it('starts with only the pre-quiz available', () => {
    expect(sectionSteps(p(), counts)).toEqual({
      preQuiz: 'available',
      reading: 'locked',
      examples: 'locked',
      postQuiz: 'locked',
      mock: 'locked',
    });
  });

  it('walks pre-quiz → reading → examples → post-quiz → mock in order', () => {
    expect(sectionSteps(p({ preQuizScore: 0.5 }), counts).reading).toBe('available');
    expect(sectionSteps(p({ preQuizScore: 0.5 }), counts).examples).toBe('locked');
    const read = p({ preQuizScore: 0.5, lessonsRead: ['a', 'b', 'c'] });
    expect(sectionSteps(read, counts)).toMatchObject({ reading: 'done', examples: 'available', postQuiz: 'locked' });
    const ex = { ...read, examplesCompleted: ['1', '2', '3', '4', '5'] };
    expect(sectionSteps(ex, counts).postQuiz).toBe('available');
    const passed = { ...ex, postQuizPassedAt: '2026-10-16T00:00:00.000Z' };
    expect(sectionSteps(passed, counts)).toMatchObject({ postQuiz: 'done', mock: 'available' });
  });

  it('fast-tracks straight to the post-quiz after a 90%+ pre-quiz', () => {
    expect(sectionSteps(p({ preQuizScore: 0.92, fastTracked: true }), counts)).toMatchObject({
      reading: 'skipped',
      examples: 'skipped',
      postQuiz: 'available',
      mock: 'locked',
    });
  });
});
