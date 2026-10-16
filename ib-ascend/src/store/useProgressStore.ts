import { create } from 'zustand';
import { db } from '../db/db';
import { emptySectionProgress } from '../db/seed';
import { SECTIONS } from '../content/sections';
import { nowIso } from '../lib/dates';
import type { SectionId, SectionProgress } from '../types/models';

type ProgressMap = Record<SectionId, SectionProgress>;

function emptyMap(): ProgressMap {
  return Object.fromEntries(SECTIONS.map((s) => [s.id, emptySectionProgress(s.id)])) as ProgressMap;
}

/**
 * Per-section progress (pre-quiz score, chapters read, post-quiz/mock bests).
 * Answers, sessions and XP are recorded through services/progression.ts,
 * which updates this store.
 */
interface ProgressState {
  sections: ProgressMap;
  load: () => Promise<void>;
  updateSection: (id: SectionId, patch: Partial<Omit<SectionProgress, 'sectionId'>>) => Promise<void>;
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
}));
