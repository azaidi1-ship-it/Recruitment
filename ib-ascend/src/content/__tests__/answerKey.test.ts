import { describe, expect, it } from 'vitest';
import { allSectionContent } from '../registry';
import { HIREVUE_QUESTIONS } from '../hirevue/questions';
import { grade } from '../../engine/grading';
import { matchRubric } from '../../engine/grading/rubric';
import type { Question, QuestionResponse } from '../../types/questions';

/** The answer an expert would give, expressed as a response. */
function correctResponse(q: Question): QuestionResponse {
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

function wrongResponse(q: Question): QuestionResponse {
  switch (q.type) {
    case 'mcq':
      return { type: 'mcq', optionId: q.options.find((o) => !o.correct)!.id };
    case 'numeric':
      return { type: 'numeric', value: q.answer + Math.max(1, Math.abs(q.answer) * 0.2) };
    case 'rapidFire':
      return { type: 'rapidFire', value: q.answer + Math.max(1, Math.abs(q.answer) * 0.2) };
    case 'ordering':
      return { type: 'ordering', order: [...q.items.map((i) => i.id)].reverse() };
    case 'walkthrough':
      return { type: 'walkthrough', values: Object.fromEntries(q.lines.map((l) => [l.key, l.expected + 1])) };
    case 'freeText':
      return { type: 'freeText', text: 'I don’t know.', hitPointIds: [] };
  }
}

const all: Question[] = [...allSectionContent().flatMap(([, c]) => c.questions), ...HIREVUE_QUESTIONS];

describe('answer key: every question grades its own correct answer as right and a wrong answer as wrong', () => {
  it.each(all.map((q) => [q.id, q] as const))('%s', (_id, q) => {
    expect(grade(q, correctResponse(q), 1000)).toMatchObject({ correct: true, score: 1 });
    expect(grade(q, wrongResponse(q), 1000).correct).toBe(false);
  });
});
