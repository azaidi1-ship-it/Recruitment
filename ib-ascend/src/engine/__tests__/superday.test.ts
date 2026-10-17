import { describe, expect, it } from 'vitest';
import { PERSONAS, PERSONA_BY_ID } from '../../content/superday/personas';
import { firstPerson, resumeProbes, shortOrg } from '../../content/superday/probes';
import { CURVEBALLS } from '../../content/superday/curveballs';
import { SEED_RESUME } from '../../content/resume/resume';
import { CANDIDATE_BACKSTORY } from '../../content/resume/backstory';
import { getSectionContent } from '../../content/registry';
import { SECTIONS } from '../../content/sections';
import { matchRubric, scoreRubric } from '../grading/rubric';
import { buildSuperday, scoreSuperday, type SuperdayAnswer } from '../superday';
import { timeBudgetSec } from '../quiz/builder';
import { mulberry32 } from '../../lib/random';
import type { SectionId } from '../../types/models';
import type { Question } from '../../types/questions';

const technical = Object.fromEntries(
  SECTIONS.filter((s) => s.id !== 'fit').map((s) => [s.id, getSectionContent(s.id).questions]),
) as Partial<Record<SectionId, Question[]>>;
const behavioral = getSectionContent('fit').questions;
const probes = resumeProbes(SEED_RESUME);

describe('resume probes', () => {
  it('creates one probe per bullet on experience, project and leadership items', () => {
    const bullets = SEED_RESUME.items
      .filter((i) => ['experience', 'project', 'leadership'].includes(i.category))
      .reduce((n, i) => n + i.bullets.length, 0);
    expect(probes).toHaveLength(bullets);
    expect(new Set(probes.map((p) => p.id)).size).toBe(probes.length);
  });

  it('writes model answers from the resume that hit every rubric point', () => {
    for (const p of probes) {
      expect(scoreRubric(p.rubric, matchRubric(p.rubric, p.modelAnswer)), p.id).toBe(1);
      expect(p.modelAnswer).toContain('[your detail');
    }
  });

  it('uses confirmed notes and never invents an outcome', () => {
    const stratus = probes.find((p) => p.id === 'probe-exp-stratus-1')!;
    expect(stratus.prompt).toContain('$250K pre-seed raise');
    expect(stratus.modelAnswer).toContain('The $250K pre-seed raise closed.');
    const ayah = probes.find((p) => p.id === 'probe-exp-ayah-1')!;
    expect(ayah.modelAnswer).toContain('The result was [your detail');
  });

  it('fills probe answers from the candidate backstory when given, keyed by item and bullet', () => {
    const filled = resumeProbes(SEED_RESUME, CANDIDATE_BACKSTORY);
    expect(filled.map((p) => p.id)).toEqual(probes.map((p) => p.id));
    for (const p of filled) {
      expect(scoreRubric(p.rubric, matchRubric(p.rubric, p.modelAnswer)), p.id).toBe(1);
      expect(p.modelAnswer, p.id).not.toContain('[your detail');
    }
    for (const key of Object.keys(CANDIDATE_BACKSTORY.probes ?? {})) expect(filled.some((p) => p.id === `probe-${key}`), key).toBe(true);
    // No result in the backstory: the confirmed note is still used.
    expect(filled.find((p) => p.id === 'probe-exp-stratus-1')!.modelAnswer).toContain('The $250K pre-seed raise closed.');
    // A bullet without a backstory entry keeps its placeholders.
    const partial = resumeProbes(SEED_RESUME, { probes: { 'exp-ayah-1': CANDIDATE_BACKSTORY.probes!['exp-ayah-1']! } });
    expect(partial.find((p) => p.id === 'probe-exp-ayah-1')!.modelAnswer).not.toContain('[your detail');
    expect(partial.find((p) => p.id === 'probe-exp-ayah-2')!.modelAnswer).toContain('[your detail');
  });

  it('turns bullets into first person', () => {
    expect(firstPerson('Built the model.')).toBe('I built the model.');
    expect(firstPerson('Selected to deliver strategy work')).toBe('I was selected to deliver strategy work.');
    expect(shortOrg('180 Degrees Consulting, Swarthmore College')).toBe('180 Degrees Consulting');
    expect(shortOrg('Tata Consultancy Services — GenAI-Powered Data Analytics Externship')).toBe('Tata Consultancy Services');
  });
});

describe('curveballs', () => {
  it('are tagged and live in their sections’ Boss Fight pools', () => {
    for (const [id, qs] of Object.entries(CURVEBALLS)) {
      const bank = new Set(getSectionContent(id as SectionId).questions.map((q) => q.id));
      for (const q of qs ?? []) {
        expect(bank.has(q.id)).toBe(true);
        expect(q.tags).toContain('curveball');
        expect(q.pools).toEqual(['mock']);
      }
    }
  });
});

