import type { Lesson } from '../../../types/models';

// TODO(Phase 4): add chapters on line items in depth, accrual vs cash, and working capital.
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
];
