import { describe, expect, it } from 'vitest';
import { HIREVUE_QUESTIONS } from '../hirevue/questions';
import { questionSchema } from '../schema';
import { SECTION_BY_ID } from '../sections';
import { SEED_RESUME } from '../resume/resume';
import { matchRubric } from '../../engine/grading/rubric';

describe('HireVue bank', () => {
  it('has unique ids and 30+ questions across every category', () => {
    expect(HIREVUE_QUESTIONS.length).toBeGreaterThanOrEqual(30);
    expect(new Set(HIREVUE_QUESTIONS.map((q) => q.id)).size).toBe(HIREVUE_QUESTIONS.length);
    for (const c of ['motivation', 'resume', 'behavioral', 'technical', 'markets', 'curveball']) {
      expect(HIREVUE_QUESTIONS.some((q) => q.category === c), c).toBe(true);
    }
  });

  it.each(HIREVUE_QUESTIONS.map((q) => [q.id, q] as const))('%s is valid', (_id, q) => {
    expect(questionSchema.safeParse(q).success).toBe(true);
    expect(SECTION_BY_ID[q.sectionId].subtopics.some((s) => s.id === q.subtopic)).toBe(true);
    expect(q.answerSec).toBeGreaterThanOrEqual(45);
    for (const id of q.resumeItems ?? []) expect(SEED_RESUME.items.some((i) => i.id === id), id).toBe(true);
    expect(matchRubric(q.rubric, q.modelAnswer).sort(), 'outline hits its own rubric').toEqual(q.rubric.map((p) => p.id).sort());
  });
});
