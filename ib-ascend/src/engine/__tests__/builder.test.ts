import { describe, expect, it } from 'vitest';
import { buildMistakeQuiz, buildMock, buildPostQuiz, buildPreQuiz, timeBudgetSec } from '../quiz/builder';
import { mulberry32 } from '../../lib/random';
import type { Difficulty } from '../../types/models';
import type { MultipleChoiceQuestion, QuestionPool } from '../../types/questions';

function q(id: string, subtopic: string, difficulty: Difficulty, pools: QuestionPool[], followUps?: string[]): MultipleChoiceQuestion {
  return {
    id,
    sectionId: 'accounting',
    subtopic,
    difficulty,
    prompt: id,
    explanation: '',
    pools,
    followUps,
    type: 'mcq',
    options: [{ id: 'a', text: 'a', correct: true, explanation: '' }],
  };
}

const subs = ['s1', 's2', 's3', 's4'];
const diffs: Difficulty[] = ['basic', 'intermediate', 'advanced', 'elite'];
const bank = Array.from({ length: 40 }, (_, i) =>
  q(`q${i}`, subs[i % 4]!, diffs[Math.floor(i / 10)]!, ['pre', 'post', 'mock']),
);

describe('buildPreQuiz', () => {
  it('draws up to 12, covers every subtopic and orders easiest first', () => {
    const quiz = buildPreQuiz(bank, mulberry32(1));
    expect(quiz.items).toHaveLength(12);
    expect(new Set(quiz.items.map((i) => i.question.subtopic)).size).toBe(4);
    const ranks = quiz.items.map((i) => diffs.indexOf(i.question.difficulty));
    expect([...ranks].sort((a, b) => a - b)).toEqual(ranks);
    expect(quiz.timeLimitSec).toBeNull();
  });

  it('only uses the pre pool', () => {
    const small = [q('a', 's1', 'basic', ['pre']), q('b', 's1', 'basic', ['post'])];
    expect(buildPreQuiz(small, mulberry32(1)).items.map((i) => i.question.id)).toEqual(['a']);
  });
});

describe('buildPostQuiz', () => {
  it('draws up to 20 distinct questions', () => {
    const quiz = buildPostQuiz(bank, mulberry32(2));
    expect(quiz.items).toHaveLength(20);
    expect(new Set(quiz.items.map((i) => i.question.id)).size).toBe(20);
  });
});

describe('buildMock', () => {
  const withFollowUps = [
    ...bank.slice(0, 10),
    q('lead', 's1', 'advanced', ['mock'], ['f1', 'f2', 'f3']),
    q('f1', 's1', 'advanced', ['mock']),
    q('f2', 's1', 'elite', ['mock']),
    q('f3', 's1', 'elite', ['mock']),
  ];

  it('varies between attempts', () => {
    const a = buildMock(bank, mulberry32(1)).items.map((i) => i.question.id).join();
    const b = buildMock(bank, mulberry32(99)).items.map((i) => i.question.id).join();
    expect(a).not.toBe(b);
  });

  it('places up to 2 follow-ups right after their lead and never uses follow-ups as leads', () => {
    for (let seed = 0; seed < 30; seed++) {
      const items = buildMock(withFollowUps, mulberry32(seed)).items;
      const leadIdx = items.findIndex((i) => i.question.id === 'lead');
      expect(items.filter((i) => !i.followUpOf).map((i) => i.question.id)).not.toContain('f3');
      if (leadIdx >= 0) {
        expect(items[leadIdx + 1]).toMatchObject({ followUpOf: 'lead', question: { id: 'f1' } });
        expect(items[leadIdx + 2]).toMatchObject({ followUpOf: 'lead', question: { id: 'f2' } });
        expect(items.some((i) => i.question.id === 'f3')).toBe(false);
      }
    }
  });

  it('sets a time limit equal to the sum of question budgets', () => {
    const quiz = buildMock(bank, mulberry32(3));
    expect(quiz.timeLimitSec).toBe(quiz.items.reduce((n, i) => n + timeBudgetSec(i.question), 0));
  });
});

describe('buildMistakeQuiz', () => {
  it('dedupes and skips unknown ids', () => {
    const quiz = buildMistakeQuiz(bank, ['q3', 'q1', 'q3', 'missing']);
    expect(quiz.items.map((i) => i.question.id)).toEqual(['q3', 'q1']);
  });
});
