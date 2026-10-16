import type { SectionContent } from '../../registry';
import { cheatSheet } from './cheatsheet';
import { examples } from './examples';
import { flashcards } from './flashcards';
import { lessons } from './lessons';
import { questions } from './questions';

export const evEquity: SectionContent = { status: 'complete', lessons, examples, questions, flashcards, cheatSheet };
