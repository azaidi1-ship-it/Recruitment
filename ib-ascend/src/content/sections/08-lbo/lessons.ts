import type { Lesson } from '../../../types/models';

export const lessons: Lesson[] = [
  {
    id: 'lbo-l1',
    sectionId: 'lbo',
    order: 1,
    title: 'How an LBO works',
    minutes: 6,
    blocks: [
      {
        kind: 'p',
        text: 'In a leveraged buyout, a private equity sponsor buys a company using mostly debt and a smaller equity check. The company’s own cash flows pay the interest and repay the debt. After 3–7 years the sponsor sells. Because the equity check is small relative to the company’s value, any increase in value is magnified on the equity.',
      },
      {
        kind: 'table',
        caption: 'Sources & uses (EBITDA 125, bought at 8.0x)',
        headers: ['Uses', '$', 'Sources', '$'],
        rows: [
          ['Purchase enterprise value', '1,000', 'Senior debt (5.0x)', '625'],
          ['Fees', '30', 'Sponsor equity', '405'],
          ['Total', '1,030', 'Total', '1,030'],
        ],
      },
      {
        kind: 'list',
        items: [
          'Uses: purchase of equity, refinancing existing debt, transaction and financing fees.',
          'Sources: new debt tranches, rollover equity from management or sellers, and the sponsor’s equity, which plugs the gap.',
        ],
      },
      {
        kind: 'trap',
        title: '“Why use leverage?”',
        text: 'Two reasons: it shrinks the equity check, so gains are spread over less equity, and interest is tax-deductible. It also raises the risk of losing everything if the business underperforms.',
      },
    ],
    sixtySecond:
      'In an LBO, a sponsor buys a company mostly with debt, uses the company’s cash flows to pay interest and repay that debt, and sells after 3–7 years. Sources and uses must balance: uses are the purchase price, any refinancing and fees; sources are the debt, any rollover equity and the sponsor’s equity, which is the plug. Leverage magnifies returns in both directions.',
  },
  {
    id: 'lbo-l2',
    sectionId: 'lbo',
    order: 2,
    title: 'The debt stack',
    minutes: 7,
    blocks: [
      {
        kind: 'table',
        headers: ['Tranche', 'Rate', 'Repayment', 'Covenants', 'Typical holders'],
        rows: [
          ['Revolver', 'Floating', 'Drawn as needed', 'Maintenance (springing)', 'Banks'],
          ['Term Loan A', 'Floating', 'Amortizing', 'Maintenance', 'Banks'],
          ['Term Loan B', 'Floating', '~1%/yr + bullet', 'Often cov-lite', 'Institutional (CLOs)'],
          ['Senior notes', 'Fixed', 'Bullet', 'Incurrence', 'Bond investors'],
          ['Subordinated / mezzanine', 'Fixed, may be PIK', 'Bullet', 'Incurrence', 'Mezz funds'],
        ],
      },
      {
        kind: 'formula',
        title: 'Credit metrics',
        lines: ['Leverage = Total debt / EBITDA', 'Interest coverage = EBITDA / Interest expense'],
        note: 'Debt capacity is the lowest amount allowed by every constraint.',
      },
      {
        kind: 'example',
        title: 'Debt capacity',
        text: 'EBITDA 100. Max leverage 6.0x → 600. Min coverage 2.0x at 9% → interest ≤ 50 → debt ≤ 555.6. The coverage test binds: max debt ≈ 556.',
      },
      {
        kind: 'trap',
        title: 'Maintenance vs incurrence',
        text: 'Maintenance covenants are tested every quarter regardless of what the company does. Incurrence covenants are tested only when the company acts, for example raising more debt or paying a dividend.',
      },
    ],
    sixtySecond:
      'LBO debt runs from senior secured bank debt (revolver, term loans) through senior and subordinated notes to mezzanine and PIK, with rates rising as seniority falls. Term Loan Bs are floating, lightly amortizing and often covenant-lite; bonds are fixed-rate bullets with incurrence covenants. Debt capacity is set by leverage and coverage limits: take the tightest.',
  },
  {
    id: 'lbo-l3',
    sectionId: 'lbo',
    order: 3,
    title: 'Returns: MOIC, IRR and what drives them',
    minutes: 7,
    blocks: [
      {
        kind: 'formula',
        title: 'Returns',
        lines: ['MOIC = Total cash returned / Equity invested', 'IRR (single exit) = MOIC^(1/years) − 1'],
      },
      {
        kind: 'table',
        caption: 'Rules of thumb',
        headers: ['MOIC', '3 years', '5 years'],
        rows: [
          ['2.0x', '26%', '15%'],
          ['2.5x', '36%', '20%'],
          ['3.0x', '44%', '25%'],
        ],
      },
      {
        kind: 'formula',
        title: 'Returns attribution',
        lines: [
          'EBITDA growth = ΔEBITDA × entry multiple',
          'Multiple expansion = Δmultiple × exit EBITDA',
          'Debt paydown = entry net debt − exit net debt',
        ],
        note: 'The three pieces add up to the change in equity value.',
      },
      {
        kind: 'trap',
        title: 'IRR vs MOIC',
        text: 'A dividend recap usually raises IRR (cash comes back earlier) while MOIC stays flat or dips because of the extra interest. A quick flip can show a high IRR on a small MOIC. Sponsors and LPs look at both.',
      },
    ],
    sixtySecond:
      'MOIC is cash returned over cash invested; IRR is the annualized return and rewards speed. Memorize: 2x in 5 years ≈ 15%, 3x in 5 years ≈ 25%, 2x in 3 years ≈ 26%. Returns come from EBITDA growth, multiple expansion and debt paydown. Good candidates have stable cash flow, low capex, a strong position and room to improve.',
  },
  {
    id: 'lbo-l4',
    sectionId: 'lbo',
    order: 4,
    title: 'The paper LBO',
    minutes: 8,
    blocks: [
      {
        kind: 'p',
        text: 'Some elite boutiques and most PE interviews give a “paper LBO”: a simple LBO solved with pen and paper in 5–10 minutes. Stay organized and round aggressively.',
      },
      {
        kind: 'list',
        ordered: true,
        items: [
          'Entry: purchase EV = multiple × EBITDA; split into debt and equity.',
          'Project EBITDA; net income = (EBITDA − D&A − interest) × (1 − t).',
          'Free cash flow ≈ net income + D&A − capex (− ΔNWC); all of it repays debt.',
          'Exit: exit EV = exit multiple × final EBITDA; exit equity = exit EV − remaining debt (+ cash).',
          'Returns: MOIC, then IRR from the rules of thumb.',
        ],
      },
      {
        kind: 'table',
        caption: 'Paper LBO: buy at 8.0x EBITDA of 100, 500 debt at 8%, D&A = capex = 10, tax 25%',
        headers: ['Year', 'EBITDA', 'Net income (= FCF)'],
        rows: [
          ['1', '105', '41.25'],
          ['2', '110', '45.00'],
          ['3', '120', '52.50'],
          ['4', '130', '60.00'],
          ['5', '140', '67.50'],
          ['Total', '', '266.25'],
        ],
      },
      {
        kind: 'example',
        title: 'Finishing it',
        text: 'Debt at exit: 500 − 266.25 = 233.75. Exit EV: 8.0 × 140 = 1,120. Exit equity: 1,120 − 233.75 = 886.25. MOIC: 886.25 / 300 = 2.95x ≈ 3x → IRR ≈ 24% (just under 25%).',
      },
      {
        kind: 'trap',
        title: 'Simplifying interest',
        text: 'Paper LBOs usually compute interest on the starting debt balance to avoid circularity. Say so; the interviewer cares about the logic, not the decimal.',
      },
    ],
    sixtySecond:
      'In a paper LBO: set the entry EV and the debt/equity split; project EBITDA and net income; treat net income plus D&A minus capex as free cash flow that repays debt; compute exit equity as exit EV minus remaining debt; then get MOIC and estimate IRR with the rules of thumb. Round aggressively and state your simplifications.',
  },
];
