import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '../../db/db';
import { wipeAll } from '../../db/backup';
import { getFlashcard, getFlashcardDeck } from '../../content/registry';
import { cardId } from '../../engine/srs';
import { enrolSectionDeck, isDeckEnrolled, scheduleStoryCard } from '../cards';

const now = new Date('2026-10-16T15:00:00');

beforeEach(async () => {
  await wipeAll(db);
});

describe('card service', () => {
  it('enrols a deck once, with every card due today as new', async () => {
    const deck = getFlashcardDeck('dcf');
    expect(await isDeckEnrolled('dcf')).toBe(false);
    expect(await enrolSectionDeck('dcf', now)).toBe(deck.length);
    expect(await enrolSectionDeck('dcf', now)).toBe(0);
    const c = await db.cards.get(cardId('flashcard', deck[0]!.id));
    expect(c).toMatchObject({ source: 'flashcard', sectionId: 'dcf', due: '2026-10-16', lastReviewedAt: null });
    expect(await isDeckEnrolled('dcf')).toBe(true);
  });

  it('resolves every deck card, including formula callouts', () => {
    for (const f of getFlashcardDeck('lbo')) expect(getFlashcard(f.id)?.front).toBe(f.front);
  });

  it('schedules only weak stories', async () => {
    expect(await scheduleStoryCard('story-1', 0.9, now)).toBeNull();
    const c = await scheduleStoryCard('story-1', 0.4, now);
    expect(c).toMatchObject({ id: 'story:story-1', source: 'story', sectionId: 'fit', due: '2026-10-17' });
  });
});
