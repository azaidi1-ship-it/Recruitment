import type { CheatSheet } from '../../../types/models';

export const cheatSheet: CheatSheet = {
  sectionId: 'comps',
  blocks: [
    {
      kind: 'formula',
      title: 'Formulas',
      lines: [
        'LTM = FY + YTD − prior YTD',
        'Calendar metric = Σ (months in CY / 12) × FY metric',
        'Transaction value = Equity price + Net debt',
        'Premium = Offer / Unaffected − 1',
        'Price = (Multiple × Metric − Net debt) / Diluted shares',
      ],
    },
    {
      kind: 'table',
      headers: ['', 'Trading comps', 'Precedents'],
      rows: [
        ['What', 'Minority trading values', 'Prices paid for control'],
        ['Timing', 'Today', 'Historical deals'],
        ['Metrics', 'LTM and NTM', 'Mostly LTM'],
        ['Usual level', 'Lower', 'Higher (premium, synergies)'],
      ],
    },
    {
      kind: 'formula',
      title: 'Process',
      lines: ['Peers → data → normalize → calendarize → multiples → 25th / median / 75th → apply'],
    },
    {
      kind: 'trap',
      title: 'Common mistakes',
      text: 'Mixing fiscal periods. Including a peer that is being acquired. Inconsistent SBC treatment. Using the mean with outliers. Treating a 2021 precedent like a 2026 one. Measuring premiums against an affected price.',
    },
  ],
};
