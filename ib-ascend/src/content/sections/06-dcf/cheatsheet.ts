import type { CheatSheet } from '../../../types/models';

export const cheatSheet: CheatSheet = {
  sectionId: 'dcf',
  blocks: [
    {
      kind: 'formula',
      title: 'Cash flow and discount rate',
      lines: ['UFCF = EBIT(1 − t) + D&A − Capex − ΔNWC', 'WACC = E/V·Ke + D/V·Kd(1 − t)', 'Ke = Rf + β·ERP', 'βu = βL / (1 + (1 − t)·D/E)'],
    },
    {
      kind: 'formula',
      title: 'Terminal value and discounting',
      lines: ['TV (Gordon) = FCF·(1 + g) / (WACC − g)', 'TV (multiple) = EBITDA(N) × multiple', 'Implied g = (TV·WACC − FCF) / (TV + FCF)', 'PV = CF / (1 + WACC)^t; mid-year t − 0.5'],
    },
    {
      kind: 'table',
      headers: ['Input', 'Typical'],
      rows: [
        ['Projection', '5–10 years'],
        ['Terminal growth', '2–3% (≤ GDP)'],
        ['TV share of value', '60–80%+'],
        ['Sensitivity table', 'WACC × g (or multiple)'],
      ],
    },
    {
      kind: 'trap',
      title: 'Common mistakes',
      text: 'Subtracting interest from UFCF. Using pre-tax cost of debt. Book-value weights. Growth near WACC. Discounting TV N+1 years. Pairing levered FCF with WACC. Forgetting to bridge EV to equity value.',
    },
  ],
};
