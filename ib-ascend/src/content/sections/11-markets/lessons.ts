import type { Lesson } from '../../../types/models';

export const lessons: Lesson[] = [
  {
    id: 'mk-l1',
    sectionId: 'markets',
    order: 1,
    title: 'Rates, inflation and why bankers care',
    minutes: 7,
    blocks: [
      {
        kind: 'p',
        text: 'Almost every market question comes back to interest rates. Rates set the cost of debt, the risk-free rate in every DCF and the hurdle that equities must beat. If you can explain how a change in rates flows through to valuations and deal activity, you can answer most “markets” questions with a framework instead of memorized headlines.',
      },
      { kind: 'h', text: 'The building blocks' },
      {
        kind: 'list',
        items: [
          'Policy rate: the Federal Reserve sets a target range for the federal funds rate (overnight borrowing between banks). It moves short-term rates directly.',
          'Balance sheet: buying bonds (QE) pushes long-term yields down and adds liquidity; letting bonds roll off (QT) does the opposite.',
          '10-year Treasury yield: set by the market, not the Fed. It reflects expected future short rates, expected inflation and a term premium. It is the usual risk-free rate in valuation.',
          'Credit spread: the extra yield a corporate borrower pays over Treasuries for default risk. Investment-grade spreads are narrow; high-yield spreads are wider and move more.',
        ],
      },
      {
        kind: 'formula',
        title: 'Formulas to know',
        lines: [
          'Real yield ≈ nominal yield − expected inflation (4.5% − 3.0% = 1.5%)',
          'Bond price change ≈ −modified duration × Δyield (duration 7, +1% → −7%)',
          'Credit spread = corporate yield − Treasury yield (6.5% − 4.2% = 230 bps)',
          'Earnings yield = 1 / P/E (20x → 5%)',
        ],
        note: '1 basis point (bp) = 0.01%. 100 bps = 1%.',
      },
      { kind: 'h', text: 'From rates to valuations' },
      {
        kind: 'p',
        text: 'Higher rates raise the discount rate, so the present value of future cash flows falls. Companies whose value sits far in the future (high-growth, unprofitable today) are “long duration” and fall the most. Higher rates also make bonds a more attractive alternative to stocks, so equity multiples tend to compress.',
      },
      { kind: 'h', text: 'From rates to deals' },
      {
        kind: 'list',
        items: [
          'LBOs: higher rates mean more interest per dollar of debt, so sponsors can borrow less and pay less.',
          'Strategic M&A: buyers face higher financing costs, and a gap opens between what sellers expect (anchored to old prices) and what buyers will pay.',
          'IPOs: falling growth valuations and higher volatility usually close the IPO window.',
          'Restructuring: higher rates strain over-levered companies when their debt matures and must be refinanced.',
        ],
      },
      {
        kind: 'example',
        title: '2022: the case study',
        text: 'The Fed raised rates from near zero at the fastest pace in decades. Growth stocks fell sharply, IPO issuance dropped, LBO financing became expensive and bond prices fell. Use it as your go-to example of rates feeding through to markets.',
      },
      {
        kind: 'formula',
        title: 'FX translation',
        lines: ['USD revenue = foreign revenue × exchange rate', '€100 at 1.10 = $110; at 1.00 = $100 → −9.1%'],
        note: 'A stronger dollar lowers US multinationals’ reported foreign results.',
      },
      {
        kind: 'trap',
        title: 'The Fed doesn’t set the 10-year',
        text: 'The Fed sets the overnight policy rate. Long-term yields are set by the market and can move the opposite way: if markets think the Fed will slow the economy, long yields can fall even as the Fed raises short rates. That is how the curve inverts.',
      },
    ],
    sixtySecond:
      'The Fed sets short rates and influences long rates through its balance sheet; the market sets the 10-year, which is the risk-free rate in valuations. Higher rates raise discount rates and borrowing costs, so valuations fall (most for long-duration growth stocks), LBOs get harder and IPO windows close. Credit spreads show risk appetite. Know real yield ≈ nominal − inflation, price change ≈ −duration × Δyield, and earnings yield = 1 / P/E.',
  },
  {
    id: 'mk-l2',
    sectionId: 'markets',
    order: 2,
    title: 'Reading the deal environment',
    minutes: 6,
    blocks: [
      {
        kind: 'p',
        text: 'Deal activity depends on three things: confidence (are CEOs and boards willing to make big bets?), currency (are stock prices high and is financing available?) and agreement on price (are buyer and seller expectations close?). When all three line up, M&A and IPO volumes rise.',
      },
      {
        kind: 'table',
        caption: 'Indicators and what they tell you',
        headers: ['Indicator', 'Healthy for deals', 'Bad for deals'],
        rows: [
          ['Equity markets', 'Stable or rising', 'Falling sharply'],
          ['VIX (expected volatility)', 'Low', 'High'],
          ['Credit spreads', 'Tight', 'Wide'],
          ['Recent IPO performance', 'Trading above offer price', 'Broken deals'],
          ['PE dry powder', 'High and must be deployed', 'Low'],
        ],
      },
      { kind: 'h', text: 'Ways companies separate businesses' },
      {
        kind: 'list',
        items: [
          'Spin-off: subsidiary shares are distributed to existing shareholders. No cash is raised; can be tax-free if requirements are met.',
          'Carve-out (equity carve-out): a minority stake in the subsidiary is sold in an IPO, raising cash.',
          'Split-off: shareholders choose to exchange parent shares for subsidiary shares.',
          'Divestiture: the business is sold outright to a strategic or a sponsor for cash.',
        ],
      },
      { kind: 'h', text: 'Regulation that shapes deals' },
      {
        kind: 'list',
        items: [
          'HSR (Hart-Scott-Rodino): deals above size thresholds are filed with the FTC and DOJ, with an initial 30-day waiting period (15 days for cash tender offers). A “second request” means a deep antitrust review.',
          'CFIUS: reviews foreign investments in US businesses for national-security risks.',
          'Shareholder votes and fairness opinions protect target shareholders.',
        ],
      },
      { kind: 'h', text: 'Who creates deal flow' },
      {
        kind: 'list',
        items: [
          'Strategic buyers seeking growth, scale or capabilities.',
          'Private equity sponsors deploying dry powder and selling mature investments (often to other sponsors in secondary buyouts).',
          'Activist investors pushing for sales, break-ups or capital returns.',
          'SPACs: listed shells that raise cash and merge with a private company to take it public.',
        ],
      },
      {
        kind: 'trap',
        title: 'Don’t quote numbers you can’t source',
        text: 'If you cite a statistic (“M&A volume is up X% this year”), know where it came from. A wrong number hurts more than a qualitative statement such as “sponsor activity has picked up as financing costs have eased”.',
      },
    ],
    sixtySecond:
      'Deals need confidence, currency and agreement on price. Watch equity markets, the VIX, credit spreads, recent IPO performance and PE dry powder. Know the separation structures (spin-off distributes shares, carve-out IPOs a stake, split-off is an exchange) and the regulators (HSR for antitrust with a 30-day wait, CFIUS for national security). Deal flow comes from strategics, sponsors, activists and SPACs.',
  },
  {
    id: 'mk-l3',
    sectionId: 'markets',
    order: 3,
    title: 'Pitching a deal',
    minutes: 6,
    blocks: [
      {
        kind: 'p',
        text: '“Tell me about a deal you’ve followed” is one of the most common questions in banking interviews. Interviewers want to see that you follow markets, can structure an answer and can form a view. Pick a deal you know deeply rather than the biggest headline.',
      },
      {
        kind: 'list',
        ordered: true,
        items: [
          'Facts: who bought whom, for how much, and whether it was paid in cash, stock or both.',
          'Rationale: why the buyer did it (growth, scale, capabilities, cost synergies, revenue synergies).',
          'Valuation: the multiple paid (EV/EBITDA, EV/Revenue) and the premium to the unaffected share price, compared with similar deals.',
          'Financing and regulation: how it was funded and whether antitrust or other approvals are a risk.',
          'Your view: would you have done it, and what’s the main risk?',
        ],
      },
      {
        kind: 'formula',
        title: 'Numbers to have ready',
        lines: [
          'Premium = offer price / unaffected price − 1',
          'Merger arb spread = offer price / current target price − 1 ($50 / $48 → 4.2%)',
          'Implied multiple = transaction EV / target EBITDA',
        ],
      },
      {
        kind: 'h',
        text: 'Reading the market’s reaction',
      },
      {
        kind: 'p',
        text: 'The acquirer’s share price on announcement, relative to the market, is the market’s verdict on whether it overpaid. The target trading below the offer (the arb spread) reflects time to close and the risk the deal fails; a wide spread signals doubts about regulation or financing. If the target trades above the offer, investors expect a higher bid.',
      },
      {
        kind: 'trap',
        title: 'Expect the follow-ups',
        text: '“What multiple was paid?” “Who else could have bought it?” “Would you have done it?” “What happens if the deal is blocked?” If you can’t answer two levels deep, pick a different deal. Keep your deals in the Deal Journal and refresh them before each interview.',
      },
    ],
    sixtySecond:
      'Structure a deal pitch as facts, rationale, valuation, financing and regulation, then your view with the main risk. Know the multiple and premium paid. Read the market’s reaction through the acquirer’s relative share price and the merger arbitrage spread. Choose a deal you can discuss two levels deep.',
  },
  {
    id: 'mk-l4',
    sectionId: 'markets',
    order: 4,
    title: 'Pitching a stock and building a market view',
    minutes: 7,
    blocks: [
      {
        kind: 'p',
        text: 'Stock pitches come up more in sales & trading and buy-side interviews, but bankers ask them too, and the skill is the same as forming a view on a deal: say something specific, back it with evidence and show what would prove you wrong.',
      },
      {
        kind: 'list',
        ordered: true,
        items: [
          'Recommendation: buy or sell, current price and target.',
          'One-line company overview.',
          'Two or three thesis points the market is missing (your variant view).',
          'Valuation: multiples versus peers and history, or a reverse DCF showing what the price implies.',
          'Catalysts: events that will make the market recognize the mispricing.',
          'Risks: what could go wrong and what would change your mind.',
        ],
      },
      {
        kind: 'example',
        title: 'Thesis or not?',
        text: 'Not a thesis: “It’s a great company with strong management.” A thesis: “The market prices the company as if its new product line stays sub-scale, but early adoption data suggests it can reach X% of revenue within two years, which isn’t in consensus estimates.”',
      },
      {
        kind: 'formula',
        title: 'Useful framings',
        lines: [
          'Reverse DCF: the growth or margin the current price implies',
          'Relative value: X x forward P/E vs peers at Y x, and why the gap should close',
          'Earnings yield vs 10-year: 1 / P/E − risk-free rate',
        ],
      },
      { kind: 'h', text: 'Building a weekly market view' },
      {
        kind: 'list',
        items: [
          'Track four numbers every week: the policy rate, the 10-year yield, the S&P 500 and high-yield credit spreads.',
          'Follow one or two live deals and one or two sectors you care about.',
          'Write a three-sentence view: what’s happening, what it means for deals, what you’re watching.',
          'Log it in Market Notes (Tools → Deal & Market Journal) so you never walk into an interview cold.',
        ],
      },
      {
        kind: 'trap',
        title: '“It deserves a discount”',
        text: 'A cheap stock isn’t mispriced if the discount is earned. Name the reasons for the discount (slower growth, lower margins, more risk) and explain with evidence why they are fading or overstated.',
      },
    ],
    sixtySecond:
      'Lead a stock pitch with buy or sell and a target, then two or three variant-view thesis points, valuation (peers or a reverse DCF), a catalyst and the risks. Address why a cheap stock might deserve its discount. Build a weekly market view from four numbers (policy rate, 10-year, S&P 500, credit spreads) plus a couple of deals.',
  },
];
