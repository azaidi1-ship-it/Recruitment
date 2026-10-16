import { describe, expect, it } from 'vitest';
import { grade, correctAnswerText, responseText } from '../grading';
import { withinTolerance } from '../grading/numeric';
import { gradeOrdering } from '../grading/ordering';
import { matchRubric, scoreRubric } from '../grading/rubric';
import { balanceCheck } from '../grading/walkthrough';
import { parseNumberInput } from '../../lib/numberInput';
import type { FreeTextQuestion, MultipleChoiceQuestion, RapidFireQuestion, WalkthroughQuestion } from '../../types/questions';

const base = { sectionId: 'accounting' as const, subtopic: 'linkages', difficulty: 'basic' as const, prompt: 'p', explanation: 'e', pools: ['post' as const] };

describe('parseNumberInput', () => {
  it.each([
    ['85', 85],
    ['1,250', 1250],
    ['$1,250.5', 1250.5],
    ['-40', -40],
    ['(40)', -40],
    ['12.5%', 12.5],
    ['3.5x', 3.5],
    ['+10', 10],
    ['.5', 0.5],
  ])('%s → %d', (input, out) => expect(parseNumberInput(input)).toBe(out));

  it.each(['', '   ', 'abc', '1.2.3', '--4'])('rejects %j', (input) => expect(parseNumberInput(input)).toBeNull());
});

describe('numeric tolerance', () => {
  it('handles percentage and absolute tolerances', () => {
    expect(withinTolerance(101, 100, { kind: 'pct', value: 1 })).toBe(true);
    expect(withinTolerance(101.1, 100, { kind: 'pct', value: 1 })).toBe(false);
    expect(withinTolerance(-99.5, -100, { kind: 'pct', value: 1 })).toBe(true);
    expect(withinTolerance(60.5, 60, { kind: 'abs', value: 0.5 })).toBe(true);
    expect(withinTolerance(0.1 + 0.2, 0.3, { kind: 'abs', value: 0 })).toBe(true);
    expect(withinTolerance(null, 0, { kind: 'abs', value: 1 })).toBe(false);
  });
});

describe('ordering', () => {
  it('is correct only when exact; partial credit by pairs in order', () => {
    expect(gradeOrdering(['a', 'b', 'c'], ['a', 'b', 'c'])).toEqual({ correct: true, score: 1 });
    expect(gradeOrdering(['a', 'b', 'c'], ['b', 'a', 'c'])).toEqual({ correct: false, score: 2 / 3 });
    expect(gradeOrdering(['a', 'b', 'c'], ['c', 'b', 'a'])).toEqual({ correct: false, score: 0 });
  });
});

describe('walkthrough', () => {
  const q: WalkthroughQuestion = {
    ...base,
    id: 'w',
    type: 'walkthrough',
    taxRate: 0.25,
    lines: [
      { statement: 'IS', key: 'is.ni', label: 'Net income', expected: 45 },
      { statement: 'BS', key: 'bs.cash', label: 'Cash', expected: 85, side: 'A' },
      { statement: 'BS', key: 'bs.inv', label: 'Inventory', expected: -40, side: 'A' },
      { statement: 'BS', key: 'bs.re', label: 'Retained earnings', expected: 45, side: 'LE' },
      { statement: 'BS', key: 'bs.debt', label: 'Debt', expected: 0, side: 'LE' },
    ],
  };

  it('checks each line, treating blanks as 0', () => {
    const r = grade(q, { type: 'walkthrough', values: { 'is.ni': 45, 'bs.cash': 85, 'bs.inv': -40, 'bs.re': 40 } });
    expect(r.correct).toBe(false);
    expect(r.score).toBeCloseTo(4 / 5);
    expect(r.lines).toEqual({ 'is.ni': true, 'bs.cash': true, 'bs.inv': true, 'bs.re': false, 'bs.debt': true });
  });

  it('reports whether the balance sheet balances', () => {
    expect(balanceCheck(q, { 'bs.cash': 85, 'bs.inv': -40, 'bs.re': 45 })).toEqual({ assets: 45, liabEquity: 45, balanced: true });
    expect(balanceCheck(q, { 'bs.cash': 85 }).balanced).toBe(false);
  });
});

