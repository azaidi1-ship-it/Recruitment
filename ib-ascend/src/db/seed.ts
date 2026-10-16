import { db, type IbAscendDb } from './db';
import { defaultProfile, defaultSettings } from './defaults';
import { SEED_RESUME } from '../content/resume/resume';
import { SECTIONS } from '../content/sections';
import { nowIso } from '../lib/dates';
import type { SectionProgress, SectionId } from '../types/models';

export function emptySectionProgress(sectionId: SectionId): SectionProgress {
  return {
    sectionId,
    preQuizScore: null,
    fastTracked: false,
    lessonsRead: [],
    examplesCompleted: [],
    postQuizBest: null,
    postQuizPassedAt: null,
    mockBest: null,
    masteryPeak: 0,
    lastActivityAt: null,
    updatedAt: nowIso(),
  };
}

/**
 * Create any missing singleton rows. Idempotent: safe to run on every launch
 * and after an import (it never overwrites existing rows).
 */
export async function ensureSeeded(database: IbAscendDb = db): Promise<void> {
  await database.transaction(
    'rw',
    [database.profile, database.settings, database.sectionProgress, database.resumes],
    async () => {
      if (!(await database.profile.get('me'))) await database.profile.add(defaultProfile());
      if (!(await database.settings.get('settings'))) await database.settings.add(defaultSettings());
      for (const s of SECTIONS) {
        if (!(await database.sectionProgress.get(s.id))) {
          await database.sectionProgress.add(emptySectionProgress(s.id));
        }
      }
      if ((await database.resumes.count()) === 0) await database.resumes.add(SEED_RESUME);
      // TODO(Phase 9): seed Story Bank stories and Firm Tracker firms here.
    },
  );
}
