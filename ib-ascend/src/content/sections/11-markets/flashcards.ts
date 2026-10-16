import type { Flashcard } from '../../../types/models';

export const flashcards: Flashcard[] = [
  { id: 'mk-fc1', sectionId: 'markets', subtopic: 'rates-macro', front: 'Bond price change for a yield move', back: '%Δ price ≈ −modified duration × Δyield' },
  { id: 'mk-fc2', sectionId: 'markets', subtopic: 'rates-macro', front: 'Inverted yield curve', back: 'Short-term yields above long-term yields; historically has preceded many US recessions.' },
  { id: 'mk-fc3', sectionId: 'markets', subtopic: 'rates-macro', front: 'Credit spread', back: 'Corporate yield − Treasury yield; widens when risk appetite falls.' },
  { id: 'mk-fc4', sectionId: 'markets', subtopic: 'current-markets', front: 'HSR vs CFIUS', back: 'HSR: antitrust filing with FTC/DOJ, 30-day initial wait. CFIUS: national-security review of foreign investment.' },
  { id: 'mk-fc5', sectionId: 'markets', subtopic: 'current-markets', front: 'Spin-off vs carve-out vs split-off', back: 'Spin-off: shares distributed. Carve-out: minority IPO for cash. Split-off: shareholders exchange parent shares for sub shares.' },
  { id: 'mk-fc6', sectionId: 'markets', subtopic: 'current-markets', front: 'Dry powder', back: 'Committed but uninvested PE capital; pressure to deploy supports deal activity.' },
  { id: 'mk-fc7', sectionId: 'markets', subtopic: 'pitch-deal', front: 'Deal pitch structure', back: 'Facts → rationale → valuation → financing/regulation → your view and main risk.' },
  { id: 'mk-fc8', sectionId: 'markets', subtopic: 'pitch-stock', front: 'Stock pitch structure', back: 'Recommendation → overview → thesis → valuation → catalyst → risks.' },
];
