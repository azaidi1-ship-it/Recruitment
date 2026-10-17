import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '../../db/db';
import { wipeAll } from '../../db/backup';
import { hydrateAll } from '../../store/bootstrap';
import { useProfileStore } from '../../store/useProfileStore';
import { SEED_STORY_DRAFTS } from '../../content/stories/seedStories';
import { FIRM_PROFILES } from '../../content/firms/firms';
import { BEHAVIORAL_QUESTIONS } from '../../content/stories/behavioralQuestions';
import { SEED_RESUME_TEXT } from '../../content/resume/resumeText';
import { parseResumeText } from '../../engine/storyBank';
import { applyResumeImport, recordPractice, restoreVersion, saveStory } from '../storyBank';
import { saveDeal, saveEvent, saveMarketNote } from '../tracker';

const now = new Date('2026-10-17T15:00:00');
const later = (m: number) => new Date(now.getTime() + m * 60_000);

beforeEach(async () => {
  await wipeAll(db);
  await hydrateAll(now);
});

describe('Story Bank service', () => {
  it('seeds every story and firm on first run', async () => {
    expect(await db.stories.count()).toBe(SEED_STORY_DRAFTS.length);
    expect(await db.firms.count()).toBe(FIRM_PROFILES.length);
  });

  it('versions every edit and restores earlier text', async () => {
    const s = (await db.stories.get('st-stratus-raise'))!;
    const edited = await saveStory({ ...s, result: 'The $250K pre-seed raise closed in [FILL IN: how many weeks].' }, 'Tightened result', now);
    expect(edited.userEdited).toBe(true);
    expect(edited.fillIns).toContain('how many weeks');
    const versions = await db.storyVersions.where('storyId').equals(s.id).toArray();
    expect(versions).toHaveLength(1);
    expect(versions[0]!.snapshot.result).toBe(s.result);
    const restored = await restoreVersion(versions[0]!.id, later(1));
    expect(restored!.result).toBe(s.result);
    expect(await db.storyVersions.where('storyId').equals(s.id).count()).toBe(2);
  });

  it('flags a weak practice answer for rewrite and schedules the story for review', async () => {
    const q = BEHAVIORAL_QUESTIONS.find((x) => x.id === 'bq-06')!;
    const story = (await db.stories.get('st-ayah-mistake'))!;
    const before = useProfileStore.getState().profile.totalXp;
    const r = await recordPractice({ question: q, story, text: 'I made a mistake.', hitPointIds: [], score: 0.3, timeMs: 30_000, sessionId: 's' }, now);
    expect(r.weak).toBe(true);
    expect(useProfileStore.getState().profile.totalXp).toBeGreaterThan(before);
    expect((await db.stories.get(story.id))!).toMatchObject({ practiceScore: 0.3, needsRewrite: true });
    expect(await db.cards.get('story:st-ayah-mistake')).toBeDefined();
    expect(await db.mistakes.count()).toBe(0);
    expect(await db.attempts.where('mode').equals('behavioral').count()).toBe(1);
  });

  it('imports an updated resume: new items get draft stories, changed items flag theirs', async () => {
    const text = SEED_RESUME_TEXT.replace(
      'EXPERIENCE\n',
      'EXPERIENCE\nSummer Analyst | Example Partners, New York, NY\nJun 2027 – Aug 2027\n• Built merger models for two sell-side processes\n',
    ).replace('five recurring clients', 'six recurring clients');
    const r = await applyResumeImport(parseResumeText(text), text, now);
    expect(r.resume.version).toBe(2);
    expect(r.draftedStories).toHaveLength(1);
    expect(r.draftedStories[0]!.resumeItemId).toBe(r.resume.items.find((i) => i.org.startsWith('Example'))!.id);
    expect(r.flaggedStories.sort()).toEqual(['st-fitness-difficult', 'st-fitness-retention']);
    expect(r.resume.items.find((i) => i.id === 'exp-fitness')!.bullets[0]).toContain('six recurring clients');
    expect(r.resume.items.find((i) => i.id === 'edu-swarthmore')).toBeDefined();
    expect((await db.resumes.orderBy('version').last())!.version).toBe(2);
  });
});

describe('tracker service', () => {
  it('pays XP once for a new deal and keeps one market note per week', async () => {
    const before = useProfileStore.getState().profile.totalXp;
    const { deal, xp } = await saveDeal({ acquirer: 'A', target: 'B', valueMm: 1200, multiple: '12x EBITDA', sector: 'Tech', announcedOn: '2026-10-01', rationale: 'Scale', myView: 'Good' }, now);
    expect(xp).toBeGreaterThanOrEqual(10);
    expect((await saveDeal({ ...deal, myView: 'Still good' }, later(1))).xp).toBe(0);
    expect(useProfileStore.getState().profile.totalXp - before).toBe(xp);
    await saveMarketNote({ weekOf: '2026-10-12', text: 'a' }, now);
    await saveMarketNote({ weekOf: '2026-10-12', text: 'b' }, later(2));
    expect(await db.marketNotes.count()).toBe(1);
    expect((await db.marketNotes.toArray())[0]!.text).toBe('b');
    await saveEvent({ title: 'Evercore superday', kind: 'superday', date: '2026-11-02', firmId: 'evercore', notes: '' }, now);
    expect(await db.events.count()).toBe(1);
  });
});
