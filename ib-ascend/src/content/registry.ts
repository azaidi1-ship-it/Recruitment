import type { CheatSheet, Flashcard, Lesson, SectionId, WorkedExample } from '../types/models';
import type { Question } from '../types/questions';
import { accounting } from './sections/01-accounting';

export interface SectionContent {
  /**
   * 'starter' = partial content used while building the app; 'complete' =
   * meets the content minimums (enforced by content tests).
   */
  status: 'empty' | 'starter' | 'complete';
  lessons: Lesson[];
  examples: WorkedExample[];
  questions: Question[];
  flashcards: Flashcard[];
  cheatSheet: CheatSheet | null;
}

const EMPTY: SectionContent = { status: 'empty', lessons: [], examples: [], questions: [], flashcards: [], cheatSheet: null };

/**
 * Section content, keyed by section id. Each section folder in
 * src/content/sections/ exports a SectionContent and is registered here.
 * TODO(Phases 4–6): register sections 1–12 as their content is written.
 */
const REGISTRY: Partial<Record<SectionId, SectionContent>> = {
  accounting,
};

/** Every registered section's content (for tests and global search). */
export function allSectionContent(): [SectionId, SectionContent][] {
  return Object.entries(REGISTRY) as [SectionId, SectionContent][];
}

export function getSectionContent(id: SectionId): SectionContent {
  return REGISTRY[id] ?? EMPTY;
}

let questionIndex: Map<string, Question> | null = null;

export function getQuestion(id: string): Question | undefined {
  if (!questionIndex) {
    questionIndex = new Map();
    for (const c of Object.values(REGISTRY)) for (const q of c?.questions ?? []) questionIndex.set(q.id, q);
  }
  return questionIndex.get(id);
}

/**
 * The section's flashcard deck: authored flashcards plus one card per
 * formula callout in the reading, so every key formula gets drilled.
 */
export function getFlashcardDeck(id: SectionId): Flashcard[] {
  const c = getSectionContent(id);
  const fromFormulas: Flashcard[] = c.lessons.flatMap((lesson) =>
    lesson.blocks.flatMap((b, i) =>
      b.kind === 'formula'
        ? [
            {
              id: `${lesson.id}-f${i}`,
              sectionId: id,
              subtopic: '',
              front: b.title,
              back: b.lines.join('\n'),
            },
          ]
        : [],
    ),
  );
  return [...c.flashcards, ...fromFormulas];
}
