import type { Flashcard } from '../../../types/models';

export const flashcards: Flashcard[] = [
  { id: 'ma-fc1', sectionId: 'mna', subtopic: 'accretion-dilution', front: 'Accretive vs dilutive', back: 'Pro forma EPS above vs below the acquirer’s standalone EPS.' },
  { id: 'ma-fc2', sectionId: 'mna', subtopic: 'accretion-dilution', front: 'All-stock accretion shortcut', back: 'Accretive if acquirer P/E > purchase P/E (no synergies).' },
  { id: 'ma-fc3', sectionId: 'mna', subtopic: 'accretion-dilution', front: 'Cost of each funding source (EPS terms)', back: 'Cash: interest × (1 − t). Debt: rate × (1 − t). Stock: 1 / acquirer P/E.' },
  { id: 'ma-fc4', sectionId: 'mna', subtopic: 'ppa-goodwill', front: 'Goodwill formula', back: 'Price − (book equity − old goodwill + write-ups − DTL)' },
  { id: 'ma-fc5', sectionId: 'mna', subtopic: 'ppa-goodwill', front: 'Stock vs asset deal: tax', back: 'Asset deal steps up tax basis: no DTL, goodwill deductible (US: 15 yrs). Stock deal: DTL on write-ups.' },
  { id: 'ma-fc6', sectionId: 'mna', subtopic: 'synergies', front: 'Why discount revenue synergies?', back: 'They depend on customers and competitors; cost synergies are more controllable.' },
  { id: 'ma-fc7', sectionId: 'mna', subtopic: 'consideration', front: 'Exchange ratio', back: 'Offer per target share / acquirer share price' },
  { id: 'ma-fc8', sectionId: 'mna', subtopic: 'deal-structures', front: 'Breakup fee vs reverse termination fee', back: 'Breakup: target → buyer (~2–4%). Reverse: buyer → target (financing / regulatory failure).' },
];
