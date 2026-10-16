import type { CheatSheet } from '../../../types/models';

export const cheatSheet: CheatSheet = {
  sectionId: 'ev-equity',
  blocks: [
    {
      kind: 'formula',
      title: 'Core formulas',
      lines: [
        'Equity value = Price × Diluted shares',
        'EV = Equity value + Debt + Preferred + NCI − Cash − Equity investments',
        'TSM net shares = ITM options − Proceeds / Price',
        'Convertible (ITM): + Face / Conversion price shares, − from debt',
      ],
    },
    {
      kind: 'table',
      headers: ['Scenario', 'Equity value', 'EV'],
      rows: [
        ['Raise debt, hold cash', 'No change', 'No change'],
        ['Debt-funded buyback', 'Down', 'No change'],
        ['Dividend from cash', 'Down', 'No change'],
        ['Issue stock to buy a business', 'Up', 'Up'],
      ],
    },
    {
      kind: 'table',
      headers: ['Numerator', 'Pairs with'],
      rows: [
        ['EV', 'Revenue, EBITDA, EBIT, unlevered FCF'],
        ['Equity value', 'Net income, EPS, levered FCF, book value'],
      ],
    },
    {
      kind: 'trap',
      title: 'Common mistakes',
      text: 'Using basic shares. Counting out-of-the-money options. Counting an ITM convertible as both debt and shares. Using today’s price instead of the offer price in a deal. Pairing EV with net income. Adding operating leases without switching to EBITDAR.',
    },
  ],
};
