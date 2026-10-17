import { describe, expect, it } from 'vitest';
import { SEED_STORY_DRAFTS, fillInsOf, seedStories } from '../stories/seedStories';
import { SEED_RESUME } from '../resume/resume';
import { COMPETENCIES } from '../behavioral/competencies';

const words = (s: string) => s.trim().split(/\s+/).length;
const stories = seedStories('2026-10-17T00:00:00.000Z');

describe('seed stories', () => {
  it('cover every resume item, with unique ids', () => {
    const ids = new Set(SEED_RESUME.items.map((i) => i.id));
    for (const i of ids) expect(stories.some((s) => s.resumeItemId === i), i).toBe(true);
    for (const s of stories) expect(ids.has(s.resumeItemId), s.id).toBe(true);
    expect(new Set(stories.map((s) => s.id)).size).toBe(stories.length);
  });

  it('have a 60–90 second spoken version and a ~20 second short version', () => {
    for (const s of stories) {
      expect(words(s.spoken), `${s.id} spoken`).toBeGreaterThanOrEqual(150);
      expect(words(s.spoken), `${s.id} spoken`).toBeLessThanOrEqual(225);
      expect(words(s.short), `${s.id} short`).toBeGreaterThanOrEqual(25);
      expect(words(s.short), `${s.id} short`).toBeLessThanOrEqual(75);
    }
  });

  it('make Action the longest part, in the first person', () => {
    for (const s of SEED_STORY_DRAFTS) {
      const a = words(s.action);
      expect(a, s.id).toBeGreaterThan(words(s.situation));
      expect(a, s.id).toBeGreaterThan(words(s.task));
      expect(a, s.id).toBeGreaterThanOrEqual(words(s.result));
      expect(/\bI\b/.test(s.action), s.id).toBe(true);
    }
  });

  it('list every [FILL IN] placeholder and use only known competencies', () => {
    const known = new Set(COMPETENCIES.map((c) => c.id));
    for (const s of stories) {
      expect(s.fillIns).toEqual(fillInsOf(s.spoken, s.short));
      for (const c of s.competencies) expect(known.has(c), `${s.id} ${c}`).toBe(true);
      expect(s.competencies.length).toBeGreaterThanOrEqual(2);
      // No malformed placeholders such as "[your detail]" or "[FILL IN]".
      expect(/\[(?!FILL IN: )/.test(s.spoken + s.short), s.id).toBe(false);
    }
  });

  it('have no [FILL IN] left, and list every invented detail as unverified', () => {
    for (const s of stories) {
      expect(s.fillIns, s.id).toEqual([]);
      expect(/FILL IN/i.test([s.title, s.situation, s.task, s.action, s.result, s.short].join(' ')), s.id).toBe(false);
    }
    for (const d of SEED_STORY_DRAFTS) {
      const row = stories.find((s) => s.id === d.id)!;
      // Every seed story now carries app-drafted detail beyond the resume.
      expect(d.unverified?.length ?? 0, d.id).toBeGreaterThan(0);
      expect(row.unverifiedDetails, d.id).toEqual(d.unverified);
      for (const u of row.unverifiedDetails) expect(u.trim().length, d.id).toBeGreaterThan(5);
      // The drafting-only field does not leak into the stored Story row.
      expect('unverified' in row, d.id).toBe(false);
    }
  });

  it('end the result with a learning or banking link', () => {
    for (const s of SEED_STORY_DRAFTS) expect(/learn|bank|analyst|deal|client/i.test(s.result), s.id).toBe(true);
  });
});

describe('behavioral question bank', () => {
  it('has 75+ unique questions, each mapped to 1–2 existing stories with an angle', async () => {
    const { BEHAVIORAL_QUESTIONS } = await import('../stories/behavioralQuestions');
    expect(BEHAVIORAL_QUESTIONS.length).toBeGreaterThanOrEqual(75);
    expect(new Set(BEHAVIORAL_QUESTIONS.map((q) => q.id)).size).toBe(BEHAVIORAL_QUESTIONS.length);
    expect(new Set(BEHAVIORAL_QUESTIONS.map((q) => q.prompt)).size).toBe(BEHAVIORAL_QUESTIONS.length);
    const ids = new Set(stories.map((s) => s.id));
    for (const q of BEHAVIORAL_QUESTIONS) {
      expect(q.storyMatches.length, q.id).toBeGreaterThanOrEqual(1);
      expect(q.storyMatches.length, q.id).toBeLessThanOrEqual(2);
      for (const m of q.storyMatches) {
        expect(ids.has(m.storyId), `${q.id} → ${m.storyId}`).toBe(true);
        expect(m.angle.length).toBeGreaterThan(10);
      }
      expect(q.rubric.length).toBeGreaterThanOrEqual(5);
    }
  });

  it('includes the essential IB questions', async () => {
    const { BEHAVIORAL_QUESTIONS } = await import('../stories/behavioralQuestions');
    const prompts = BEHAVIORAL_QUESTIONS.map((q) => q.prompt.toLowerCase()).join('\n');
    for (const must of ['a time you failed', 'biggest weakness', 'disagreed with a teammate', 'led without formal authority', 'mistake under pressure', 'most difficult decision']) {
      expect(prompts).toContain(must);
    }
  });

  it('gives every story at least one question and every competency at least two stories or a flagged gap', async () => {
    const { BEHAVIORAL_QUESTIONS } = await import('../stories/behavioralQuestions');
    const used = new Set(BEHAVIORAL_QUESTIONS.flatMap((q) => q.storyMatches.map((m) => m.storyId)));
    for (const s of stories) expect(used.has(s.id), s.id).toBe(true);
  });
});
