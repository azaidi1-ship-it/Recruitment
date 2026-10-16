import { describe, expect, it } from 'vitest';
import { SECTIONS } from '../../content/sections';
import { emptySectionProgress } from '../../db/seed';
import { activityGrid, heatLevel, mockSeries, weakestSubtopics } from '../analytics';
import { interviewReadiness } from '../readiness';
import { nextBestAction, type NextActionInput } from '../recommend';
import { buildDrill } from '../quiz/builder';
import { getSectionContent } from '../../content/registry';
import { mulberry32 } from '../../lib/random';
import type { SectionId, SectionProgress } from '../../types/models';

const ids = SECTIONS.map((s) => s.id);
const zero = Object.fromEntries(ids.map((id) => [id, 0])) as Record<SectionId, number>;

describe('interviewReadiness', () => {
  it('is 0 with no mastery and 100 with everything mastered', () => {
    expect(interviewReadiness(SECTIONS, zero, 0).score).toBe(0);
    const full = Object.fromEntries(ids.map((id) => [id, 1])) as Record<SectionId, number>;
    expect(interviewReadiness(SECTIONS, full, 100).score).toBe(100);
  });

  it('weights sections by interview frequency and uses Polish for Fit', () => {
    const total = SECTIONS.reduce((n, s) => n + s.interviewWeight, 0); // 110
    const r = interviewReadiness(SECTIONS, { ...zero, dcf: 1, fit: 1 }, 50);
    // DCF 12/110 × 1 + Fit 18/110 × 0.5 = 0.1091 + 0.0818 = 19.1
    expect(total).toBe(110);
    expect(r.score).toBe(19);
    expect(r.parts.find((p) => p.sectionId === 'fit')!.value).toBe(0.5);
  });

  it('names the three biggest levers', () => {
    const r = interviewReadiness(SECTIONS, zero, 0);
    expect(r.levers.map((l) => l.sectionId)).toEqual(['fit', 'walkthroughs', 'dcf']);
  });
});

describe('activityGrid', () => {
  it('builds Monday-first weeks ending today and bins counts', () => {
    // 2026-10-16 is a Friday.
    const g = activityGrid(
      ['2026-10-16T09:00:00', '2026-10-16T10:00:00', '2026-10-12T10:00:00'],
      '2026-10-16',
      2,
      [1, 10, 25, 50],
    );
    expect(g.weeks).toHaveLength(2);
    expect(g.weeks[0]![0]!.date).toBe('2026-10-05');
    expect(g.weeks[1]).toHaveLength(5); // Mon–Fri of this week
    expect(g.weeks[1]![4]).toMatchObject({ date: '2026-10-16', count: 2, level: 1 });
    expect(g.total).toBe(3);
    expect(g.activeDays).toBe(2);
  });

  it('maps counts to levels', () => {
    expect([0, 1, 9, 10, 25, 60].map((c) => heatLevel(c, [1, 10, 25, 50]))).toEqual([0, 1, 1, 2, 3, 4]);
  });
});

describe('mockSeries', () => {
  it('keeps finished mocks for the section, oldest first', () => {
    const s = mockSeries(
      [
        { mode: 'mock', sectionId: 'dcf', startedAt: '2026-10-10T10:00:00', finishedAt: '2026-10-10T10:20:00', score: 0.7 },
        { mode: 'mock', sectionId: 'dcf', startedAt: '2026-10-01T10:00:00', finishedAt: '2026-10-01T10:20:00', score: 0.5 },
        { mode: 'post', sectionId: 'dcf', startedAt: '2026-10-02T10:00:00', finishedAt: '2026-10-02T10:20:00', score: 0.9 },
        { mode: 'mock', sectionId: 'lbo', startedAt: '2026-10-03T10:00:00', finishedAt: '2026-10-03T10:20:00', score: 0.9 },
      ],
      'dcf',
    );
    expect(s.map((p) => [p.run, p.score])).toEqual([
      [1, 50],
      [2, 70],
    ]);
  });
});

