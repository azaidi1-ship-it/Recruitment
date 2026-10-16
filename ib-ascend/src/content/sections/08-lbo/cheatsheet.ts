import type { CheatSheet } from '../../../types/models';

export const cheatSheet: CheatSheet = {
  sectionId: 'lbo',
  blocks: [
    {
      kind: 'formula',
      title: 'Core math',
      lines: [
        'Equity = Purchase EV + fees − debt − rollover',
        'NI = (EBITDA − D&A − interest)(1 − t); FCF ≈ NI + D&A − capex − ΔNWC',
        'Exit equity = Exit multiple × EBITDA − remaining debt',
        'MOIC = cash out / cash in;  IRR = MOIC^(1/n) − 1',
      ],
    },
    {
      kind: 'table',
      headers: ['MOIC', '3 yrs', '5 yrs'],
      rows: [
        ['2.0x', '26%', '15%'],
        ['2.5x', '36%', '20%'],
        ['3.0x', '44%', '25%'],
      ],
    },
    {
      kind: 'formula',
      title: 'Attribution and credit',
      lines: ['ΔEBITDA × entry multiple + Δmultiple × exit EBITDA + debt paydown', 'Leverage = Debt / EBITDA;  Coverage = EBITDA / Interest'],
    },
    {
      kind: 'trap',
      title: 'Common mistakes',
      text: 'Forgetting fees in uses. Using EV instead of equity for MOIC. Ignoring remaining debt at exit. Assuming multiple expansion by default. Confusing maintenance and incurrence covenants. Treating PIK as cash interest.',
    },
  ],
};
