import type { Question } from '../../../types/questions';
import { builders } from '../../helpers';

const { mcq, num, rapid, order, free } = builders('valuation');

export const questions: Question[] = [
  // ── Methodologies ──
  mcq(
    { id: 'val-q-001', subtopic: 'methodologies', difficulty: 'basic', pools: ['pre', 'post'] },
    'What are the main methodologies bankers use to value a company?',
    [
      ['Trading comparables, precedent transactions and a DCF, often with an LBO analysis', 'Two relative methods (what similar companies trade or sell for), one intrinsic method (cash flows) and, where sponsors may buy, what a PE firm could pay.', true],
      ['Book value, replacement cost and liquidation value only', 'These are used in special cases (banks, distressed, asset-heavy), not as the standard toolkit.'],
      ['P/E and dividend yield only', 'These are single multiples, not complete methodologies.'],
      ['Revenue growth and margin analysis', 'Those are inputs to valuation, not methodologies.'],
    ],
    'Comps, precedents, DCF and LBO are the standard four.',
  ),
  mcq(
    { id: 'val-q-002', subtopic: 'methodologies', difficulty: 'basic', pools: ['pre', 'post'] },
    'Which valuation methodology is “intrinsic” rather than “relative”?',
    [
      ['Discounted cash flow (DCF)', 'A DCF values the company on its own projected cash flows and cost of capital, not on what other companies are worth.', true],
      ['Trading comparables', 'Comps value a company relative to how similar public companies trade.'],
      ['Precedent transactions', 'Precedents value a company relative to what buyers paid for similar companies.'],
      ['EV/EBITDA multiple', 'A multiple is a relative measure.'],
    ],
    'Intrinsic = based on the company’s own cash flows.',
  ),
  mcq(
    { id: 'val-q-041', subtopic: 'methodologies', difficulty: 'basic', pools: ['pre', 'post'] },
    'Which methodology values a company based on what buyers have paid for similar companies?',
    [
      ['Precedent transactions', 'Precedents use multiples from past M&A deals, which include a control premium.', true],
      ['Trading comparables', 'Comps use current public trading multiples (minority, non-control stakes).'],
      ['DCF', 'A DCF uses the company’s own cash flows.'],
      ['LBO analysis', 'An LBO asks what a financial sponsor could pay to hit a target return.'],
    ],
    'Precedents = past deals.',
  ),
  mcq(
    { id: 'val-q-008', subtopic: 'methodologies', difficulty: 'basic', pools: ['pre', 'post'] },
    'What is the main drawback of trading comparables?',
    [
      ['No two companies are truly comparable, and market prices can be distorted by sentiment or thin trading', 'Comps are only as good as the peer set and the market’s current mood.', true],
      ['They are based on stale historical data', 'Comps use current prices and recent or forward estimates; staleness is a problem for precedents.'],
      ['They include a control premium', 'Trading prices reflect minority stakes; precedents include a control premium.'],
      ['They require a long-term cash flow projection', 'That is a DCF drawback.'],
    ],
    'Comps: current and market-based, but sensitive to peer selection and market swings.',
  ),
  mcq(
    { id: 'val-q-009', subtopic: 'methodologies', difficulty: 'intermediate', pools: ['post'] },
    'What is the main drawback of precedent transactions?',
    [
      ['Deals can be old, reflect different market conditions, and include deal-specific synergies and premiums; disclosure is often limited', 'A 2021 multiple may tell you little about a deal in a different rate environment.', true],
      ['They exclude control premiums', 'They include them; that is why they often come out highest.'],
      ['They can only be used for public targets', 'Private-target deals are included when terms are disclosed.'],
      ['They ignore the target’s financial performance', 'Multiples are applied to the target’s metrics.'],
    ],
    'Precedents are backward-looking and deal-specific.',
  ),
  mcq(
    { id: 'val-q-010', subtopic: 'methodologies', difficulty: 'intermediate', pools: ['post'] },
    'What is the biggest weakness of a DCF?',
    [
      ['It is highly sensitive to assumptions, especially the discount rate and terminal value, which is often well over half of the total value', 'Small changes in WACC or terminal growth can swing the answer widely.', true],
      ['It ignores the company’s own cash flows', 'Cash flows are exactly what it values.'],
      ['It can’t be used for private companies', 'DCFs are common for private companies.'],
      ['It always gives the lowest value', 'There is no fixed ranking; it depends on assumptions.'],
    ],
    'A DCF is only as good as its inputs; that’s why bankers show sensitivity tables.',
  ),
  mcq(
    { id: 'val-q-007', subtopic: 'methodologies', difficulty: 'advanced', pools: ['mock'] },
    'Why is an LBO analysis often described as setting a “floor” valuation?',
    [
      ['It shows the most a financial sponsor could pay and still hit its target return; strategic buyers with synergies can usually pay more', 'If a sponsor would pay $X, a seller shouldn’t accept less, which puts a floor under the price in a sale process.', true],
      ['Because LBOs always value companies at book value', 'LBO value depends on cash flows, leverage and exit assumptions, not book value.'],
      ['Because private equity firms never overpay', 'They can and do; the point is about the target return constraint.'],
      ['Because it ignores debt', 'Debt is central to an LBO.'],
    ],
    'LBO value = price a sponsor can pay at its required IRR.',
  ),
  mcq(
    { id: 'val-q-034', subtopic: 'methodologies', difficulty: 'intermediate', pools: ['post'] },
    'When would you use a sum-of-the-parts (SOTP) valuation?',
    [
      ['For a company with distinct business segments that peers value very differently, such as a conglomerate', 'Valuing each segment with its own multiples, then adding them up, avoids applying one blended multiple to unlike businesses.', true],
      ['For any single-product company', 'A single business is valued as a whole.'],
      ['Only for distressed companies', 'SOTP is about mix of businesses, not distress.'],
      ['When the company has no debt', 'Capital structure is irrelevant to whether SOTP fits.'],
    ],
    'SOTP is common for conglomerates and in activist or break-up situations.',
  ),
  num(
    { id: 'val-q-035', subtopic: 'methodologies', difficulty: 'intermediate', pools: ['post', 'mock'] },
    'A company has two segments: Segment A with $50 of EBITDA (peers trade at 10x) and Segment B with $30 of EBITDA (peers at 6x). Net debt is $200. What is the implied equity value?',
    480,
    ['Segment A: 50 × 10 = 500', 'Segment B: 30 × 6 = 180', 'EV = 680; equity value = 680 − 200 = 480'],
    'Value each part with its own multiple, then bridge to equity value once.',
  ),
  order(
    { id: 'val-q-019', subtopic: 'methodologies', difficulty: 'intermediate', pools: ['post'] },
    'Put the steps of a trading comparables analysis in order.',
    [
      'Select the peer group',
      'Gather financial data (filings and consensus estimates)',
      'Spread the financials and adjust for non-recurring items',
      'Calculate valuation multiples for each peer',
      'Apply a range of peer multiples to the target’s metrics',
    ],
    'Peers → data → normalize → multiples → apply.',
  ),

  // ── Football field ──
  mcq(
    { id: 'val-q-003', subtopic: 'football-field', difficulty: 'intermediate', pools: ['pre', 'post'] },
    'On a football field for a healthy company being sold, which methodology usually shows the highest values?',
    [
      ['Precedent transactions', 'Deal multiples include a control premium and often expected synergies.', true],
      ['Trading comparables', 'Trading prices reflect minority, non-control stakes, so they usually sit below precedents.'],
      ['52-week trading range', 'The trading range reflects unaffected market prices without a premium.'],
      ['LBO analysis', 'An LBO is usually the floor: sponsors can’t pay for synergies.'],
    ],
    'Precedents > comps because buyers pay for control.',
  ),
  num(
    { id: 'val-q-012', subtopic: 'football-field', difficulty: 'intermediate', pools: ['post', 'mock'], followUps: ['val-q-038'] },
    'EBITDA is $150 and you apply an 8.0x multiple. Net debt is $400 and there are 40 diluted shares. What is the implied share price?',
    20,
    ['EV = 8 × 150 = 1,200', 'Equity value = 1,200 − 400 = 800', 'Share price = 800 / 40 = 20'],
    'Multiple → EV → equity value → per share.',
  ),
  num(
    { id: 'val-q-013', subtopic: 'football-field', difficulty: 'intermediate', pools: ['post'] },
    'A target’s unaffected share price is $25 and the offer is $32. What is the control premium (in %)?',
    28,
    ['Premium = 32 / 25 − 1 = 0.28 = 28%'],
    'Premium = offer / unaffected price − 1. Always use the unaffected price, before deal rumors.',
    { unit: '%', tolerance: { kind: 'abs', value: 0.1 } },
  ),
  num(
    { id: 'val-q-038', subtopic: 'football-field', difficulty: 'advanced', pools: ['mock'] },
    'Peers trade at 7.0x–9.0x EV/EBITDA (25th to 75th percentile). The target’s EBITDA is $250, net debt $750 and diluted shares 100. What is the high end of the implied share price range?',
    15,
    ['High EV = 9 × 250 = 2,250', 'Equity value = 2,250 − 750 = 1,500', 'Per share = 1,500 / 100 = 15.00 (the low end is (1,750 − 750) / 100 = 10.00)'],
    'Leverage magnifies the range: a 29% spread in multiples becomes a 50% spread in share price.',
  ),
  mcq(
    { id: 'val-q-030', subtopic: 'football-field', difficulty: 'advanced', pools: ['mock'] },
    'Why do football fields often include the 52-week trading range and analyst price targets?',
    [
      ['They are market reference points, not valuation methodologies: they give context for the premium an offer represents', 'A board wants to see an offer relative to where the stock has actually traded and where analysts think it is going.', true],
      ['Because they are the most accurate valuation methods', 'They aren’t valuation methodologies at all.'],
      ['Because regulators require them', 'They are customary, not legally required.'],
      ['To replace the DCF when projections are unavailable', 'They complement methodologies; they don’t replace them.'],
    ],
    'Separate “what is it worth” (methodologies) from “where has it traded” (reference points).',
  ),
  mcq(
    { id: 'val-q-031', subtopic: 'football-field', difficulty: 'intermediate', pools: ['post'] },
    'A football field shows comps at $18–24, precedents at $22–30 and a DCF at $20–28. The offer is $26. What is the most reasonable takeaway?',
    [
      ['The offer is within the precedent and DCF ranges and above the entire comps range, so it looks supportable', 'An offer that sits in the precedent and intrinsic ranges is the classic basis for a fairness view.', true],
      ['The offer is too low because it is below the top of precedents', 'Being below the top of a range doesn’t make an offer inadequate.'],
      ['The offer is too high because it is above the comps midpoint', 'A premium to trading value is expected in a change of control.'],
      ['No conclusion is possible without an LBO', 'An LBO adds a view, but the field already supports a conclusion.'],
    ],
    'Read a football field by where the offer sits relative to each bar.',
  ),
  mcq(
    { id: 'val-q-042', subtopic: 'football-field', difficulty: 'intermediate', pools: ['pre', 'post'] },
    'Why do bankers present valuation as ranges rather than single numbers?',
    [
      ['Every methodology depends on uncertain assumptions (peer multiples, WACC, growth), so a range is more honest and more useful', 'Ranges show where reasonable assumptions lead, and where methods overlap.', true],
      ['Because single numbers are prohibited', 'Nothing prohibits them; they are just misleading.'],
      ['To make the company look more valuable', 'Ranges include low ends too.'],
      ['Because ranges are easier to calculate', 'They take more work, not less.'],
    ],
    'Valuation is a range of reasonable outcomes, not a point.',
  ),
  order(
    { id: 'val-q-018', subtopic: 'football-field', difficulty: 'basic', pools: ['pre'] },
    'Put the steps of building a football field in order.',
    [
      'Choose the methodologies that fit the company',
      'Gather inputs: peer set, precedent deals, projections',
      'Calculate an implied value range for each methodology',
      'Convert each range to implied equity value and share price',
      'Plot the ranges and compare them to the current or offer price',
    ],
    'Method selection → inputs → ranges → per-share → plot and compare.',
  ),

  // ── When to use what ──
  mcq(
    { id: 'val-q-004', subtopic: 'when-to-use', difficulty: 'intermediate', pools: ['post'] },
    'Which multiples are most commonly used to value a bank?',
    [
      ['P/E and price-to-book (P/BV or P/TBV)', 'For banks, debt and deposits are raw material, not financing, so equity-value multiples are used.', true],
      ['EV/EBITDA and EV/Revenue', 'EV and EBITDA aren’t meaningful when interest is an operating cost.'],
      ['EV/EBITDAR', 'That is for lease-heavy businesses like airlines and retailers.'],
      ['EV/Reserves', 'That is for oil and gas producers.'],
    ],
    'Financial institutions: equity value multiples and dividend discount models.',
  ),
  mcq(
    { id: 'val-q-037', subtopic: 'when-to-use', difficulty: 'intermediate', pools: ['mock'] },
    'Why can’t you meaningfully use EV/EBITDA for a bank?',
    [
      ['Interest is a bank’s main operating cost and debt is its raw material, so separating “operations” from “financing” doesn’t work', 'A bank borrows (deposits) to lend; stripping out interest strips out the business.', true],
      ['Banks don’t have EBITDA because they don’t have revenue', 'Banks have revenue (net interest income and fees); the issue is what interest represents.'],
      ['Banks are not allowed to have debt', 'Banks have enormous liabilities.'],
      ['EV/EBITDA is only used for technology companies', 'It is used across most industries.'],
    ],
    'For banks, interest is operating.',
  ),
  mcq(
    { id: 'val-q-005', subtopic: 'when-to-use', difficulty: 'intermediate', pools: ['post', 'mock'] },
    'Which approach is most common for valuing a clinical-stage biotech with no revenue?',
    [
      ['A risk-adjusted NPV (probability-weighted DCF) of the drug pipeline', 'Each drug’s cash flows are weighted by its probability of approval at each trial phase.', true],
      ['EV/EBITDA comps', 'EBITDA is negative, so the multiple is meaningless.'],
      ['P/E', 'There are no earnings.'],
      ['A dividend discount model', 'A pre-revenue biotech pays no dividends.'],
    ],
    'No earnings → value the pipeline directly, weighted by approval odds.',
  ),
  mcq(
    { id: 'val-q-006', subtopic: 'when-to-use', difficulty: 'intermediate', pools: ['post'] },
    'Why can a DCF be misleading for a highly cyclical company?',
    [
      ['Cash flows swing with the cycle, and the terminal value depends heavily on where in the cycle the projection ends', 'Ending at a peak inflates terminal value; ending at a trough depresses it. Use normalized, mid-cycle figures.', true],
      ['Because cyclical companies don’t have cash flows', 'They do; they’re just volatile.'],
      ['Because WACC can’t be calculated for cyclicals', 'It can; it is just one input among many.'],
      ['Because cyclical companies can’t be compared', 'They can be compared, ideally on normalized metrics.'],
    ],
    'Normalize to mid-cycle before projecting.',
  ),
  mcq(
    { id: 'val-q-023', subtopic: 'when-to-use', difficulty: 'intermediate', pools: ['post'] },
    'Which metrics are standard for valuing a REIT?',
    [
      ['Price to funds from operations (P/FFO or P/AFFO) and net asset value (NAV)', 'FFO adds back real estate depreciation, which overstates economic cost for property that often appreciates.', true],
      ['EV/Revenue', 'Revenue multiples ignore property-level profitability.'],
      ['P/E', 'Net income is depressed by large depreciation on real estate, so P/E misleads.'],
      ['EV/Users', 'That is for consumer internet companies.'],
    ],
    'REITs: FFO / AFFO and NAV.',
  ),
  mcq(
    { id: 'val-q-024', subtopic: 'when-to-use', difficulty: 'intermediate', pools: ['post'] },
    'Which metric is often used for oil and gas exploration and production companies?',
    [
      ['EV/EBITDAX, along with NAV and EV per unit of proved reserves', 'EBITDAX also adds back exploration expense, so companies using different accounting methods are comparable.', true],
      ['P/BV', 'Book value says little about reserves’ economic value.'],
      ['EV/Subscribers', 'That is for telecom and media.'],
      ['Price / funds from operations', 'That is for REITs.'],
    ],
    'Industry-specific metrics exist because standard ones miss what drives value.',
  ),
  mcq(
    { id: 'val-q-025', subtopic: 'when-to-use', difficulty: 'basic', pools: ['pre', 'post'] },
    'A company is being sold in an auction with both strategic and private equity bidders. Which analyses best indicate the likely price?',
    [
      ['Precedent transactions, plus an LBO analysis for what sponsors can pay', 'Precedents show what buyers have paid for control; the LBO shows the sponsor bid.', true],
      ['Trading comps only', 'Comps reflect minority values and miss the control premium.'],
      ['The 52-week trading range only', 'That shows past market prices, not what a buyer will pay.'],
      ['Book value', 'Book value rarely reflects what buyers pay.'],
    ],
    'In a sale process, control value and sponsor capacity matter most.',
  ),
  mcq(
    { id: 'val-q-039', subtopic: 'when-to-use', difficulty: 'advanced', pools: ['mock'] },
    'A company has negative net income but positive EBITDA. Which multiple is most useful?',
    [
      ['EV/EBITDA', 'EBITDA is positive, so the multiple is meaningful; P/E isn’t.', true],
      ['P/E', 'A negative P/E has no useful interpretation.'],
      ['Dividend yield', 'A loss-making company likely pays no dividend.'],
      ['PEG ratio', 'The PEG ratio requires positive earnings.'],
    ],
    'Move up the income statement until the metric is positive and meaningful.',
  ),
  num(
    { id: 'val-q-029', subtopic: 'when-to-use', difficulty: 'elite', pools: ['mock'] },
    'A sponsor targets a 20% IRR over 5 years (about 2.49x money). EBITDA is $100 today and will be $130 in year 5. The sponsor can borrow 5.0x EBITDA ($500) and expects to pay it down to $300 by exit. It expects to exit at 8.0x. What is the maximum entry enterprise value it can pay?',
    797.4,
    [
      'Exit EV = 8.0 × 130 = 1,040; exit equity = 1,040 − 300 = 740',
      'Required multiple: 1.2^5 = 2.488',
      'Max equity today = 740 / 2.488 = 297.4',
      'Max entry EV = 297.4 + 500 debt = 797.4 (about 8.0x EBITDA)',
    ],
    'Work backwards from the exit: that is the LBO “floor” a seller can count on.',
    { tolerance: { kind: 'pct', value: 1 } },
  ),

  // ── Multiples intuition ──
  num(
    { id: 'val-q-011', subtopic: 'multiples-intuition', difficulty: 'basic', pools: ['pre', 'post'] },
    'EBITDA is $80 and comparable companies trade at 10.0x EV/EBITDA. What is the implied enterprise value?',
    800,
    ['EV = 10 × 80 = 800'],
    'Multiple × metric = value.',
  ),
  num(
    { id: 'val-q-043', subtopic: 'multiples-intuition', difficulty: 'basic', pools: ['pre'] },
    'Revenue is $400 and peers trade at 3.0x EV/Revenue. What is the implied enterprise value?',
    1200,
    ['EV = 3 × 400 = 1,200'],
    'Revenue multiples are applied the same way.',
  ),
  num(
    { id: 'val-q-014', subtopic: 'multiples-intuition', difficulty: 'advanced', pools: ['mock'] },
    'A mature company pays out 50% of earnings, its cost of equity is 9% and it grows 4% a year forever. Using the Gordon growth model, what is its forward P/E?',
    10,
    ['Forward P/E = payout ratio / (cost of equity − growth)', '= 0.50 / (0.09 − 0.04) = 0.50 / 0.05 = 10x'],
    'The formula shows why multiples rise with growth and payout, and fall with risk (cost of equity).',
    { unit: 'x', tolerance: { kind: 'abs', value: 0.05 } },
  ),
  mcq(
    { id: 'val-q-015', subtopic: 'multiples-intuition', difficulty: 'intermediate', pools: ['post', 'mock'], followUps: ['val-q-032', 'val-q-040'] },
    'Companies A and B have the same EBITDA. A trades at 12x and B at 8x. What is the most likely explanation?',
    [
      ['A is expected to grow faster, has higher margins or returns, or is seen as less risky', 'Multiples price in the future: growth, profitability and risk.', true],
      ['A has more debt', 'Leverage doesn’t directly raise EV/EBITDA: EV already includes debt.'],
      ['A has more cash', 'Cash is subtracted to get EV, so it doesn’t inflate EV/EBITDA.'],
      ['A reports in a different currency', 'Multiples are unitless; currency doesn’t change them.'],
    ],
    'Higher multiple = more expected future cash flow per dollar of today’s EBITDA, or less risk.',
  ),
  mcq(
    { id: 'val-q-032', subtopic: 'multiples-intuition', difficulty: 'elite', pools: ['mock'] },
    'Two companies have identical EBITDA and growth, but Company A needs far more capital expenditure to sustain that growth. Which should trade at the higher EV/EBITDA multiple?',
    [
      ['Company B, the one with lower capex', 'Lower reinvestment means more free cash flow from the same EBITDA, and value comes from free cash flow.', true],
      ['Company A, because capex signals investment in growth', 'The growth is identical, so A is just less efficient at producing it.'],
      ['They should trade at the same multiple', 'EBITDA ignores capex; the market doesn’t.'],
      ['It depends only on their debt levels', 'Capex intensity, not leverage, is the difference here.'],
    ],
    'EBITDA is not cash flow. Capital intensity is why EV/EBITDA varies across sectors.',
  ),
  mcq(
    { id: 'val-q-016', subtopic: 'multiples-intuition', difficulty: 'advanced', pools: ['mock'] },
    'A company borrows to buy back stock. Ignoring any market reaction, what happens to its EV/EBITDA multiple?',
    [
      ['Nothing: EV and EBITDA are both unchanged', 'Debt +X and equity −X offset in EV; EBITDA is before interest.', true],
      ['It rises because debt increased', 'Debt rose but equity value fell by the same amount.'],
      ['It falls because there are fewer shares', 'Share count doesn’t enter EV/EBITDA directly.'],
      ['It rises because EBITDA falls with higher interest', 'Interest is below EBITDA.'],
    ],
    'EV/EBITDA is capital-structure neutral.',
  ),
  mcq(
    { id: 'val-q-033', subtopic: 'multiples-intuition', difficulty: 'advanced', pools: ['mock'] },
    'Interest rates rise sharply. All else equal, what happens to valuation multiples, and which companies are usually hit hardest?',
    [
      ['Multiples compress because discount rates rise; long-duration companies whose cash flows are far in the future (high-growth, unprofitable) are hit hardest', 'Higher rates cut the present value of distant cash flows the most.', true],
      ['Multiples expand because companies earn more on their cash', 'Higher interest income is small next to the effect of higher discount rates.'],
      ['Only bank multiples change', 'Rates affect the discount rate for every company.'],
      ['Mature, steady dividend payers fall the most', 'They are usually hit less than long-duration growth stocks.'],
    ],
    'Think of growth stocks as long-duration bonds.',
  ),
  mcq(
    { id: 'val-q-036', subtopic: 'multiples-intuition', difficulty: 'basic', pools: ['pre'] },
    'What does a high P/E multiple usually indicate?',
    [
      ['The market expects strong earnings growth or sees the company as low-risk', 'Investors pay more per dollar of current earnings when they expect more earnings later.', true],
      ['The company is unprofitable', 'Unprofitable companies don’t have a meaningful P/E.'],
      ['The company has a lot of cash', 'Cash can affect P/E slightly, but growth and risk drive it.'],
      ['The stock is definitely overvalued', 'High P/E can be justified by growth.'],
    ],
    'P/E reflects expected growth and risk.',
  ),
  rapid(
    { id: 'val-q-026', subtopic: 'multiples-intuition', difficulty: 'basic', pools: ['post', 'mock'] },
    'Enterprise value is $900 and EBITDA is $100. What is EV/EBITDA?',
    9,
    '900 / 100 = 9.0x.',
    { unit: 'x' },
  ),
  rapid(
    { id: 'val-q-027', subtopic: 'football-field', difficulty: 'basic', pools: ['pre'] },
    'The share price is $40. What is the offer price at a 25% premium?',
    50,
    '40 × 1.25 = 50.',
  ),
  rapid(
    { id: 'val-q-028', subtopic: 'multiples-intuition', difficulty: 'intermediate', pools: ['post'] },
    'P/E is 15x and EPS is $3. What is the share price?',
    45,
    '15 × 3 = 45.',
  ),

  // ── Verbal ──
  free(
    { id: 'val-q-020', subtopic: 'methodologies', difficulty: 'basic', pools: ['mock'], followUps: ['val-q-022', 'val-q-007'] },
    'Walk me through the main ways to value a company.',
    [
      ['comps', 'Trading comps: value relative to how similar public companies trade (multiples)', [['comparable|comps|trading']]],
      ['precedents', 'Precedent transactions: multiples paid in past acquisitions, including a control premium', [['precedent*|past transactions|past deals|acquisitions']]],
      ['dcf', 'DCF: intrinsic value from the present value of projected free cash flows', [['dcf|discounted cash flow']]],
      ['lbo', 'LBO analysis (what a sponsor could pay), and a football field to compare ranges', [['lbo|leveraged buyout|private equity|sponsor'], ['football field']]],
      ['relative', 'Distinguishes relative (comps, precedents) from intrinsic (DCF) methods', [['relative'], ['intrinsic']]],
    ],
    'There are two broad approaches: relative and intrinsic. Relative valuation looks at what similar companies are worth: trading comps use the multiples public peers trade at today, and precedent transactions use the multiples buyers paid in past acquisitions, which include a control premium. Intrinsic valuation is the DCF: you project the company’s free cash flows and discount them back at its cost of capital. If a private equity buyer is plausible, you’d also run an LBO analysis to see what a sponsor could pay. Bankers show the resulting ranges side by side on a football field.',
    'Name the methods, group them (relative vs intrinsic) and mention how they’re presented.',
  ),
  free(
    { id: 'val-q-021', subtopic: 'when-to-use', difficulty: 'intermediate', pools: ['mock'], followUps: ['val-q-037', 'val-q-005'] },
    'When would you NOT use a DCF?',
    [
      ['unpredictable', 'When cash flows are unpredictable or negative for a long time (early-stage, biotech)', [['unpredictable|negative|early stage|early-stage|startup|biotech']]],
      ['financials', 'For banks and insurers, where debt is operating (use P/BV, P/E or a dividend discount model)', [['bank*|financial institution*|insurer*']]],
      ['distressed', 'For distressed companies where going-concern cash flows are doubtful', [['distress*|bankrupt*|liquidat*']]],
      ['alt', 'Says what to use instead', [['comps|multiples|precedent*|book value|dividend discount|liquidation']]],
    ],
    'I’d avoid relying on a DCF when cash flows are too unpredictable to project, like an early-stage startup or a clinical-stage biotech; there I’d use multiples or a risk-adjusted pipeline model. I wouldn’t use a standard DCF for banks or insurers, because debt is part of their operations; price-to-book, P/E or a dividend discount model work better. And for a distressed company that may not survive as a going concern, a liquidation analysis or recovery analysis is more relevant.',
    'Give the situations and the alternative for each.',
  ),
  free(
    { id: 'val-q-022', subtopic: 'football-field', difficulty: 'advanced', pools: ['mock'] },
    'Why do precedent transactions usually come out higher than trading comps?',
    [
      ['control', 'Buyers pay a control premium to acquire the whole company', [['control']]],
      ['synergies', 'Strategic buyers can pay for expected synergies', [['synerg*']]],
      ['process', 'Competitive sale processes push prices up', [['competit*|auction|bidding|process']]],
      ['minority', 'Trading prices reflect minority stakes without control', [['minority|non controlling|noncontrolling|small stake*']]],
    ],
    'Trading comps reflect the price of small, minority stakes traded in the market, with no control. In an acquisition, the buyer gets control of the whole company, its cash flows and strategy, so it pays a control premium, often 20–40%. Strategic buyers can also afford to pay for synergies, and a competitive auction pushes the price up further. So precedent multiples usually sit above trading multiples.',
    'Control premium and synergies are the core of the answer.',
    45,
  ),
  free(
    { id: 'val-q-040', subtopic: 'multiples-intuition', difficulty: 'elite', pools: ['mock'] },
    'What drives a company’s valuation multiple?',
    [
      ['growth', 'Expected growth', [['growth|grow*']]],
      ['returns', 'Profitability and returns on capital (margins, ROIC)', [['margin*|roic|return on|profitab*']]],
      ['risk', 'Risk and the cost of capital (discount rate)', [['risk*|discount rate|cost of capital|wacc']]],
      ['reinvest', 'Reinvestment needs and cash conversion (capex, working capital)', [['capex|reinvest*|cash conversion|free cash flow']]],
      ['market', 'Market conditions such as interest rates and sentiment', [['interest rate*|rates|market conditions|sentiment']]],
    ],
    'A multiple is shorthand for a DCF, so it’s driven by the same things. Growth: the faster cash flows are expected to grow, the more each dollar of today’s earnings is worth. Returns and profitability: higher margins and returns on capital mean more value from that growth. Reinvestment: if growth needs heavy capex or working capital, less free cash flow is left, so the multiple is lower. And risk: a higher cost of capital, from business risk or higher interest rates, lowers the multiple. Market sentiment can push multiples around in the short run too.',
    'Tie multiples back to DCF drivers: growth, returns, reinvestment and risk.',
  ),
];
