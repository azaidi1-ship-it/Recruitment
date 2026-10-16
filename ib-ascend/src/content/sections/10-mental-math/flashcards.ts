import type { Flashcard } from '../../../types/models';

export const flashcards: Flashcard[] = [
  { id: 'mm-fc1', sectionId: 'mental-math', subtopic: 'percentages', front: '1/7, 1/8, 1/9, 1/12 as %', back: '14.3%, 12.5%, 11.1%, 8.3%' },
  { id: 'mm-fc2', sectionId: 'mental-math', subtopic: 'percentages', front: 'A stock falls 50%. Gain needed to recover?', back: '100%' },
  { id: 'mm-fc3', sectionId: 'mental-math', subtopic: 'multiples', front: '× 25 and × 125 shortcuts', back: '× 25 = × 100 ÷ 4;  × 125 = × 1,000 ÷ 8' },
  { id: 'mm-fc4', sectionId: 'mental-math', subtopic: 'irr-rules', front: 'Rule of 72', back: 'Years to double ≈ 72 / rate' },
  { id: 'mm-fc5', sectionId: 'mental-math', subtopic: 'irr-rules', front: 'IRR: 2x, 2.5x, 3x in 5 years', back: '≈ 15%, 20%, 25%' },
  { id: 'mm-fc6', sectionId: 'mental-math', subtopic: 'irr-rules', front: 'IRR: 2x and 3x in 3 years', back: '≈ 26% and 44%' },
  { id: 'mm-fc7', sectionId: 'mental-math', subtopic: 'brain-teasers', front: 'Clock hand speeds', back: 'Minute: 6°/min. Hour: 0.5°/min (30°/hour).' },
  { id: 'mm-fc8', sectionId: 'mental-math', subtopic: 'brain-teasers', front: 'Market sizing steps', back: 'Clarify → structure → round assumptions → calculate → sanity-check.' },
];
