import type { Flashcard } from '../../../types/models';

export const flashcards: Flashcard[] = [
  { id: 'wt-fc1', sectionId: 'walkthroughs', subtopic: 'depreciation', front: 'Depreciation +$10, 25% tax: NI, cash?', back: 'NI −7.50; cash +2.50; PP&E −10; retained earnings −7.50.' },
  { id: 'wt-fc2', sectionId: 'walkthroughs', subtopic: 'inventory', front: 'Inventory write-down of $40 (25% tax)', back: 'NI −30; add back 40; cash +10; inventory −40; retained earnings −30.' },
  { id: 'wt-fc3', sectionId: 'walkthroughs', subtopic: 'sbc', front: 'SBC of $20 on the balance sheet', back: 'Cash +5; common stock & APIC +20; retained earnings −15.' },
  { id: 'wt-fc4', sectionId: 'walkthroughs', subtopic: 'ppe-debt', front: 'Buy $100 of PP&E with $100 of debt', back: 'No IS effect. Capex −100 (CFI), debt +100 (CFF), cash unchanged. PP&E +100, debt +100.' },
  { id: 'wt-fc5', sectionId: 'walkthroughs', subtopic: 'dividends-buybacks', front: 'Dividends vs buybacks on the balance sheet', back: 'Dividends reduce retained earnings; buybacks increase treasury stock (contra-equity). Both: cash ↓, equity ↓, no IS impact.' },
  { id: 'wt-fc6', sectionId: 'walkthroughs', subtopic: 'deferred-taxes', front: 'What creates a DTL? A DTA?', back: 'DTL: book tax > cash tax now (e.g. accelerated tax depreciation). DTA: future tax savings (e.g. NOLs).' },
  { id: 'wt-fc7', sectionId: 'walkthroughs', subtopic: 'goodwill-impairment', front: '$100 goodwill impairment: textbook vs reality', back: 'Textbook (deductible): NI −75, cash +25. Reality (usually non-deductible): NI −100, cash 0. Goodwill −100 either way.' },
  { id: 'wt-fc8', sectionId: 'walkthroughs', subtopic: 'ppe-debt', front: 'Asset sold at a gain: CFS treatment', back: 'Subtract the gain in CFO; show full proceeds in CFI.' },
];
