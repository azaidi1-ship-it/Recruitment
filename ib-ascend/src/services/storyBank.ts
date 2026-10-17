/**
 * Story Bank persistence: edits with version history, practice results,
 * and resume re-imports. XP and quests still go through progression.
 */
import { db } from '../db/db';
import { SRS } from '../config/gameConfig';
import { fillInsOf } from '../content/stories/seedStories';
import { diffResume, draftStoryForItem, newItemId, type ParsedItem, type ResumeDiff } from '../engine/storyBank';
import { newId } from '../lib/id';
import type { BehavioralQuestion, Resume, ResumeItem, Story } from '../types/models';
import { scheduleStoryCard } from './cards';
import { answerQuestion, refreshDerived } from './progression';

const TEXT_FIELDS = ['situation', 'task', 'action', 'result', 'spoken', 'short'] as const;

/** Open [FILL IN] questions anywhere in a story. */
export function storyFillIns(s: Pick<Story, (typeof TEXT_FIELDS)[number]>): string[] {
  return fillInsOf(...TEXT_FIELDS.map((f) => s[f]));
}

/** Save an edited story, keeping the previous text as a version. */
export async function saveStory(next: Story, note = 'Edited', now: Date = new Date()): Promise<Story> {
  const at = now.toISOString();
  const prev = await db.stories.get(next.id);
  const updated: Story = { ...next, fillIns: storyFillIns(next), userEdited: true, updatedAt: at };
  await db.transaction('rw', db.stories, db.storyVersions, async () => {
    if (prev) {
      const { id: _id, ...snapshot } = prev;
      await db.storyVersions.add({ id: newId('ver'), storyId: prev.id, snapshot, note, createdAt: at });
    }
    await db.stories.put(updated);
  });
  await refreshDerived(now);
  return updated;
}

/** Restore an earlier version (the current text is versioned first, so nothing is lost). */
export async function restoreVersion(versionId: string, now: Date = new Date()): Promise<Story | null> {
  const v = await db.storyVersions.get(versionId);
  if (!v) return null;
  return saveStory({ ...v.snapshot, id: v.storyId }, `Restored version from ${new Date(v.createdAt).toLocaleString()}`, now);
}

export async function createStory(resumeItemId: string, now: Date = new Date()): Promise<Story> {
  const at = now.toISOString();
  const s: Story = {
    id: newId('st'),
    resumeItemId,
    title: 'New story',
    angle: '',
    competencies: [],
    situation: '',
    task: '',
    action: '',
    result: '',
    spoken: '',
    short: '',
    fillIns: [],
    unverifiedDetails: [],
    practiceScore: null,
    needsRewrite: false,
    userEdited: true,
    createdAt: at,
    updatedAt: at,
  };
  await db.stories.add(s);
  return s;
}

export async function deleteStory(id: string): Promise<void> {
  await db.transaction('rw', db.stories, db.storyVersions, db.cards, async () => {
    await db.stories.delete(id);
    await db.storyVersions.where('storyId').equals(id).delete();
    await db.cards.delete(`story:${id}`);
  });
  await refreshDerived();
}

export interface PracticeInput {
  question: BehavioralQuestion;
  story: Story | null;
  text: string;
  hitPointIds: string[];
  /** 0–1 after the user's self-grading. */
  score: number;
  timeMs: number;
  sessionId: string;
}

/**
 * Record a practice answer: XP and quests via progression (mode
 * "behavioral"), the story's latest score, and, for a weak answer, a rewrite
 * flag and a spaced-repetition card for the story.
 */
