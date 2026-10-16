import type { SectionContent } from '../../registry';
import { cheatSheet } from './cheatsheet';
import { examples } from './examples';
import { flashcards } from './flashcards';
import { lessons } from './lessons';
import { questions } from './questions';
import { questions2 } from './questions2';

export const accounting: SectionContent = {
  status: 'complete',
  lessons,
  examples,
  questions: [...questions, ...questions2],
  flashcards,
  cheatSheet,
};
