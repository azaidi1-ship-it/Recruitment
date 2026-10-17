import type { CheatSheet, Flashcard, Lesson, SectionId, WorkedExample } from '../types/models';
import type { Question } from '../types/questions';
import { HIREVUE_QUESTIONS } from './hirevue/questions';
import { accounting } from './sections/01-accounting';
import { walkthroughs } from './sections/02-walkthroughs';
import { evEquity } from './sections/03-ev-equity';
import { valuation } from './sections/04-valuation';
import { comps } from './sections/05-comps';
import { dcf } from './sections/06-dcf';
import { mna } from './sections/07-mna';
import { lbo } from './sections/08-lbo';
import { restructuring } from './sections/09-restructuring';
import { mentalMath } from './sections/10-mental-math';
import { markets } from './sections/11-markets';
import { fit } from './sections/12-fit';
import { CURVEBALLS } from './superday/curveballs';

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
 */
const REGISTRY: Partial<Record<SectionId, SectionContent>> = {
  accounting,
  walkthroughs,
  'ev-equity': evEquity,
  valuation,
  comps,
  dcf,
  mna,
  lbo,
  restructuring,
  'mental-math': mentalMath,
  markets,
  fit,
};

// Curveballs live in one file but belong to their sections' Boss Fight pools.
for (const [id, extra] of Object.entries(CURVEBALLS) as [SectionId, Question[]][]) {
  const c = REGISTRY[id];
  if (c) REGISTRY[id] = { ...c, questions: [...c.questions, ...extra] };
}

/** Every registered section's content (for tests and global search). */
export function allSectionContent(): [SectionId, SectionContent][] {
  return Object.entries(REGISTRY) as [SectionId, SectionContent][];
}

export function getSectionContent(id: SectionId): SectionContent {
  return REGISTRY[id] ?? EMPTY;
}

let questionIndex: Map<string, Question> | null = null;

/** Any question by id: section banks plus the HireVue bank. */
export function getQuestion(id: string): Question | undefined {
  if (!questionIndex) {
    questionIndex = new Map();
    for (const c of Object.values(REGISTRY)) for (const q of c?.questions ?? []) questionIndex.set(q.id, q);
    for (const q of HIREVUE_QUESTIONS) questionIndex.set(q.id, q);
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

let flashcardIndex: Map<string, Flashcard> | null = null;

/** Any flashcard (authored or formula-derived) by id. */
export function getFlashcard(id: string): Flashcard | undefined {
  if (!flashcardIndex) {
    flashcardIndex = new Map();
    for (const [sectionId] of allSectionContent()) for (const f of getFlashcardDeck(sectionId)) flashcardIndex.set(f.id, f);
  }
  return flashcardIndex.get(id);
}

let sectionQuestionIds: Map<SectionId, Set<string>> | null = null;

/** True if the question belongs to the section's own bank (so it can be redone and reviewed there). */
export function isSectionQuestion(sectionId: SectionId, questionId: string): boolean {
  if (!sectionQuestionIds) {
    sectionQuestionIds = new Map(allSectionContent().map(([id, c]) => [id, new Set(c.questions.map((q) => q.id))]));
  }
  return sectionQuestionIds.get(sectionId)?.has(questionId) ?? false;
}
