import type { WorkedExample } from '../../../types/models';

// TODO(Phase 4): add examples up to "hard interview" level (5+ total).
export const examples: WorkedExample[] = [
  {
    id: 'acc-ex1',
    sectionId: 'accounting',
    subtopic: 'income-statement',
    difficulty: 'basic',
    title: 'Build an income statement',
    prompt:
      'Revenue is $1,000, COGS $400, SG&A $200, D&A $100 and interest expense $50. The tax rate is 25%. What are gross profit, EBIT, EBITDA and net income?',
    steps: [
      { title: 'Gross profit', body: 'Revenue − COGS = 1,000 − 400 = $600.' },
      { title: 'EBIT', body: 'Gross profit − SG&A − D&A = 600 − 200 − 100 = $300.' },
      { title: 'EBITDA', body: 'EBIT + D&A = 300 + 100 = $400 (a 40% margin).' },
      { title: 'Pre-tax income', body: 'EBIT − interest = 300 − 50 = $250.' },
      { title: 'Taxes and net income', body: 'Taxes = 25% × 250 = $62.50. Net income = 250 − 62.50 = $187.50 (an 18.75% margin).' },
    ],
    answer: 'Gross profit $600, EBIT $300, EBITDA $400, net income $187.50.',
  },
  {
    id: 'acc-ex2',
    sectionId: 'accounting',
    subtopic: 'cash-flow-statement',
    difficulty: 'intermediate',
    title: 'From net income to free cash flow',
    prompt:
      'Same company: net income $187.50, D&A $100, stock-based compensation $20. During the year accounts receivable rose $30, inventory rose $20, accounts payable rose $15 and deferred revenue rose $10. Capex was $150. What are cash from operations and free cash flow (CFO − capex)?',
    steps: [
      { title: 'Start with net income', body: '$187.50.' },
      { title: 'Add back non-cash charges', body: 'D&A $100 + SBC $20 = $120. Running total: 187.50 + 120 = $307.50.' },
      {
        title: 'Working capital',
        body: 'Assets up uses cash: AR −30, inventory −20. Liabilities up provides cash: AP +15, deferred revenue +10. Net: −30 − 20 + 15 + 10 = −$25.',
      },
      { title: 'Cash from operations', body: '307.50 − 25 = $282.50.' },
      { title: 'Free cash flow', body: 'CFO − capex = 282.50 − 150 = $132.50.' },
    ],
    answer: 'CFO = $282.50; free cash flow = $132.50.',
  },
  {
    id: 'acc-ex3',
    sectionId: 'accounting',
    subtopic: 'linkages',
    difficulty: 'advanced',
    title: 'Roll cash and retained earnings forward',
    prompt:
      'Continuing: beginning cash is $200 and beginning retained earnings are $900. CFO is $282.50 and capex $150. The company repays $50 of debt, pays $40 of dividends and buys back $30 of stock. What are ending cash and ending retained earnings?',
    steps: [
      { title: 'Cash from investing', body: 'Capex of $150 → CFI = −$150.' },
      { title: 'Cash from financing', body: 'Debt repayment −50, dividends −40, buyback −30 → CFF = −$120.' },
      { title: 'Net change in cash', body: '282.50 − 150 − 120 = +$12.50. Ending cash = 200 + 12.50 = $212.50.' },
      {
        title: 'Retained earnings',
        body: 'Ending RE = 900 + net income 187.50 − dividends 40 = $1,047.50. The buyback does not touch retained earnings: it is recorded as treasury stock, a separate reduction of equity.',
      },
    ],
    answer: 'Ending cash $212.50; ending retained earnings $1,047.50.',
  },
];
