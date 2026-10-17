import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '../../db/db';
import { wipeAll } from '../../db/backup';
import { hydrateAll } from '../../store/bootstrap';
import { useGameStore } from '../../store/useGameStore';
import { useProfileStore } from '../../store/useProfileStore';
import { useProgressStore } from '../../store/useProgressStore';
import { useUiEvents } from '../../store/useUiEvents';
import { getFlashcardDeck } from '../../content/registry';
import { SRS } from '../../config/gameConfig';
import { cardId } from '../../engine/srs';
import {
  answerQuestion,
  completeSession,
  markLessonRead,
  reviewCard,
  type AnswerInput,
} from '../progression';

const now = new Date('2026-10-16T15:00:00');
const later = (mins: number) => new Date(now.getTime() + mins * 60_000);

const q: AnswerInput = {
  questionId: 'acc-q-001',
  sectionId: 'accounting',
  subtopic: 'linkages',
  difficulty: 'basic',
  mode: 'post',
  sessionId: 's1',
  response: { type: 'mcq', optionId: 'a' },
  correct: true,
  score: 1,
  timeMs: 5000,
};

const xp = () => useProfileStore.getState().profile.totalXp;
const events = (kind: string) => useUiEvents.getState().queue.filter((e) => e.kind === kind);

beforeEach(async () => {
  await wipeAll(db);
  useUiEvents.getState().clear();
  await hydrateAll(now);
});

describe('hydrate', () => {
  it('computes a snapshot and creates today’s 3 quests', async () => {
    const snap = useGameStore.getState().snapshot!;
    expect(snap.level.level).toBe(1);
    expect(snap.rank.title).toBe('Intern');
    expect(snap.unlocked).toEqual(['accounting', 'mental-math', 'markets', 'fit']);
    expect(await db.quests.count()).toBe(3);
    expect(snap.quests).toHaveLength(3);
  });

  it('does not regenerate quests on a second launch the same day', async () => {
    const before = (await db.quests.toArray()).map((x) => x.id);
    await hydrateAll(later(60));
    expect((await db.quests.toArray()).map((x) => x.id)).toEqual(before);
  });
});

describe('answerQuestion', () => {
  it('awards XP, starts the streak and unlocks "Day One"', async () => {
    const r = await answerQuestion(q, now);
    expect(r.xp.xp).toBe(8); // 5 × 1.5 first-try
    expect(r.attempt.firstTry).toBe(true);
    expect(useProfileStore.getState().profile.streak.current).toBe(1);
    expect(await db.achievements.get('first-answer')).toBeDefined();
    expect(xp()).toBe(8 + 25); // + achievement reward
    expect(events('achievement')).toHaveLength(1);
  });

  it('logs wrong answers to the Mistake Log and resolves them in Redo mode', async () => {
    await answerQuestion({ ...q, correct: false, score: 0 }, now);
    expect(await db.mistakes.filter((m) => m.resolvedAt === null).count()).toBe(1);
    expect(useGameStore.getState().snapshot!.openMistakes).toBe(1);

    const redo = await answerQuestion({ ...q, mode: 'mistakes' }, later(5));
    expect(redo.resolvedMistakes).toBe(1);
    expect(redo.attempt.firstTry).toBe(false);
    expect(useGameStore.getState().snapshot!.openMistakes).toBe(0);
  });

  it('emits a level-up when crossing 100 XP', async () => {
    for (let i = 0; i < 4; i++) {
      await answerQuestion({ ...q, questionId: `elite-${i}`, difficulty: 'elite' }, later(i));
    }
    // 25 (Day One) + 4 × round(35 × 1.5 × streak bonus) > 100
    expect(xp()).toBeGreaterThan(100);
    expect(events('levelUp').length + events('rankUp').length).toBeGreaterThan(0);
    expect(useGameStore.getState().snapshot!.level.level).toBeGreaterThanOrEqual(2);
  });
});

