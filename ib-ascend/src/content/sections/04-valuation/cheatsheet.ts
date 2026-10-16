import type { CheatSheet } from '../../../types/models';

export const cheatSheet: CheatSheet = {
  sectionId: 'valuation',
  blocks: [
    {
      kind: 'table',
      headers: ['Method', 'Type', 'Typical position'],
      rows: [
        ['Trading comps', 'Relative', 'Middle (minority value)'],
        ['Precedent transactions', 'Relative', 'Usually highest (control premium)'],
        ['DCF', 'Intrinsic', 'Anywhere: assumption-driven'],
        ['LBO', 'Sponsor return', 'Usually the floor'],
      ],
    },
    {
      kind: 'formula',
      title: 'Formulas',
      lines: [
        'Price = (Multiple × Metric − Net debt) / Diluted shares',
        'Premium = Offer / Unaffected − 1',
        'Forward P/E = Payout / (k_e − g)',
        'LBO max EV = Exit equity / MOIC + Debt',
      ],
    },
    {
      kind: 'table',
      headers: ['Company type', 'Use'],
      rows: [
        ['Bank / insurer', 'P/E, P/BV, DDM'],
        ['REIT', 'P/FFO, NAV'],
        ['Oil & gas E&P', 'EV/EBITDAX, NAV, EV/reserves'],
        ['Pre-profit growth', 'EV/Revenue'],
        ['Biotech', 'Risk-adjusted NPV'],
        ['Conglomerate', 'Sum-of-the-parts'],
      ],
    },
    {
      kind: 'trap',
      title: 'Common mistakes',
      text: 'Saying one method is always highest. Using EV/EBITDA for banks. Treating the 52-week range as a valuation method. Forgetting net debt when converting EV to a share price. Using the affected price for a premium.',
    },
  ],
};
