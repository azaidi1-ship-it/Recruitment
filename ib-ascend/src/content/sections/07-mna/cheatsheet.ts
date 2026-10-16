import type { CheatSheet } from '../../../types/models';

export const cheatSheet: CheatSheet = {
  sectionId: 'mna',
  blocks: [
    {
      kind: 'formula',
      title: 'Accretion / dilution',
      lines: [
        'PF NI = NI_A + NI_T − i_cash(1 − t)·Cash − r(1 − t)·Debt + Syn(1 − t)',
        'PF shares = Shares_A + Stock issued / P_A',
        'Accretive if target yield > weighted after-tax funding cost',
      ],
    },
    {
      kind: 'formula',
      title: 'PPA and stock deals',
      lines: [
        'Goodwill = Price − (BV − old GW + write-ups − DTL)',
        'DTL = write-ups × t (stock deal)',
        'Exchange ratio = Offer / P_acquirer',
        'Max premium ≈ PV synergies / market value',
      ],
    },
    {
      kind: 'table',
      headers: ['Funding', 'EPS cost'],
      rows: [
        ['Cash', 'Interest earned × (1 − t)'],
        ['Debt', 'Rate × (1 − t)'],
        ['Stock', '1 / acquirer P/E'],
      ],
    },
    {
      kind: 'trap',
      title: 'Common mistakes',
      text: 'Forgetting foregone interest on cash. Pre-tax interest in pro forma NI. Ignoring the DTL on write-ups in a stock deal. Calling accretion “value creation”. Counting revenue synergies at full value. Mixing up breakup and reverse termination fees.',
    },
  ],
};
