import type { Lesson } from '../../../types/models';

export const lessons: Lesson[] = [
  {
    id: 'co-l1',
    sectionId: 'comps',
    order: 1,
    title: 'Selecting peers and spreading comps',
    minutes: 7,
    blocks: [
      {
        kind: 'p',
        text: 'Trading comparables value a company by looking at how similar public companies trade. The analysis is only as good as the peer set, so most of the judgment goes into choosing peers and making their numbers comparable.',
      },
      {
        kind: 'list',
        ordered: true,
        items: [
          'Select peers: same industry and business model first; then similar size, growth, margins and geography.',
          'Gather data: share price, diluted shares, debt, cash and other bridge items from the latest filings; historical results and consensus estimates.',
          'Spread and normalize: remove one-off items (restructuring, litigation, asset-sale gains) and make definitions consistent (e.g. SBC treatment).',
          'Calendarize to the same periods and calculate LTM and NTM metrics.',
          'Calculate multiples: EV/Revenue, EV/EBITDA, EV/EBIT, P/E.',
          'Apply the 25th–75th percentile range (and median) to the target’s metrics.',
        ],
      },
      {
        kind: 'table',
        caption: 'A mini comps table',
        headers: ['Peer', 'EV', 'EBITDA', 'EV/EBITDA'],
        rows: [
          ['Peer A', '1,200', '150', '8.0x'],
          ['Peer B', '2,000', '200', '10.0x'],
          ['Peer C', '900', '100', '9.0x'],
          ['Peer D', '3,300', '300', '11.0x'],
          ['Median', '', '', '9.5x'],
        ],
      },
      {
        kind: 'trap',
        title: 'Peers that are being acquired',
        text: 'If a peer has announced a sale, its share price now reflects the takeover premium. Exclude it from trading comps (or flag it) or it will inflate the range.',
      },
    ],
    sixtySecond:
      'Trading comps value a company based on how similar public companies trade. Pick peers by industry and business model, then size, growth and margins. Gather their market data and financials, normalize for one-offs, make definitions consistent and calendarize. Calculate multiples like EV/EBITDA and P/E, take the median and 25th–75th percentile, and apply that range to the target.',
  },
  {
    id: 'co-l2',
    sectionId: 'comps',
    order: 2,
    title: 'LTM, NTM and calendarization',
    minutes: 6,
    blocks: [
      {
        kind: 'formula',
        title: 'Last twelve months',
        lines: ['LTM = Last fiscal year + Current YTD − Prior-year YTD'],
        note: 'Example: FY25 revenue 1,000; 9M26 800; 9M25 720 → LTM 1,080.',
      },
      {
        kind: 'p',
        text: 'NTM (next twelve months) uses consensus forecasts. Forward multiples matter most for growth companies, where trailing numbers understate what an acquirer or investor is paying for.',
      },
      {
        kind: 'formula',
        title: 'Calendarization',
        lines: ['Calendar-year metric = Σ (months of the fiscal year that fall in the calendar year / 12) × fiscal-year metric'],
        note: 'March year-end: CY2026 = 3/12 × FY Mar-26 + 9/12 × FY Mar-27.',
      },
      {
        kind: 'example',
        title: 'Calendarizing a March year-end',
        text: 'EBITDA is 400 for FY Mar-26 and 480 for FY Mar-27. Calendar 2026 = 3/12 × 400 + 9/12 × 480 = 100 + 360 = 460.',
      },
      {
        kind: 'trap',
        title: 'Mixing periods',
        text: 'Putting a June year-end company’s FY27 next to a December year-end company’s 2027 compares periods six months apart. For a fast grower that alone can swing the multiple by 10–20%.',
      },
    ],
    sixtySecond:
      'LTM is the last fiscal year plus the current year-to-date minus the prior year-to-date. NTM uses consensus forecasts for the next twelve months. Calendarization aligns companies with different fiscal year-ends by weighting each fiscal year by the months that fall in the calendar year, so every multiple compares the same period.',
  },
  {
    id: 'co-l3',
    sectionId: 'comps',
    order: 3,
    title: 'Precedent transactions',
    minutes: 7,
    blocks: [
      {
        kind: 'p',
        text: 'Precedent transactions value a company based on what buyers paid for similar companies. Because buyers pay for control, precedent multiples usually sit above trading multiples.',
      },
      {
        kind: 'formula',
        title: 'Deal metrics',
        lines: [
          'Equity purchase price = Offer per share × Diluted shares (TSM at the offer price)',
          'Transaction value = Equity purchase price + Net debt assumed',
          'Transaction multiple = Transaction value / Target LTM EBITDA',
        ],
      },
      {
        kind: 'list',
        items: [
          'Screen: similar targets (sector, size, business model), usually the last 3–5 years.',
          'Sources: merger proxies, 8-Ks, press releases, fairness opinions; databases like Capital IQ, PitchBook, LSEG and Mergermarket.',
          'Mostly LTM metrics, because projections at the time of a deal are rarely disclosed.',
        ],
      },
      {
        kind: 'trap',
        title: 'Context matters more than the number',
        text: 'A 2021 deal at 18x was struck at near-zero interest rates. A strategic deal with big cost synergies can show a high standalone multiple that another buyer can’t justify. Always ask when the deal happened and who the buyer was.',
      },
    ],
    sixtySecond:
      'Precedent transactions use multiples paid in past acquisitions of similar companies, usually transaction value over the target’s LTM EBITDA. Transaction value is the equity purchase price plus the net debt assumed. Precedents usually come out above comps because of control premiums and synergies, but they are historical, so weigh each deal by how similar the market and the buyer were.',
  },
  {
    id: 'co-l4',
    sectionId: 'comps',
    order: 4,
    title: 'Control premiums and premiums-paid analysis',
    minutes: 5,
    blocks: [
      {
        kind: 'formula',
        title: 'Premium',
        lines: ['Premium = Offer price / Unaffected price − 1'],
        note: 'Reference prices: 1-day unaffected, 30-day VWAP, 52-week high.',
      },
      {
        kind: 'p',
        text: 'Buyers pay a premium for control: the ability to direct strategy and cash flows and to capture synergies. Shareholders won’t tender without one. For US public targets, premiums have historically averaged roughly 20–40%, with wide variation.',
      },
      {
        kind: 'example',
        title: 'Premiums-paid analysis',
        text: 'Unaffected price $40; comparable deals paid a median 28% premium (25th–75th: 20%–35%). Implied offer range: $48.00–$54.00, median $51.20.',
      },
      {
        kind: 'trap',
        title: 'The “affected” price',
        text: 'If rumors pushed the stock up before announcement, using that price understates the premium. Always define the unaffected date.',
      },
    ],
    sixtySecond:
      'A control premium is what a buyer pays above the unaffected share price to acquire control, historically about 20–40% for US public targets. Premiums-paid analysis applies the range of premiums from comparable deals to the target’s unaffected price. Always measure against the price before any deal news.',
  },
];
