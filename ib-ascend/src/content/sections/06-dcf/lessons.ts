import type { Lesson } from '../../../types/models';

export const lessons: Lesson[] = [
  {
    id: 'dcf-l1',
    sectionId: 'dcf',
    order: 1,
    title: 'Unlevered free cash flow',
    minutes: 7,
    blocks: [
      {
        kind: 'p',
        text: 'A DCF says a company is worth the present value of the cash it will generate. In the standard (unlevered) DCF, you project the cash flow available to all capital providers, before any interest or debt repayments, and discount it at the weighted average cost of capital.',
      },
      {
        kind: 'formula',
        title: 'Unlevered free cash flow',
        lines: ['UFCF = EBIT × (1 − t) + D&A − Capex − ΔNWC', 'EBIT × (1 − t) is also called NOPAT'],
        note: 'An increase in net working capital uses cash, so it is subtracted.',
      },
      {
        kind: 'example',
        title: 'Building UFCF',
        text: 'EBIT 200, tax 25%, D&A 40, capex 60, NWC up 10. NOPAT = 150; + 40 − 60 − 10 = 120.',
      },
      {
        kind: 'table',
        headers: ['', 'Unlevered DCF', 'Levered DCF'],
        rows: [
          ['Cash flow', 'Before interest and debt repayment', 'After interest and mandatory repayment'],
          ['Discount rate', 'WACC', 'Cost of equity'],
          ['Result', 'Enterprise value', 'Equity value'],
        ],
      },
      {
        kind: 'trap',
        title: 'Don’t subtract interest',
        text: 'Interest is a financing cost; its effect is in the WACC through the after-tax cost of debt. Subtracting it from unlevered cash flow too would count it twice.',
      },
      {
        kind: 'p',
        text: 'Project 5–10 years, long enough for growth and margins to settle into a steady state. Stock-based compensation is a judgment call: adding it back flatters cash flow unless you also capture the dilution, so many bankers treat it as a cash-like cost.',
      },
    ],
    sixtySecond:
      'Unlevered free cash flow is EBIT times one minus the tax rate, plus D&A, minus capex, minus the increase in net working capital. It is the cash available to all capital providers, so it is discounted at WACC to get enterprise value. Don’t subtract interest: the cost of debt is in the WACC. Project 5–10 years until the business reaches a steady state.',
  },
  {
    id: 'dcf-l2',
    sectionId: 'dcf',
    order: 2,
    title: 'WACC, CAPM and beta',
    minutes: 8,
    blocks: [
      {
        kind: 'formula',
        title: 'Weighted average cost of capital',
        lines: ['WACC = E/(D+E) × Ke + D/(D+E) × Kd × (1 − t)'],
        note: 'Market-value weights for the long-run target capital structure.',
      },
      {
        kind: 'formula',
        title: 'Cost of equity (CAPM)',
        lines: ['Ke = Rf + β × ERP'],
        note: 'Rf: long-term government bond yield (e.g. 10-year Treasury). ERP: the extra return investors demand for equities over the risk-free rate.',
      },
      {
        kind: 'formula',
        title: 'Unlevering and relevering beta',
        lines: ['βu = βL / (1 + (1 − t) × D/E)', 'βL = βu × (1 + (1 − t) × D/E)'],
        note: 'Unlever each peer, take the median, relever at the target’s D/E.',
      },
      {
        kind: 'example',
        title: 'Putting it together',
        text: 'Peer βL 1.5 at D/E 0.5, tax 25%: βu = 1.5 / 1.375 = 1.09. Relever at the target’s D/E of 0.8: 1.09 × 1.6 = 1.75. With Rf 4% and ERP 5%: Ke = 4% + 1.75 × 5% = 12.7%.',
      },
      {
        kind: 'p',
        text: 'The cost of debt is the yield the company would pay on new long-term debt (from its traded bonds or credit rating), multiplied by one minus the tax rate because interest is deductible. Equity is riskier than debt, so its cost is higher.',
      },
      {
        kind: 'trap',
        title: '“What happens to WACC as you add debt?”',
        text: 'At first it falls, because after-tax debt is cheaper than equity. Past a point it rises, because more debt makes both equity and debt riskier. That U-shape is why there is an optimal capital structure.',
      },
    ],
    sixtySecond:
      'WACC weights the cost of equity and the after-tax cost of debt by their market values in the target capital structure. The cost of equity comes from CAPM: the risk-free rate plus beta times the equity risk premium. Use peers’ betas, unlevered to strip out their leverage and relevered at the target’s debt-to-equity. The cost of debt is the yield on new debt times one minus the tax rate.',
  },
  {
    id: 'dcf-l3',
    sectionId: 'dcf',
    order: 3,
    title: 'Terminal value',
    minutes: 7,
    blocks: [
      {
        kind: 'formula',
        title: 'Two methods',
        lines: ['Perpetuity growth: TV = FCF(N) × (1 + g) / (WACC − g)', 'Exit multiple: TV = EBITDA(N) × exit multiple'],
        note: 'Both give a value as of the end of year N, discounted back N years.',
      },
      {
        kind: 'example',
        title: 'Cross-checking the methods',
        text: 'FCF 100, g 2%, WACC 8%: TV = 102 / 0.06 = 1,700. With final-year EBITDA of 200, that implies 8.5x. An exit-multiple TV of 2,000 with final FCF 120 and WACC 9% implies g = (180 − 120) / 2,120 = 2.8%.',
      },
      {
        kind: 'list',
        items: [
          'Long-term growth should be at or below long-run nominal GDP growth, typically 2–3%.',
          'The exit multiple should reflect a mature business, not today’s peak trading multiple.',
          'Terminal value is often 60–80%+ of total value, which is why it gets the most scrutiny.',
        ],
      },
      {
        kind: 'trap',
        title: 'Growth close to WACC',
        text: 'As g approaches WACC, the Gordon formula explodes. A 3% growth rate with a 4% WACC means TV = 103× next year’s cash flow. If your implied multiple looks absurd, your growth rate is too high.',
      },
    ],
    sixtySecond:
      'Terminal value captures everything beyond the projection period. The perpetuity growth method grows final-year FCF at a rate at or below GDP growth and divides by WACC minus g; the exit multiple method applies a mature EBITDA multiple. Both are values at the end of the final year. Cross-check them: compute the implied multiple of a growth-based TV and the implied growth of a multiple-based TV.',
  },
  {
    id: 'dcf-l4',
    sectionId: 'dcf',
    order: 4,
    title: 'Discounting, the mid-year convention and judgment',
    minutes: 7,
    blocks: [
      {
        kind: 'formula',
        title: 'Discounting',
        lines: ['PV = CF(t) / (1 + WACC)^t', 'Mid-year: PV = CF(t) / (1 + WACC)^(t − 0.5)'],
        note: 'Mid-year assumes cash arrives evenly through the year. It raises the valuation.',
      },
      {
        kind: 'table',
        caption: 'FCF 100 / 110 / 120, WACC 10%, g 3%, net debt 300, 50 shares',
        headers: ['', 'End-of-year', 'Mid-year'],
        rows: [
          ['PV of FCF', '272.0', '285.3'],
          ['PV of TV (TV 1,765.7)', '1,326.6', '1,391.4'],
          ['Enterprise value', '1,598.6', '1,676.6'],
          ['Share price', '$25.97', '$27.53'],
        ],
      },
      {
        kind: 'p',
        text: 'With the mid-year convention, an exit-multiple terminal value is still a year-end value (discount N years). A perpetuity-growth TV built on mid-year cash flows is often discounted N − 0.5 years, as in the table.',
      },
      {
        kind: 'list',
        items: [
          'Sensitize WACC against terminal growth (or exit multiple).',
          'Curveball: NOLs reduce cash taxes; value them as the PV of tax savings.',
          'Why a DCF might be wrong: terminal value dominance, optimistic projections, cyclicality, and estimated inputs like beta and ERP.',
        ],
      },
    ],
    sixtySecond:
      'Discount each cash flow by (1 + WACC)^t, or t − 0.5 under the mid-year convention, which assumes cash arrives through the year and raises value. Sum the PVs and the PV of the terminal value to get enterprise value, then bridge to equity value per share. Sensitize WACC and terminal assumptions, and cross-check with comps.',
  },
];
