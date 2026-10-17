/**
 * Takes every quiz with its own answer key: the stored answer must earn full
 * marks through the real grader, and obvious wrong answers (a sign flip, an
 * order off by 10%) must not.
 */
import { describe, expect, it } from 'vitest';
import { getSectionContent } from '../registry';
import { SECTIONS } from '../sections';
import { ALL_CURVEBALLS } from '../superday/curveballs';
import { grade } from '../../engine/grading';
import { matchRubric, scoreRubric, RUBRIC_PASS } from '../../engine/grading/rubric';
import type { Question, QuestionResponse } from '../../types/questions';

const ALL: Question[] = [...SECTIONS.flatMap((s) => getSectionContent(s.id).questions), ...ALL_CURVEBALLS];

function keyResponse(q: Question): QuestionResponse {
  switch (q.type) {
    case 'mcq':
      return { type: 'mcq', optionId: q.options.find((o) => o.correct)!.id };
    case 'numeric':
      return { type: 'numeric', value: q.answer };
    case 'rapidFire':
      return { type: 'rapidFire', value: q.answer };
    case 'ordering':
      return { type: 'ordering', order: q.items.map((i) => i.id) };
    case 'walkthrough':
      return { type: 'walkthrough', values: Object.fromEntries(q.lines.map((l) => [l.key, l.expected])) };
    case 'freeText':
      return { type: 'freeText', text: q.modelAnswer, hitPointIds: matchRubric(q.rubric, q.modelAnswer) };
  }
}

describe('answer keys', () => {
  it(`covers every question (${ALL.length})`, () => {
    expect(ALL.length).toBeGreaterThan(550);
  });

  it.each(ALL.map((q) => [q.id, q] as const))('%s: the key earns full marks', (_id, q) => {
    const g = grade(q, keyResponse(q), 0);
    if (q.type === 'freeText') expect(g.score).toBeGreaterThanOrEqual(RUBRIC_PASS);
    else expect(g.score).toBe(1);
    expect(g.correct).toBe(true);
  });

  it('rejects a sign flip and a 10% miss on every numeric and rapid-fire answer', () => {
    const loose: string[] = [];
    for (const q of ALL) {
      if (q.type !== 'numeric' && q.type !== 'rapidFire') continue;
      if (q.answer === 0) continue;
      const r = (v: number) => grade(q, { type: q.type, value: v } as QuestionResponse, 0).correct;
      if (r(-q.answer) || r(q.answer * 1.1) || r(q.answer * 0.9)) loose.push(`${q.id} (${q.answer}, ${JSON.stringify(q.tolerance)})`);
    }
    expect(loose).toEqual([]);
  });

  it('gives rapid-fire questions a realistic time limit', () => {
    for (const q of ALL) if (q.type === 'rapidFire') expect(q.timeLimitSec, q.id).toBeGreaterThanOrEqual(5);
  });

  it('scores a reversed order below full marks on every ordering question', () => {
    for (const q of ALL) {
      if (q.type !== 'ordering') continue;
      expect(grade(q, { type: 'ordering', order: q.items.map((i) => i.id).reverse() }).score, q.id).toBeLessThan(1);
    }
  });

  it('marks a walk-through wrong when any single line is wrong', () => {
    for (const q of ALL) {
      if (q.type !== 'walkthrough') continue;
      for (const l of q.lines) {
        const values = Object.fromEntries(q.lines.map((x) => [x.key, x.expected]));
        values[l.key] = l.expected + 1;
        expect(grade(q, { type: 'walkthrough', values }).correct, `${q.id} ${l.key}`).toBe(false);
      }
    }
  });

  it('does not let an empty free-text answer pass', () => {
    for (const q of ALL) if (q.type === 'freeText') expect(scoreRubric(q.rubric, matchRubric(q.rubric, ''))).toBe(0);
  });
});
