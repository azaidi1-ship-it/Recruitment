import type { CheatSheet, Flashcard, Lesson, SectionId, WorkedExample } from '../types/models';
import type { Question } from '../types/questions';

export interface SectionContent {
  lessons: Lesson[];
  examples: WorkedExample[];
  questions: Question[];
  flashcards: Flashcard[];
  cheatSheet: CheatSheet | null;
}

const EMPTY: SectionContent = { lessons: [], examples: [], questions: [], flashcards: [], cheatSheet: null };

/**
 * Section content, keyed by section id. Each section folder in
 * src/content/sections/ exports a SectionContent and is registered here.
 * TODO(Phases 4–6): register sections 1–12 as their content is written.
 */
const REGISTRY: Partial<Record<SectionId, SectionContent>> = {};

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
