import { useParams } from 'react-router-dom';
import { SECTION_BY_ID } from '../../content/sections';
import { getSectionContent } from '../../content/registry';
import { sectionSteps } from '../../engine/unlocks';
import { useGameStore } from '../../store/useGameStore';
import { useProgressStore } from '../../store/useProgressStore';
import type { SectionId } from '../../types/models';

/** Section, its content, progress and step states for the current route. */
export function useSection() {
  const { sectionId } = useParams();
  const section = sectionId && sectionId in SECTION_BY_ID ? SECTION_BY_ID[sectionId as SectionId] : null;
  const progressMap = useProgressStore((s) => s.sections);
  const snapshot = useGameStore((s) => s.snapshot);
  if (!section || !snapshot) return null;
  const content = getSectionContent(section.id);
  const progress = progressMap[section.id];
  const steps = sectionSteps(progress, { lessons: content.lessons.length, examples: content.examples.length });
  return {
    section,
    content,
    progress,
    steps,
    unlocked: snapshot.unlocked.includes(section.id),
    mastery: snapshot.mastery[section.id],
    grade: snapshot.grades[section.id],
  };
}

export type SectionCtx = NonNullable<ReturnType<typeof useSection>>;