describe('rubric', () => {
  const rubric = [
    { id: 'ni', point: 'NI flows to CFS', keywords: [['net income', 'cash flow'], ['ni', 'cfs']], weight: 2 },
    { id: 'da', point: 'Add back D&A', keywords: [['add back', 'depreciation|d&a']], weight: 1 },
    { id: 're', point: 'Retained earnings', keywords: [['retained earnings']], weight: 1 },
  ];

  it('matches keyword groups (all terms in a group, any alternative in a term)', () => {
    expect(matchRubric(rubric, 'Net income flows to the top of the cash flow statement and you add back D&A.')).toEqual(['ni', 'da']);
    expect(matchRubric(rubric, 'NI goes to the CFS, then retained earnings')).toEqual(['ni', 're']);
    expect(matchRubric(rubric, 'Something unrelated')).toEqual([]);
  });

  it('scores by weight', () => {
    expect(scoreRubric(rubric, ['ni', 'da'])).toBeCloseTo(0.75);
  });

  it('grades free text on the confirmed points, passing at 70%', () => {
    const q: FreeTextQuestion = { ...base, id: 'f', type: 'freeText', rubric, modelAnswer: 'm' };
    expect(grade(q, { type: 'freeText', text: 'x', hitPointIds: ['ni', 'da'] })).toEqual({ correct: true, score: 0.75 });
    expect(grade(q, { type: 'freeText', text: 'x', hitPointIds: ['da', 're'] }).correct).toBe(false);
    expect(grade(q, { type: 'freeText', text: 'x', selfScore: 1, hitPointIds: [] }).score).toBe(1);
  });
});

describe('grade dispatch', () => {
  const mcq: MultipleChoiceQuestion = {
    ...base,
    id: 'm',
    type: 'mcq',
    options: [
      { id: 'a', text: 'Right', correct: true, explanation: 'x' },
      { id: 'b', text: 'Wrong', explanation: 'y' },
    ],
  };

  it('grades MCQ and describes answers', () => {
    expect(grade(mcq, { type: 'mcq', optionId: 'a' }).correct).toBe(true);
    expect(grade(mcq, { type: 'mcq', optionId: 'b' }).correct).toBe(false);
    expect(correctAnswerText(mcq)).toBe('Right');
    expect(responseText(mcq, { type: 'mcq', optionId: 'b' })).toBe('Wrong');
  });

  it('fails rapid-fire answers given after the time limit', () => {
    const rf: RapidFireQuestion = { ...base, id: 'r', type: 'rapidFire', answer: 200, tolerance: { kind: 'abs', value: 0 }, timeLimitSec: 15 };
    expect(grade(rf, { type: 'rapidFire', value: 200 }, 10_000).correct).toBe(true);
    expect(grade(rf, { type: 'rapidFire', value: 200 }, 16_000)).toEqual({ correct: false, score: 0, timedOut: true });
  });

  it('rejects a response of the wrong type', () => {
    expect(grade(mcq, { type: 'numeric', value: 1 }).correct).toBe(false);
  });
});

describe('rubric word boundaries', () => {
  const rubric = [
    { id: 'two', point: 'IS + BS', keywords: [['is', 'bs']], weight: 1 },
    { id: 'gen', point: 'generation', keywords: [['generat*']], weight: 1 },
    { id: 'nc', point: 'non-cash', keywords: [['non-cash']], weight: 1 },
  ];
  it('does not match words inside other words, supports stems and hyphen variants', () => {
    expect(matchRubric(rubric, 'This absorbs value')).toEqual([]);
    expect(matchRubric(rubric, 'Pick the IS and the BS. It generates cash; add non cash items.')).toEqual(['two', 'gen', 'nc']);
  });
});