describe('buildSuperday', () => {
  for (const persona of PERSONAS) {
    it(`fills ${persona.title} rounds to time without repeats`, () => {
      const rounds = buildSuperday({ persona, rounds: 4, minutes: 25, technical, behavioral, probes, rng: mulberry32(11) });
      expect(rounds.map((r) => r.kind)).toEqual(persona.rounds);
      const ids = rounds.flatMap((r) => r.items.map((i) => i.question.id));
      expect(new Set(ids).size).toBe(ids.length);
      for (const r of rounds) {
        const secs = r.items.reduce((n, i) => n + timeBudgetSec(i.question), 0);
        expect(secs).toBeGreaterThanOrEqual(25 * 60 * 0.9);
        expect(secs).toBeLessThanOrEqual(25 * 60 + 600);
        for (const i of r.items) {
          if (i.kind === 'technical') expect(i.question.sectionId).not.toBe('fit');
          if (i.followUpOf) expect(r.items.some((x) => x.question.id === i.followUpOf)).toBe(true);
        }
      }
    });
  }

  it('opens the first behavioral round with the resume walkthrough and mixes in probes', () => {
    const rounds = buildSuperday({ persona: PERSONA_BY_ID.generalist!, rounds: 3, minutes: 25, technical, behavioral, probes, rng: mulberry32(5) });
    const b = rounds.find((r) => r.kind === 'behavioral')!;
    expect(b.items[0]!.question.id).toBe('fit-q-007');
    expect(b.items.some((i) => i.probe)).toBe(true);
    expect(rounds).toHaveLength(3);
  });

  it('favors the persona’s sections and asks curveballs', () => {
    const rx = buildSuperday({ persona: PERSONA_BY_ID.restructuring!, rounds: 4, minutes: 30, technical, behavioral, probes, rng: mulberry32(9) });
    const tech = rx.flatMap((r) => r.items.filter((i) => i.kind === 'technical'));
    const share = tech.filter((i) => i.question.sectionId === 'restructuring').length / tech.length;
    expect(share).toBeGreaterThan(0.15);
    const deep = buildSuperday({ persona: PERSONA_BY_ID['deep-technical']!, rounds: 4, minutes: 30, technical, behavioral, probes, rng: mulberry32(2) });
    expect(deep.flatMap((r) => r.items).some((i) => i.curveball)).toBe(true);
  });

  it('respects a narrower scope', () => {
    const rounds = buildSuperday({ persona: PERSONA_BY_ID['ma-heavy']!, rounds: 3, minutes: 20, technical: { accounting: technical.accounting }, behavioral, probes, rng: mulberry32(1) });
    const tech = rounds.flatMap((r) => r.items.filter((i) => i.kind === 'technical'));
    expect(tech.length).toBeGreaterThan(0);
    expect(tech.every((i) => i.question.sectionId === 'accounting')).toBe(true);
  });
});

describe('scoreSuperday', () => {
  const persona = { weights: { technical: 0.5, structure: 0.2, speed: 0.1, story: 0.2 }, bar: 0.75 };
  const rounds = [
    { index: 0, kind: 'technical' as const },
    { index: 1, kind: 'behavioral' as const },
  ];
  const a = (round: number, kind: 'technical' | 'behavioral', type: Question['type'], score: number, timeMs: number | null, budgetMs = 60_000): SuperdayAnswer => ({
    questionId: `q${round}${score}${type}`,
    round,
    kind,
    type,
    score,
    timeMs,
    budgetMs,
  });

  it('computes each category and the weighted overall', () => {
    const sc = scoreSuperday(
      [a(0, 'technical', 'mcq', 1, 30_000), a(0, 'technical', 'freeText', 0.8, 120_000), a(1, 'behavioral', 'freeText', 0.9, 60_000), a(1, 'behavioral', 'mcq', 1, 20_000)],
      rounds,
      persona,
    );
    expect(sc.categories.technical).toBeCloseTo(0.9);
    expect(sc.categories.story).toBeCloseTo(0.95);
    expect(sc.categories.structure).toBeCloseTo(0.85);
    // pace: min(1, 60/30)=1, 60/120=0.5, 1, 1 → 0.875; all answered
    expect(sc.categories.speed).toBeCloseTo(0.875);
    expect(sc.overall).toBeCloseTo(0.5 * 0.9 + 0.2 * 0.85 + 0.1 * 0.875 + 0.2 * 0.95);
    expect(sc.wouldAdvance).toBe(true);
    expect(sc.strongest).toBe('story');
  });

  it('dings a day with one bad round even when the average clears the bar', () => {
    const sc = scoreSuperday(
      [a(0, 'technical', 'mcq', 1, 10_000), a(0, 'technical', 'mcq', 1, 10_000), a(0, 'technical', 'mcq', 1, 10_000), a(1, 'behavioral', 'mcq', 0.4, 10_000)],
      rounds,
      { ...persona, bar: 0.6 },
    );
    expect(sc.overall).toBeGreaterThan(0.6);
    expect(sc.wouldAdvance).toBe(false);
    expect(sc.reasons.join(' ')).toMatch(/Round 2/);
  });

  it('counts unanswered questions as zero and slows the speed score', () => {
    const sc = scoreSuperday([a(0, 'technical', 'mcq', 1, 30_000), a(0, 'technical', 'mcq', 0, null)], [rounds[0]!], persona);
    expect(sc.categories.technical).toBe(0.5);
    expect(sc.categories.speed).toBeCloseTo(0.5);
    expect(sc.categories.story).toBeNull();
    expect(sc.wouldAdvance).toBe(false);
  });
});
