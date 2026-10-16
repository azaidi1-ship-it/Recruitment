import type { CheatSheet } from '../../../types/models';

export const cheatSheet: CheatSheet = {
  sectionId: 'restructuring',
  blocks: [
    {
      kind: 'formula',
      title: 'Waterfall',
      lines: ['DIP → Secured (≤ collateral) → Admin/priority → Unsecured → Sub → Preferred → Common', 'Recovery % = value received / claim', 'Return = recovery / price − 1'],
    },
    {
      kind: 'table',
      headers: ['Term', 'Meaning'],
      rows: [
        ['Automatic stay', 'Halts creditor actions on filing (§362)'],
        ['Class acceptance', '≥ 2/3 amount, > 1/2 number of those voting'],
        ['Cramdown', 'Confirm over a dissenting class (§1129(b))'],
        ['Best interests test', 'Plan ≥ Chapter 7 recovery for dissenters'],
        ['363 sale', 'Sale free and clear during Chapter 11'],
        ['Fulcrum', 'Most senior class not paid in full'],
        ['Prepack', 'Votes solicited before filing'],
      ],
    },
    {
      kind: 'formula',
      title: 'Distress metrics',
      lines: ['Leverage = Debt / EBITDA', 'Coverage = EBITDA / Interest', 'Liquidation value = Σ asset × recovery − costs'],
    },
    {
      kind: 'trap',
      title: 'Common mistakes',
      text: 'Assuming equity recovers something. Forgetting deficiency claims for undersecured lenders. Ignoring pari passu sharing. Calling a DIP “risky”. Forgetting the holdout problem out of court.',
    },
  ],
};
