/**
 * Firm Tracker, Deal & Market Journal and Recruiting Calendar persistence.
 * XP for logging and pitching deals goes through progression.recordActivity.
 */
import { db } from '../db/db';
import { XP } from '../config/gameConfig';
import { storyPracticeXp } from '../engine/xp';
import { newId } from '../lib/id';
import type { CalendarEvent, DealEntry, Firm, MarketNote } from '../types/models';
import { recordActivity, refreshDerived } from './progression';

/** All firms, A–Z (name isn't indexed, so sort in memory). */
export async function listFirms(): Promise<Firm[]> {
  return (await db.firms.toArray()).sort((a, b) => a.name.localeCompare(b.name));
}

export async function saveFirm(firm: Firm, now: Date = new Date()): Promise<Firm> {
  const next = { ...firm, updatedAt: now.toISOString() };
  await db.firms.put(next);
  return next;
}

/** Update some fields of a firm without overwriting concurrent edits to others. */
export async function updateFirm(id: string, patch: Partial<Omit<Firm, 'id'>>, now: Date = new Date()): Promise<void> {
  await db.firms.update(id, { ...patch, updatedAt: now.toISOString() });
}

export async function addFirm(name: string, tier: Firm['tier'], now: Date = new Date()): Promise<Firm> {
  const at = now.toISOString();
  const firm: Firm = {
    id: newId('firm'),
    name,
    tier,
    status: 'researching',
    focusAreas: [],
    personaId: null,
    researchedDeals: [],
    contacts: [],
    interviewNotes: '',
    whyFirmDraft: '',
    createdAt: at,
    updatedAt: at,
  };
  await db.firms.add(firm);
  return firm;
}

export async function deleteFirm(id: string): Promise<void> {
  await db.transaction('rw', db.firms, db.events, async () => {
    await db.firms.delete(id);
    await db.events.where('firmId').equals(id).modify({ firmId: null });
  });
}

/** Save a deal; a new one earns XP and counts toward "log a deal" quests. */
export async function saveDeal(deal: Omit<DealEntry, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }, now: Date = new Date()): Promise<{ deal: DealEntry; xp: number }> {
  const at = now.toISOString();
  const existing = deal.id ? await db.deals.get(deal.id) : undefined;
  const next: DealEntry = { ...deal, id: deal.id ?? newId('deal'), createdAt: existing?.createdAt ?? at, updatedAt: at };
  await db.deals.put(next);
  const xp = existing ? 0 : await recordActivity({ kind: 'dealLogged' }, XP.dealLogged, 'Deal logged', now);
  return { deal: next, xp };
}

export async function deleteDeal(id: string): Promise<void> {
  await db.transaction('rw', db.deals, db.firms, async () => {
    await db.deals.delete(id);
    await db.firms.toCollection().modify((f) => {
      f.researchedDeals = f.researchedDeals.filter((d) => d !== id);
    });
  });
}

export async function saveMarketNote(note: Omit<MarketNote, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }, now: Date = new Date()): Promise<MarketNote> {
  const at = now.toISOString();
  const existing = note.id ? await db.marketNotes.get(note.id) : (await db.marketNotes.where('weekOf').equals(note.weekOf).first());
  const next: MarketNote = { ...note, id: existing?.id ?? newId('note'), createdAt: existing?.createdAt ?? at, updatedAt: at };
  await db.marketNotes.put(next);
  return next;
}

/** Record a "pitch me a deal" practice answer. */
export async function recordDealPitch(score: number, now: Date = new Date()): Promise<number> {
  return recordActivity({ kind: 'dealPitched' }, storyPracticeXp(score), 'Deal pitch', now);
}

export async function saveEvent(event: Omit<CalendarEvent, 'id' | 'createdAt'> & { id?: string }, now: Date = new Date()): Promise<CalendarEvent> {
  const existing = event.id ? await db.events.get(event.id) : undefined;
  const next: CalendarEvent = { ...event, id: event.id ?? newId('evt'), createdAt: existing?.createdAt ?? now.toISOString() };
  await db.events.put(next);
  await refreshDerived(now);
  return next;
}

export async function deleteEvent(id: string): Promise<void> {
  await db.events.delete(id);
}
