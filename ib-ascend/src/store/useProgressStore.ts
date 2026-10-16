import { create } from 'zustand';
import { db } from '../db/db';
import { emptySectionProgress } from '../db/seed';
import { SECTIONS } from '../content/sections';
import { newId } from '../lib/id';
import { nowIso } from '../lib/dates';
import type { Attempt, Mistake, SectionId, SectionProgress } from '../types/models';

type ProgressMap = Record<SectionId, SectionProgress>;

function emptyMap(): ProgressMap {
  return Object.fromEntries(SECTIONS.map((s) => [s.id, emptySectionProgress(s.id)])) as ProgressMap;
}

export type NewAttempt = Omit<Attempt, 'id' | 'createdAt' | 'firstTry' | 'xpAwarded'> & {
  xpAwarded?: number;
};

interface ProgressState {
  sections: ProgressMap;
  load: () => Promise<void>;
  updateSection: (id: SectionId, patch: Partial<Omit<SectionProgress, 'sectionId'>>) => Promise<void>;
  /**
   * Persist one answered question. Wrong answers are copied to the Mistake
   * Log. Returns the stored attempt (with firstTry resolved).
   * TODO(Phase 2): route through the gamification engine for XP, mastery,
   * quests and achievements.
   */
  recordAttempt: (a: NewAttempt) => Promise<Attempt>;
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  sections: emptyMap(),
  load: async () => {
    const rows = await db.sectionProgress.toArray();
    const map = emptyMap();
    for (const r of rows) map[r.sectionId] = r;
    set({ sections: map });
  },
  updateSection: async (id, patch) => {
    const next: SectionProgress = { ...get().sections[id], ...patch, sectionId: id, updatedAt: nowIso() };
    set({ sections: { ...get().sections, [id]: next } });
    await db.sectionProgress.put(next);
  },
  recordAttempt: async (input) => {
    const createdAt = nowIso();
    const attempt: Attempt = await db.transaction('rw', db.attempts, db.mistakes, async () => {
      const prior = await db.attempts.where('questionId').equals(input.questionId).count();
      const row: Attempt = {
        ...input,
        id: newId('att'),
        firstTry: prior === 0,
        xpAwarded: input.xpAwarded ?? 0,
        createdAt,
      };
      await db.attempts.add(row);
      if (!row.correct) {
        const mistake: Mistake = {
          id: newId('mis'),
          questionId: row.questionId,
          sectionId: row.sectionId,
          attemptId: row.id,
          response: row.response,
          createdAt,
          resolvedAt: null,
        };
        await db.mistakes.add(mistake);
      } else if (row.mode === 'mistakes') {
        // Redo mode: a correct answer resolves every open mistake on this question.
        await db.mistakes
          .where('questionId')
          .equals(row.questionId)
          .filter((m) => m.resolvedAt === null)
          .modify({ resolvedAt: createdAt });
      }
      return row;
    });
    await get().updateSection(input.sectionId, { lastActivityAt: createdAt });
    return attempt;
  },
}));
