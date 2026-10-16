import type { Lesson } from '../../../types/models';

export const lessons: Lesson[] = [
  {
    id: 'wt-l1',
    sectionId: 'walkthroughs',
    order: 1,
    title: 'The walk-through method',
    minutes: 6,
    blocks: [
      {
        kind: 'p',
        text: '“Walk me through what happens on the three statements when…” is the single most common accounting question in banking interviews. The interviewer is testing whether you understand how the statements connect, and whether you can explain it calmly in a fixed order. The order never changes.',
      },
      {
        kind: 'list',
        ordered: true,
        items: [
          'State your tax rate (“assuming a 25% tax rate…”).',
          'Income statement: what changes above the tax line, the tax effect, and the change in net income.',
          'Cash flow statement: start with the change in net income, reverse anything non-cash, adjust for working capital, then add investing and financing items. Arrive at the net change in cash.',
          'Balance sheet: change cash, then every other asset, liability and equity line that moved.',
          'Check that assets still equal liabilities plus equity, and say so.',
        ],
      },
      {
        kind: 'formula',
        title: 'Three shortcuts that catch most mistakes',
        lines: [
          'Cash effect of a non-cash, deductible expense = expense × tax rate',
          'Change in retained earnings = change in net income − dividends',
          'CFS net change in cash = change in BS cash',
        ],
      },
      {
        kind: 'table',
        caption: 'Depreciation +$10, 25% tax rate',
        headers: ['Statement', 'Line', 'Change'],
        rows: [
          ['IS', 'Depreciation', '+10.0'],
          ['IS', 'Pre-tax income', '(10.0)'],
          ['IS', 'Taxes', '(2.5)'],
          ['IS', 'Net income', '(7.5)'],
          ['CFS', 'Net income', '(7.5)'],
          ['CFS', 'Add back depreciation', '+10.0'],
          ['CFS', 'Net change in cash', '+2.5'],
          ['BS', 'Cash', '+2.5'],
          ['BS', 'PP&E', '(10.0)'],
          ['BS', 'Retained earnings', '(7.5)'],
        ],
      },
      {
        kind: 'trap',
        title: 'Don’t say “cash goes down”',
        text: 'The most common wrong answer to the depreciation question is “cash falls by $7.50”. Depreciation is non-cash; the cash left when the asset was bought. The only cash effect today is the tax saving, so cash goes up.',
      },
      {
        kind: 'p',
        text: 'If the interviewer doesn’t give a tax rate, pick 25% and say so (older guides use 40%; either is fine as long as you state it). If something is ambiguous, such as whether an expense is tax-deductible, state the assumption and keep going. That is exactly what a strong analyst does.',
      },
    ],
    sixtySecond:
      'Always answer in the same order: tax rate, income statement, cash flow statement, balance sheet, balance check. Net income changes by the pre-tax change times one minus the tax rate. On the cash flow statement, reverse anything non-cash and adjust for working capital, investing and financing. On the balance sheet, cash moves by the net change in cash, the affected asset or liability moves by its own amount, and retained earnings move by net income less dividends. Then confirm it balances.',
  },
  {
    id: 'wt-l2',
    sectionId: 'walkthroughs',
    order: 2,
    title: 'Non-cash charges: D&A, write-downs, impairments and SBC',
    minutes: 7,
    blocks: [
      {
        kind: 'p',
        text: 'Most walk-through questions are about a non-cash charge. They all follow the same pattern: the expense lowers pre-tax income; taxes fall by the expense times the tax rate; on the cash flow statement you add the full expense back; so cash rises by the tax saving. What differs is which balance sheet line absorbs the charge.',
      },
      {
        kind: 'table',
        caption: 'Which balance sheet line absorbs each non-cash charge',
        headers: ['Charge', 'Balance sheet line that falls', 'Notes'],
        rows: [
          ['Depreciation', 'PP&E', 'Recurring; part of EBITDA add-back'],
          ['Amortization of intangibles', 'Intangible assets', 'Often not tax-deductible for acquired intangibles'],
          ['Inventory write-down', 'Inventory', 'Usually recorded in COGS'],
          ['Goodwill impairment', 'Goodwill', 'Usually not tax-deductible'],
          ['Stock-based compensation', 'None: common stock & APIC rises instead', 'Equity +SBC, retained earnings −after-tax SBC'],
        ],
      },
      {
        kind: 'formula',
        title: 'SBC on the balance sheet',
        lines: ['Common stock & APIC +SBC', 'Retained earnings −SBC × (1 − t)', 'Cash +SBC × t'],
        note: 'Equity rises on net by the tax saving, matching the increase in cash.',
      },
      {
        kind: 'trap',
        title: 'The impairment tax assumption',
        text: 'The textbook answer for a $100 goodwill impairment is “net income −75, cash +25”. That assumes a tax deduction. In reality goodwill impairments are usually not deductible, so net income falls by the full 100 and cash doesn’t change. Give the textbook answer, then add the caveat; elite boutique interviewers notice.',
      },
      {
        kind: 'p',
        text: 'Stock-based compensation is the exception that interviewers probe: it is added back on the cash flow statement because no cash leaves, but it is still a real cost. Employees are paid in shares, which dilutes existing owners. That is why many investors subtract SBC when they look at “real” EBITDA or free cash flow.',
      },
    ],
    sixtySecond:
      'Every non-cash charge works the same way: pre-tax income falls by the charge, net income by the charge times one minus the tax rate, you add the full charge back on the cash flow statement, and cash rises by the tax saving. The balance sheet line that falls is PP&E for depreciation, inventory for write-downs and goodwill for impairments. SBC is different: instead of an asset falling, common stock and APIC rise. And goodwill impairments are usually not tax-deductible, so say your assumption.',
  },
  {
    id: 'wt-l3',
    sectionId: 'walkthroughs',
    order: 3,
    title: 'Investing and financing events',
    minutes: 7,
    blocks: [
      {
        kind: 'p',
        text: 'Buying PP&E, raising or repaying debt, paying dividends and buying back stock don’t touch the income statement when they happen. They move cash on the investing or financing sections of the cash flow statement and change one line on each side of the balance sheet.',
      },
      {
        kind: 'table',
        headers: ['Event', 'Income statement', 'Cash flow statement', 'Balance sheet'],
        rows: [
          ['Buy PP&E with cash', 'Nothing (until depreciated)', 'Capex in CFI', 'Cash ↓, PP&E ↑'],
          ['Raise debt', 'Nothing (until interest)', 'Debt issued in CFF', 'Cash ↑, debt ↑'],
          ['Repay debt principal', 'Nothing', 'Debt repaid in CFF', 'Cash ↓, debt ↓'],
          ['Pay interest', 'Interest expense, after tax', 'In CFO (US GAAP)', 'Cash ↓, retained earnings ↓'],
          ['Pay dividends', 'Nothing', 'Dividends in CFF', 'Cash ↓, retained earnings ↓'],
          ['Buy back stock', 'Nothing', 'Repurchases in CFF', 'Cash ↓, treasury stock ↓ (equity)'],
          ['Issue stock', 'Nothing', 'Stock issued in CFF', 'Cash ↑, common stock & APIC ↑'],
        ],
      },
      { kind: 'h', text: 'Asset sales: gains and losses' },
      {
        kind: 'p',
        text: 'When a company sells an asset for more than its book value, the gain is in net income, but the cash came from investing. So on the cash flow statement you subtract the gain in CFO and show the full proceeds in CFI. A loss works the other way: add it back in CFO.',
      },
      {
        kind: 'example',
        title: 'Equipment with a $60 book value sold for $100',
        text: 'IS: gain +40, tax +10, net income +30. CFS: net income +30, less gain −40, so CFO −10 (the tax on the gain); proceeds +100 in CFI; net change in cash +90. BS: cash +90, PP&E −60, so assets +30 = retained earnings +30.',
      },
      {
        kind: 'trap',
        title: 'Principal is not an expense',
        text: 'Repaying debt principal never hits the income statement. Only interest does. If you say “net income falls when the company repays debt”, the interview is over.',
      },
    ],
    sixtySecond:
      'Capex, debt raises and repayments, dividends, buybacks and stock issuance skip the income statement: they go through investing or financing cash flow and change one item on each side of the balance sheet. Interest is the exception: it’s an after-tax expense that flows through net income. For asset sales, remove the gain from CFO (or add back a loss) and show the full proceeds in CFI.',
  },
  {
    id: 'wt-l4',
    sectionId: 'walkthroughs',
    order: 4,
    title: 'Deferred taxes and NOLs',
    minutes: 7,
    blocks: [
      {
        kind: 'p',
        text: 'Companies keep two sets of books: book (GAAP) for investors and tax for the government. When the two disagree on timing, the gap shows up as a deferred tax asset or liability. Interviewers at the elite boutiques like these questions because they separate memorizers from people who understand.',
      },
      {
        kind: 'formula',
        title: 'Deferred taxes in one line',
        lines: ['Book tax expense = current (cash) tax + deferred tax', 'Deferred tax expense > 0 → DTL ↑ (pay later)', 'Deferred tax expense < 0 → DTA ↑ (save later)'],
      },
      {
        kind: 'list',
        items: [
          'Deferred tax liability (DTL): book taxes exceed cash taxes today, so more will be paid later. Classic cause: accelerated depreciation for tax, straight-line for the books.',
          'Deferred tax asset (DTA): cash taxes will be lower in the future. Classic cause: net operating losses (NOLs); also expenses booked before they are deductible.',
          'Valuation allowance: if the company probably can’t use a DTA (e.g. it may never be profitable), it reduces the DTA with an allowance.',
        ],
      },
      {
        kind: 'example',
        title: 'Using NOLs that were recorded as a DTA',
        text: 'Pre-tax income 100, NOLs 40, tax rate 25%, DTA of 10 already recorded. Book tax expense: 25 (normal rate), so net income 75. Cash taxes: (100 − 40) × 25% = 15. The 10 difference is the DTA being used: add it back on the cash flow statement. Cash +85; DTA −10; retained earnings +75.',
      },
      {
        kind: 'trap',
        title: 'Two different answers for NOLs',
        text: 'If the company had a full valuation allowance (no DTA recorded), using NOLs lowers tax expense itself, so net income is higher. If a DTA was recorded, net income is unchanged and only cash benefits. Ask which one, or state your assumption.',
      },
    ],
    sixtySecond:
      'Book tax expense equals cash tax plus deferred tax. When cash taxes are lower than book today, as with accelerated tax depreciation, the company records a deferred tax liability and the deferred tax is added back on the cash flow statement. NOLs create a deferred tax asset; using them lowers cash taxes. If the DTA was already recorded, net income is unchanged and the DTA unwinds; if not, tax expense falls and net income rises.',
  },
];
