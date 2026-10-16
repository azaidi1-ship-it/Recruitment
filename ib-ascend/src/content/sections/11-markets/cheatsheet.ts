import type { CheatSheet } from '../../../types/models';

export const cheatSheet: CheatSheet = {
  sectionId: 'markets',
  blocks: [
    {
      kind: 'formula',
      title: 'Rates',
      lines: [
        'Real yield ≈ nominal − expected inflation',
        '%Δ bond price ≈ −duration × Δyield',
        'Spread = corporate yield − Treasury yield (1 bp = 0.01%)',
        'Earnings yield = 1 / P/E',
      ],
    },
    {
      kind: 'table',
      headers: ['Rates rise →', 'Effect'],
      rows: [
        ['Valuations', 'Lower; growth stocks hit hardest'],
        ['LBOs', 'Less leverage, lower prices'],
        ['M&A', 'Bid-ask gap widens, volumes slow'],
        ['IPOs', 'Window tends to close'],
        ['Distress', 'Refinancing walls bite'],
      ],
    },
    {
      kind: 'formula',
      title: 'Deal numbers',
      lines: ['Premium = offer / unaffected − 1', 'Arb spread = offer / current target price − 1', 'HSR: 30-day initial wait (15 for cash tender)'],
    },
    {
      kind: 'list',
      ordered: true,
      items: ['Deal pitch: facts → rationale → valuation → financing → view and risk', 'Stock pitch: rec → overview → thesis → valuation → catalyst → risks'],
    },
    {
      kind: 'trap',
      title: 'Common mistakes',
      text: 'Saying the Fed sets the 10-year. Quoting unsourced statistics. Picking a headline deal you can’t discuss two levels deep. “Great company” instead of a thesis. Ignoring why a cheap stock might deserve its discount.',
    },
  ],
};
