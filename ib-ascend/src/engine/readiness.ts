import type { Section, SectionId } from '../types/models';

export interface ReadinessPart {
  sectionId: SectionId;
  title: string;
  weight: number;
  /** 0–1: section mastery, or behavioral readiness for Fit. */
  value: number;
  /** Points (out of 100) this section currently contributes. */
  points: number;
  /** Points still available from this section. */
  gap: number;
}

export interface Readiness {
  /** 0–100, rounded. */
  score: number;
  parts: ReadinessPart[];
  /** The three sections with the most points still available. */
  levers: ReadinessPart[];
}

/**
 * Interview Readiness Score: mastery weighted by how often each section comes
 * up in real interviews (`interviewWeight`). Fit uses behavioral readiness
 * instead of its section mastery alone: the Polish stat, which blends Fit
 * mastery, Story Bank coverage and practice scores.
 */
export function interviewReadiness(
  sections: Pick<Section, 'id' | 'title' | 'interviewWeight'>[],
  mastery: Record<SectionId, number>,
  polish: number,
): Readiness {
  const total = sections.reduce((n, s) => n + s.interviewWeight, 0) || 1;
  const parts = sections.map((s) => {
    const value = clamp01(s.id === 'fit' ? polish / 100 : (mastery[s.id] ?? 0));
    const share = (s.interviewWeight / total) * 100;
    return { sectionId: s.id, title: s.title, weight: s.interviewWeight, value, points: share * value, gap: share * (1 - value) };
  });
  const score = Math.round(parts.reduce((n, p) => n + p.points, 0));
  const levers = [...parts].filter((p) => p.gap > 0.05).sort((a, b) => b.gap - a.gap).slice(0, 3);
  return { score, parts, levers };
}

function clamp01(x: number): number {
  return Math.min(1, Math.max(0, x));
}
