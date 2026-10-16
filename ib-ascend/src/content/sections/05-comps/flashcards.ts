import type { Flashcard } from '../../../types/models';

export const flashcards: Flashcard[] = [
  { id: 'co-fc1', sectionId: 'comps', subtopic: 'peer-selection', front: 'Peer selection criteria', back: 'Industry and business model first; then size, growth, margins, geography.' },
  { id: 'co-fc2', sectionId: 'comps', subtopic: 'spreading', front: 'LTM formula', back: 'Last fiscal year + current YTD − prior-year YTD' },
  { id: 'co-fc3', sectionId: 'comps', subtopic: 'calendarization', front: 'Calendar 2026 for a March year-end', back: '3/12 × FY Mar-26 + 9/12 × FY Mar-27' },
  { id: 'co-fc4', sectionId: 'comps', subtopic: 'spreading', front: 'Why the median, not the mean?', back: 'It resists outliers.' },
  { id: 'co-fc5', sectionId: 'comps', subtopic: 'precedents', front: 'Transaction value', back: 'Equity purchase price + net debt assumed' },
  { id: 'co-fc6', sectionId: 'comps', subtopic: 'precedents', front: 'Why precedents use LTM', back: 'Forward projections at deal time are rarely disclosed; LTM is reliably reported.' },
  { id: 'co-fc7', sectionId: 'comps', subtopic: 'control-premium', front: 'Typical US control premium', back: 'Roughly 20–40%, measured vs the unaffected price.' },
  { id: 'co-fc8', sectionId: 'comps', subtopic: 'spreading', front: 'A peer just announced a sale. Keep it in comps?', back: 'No: exclude or flag it; its price includes the takeover premium.' },
];
