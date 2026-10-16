import type { WorkedExample } from '../../../types/models';

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
  {
    id: 'acc-ex4',
    sectionId: 'accounting',
    subtopic: 'cash-flow-statement',
    difficulty: 'advanced',
    title: 'Rebuild CFO from two balance sheets',
    prompt:
      'Net income is $90, D&A $30 and SBC $10. Balance sheet changes from last year: AR 200 → 240, inventory 150 → 135, prepaid expenses 20 → 25, AP 110 → 125, accrued expenses 40 → 36, deferred revenue 30 → 45. What is cash from operations?',
    steps: [
      { title: 'Start', body: 'NI 90 + D&A 30 + SBC 10 = 130.' },
      { title: 'Operating assets (up = use of cash)', body: 'AR +40 → −40; inventory −15 → +15; prepaids +5 → −5. Subtotal: −30.' },
      { title: 'Operating liabilities (up = source of cash)', body: 'AP +15 → +15; accrued −4 → −4; deferred revenue +15 → +15. Subtotal: +26.' },
      { title: 'CFO', body: '130 − 30 + 26 = 126.' },
    ],
    answer: 'Cash from operations = $126.',
  },
  {
    id: 'acc-ex5',
    sectionId: 'accounting',
    subtopic: 'working-capital',
    difficulty: 'advanced',
    title: 'Cash conversion cycle',
    prompt: 'Revenue $1,200, COGS $720, accounts receivable $150, inventory $120, accounts payable $90. Calculate DSO, DIO, DPO and the cash conversion cycle.',
    steps: [
      { title: 'DSO', body: 'AR / revenue × 365 = 150 / 1,200 × 365 = 45.6 days.' },
      { title: 'DIO', body: 'Inventory / COGS × 365 = 120 / 720 × 365 = 60.8 days.' },
      { title: 'DPO', body: 'AP / COGS × 365 = 90 / 720 × 365 = 45.6 days.' },
      { title: 'CCC', body: '45.6 + 60.8 − 45.6 = 60.8 days: cash is tied up for about two months between paying suppliers and collecting from customers.' },
    ],
    answer: 'DSO 45.6, DIO 60.8, DPO 45.6, CCC ≈ 60.8 days.',
  },
  {
    id: 'acc-ex6',
    sectionId: 'accounting',
    subtopic: 'linkages',
    difficulty: 'elite',
    title: 'Profitable but running out of cash',
    prompt:
      'A company earns $50 of net income with $20 of D&A. Growth pushes AR up $60 and inventory up $40; AP rises $15. Capex is $45 and a $30 debt maturity comes due. It starts the year with $40 of cash and can’t raise new money. What happens?',
    steps: [
      { title: 'CFO', body: '50 + 20 − 60 − 40 + 15 = −15. Profitable, but operations consume cash.' },
      { title: 'After capex', body: '−15 − 45 = −60 of free cash flow.' },
      { title: 'After the maturity', body: '−60 − 30 = −90 net change in cash.' },
      { title: 'Liquidity', body: 'Starting cash of 40 − 90 = −50: the company can’t meet its obligations without new financing, despite positive net income.' },
    ],
    answer: 'It runs $50 short: positive net income, negative cash flow, and a liquidity crisis unless it refinances or raises capital.',
  },
];
