import type { Flashcard } from '../../../types/models';

export const flashcards: Flashcard[] = [
  { id: 'val-fc1', sectionId: 'valuation', subtopic: 'methodologies', front: 'The four core methodologies', back: 'Trading comps and precedents (relative), DCF (intrinsic), LBO (sponsor capacity / floor).' },
  { id: 'val-fc2', sectionId: 'valuation', subtopic: 'football-field', front: 'Why are precedents usually above comps?', back: 'Control premium, synergies and competitive sale processes.' },
  { id: 'val-fc3', sectionId: 'valuation', subtopic: 'when-to-use', front: 'How do you value a bank?', back: 'P/E, P/BV (P/TBV), dividend discount model. Not EV/EBITDA: interest is operating.' },
  { id: 'val-fc4', sectionId: 'valuation', subtopic: 'when-to-use', front: 'How do you value a REIT?', back: 'P/FFO, P/AFFO and NAV.' },
  { id: 'val-fc5', sectionId: 'valuation', subtopic: 'when-to-use', front: 'Why is an LBO a “floor”?', back: 'It’s what a sponsor can pay at its target IRR; strategics with synergies can usually pay more.' },
  { id: 'val-fc6', sectionId: 'valuation', subtopic: 'multiples-intuition', front: 'Gordon growth P/E', back: 'Forward P/E = Payout / (Cost of equity − g)' },
  { id: 'val-fc7', sectionId: 'valuation', subtopic: 'multiples-intuition', front: 'What drives multiples?', back: 'Growth, returns/margins, reinvestment needs (capex, WC), risk and rates.' },
  { id: 'val-fc8', sectionId: 'valuation', subtopic: 'football-field', front: 'Premium formula', back: 'Offer / unaffected price − 1' },
];
