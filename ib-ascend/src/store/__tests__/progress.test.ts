import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '../../db/db';
import { wipeAll } from '../../db/backup';
import { hydrateAll } from '../bootstrap';
import { useProgressStore, type NewAttempt } from '../useProgressStore';

const base: NewAttempt = {
  questionId: 'acc-q-001',
  sectionId: 'accounting',
  subtopic: 'linkages',
  difficulty: 'basic',
  mode: 'post',
  sessionId: 's1',
  response: { type: 'mcq', optionId: 'b' },
  correct: false,
  score: 0,
  timeMs: 4000,
};

beforeEach(async () => {
  await wipeAll(db);
  await hydrateAll();
});

describe('recordAttempt', () => {
  it('stores the attempt and logs a mistake when wrong', async () => {
    const a = await useProgressStore.getState().recordAttempt(base);
    expect(a.firstTry).toBe(true);
    expect(await db.attempts.count()).toBe(1);
    const mistakes = await db.mistakes.toArray();
    expect(mistakes).toHaveLength(1);
    expect(mistakes[0]?.resolvedAt).toBeNull();
  });

  it('marks later attempts as not first-try', async () => {
    await useProgressStore.getState().recordAttempt(base);
    const second = await useProgressStore.getState().recordAttempt({ ...base, correct: true, score: 1 });
    expect(second.firstTry).toBe(false);
  });

  it('resolves open mistakes when answered correctly in Redo mode', async () => {
    await useProgressStore.getState().recordAttempt(base);
    await useProgressStore.getState().recordAttempt({ ...base, mode: 'mistakes', correct: true, score: 1 });
    const mistakes = await db.mistakes.toArray();
    expect(mistakes.every((m) => m.resolvedAt !== null)).toBe(true);
  });

  it('updates the section last-activity timestamp in the store and DB', async () => {
    await useProgressStore.getState().recordAttempt(base);
    expect(useProgressStore.getState().sections.accounting.lastActivityAt).not.toBeNull();
    expect((await db.sectionProgress.get('accounting'))?.lastActivityAt).not.toBeNull();
  });
});
