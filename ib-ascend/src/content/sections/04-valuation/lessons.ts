import type { Lesson } from '../../../types/models';

export const lessons: Lesson[] = [
  {
    id: 'val-l1',
    sectionId: 'valuation',
    order: 1,
    title: 'The four core methodologies',
    minutes: 7,
    blocks: [
      {
        kind: 'p',
        text: 'Bankers value companies two ways. Relative valuation asks what similar companies are worth: trading comparables (how peers trade today) and precedent transactions (what buyers paid in past deals). Intrinsic valuation asks what the company’s own cash flows are worth: the DCF. When a private equity buyer is plausible, an LBO analysis asks what a sponsor could pay.',
      },
      {
        kind: 'table',
        headers: ['Method', 'Question it answers', 'Strength', 'Weakness'],
        rows: [
          ['Trading comps', 'What do similar public companies trade at?', 'Current, market-based', 'No perfect peers; markets swing'],
          ['Precedent transactions', 'What have buyers paid for similar companies?', 'Reflects control premiums', 'Dated, deal-specific, limited data'],
          ['DCF', 'What are the company’s cash flows worth?', 'Intrinsic; captures specifics', 'Very sensitive to WACC and terminal value'],
          ['LBO', 'What could a sponsor pay and hit its IRR?', 'Sets a practical floor', 'Ignores strategic synergies'],
        ],
      },
      {
        kind: 'p',
        text: 'Each method produces a range, not a number. Bankers run several, compare them side by side and look for where they overlap. No single method is “right”: they are lenses on the same business.',
      },
      {
        kind: 'trap',
        title: '“Which method gives the highest value?”',
        text: 'There’s no fixed rule, but for a healthy company being sold, precedents usually come out highest (control premium, synergies) and the LBO lowest (no synergies, IRR constraint). A DCF can land anywhere: it depends entirely on assumptions. Say “it depends” and then explain the usual pattern.',
      },
    ],
    sixtySecond:
      'There are three core methodologies plus the LBO. Trading comps and precedent transactions are relative: they value a company based on what similar companies trade or sell for. The DCF is intrinsic: it values the company’s own projected free cash flows. The LBO shows what a financial sponsor could pay and still hit its target return. Each gives a range, and bankers compare them on a football field.',
  },
  {
    id: 'val-l2',
    sectionId: 'valuation',
    order: 2,
    title: 'Reading and building a football field',
    minutes: 6,
    blocks: [
      {
        kind: 'p',
        text: 'A football field is a horizontal bar chart. Each bar is the implied share price range from one methodology or reference point. The current share price and any offer price are drawn as vertical lines. It’s the summary page of almost every fairness opinion and pitch book.',
      },
      {
        kind: 'formula',
        title: 'From a multiple range to a share price range',
        lines: ['EV range = Multiple range × Target metric', 'Equity value = EV − Net debt (and other bridge items)', 'Share price = Equity value / Diluted shares'],
        note: 'Leverage magnifies the range: with lots of net debt, a small change in EV is a big change in equity value.',
      },
      {
        kind: 'example',
        title: 'Building bars',
        text: 'EBITDA $150, net debt $300, 50 diluted shares. Comps at 7–9x: EV $1,050–1,350, equity $750–1,050, $15–21 per share. Precedents at 8.5–10x: EV $1,275–1,500, equity $975–1,200, $19.50–24 per share.',
      },
      {
        kind: 'list',
        items: [
          'Methodology bars: comps, precedents, DCF (and LBO if sponsors are likely).',
          'Reference bars: 52-week trading range and analyst price targets. These are context, not valuation methods.',
          'Lines: current (unaffected) share price and the offer price.',
        ],
      },
      {
        kind: 'formula',
        title: 'Premium',
        lines: ['Premium = Offer price / Unaffected share price − 1'],
        note: 'Use the unaffected price: before any deal rumors moved the stock.',
      },
    ],
    sixtySecond:
      'A football field shows the implied share price range from each methodology as a horizontal bar, with reference points like the 52-week range and analyst targets, and vertical lines for the current and offer prices. To build a bar, multiply the multiple range by the metric to get EV, subtract net debt to get equity value, and divide by diluted shares. The question is always where the offer sits relative to the bars.',
  },
  {
    id: 'val-l3',
    sectionId: 'valuation',
    order: 3,
    title: 'Which method when',
    minutes: 6,
    blocks: [
      {
        kind: 'p',
        text: 'Interviewers test judgment with “how would you value X?”. The answer depends on what makes the business unusual.',
      },
      {
        kind: 'table',
        headers: ['Situation', 'Go-to approach', 'Why'],
        rows: [
          ['Mature, profitable company', 'Comps (EV/EBITDA, P/E), precedents, DCF', 'Stable cash flows, good peers'],
          ['Early-stage, unprofitable growth', 'EV/Revenue comps; DCF with long horizon', 'EBITDA and earnings negative'],
          ['Clinical-stage biotech', 'Risk-adjusted NPV of pipeline', 'No revenue; value is in trial outcomes'],
          ['Bank or insurer', 'P/E, P/BV (P/TBV), dividend discount model', 'Debt is operating; EV/EBITDA meaningless'],
          ['REIT', 'P/FFO, P/AFFO, NAV', 'Depreciation distorts earnings'],
          ['Oil & gas producer', 'EV/EBITDAX, NAV, EV/reserves', 'Value tied to reserves and commodity prices'],
          ['Conglomerate', 'Sum-of-the-parts', 'Segments deserve different multiples'],
          ['Distressed company', 'Liquidation / recovery analysis', 'Going-concern value in doubt'],
          ['Company in a sale process', 'Precedents + LBO', 'Control value and sponsor capacity'],
        ],
      },
      {
        kind: 'trap',
        title: 'Don’t forget the LBO floor',
        text: 'If a company could plausibly be bought by private equity, an LBO tells you the price a sponsor could pay and still hit, say, a 20% IRR. Work backwards from the exit: exit equity ÷ required money multiple = max equity today; add the debt you can raise to get max entry EV.',
      },
    ],
    sixtySecond:
      'Pick methods based on what makes the company unusual. Profitable, stable companies: comps, precedents and a DCF. Unprofitable growth companies: revenue multiples. Biotechs: a risk-adjusted pipeline NPV. Banks: P/E and price-to-book because debt is operating. REITs: FFO and NAV. Conglomerates: sum-of-the-parts. Distressed: liquidation value. In a sale with sponsor bidders, add an LBO to see the floor.',
  },
  {
    id: 'val-l4',
    sectionId: 'valuation',
    order: 4,
    title: 'What drives multiples',
    minutes: 6,
    blocks: [
      {
        kind: 'p',
        text: 'A multiple is a compressed DCF: it bakes in expectations about growth, profitability, reinvestment and risk. When two companies trade at different multiples, one of those is different.',
      },
      {
        kind: 'formula',
        title: 'Gordon growth intuition',
        lines: ['Forward P/E = Payout ratio / (Cost of equity − Growth)', 'Example: 0.50 / (9% − 4%) = 10x'],
        note: 'Higher growth or payout → higher multiple. Higher risk (cost of equity) → lower multiple.',
      },
      {
        kind: 'list',
        items: [
          'Growth: more future cash flow per dollar of today’s earnings.',
          'Returns and margins: more value created per dollar of growth.',
          'Reinvestment needs: heavy capex or working capital means less free cash flow from the same EBITDA, so a lower multiple.',
          'Risk and rates: a higher discount rate lowers every multiple, and hits long-duration growth companies hardest.',
        ],
      },
      {
        kind: 'trap',
        title: 'Leverage and EV/EBITDA',
        text: 'Borrowing to buy back stock doesn’t change EV/EBITDA (EV and EBITDA are both unchanged), but it does change P/E because net income falls by the interest and the share count falls.',
      },
    ],
    sixtySecond:
      'Multiples are shorthand for a DCF, so they’re driven by growth, returns on capital, reinvestment needs and risk. Faster growth and higher returns raise multiples; heavy capex and higher risk or interest rates lower them. Long-duration growth companies are most sensitive to rates. EV/EBITDA is unaffected by leverage; P/E isn’t.',
  },
];
