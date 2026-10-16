import type { Question } from '../../../types/questions';
import { builders } from '../../helpers';

const { mcq, num, rapid, order, walk, free } = builders('walkthroughs');

/**
 * Statement walk-throughs. Default tax rate 25%; "taxes paid in cash" unless
 * a question says otherwise. Expenses on the IS are entered as positive when
 * the expense increases.
 */
export const questions: Question[] = [
  // ── Depreciation ──
  walk(
    { id: 'wt-q-001', subtopic: 'depreciation', difficulty: 'basic', pools: ['pre', 'post'] },
    'Depreciation increases by $10. Walk me through the three statements.',
    {
      IS: [['is.da', 'Depreciation (expense)', 10], ['is.ebt', 'Pre-tax income', -10], ['is.tax', 'Tax expense', -2.5], ['is.ni', 'Net income', -7.5]],
      CFS: [['cfs.ni', 'Net income', -7.5], ['cfs.da', 'Depreciation (add-back)', 10], ['cfs.cfo', 'Cash from operations', 2.5], ['cfs.net', 'Net change in cash', 2.5]],
      BS: [['bs.cash', 'Cash', 2.5, 'A'], ['bs.ppe', 'PP&E', -10, 'A'], ['bs.re', 'Retained earnings', -7.5, 'LE']],
    },
    'IS: pre-tax income falls $10, taxes fall $2.50, net income falls $7.50. CFS: net income −7.50, add back the $10 non-cash depreciation, so cash rises $2.50 (the tax saving). BS: cash +2.50, PP&E −10 (assets −7.50) and retained earnings −7.50.',
  ),
  walk(
    { id: 'wt-q-002', subtopic: 'depreciation', difficulty: 'basic', pools: ['post'] },
    'Depreciation decreases by $20. Walk me through the three statements.',
    {
      IS: [['is.da', 'Depreciation (expense)', -20], ['is.ebt', 'Pre-tax income', 20], ['is.tax', 'Tax expense', 5], ['is.ni', 'Net income', 15]],
      CFS: [['cfs.ni', 'Net income', 15], ['cfs.da', 'Depreciation (add-back)', -20], ['cfs.cfo', 'Cash from operations', -5], ['cfs.net', 'Net change in cash', -5]],
      BS: [['bs.cash', 'Cash', -5, 'A'], ['bs.ppe', 'PP&E', 20, 'A'], ['bs.re', 'Retained earnings', 15, 'LE']],
    },
    'The mirror image of an increase: net income rises $15, but $20 less is added back, so cash falls by the $5 of extra taxes. PP&E is $20 higher (assets +15) and retained earnings +15.',
  ),

  // ── Inventory ──
  walk(
    { id: 'wt-q-003', subtopic: 'inventory', difficulty: 'intermediate', pools: ['pre', 'post'] },
    'The company writes down $40 of inventory. Walk me through the three statements.',
    {
      IS: [['is.cogs', 'COGS incl. write-down (expense)', 40], ['is.ebt', 'Pre-tax income', -40], ['is.tax', 'Tax expense', -10], ['is.ni', 'Net income', -30]],
      CFS: [['cfs.ni', 'Net income', -30], ['cfs.writedown', 'Inventory write-down (non-cash add-back)', 40], ['cfs.cfo', 'Cash from operations', 10], ['cfs.net', 'Net change in cash', 10]],
      BS: [['bs.cash', 'Cash', 10, 'A'], ['bs.inventory', 'Inventory', -40, 'A'], ['bs.re', 'Retained earnings', -30, 'LE']],
    },
    'A write-down works like depreciation: a non-cash expense that saves cash taxes. Net income −30, add back 40, cash +10. Inventory −40 and cash +10 (assets −30) match retained earnings −30. Some models show the add-back as a decrease in inventory instead; the totals are the same.',
    { assumptions: ['The write-down is tax-deductible this year.'] },
  ),
  walk(
    { id: 'wt-q-004', subtopic: 'inventory', difficulty: 'basic', pools: ['pre', 'post'] },
    'The company buys $50 of inventory with cash. Walk me through the three statements.',
    {
      IS: [['is.cogs', 'COGS (expense)', 0], ['is.ni', 'Net income', 0]],
      CFS: [['cfs.ni', 'Net income', 0], ['cfs.inventory', '(Increase) / decrease in inventory', -50], ['cfs.cfo', 'Cash from operations', -50], ['cfs.net', 'Net change in cash', -50]],
      BS: [['bs.cash', 'Cash', -50, 'A'], ['bs.inventory', 'Inventory', 50, 'A'], ['bs.re', 'Retained earnings', 0, 'LE']],
    },
    'Nothing hits the income statement until the inventory is sold. The inventory increase is a use of cash in CFO; on the balance sheet one asset (cash) becomes another (inventory).',
  ),
  walk(
    { id: 'wt-q-005', subtopic: 'inventory', difficulty: 'intermediate', pools: ['post'] },
    'That $50 of inventory is now sold for $80 in cash. Walk me through the three statements.',
    {
      IS: [['is.revenue', 'Revenue', 80], ['is.cogs', 'COGS (expense)', 50], ['is.ebt', 'Pre-tax income', 30], ['is.tax', 'Tax expense', 7.5], ['is.ni', 'Net income', 22.5]],
      CFS: [['cfs.ni', 'Net income', 22.5], ['cfs.inventory', '(Increase) / decrease in inventory', 50], ['cfs.cfo', 'Cash from operations', 72.5], ['cfs.net', 'Net change in cash', 72.5]],
      BS: [['bs.cash', 'Cash', 72.5, 'A'], ['bs.inventory', 'Inventory', -50, 'A'], ['bs.re', 'Retained earnings', 22.5, 'LE']],
    },
    'Revenue 80 − COGS 50 = 30 pre-tax, 22.50 after tax. On the CFS, the inventory decrease is a source of cash (+50), so cash rises 72.50 = $80 collected − $7.50 taxes paid.',
  ),

  // ── PP&E and debt ──
  walk(
    { id: 'wt-q-006', subtopic: 'ppe-debt', difficulty: 'intermediate', pools: ['pre', 'post', 'mock'], followUps: ['wt-q-007', 'wt-q-008'] },
    'The company buys $100 of PP&E, funded entirely with $100 of new debt. Walk me through the three statements at the moment of purchase.',
    {
      IS: [['is.da', 'Depreciation (expense)', 0], ['is.ni', 'Net income', 0]],
      CFS: [['cfs.cfo', 'Cash from operations', 0], ['cfs.capex', 'Capital expenditures', -100], ['cfs.debt', 'Debt issued / (repaid)', 100], ['cfs.net', 'Net change in cash', 0]],
      BS: [['bs.cash', 'Cash', 0, 'A'], ['bs.ppe', 'PP&E', 100, 'A'], ['bs.debt', 'Debt', 100, 'LE']],
    },
    'No income statement impact yet. Capex is −100 in investing and the debt raise is +100 in financing, so cash is unchanged. PP&E +100 on the asset side, debt +100 on the liability side.',
  ),
  walk(
    { id: 'wt-q-007', subtopic: 'ppe-debt', difficulty: 'advanced', pools: ['mock'] },
    'Same PP&E and debt. One year later, the PP&E is depreciated by $10 and the debt carries 10% interest, paid in cash. Walk me through year 1.',
    {
      IS: [['is.da', 'Depreciation (expense)', 10], ['is.interest', 'Interest expense', 10], ['is.ebt', 'Pre-tax income', -20], ['is.tax', 'Tax expense', -5], ['is.ni', 'Net income', -15]],
      CFS: [['cfs.ni', 'Net income', -15], ['cfs.da', 'Depreciation (add-back)', 10], ['cfs.cfo', 'Cash from operations', -5], ['cfs.net', 'Net change in cash', -5]],
      BS: [['bs.cash', 'Cash', -5, 'A'], ['bs.ppe', 'PP&E', -10, 'A'], ['bs.debt', 'Debt', 0, 'LE'], ['bs.re', 'Retained earnings', -15, 'LE']],
    },
    'Pre-tax income falls by D&A 10 + interest 10 = 20, net income by 15. Add back the 10 of depreciation: cash −5 (interest is cash, depreciation is not; 20 × 25% = 5 of tax savings). PP&E −10, cash −5 (assets −15) = retained earnings −15. Debt is unchanged because no principal was repaid.',
  ),
  walk(
    { id: 'wt-q-008', subtopic: 'ppe-debt', difficulty: 'advanced', pools: ['mock'] },
    'Same as year 1 (depreciation $10, 10% interest on $100 of debt), but the company also repays $20 of debt principal. Walk me through year 1.',
    {
      IS: [['is.da', 'Depreciation (expense)', 10], ['is.interest', 'Interest expense', 10], ['is.ebt', 'Pre-tax income', -20], ['is.tax', 'Tax expense', -5], ['is.ni', 'Net income', -15]],
      CFS: [['cfs.ni', 'Net income', -15], ['cfs.da', 'Depreciation (add-back)', 10], ['cfs.cfo', 'Cash from operations', -5], ['cfs.debt', 'Debt issued / (repaid)', -20], ['cfs.net', 'Net change in cash', -25]],
      BS: [['bs.cash', 'Cash', -25, 'A'], ['bs.ppe', 'PP&E', -10, 'A'], ['bs.debt', 'Debt', -20, 'LE'], ['bs.re', 'Retained earnings', -15, 'LE']],
    },
    'Principal repayment never touches the income statement; it is a financing outflow. Cash −25 and PP&E −10 (assets −35) = debt −20 and retained earnings −15.',
  ),
  walk(
    { id: 'wt-q-022', subtopic: 'ppe-debt', difficulty: 'advanced', pools: ['post', 'mock'], followUps: ['wt-q-023'] },
    'The company sells equipment with a book value of $60 for $100 in cash. Walk me through the three statements.',
    {
      IS: [['is.gain', 'Gain on sale', 40], ['is.ebt', 'Pre-tax income', 40], ['is.tax', 'Tax expense', 10], ['is.ni', 'Net income', 30]],
      CFS: [['cfs.ni', 'Net income', 30], ['cfs.gain', '(Gain) / loss on sale', -40], ['cfs.cfo', 'Cash from operations', -10], ['cfs.proceeds', 'Proceeds from asset sale', 100], ['cfs.net', 'Net change in cash', 90]],
      BS: [['bs.cash', 'Cash', 90, 'A'], ['bs.ppe', 'PP&E', -60, 'A'], ['bs.re', 'Retained earnings', 30, 'LE']],
    },
    'The $40 gain is in net income, but the cash came from investing, so subtract the gain in CFO (otherwise it would be counted twice) and show the full $100 of proceeds in CFI. CFO is −10: the tax on the gain. Cash +90, PP&E −60 (assets +30) = retained earnings +30.',
    { assumptions: ['Tax on the gain is paid in cash.'] },
  ),
  walk(
    { id: 'wt-q-023', subtopic: 'ppe-debt', difficulty: 'elite', pools: ['mock'] },
    'Now the same equipment (book value $60) sells for only $40. Walk me through the three statements.',
    {
      IS: [['is.gain', 'Gain / (loss) on sale', -20], ['is.ebt', 'Pre-tax income', -20], ['is.tax', 'Tax expense', -5], ['is.ni', 'Net income', -15]],
      CFS: [['cfs.ni', 'Net income', -15], ['cfs.gain', '(Gain) / loss on sale', 20], ['cfs.cfo', 'Cash from operations', 5], ['cfs.proceeds', 'Proceeds from asset sale', 40], ['cfs.net', 'Net change in cash', 45]],
      BS: [['bs.cash', 'Cash', 45, 'A'], ['bs.ppe', 'PP&E', -60, 'A'], ['bs.re', 'Retained earnings', -15, 'LE']],
    },
    'A $20 loss reduces pre-tax income and saves $5 of tax. Add the non-cash loss back in CFO (+20), giving CFO +5, and record $40 of proceeds in CFI. Cash +45, PP&E −60 (assets −15) = retained earnings −15.',
  ),
  num(
    { id: 'wt-q-036', subtopic: 'ppe-debt', difficulty: 'intermediate', pools: ['post'] },
    'The company buys $200 of PP&E with cash, then records $20 of depreciation in year 1 (25% tax rate). Including the purchase, what is the cumulative change in cash by the end of year 1?',
    -195,
    ['Purchase: capex −200', 'Year 1: depreciation saves 20 × 25% = 5 of cash taxes', 'Cumulative: −200 + 5 = −195'],
    'Capex hits cash immediately; depreciation only affects cash through the tax saving.',
  ),
  num(
    { id: 'wt-q-044', subtopic: 'ppe-debt', difficulty: 'elite', pools: ['mock'] },
    'The company buys $100 of PP&E with debt at 8% interest. The PP&E is depreciated straight-line over 5 years. Tax rate 25%. By how much does net income change in year 1?',
    -21,
    ['Depreciation = 100 / 5 = 20', 'Interest = 8% × 100 = 8', 'Pre-tax income: −28', 'Net income: −28 × (1 − 25%) = −21'],
    'Both depreciation and interest reduce pre-tax income; taxes offset a quarter of it.',
  ),

  // ── Debt and interest ──
  walk(
    { id: 'wt-q-009', subtopic: 'debt-interest', difficulty: 'intermediate', pools: ['post'] },
    'Interest expense increases by $10, paid in cash. Walk me through the three statements.',
    {
      IS: [['is.interest', 'Interest expense', 10], ['is.ebt', 'Pre-tax income', -10], ['is.tax', 'Tax expense', -2.5], ['is.ni', 'Net income', -7.5]],
      CFS: [['cfs.ni', 'Net income', -7.5], ['cfs.cfo', 'Cash from operations', -7.5], ['cfs.net', 'Net change in cash', -7.5]],
      BS: [['bs.cash', 'Cash', -7.5, 'A'], ['bs.re', 'Retained earnings', -7.5, 'LE']],
    },
    'Interest is a cash expense, so there is nothing to add back: cash falls by the after-tax amount, 7.50. Under US GAAP, interest paid sits in cash from operations.',
  ),
  walk(
    { id: 'wt-q-010', subtopic: 'debt-interest', difficulty: 'basic', pools: ['pre', 'post'] },
    'The company raises $100 of debt and holds the cash. Walk me through the three statements.',
    {
      IS: [['is.interest', 'Interest expense', 0], ['is.ni', 'Net income', 0]],
      CFS: [['cfs.ni', 'Net income', 0], ['cfs.debt', 'Debt issued / (repaid)', 100], ['cfs.net', 'Net change in cash', 100]],
      BS: [['bs.cash', 'Cash', 100, 'A'], ['bs.debt', 'Debt', 100, 'LE']],
    },
    'Raising debt is a financing inflow. Cash and debt both rise by 100; no income statement impact until interest accrues.',
  ),
  walk(
    { id: 'wt-q-011', subtopic: 'debt-interest', difficulty: 'intermediate', pools: ['post'] },
    'The company repays $50 of debt principal. Walk me through the three statements.',
    {
      IS: [['is.interest', 'Interest expense', 0], ['is.ni', 'Net income', 0]],
      CFS: [['cfs.ni', 'Net income', 0], ['cfs.debt', 'Debt issued / (repaid)', -50], ['cfs.net', 'Net change in cash', -50]],
      BS: [['bs.cash', 'Cash', -50, 'A'], ['bs.debt', 'Debt', -50, 'LE']],
    },
    'Principal repayment is a financing outflow with no income statement impact. Cash and debt both fall by 50.',
  ),
  walk(
    { id: 'wt-q-024', subtopic: 'debt-interest', difficulty: 'elite', pools: ['mock'] },
    'A company has $100 of bonds outstanding (carried at $100). Their market price has fallen and it buys them all back for $80 in cash. Walk me through the three statements.',
    {
      IS: [['is.gain', 'Gain on debt extinguishment', 20], ['is.ebt', 'Pre-tax income', 20], ['is.tax', 'Tax expense', 5], ['is.ni', 'Net income', 15]],
      CFS: [['cfs.ni', 'Net income', 15], ['cfs.gain', '(Gain) on extinguishment', -20], ['cfs.cfo', 'Cash from operations', -5], ['cfs.debt', 'Debt repurchased', -80], ['cfs.net', 'Net change in cash', -85]],
      BS: [['bs.cash', 'Cash', -85, 'A'], ['bs.debt', 'Debt', -100, 'LE'], ['bs.re', 'Retained earnings', 15, 'LE']],
    },
    'Retiring $100 of debt for $80 books a $20 gain. Reverse the non-cash gain in CFO, and show the $80 actually paid in CFF. Cash −85 = debt −100 + retained earnings +15.',
    { assumptions: ['Tax on the gain is paid in cash.'] },
  ),
  mcq(
    { id: 'wt-q-045', subtopic: 'debt-interest', difficulty: 'basic', pools: ['pre', 'post'] },
    'How does repaying $50 of debt principal affect the income statement?',
    [
      ['It has no effect', 'Principal is a return of borrowed money, not an expense. Only interest hits the income statement.', true],
      ['Net income falls by $50', 'That would treat principal as an expense; it isn’t.'],
      ['Net income falls by $37.50', 'This tax-effects the repayment as if it were an expense. Principal is not deductible.'],
      ['Interest expense falls by $50', 'Interest expense will fall in future periods because the balance is lower, but not by the principal amount.'],
    ],
    'Repaying principal reduces cash and debt only. Future interest expense falls because the balance is smaller.',
  ),

  // ── Stock-based compensation ──
  walk(
    { id: 'wt-q-012', subtopic: 'sbc', difficulty: 'intermediate', pools: ['pre', 'post'] },
    'The company records $20 of stock-based compensation. Walk me through the three statements.',
    {
      IS: [['is.sbc', 'Stock-based compensation (expense)', 20], ['is.ebt', 'Pre-tax income', -20], ['is.tax', 'Tax expense', -5], ['is.ni', 'Net income', -15]],
      CFS: [['cfs.ni', 'Net income', -15], ['cfs.sbc', 'SBC (non-cash add-back)', 20], ['cfs.cfo', 'Cash from operations', 5], ['cfs.net', 'Net change in cash', 5]],
      BS: [['bs.cash', 'Cash', 5, 'A'], ['bs.apic', 'Common stock & APIC', 20, 'LE'], ['bs.re', 'Retained earnings', -15, 'LE']],
    },
    'SBC is a real expense paid in shares, not cash. Net income −15, add back 20, cash +5. On the balance sheet, common stock/APIC rises by the 20 of shares issued and retained earnings falls 15: equity +5 = cash +5.',
    { assumptions: ['Assume the SBC is tax-deductible this year.'] },
  ),
  walk(
    { id: 'wt-q-025', subtopic: 'sbc', difficulty: 'intermediate', pools: ['post'] },
    'Employees exercise 10 options with a $5 strike price; the company issues 10 new shares. Walk me through the three statements.',
    {
      IS: [['is.ni', 'Net income', 0], ['is.sbc', 'Stock-based compensation (expense)', 0]],
      CFS: [['cfs.ni', 'Net income', 0], ['cfs.equity', 'Proceeds from stock issued', 50], ['cfs.net', 'Net change in cash', 50]],
      BS: [['bs.cash', 'Cash', 50, 'A'], ['bs.apic', 'Common stock & APIC', 50, 'LE']],
    },
    'The expense was recognized over the vesting period; at exercise the company simply receives 10 × $5 = $50 in cash (a financing inflow) and issues shares, so equity rises by 50.',
    { assumptions: ['Ignore any tax benefit on exercise.'] },
  ),

  // ── Deferred taxes and NOLs ──
  walk(
    { id: 'wt-q-013', subtopic: 'deferred-taxes', difficulty: 'advanced', pools: ['post', 'mock'], followUps: ['wt-q-014'] },
    'For tax purposes the company uses accelerated depreciation, so tax depreciation exceeds book depreciation by $40 this year. Book depreciation is unchanged. Walk me through the three statements.',
    {
      IS: [['is.ebt', 'Pre-tax income (book)', 0], ['is.tax', 'Total tax expense (book)', 0], ['is.ni', 'Net income', 0]],
      CFS: [['cfs.ni', 'Net income', 0], ['cfs.deferredTax', 'Deferred taxes', 10], ['cfs.cfo', 'Cash from operations', 10], ['cfs.net', 'Net change in cash', 10]],
      BS: [['bs.cash', 'Cash', 10, 'A'], ['bs.dtl', 'Deferred tax liability', 10, 'LE'], ['bs.re', 'Retained earnings', 0, 'LE']],
    },
    'Book income and book tax expense don’t change, but cash taxes fall by 40 × 25% = 10 (current tax −10, deferred tax +10). The deferred tax is a non-cash expense added back, so cash +10, matched by a $10 deferred tax liability: the company will pay those taxes later when tax depreciation drops below book.',
  ),
  walk(
    { id: 'wt-q-014', subtopic: 'deferred-taxes', difficulty: 'elite', pools: ['mock'] },
    'The company has $40 of NOLs, already recorded as a $10 deferred tax asset. This year it earns $100 of pre-tax income and uses all the NOLs. Walk me through the three statements.',
    {
      IS: [['is.ebt', 'Pre-tax income', 100], ['is.tax', 'Tax expense (book)', 25], ['is.ni', 'Net income', 75]],
      CFS: [['cfs.ni', 'Net income', 75], ['cfs.deferredTax', 'Deferred taxes (DTA used)', 10], ['cfs.cfo', 'Cash from operations', 85], ['cfs.net', 'Net change in cash', 85]],
      BS: [['bs.cash', 'Cash', 85, 'A'], ['bs.dta', 'Deferred tax asset', -10, 'A'], ['bs.re', 'Retained earnings', 75, 'LE']],
    },
    'Because the DTA was already booked, book tax expense is a normal 25% (25). Cash taxes are only (100 − 40) × 25% = 15. The $10 difference is the DTA being used up: a non-cash item added back. Cash +85 and DTA −10 (assets +75) = retained earnings +75.',
  ),
  mcq(
    { id: 'wt-q-030', subtopic: 'deferred-taxes', difficulty: 'intermediate', pools: ['post'] },
    'Which of these creates a deferred tax liability?',
    [
      ['Using accelerated depreciation for taxes while depreciating straight-line for the books', 'Cash taxes are lower than book taxes today and higher later, so the company owes tax in the future: a DTL.', true],
      ['Accumulating net operating losses', 'NOLs reduce future cash taxes, which creates a deferred tax asset, not a liability.'],
      ['Owing this quarter’s income tax but not having paid it yet', 'That is income taxes payable, an ordinary current liability.'],
      ['Prepaying next year’s taxes', 'A prepayment is an asset.'],
    ],
    'A DTL arises when book tax expense exceeds cash taxes now, so more cash tax will be paid in the future.',
  ),
  mcq(
    { id: 'wt-q-031', subtopic: 'deferred-taxes', difficulty: 'intermediate', pools: ['post', 'mock'] },
    'Which of these creates a deferred tax asset?',
    [
      ['Net operating losses that can offset future taxable income', 'Future cash taxes will be lower, so the company records an asset (subject to a valuation allowance if use is unlikely).', true],
      ['Tax depreciation running ahead of book depreciation', 'That lowers cash taxes now and raises them later: a deferred tax liability.'],
      ['A gain on an asset sale', 'A gain increases taxable income now; on its own it doesn’t create a deferred tax asset.'],
      ['Issuing debt', 'Debt issuance has no immediate tax effect.'],
    ],
    'DTAs represent future tax savings: NOLs are the classic example; expenses booked before they are deductible (e.g. some accruals) are another.',
  ),
  free(
    { id: 'wt-q-038', subtopic: 'deferred-taxes', difficulty: 'advanced', pools: ['mock'] },
    'How do NOLs affect the three statements when a company uses them?',
    [
      ['cash', 'They reduce cash taxes paid', [['cash tax*'], ['lower', 'tax*'], ['reduce*', 'tax*']]],
      ['dta', 'If a DTA was recorded, book tax expense is unchanged and the DTA is used up (a non-cash add-back)', [['deferred tax asset|dta']]],
      ['nodta', 'If no DTA was recorded (full valuation allowance), tax expense itself is lower and net income higher', [['valuation allowance'], ['net income', 'higher'], ['tax expense', 'lower']]],
      ['bs', 'Balance sheet: cash up, DTA down, retained earnings reflect book net income', [['cash', 'balance sheet'], ['retained earnings']]],
    ],
    'Using NOLs reduces the cash taxes the company actually pays. If the company already recorded a deferred tax asset for them, book tax expense stays at the normal rate, so net income doesn’t change; the difference between book tax and cash tax shows up as the DTA being used, a non-cash add-back on the cash flow statement, so cash goes up. On the balance sheet, cash rises, the deferred tax asset falls and retained earnings reflect the normal net income. If the company had a full valuation allowance instead, there’s no DTA to use, so tax expense itself is lower and net income is higher.',
    'The key distinction is whether a DTA was recorded: that decides whether the benefit shows up in net income or only in cash.',
  ),

  // ── Goodwill and impairment ──
  walk(
    { id: 'wt-q-015', subtopic: 'goodwill-impairment', difficulty: 'intermediate', pools: ['pre', 'post', 'mock'], followUps: ['wt-q-016', 'wt-q-042'] },
    'The company records a $100 goodwill impairment. Walk me through the three statements.',
    {
      IS: [['is.impairment', 'Impairment charge (expense)', 100], ['is.ebt', 'Pre-tax income', -100], ['is.tax', 'Tax expense', -25], ['is.ni', 'Net income', -75]],
      CFS: [['cfs.ni', 'Net income', -75], ['cfs.impairment', 'Impairment (non-cash add-back)', 100], ['cfs.cfo', 'Cash from operations', 25], ['cfs.net', 'Net change in cash', 25]],
      BS: [['bs.cash', 'Cash', 25, 'A'], ['bs.goodwill', 'Goodwill', -100, 'A'], ['bs.re', 'Retained earnings', -75, 'LE']],
    },
    'The textbook answer treats the impairment like any non-cash charge: NI −75, add back 100, cash +25, goodwill −100, retained earnings −75. In reality goodwill impairments are usually not tax-deductible, so say your assumption out loud; the next question covers that case.',
    { assumptions: ['For this question, assume the impairment reduces cash taxes.'] },
  ),
  walk(
    { id: 'wt-q-016', subtopic: 'goodwill-impairment', difficulty: 'advanced', pools: ['mock'], tags: ['tax-nondeductible'] },
    'Same $100 goodwill impairment, but this time it is not tax-deductible. Walk me through the three statements.',
    {
      IS: [['is.impairment', 'Impairment charge (expense)', 100], ['is.ebt', 'Pre-tax income', -100], ['is.tax', 'Tax expense', 0], ['is.ni', 'Net income', -100]],
      CFS: [['cfs.ni', 'Net income', -100], ['cfs.impairment', 'Impairment (non-cash add-back)', 100], ['cfs.cfo', 'Cash from operations', 0], ['cfs.net', 'Net change in cash', 0]],
      BS: [['bs.cash', 'Cash', 0, 'A'], ['bs.goodwill', 'Goodwill', -100, 'A'], ['bs.re', 'Retained earnings', -100, 'LE']],
    },
    'With no tax deduction, net income falls by the full 100 and cash doesn’t move at all. Goodwill −100 = retained earnings −100.',
  ),
  mcq(
    { id: 'wt-q-032', subtopic: 'goodwill-impairment', difficulty: 'intermediate', pools: ['post'] },
    'Which statement about a goodwill impairment is correct?',
    [
      ['It is a non-cash charge: it reduces operating income, is added back in cash from operations, and reduces goodwill', 'It recognizes that an acquisition is worth less than paid; no cash leaves the business.', true],
      ['It is a cash outflow in cash from investing', 'No cash is paid; the write-down is an accounting adjustment.'],
      ['It goes directly to retained earnings without touching the income statement', 'Impairments run through the income statement (usually within operating expenses).'],
      ['It increases goodwill to its fair value', 'Under US GAAP goodwill can be written down but never written back up.'],
    ],
    'Impairments are non-cash and one-directional: goodwill can be impaired but not re-appreciated under US GAAP.',
  ),
  mcq(
    { id: 'wt-q-042', subtopic: 'goodwill-impairment', difficulty: 'elite', pools: ['mock'] },
    'Why does a goodwill impairment often have no effect on cash taxes in practice?',
    [
      ['Goodwill impairments are generally not deductible for tax; where goodwill is tax-deductible, the deduction follows its own amortization schedule', 'In a stock deal there is usually no tax basis in goodwill at all; in an asset deal (US) tax goodwill is amortized over 15 years regardless of book impairments.', true],
      ['Because impairments are recorded below net income', 'They are recorded above net income, usually in operating expenses.'],
      ['Because the IRS requires goodwill to be written up each year', 'There is no such requirement.'],
      ['Because impairments are capitalized onto the balance sheet', 'An impairment reduces an asset; nothing is capitalized.'],
    ],
    'The simplified interview answer assumes a tax saving, but strong candidates add that book impairments usually don’t change cash taxes.',
  ),

  // ── Dividends and buybacks ──
  walk(
    { id: 'wt-q-017', subtopic: 'dividends-buybacks', difficulty: 'basic', pools: ['pre', 'post'] },
    'The company pays $30 of dividends. Walk me through the three statements.',
    {
      IS: [['is.ni', 'Net income', 0]],
      CFS: [['cfs.ni', 'Net income', 0], ['cfs.dividends', 'Dividends paid', -30], ['cfs.net', 'Net change in cash', -30]],
      BS: [['bs.cash', 'Cash', -30, 'A'], ['bs.re', 'Retained earnings', -30, 'LE']],
    },
    'Dividends are a distribution of profits, not an expense, so they skip the income statement. They are a financing outflow and reduce retained earnings directly.',
  ),
  walk(
    { id: 'wt-q-018', subtopic: 'dividends-buybacks', difficulty: 'basic', pools: ['pre', 'post'] },
    'The company buys back $50 of its own stock. Walk me through the three statements.',
    {
      IS: [['is.ni', 'Net income', 0]],
      CFS: [['cfs.ni', 'Net income', 0], ['cfs.buyback', 'Share repurchases', -50], ['cfs.net', 'Net change in cash', -50]],
      BS: [['bs.cash', 'Cash', -50, 'A'], ['bs.treasury', 'Treasury stock (contra-equity)', -50, 'LE'], ['bs.re', 'Retained earnings', 0, 'LE']],
    },
    'A buyback is a financing outflow. Equity falls through treasury stock, not retained earnings. Share count falls too, which matters for EPS.',
  ),
  mcq(
    { id: 'wt-q-033', subtopic: 'dividends-buybacks', difficulty: 'basic', pools: ['pre', 'post'] },
    'Do dividends affect net income?',
    [
      ['No: they are paid out of net income and reduce retained earnings', 'Dividends are a distribution to owners, recorded in financing cash flow and equity.', true],
      ['Yes: they are an operating expense', 'Dividends are not an expense of running the business.'],
      ['Yes: they are deducted below the tax line', 'Common dividends are never deducted on the income statement (preferred dividends reduce income available to common shareholders, but not net income itself).'],
      ['Only if they are paid in cash', 'Neither cash nor stock dividends are expenses.'],
    ],
    'Dividends never touch the income statement.',
  ),
  mcq(
    { id: 'wt-q-034', subtopic: 'dividends-buybacks', difficulty: 'advanced', pools: ['mock'] },
    'A company can either pay a $100 dividend or buy back $100 of stock. Which statement is correct?',
    [
      ['Both reduce cash and equity by $100 and skip the income statement, but only the buyback reduces the share count', 'The dividend reduces retained earnings; the buyback increases treasury stock. Fewer shares can raise EPS after a buyback.', true],
      ['The dividend reduces net income; the buyback doesn’t', 'Neither one touches the income statement.'],
      ['The buyback increases total equity because the company owns its own shares', 'Treasury stock is contra-equity: it reduces total equity.'],
      ['Both reduce retained earnings by $100', 'Only the dividend reduces retained earnings; the buyback goes through treasury stock.'],
    ],
    'Same cash and total equity effect, different equity accounts and a different share count.',
  ),

  // ── Revenue, accruals, prepaids ──
  walk(
    { id: 'wt-q-019', subtopic: 'revenue-expenses', difficulty: 'intermediate', pools: ['pre', 'post'] },
    'Revenue increases by $100, collected in cash, with no change in costs. Walk me through the three statements.',
    {
      IS: [['is.revenue', 'Revenue', 100], ['is.ebt', 'Pre-tax income', 100], ['is.tax', 'Tax expense', 25], ['is.ni', 'Net income', 75]],
      CFS: [['cfs.ni', 'Net income', 75], ['cfs.cfo', 'Cash from operations', 75], ['cfs.net', 'Net change in cash', 75]],
      BS: [['bs.cash', 'Cash', 75, 'A'], ['bs.re', 'Retained earnings', 75, 'LE']],
    },
    'All cash, nothing non-cash: pre-tax +100, tax +25, NI +75, cash +75, retained earnings +75.',
  ),
  walk(
    { id: 'wt-q-020', subtopic: 'revenue-expenses', difficulty: 'intermediate', pools: ['post'] },
    'The company accrues $20 of employee bonuses that it will pay next year. Walk me through the three statements.',
    {
      IS: [['is.opex', 'Operating expenses', 20], ['is.ebt', 'Pre-tax income', -20], ['is.tax', 'Tax expense', -5], ['is.ni', 'Net income', -15]],
      CFS: [['cfs.ni', 'Net income', -15], ['cfs.accrued', 'Increase in accrued expenses', 20], ['cfs.cfo', 'Cash from operations', 5], ['cfs.net', 'Net change in cash', 5]],
      BS: [['bs.cash', 'Cash', 5, 'A'], ['bs.accrued', 'Accrued expenses', 20, 'LE'], ['bs.re', 'Retained earnings', -15, 'LE']],
    },
    'The expense is recorded now but not paid, so the increase in accrued expenses (a liability) adds back the 20. Cash +5 (tax saving) = accrued +20 and retained earnings −15.',
    { assumptions: ['Assume the bonus is tax-deductible this year.'] },
  ),
  walk(
    { id: 'wt-q-021', subtopic: 'revenue-expenses', difficulty: 'advanced', pools: ['post', 'mock'] },
    'Last year the company prepaid $120 for insurance. This year the coverage is used up and the full $120 is expensed. Walk me through this year’s three statements.',
    {
      IS: [['is.opex', 'Operating expenses', 120], ['is.ebt', 'Pre-tax income', -120], ['is.tax', 'Tax expense', -30], ['is.ni', 'Net income', -90]],
      CFS: [['cfs.ni', 'Net income', -90], ['cfs.prepaid', 'Decrease in prepaid expenses', 120], ['cfs.cfo', 'Cash from operations', 30], ['cfs.net', 'Net change in cash', 30]],
      BS: [['bs.cash', 'Cash', 30, 'A'], ['bs.prepaid', 'Prepaid expenses', -120, 'A'], ['bs.re', 'Retained earnings', -90, 'LE']],
    },
    'The cash went out last year; this year the prepaid asset is used up. The decrease in prepaids is a source of cash in CFO (+120), so cash rises by the 30 of tax savings. Prepaids −120 and cash +30 (assets −90) = retained earnings −90.',
    { assumptions: ['The expense is tax-deductible this year.'] },
  ),
  walk(
    { id: 'wt-q-026', subtopic: 'revenue-expenses', difficulty: 'advanced', pools: ['post', 'mock'] },
    'The company records a $15 provision for bad debts against accounts receivable (allowance method). Walk me through the three statements.',
    {
      IS: [['is.opex', 'Bad debt expense', 15], ['is.ebt', 'Pre-tax income', -15], ['is.tax', 'Tax expense', -3.75], ['is.ni', 'Net income', -11.25]],
      CFS: [['cfs.ni', 'Net income', -11.25], ['cfs.ar', 'Decrease in net accounts receivable', 15], ['cfs.cfo', 'Cash from operations', 3.75], ['cfs.net', 'Net change in cash', 3.75]],
      BS: [['bs.cash', 'Cash', 3.75, 'A'], ['bs.ar', 'Accounts receivable, net', -15, 'A'], ['bs.re', 'Retained earnings', -11.25, 'LE']],
    },
    'A non-cash expense that reduces net receivables. NI −11.25, add back 15 through the AR line, cash +3.75. Net AR −15 and cash +3.75 (assets −11.25) = retained earnings −11.25.',
    { assumptions: ['Assume the provision is tax-deductible this year (in practice bad debts are usually deducted when written off).'] },
  ),
  mcq(
    { id: 'wt-q-043', subtopic: 'revenue-expenses', difficulty: 'advanced', pools: ['mock'] },
    'A customer prepays $120 for a 12-month subscription on January 1. By December 31 the full service has been delivered. What is the net change in deferred revenue over the year?',
    [
      ['Zero', 'Deferred revenue rises by 120 when the cash arrives, then falls by 10 a month as revenue is recognized, ending back where it started.', true],
      ['+$120', 'That is the balance right after the cash arrives, before any revenue is recognized.'],
      ['−$120', 'Deferred revenue can’t fall below where it started from this one contract.'],
      ['+$90', 'That would be the balance after three months of recognition.'],
    ],
    'Over a full delivery cycle, deferred revenue goes up and comes back down; cash and revenue end up equal.',
  ),

  // ── Conceptual and numeric ──
  mcq(
    { id: 'wt-q-027', subtopic: 'depreciation', difficulty: 'basic', pools: ['pre', 'post'] },
    'Depreciation increases by $10 and the tax rate is 25%. What happens to the company’s cash?',
    [
      ['It increases by $2.50', 'Depreciation is non-cash but tax-deductible, so the only cash effect is lower taxes: 10 × 25%.', true],
      ['It decreases by $7.50', '−7.50 is the change in net income, not cash. You still add back the 10 of depreciation.'],
      ['It decreases by $10', 'No cash is spent on depreciation; the cash went out earlier, as capex.'],
      ['No change', 'Cash does change, through the tax saving.'],
    ],
    'Cash effect of a non-cash, deductible expense = expense × tax rate.',
  ),
  num(
    { id: 'wt-q-028', subtopic: 'depreciation', difficulty: 'intermediate', pools: ['pre', 'post', 'mock'] },
    'Depreciation increases by $20 and the tax rate is 40%. By how much does cash change?',
    8,
    ['Net income: −20 × (1 − 40%) = −12', 'Add back depreciation: +20', 'Cash: −12 + 20 = +8'],
    'Older guides use a 40% tax rate. The cash effect is always expense × tax rate: 20 × 40% = 8.',
  ),
  mcq(
    { id: 'wt-q-029', subtopic: 'sbc', difficulty: 'intermediate', pools: ['post', 'mock'] },
    'Stock-based compensation is added back on the cash flow statement. Why do many investors still treat it as a real expense?',
    [
      ['Because it dilutes existing shareholders: it’s compensation paid in stock instead of cash', 'If the company paid employees in cash instead, it would clearly be an expense. Adding SBC back flatters cash flow and EBITDA.', true],
      ['Because SBC is paid in cash at vesting', 'SBC is settled in shares, not cash (unless the company withholds shares for taxes).'],
      ['Because SBC is not tax-deductible', 'Deductibility isn’t why investors care; dilution is.'],
      ['Because it reduces revenue', 'SBC is an operating expense, not a revenue reduction.'],
    ],
    'Non-cash ≠ free. SBC transfers value from shareholders to employees through dilution.',
  ),
  num(
    { id: 'wt-q-035', subtopic: 'inventory', difficulty: 'advanced', pools: ['mock'] },
    'The company writes down $80 of inventory. The tax rate is 25%. By how much does net income change?',
    -60,
    ['Pre-tax income: −80', 'Taxes: −80 × 25% = −20', 'Net income: −80 + 20 = −60'],
    'After-tax effect = 80 × (1 − 25%). Cash would rise by 20.',
  ),
  free(
    { id: 'wt-q-037', subtopic: 'depreciation', difficulty: 'intermediate', pools: ['mock'], followUps: ['wt-q-028', 'wt-q-044'] },
    'Walk me through how a $10 increase in depreciation affects the three statements.',
    [
      ['is', 'Income statement: operating income down $10, net income down $7.50 at a 25% tax rate', [['7.5|7.50'], ['net income', 'down|decrease*|falls|fall']]],
      ['cfs', 'Cash flow statement: start with net income, add back the $10 of depreciation, so cash is up $2.50', [['add', 'back'], ['2.5|2.50']]],
      ['ppe', 'Balance sheet: PP&E down $10', [['pp&e|ppe|property', '10']]],
      ['re', 'Cash up $2.50, retained earnings down $7.50, and the balance sheet balances', [['retained earnings'], ['balanc*']]],
    ],
    'On the income statement, operating income falls by $10, so at a 25% tax rate net income falls by $7.50. On the cash flow statement, net income is down $7.50, but you add back the $10 of depreciation because it’s non-cash, so cash from operations is up $2.50. On the balance sheet, cash is up $2.50 and PP&E is down $10, so assets are down $7.50; on the other side, retained earnings are down $7.50 from the lower net income, so it balances.',
    'Structure it IS → CFS → BS, state the tax rate, and finish by confirming it balances.',
    45,
  ),
  order(
    { id: 'wt-q-039', subtopic: 'depreciation', difficulty: 'basic', pools: ['pre'] },
    'Put the steps of a strong walk-through answer in order.',
    [
      'State the tax rate you are assuming',
      'Income statement: pre-tax impact, then taxes, then net income',
      'Cash flow statement: start from net income, adjust for non-cash items and working capital',
      'Arrive at the net change in cash',
      'Balance sheet: update cash and the affected assets, liabilities and equity',
      'Confirm assets still equal liabilities plus equity',
    ],
    'Interviewers want the same structure every time: tax rate, IS, CFS, BS, then the balance check.',
  ),
  rapid(
    { id: 'wt-q-040', subtopic: 'depreciation', difficulty: 'basic', pools: ['post', 'mock'] },
    'D&A increases by $40 at a 25% tax rate. What is the change in net income?',
    -30,
    '−40 × (1 − 25%) = −30.',
  ),
  rapid(
    { id: 'wt-q-041', subtopic: 'sbc', difficulty: 'intermediate', pools: ['post'] },
    'The company records $60 of tax-deductible SBC at a 25% tax rate. What is the change in cash?',
    15,
    'Non-cash but deductible: cash rises by 60 × 25% = 15.',
  ),
];
