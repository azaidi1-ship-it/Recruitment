import type { Lesson } from '../../../types/models';

export const lessons: Lesson[] = [
  {
    id: 'ev-l1',
    sectionId: 'ev-equity',
    order: 1,
    title: 'Equity value and enterprise value',
    minutes: 6,
    blocks: [
      {
        kind: 'p',
        text: 'Equity value is what the company is worth to its common shareholders. Enterprise value (EV) is what the core business is worth to everyone who has funded it: shareholders, lenders, preferred holders and minority owners. EV answers “what are the operations worth?”; equity value answers “what is my stock worth?”.',
      },
      {
        kind: 'formula',
        title: 'The bridge',
        lines: [
          'Equity value = Share price × Diluted shares',
          'Enterprise value = Equity value + Debt + Preferred stock + Noncontrolling interest − Cash − Non-operating assets',
        ],
      },
      {
        kind: 'example',
        title: 'The house analogy',
        text: 'You buy a $500k house with a $100k down payment and a $400k mortgage, and the seller leaves $20k in a safe. Your equity is $100k. The house itself (the “enterprise”) cost you $100k + $400k − $20k = $480k: the down payment plus the debt you took on, minus the cash you got back.',
      },
      {
        kind: 'p',
        text: 'EV is useful because it doesn’t depend on how a company is financed. Two identical businesses, one funded with debt and one with equity, have the same EV but different equity values. That is why EV-based multiples like EV/EBITDA are the standard way to compare companies.',
      },
      {
        kind: 'trap',
        title: 'Changes to EV',
        text: 'EV changes only when the operations change. Raising debt and holding the cash: EV unchanged. Debt-funded buyback: equity value down, EV unchanged. Paying a dividend: equity value down, EV unchanged. Issuing stock to buy a business: both up. Interviewers love these.',
      },
    ],
    sixtySecond:
      'Equity value is diluted shares times share price: the value to common shareholders. Enterprise value is the value of the core operations to all investors: equity value plus debt, preferred stock and noncontrolling interest, minus cash and other non-operating assets. EV is independent of capital structure, which is why EV multiples are used to compare companies, and it only changes when the operations change.',
  },
  {
    id: 'ev-l2',
    sectionId: 'ev-equity',
    order: 2,
    title: 'The bridge items, and why each is there',
    minutes: 7,
    blocks: [
      {
        kind: 'p',
        text: 'Every bridge item exists for one of two reasons: it’s a claim on the operations that ranks alongside or ahead of common equity (add it), or it’s an asset that isn’t part of the operations (subtract it). The test for anything unusual is consistency with the metric you’ll divide by.',
      },
      {
        kind: 'table',
        headers: ['Item', 'Add or subtract', 'Why'],
        rows: [
          ['Debt (incl. current portion, notes, revolver drawn)', 'Add', 'A claim on the operations; an acquirer must repay or assume it'],
          ['Preferred stock', 'Add', 'Senior to common, fixed dividends, liquidation preference: debt-like'],
          ['Noncontrolling interest', 'Add', 'Consolidated EBITDA includes 100% of subsidiaries the parent doesn’t fully own'],
          ['Cash and equivalents', 'Subtract', 'Non-operating; reduces the net cost to a buyer'],
          ['Equity-method investments', 'Subtract', 'Their EBITDA is not in consolidated EBITDA'],
          ['Unfunded pensions', 'Often add (after tax)', 'Debt-like obligation, if consistent with EBITDA'],
          ['Operating leases (US GAAP)', 'Usually exclude', 'Rent is already inside EBITDA; add only if you use EBITDAR'],
        ],
      },
      {
        kind: 'formula',
        title: 'The consistency rule',
        lines: ['If the claim’s cost is BELOW your metric (like interest below EBITDA) → add the claim', 'If its cost is already INSIDE your metric (like rent in EBITDA) → leave it out'],
      },
      {
        kind: 'trap',
        title: 'NCI vs equity investments',
        text: 'They go in opposite directions for the same reason. A 70%-owned subsidiary is consolidated, so its full EBITDA is in your numbers: add the 30% you don’t own (NCI). A 30%-owned investee isn’t consolidated, so none of its EBITDA is in your numbers: subtract its value.',
      },
    ],
    sixtySecond:
      'Add claims on the operations: debt, preferred stock and noncontrolling interest. Subtract assets that aren’t part of the operations: cash and equity-method investments. NCI is added because consolidated EBITDA includes 100% of majority-owned subsidiaries; equity investments are subtracted because their EBITDA isn’t included. For anything unusual, such as pensions or leases, the rule is consistency with the metric you’re using.',
  },
  {
    id: 'ev-l3',
    sectionId: 'ev-equity',
    order: 3,
    title: 'Diluted shares: TSM, RSUs and convertibles',
    minutes: 7,
    blocks: [
      {
        kind: 'p',
        text: 'Equity value uses fully diluted shares: basic shares plus everything likely to become common stock. Only in-the-money securities count.',
      },
      {
        kind: 'formula',
        title: 'Treasury stock method (options and warrants)',
        lines: [
          'If strike < share price: shares added = number of options',
          'Proceeds = options × strike',
          'Shares repurchased = proceeds / share price',
          'Net new shares = options − shares repurchased',
        ],
        note: 'Do it tranche by tranche and skip out-of-the-money tranches.',
      },
      {
        kind: 'example',
        title: 'TSM with three tranches',
        text: 'Price $30, basic 50m. Options: 4m @ $15, 3m @ $25, 2m @ $35. The $35 tranche is out of the money. ITM options 7m; proceeds 4 × 15 + 3 × 25 = $135m; repurchase 135 / 30 = 4.5m; net new 2.5m. Diluted shares 52.5m.',
      },
      {
        kind: 'list',
        items: [
          'RSUs: add them in full; there is no strike price and no proceeds.',
          'Convertible bonds: if the share price is above the conversion price, add face value / conversion price in shares and remove the bond from debt. If out of the money, treat it as debt.',
          'Convertible preferred: same logic as convertible bonds.',
        ],
      },
      {
        kind: 'trap',
        title: 'Use the offer price in a deal',
        text: 'For trading comps, run the TSM at today’s share price. In an acquisition, run it at the offer price: options that are out of the money today may be in the money at the offer, and the buyer has to pay for them.',
      },
    ],
    sixtySecond:
      'Diluted shares are basic shares plus in-the-money options, warrants, RSUs and convertibles. For options, use the treasury stock method: add the in-the-money options, assume the exercise proceeds buy back shares at the current price, and add the net. RSUs are added in full. In-the-money convertibles add face value divided by conversion price and come out of debt. In an M&A deal, use the offer price.',
  },
  {
    id: 'ev-l4',
    sectionId: 'ev-equity',
    order: 4,
    title: 'Matching multiples to values',
    minutes: 5,
    blocks: [
      {
        kind: 'p',
        text: 'A multiple is only meaningful if the numerator and denominator belong to the same investors. Enterprise value belongs to everyone, so it pairs with metrics before interest. Equity value belongs to shareholders, so it pairs with metrics after interest.',
      },
      {
        kind: 'table',
        headers: ['Numerator', 'Pairs with', 'Never pair with'],
        rows: [
          ['Enterprise value', 'Revenue, EBITDA, EBIT, unlevered FCF', 'Net income, EPS, levered FCF'],
          ['Equity value / share price', 'Net income, EPS, levered FCF, book value', 'EBITDA, EBIT, revenue'],
        ],
      },
      {
        kind: 'formula',
        title: 'From a multiple to a share price',
        lines: ['EV = Multiple × Metric', 'Equity value = EV − Net debt (and other bridge items)', 'Share price = Equity value / Diluted shares'],
      },
      {
        kind: 'trap',
        title: '“Why is P/E affected by leverage?”',
        text: 'Net income is after interest, so adding debt changes earnings and P/E even if the business is identical. EBITDA is before interest and EV includes debt, so EV/EBITDA is unaffected. That is why EV/EBITDA is the default for comparing companies.',
      },
    ],
    sixtySecond:
      'Enterprise value pairs with pre-interest metrics, such as revenue, EBITDA, EBIT and unlevered free cash flow. Equity value pairs with post-interest metrics, such as net income, EPS, levered free cash flow and book value. To go from a multiple to a share price: multiply to get EV, subtract net debt to get equity value, divide by diluted shares. P/E moves with leverage; EV/EBITDA doesn’t.',
  },
];
