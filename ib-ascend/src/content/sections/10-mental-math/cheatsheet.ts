import type { CheatSheet } from '../../../types/models';

export const cheatSheet: CheatSheet = {
  sectionId: 'mental-math',
  blocks: [
    {
      kind: 'table',
      headers: ['Fraction', '%', 'Fraction', '%'],
      rows: [
        ['1/3', '33.3', '1/9', '11.1'],
        ['1/6', '16.7', '1/11', '9.1'],
        ['1/7', '14.3', '1/12', '8.3'],
        ['1/8', '12.5', '1/16', '6.25'],
      ],
    },
    {
      kind: 'table',
      headers: ['MOIC', '3 yrs', '5 yrs'],
      rows: [
        ['1.5x', '14.5%', '8.4%'],
        ['2.0x', '26%', '15%'],
        ['2.5x', '36%', '20%'],
        ['3.0x', '44%', '25%'],
        ['4.0x', '59%', '32%'],
      ],
    },
    {
      kind: 'formula',
      title: 'Shortcuts',
      lines: ['×25 = ×100 ÷ 4;  ×125 = ×1,000 ÷ 8', '(a − b)(a + b) = a² − b²', 'Rule of 72: years ≈ 72 / rate', '1 / 8% = 12.5;  perpetuity = CF / r'],
    },
    {
      kind: 'trap',
      title: 'Common mistakes',
      text: 'Adding percentage changes. Forgetting the hour hand moves. Going silent. Not stating assumptions in market sizing. Splitting balance problems in halves instead of thirds.',
    },
  ],
};
