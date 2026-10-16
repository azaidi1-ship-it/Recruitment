import type { CheatSheet } from '../../../types/models';

export const cheatSheet: CheatSheet = {
  sectionId: 'accounting',
  blocks: [
    {
      kind: 'table',
      headers: ['Statement', 'Shows', 'Timeframe'],
      rows: [
        ['Income statement', 'Revenue − expenses = net income', 'A period'],
        ['Balance sheet', 'Assets = liabilities + equity', 'A point in time'],
        ['Cash flow statement', 'CFO + CFI + CFF = net change in cash', 'A period'],
      ],
    },
    {
      kind: 'formula',
      title: 'Income statement',
      lines: [
        'Gross profit = Revenue − COGS',
        'EBIT = Gross profit − OpEx − D&A',
        'EBITDA = EBIT + D&A',
        'Net income = (EBIT − Interest) × (1 − t)',
      ],
    },
    {
      kind: 'formula',
      title: 'Links and roll-forwards',
      lines: [
        'Net income → top of CFS and → retained earnings',
        'Ending RE = Beginning RE + NI − Dividends',
        'Ending PP&E = Beginning PP&E + Capex − Depreciation',
        'Ending cash (CFS) = Cash (BS)',
      ],
    },
    {
      kind: 'formula',
      title: 'Working capital',
      lines: ['Operating asset ↑ → cash ↓', 'Operating liability ↑ → cash ↑', 'Operating WC excludes cash and debt'],
    },
    {
      kind: 'trap',
      title: 'Common mistakes',
      text: 'Capex is never added back in CFO. Buybacks hit treasury stock, not retained earnings. Working capital changes on the CFS are not tax-affected. Revenue collected in advance is deferred revenue, a liability.',
    },
  ],
};
