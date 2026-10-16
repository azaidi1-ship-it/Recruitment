import { STATS } from '../config/gameConfig';
import { SECTIONS } from '../content/sections';
import type { CompetencyId, SectionId, StatKey } from '../types/models';

export interface StatsInput {
  /** Section mastery 0–1. */
  mastery: Record<SectionId, number>;
  /** Fraction of competencies with ≥ 2 stories, 0–1. */
  storyCoverage: number;
  /** Average recent behavioral practice score, 0–1, or null if none. */
  behavioralPractice: number | null;
  /** Recent Mental Math Arcade accuracy, 0–1, or null if none. */
  arcadeAccuracy: number | null;
}

export type Stats = Record<StatKey, number>;

const STAT_KEYS: StatKey[] = ['accounting', 'valuation', 'modeling', 'speed', 'marketIq', 'polish'];

/** Mastery-weighted average over the sections that feed `stat`, 0–1. */
function sectionDriven(stat: StatKey, mastery: Record<SectionId, number>): number {
  let num = 0;
  let den = 0;
  for (const s of SECTIONS) {
    const w = s.statWeights[stat] ?? 0;
    if (w <= 0) continue;
    num += w * (mastery[s.id] ?? 0);
    den += w;
  }
  return den > 0 ? num / den : 0;
}

/** RPG stats, each 0–100. */
export function computeStats(input: StatsInput): Stats {
  const out = {} as Stats;
  for (const k of STAT_KEYS) out[k] = sectionDriven(k, input.mastery);

  if (input.arcadeAccuracy !== null) {
    out.speed = (1 - STATS.speedArcadeWeight) * out.speed + STATS.speedArcadeWeight * input.arcadeAccuracy;
  }
  const p = STATS.polish;
  out.polish =
    p.fitMastery * (input.mastery.fit ?? 0) +
    p.storyCoverage * input.storyCoverage +
    p.practice * (input.behavioralPractice ?? 0);

  for (const k of STAT_KEYS) out[k] = Math.round(Math.min(1, Math.max(0, out[k])) * 100);
  return out;
}

/** Fraction of competencies with at least `STATS.storiesPerCompetency` stories. */
export function storyCoverage(
  stories: { competencies: CompetencyId[] }[],
  allCompetencies: CompetencyId[],
): number {
  if (allCompetencies.length === 0) return 0;
  const counts = new Map<CompetencyId, number>();
  for (const s of stories) for (const c of new Set(s.competencies)) counts.set(c, (counts.get(c) ?? 0) + 1);
  const covered = allCompetencies.filter((c) => (counts.get(c) ?? 0) >= STATS.storiesPerCompetency).length;
  return covered / allCompetencies.length;
}