describe('completeSession', () => {
  it('sets the pre-quiz score and fast-tracks at 90%+', async () => {
    const r = await completeSession(
      { mode: 'pre', sectionId: 'accounting', title: 'Pre-quiz', questionIds: ['a', 'b'], score: 0.9, startedAt: now.toISOString() },
      now,
    );
    expect(r.fastTracked).toBe(true);
    const p = useProgressStore.getState().sections.accounting;
    expect(p.preQuizScore).toBe(0.9);
    expect(p.fastTracked).toBe(true);
    expect(await db.achievements.get('fast-track')).toBeDefined();
    // Pre-quiz sets starting mastery at half the score.
    expect(useGameStore.getState().snapshot!.mastery.accounting.mastery).toBeCloseTo(0.45);
  });

  it('passing the post-quiz unlocks the next section', async () => {
    const r = await completeSession(
      { mode: 'post', sectionId: 'accounting', title: 'Post-quiz', questionIds: [], score: 0.8, startedAt: now.toISOString() },
      now,
    );
    expect(r.newlyPassed).toBe(true);
    expect(useGameStore.getState().snapshot!.unlocked).toContain('walkthroughs');
  });

  it('failing the post-quiz does not unlock anything', async () => {
    await completeSession(
      { mode: 'post', sectionId: 'accounting', title: 'Post-quiz', questionIds: [], score: 0.79, startedAt: now.toISOString() },
      now,
    );
    expect(useGameStore.getState().snapshot!.unlocked).not.toContain('walkthroughs');
  });

  it('rewards mock personal bests and grades the section', async () => {
    const mock = (score: number, t: number) =>
      completeSession(
        { mode: 'mock', sectionId: 'accounting', title: 'Boss Fight', questionIds: Array(10).fill('x'), score, startedAt: later(t).toISOString() },
        later(t),
      );
    expect((await mock(0.7, 0)).bonus.xp).toBe(50); // first clear
    const pb = await mock(0.85, 10);
    expect(pb.bonus.xp).toBe(125); // 50 + 5 × 15
    expect(pb.session.meta?.personalBest).toBe(true);
    expect((await mock(0.6, 20)).bonus.xp).toBe(0);
    expect(useProgressStore.getState().sections.accounting.mockBest).toBe(0.85);
    expect(useGameStore.getState().snapshot!.grades.accounting).toBe('B'); // 0.6×0.85 + 0.4×0.7167 = 0.797
    expect(await db.achievements.get('first-boss')).toBeDefined();
  });
});

describe('other activities', () => {
  it('awards chapter XP once per chapter', async () => {
    expect(await markLessonRead('accounting', 'acc-l1', now)).toBeGreaterThanOrEqual(15);
    expect(await markLessonRead('accounting', 'acc-l1', later(1))).toBe(0);
    expect(useProgressStore.getState().sections.accounting.lessonsRead).toEqual(['acc-l1']);
  });

});

