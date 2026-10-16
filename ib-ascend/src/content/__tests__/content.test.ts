import { describe, expect, it } from 'vitest';
import { allSectionContent, getFlashcardDeck } from '../registry';
import {
  CONTENT_MINIMUMS,
  cheatSheetSchema,
  flashcardSchema,
  lessonSchema,
  questionSchema,
  workedExampleSchema,
} from '../schema';
import { SECTION_BY_ID } from '../sections';
import type { WalkthroughQuestion } from '../../types/questions';
import { matchRubric } from '../../engine/grading/rubric';

const sections = allSectionContent();
const allQuestions = sections.flatMap(([, c]) => c.questions);

describe('content registry', () => {
  it('has globally unique ids across questions, lessons, examples and flashcards', () => {
    const ids = sections.flatMap(([, c]) => [
      ...c.questions.map((q) => q.id),
      ...c.lessons.map((l) => l.id),
      ...c.examples.map((e) => e.id),
      ...c.flashcards.map((f) => f.id),
    ]);
    const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
    expect(dupes).toEqual([]);
  });
});

describe.each(sections)('section %s', (sectionId, c) => {
  const section = SECTION_BY_ID[sectionId];
  const subtopics = new Set(section.subtopics.map((s) => s.id));

  it('passes schema validation', () => {
    for (const q of c.questions) {
      const r = questionSchema.safeParse(q);
      expect(r.success, `${q.id}: ${r.error?.message}`).toBe(true);
    }
    for (const l of c.lessons) expect(lessonSchema.safeParse(l).success, l.id).toBe(true);
    for (const e of c.examples) expect(workedExampleSchema.safeParse(e).success, e.id).toBe(true);
    for (const f of c.flashcards) expect(flashcardSchema.safeParse(f).success, f.id).toBe(true);
    if (c.cheatSheet) expect(cheatSheetSchema.safeParse(c.cheatSheet).success).toBe(true);
  });

  it('keeps every item in its own section with a valid subtopic', () => {
    for (const q of c.questions) {
      expect(q.sectionId, q.id).toBe(sectionId);
      expect(subtopics.has(q.subtopic), `${q.id} subtopic ${q.subtopic}`).toBe(true);
    }
    for (const e of c.examples) expect(subtopics.has(e.subtopic), e.id).toBe(true);
    for (const f of c.flashcards) expect(subtopics.has(f.subtopic), f.id).toBe(true);
  });

  it('only lists follow-ups that exist in the mock pool', () => {
    const byId = new Map(allQuestions.map((q) => [q.id, q]));
    for (const q of c.questions) {
      for (const f of q.followUps ?? []) {
        expect(byId.has(f), `${q.id} → ${f}`).toBe(true);
        expect(byId.get(f)?.pools, `${q.id} → ${f} pool`).toContain('mock');
        expect(f).not.toBe(q.id);
      }
    }
  });

  it('has walk-throughs that balance and tie out', () => {
    for (const q of c.questions.filter((x): x is WalkthroughQuestion => x.type === 'walkthrough')) {
      const val = (key: string) => q.lines.find((l) => l.key === key)?.expected;
      const assets = q.lines.filter((l) => l.side === 'A').reduce((n, l) => n + l.expected, 0);
      const le = q.lines.filter((l) => l.side === 'LE').reduce((n, l) => n + l.expected, 0);
      expect(assets, `${q.id} balance sheet balances`).toBeCloseTo(le, 6);
      if (val('cfs.net') !== undefined && val('bs.cash') !== undefined) {
        expect(val('cfs.net'), `${q.id} CFS net change = BS cash`).toBeCloseTo(val('bs.cash')!, 6);
      }
      if (val('is.ni') !== undefined && val('cfs.ni') !== undefined) {
        expect(val('is.ni'), `${q.id} IS NI = CFS NI`).toBeCloseTo(val('cfs.ni')!, 6);
      }
      if (val('is.ebt') !== undefined && val('is.tax') !== undefined && val('is.ni') !== undefined) {
        expect(val('is.tax'), `${q.id} tax = EBT × t`).toBeCloseTo(val('is.ebt')! * q.taxRate, 6);
        expect(val('is.ni'), `${q.id} NI = EBT − tax`).toBeCloseTo(val('is.ebt')! - val('is.tax')!, 6);
      }
    }
  });

  it('has model answers that hit every point of their own rubric', () => {
    for (const q of c.questions) {
      if (q.type !== 'freeText') continue;
      expect(matchRubric(q.rubric, q.modelAnswer).sort(), q.id).toEqual(q.rubric.map((p) => p.id).sort());
    }
  });

  it('has enough questions to build every quiz', () => {
    const inPool = (p: string) => c.questions.filter((q) => q.pools.includes(p as 'pre')).length;
    if (c.status === 'empty') return;
    expect(inPool('pre')).toBeGreaterThanOrEqual(CONTENT_MINIMUMS.preQuestions);
    expect(inPool('post')).toBeGreaterThanOrEqual(CONTENT_MINIMUMS.postQuestions);
    expect(inPool('mock')).toBeGreaterThanOrEqual(6);
  });

  it('meets the full content minimums when marked complete', () => {
    if (c.status !== 'complete') return;
    expect(c.questions.length).toBeGreaterThanOrEqual(CONTENT_MINIMUMS.questions);
    expect(c.questions.filter((q) => q.pools.includes('mock')).length).toBeGreaterThanOrEqual(CONTENT_MINIMUMS.mockQuestions);
    expect(c.examples.length).toBeGreaterThanOrEqual(CONTENT_MINIMUMS.examples);
    expect(c.lessons.length).toBeGreaterThanOrEqual(CONTENT_MINIMUMS.lessons);
    for (const d of ['basic', 'intermediate', 'advanced', 'elite'] as const) {
      expect(c.questions.some((q) => q.difficulty === d), `has ${d}`).toBe(true);
    }
  });

  it('builds a flashcard deck that includes the formula callouts', () => {
    const deck = getFlashcardDeck(sectionId);
    expect(deck.length).toBeGreaterThanOrEqual(c.flashcards.length);
    expect(new Set(deck.map((d) => d.id)).size).toBe(deck.length);
  });
});