describe('weakestSubtopics', () => {
  const base = {
    sections: SECTIONS,
    unlocked: ['accounting', 'fit'] as SectionId[],
    questionCounts: { 'accounting/linkages': 5, 'accounting/revenue': 5, 'accounting/wc': 5, 'fit/why-ib': 5, 'dcf/fcf': 5 },
    ceiling: 0.85,
    n: 3,
  };

  it('ranks tested subtopics by mastery, then untested ones in started sections', () => {
    const s = SECTIONS.find((x) => x.id === 'accounting')!;
    const [a, b, c] = s.subtopics.map((t) => `accounting/${t.id}`);
    const r = weakestSubtopics({
      ...base,
      questionCounts: { [a!]: 5, [b!]: 5, [c!]: 5, 'fit/why-ib': 5 },
      subtopicMastery: { [a!]: 0.9, [b!]: 0.3 },
      subtopicAttempts: { [a!]: 10, [b!]: 4 },
    });
    expect(r.map((x) => `${x.sectionId}/${x.subtopicId}`)).toEqual([b, c]);
    expect(r[1]!.attempts).toBe(0);
  });

  it('is empty before any attempts', () => {
    expect(weakestSubtopics({ ...base, subtopicMastery: {}, subtopicAttempts: {} })).toEqual([]);
  });
});

describe('nextBestAction', () => {
  const progress = Object.fromEntries(ids.map((id) => [id, emptySectionProgress(id)])) as Record<SectionId, SectionProgress>;
  const input = (patch: Partial<NextActionInput> = {}): NextActionInput => ({
    sections: SECTIONS,
    unlocked: ['accounting', 'mental-math', 'markets', 'fit'],
    progress,
    lessonIds: Object.fromEntries(ids.map((id) => [id, getSectionContent(id).lessons.map((l) => l.id)])) as Record<SectionId, string[]>,
    hasQuestions: Object.fromEntries(ids.map((id) => [id, true])) as Record<SectionId, boolean>,
    cardsDue: 0,
    mistakesBySection: {},
    weakest: null,
    grades: Object.fromEntries(ids.map((id) => [id, null])) as NextActionInput['grades'],
    ...patch,
  });
  const withProgress = (id: SectionId, p: Partial<SectionProgress>) => ({ ...progress, [id]: { ...progress[id], ...p } });

  it('starts with the first section’s pre-quiz', () => {
    expect(nextBestAction(input())).toMatchObject({ kind: 'preQuiz', to: '/section/accounting/quiz/pre' });
  });

  it('puts a large review backlog first', () => {
    expect(nextBestAction(input({ cardsDue: 20 })).kind).toBe('review');
  });

  it('continues the section in progress with the next unread chapter', () => {
    const a = nextBestAction(input({ progress: withProgress('accounting', { preQuizScore: 0.5, lessonsRead: ['acc-l1'] }) }));
    expect(a).toMatchObject({ kind: 'read', to: '/section/accounting/read/acc-l2' });
  });

  it('sends a fast-tracked section straight to the post-quiz', () => {
    const a = nextBestAction(input({ progress: withProgress('accounting', { preQuizScore: 0.95, fastTracked: true }) }));
    expect(a.kind).toBe('postQuiz');
  });

  it('asks for the Boss Fight once the post-quiz is passed', () => {
    const a = nextBestAction(
      input({ progress: withProgress('accounting', { preQuizScore: 0.5, postQuizBest: 0.85, postQuizPassedAt: '2026-10-10T00:00:00Z' }) }),
    );
    expect(a).toMatchObject({ kind: 'mock', to: '/section/accounting/quiz/mock' });
  });

  it('then reviews, then mistakes, then weak subtopics', () => {
    expect(nextBestAction(input({ cardsDue: 3 })).kind).toBe('review');
    expect(nextBestAction(input({ mistakesBySection: { markets: 6, accounting: 2 } })).to).toBe('/section/markets/quiz/mistakes');
    const weakest = { sectionId: 'accounting' as const, sectionTitle: 'Accounting', subtopicId: 'linkages', title: 'Linkages', mastery: 0.3, attempts: 5 };
    expect(nextBestAction(input({ weakest })).to).toBe('/section/accounting/quiz/drill?subtopic=linkages');
  });
});

describe('buildDrill', () => {
  const qs = getSectionContent('dcf').questions;
  const sub = qs[0]!.subtopic;

  it('draws only from the subtopic, unseen questions first, easiest first', () => {
    const all = qs.filter((q) => q.subtopic === sub);
    const correct = new Set(all.slice(0, 2).map((q) => q.id));
    const d = buildDrill(qs, sub, mulberry32(1), 4, correct);
    expect(d.items.every((i) => i.question.subtopic === sub)).toBe(true);
    expect(d.items).toHaveLength(Math.min(4, all.length));
    if (all.length - correct.size >= 4) expect(d.items.some((i) => correct.has(i.question.id))).toBe(false);
    const rank = { basic: 0, intermediate: 1, advanced: 2, elite: 3 };
    const ranks = d.items.map((i) => rank[i.question.difficulty]);
    expect(ranks).toEqual([...ranks].sort((a, b) => a - b));
    expect(d.timeLimitSec).toBeNull();
  });
});