export async function recordPractice(p: PracticeInput, now: Date = new Date()): Promise<{ xp: number; weak: boolean }> {
  const res = await answerQuestion(
    {
      questionId: p.question.id,
      sectionId: 'fit',
      subtopic: 'behavioral-stories',
      difficulty: 'intermediate',
      mode: 'behavioral',
      sessionId: p.sessionId,
      response: { type: 'freeText', text: p.text, hitPointIds: p.hitPointIds, selfScore: p.score },
      correct: p.score >= 0.7,
      score: p.score,
      timeMs: p.timeMs,
    },
    now,
  );
  const weak = p.score < SRS.weakStoryScore;
  if (p.story) {
    await db.stories.update(p.story.id, { practiceScore: p.score, needsRewrite: weak || p.story.fillIns.length > 0, updatedAt: now.toISOString() });
    if (weak) await scheduleStoryCard(p.story.id, p.score, now);
  }
  await refreshDerived(now);
  return { xp: res.xp.xp, weak };
}

// ───────────────────────────── Resume re-import ─────────────────────────────

export interface ImportResult {
  resume: Resume;
  diff: ResumeDiff;
  draftedStories: Story[];
  flaggedStories: string[];
}

/**
 * Save a new resume version from parsed text: unchanged items keep their ids,
 * changed items are updated in place, added items get new ids, removed items
 * drop off. New items get a first-draft story; stories about changed items
 * are flagged for review. Stories about removed items are kept.
 */
export async function applyResumeImport(parsed: ParsedItem[], rawText: string, now: Date = new Date()): Promise<ImportResult> {
  const at = now.toISOString();
  const old = (await db.resumes.orderBy('version').last())!;
  const diff = diffResume(old, parsed);
  const taken = new Set(old.items.map((i) => i.id));
  const changedById = new Map(diff.changed.map((c) => [c.old.id, c.next]));
  const removed = new Set(diff.removed.map((r) => r.id));

  const items: ResumeItem[] = [];
  for (const item of old.items) {
    if (removed.has(item.id)) continue;
    const next = changedById.get(item.id);
    items.push(next ? { ...item, role: next.role, org: next.org, start: next.start || item.start, end: next.end || item.end, bullets: next.bullets } : item);
  }
  const addedItems: ResumeItem[] = diff.added.map((p) => {
    const id = newItemId(p, taken);
    taken.add(id);
    return { id, category: p.category, role: p.role, org: p.org, start: p.start, end: p.end, bullets: p.bullets };
  });
  items.push(...addedItems);

  const resume: Resume = { ...old, id: `resume-v${old.version + 1}`, version: old.version + 1, importedAt: at, items, rawText };
  const draftedStories = addedItems.map((item) => draftStoryForItem(item, at, newId('st')));
  const flagged = (await db.stories.toArray()).filter((s) => changedById.has(s.resumeItemId)).map((s) => s.id);

  await db.transaction('rw', db.resumes, db.stories, async () => {
    await db.resumes.add(resume);
    if (draftedStories.length) await db.stories.bulkAdd(draftedStories);
    for (const id of flagged) await db.stories.update(id, { needsRewrite: true, updatedAt: at });
  });
  await refreshDerived(now);
  return { resume, diff, draftedStories, flaggedStories: flagged };
}

/** Plain text from an uploaded PDF (lines rebuilt from text positions). Loaded on demand. */
export async function pdfToText(file: File): Promise<string> {
  const pdfjs = await import('pdfjs-dist');
  const worker = await import('pdfjs-dist/build/pdf.worker.min.mjs?url');
  pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
  const doc = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
  const lines: string[] = [];
  for (let p = 1; p <= doc.numPages; p++) {
    const page = await doc.getPage(p);
    const content = await page.getTextContent();
    let line = '';
    let lastY: number | null = null;
    for (const item of content.items) {
      if (!('str' in item)) continue;
      const y = item.transform[5] as number;
      if (lastY !== null && Math.abs(y - lastY) > 2) {
        lines.push(line.trim());
        line = '';
      }
      line += item.str;
      if (item.hasEOL) {
        lines.push(line.trim());
        line = '';
        lastY = null;
        continue;
      }
      lastY = y;
    }
    if (line.trim()) lines.push(line.trim());
  }
  return lines.filter(Boolean).join('\n');
}