describe('spaced repetition', () => {
  it('enrols a section’s flashcards when you start reading, and queues them as new', async () => {
    await markLessonRead('accounting', 'acc-l1', now);
    const deck = getFlashcardDeck('accounting');
    expect(await db.cards.where('sectionId').equals('accounting').count()).toBe(deck.length);
    await markLessonRead('accounting', 'acc-l2', later(1));
    expect(await db.cards.count()).toBe(deck.length); // idempotent
    const snap = useGameStore.getState().snapshot!;
    expect(snap.cardsNew).toBe(Math.min(deck.length, SRS.newCardsPerDay));
    expect(snap.cardsDue).toBe(snap.cardsNew);
  });

  it('reviews a card with SM-2, logs it and pays flashcard XP', async () => {
    await markLessonRead('accounting', 'acc-l1', now);
    const before = xp();
    const id = cardId('flashcard', getFlashcardDeck('accounting')[0]!.id);
    const r = await reviewCard(id, SRS.quality.good, later(1));
    expect(r.card).toMatchObject({ repetitions: 1, intervalDays: 1, due: '2026-10-17' });
    expect(r.card.firstReviewedAt).toBe(later(1).toISOString());
    expect(await db.reviewLogs.count()).toBe(1);
    expect(xp() - before).toBe(2);
    // One fewer new card left today.
    expect(useGameStore.getState().snapshot!.cardsNew).toBe(Math.min(getFlashcardDeck('accounting').length - 1, SRS.newCardsPerDay - 1));
  });

  it('turns a missed question into a card due tomorrow, and lapses it if missed again', async () => {
    await answerQuestion({ ...q, correct: false, score: 0 }, now);
    const c = await db.cards.get(cardId('question', q.questionId));
    expect(c).toMatchObject({ source: 'question', sectionId: 'accounting', due: '2026-10-17', repetitions: 0 });
    await db.cards.update(c!.id, { repetitions: 3, intervalDays: 15 });
    await answerQuestion({ ...q, correct: false, score: 0 }, later(5));
    expect(await db.cards.get(c!.id)).toMatchObject({ repetitions: 0, lapses: 1, due: '2026-10-17' });
  });

  it('does not create cards from review-mode or HireVue answers', async () => {
    await answerQuestion({ ...q, mode: 'review', correct: false, score: 0 }, now);
    await answerQuestion({ ...q, questionId: 'hv-01', mode: 'hirevue', correct: false, score: 0.2 }, later(1));
    expect(await db.cards.count()).toBe(0);
  });

  it('does not log mistakes or cards for questions outside the section banks (resume probes)', async () => {
    await answerQuestion({ ...q, questionId: 'probe-exp-ayah-1', sectionId: 'fit', subtopic: 'resume-walkthrough', mode: 'superday', correct: false, score: 0.3 }, now);
    expect(await db.mistakes.count()).toBe(0);
    expect(await db.cards.count()).toBe(0);
    expect(await db.attempts.count()).toBe(1);
  });

  it('pays no extra XP for reviewing a question card (the answer already earned it)', async () => {
    await answerQuestion({ ...q, correct: false, score: 0 }, now);
    const before = xp();
    await reviewCard(cardId('question', q.questionId), SRS.quality.good, later(60 * 24));
    expect(xp()).toBe(before);
    expect(await db.reviewLogs.count()).toBe(1);
  });
});

describe('quests', () => {
  it('advance with matching activity and pay out on completion', async () => {
    // Force a known quest for today.
    await db.quests.clear();
    await db.quests.add({
      id: '2026-10-16-0',
      date: '2026-10-16',
      templateId: 'acc-correct',
      title: 'Answer 2 Accounting questions correctly',
      stat: 'accounting',
      sectionId: 'accounting',
      metric: 'correctAnswers',
      target: 2,
      progress: 0,
      xpReward: 80,
      completedAt: null,
    });
    await answerQuestion({ ...q, questionId: 'x1' }, now);
    await answerQuestion({ ...q, questionId: 'x2' }, later(1));
    const quest = await db.quests.get('2026-10-16-0');
    expect(quest?.completedAt).not.toBeNull();
    expect(events('quest')).toHaveLength(1);
    // 8 + 8×1.02≈8 (streak day 1) + 80 quest + 25 Day One
    expect(xp()).toBe(8 + 8 + 80 + 25);
  });
});

describe('HireVue answers', () => {
  it('count as story practice, feed quests, and never create mistakes', async () => {
    await db.quests.clear();
    await db.quests.add({
      id: '2026-10-16-0',
      date: '2026-10-16',
      templateId: 'pol-stories',
      title: 'Practice 2 behavioral stories out loud',
      stat: 'polish',
      sectionId: null,
      metric: 'storiesPracticed',
      target: 2,
      progress: 0,
      xpReward: 80,
      completedAt: null,
    });
    const hv = { ...q, questionId: 'hv-12', sectionId: 'fit' as const, subtopic: 'behavioral-stories', difficulty: 'intermediate' as const, mode: 'hirevue' as const, response: { type: 'freeText' as const, text: 'x', selfScore: 0.4 } };
    await answerQuestion({ ...hv, correct: false, score: 0.4 }, now);
    await answerQuestion({ ...hv, questionId: 'hv-13', correct: true, score: 0.9 }, later(5));
    expect(await db.mistakes.count()).toBe(0);
    expect((await db.quests.get('2026-10-16-0'))?.completedAt).not.toBeNull();
    expect(useGameStore.getState().snapshot!.stats.polish).toBeGreaterThan(0);
  });
});
