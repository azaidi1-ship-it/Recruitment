import type { Lesson } from '../../../types/models';

export const lessons: Lesson[] = [
  {
    id: 'rx-l1',
    sectionId: 'restructuring',
    order: 1,
    title: 'How companies get into distress',
    minutes: 6,
    blocks: [
      {
        kind: 'p',
        text: 'Restructuring bankers fix capital structures that no longer work. Distress usually starts as a liquidity problem (not enough cash for the next few months) and becomes a solvency problem (the business is worth less than its debt). The fix depends on which one you’re facing.',
      },
      {
        kind: 'list',
        items: [
          'Warning signs: EBITDA falling, leverage rising, interest coverage near 1x, a maturity wall that can’t be refinanced, covenant breaches, bonds trading far below par.',
          'Liquidity tools: a 13-week cash flow forecast, revolver draws, asset sales, cost cuts, stretching payables.',
          'Solvency tools: reducing debt through exchanges, debt-for-equity swaps or a court process.',
        ],
      },
      {
        kind: 'formula',
        title: 'Distress math',
        lines: ['Leverage = Debt / EBITDA (800 / 200 = 4.0x → 800 / 100 = 8.0x)', 'Interest coverage = EBITDA / Interest (100 / 90 = 1.1x)'],
      },
      {
        kind: 'table',
        headers: ['Out of court', 'In court'],
        rows: [
          ['Amend & extend, covenant waivers', 'Chapter 11 reorganization'],
          ['Distressed exchanges, debt-for-equity swaps', 'Prepackaged or pre-negotiated plans'],
          ['Liability management (uptiers, drop-downs)', 'Section 363 asset sales'],
          ['Rescue financing, asset sales', 'Chapter 7 liquidation'],
        ],
      },
      {
        kind: 'trap',
        title: 'The holdout problem',
        text: 'Changing a US bond’s payment terms generally needs each holder’s consent (Trust Indenture Act §316(b)). A holdout can refuse an exchange and still expect par. Chapter 11 fixes this: a class that votes yes binds its dissenters.',
      },
    ],
    sixtySecond:
      'Distress usually starts as a liquidity problem and becomes a solvency problem. Watch leverage, interest coverage, maturities and where the bonds trade. Out of court, companies amend and extend, do distressed exchanges or liability management, raise rescue money or sell assets; the obstacle is holdouts. In court, Chapter 11 reorganizes with class voting that binds dissenters; Chapter 7 liquidates.',
  },
  {
    id: 'rx-l2',
    sectionId: 'restructuring',
    order: 2,
    title: 'Priority of claims and the waterfall',
    minutes: 7,
    blocks: [
      {
        kind: 'list',
        ordered: true,
        items: [
          'DIP financing (super-priority administrative)',
          'Secured claims, up to the value of their collateral',
          'Administrative and priority claims (professional fees, certain taxes and wages)',
          'Senior unsecured and general unsecured claims (bonds, trade)',
          'Subordinated debt',
          'Preferred equity',
          'Common equity',
        ],
      },
      {
        kind: 'table',
        caption: 'Waterfall: distributable value 600',
        headers: ['Claim', 'Amount', 'Recovery', '%'],
        rows: [
          ['DIP', '50', '50', '100%'],
          ['Administrative', '20', '20', '100%'],
          ['Secured term loan', '300', '300', '100%'],
          ['Senior notes + trade (pari passu)', '250', '230', '92%'],
          ['Subordinated notes', '100', '0', '0%'],
          ['Equity', '', '0', '0%'],
        ],
      },
      {
        kind: 'p',
        text: 'The senior notes and trade are the fulcrum: the most senior class not paid in full. In a reorganization they typically receive most of the new equity.',
      },
      {
        kind: 'trap',
        title: 'Undersecured lenders',
        text: 'A lender owed 300 with collateral worth 200 has a 200 secured claim and a 100 unsecured deficiency claim that shares with other unsecured creditors.',
      },
    ],
    sixtySecond:
      'Value flows top-down: DIP, secured (up to collateral value), administrative and priority claims, unsecured, subordinated, preferred, then common equity, the absolute priority rule. Pari passu claims share pro rata. The fulcrum security is the most senior class not paid in full; it usually ends up owning the reorganized company.',
  },
  {
    id: 'rx-l3',
    sectionId: 'restructuring',
    order: 3,
    title: 'Chapter 11, Chapter 7 and 363 sales',
    minutes: 8,
    blocks: [
      {
        kind: 'table',
        headers: ['', 'Chapter 11', 'Chapter 7'],
        rows: [
          ['Goal', 'Reorganize as a going concern', 'Liquidate'],
          ['Who runs it', 'Management (debtor in possession)', 'A trustee'],
          ['Outcome', 'Plan of reorganization; emerge with new capital structure', 'Assets sold; proceeds distributed by priority'],
        ],
      },
      {
        kind: 'list',
        ordered: true,
        items: [
          'Filing: the automatic stay (§362) halts collection actions.',
          'DIP financing funds operations; first-day motions keep employees and key suppliers paid.',
          'Plan negotiation: claims are grouped into classes.',
          'Voting: a class accepts with ≥ two-thirds by amount and > half by number of those voting.',
          'Confirmation: the plan must pass the best interests test (≥ Chapter 7 recovery for dissenters); a cramdown (§1129(b)) can bind a dissenting class if the plan is fair and equitable.',
          'Emergence: new debt, new equity (often to the fulcrum class), exit financing repays the DIP.',
        ],
      },
      {
        kind: 'p',
        text: 'Speed varies by preparation: prepackaged cases (votes solicited before filing) can exit in weeks; pre-negotiated cases agree terms first; free-fall cases start with no deal. A Section 363 sale lets the company sell assets free and clear of liens during the case, often with a stalking-horse bidder setting the floor; secured lenders can credit bid their claims.',
      },
      {
        kind: 'trap',
        title: 'Old equity',
        text: 'If creditors are impaired, old equity usually gets nothing. Don’t say “shareholders are paid after the bondholders” as if they’ll get something: in most cases there’s nothing left.',
      },
    ],
    sixtySecond:
      'Chapter 11 reorganizes a company as a going concern: the automatic stay stops creditors, DIP financing funds operations, and a plan is voted on by class, two-thirds by amount and a majority by number. The court confirms it if it beats liquidation for dissenters, or crams it down if it’s fair and equitable. Chapter 7 liquidates. Section 363 sales sell assets free and clear during Chapter 11.',
  },
  {
    id: 'rx-l4',
    sectionId: 'restructuring',
    order: 4,
    title: 'DIP financing and distressed valuation',
    minutes: 7,
    blocks: [
      {
        kind: 'list',
        items: [
          'DIP loans get super-priority administrative status and strong liens, sometimes priming existing liens with court approval, which is why lenders will fund a bankrupt company.',
          'Existing lenders often provide a “defensive DIP” to avoid being primed and to control the process through milestones; some include a roll-up of pre-petition debt.',
          'Exit financing repays the DIP when the company emerges.',
        ],
      },
      {
        kind: 'formula',
        title: 'Recovery math',
        lines: [
          'Recovery % = Value received / Claim',
          'Distressed return = Expected recovery / Purchase price − 1',
          'Liquidation value = Σ asset × recovery rate − wind-down costs',
        ],
      },
      {
        kind: 'table',
        caption: 'Plan value decides who owns the company (secured 300, unsecured 400, subordinated 100)',
        headers: ['Plan value', 'Secured', 'Unsecured', 'Subordinated', 'Equity'],
        rows: [
          ['500', '100%', '50%', '0%', '0'],
          ['750', '100%', '100%', '50%', '0'],
          ['850', '100%', '100%', '100%', '50'],
        ],
      },
      {
        kind: 'trap',
        title: 'Valuation fights',
        text: 'Seniors receiving equity want a low plan value (they get more of the company); juniors want a high one (value reaches them). Expect the debtor’s valuation to be attacked from both sides.',
      },
    ],
    sixtySecond:
      'DIP loans are safe because of super-priority status and strong liens; existing lenders often provide them defensively. Value reorganized companies with the standard methods on the new business plan, with a liquidation analysis as the floor. Recoveries come from running the waterfall at the plan value, and the plan value is fought over because it decides which class owns the company.',
  },
];
