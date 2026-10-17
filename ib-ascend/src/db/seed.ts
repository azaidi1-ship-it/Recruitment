import { db, type IbAscendDb } from './db';
import { defaultProfile, defaultSettings } from './defaults';
import { SEED_RESUME } from '../content/resume/resume';
import { seedStories } from '../content/stories/seedStories';
import { seedFirms } from '../content/firms/firms';
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

/** Story fields the app writes; refreshed on stories the user hasn't edited. */
const SEED_STORY_FIELDS = ['title', 'angle', 'competencies', 'situation', 'task', 'action', 'result', 'spoken', 'short', 'fillIns', 'unverifiedDetails'] as const;

/**
 * Create any missing singleton rows. Idempotent: safe to run on every launch
 * and after an import. It never overwrites user data; the one update it makes
 * is bringing starter stories the user has never edited up to the current
 * seed text, so content corrections reach existing installs.
 */
export async function ensureSeeded(database: IbAscendDb = db): Promise<void> {
  await database.transaction(
    'rw',
    [database.profile, database.settings, database.sectionProgress, database.resumes, database.stories, database.firms],
    async () => {
      if (!(await database.profile.get('me'))) await database.profile.add(defaultProfile());
      if (!(await database.settings.get('settings'))) await database.settings.add(defaultSettings());
      for (const s of SECTIONS) {
        if (!(await database.sectionProgress.get(s.id))) {
          await database.sectionProgress.add(emptySectionProgress(s.id));
        }
      }
      if ((await database.resumes.count()) === 0) await database.resumes.add(SEED_RESUME);
      // Starter Story Bank and Firm Tracker; never re-added once the user has any.
      if ((await database.stories.count()) === 0) await database.stories.bulkAdd(seedStories(nowIso()));
      else await refreshSeedStories(database);
      if ((await database.firms.count()) === 0) await database.firms.bulkAdd(seedFirms(nowIso()));
    },
  );
}

async function refreshSeedStories(database: IbAscendDb): Promise<void> {
  const at = nowIso();
  for (const seed of seedStories(at)) {
    const cur = await database.stories.get(seed.id);
    if (!cur || cur.userEdited) continue;
    const changed = SEED_STORY_FIELDS.some((f) => JSON.stringify(cur[f]) !== JSON.stringify(seed[f]));
    if (!changed) continue;
    const patch = Object.fromEntries(SEED_STORY_FIELDS.map((f) => [f, seed[f]]));
    await database.stories.update(seed.id, { ...patch, updatedAt: at });
  }
}
