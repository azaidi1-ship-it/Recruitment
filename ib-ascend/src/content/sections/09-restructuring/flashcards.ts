import type { Flashcard } from '../../../types/models';

export const flashcards: Flashcard[] = [
  { id: 'rx-fc1', sectionId: 'restructuring', subtopic: 'priority-claims', front: 'Priority of claims', back: 'DIP → secured (to collateral value) → admin/priority → unsecured → subordinated → preferred → common.' },
  { id: 'rx-fc2', sectionId: 'restructuring', subtopic: 'priority-claims', front: 'Fulcrum security', back: 'Most senior class not paid in full; usually receives the new equity.' },
  { id: 'rx-fc3', sectionId: 'restructuring', subtopic: 'chapter-11-vs-7', front: 'Chapter 11 vs Chapter 7', back: '11: reorganize, management stays (DIP). 7: liquidate under a trustee.' },
  { id: 'rx-fc4', sectionId: 'restructuring', subtopic: 'chapter-11-vs-7', front: 'Class acceptance in Chapter 11', back: '≥ 2/3 by amount and > 1/2 by number of claims voting.' },
  { id: 'rx-fc5', sectionId: 'restructuring', subtopic: 'chapter-11-vs-7', front: 'Best interests test', back: 'Each dissenting creditor gets at least its Chapter 7 liquidation recovery.' },
  { id: 'rx-fc6', sectionId: 'restructuring', subtopic: 'dip-financing', front: 'Why lend to a bankrupt company (DIP)?', back: 'Super-priority admin status, strong (sometimes priming) liens, fees, court oversight.' },
  { id: 'rx-fc7', sectionId: 'restructuring', subtopic: 'chapter-11-vs-7', front: 'Section 363 sale', back: 'Asset sale during Chapter 11, free and clear of liens; stalking horse; credit bidding.' },
  { id: 'rx-fc8', sectionId: 'restructuring', subtopic: 'capital-structure', front: 'Why out-of-court bond deals stall', back: 'TIA §316(b): changing payment terms needs each holder’s consent → holdouts.' },
];
