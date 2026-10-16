import type { Lesson } from '../../../types/models';

export const lessons: Lesson[] = [
  {
    id: 'acc-l1',
    sectionId: 'accounting',
    order: 1,
    title: 'The three statements',
    minutes: 6,
    blocks: [
      {
        kind: 'p',
        text: 'Every public company reports three core financial statements. The income statement shows profitability over a period. The balance sheet shows what the company owns and owes at a single point in time. The cash flow statement shows how cash actually moved over the period, and ties the other two together.',
      },
      { kind: 'h', text: 'The income statement' },
      {
        kind: 'p',
        text: 'The income statement (P&L) starts with revenue and subtracts costs to reach net income. It is prepared on an accrual basis: revenue is recorded when it is earned and expenses when they are incurred, regardless of when cash changes hands.',
      },
      {
        kind: 'table',
        caption: 'A simple income statement ($ millions, 25% tax rate)',
        headers: ['Line', 'Amount'],
        rows: [
          ['Revenue', '1,000.0'],
          ['Cost of goods sold (COGS)', '(400.0)'],
          ['Gross profit', '600.0'],
          ['Operating expenses (SG&A, R&D)', '(200.0)'],
          ['Depreciation & amortization', '(100.0)'],
          ['Operating income (EBIT)', '300.0'],
          ['Interest expense', '(50.0)'],
          ['Pre-tax income', '250.0'],
          ['Income taxes (25%)', '(62.5)'],
          ['Net income', '187.5'],
        ],
      },
      {
        kind: 'p',
        text: 'Many companies bury D&A inside COGS and operating expenses rather than showing it on its own line. EBITDA is EBIT with D&A added back: here 300 + 100 = 400.',
      },
      { kind: 'h', text: 'The balance sheet' },
      {
        kind: 'formula',
        title: 'The balance sheet identity',
        lines: ['Assets = Liabilities + Shareholders’ Equity'],
        note: 'Every transaction keeps this in balance. If your walk-through doesn’t balance, you’ve made a mistake.',
      },
      {
        kind: 'list',
        items: [
          'Assets are resources expected to produce future benefit: cash, accounts receivable, inventory, prepaid expenses, PP&E, intangibles and goodwill.',
          'Liabilities are obligations to others: accounts payable, accrued expenses, deferred revenue, debt, deferred tax liabilities.',
          'Equity is the owners’ residual claim: common stock and additional paid-in capital, retained earnings, and treasury stock (a negative number).',
        ],
      },
      { kind: 'h', text: 'The cash flow statement' },
      {
        kind: 'p',
        text: 'The cash flow statement starts with net income and converts it into the actual change in cash, in three sections:',
      },
      {
        kind: 'list',
        items: [
          'Cash from operations (CFO): net income, plus non-cash charges (D&A, stock-based compensation, impairments, deferred taxes), plus or minus changes in working capital.',
          'Cash from investing (CFI): capital expenditures, acquisitions, and purchases or sales of investments and assets.',
          'Cash from financing (CFF): debt raised or repaid, stock issued or repurchased, and dividends paid.',
        ],
      },
      {
        kind: 'formula',
        title: 'Reconciling cash',
        lines: ['Net change in cash = CFO + CFI + CFF', 'Ending cash = Beginning cash + Net change in cash'],
      },
      {
        kind: 'trap',
        title: 'Net income is not cash',
        text: 'Interviewers love “if net income is $100, how much cash did the company make?” The answer is “it depends”. The income statement includes non-cash expenses (D&A, SBC), records sales made on credit, and leaves out cash items like capex and debt principal. That is exactly why the cash flow statement exists.',
      },
    ],
    sixtySecond:
      'The income statement shows revenue, expenses and net income over a period, on an accrual basis. The balance sheet is a snapshot where assets equal liabilities plus equity. The cash flow statement starts with net income, adds back non-cash charges, adjusts for working capital to get cash from operations, then adds investing and financing flows to get the net change in cash, which reconciles to the cash balance on the balance sheet.',
  },
  {
    id: 'acc-l2',
    sectionId: 'accounting',
    order: 2,
    title: 'How the statements link',
    minutes: 7,
    blocks: [
      {
        kind: 'p',
        text: '“How are the three statements linked?” is one of the most common technical questions in a first round. Know these links cold and you can walk any change through all three statements.',
      },
      {
        kind: 'list',
        ordered: true,
        items: [
          'Net income from the income statement is the first line of the cash flow statement.',
          'Non-cash expenses on the income statement (D&A, stock-based compensation, impairments) are added back in cash from operations.',
          'Changes in balance sheet working capital accounts appear in cash from operations. An increase in an asset uses cash; an increase in a liability provides cash.',
          'Capex in cash from investing increases PP&E on the balance sheet; depreciation reduces it.',
          'Debt and equity raised or repaid in cash from financing change debt and equity on the balance sheet.',
          'Net income, less dividends, flows into retained earnings.',
          'Ending cash on the cash flow statement becomes cash on the balance sheet.',
        ],
      },
      {
        kind: 'formula',
        title: 'Roll-forwards to memorize',
        lines: [
          'Ending retained earnings = Beginning RE + Net income − Dividends',
          'Ending PP&E = Beginning PP&E + Capex − Depreciation (− impairments, disposals)',
          'Ending debt = Beginning debt + Issuance − Repayment',
        ],
      },
      {
        kind: 'formula',
        title: 'Working capital sign rule',
        lines: ['Operating asset ↑ → cash ↓', 'Operating liability ↑ → cash ↑'],
        note: 'Accounts receivable going up means you booked revenue you haven’t collected. Accounts payable going up means you booked an expense you haven’t paid.',
      },
      {
        kind: 'example',
        title: 'The classic: depreciation goes up by $10 (25% tax rate)',
        text: 'Income statement: operating income falls by $10, taxes fall by $2.50, so net income falls by $7.50. Cash flow statement: net income is down $7.50 but you add back the $10 of depreciation, so cash from operations rises by $2.50. Balance sheet: cash is up $2.50 and PP&E is down $10, so assets are down $7.50; retained earnings are down $7.50, so liabilities + equity are down $7.50. It balances.',
      },
      {
        kind: 'trap',
        title: '“If you could only use one statement…”',
        text: 'Pick the cash flow statement: it shows the cash a business actually generates, which is harder to flatter with accounting choices. If you can pick two, pick the income statement and the balance sheet (with both the beginning and ending balance sheets), because you can rebuild the cash flow statement from them.',
      },
    ],
    sixtySecond:
      'Net income starts the cash flow statement and, less dividends, increases retained earnings. Non-cash charges are added back and working capital changes adjust cash from operations: an increase in an asset uses cash, an increase in a liability provides cash. Capex adds to PP&E and depreciation reduces it. Financing flows change debt and equity. Ending cash on the cash flow statement is the cash on the balance sheet, and the balance sheet must always balance.',
  },
  {
    id: 'acc-l3',
    sectionId: 'accounting',
    order: 3,
    title: 'Line items that trip people up',
    minutes: 7,
    blocks: [
      {
        kind: 'p',
        text: 'Most accounting mistakes in interviews come from a handful of line items. Know what each one is, which statement it lives on and how it moves.',
      },
      {
        kind: 'table',
        headers: ['Item', 'What it is', 'Where it lives'],
        rows: [
          ['Deferred revenue', 'Cash received before the product or service is delivered', 'Liability (BS); increase is a source of cash'],
          ['Prepaid expenses', 'Cash paid before the benefit is received (e.g. insurance)', 'Asset (BS); increase is a use of cash'],
          ['Accrued expenses', 'Costs incurred but not yet invoiced or paid (wages, utilities)', 'Liability (BS)'],
          ['Goodwill', 'Purchase price above fair value of identifiable net assets acquired', 'Asset (BS); impaired, never amortized (US GAAP, public companies)'],
          ['Other intangibles', 'Acquired customer lists, technology, brands', 'Asset (BS); amortized if finite-lived'],
          ['Treasury stock', 'Shares the company has bought back', 'Contra-equity (BS), negative'],
          ['Noncontrolling interest', 'The part of a consolidated subsidiary the parent doesn’t own', 'Equity (BS); its share of NI is deducted on the IS'],
          ['Deferred tax liability', 'Taxes owed in the future because book tax exceeds cash tax today', 'Liability (BS)'],
          ['Deferred tax asset', 'Future tax savings, e.g. from NOLs', 'Asset (BS)'],
        ],
      },
      {
        kind: 'trap',
        title: 'Dividends are not an expense',
        text: 'Dividends never appear on the income statement. They are paid out of net income: they reduce retained earnings and appear in financing cash flow. Interest is the expense; dividends are a distribution.',
      },
      {
        kind: 'h',
        text: 'Gains and losses on asset sales',
      },
      {
        kind: 'p',
        text: 'If a company sells equipment with a $50 book value for $80, it records a $30 gain in net income. On the cash flow statement, the full $80 shows up in cash from investing, so the $30 gain must be subtracted in cash from operations; otherwise it would be counted twice. Losses are added back.',
      },
      {
        kind: 'formula',
        title: 'EBITDA and adjusted EBITDA',
        lines: ['EBITDA = EBIT + D&A', 'Adjusted EBITDA = EBITDA + genuinely non-recurring charges (restructuring, one-off legal settlements)'],
        note: 'Be skeptical of “adjustments” that recur every year. Stock-based compensation is the most debated add-back.',
      },
    ],
    sixtySecond:
      'Deferred revenue is a liability and prepaid expenses are an asset; accrued expenses are liabilities for costs incurred but not invoiced. Goodwill arises only from acquisitions and is impaired, not amortized. Treasury stock reduces equity. Dividends are never an expense. Gains on asset sales are subtracted in cash from operations because the proceeds appear in investing. Adjusted EBITDA adds back only truly non-recurring items.',
  },
  {
    id: 'acc-l4',
    sectionId: 'accounting',
    order: 4,
    title: 'Accrual accounting and working capital',
    minutes: 7,
    blocks: [
      {
        kind: 'p',
        text: 'Accrual accounting records revenue when it is earned and expenses when they are incurred, regardless of when cash moves. US public companies must use it under GAAP (IFRS elsewhere) because it matches costs to the revenue they generate, giving a truer picture of a period’s performance. The cost is that net income and cash drift apart, and working capital is where most of the gap lives.',
      },
      {
        kind: 'formula',
        title: 'Working capital',
        lines: [
          'Working capital = Current assets − Current liabilities',
          'Operating WC = (AR + Inventory + Prepaids) − (AP + Accrued expenses + Deferred revenue)',
          'Increase in operating WC → reduces cash from operations',
        ],
        note: 'Operating WC excludes cash and debt: they are financing items, handled in the EV bridge.',
      },
      {
        kind: 'formula',
        title: 'Cash conversion cycle',
        lines: ['DSO = AR / Revenue × 365', 'DIO = Inventory / COGS × 365', 'DPO = AP / COGS × 365', 'CCC = DSO + DIO − DPO'],
        note: 'How many days cash is tied up between paying suppliers and collecting from customers.',
      },
      {
        kind: 'example',
        title: 'Why fast growth can burn cash',
        text: 'A distributor with a 60-day cash conversion cycle grows revenue from $1,000 to $1,500. Its receivables and inventory grow with it, so it must fund roughly 60 days of extra sales before collecting. Net income can rise while cash from operations falls, which is how profitable companies run out of money.',
      },
      {
        kind: 'trap',
        title: 'Negative working capital isn’t automatically bad',
        text: 'Retailers, restaurants and subscription businesses often collect cash before paying suppliers. Their working capital is negative by design, and growth generates cash rather than consuming it. Judge it by the business model.',
      },
    ],
    sixtySecond:
      'Accrual accounting recognizes revenue when earned and expenses when incurred, which is why net income and cash differ. Operating working capital is receivables, inventory and prepaids minus payables, accrued expenses and deferred revenue, excluding cash and debt. An increase in it uses cash. The cash conversion cycle, DSO plus DIO minus DPO, measures how long cash is tied up. Negative working capital can be a strength.',
  },
];
