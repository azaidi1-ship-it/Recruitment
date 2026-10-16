import type { Flashcard } from '../../../types/models';

export const flashcards: Flashcard[] = [
  { id: 'lbo-fc1', sectionId: 'lbo', subtopic: 'sources-uses', front: 'Sources & uses', back: 'Uses: purchase price, refinancing, fees. Sources: debt, rollover, sponsor equity (the plug).' },
  { id: 'lbo-fc2', sectionId: 'lbo', subtopic: 'returns-drivers', front: 'Three LBO returns drivers', back: 'EBITDA growth, multiple expansion, debt paydown.' },
  { id: 'lbo-fc3', sectionId: 'lbo', subtopic: 'irr-moic', front: 'IRR rules of thumb', back: '2x/5y ≈ 15%; 3x/5y ≈ 25%; 2x/3y ≈ 26%; 2.5x/5y ≈ 20%.' },
  { id: 'lbo-fc4', sectionId: 'lbo', subtopic: 'irr-moic', front: 'MOIC vs IRR', back: 'MOIC: how much (cash out / cash in). IRR: how fast (annualized, time-weighted).' },
  { id: 'lbo-fc5', sectionId: 'lbo', subtopic: 'debt-tranches', front: 'Term Loan B', back: 'Floating, senior secured, ~1%/yr amortization + bullet, institutional, often cov-lite.' },
  { id: 'lbo-fc6', sectionId: 'lbo', subtopic: 'debt-tranches', front: 'PIK interest', back: 'Accrues to principal instead of being paid in cash.' },
  { id: 'lbo-fc7', sectionId: 'lbo', subtopic: 'returns-drivers', front: 'Ideal LBO candidate', back: 'Stable cash flows, low capex, strong position, improvement upside, fair price, exit options.' },
  { id: 'lbo-fc8', sectionId: 'lbo', subtopic: 'returns-drivers', front: 'Dividend recap effect', back: 'IRR usually up (earlier cash); MOIC flat or down (extra interest).' },
];
