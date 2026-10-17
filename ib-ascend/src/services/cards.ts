/**
 * Spaced-repetition card bookkeeping: enrolling decks, turning missed
 * questions into cards and scheduling weak stories. Reviews themselves (and
 * their XP) go through progression.reviewCard.
 */
import { db } from '../db/db';
import { getFlashcardDeck } from '../content/registry';
import { cardId, lapseFromQuiz, newCard } from '../engine/srs';
import { SRS } from '../config/gameConfig';
import { addDays, toLocalDate } from '../lib/dates';
import type { Card, SectionId } from '../types/models';

/** Add every card in a section's flashcard deck to the review queue. Returns how many were new. */
export async function enrolSectionDeck(sectionId: SectionId, now: Date = new Date()): Promise<number> {
  const deck = getFlashcardDeck(sectionId);
  if (deck.length === 0) return 0;
  const ids = deck.map((f) => cardId('flashcard', f.id));
  const existing = new Set((await db.cards.bulkGet(ids)).filter(Boolean).map((c) => (c as Card).id));
  const fresh = deck.filter((f) => !existing.has(cardId('flashcard', f.id))).map((f) => newCard('flashcard', f.id, sectionId, now));
  if (fresh.length) await db.cards.bulkAdd(fresh);
  return fresh.length;
}

export async function isDeckEnrolled(sectionId: SectionId): Promise<boolean> {
  return (await db.cards.where('sectionId').equals(sectionId).filter((c) => c.source === 'flashcard').count()) > 0;
}

/**
 * A question answered wrong in a quiz becomes a card (or, if it already is
 * one, lapses) and comes back in the review queue after a short delay.
 */
export async function upsertMissedQuestionCard(questionId: string, sectionId: SectionId, now: Date = new Date()): Promise<Card> {
  return upsertCard('question', questionId, sectionId, now);
}

/**
 * Schedule a behavioral story for review after a weak practice score.
 * Called by Story Bank practice.
 */
export async function scheduleStoryCard(storyId: string, score: number, now: Date = new Date()): Promise<Card | null> {
  if (score >= SRS.weakStoryScore) return null;
  return upsertCard('story', storyId, 'fit', now);
}

/** Create a card due after the short delay, or lapse an existing one. */
async function upsertCard(source: Card['source'], sourceId: string, sectionId: SectionId | null, now: Date): Promise<Card> {
  const today = toLocalDate(now);
  const existing = await db.cards.get(cardId(source, sourceId));
  const card: Card = existing
    ? { ...existing, ...lapseFromQuiz(existing, today) }
    : newCard(source, sourceId, sectionId, now, addDays(today, SRS.missedQuestionDelayDays));
  await db.cards.put(card);
  return card;
}
