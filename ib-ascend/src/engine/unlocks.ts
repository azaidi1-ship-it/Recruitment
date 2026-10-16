import { UNLOCK } from '../config/gameConfig';
import type { Section, SectionId, SectionProgress, SectionStep } from '../types/models';

export type ProgressMap = Record<SectionId, SectionProgress>;

/** A section is cleared for prerequisite purposes once its post-quiz is passed. */
export function isCleared(p: SectionProgress | undefined): boolean {
  return Boolean(p?.postQuizPassedAt);
}

export function isSectionUnlocked(section: Section, progress: ProgressMap): boolean {
  return section.alwaysOpen || section.prerequisites.every((id) => isCleared(progress[id]));
}

/** Prerequisites still blocking a section (empty when unlocked). */
export function missingPrerequisites(section: Section, progress: ProgressMap): SectionId[] {
  if (section.alwaysOpen) return [];
  return section.prerequisites.filter((id) => !isCleared(progress[id]));
}

export type StepState = 'locked' | 'available' | 'done' | 'skipped';

export interface SectionContentCounts {
  lessons: number;
  examples: number;
}

/**
 * State of each step inside a section, in order:
 * pre-quiz → reading → worked examples → post-quiz → mock.
 * A pre-quiz ≥ 90% fast-tracks: reading and examples become optional and the
 * post-quiz opens immediately. The mock needs a post-quiz ≥ 80%.
 */
export function sectionSteps(p: SectionProgress, counts: SectionContentCounts): Record<SectionStep, StepState> {
  const preDone = p.preQuizScore !== null;
  const readingDone = counts.lessons > 0 && p.lessonsRead.length >= counts.lessons;
  const examplesDone = counts.examples > 0 && p.examplesCompleted.length >= counts.examples;
  const fast = p.fastTracked;

  const reading: StepState = !preDone ? 'locked' : readingDone ? 'done' : fast ? 'skipped' : 'available';
  const examples: StepState = !preDone
    ? 'locked'
    : examplesDone
      ? 'done'
      : fast
        ? 'skipped'
        : readingDone
          ? 'available'
          : 'locked';
  const postOpen = preDone && (fast || (readingDone && examplesDone));
  const postQuiz: StepState = p.postQuizPassedAt ? 'done' : postOpen ? 'available' : 'locked';
  const mock: StepState = !p.postQuizPassedAt ? 'locked' : p.mockBest !== null ? 'done' : 'available';

  return { preQuiz: preDone ? 'done' : 'available', reading, examples, postQuiz, mock };
}

export function qualifiesForFastTrack(preQuizScore: number): boolean {
  return preQuizScore >= UNLOCK.fastTrack - 1e-9;
}

export function passesPostQuiz(score: number): boolean {
  return score >= UNLOCK.postQuizPass - 1e-9;
}
