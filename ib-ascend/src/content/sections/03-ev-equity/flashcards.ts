import type { Flashcard } from '../../../types/models';

export const flashcards: Flashcard[] = [
  { id: 'ev-fc1', sectionId: 'ev-equity', subtopic: 'definitions', front: 'Equity value vs enterprise value', back: 'Equity value: to common shareholders (price × diluted shares). EV: core operations to all investors.' },
  { id: 'ev-fc2', sectionId: 'ev-equity', subtopic: 'ev-bridge', front: 'The EV bridge', back: 'EV = Equity value + Debt + Preferred + NCI − Cash − Equity investments' },
  { id: 'ev-fc3', sectionId: 'ev-equity', subtopic: 'ev-bridge', front: 'Why add NCI?', back: 'Consolidated EBITDA includes 100% of majority-owned subsidiaries; EV must too.' },
  { id: 'ev-fc4', sectionId: 'ev-equity', subtopic: 'ev-bridge', front: 'Why subtract equity-method investments?', back: 'Their EBITDA isn’t in consolidated EBITDA.' },
  { id: 'ev-fc5', sectionId: 'ev-equity', subtopic: 'diluted-shares', front: 'Treasury stock method in one line', back: 'Net new shares = ITM options − (options × strike) / share price' },
  { id: 'ev-fc6', sectionId: 'ev-equity', subtopic: 'convertibles', front: 'In-the-money convertible in the bridge', back: 'Add face / conversion price in shares; don’t also count it as debt.' },
  { id: 'ev-fc7', sectionId: 'ev-equity', subtopic: 'multiples-pairing', front: 'What pairs with EV? With equity value?', back: 'EV: revenue, EBITDA, EBIT, unlevered FCF. Equity: net income, EPS, levered FCF, book value.' },
  { id: 'ev-fc8', sectionId: 'ev-equity', subtopic: 'ev-bridge', front: 'Debt-funded buyback: effect on EV and equity value', back: 'Equity value falls; EV unchanged.' },
];
