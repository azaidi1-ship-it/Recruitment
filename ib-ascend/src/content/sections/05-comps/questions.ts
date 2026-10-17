import type { Question } from '../../../types/questions';
import { builders } from '../../helpers';

const { mcq, num, rapid, order, free } = builders('comps');

export const questions: Question[] = [
  // ── Peer selection ──
  mcq(
    { id: 'co-q-001', subtopic: 'peer-selection', difficulty: 'basic', pools: ['pre', 'post'] },
    'What are the most important criteria for choosing comparable companies?',
    [
      ['Industry and business model first, then size, growth, margins and geography', 'Peers should face the same economics and risks; financial profile and geography refine the set.', true],
      ['A similar share price', 'Share price depends on share count and says nothing about comparability.'],
      ['Listing on the same stock exchange', 'Exchange is a minor consideration at most.'],
      ['Having the same auditor', 'Auditor choice is irrelevant to valuation comparability.'],
    ],
    'Start with what the business does, then match the financial profile.',
  ),
  mcq(
    { id: 'co-q-002', subtopic: 'peer-selection', difficulty: 'basic', pools: ['pre', 'post'] },
    'How many comparable companies does a typical comps analysis include?',
    [
      ['Usually around 4–10: enough for a meaningful range, but each genuinely comparable', 'Quality beats quantity; padding the set with weak peers adds noise.', true],
      ['Exactly one: the closest competitor', 'One data point can’t give a range.'],
      ['50 or more, to be statistically significant', 'Few sectors have that many true peers; most would be poor comparables.'],
      ['Exactly three, by regulation', 'There is no rule.'],
    ],
    'Aim for a tight, defensible set, sometimes split into core and broader tiers.',
  ),
  mcq(
    { id: 'co-q-003', subtopic: 'peer-selection', difficulty: 'intermediate', pools: ['post', 'mock'] },
    'You can’t find close public peers for a niche company. What do you do?',
    [
      ['Widen the criteria (adjacent sectors, size, geography), tier the peers into core and broader sets, and lean more on precedents and a DCF', 'Imperfect comps are still useful if you’re explicit about the differences and weight methods accordingly.', true],
      ['Skip valuation entirely', 'You still need a view on value.'],
      ['Use the S&P 500 average multiple', 'A market average ignores the company’s specific economics.'],
      ['Use the company’s own historical book value', 'Book value rarely reflects what the business is worth.'],
    ],
    'Explain the compromise rather than pretending the peers are perfect.',
  ),
  mcq(
    { id: 'co-q-017', subtopic: 'peer-selection', difficulty: 'advanced', pools: ['mock'] },
    'The target grows revenue 15% a year. One peer grows 25%, another 3%. How should you handle the growth gap?',
    [
      ['Focus on peers with similar growth, and consider growth-adjusted views (e.g. multiple vs. growth regression)', 'Faster growers deserve higher multiples, so mixing very different growth profiles without adjustment skews the range.', true],
      ['Ignore growth: multiples already adjust for everything', 'Multiples reflect growth, which is exactly why mismatched growth distorts the comparison.'],
      ['Average the two peers’ multiples', 'A simple average of very different businesses hides the issue.'],
      ['Use only the faster-growing peer to be conservative', 'That would be aggressive, not conservative.'],
    ],
    'Growth is the biggest driver of multiple differences within a sector.',
  ),

  // ── Spreading and normalizing ──
  mcq(
    { id: 'co-q-004', subtopic: 'spreading', difficulty: 'intermediate', pools: ['post', 'mock'] },
    'Why do bankers adjust peers’ financials for non-recurring items?',
    [
      ['Multiples should reflect sustainable earnings; one-off gains or charges would distort them', 'A restructuring charge can make EBITDA look artificially low and the multiple artificially high.', true],
      ['To make every peer look more profitable', 'Adjustments go both ways: one-off gains are removed too.'],
      ['Because GAAP requires it', 'Adjusted metrics are non-GAAP; it’s an analytical choice.'],
      ['To match the target’s fiscal year', 'That’s calendarization, a separate step.'],
    ],
    'Normalize so you compare run-rate performance.',
  ),
  mcq(
    { id: 'co-q-005', subtopic: 'spreading', difficulty: 'intermediate', pools: ['post'] },
    'Which set of metrics would a typical trading comps table show?',
    [
      ['EV/Revenue, EV/EBITDA and P/E for LTM and forward years, alongside growth and margins', 'Multiples plus the operating stats that explain them.', true],
      ['Only the share price and market cap', 'Those are inputs, not comparable multiples.'],
      ['Only historical book value', 'Book value isn’t the main lens for most industries.'],
      ['Only dividend yields', 'Useful for some sectors, but not the core table.'],
    ],
    'Show multiples and the growth/margin data needed to interpret them.',
  ),
  mcq(
    { id: 'co-q-006', subtopic: 'spreading', difficulty: 'basic', pools: ['pre', 'post'] },
    'What does LTM mean, and how do you calculate it?',
    [
      ['Last twelve months: latest fiscal year + current year-to-date − prior year-to-date', 'It gives the most recent full year of results regardless of fiscal year-end.', true],
      ['Long-term mean: the average of the last 10 years', 'LTM means last twelve months.'],
      ['The next twelve months of consensus estimates', 'That is NTM.'],
      ['The latest quarter × 4', 'Annualizing one quarter ignores seasonality.'],
    ],
    'LTM = FY + YTD current − YTD prior.',
  ),
  num(
    { id: 'co-q-007', subtopic: 'spreading', difficulty: 'basic', pools: ['pre', 'post'] },
    'Fiscal 2025 revenue was $1,000. Revenue for the first nine months of 2026 was $800, versus $720 for the first nine months of 2025. What is LTM revenue?',
    1080,
    ['LTM = FY2025 + 9M 2026 − 9M 2025', '= 1,000 + 800 − 720 = 1,080'],
    'Roll the last full year forward by swapping the old year-to-date for the new one.',
  ),
  mcq(
    { id: 'co-q-018', subtopic: 'spreading', difficulty: 'basic', pools: ['pre'] },
    'What does NTM mean?',
    [
      ['Next twelve months: forward-looking figures, usually from consensus estimates', 'Forward multiples capture expected performance, which matters most for growth companies.', true],
      ['Net trading margin', 'Not a standard term in comps.'],
      ['Normalized trailing metrics', 'Trailing metrics are LTM.'],
      ['Non-tax-affected metrics', 'Not what NTM stands for.'],
    ],
    'LTM looks back; NTM looks forward.',
  ),
  mcq(
    { id: 'co-q-011', subtopic: 'spreading', difficulty: 'intermediate', pools: ['post'] },
    'Which share price and date should you use for each peer in a comps table?',
    [
      ['The current share price on the same date for every peer, with diluted shares from the latest filings', 'Consistency in timing keeps the multiples comparable.', true],
      ['Each peer’s 52-week high', 'That inflates every multiple.'],
      ['The price on each company’s fiscal year-end', 'Different dates make the comparison inconsistent.'],
      ['The IPO price', 'Irrelevant to current value.'],
    ],
    'Same pricing date, fully diluted shares.',
  ),
  mcq(
    { id: 'co-q-012', subtopic: 'spreading', difficulty: 'advanced', pools: ['mock'] },
    'One of your peers has just agreed to be acquired. How should you treat it in trading comps?',
    [
      ['Exclude it or flag it: its share price now reflects the takeover premium, not standalone trading value', 'Including it would inflate the range.', true],
      ['Keep it: more data is always better', 'Its price is no longer a minority trading value.'],
      ['Use its pre-announcement price but today’s estimates', 'Mixing dates creates inconsistency; better to exclude or show separately.'],
      ['Move it to the precedent transactions instead and also keep it in comps', 'It may belong in precedents, but not in both.'],
    ],
    'Comps should reflect undisturbed trading prices.',
  ),
  mcq(
    { id: 'co-q-013', subtopic: 'spreading', difficulty: 'intermediate', pools: ['post', 'mock'] },
    'Why do bankers usually focus on the median (and quartiles) rather than the mean of peer multiples?',
    [
      ['The median is less distorted by outliers', 'One peer at 25x can drag the mean far from the typical multiple.', true],
      ['The mean can’t be calculated for multiples', 'It can; it’s just sensitive to outliers.'],
      ['Regulators require medians', 'There’s no such requirement.'],
      ['The median is always higher', 'It can be higher or lower than the mean.'],
    ],
    'Show 25th percentile, median and 75th percentile.',
  ),
  num(
    { id: 'co-q-014', subtopic: 'spreading', difficulty: 'intermediate', pools: ['post', 'mock'], followUps: ['co-q-013'] },
    'Five peers trade at 6.0x, 7.5x, 8.0x, 9.0x and 15.0x EV/EBITDA. What is the median multiple?',
    8,
    ['Sorted: 6.0, 7.5, 8.0, 9.0, 15.0', 'Median = the middle value = 8.0x (the mean is 9.1x, pulled up by the 15.0x outlier)'],
    'Medians resist outliers.',
    { unit: 'x', tolerance: { kind: 'abs', value: 0.05 } },
  ),
  num(
    { id: 'co-q-015', subtopic: 'spreading', difficulty: 'advanced', pools: ['mock'] },
    'Peers trade at a median of 18x NTM P/E. The target’s NTM EPS is $2.50. What is the implied share price?',
    45,
    ['Price = P/E × EPS = 18 × 2.50 = 45'],
    'Equity multiples go straight to a share price; no bridge needed.',
  ),
  mcq(
    { id: 'co-q-016', subtopic: 'spreading', difficulty: 'elite', pools: ['mock'] },
    'The target’s “adjusted EBITDA” adds back stock-based compensation, but most peers report EBITDA without adding it back. What should you do?',
    [
      ['Treat SBC the same way for every company (all added back or none), so the multiples are computed on a consistent basis', 'Otherwise the target’s EBITDA is inflated relative to peers and its implied value overstated.', true],
      ['Leave it as reported: each company chooses its own definition', 'Comparability matters more than each company’s presentation.'],
      ['Add back SBC only for the target', 'That inflates the target’s value.'],
      ['Use revenue multiples instead to avoid the issue', 'That throws away profitability information rather than fixing consistency.'],
    ],
    'Consistency of definitions across the peer set is non-negotiable.',
  ),

  // ── Calendarization ──
  mcq(
    { id: 'co-q-009', subtopic: 'calendarization', difficulty: 'intermediate', pools: ['post'] },
    'Why do bankers calendarize peers’ financials?',
    [
      ['Peers have different fiscal year-ends, so their figures must be aligned to the same calendar period before comparing', 'A March year-end company’s “FY2026” covers mostly 2025.', true],
      ['To remove seasonality within the year', 'Calendarization aligns periods; it doesn’t remove seasonality.'],
      ['To convert currencies', 'Currency conversion is separate.'],
      ['Because the SEC requires calendar years', 'Companies can choose their fiscal year.'],
    ],
    'Compare the same twelve months for every company.',
  ),
  num(
    { id: 'co-q-008', subtopic: 'calendarization', difficulty: 'intermediate', pools: ['post', 'mock'] },
    'A company’s fiscal year ends March 31. EBITDA was $400 for the year ending March 2026 and is forecast at $480 for the year ending March 2027. What is calendar 2026 EBITDA?',
    460,
    ['Calendar 2026 = Jan–Mar 2026 (3 months of FY Mar-26) + Apr–Dec 2026 (9 months of FY Mar-27)', '= 3/12 × 400 + 9/12 × 480 = 100 + 360 = 460'],
    'Weight each fiscal year by the months that fall in the calendar year.',
  ),
  num(
    { id: 'co-q-010', subtopic: 'calendarization', difficulty: 'advanced', pools: ['mock'] },
    'A company’s fiscal year ends June 30. EBITDA was $200 for FY June 2026 and is forecast at $260 for FY June 2027. What is calendar 2026 EBITDA?',
    230,
    ['Calendar 2026 = Jan–Jun 2026 (6/12 of FY Jun-26) + Jul–Dec 2026 (6/12 of FY Jun-27)', '= 0.5 × 200 + 0.5 × 260 = 230'],
    'A June year-end splits evenly.',
  ),
  num(
    { id: 'co-q-044', subtopic: 'calendarization', difficulty: 'elite', pools: ['mock'] },
    'The target’s fiscal year ends September 30. Forecast EBITDA is $360 for FY Sep-27 and $420 for FY Sep-28. Peers trade at 10.0x calendar 2027 EBITDA. What is the implied enterprise value?',
    3750,
    ['Calendar 2027 = Jan–Sep 2027 (9/12 of FY Sep-27) + Oct–Dec 2027 (3/12 of FY Sep-28)', '= 0.75 × 360 + 0.25 × 420 = 270 + 105 = 375', 'EV = 10.0 × 375 = 3,750'],
    'Calendarize the target before applying a calendar-year peer multiple.',
  ),
  free(
    { id: 'co-q-039', subtopic: 'calendarization', difficulty: 'advanced', pools: ['mock'] },
    'What is calendarization and why does it matter?',
    [
      ['def', 'Aligning companies with different fiscal year-ends to the same calendar period', [['fiscal year', 'calendar']]],
      ['how', 'Weight each fiscal year by the months that fall in the calendar year', [['weight*|months|portion|blend*']]],
      ['why', 'Without it, multiples compare different periods, which distorts them, especially for growing or cyclical companies', [['different period*|same period|comparable|apples']]],
    ],
    'Calendarization means converting each company’s fiscal-year numbers to the same calendar period, so you compare the same twelve months. You weight each fiscal year by the months that fall in the calendar year: for a March year-end, calendar 2026 is three months of fiscal 2026 and nine months of fiscal 2027. It matters because otherwise you’re comparing different periods, which distorts multiples, especially when companies are growing fast or the cycle is turning.',
    'Define it, show the weighting, explain the distortion.',
    45,
  ),

  // ── Precedent transactions ──
  mcq(
    { id: 'co-q-019', subtopic: 'precedents', difficulty: 'basic', pools: ['pre', 'post'] },
    'How do you choose precedent transactions?',
    [
      ['Deals for similar targets (industry, size, business model), usually within the last 3–5 years and under comparable market conditions', 'Relevance and recency matter most; old deals reflect different markets.', true],
      ['Every deal the acquirer has ever done', 'The acquirer’s history isn’t the screen; the target’s profile is.'],
      ['Only the largest deals in the market', 'Size should be comparable to the target.'],
      ['Deals in any industry from the last year', 'Industry relevance comes first.'],
    ],
    'Screen on target similarity and timing.',
  ),
  mcq(
    { id: 'co-q-020', subtopic: 'precedents', difficulty: 'intermediate', pools: ['post'] },
    'Which multiples are most common in a precedent transactions analysis?',
    [
      ['Transaction EV / LTM EBITDA and EV / LTM revenue, plus premiums paid for public targets', 'They use the deal value over the target’s trailing metrics at announcement.', true],
      ['Forward P/E only', 'Forward estimates are often unavailable for deal targets.'],
      ['Price / book value only', 'Only relevant for financial institutions.'],
      ['Dividend yield', 'Not a deal metric.'],
    ],
    'LTM-based EV multiples dominate because the data is reliably available.',
  ),
  mcq(
    { id: 'co-q-021', subtopic: 'precedents', difficulty: 'intermediate', pools: ['post', 'mock'] },
    'Why do precedent transactions usually use LTM rather than forward metrics?',
    [
      ['Forward projections at the time of a deal are often not disclosed, while LTM results are reliably reported', 'Consistency and availability drive the choice.', true],
      ['Forward metrics are always lower', 'Not necessarily.'],
      ['Buyers only care about the past', 'Buyers care about the future, but the disclosed data is historical.'],
      ['LTM includes synergies', 'LTM is the target’s standalone historical result.'],
    ],
    'Use what you can source consistently.',
  ),
  num(
    { id: 'co-q-022', subtopic: 'precedents', difficulty: 'intermediate', pools: ['post', 'mock'], followUps: ['co-q-026'] },
    'The target’s LTM EBITDA is $120 and the median precedent multiple is 10.5x EV/LTM EBITDA. What is the implied enterprise value?',
    1260,
    ['EV = 10.5 × 120 = 1,260'],
    'Apply the multiple range to the target’s matching metric.',
  ),
  num(
    { id: 'co-q-026', subtopic: 'precedents', difficulty: 'advanced', pools: ['mock'] },
    'In a precedent deal, the buyer paid $50 per share for 40 million diluted target shares. The target had $600 of debt and $100 of cash, and LTM EBITDA of $250. What was the transaction EV/LTM EBITDA multiple?',
    10,
    ['Equity purchase price = 50 × 40 = 2,000', 'Transaction EV = 2,000 + 600 − 100 = 2,500', 'Multiple = 2,500 / 250 = 10.0x'],
    'Transaction value = equity purchase price + net debt assumed.',
    { unit: 'x', tolerance: { kind: 'abs', value: 0.05 } },
  ),
  mcq(
    { id: 'co-q-025', subtopic: 'precedents', difficulty: 'intermediate', pools: ['post'] },
    'What is “transaction value” (purchase enterprise value) in an acquisition?',
    [
      ['The equity purchase price plus the net debt the buyer assumes or refinances', 'It’s the deal-level equivalent of enterprise value.', true],
      ['The equity purchase price only', 'That ignores the debt the buyer takes on.'],
      ['The target’s book value of assets', 'Deal value is a market price, not book value.'],
      ['The premium paid over the share price', 'The premium is one component, not the whole value.'],
    ],
    'Use transaction value with EBITDA; equity purchase price with net income.',
  ),
  mcq(
    { id: 'co-q-023', subtopic: 'precedents', difficulty: 'advanced', pools: ['mock'] },
    'Where would you find the data for precedent transactions?',
    [
      ['Merger proxies and other SEC filings, press releases and fairness opinions, plus databases such as Capital IQ, PitchBook, LSEG (Refinitiv) and Mergermarket', 'Public-target deals disclose the most; private deals often need databases and estimates.', true],
      ['Only the acquirer’s annual report', 'That rarely includes the target’s multiples.'],
      ['Social media', 'Not a reliable source.'],
      ['Stock exchange price feeds', 'Prices help for premiums, but not for deal terms and target financials.'],
    ],
    'Filings first, databases to fill gaps.',
  ),
  mcq(
    { id: 'co-q-024', subtopic: 'precedents', difficulty: 'advanced', pools: ['mock'] },
    'A key precedent was struck in 2021 at 18x EBITDA. How should you think about it today?',
    [
      ['In context: rates and valuations were very different, so give it less weight or exclude it, and explain why', 'Precedents are only as relevant as the market conditions they reflect.', true],
      ['Treat it the same as any recent deal', 'Market conditions have changed materially.'],
      ['Use it as the floor of your range', 'A peak-market multiple is a poor floor.'],
      ['Adjust it up for inflation', 'Multiples aren’t inflation-adjusted.'],
    ],
    'Old deals need context.',
  ),
  mcq(
    { id: 'co-q-027', subtopic: 'precedents', difficulty: 'elite', pools: ['mock'] },
    'Precedent multiples are calculated on the target’s standalone EBITDA. Why does that matter when you apply them to a new target?',
    [
      ['Buyers may have paid for synergies, so the multiples embed them; a target with fewer synergy opportunities may not justify the same multiple', 'A strategic deal with large cost synergies can show a high standalone multiple that isn’t transferable.', true],
      ['It doesn’t matter: synergies are excluded from precedents', 'They’re excluded from the denominator but reflected in the price paid.'],
      ['It means precedents always understate value', 'They often overstate it for buyers without the same synergies.'],
      ['Synergies are already deducted from the purchase price', 'Purchase price isn’t adjusted for synergies.'],
    ],
    'Ask who the buyer was and what synergies it expected.',
  ),
  mcq(
    { id: 'co-q-045', subtopic: 'precedents', difficulty: 'elite', pools: ['mock'] },
    'Trading comps imply $30–40 per share, but precedents imply only $28–34. The unaffected price is $32. What is the most plausible explanation?',
    [
      ['The precedents come from a weaker market or lower-growth targets, or the sector has re-rated upward since those deals', 'Precedents normally exceed comps because of control premiums; when they don’t, the data is usually stale or not comparable.', true],
      ['Control premiums are negative in this sector', 'Buyers don’t systematically pay below market for control.'],
      ['The comps must be calculated wrong', 'Possible, but timing and comparability are the usual causes.'],
      ['Precedents always come out below comps', 'Usually it’s the reverse.'],
    ],
    'When the normal ordering flips, look at timing and comparability first.',
  ),

  // ── Control premium ──
  mcq(
    { id: 'co-q-028', subtopic: 'control-premium', difficulty: 'basic', pools: ['pre', 'post'] },
    'What is a control premium?',
    [
      ['The amount above the unaffected market price that a buyer pays to acquire control of a company', 'Public shares trade as minority stakes; control is worth more.', true],
      ['A fee paid to the investment bank', 'That’s an advisory fee.'],
      ['The difference between book value and market value', 'That’s the market-to-book gap.'],
      ['A discount for buying a minority stake', 'That’s the opposite concept.'],
    ],
    'Premium = offer / unaffected price − 1.',
  ),
  num(
    { id: 'co-q-029', subtopic: 'control-premium', difficulty: 'basic', pools: ['pre', 'post', 'mock'], followUps: ['co-q-031', 'co-q-034'] },
    'A target’s unaffected share price is $20 and the offer is $26. What is the premium (in %)?',
    30,
    ['Premium = 26 / 20 − 1 = 0.30 = 30%'],
    'Always measure against the unaffected price.',
    { unit: '%', tolerance: { kind: 'abs', value: 0.1 } },
  ),
  num(
    { id: 'co-q-030', subtopic: 'control-premium', difficulty: 'intermediate', pools: ['post', 'mock'] },
    'The unaffected share price is $40 and comparable deals paid a median premium of 25%. What offer price does that imply?',
    50,
    ['Offer = 40 × 1.25 = 50'],
    'Premiums-paid analysis: unaffected price × (1 + premium).',
  ),
  mcq(
    { id: 'co-q-031', subtopic: 'control-premium', difficulty: 'intermediate', pools: ['post', 'mock'] },
    'Why measure premiums against the “unaffected” share price?',
    [
      ['Rumors and leaks often push the price up before announcement; using the inflated price would understate the true premium', 'The unaffected date is typically the day before rumors or the announcement.', true],
      ['Because the unaffected price is always the 52-week low', 'It’s the last undisturbed price, not the low.'],
      ['Regulators define the unaffected price as the IPO price', 'No such definition.'],
      ['To make the premium look smaller', 'It does the opposite: it shows the full premium.'],
    ],
    'Use the last price before deal news moved the stock.',
  ),
  mcq(
    { id: 'co-q-032', subtopic: 'control-premium', difficulty: 'advanced', pools: ['mock'] },
    'Roughly what range have control premiums for US public targets historically fallen in?',
    [
      ['Roughly 20–40% on average, with wide variation by deal and market', 'Premiums depend on competition, synergies, and how the stock was trading.', true],
      ['1–5%', 'Far too low to persuade shareholders to sell.'],
      ['100–200% on average', 'Some deals are high, but not the norm.'],
      ['Always exactly 30%, by convention', 'There’s no fixed premium.'],
    ],
    'Know the typical range, then explain why a specific deal sits above or below it.',
  ),
  mcq(
    { id: 'co-q-033', subtopic: 'control-premium', difficulty: 'advanced', pools: ['mock'] },
    'Why do buyers pay a control premium?',
    [
      ['Control lets them direct strategy and cash flows and capture synergies, and shareholders won’t sell without a reason to', 'Without a premium, holders would just keep their shares.', true],
      ['Because the law requires a 30% premium', 'There is no legal minimum.'],
      ['To compensate the target’s bankers', 'Advisory fees are separate.'],
      ['Because public markets always undervalue companies', 'Not always; control and synergies are the main reasons.'],
    ],
    'Control + synergies + the need to persuade sellers.',
  ),
  num(
    { id: 'co-q-034', subtopic: 'control-premium', difficulty: 'advanced', pools: ['mock'] },
    'A target’s 30-day volume-weighted average price (VWAP) before the deal was $42. The offer is $50.40. What is the premium to the 30-day VWAP (in %)?',
    20,
    ['Premium = 50.40 / 42 − 1 = 0.20 = 20%'],
    'Bankers show premiums to several reference prices: 1-day, 30-day VWAP, 52-week high.',
    { unit: '%', tolerance: { kind: 'abs', value: 0.1 } },
  ),

  // ── Ordering, verbal, rapid ──
  order(
    { id: 'co-q-035', subtopic: 'precedents', difficulty: 'basic', pools: ['pre'] },
    'Put the steps of a precedent transactions analysis in order.',
    [
      'Define the screening criteria (sector, size, date range)',
      'Screen databases and filings for relevant deals',
      'Gather deal terms and target financials at announcement',
      'Calculate transaction multiples and premiums paid',
      'Apply a range of multiples to the target’s LTM metrics',
    ],
    'Criteria → screen → data → multiples → apply.',
  ),
  free(
    { id: 'co-q-037', subtopic: 'peer-selection', difficulty: 'basic', pools: ['mock'], followUps: ['co-q-003', 'co-q-012'] },
    'Walk me through how you would build a trading comps analysis.',
    [
      ['peers', 'Select peers by industry, business model, size, growth and margins', [['peer*|comparable*', 'industry|sector|size|business model']]],
      ['data', 'Gather financials and consensus estimates; normalize for one-offs and calendarize', [['filings|estimates|consensus|10 k|10k|financials', 'normaliz*|non recurring|one off|calendariz*']]],
      ['multiples', 'Calculate EV and equity value and multiples like EV/EBITDA and P/E, LTM and forward', [['ev ebitda|ev/ebitda|p e|p/e|multiples']]],
      ['apply', 'Apply the median and quartile range to the target’s metrics to get an implied value range', [['median|quartile|range', 'target|implied']]],
    ],
    'First, I’d pick a peer group of companies with a similar business model and industry, then refine by size, growth and margins. Next, I’d gather their financials from filings and consensus estimates, normalize for one-off items and calendarize everyone to the same periods. Then I’d calculate equity value and enterprise value for each peer and the multiples, such as EV/EBITDA and P/E, on an LTM and forward basis. Finally, I’d take the median and the 25th to 75th percentile range and apply it to the target’s metrics to get an implied valuation range.',
    'Peers → data → multiples → apply.',
  ),
  free(
    { id: 'co-q-038', subtopic: 'precedents', difficulty: 'intermediate', pools: ['mock'], followUps: ['co-q-024', 'co-q-027'] },
    'How are precedent transactions different from trading comps?',
    [
      ['control', 'Precedents include a control premium; comps reflect minority trading prices', [['control']]],
      ['timing', 'Precedents are historical deals; comps reflect today’s market', [['historical|past|old|dated|today|current']]],
      ['metrics', 'Precedents usually use LTM metrics; comps use LTM and forward', [['ltm|trailing|forward|ntm']]],
      ['limits', 'Precedents have fewer data points, less disclosure and deal-specific factors like synergies', [['synerg*|disclos*|fewer|deal specific']]],
    ],
    'Trading comps show what minority stakes in similar companies are worth in today’s market. Precedent transactions show what buyers actually paid to acquire similar companies, so they include a control premium and often expected synergies. Precedents are historical, so market conditions may have changed, and they usually rely on LTM metrics because forward projections aren’t disclosed. There are also fewer data points and less disclosure, so they need more judgment.',
    'Control premium and timing are the key differences.',
    45,
  ),
  rapid(
    { id: 'co-q-040', subtopic: 'spreading', difficulty: 'basic', pools: ['post', 'mock'] },
    'EV is $2,400 and EBITDA is $300. What is EV/EBITDA?',
    8,
    '2,400 / 300 = 8.0x.',
    { unit: 'x' },
  ),
  rapid(
    { id: 'co-q-041', subtopic: 'control-premium', difficulty: 'intermediate', pools: ['post'] },
    'The unaffected price is $30. What is the offer price at a 30% premium?',
    39,
    '30 × 1.3 = 39.',
  ),
  rapid(
    { id: 'co-q-042', subtopic: 'spreading', difficulty: 'basic', pools: ['pre'] },
    'Peers trade at a median 9x EV/EBITDA and the target’s EBITDA is $50. What is the implied EV?',
    450,
    '9 × 50 = 450.',
  ),
];
