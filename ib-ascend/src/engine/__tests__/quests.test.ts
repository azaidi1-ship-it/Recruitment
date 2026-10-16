import { describe, expect, it } from 'vitest';
import { applyQuestEvent, generateDailyQuests, type QuestGenInput } from '../quests';
import { SECTIONS } from '../../content/sections';
import type { SectionId } from '../../types/models';

const mastery = Object.fromEntries(SECTIONS.map((s) => [s.id, 0])) as Record<SectionId, number>;
const input: QuestGenInput = {
  date: '2026-10-16',
  stats: { accounting: 90, valuation: 80, modeling: 70, speed: 10, marketIq: 20, polish: 5 },
  mastery,
  unlocked: ['accounting', 'mental-math', 'markets', 'fit'],
  cardsDue: 0,
  openMistakes: 0,
};

describe('generateDailyQuests', () => {
  it('creates 3 quests aimed at the 3 weakest stats', () => {
    const qs = generateDailyQuests(input);
    expect(qs).toHaveLength(3);
    expect(new Set(qs.map((q) => q.stat))).toEqual(new Set(['polish', 'speed', 'marketIq']));
  });

  it('is deterministic for a date and varies across dates', () => {
    expect(generateDailyQuests(input)).toEqual(generateDailyQuests(input));
    const titles = new Set(
      ['2026-10-16', '2026-10-17', '2026-10-18', '2026-10-19', '2026-10-20'].map((date) =>
        generateDailyQuests({ ...input, date })
          .map((q) => q.templateId)
          .join(),
      ),
    );
    expect(titles.size).toBeGreaterThan(1);
  });

  it('never targets a locked section', () => {
    for (const date of ['2026-10-16', '2026-10-17', '2026-10-18', '2026-10-19']) {
      const qs = generateDailyQuests({
        ...input,
        date,
        stats: { accounting: 0, valuation: 1, modeling: 2, speed: 50, marketIq: 50, polish: 50 },
      });
      for (const q of qs) if (q.sectionId) expect(input.unlocked).toContain(q.sectionId);
    }
  });

  it('swaps in a review quest when 10+ cards are due, else a mistakes quest when 5+ are open', () => {
    expect(generateDailyQuests({ ...input, cardsDue: 12 }).map((q) => q.templateId)).toContain('gen-review');
    const m = generateDailyQuests({ ...input, openMistakes: 6 });
    expect(m.map((q) => q.templateId)).toContain('gen-mistakes');
    expect(m).toHaveLength(3);
  });
});

describe('applyQuestEvent', () => {
  const at = '2026-10-16T12:00:00.000Z';
  const quest = {
    id: 'q1',
    date: '2026-10-16',
    templateId: 'acc-correct',
    title: 'Answer 2 Accounting questions correctly',
    stat: 'accounting' as const,
    sectionId: 'accounting' as const,
    metric: 'correctAnswers' as const,
    target: 2,
    progress: 0,
    xpReward: 80,
    completedAt: null,
  };

  it('counts matching events, completes once, and ignores other sections', () => {
    const hit = { kind: 'attempt' as const, sectionId: 'accounting' as const, correct: true, flawlessWalkthrough: false };
    const miss = { ...hit, sectionId: 'dcf' as const };
    let r = applyQuestEvent([quest], miss, at);
    expect(r.quests[0]?.progress).toBe(0);
    r = applyQuestEvent(r.quests, hit, at);
    expect(r.completed).toHaveLength(0);
    r = applyQuestEvent(r.quests, hit, at);
    expect(r.completed).toHaveLength(1);
    expect(r.quests[0]?.completedAt).toBe(at);
    r = applyQuestEvent(r.quests, hit, at);
    expect(r.completed).toHaveLength(0);
    expect(r.quests[0]?.progress).toBe(2);
  });

  it('applies the minimum score on session quests', () => {
    const q = { ...quest, metric: 'sessionScore' as const, target: 1, minScore: 0.8 };
    const ev = (score: number) => ({ kind: 'session' as const, sectionId: 'accounting' as const, mode: 'post' as const, score });
    expect(applyQuestEvent([q], ev(0.79), at).completed).toHaveLength(0);
    expect(applyQuestEvent([q], ev(0.8), at).completed).toHaveLength(1);
  });
});
