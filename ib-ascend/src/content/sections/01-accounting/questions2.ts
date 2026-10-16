import type { Question } from '../../../types/questions';
import { builders } from '../../helpers';

const { mcq, num, rapid, order, walk, free } = builders('accounting');

/** Accounting Foundations, part 2 (Phase 4): line items, working capital, accrual timing. */
export const questions2: Question[] = [
  mcq(
    { id: 'acc-q-024', subtopic: 'income-statement', difficulty: 'basic', pools: ['pre', 'post'] },
    'Which of these does NOT appear on the income statement?',
    [
      ['Dividends paid to common shareholders', 'Dividends are a distribution of profit: they reduce retained earnings and appear in financing cash flow, never as an expense.', true],
      ['Interest expense', 'Interest expense sits between EBIT and pre-tax income.'],
      ['Income tax expense', 'Tax expense is deducted from pre-tax income.'],
      ['Depreciation and amortization', 'D&A is an operating expense (shown separately or inside COGS and SG&A).'],
    ],
    'Dividends never hit the income statement.',
  ),
  mcq(
    { id: 'acc-q-025', subtopic: 'balance-sheet', difficulty: 'intermediate', pools: ['post'] },
    'How is goodwill created?',
    [
      ['When a company acquires another for more than the fair value of its identifiable net assets', 'Goodwill is the residual of purchase price over the fair value of assets acquired less liabilities assumed.', true],
      ['When a company builds a valuable brand internally', 'Internally generated brands and goodwill aren’t capitalized under US GAAP.'],
      ['When a company’s share price rises above its book value', 'Market value changes don’t create accounting goodwill.'],
      ['When a company capitalizes research and development', 'Capitalized development costs (where allowed) are intangible assets, not goodwill.'],
    ],
    'Goodwill only arises from acquisitions.',
  ),
  mcq(
    { id: 'acc-q-026', subtopic: 'cash-flow-statement', difficulty: 'intermediate', pools: ['post', 'mock'] },
    'A company sells equipment with a book value of $50 for $80 in cash (ignore taxes). How does the $30 gain show up on the cash flow statement?',
    [
      ['It is subtracted in CFO, and the full $80 of proceeds appears in CFI', 'The gain is already in net income; leaving it in CFO would count it twice once the $80 is in investing.', true],
      ['It stays in CFO, and $80 appears in CFI', 'That double-counts the $30.'],
      ['It is added back in CFO', 'A gain increased net income, so it is subtracted, not added. Losses are added back.'],
      ['Only the $30 gain appears, in CFI', 'Investing shows the full $80 received.'],
    ],
    'Gains: subtract in CFO, show proceeds in CFI.',
  ),
  mcq(
    { id: 'acc-q-027', subtopic: 'income-statement', difficulty: 'advanced', pools: ['post', 'mock'] },
    'Why is EBITDA so widely used, and what is its biggest weakness?',
    [
      ['It approximates operating cash flow before financing and tax choices, making companies comparable, but it ignores capex and working capital needs', 'Two companies with identical EBITDA can generate very different free cash flow.', true],
      ['It is a GAAP-required metric, but it is hard to calculate', 'EBITDA is a non-GAAP metric.'],
      ['It includes all cash costs, but it excludes revenue', 'EBITDA starts from revenue and excludes some cash costs (capex, interest, tax).'],
      ['It equals free cash flow, so it has no weaknesses', 'EBITDA is not free cash flow.'],
    ],
    'EBITDA is a comparability tool, not a cash flow measure.',
  ),
  mcq(
    { id: 'acc-q-028', subtopic: 'balance-sheet', difficulty: 'basic', pools: ['pre', 'post'] },
    'What is the difference between accounts payable and accrued expenses?',
    [
      ['Accounts payable are invoiced amounts owed to suppliers; accrued expenses are costs incurred but not yet invoiced or paid, such as wages and utilities', 'Both are current operating liabilities; the difference is whether an invoice exists yet.', true],
      ['Accounts payable are long-term; accrued expenses are short-term', 'Both are usually current liabilities.'],
      ['Accrued expenses are assets; accounts payable are liabilities', 'Both are liabilities.'],
      ['There is no difference', 'They are tracked separately for a reason.'],
    ],
    'AP = invoice received; accrued = expense recognized before the invoice.',
  ),
  mcq(
    { id: 'acc-q-029', subtopic: 'accrual-vs-cash', difficulty: 'intermediate', pools: ['post'] },
    'This month a company pays $20 of wages that it owed (and expensed) last month. What is the effect on this month’s net income?',
    [
      ['None', 'The expense was recognized last month; paying it reduces cash and accrued wages, not net income.', true],
      ['Down $20', 'That would double-count an expense already recognized.'],
      ['Down $15 after tax', 'No new expense is recognized this month.'],
      ['Up $20', 'Paying a liability doesn’t create income.'],
    ],
    'Accrual accounting separates the expense (last month) from the payment (this month).',
  ),
  num(
    { id: 'acc-q-030', subtopic: 'linkages', difficulty: 'intermediate', pools: ['post', 'mock'], followUps: ['acc-q-042'] },
    'Beginning retained earnings are $500. Net income is $120, dividends are $30 and the company repurchases $40 of stock. What are ending retained earnings?',
    590,
    ['Ending RE = 500 + 120 − 30 = 590', 'The buyback goes through treasury stock, not retained earnings'],
    'Retained earnings move only by net income and dividends.',
  ),
  num(
    { id: 'acc-q-031', subtopic: 'linkages', difficulty: 'intermediate', pools: ['post'] },
    'Beginning PP&E is $400. Capex is $90, depreciation $60, and equipment with a book value of $20 is sold. What is ending PP&E?',
    410,
    ['Ending PP&E = 400 + 90 − 60 − 20 = 410'],
    'PP&E roll-forward: + capex − depreciation − disposals (at book value).',
  ),
  num(
    { id: 'acc-q-032', subtopic: 'cash-flow-statement', difficulty: 'advanced', pools: ['post', 'mock'], followUps: ['acc-q-043'] },
    'Beginning cash is $100. Net income $80, D&A $25, inventory up $15, deferred revenue up $10, capex $60, new debt issued $50, dividends $20. What is ending cash?',
    170,
    ['CFO = 80 + 25 − 15 + 10 = 100', 'CFI = −60', 'CFF = 50 − 20 = 30', 'Net change = 100 − 60 + 30 = 70', 'Ending cash = 100 + 70 = 170'],
    'Build each section, then reconcile from beginning to ending cash.',
  ),
  num(
    { id: 'acc-q-033', subtopic: 'income-statement', difficulty: 'basic', pools: ['pre', 'post'] },
    'Pre-tax income is $240 and the tax rate is 25%. What is net income?',
    180,
    ['Taxes = 25% × 240 = 60', 'Net income = 240 − 60 = 180'],
    'Net income = pre-tax income × (1 − t).',
  ),
  order(
    { id: 'acc-q-034', subtopic: 'balance-sheet', difficulty: 'intermediate', pools: ['post'] },
    'Order these assets as they typically appear on a US balance sheet, from most to least liquid.',
    ['Cash and cash equivalents', 'Short-term investments', 'Accounts receivable', 'Inventory', 'Property, plant & equipment', 'Goodwill'],
    'Current assets come first in order of how quickly they turn into cash; long-lived and intangible assets follow.',
  ),
  walk(
    { id: 'acc-q-035', subtopic: 'accrual-vs-cash', difficulty: 'intermediate', pools: ['post', 'mock'] },
    'The company delivers $100 of services on credit; the customer will pay next quarter. Walk it through the three statements.',
    {
      IS: [['is.revenue', 'Revenue', 100], ['is.ebt', 'Pre-tax income', 100], ['is.tax', 'Tax expense', 25], ['is.ni', 'Net income', 75]],
      CFS: [['cfs.ni', 'Net income', 75], ['cfs.ar', '(Increase) / decrease in accounts receivable', -100], ['cfs.cfo', 'Cash from operations', -25], ['cfs.net', 'Net change in cash', -25]],
      BS: [['bs.cash', 'Cash', -25, 'A'], ['bs.ar', 'Accounts receivable', 100, 'A'], ['bs.re', 'Retained earnings', 75, 'LE']],
    },
    'Revenue is earned, so it’s recognized: NI +75. But no cash came in, and the company paid $25 of tax, so CFO is −25 (NI 75 − AR increase 100). AR +100 and cash −25 (assets +75) = retained earnings +75.',
    { assumptions: ['Taxes are paid in cash this period.'] },
  ),
  walk(
    { id: 'acc-q-036', subtopic: 'accrual-vs-cash', difficulty: 'intermediate', pools: ['post'] },
    'The company receives $60 in cash in advance for a service it will deliver next year. Walk it through the three statements.',
    {
      IS: [['is.revenue', 'Revenue', 0], ['is.ni', 'Net income', 0]],
      CFS: [['cfs.ni', 'Net income', 0], ['cfs.deferredRevenue', 'Increase in deferred revenue', 60], ['cfs.cfo', 'Cash from operations', 60], ['cfs.net', 'Net change in cash', 60]],
      BS: [['bs.cash', 'Cash', 60, 'A'], ['bs.deferredRevenue', 'Deferred revenue', 60, 'LE'], ['bs.re', 'Retained earnings', 0, 'LE']],
    },
    'No revenue until the service is delivered. The increase in deferred revenue (a liability) is a source of cash. Cash +60 = deferred revenue +60.',
    { assumptions: ['Ignore any tax on the cash received.'] },
  ),
  walk(
    { id: 'acc-q-037', subtopic: 'working-capital', difficulty: 'basic', pools: ['pre', 'post'] },
    'The company buys $30 of inventory on credit (it will pay the supplier later). Walk it through the three statements.',
    {
      IS: [['is.cogs', 'COGS (expense)', 0], ['is.ni', 'Net income', 0]],
      CFS: [['cfs.ni', 'Net income', 0], ['cfs.inventory', '(Increase) / decrease in inventory', -30], ['cfs.ap', 'Increase in accounts payable', 30], ['cfs.cfo', 'Cash from operations', 0], ['cfs.net', 'Net change in cash', 0]],
      BS: [['bs.cash', 'Cash', 0, 'A'], ['bs.inventory', 'Inventory', 30, 'A'], ['bs.ap', 'Accounts payable', 30, 'LE']],
    },
    'Inventory up (use of cash) and AP up (source of cash) offset exactly. Inventory +30 = AP +30.',
  ),
  free(
    { id: 'acc-q-038', subtopic: 'working-capital', difficulty: 'intermediate', pools: ['mock'], followUps: ['acc-q-007'] },
    'What is working capital, and why do bankers usually exclude cash and debt from it?',
    [
      ['def', 'Working capital = current assets − current liabilities', [['current assets', 'current liabilities']]],
      ['op', 'Operating working capital uses only operating items like AR, inventory, AP, accrued expenses', [['receivable*|inventory', 'payable*|accrued']]],
      ['excl', 'Cash and debt are financing items, not part of day-to-day operations', [['cash', 'debt', 'financing|operations|operating']]],
      ['cf', 'Changes in operating working capital drive cash flow from operations', [['cash flow|cash from operations|cfo']]],
    ],
    'Working capital is current assets minus current liabilities. Bankers usually focus on operating working capital: accounts receivable, inventory and prepaid expenses, less accounts payable, accrued expenses and deferred revenue. Cash and debt are excluded because they are financing items rather than part of day-to-day operations, and they are handled separately, for example in the bridge from enterprise value to equity value. What matters for valuation is the change in operating working capital, because it flows straight into cash from operations and free cash flow.',
    'Define it, narrow it to operating items, and explain the exclusion.',
    45,
  ),
  free(
    { id: 'acc-q-039', subtopic: 'linkages', difficulty: 'advanced', pools: ['mock'] },
    'How can a company report positive net income and still go bankrupt?',
    [
      ['notcash', 'Net income is not cash: accrual accounting and non-cash items', [['not cash|isnt cash|accrual*']]],
      ['wc', 'Cash tied up in working capital (receivables not collected, inventory build)', [['working capital'], ['receivable*'], ['inventory']]],
      ['capex', 'Heavy capex or other cash needs that never hit the income statement', [['capex|capital expenditure*|investing']]],
      ['debt', 'Debt principal and maturities it can’t repay or refinance: a liquidity crisis', [['debt|principal|matur*|refinanc*|liquidity']]],
    ],
    'Because net income isn’t cash. A company can book profitable sales on credit and never collect them, or tie up cash in inventory as it grows, so cash from operations can be negative while net income is positive. Capex and debt principal repayments don’t show up on the income statement at all. If the company can’t pay its suppliers or repay or refinance debt that’s coming due, it runs out of liquidity and can be forced into bankruptcy even though it is “profitable”.',
    'Profitability and liquidity are different things.',
    45,
  ),
  rapid(
    { id: 'acc-q-040', subtopic: 'income-statement', difficulty: 'basic', pools: ['post', 'mock'] },
    'Net income is $90, there is no interest and the tax rate is 25%. What is EBIT?',
    120,
    'EBIT = 90 / (1 − 0.25) = 120.',
    { seconds: 20 },
  ),
  rapid(
    { id: 'acc-q-041', subtopic: 'working-capital', difficulty: 'basic', pools: ['pre'] },
    'Accounts receivable rises from $40 to $55. What is the effect on cash from operations?',
    -15,
    'AR up 15 is a use of cash: −15.',
  ),
  mcq(
    { id: 'acc-q-042', subtopic: 'balance-sheet', difficulty: 'elite', pools: ['mock'] },
    'Can shareholders’ equity on the balance sheet be negative? When?',
    [
      ['Yes: from accumulated losses, or from buybacks and dividends funded with debt that exceed retained earnings', 'Some mature companies, McDonald’s for example, have run negative book equity for years because they returned more capital than they retained, while remaining very healthy.', true],
      ['No: assets must always exceed liabilities by law', 'There is no such requirement; it’s an accounting outcome.'],
      ['Only when the company is in bankruptcy', 'Healthy companies can have negative book equity.'],
      ['Only under IFRS', 'It happens under US GAAP too.'],
    ],
    'Negative book equity isn’t automatically distress; check the cause.',
  ),
  num(
    { id: 'acc-q-043', subtopic: 'cash-flow-statement', difficulty: 'elite', pools: ['mock'] },
    'From last year to this year: AR rose from $100 to $130, inventory fell from $80 to $70, AP rose from $60 to $75, and accrued expenses fell from $20 to $18. Net income is $50 and D&A is $15. What is cash from operations?',
    58,
    ['Start: NI 50 + D&A 15 = 65', 'AR +30 → −30 = 35', 'Inventory −10 → +10 = 45', 'AP +15 → +15 = 60', 'Accrued −2 → −2 = 58'],
    'Rebuild CFO from two balance sheets: asset up = cash down; liability up = cash up.',
  ),
  mcq(
    { id: 'acc-q-044', subtopic: 'income-statement', difficulty: 'advanced', pools: ['post', 'mock'] },
    'When calculating normalized (adjusted) EBITDA, which of these is the best example of an item to adjust for?',
    [
      ['A one-time restructuring charge to close a plant', 'Genuinely non-recurring items distort run-rate profitability, so bankers add them back (and disclose it).', true],
      ['Annual stock-based compensation', 'SBC recurs every year; many investors argue it shouldn’t be added back at all.'],
      ['Interest expense', 'Interest is already below EBITDA; there’s nothing to adjust.'],
      ['Normal annual marketing spend', 'Recurring operating costs are part of normalized profitability.'],
    ],
    'Normalize for items that won’t recur; be skeptical of “adjustments” that happen every year.',
  ),
];
