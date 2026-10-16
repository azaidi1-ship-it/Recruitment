import type { SectionContent } from '../../registry';
import { cheatSheet } from './cheatsheet';
import { examples } from './examples';
import { flashcards } from './flashcards';
import { lessons } from './lessons';
import { questions } from './questions';

export const accounting: SectionContent = {
  // TODO(Phase 4): switch to 'complete' once the bank meets CONTENT_MINIMUMS.
  status: 'starter',
  lessons,
  examples,
  questions,
  flashcards,
  cheatSheet,
};
