import type { Question } from '../../../types/questions';
import { builders } from '../../helpers';

const { mcq, num, rapid, order, free } = builders('markets');

/**
 * Markets & Deal Awareness. Questions test mechanics and frameworks, not
 * point-in-time market levels; keep current numbers in the Deal & Market
 * Journal (Phase 9).
 */
export const questions: Question[] = [
  // ── Rates and macro ──
  mcq(
    { id: 'mk-q-001', subtopic: 'rates-macro', difficulty: 'basic', pools: ['pre', 'post'] },
    'What happens to existing bond prices when interest rates rise?',
    [
      ['They fall, because new bonds offer higher yields, so existing lower-coupon bonds must be cheaper to compete', 'Price and yield move inversely.', true],
      ['They rise, because bonds pay more', 'Existing coupons are fixed; their price adjusts down.'],
      ['Nothing: bond prices are fixed at par', 'Bonds trade and their prices move.'],
      ['Only government bond prices change', 'All fixed-rate bonds are affected.'],
    ],
    'Rates up → bond prices down.',
  ),
  num(
    { id: 'mk-q-002', subtopic: 'rates-macro', difficulty: 'intermediate', pools: ['post', 'mock'] },
    'A bond has a modified duration of 7. If yields rise by 1 percentage point, roughly how much does its price change (in %)? (Enter a negative number.)',
    -7,
    ['%Δ price ≈ −duration × Δyield = −7 × 1% = −7%'],
    'Duration is the bond’s sensitivity to rates.',
    { unit: '%', tolerance: { kind: 'abs', value: 0.1 } },
  ),
  mcq(
    { id: 'mk-q-003', subtopic: 'rates-macro', difficulty: 'intermediate', pools: ['post', 'mock'] },
    'How do rising interest rates usually affect equity valuations, and which stocks are hit hardest?',
    [
      ['Higher discount rates lower valuations; long-duration growth stocks, with cash flows far in the future, fall the most', 'Their value depends most on distant cash flows, which are most sensitive to the discount rate.', true],
      ['They raise all valuations because companies earn more interest', 'The discount-rate effect usually dominates.'],
      ['They only affect bank stocks', 'They affect every company’s cost of capital.'],
      ['Value stocks fall more than growth stocks', 'Usually the reverse.'],
    ],
    'Equities have duration too.',
  ),
  mcq(
    { id: 'mk-q-004', subtopic: 'rates-macro', difficulty: 'intermediate', pools: ['post'] },
    'What does an inverted yield curve mean?',
    [
      ['Short-term yields are above long-term yields, often read as markets expecting rate cuts and slower growth; historically it has preceded many US recessions', 'It is a signal, not a guarantee.', true],
      ['Long-term yields are far above short-term yields', 'That is a steep (normal) curve.'],
      ['Bond prices have fallen to zero', 'Not what inversion means.'],
      ['The central bank has stopped setting rates', 'Unrelated.'],
    ],
    'Inversion = short > long.',
  ),
  mcq(
    { id: 'mk-q-005', subtopic: 'rates-macro', difficulty: 'intermediate', pools: ['post'] },
    'What are the Federal Reserve’s main policy tools?',
    [
      ['Setting the target range for the federal funds rate and adjusting the size of its balance sheet (QE / QT), plus forward guidance', 'Rate changes work through borrowing costs; the balance sheet works through long-term yields and liquidity.', true],
      ['Setting tax rates', 'That’s fiscal policy, set by Congress.'],
      ['Buying stocks directly to set prices', 'Not a standard Fed tool.'],
      ['Approving bank mergers only', 'One of many responsibilities, not a monetary policy tool.'],
    ],
    'Monetary policy: rates and balance sheet.',
  ),
  rapid(
    { id: 'mk-q-006', subtopic: 'rates-macro', difficulty: 'basic', pools: ['pre', 'post'] },
    'The 10-year yield is 4.5% and expected inflation is 3.0%. What is the approximate real yield (in %)?',
    1.5,
    'Real ≈ nominal − inflation = 1.5%.',
    { unit: '%', tolerance: { kind: 'abs', value: 0.05 } },
  ),
  num(
    { id: 'mk-q-007', subtopic: 'rates-macro', difficulty: 'intermediate', pools: ['post', 'mock'] },
    'A BBB-rated corporate bond yields 6.5% and the comparable Treasury yields 4.2%. What is the credit spread in basis points?',
    230,
    ['Spread = 6.5% − 4.2% = 2.3% = 230 bps'],
    '1 basis point = 0.01%.',
    { unit: 'bps', tolerance: { kind: 'abs', value: 1 } },
  ),
  mcq(
    { id: 'mk-q-008', subtopic: 'rates-macro', difficulty: 'intermediate', pools: ['post', 'mock'] },
    'What does it usually signal when credit spreads widen sharply?',
    [
      ['Investors are demanding more compensation for default risk: risk appetite is falling and financing is getting harder, especially for leveraged buyers', 'Wider spreads raise borrowing costs and slow LBOs and high-yield issuance.', true],
      ['Default risk is falling', 'Spreads widen when perceived risk rises.'],
      ['Equity markets are booming', 'Usually the opposite.'],
      ['Treasury yields have risen', 'Spreads are measured relative to Treasuries.'],
    ],
    'Spreads are a real-time gauge of credit risk appetite.',
  ),
  num(
    { id: 'mk-q-009', subtopic: 'rates-macro', difficulty: 'advanced', pools: ['mock'] },
    'A US company earns €100 of revenue in Europe. EUR/USD falls from 1.10 to 1.00. By how much do its reported US-dollar revenues from Europe change (in %, to 1 decimal)?',
    -9.1,
    ['Before: 100 × 1.10 = $110', 'After: 100 × 1.00 = $100', 'Change = 100 / 110 − 1 = −9.1%'],
    'A stronger dollar hurts US multinationals’ reported results.',
    { unit: '%', tolerance: { kind: 'abs', value: 0.1 } },
  ),
  mcq(
    { id: 'mk-q-010', subtopic: 'rates-macro', difficulty: 'basic', pools: ['pre', 'post'] },
    'What does the VIX measure?',
    [
      ['The market’s expected 30-day volatility of the S&P 500, implied from options prices', 'Often called the “fear gauge”.', true],
      ['The average P/E of the S&P 500', 'That’s a valuation measure.'],
      ['The 10-year Treasury yield', 'That’s a rate.'],
      ['Daily trading volume', 'Volume isn’t volatility.'],
    ],
    'Implied, forward-looking volatility.',
  ),
  num(
    { id: 'mk-q-011', subtopic: 'rates-macro', difficulty: 'advanced', pools: ['mock'] },
    'The S&P 500 trades at 20x forward earnings, and the 10-year Treasury yields 4.0%. What is the gap between the market’s earnings yield and the Treasury yield (in percentage points)?',
    1,
    ['Earnings yield = 1 / 20 = 5.0%', 'Gap = 5.0% − 4.0% = 1.0 point'],
    'A crude proxy for how much extra return equities offer over Treasuries.',
    { unit: 'pts', tolerance: { kind: 'abs', value: 0.05 } },
  ),
  mcq(
    { id: 'mk-q-012', subtopic: 'rates-macro', difficulty: 'elite', pools: ['mock'] },
    'Inflation surprises to the upside. Walk through the most likely chain of effects on M&A.',
    [
      ['Markets price in tighter policy → yields and spreads rise → financing costs rise and valuation multiples compress → LBO activity slows and bid-ask gaps widen between buyers and sellers', 'Sellers anchor on old valuations while buyers face higher financing costs, so deals stall.', true],
      ['Rates fall, so M&A accelerates', 'Upside inflation usually pushes rates up, not down.'],
      ['Only commodity companies are affected', 'Financing costs affect every leveraged buyer.'],
      ['Higher inflation always raises M&A because nominal revenues grow', 'The financing and valuation effects usually dominate.'],
    ],
    'Inflation → rates → financing → valuations → activity.',
  ),

  // ── Reading the deal market ──
  mcq(
    { id: 'mk-q-013', subtopic: 'current-markets', difficulty: 'basic', pools: ['pre', 'post'] },
    'Which conditions usually support strong M&A activity?',
    [
      ['Stable or rising equity markets, available and affordable financing, CEO confidence and a narrow gap between buyer and seller price expectations', 'Confidence, currency (stock) and financing drive volumes.', true],
      ['Falling equity markets and wide credit spreads', 'Those usually suppress activity.'],
      ['High uncertainty and volatility', 'Uncertainty makes boards cautious.'],
      ['Rising default rates', 'A sign of stress, not a driver of M&A.'],
    ],
    'Confidence + financing + valuation agreement.',
  ),
  mcq(
    { id: 'mk-q-014', subtopic: 'current-markets', difficulty: 'intermediate', pools: ['post', 'mock'] },
    'What usually drives whether the IPO window is “open”?',
    [
      ['Strong, stable equity markets, low volatility, good recent IPO performance and investor appetite for growth', 'Issuers need confidence they can price and trade well.', true],
      ['Rising volatility and falling indices', 'Those close the window.'],
      ['A strong private credit market only', 'Debt markets aren’t the main driver of IPOs.'],
      ['The number of SPACs', 'SPAC activity is a separate channel.'],
    ],
    'IPOs follow volatility and recent deal performance.',
  ),
  mcq(
    { id: 'mk-q-015', subtopic: 'current-markets', difficulty: 'intermediate', pools: ['post'] },
    'What is “dry powder” in private equity, and why does it matter for M&A?',
    [
      ['Committed but uninvested capital in PE funds; large amounts put pressure on sponsors to deploy, supporting deal activity and prices', 'Sponsors must invest within the fund’s investment period.', true],
      ['Cash on public companies’ balance sheets', 'That’s corporate cash.'],
      ['Undrawn revolvers at banks', 'Not the PE term.'],
      ['Explosive inventory in mining companies', 'Not in this context.'],
    ],
    'Dry powder = undeployed PE capital.',
  ),
  mcq(
    { id: 'mk-q-016', subtopic: 'current-markets', difficulty: 'intermediate', pools: ['post'] },
    'What is the difference between a spin-off, a carve-out and a split-off?',
    [
      ['Spin-off: subsidiary shares distributed to existing shareholders. Carve-out: a minority stake sold to the public via IPO. Split-off: shareholders exchange parent shares for subsidiary shares', 'All are ways to separate a business; they differ in cash raised and tax treatment.', true],
      ['They are all the same', 'They differ in mechanics.'],
      ['A carve-out is always a sale to a private equity firm', 'In capital markets usage, it’s a partial IPO (the term is also used loosely for divestitures).'],
      ['A spin-off raises cash for the parent', 'A pure spin-off doesn’t raise cash.'],
    ],
    'Know the three separation structures.',
  ),
  mcq(
    { id: 'mk-q-017', subtopic: 'current-markets', difficulty: 'advanced', pools: ['mock'] },
    'What is the Hart-Scott-Rodino (HSR) Act review?',
    [
      ['A US premerger notification: deals above size thresholds must be filed with the FTC and DOJ, with an initial 30-day waiting period (15 days for cash tender offers) before closing', 'Agencies can issue a “second request” for a deeper antitrust review.', true],
      ['A tax filing for all M&A', 'It’s antitrust, not tax.'],
      ['A review of foreign buyers for national security', 'That is CFIUS.'],
      ['A shareholder vote requirement', 'Unrelated to shareholder votes.'],
    ],
    'HSR = antitrust waiting period; CFIUS = national security.',
  ),
  mcq(
    { id: 'mk-q-018', subtopic: 'current-markets', difficulty: 'advanced', pools: ['mock'] },
    'What does CFIUS review?',
    [
      ['Foreign investments in US businesses for national-security risks, which can lead to mitigation conditions or a blocked deal', 'Especially relevant for technology, infrastructure and sensitive data.', true],
      ['All domestic mergers for antitrust', 'That’s the FTC and DOJ.'],
      ['Bank capital requirements', 'That’s bank regulators.'],
      ['Securities offerings', 'That’s the SEC.'],
    ],
    'Committee on Foreign Investment in the United States.',
  ),
  mcq(
    { id: 'mk-q-019', subtopic: 'current-markets', difficulty: 'intermediate', pools: ['post'] },
    'What is a secondary buyout?',
    [
      ['A private equity firm buys a company from another private equity firm', 'Common when sponsors need to exit and others have dry powder.', true],
      ['A company buys back its own shares in the secondary market', 'That is a buyback.'],
      ['A second attempt at a failed LBO', 'Not the meaning.'],
      ['An IPO of a PE-owned company', 'That’s an IPO exit.'],
    ],
    'Sponsor-to-sponsor sale.',
  ),
  mcq(
    { id: 'mk-q-020', subtopic: 'current-markets', difficulty: 'intermediate', pools: ['post', 'mock'] },
    'What is an activist investor, and why do they matter for bankers?',
    [
      ['An investor who buys a stake and pushes for changes (strategy, capital returns, a sale or break-up); they often trigger M&A and defense mandates', 'Activism creates both sell-side and defense work.', true],
      ['A passive index fund', 'Index funds don’t campaign (though they vote).'],
      ['A regulator', 'Activists are investors.'],
      ['A short seller only', 'Some activists short, but most take long stakes.'],
    ],
    'Activism → strategic reviews → deals.',
  ),
  rapid(
    { id: 'mk-q-021', subtopic: 'current-markets', difficulty: 'basic', pools: ['pre', 'post'] },
    'A company has 500 million shares trading at $40. What is its market cap (in $ billions)?',
    20,
    '500m × $40 = $20bn.',
    { unit: '$bn' },
  ),
  rapid(
    { id: 'mk-q-022', subtopic: 'current-markets', difficulty: 'basic', pools: ['pre'] },
    'A stock pays a $2.00 annual dividend and trades at $50. What is the dividend yield (in %)?',
    4,
    '2 / 50 = 4%.',
    { unit: '%' },
  ),

  // ── Pitching a deal ──
  order(
    { id: 'mk-q-023', subtopic: 'pitch-deal', difficulty: 'basic', pools: ['pre', 'post'] },
    'Put the parts of a strong “tell me about a deal” answer in order.',
    [
      'The facts: who is buying whom, for how much, and how it’s paid for',
      'The strategic rationale and expected synergies',
      'The valuation: multiple and premium versus comparables',
      'Financing and any regulatory considerations',
      'Your view, including the main risk',
    ],
    'Facts → why → price → how → your view.',
  ),
  mcq(
    { id: 'mk-q-024', subtopic: 'pitch-deal', difficulty: 'basic', pools: ['pre', 'post'] },
    'Which deal should you choose to discuss in an interview?',
    [
      ['One you’ve followed closely and can discuss for several minutes, ideally relevant to the firm or group, with a view you can defend', 'Depth beats prestige; expect follow-ups on valuation and rationale.', true],
      ['The biggest deal of the year, even if you only read the headline', 'Shallow knowledge falls apart under follow-ups.'],
      ['A deal the interviewer’s firm worked on, without knowing the details', 'Risky unless you know it well.'],
      ['Any deal, since interviewers don’t ask follow-ups', 'They do.'],
    ],
    'Pick depth over headlines.',
  ),
  mcq(
    { id: 'mk-q-025', subtopic: 'pitch-deal', difficulty: 'intermediate', pools: ['post', 'mock'] },
    'An interviewer asks, “Would you have done this deal?” What makes a strong answer?',
    [
      ['A clear yes or no, backed by the rationale, the price paid relative to value and synergies, and the key risk, with what would change your mind', 'Interviewers want judgment, not a summary of press coverage.', true],
      ['“It depends” without committing', 'You can caveat, but you must take a position.'],
      ['Repeating the press release', 'No analysis or view.'],
      ['Saying all deals are good for bankers', 'Not a view on the deal.'],
    ],
    'Take a position and defend it.',
  ),
  mcq(
    { id: 'mk-q-026', subtopic: 'pitch-deal', difficulty: 'advanced', pools: ['mock'] },
    'How can you tell from the announcement whether the market likes a deal?',
    [
      ['The acquirer’s share price reaction (relative to the market) and whether the target trades below the offer price (the arbitrage spread, which reflects completion risk)', 'A falling acquirer stock suggests investors think it overpaid; a wide spread suggests doubts about closing.', true],
      ['The size of the press release', 'Not a signal.'],
      ['Whether the bankers were paid', 'Fees are always paid on completion.'],
      ['The target’s stock rising above the offer always means the deal will fail', 'It can signal expectations of a higher bid.'],
    ],
    'Watch acquirer reaction and the arb spread.',
  ),
  num(
    { id: 'mk-q-027', subtopic: 'pitch-deal', difficulty: 'advanced', pools: ['mock'] },
    'A cash offer is $50 per share. After announcement the target trades at $48. What is the merger arbitrage spread (in %, to 1 decimal)?',
    4.2,
    ['Spread = 50 / 48 − 1 = 4.17%'],
    'The spread reflects time to close and the risk the deal fails.',
    { unit: '%', tolerance: { kind: 'abs', value: 0.1 } },
  ),

  // ── Pitching a stock ──
  order(
    { id: 'mk-q-028', subtopic: 'pitch-stock', difficulty: 'basic', pools: ['pre'] },
    'Put the parts of a stock pitch in order.',
    [
      'Recommendation and price target (buy or sell)',
      'Brief company overview',
      'Two or three thesis points the market is missing',
      'Valuation: why the price is wrong',
      'Catalysts that will close the gap',
      'Key risks and what would change your mind',
    ],
    'Lead with the recommendation.',
  ),
  mcq(
    { id: 'mk-q-029', subtopic: 'pitch-stock', difficulty: 'intermediate', pools: ['post'] },
    'What makes a stock pitch thesis strong?',
    [
      ['It’s a specific view that differs from consensus, with evidence, a valuation gap and a catalyst', '“Great company” isn’t a thesis; “the market underestimates X because Y” is.', true],
      ['It repeats what most analysts already say', 'If everyone agrees, it’s priced in.'],
      ['It relies on the CEO being likeable', 'Not evidence.'],
      ['It avoids naming any risks', 'Credibility comes from addressing risks.'],
    ],
    'Variant view + evidence + catalyst.',
  ),
  mcq(
    { id: 'mk-q-030', subtopic: 'pitch-stock', difficulty: 'advanced', pools: ['mock'] },
    'How can a reverse DCF strengthen a stock pitch?',
    [
      ['It shows the growth or margins the current price implies, so you can argue those expectations are too low or too high', 'It turns “I think it’s cheap” into “the price implies only 3% growth, but…”.', true],
      ['It gives the exact future stock price', 'No model does that.'],
      ['It replaces the need for a thesis', 'It supports a thesis.'],
      ['It calculates the company’s WACC', 'WACC is an input, not the output.'],
    ],
    'A reverse DCF frames the debate around expectations.',
  ),
  mcq(
    { id: 'mk-q-031', subtopic: 'pitch-stock', difficulty: 'intermediate', pools: ['post', 'mock'] },
    'What is a catalyst in a stock pitch?',
    [
      ['A specific event that will make the market recognize the mispricing, such as an earnings beat, product launch, spin-off or margin inflection', 'Without a catalyst, a cheap stock can stay cheap.', true],
      ['The company’s ticker symbol', 'Not a catalyst.'],
      ['Any change in the overall market', 'Catalysts are company-specific.'],
      ['The stock’s historical return', 'Backward-looking.'],
    ],
    'What closes the gap, and when?',
  ),
  mcq(
    { id: 'mk-q-032', subtopic: 'pitch-stock', difficulty: 'elite', pools: ['mock'] },
    'You pitch a stock as undervalued at 12x earnings versus peers at 18x. The interviewer says, “Maybe it deserves a discount.” How do you respond?',
    [
      ['Acknowledge the possible reasons (slower growth, lower margins, more risk), then show with evidence why those reasons are fading or overstated', 'A discount isn’t mispricing unless the reason for it is wrong.', true],
      ['Insist cheaper is always better', 'Cheap stocks can deserve it.'],
      ['Switch to a different stock', 'Defend or refine the thesis.'],
      ['Say peers are overvalued instead', 'That changes the argument without evidence.'],
    ],
    'Explain the discount, then explain why it’s wrong.',
  ),

  // ── Verbal ──
  free(
    { id: 'mk-q-033', subtopic: 'rates-macro', difficulty: 'intermediate', pools: ['mock'], followUps: ['mk-q-012', 'mk-q-008'] },
    'How do interest rates affect M&A and LBO activity?',
    [
      ['financing', 'Higher rates raise borrowing costs, so leveraged buyers can pay less', [['financing|borrowing|debt', 'cost*']]],
      ['valuation', 'Higher discount rates lower valuations and multiples', [['valuation*|multiple*|discount rate']]],
      ['gap', 'Sellers anchored to old prices create a bid-ask gap, slowing deals', [['gap|expectations|anchor*']]],
      ['strategic', 'Strategics with strong balance sheets or stock can be relatively advantaged', [['strategic*|balance sheet*|stock']]],
    ],
    'Rates affect M&A mainly through financing and valuation. Higher rates raise borrowing costs, so private equity buyers can afford less leverage and pay lower prices. They also raise discount rates, which lowers valuations and multiples. Sellers often stay anchored to the valuations of a low-rate period, so a gap opens between buyer and seller expectations and deals slow down. Strategic buyers with strong balance sheets or richly valued stock are relatively advantaged in that environment. When rates fall, the reverse happens: financing gets cheaper and sponsor activity picks up.',
    'Financing, valuation, expectations gap, who benefits.',
    60,
  ),
  free(
    { id: 'mk-q-034', subtopic: 'pitch-deal', difficulty: 'basic', pools: ['mock'], followUps: ['mk-q-025', 'mk-q-026'] },
    'Tell me about a deal you’ve been following.',
    [
      ['facts', 'The facts: buyer, target, price, consideration', [['acquir*|buy*|bought'], ['billion|million|per share']]],
      ['rationale', 'Strategic rationale and synergies', [['rationale|strategic|synerg*']]],
      ['valuation', 'Valuation: multiple and premium', [['multiple|premium|ebitda']]],
      ['view', 'Your view and the main risk', [['i think|my view|risk*']]],
    ],
    'One deal I’ve followed is [acquirer]’s acquisition of [target] for about $[X] billion, paid in [cash / stock]. The strategic rationale is [rationale], with expected synergies of about $[Y] million. It was priced at roughly [Z]x EBITDA, a [N]% premium to the unaffected price, which is [above / in line with] recent sector deals. I think it makes sense because [reason], but the main risk is [integration / regulatory / financing].',
    'Facts, rationale, valuation, view. Fill the brackets from your Deal Journal.',
    90,
  ),
  free(
    { id: 'mk-q-035', subtopic: 'pitch-stock', difficulty: 'advanced', pools: ['mock'], followUps: ['mk-q-032'] },
    'Pitch me a stock.',
    [
      ['rec', 'Clear recommendation and target', [['buy|sell|long|short']]],
      ['thesis', 'Two or three thesis points the market is missing', [['thesis|first|second|underestimat*|missing']]],
      ['valuation', 'Valuation: why the price is wrong', [['valuation|multiple|dcf|trades at|implies']]],
      ['catalyst', 'A catalyst', [['catalyst*']]],
      ['risk', 'Risks and what would change your mind', [['risk*|change my mind']]],
    ],
    'I’d buy [company], which trades at $[price], with a target of $[target]. The market is missing two things. First, [driver the market underestimates]. Second, [second point]. On valuation, it trades at [X]x forward earnings versus peers at [Y]x, and a reverse DCF shows the price implies only [Z]% growth. The catalyst is [event] in the next [timeframe]. The main risk is [risk], and I’d change my mind if [signal].',
    'Recommendation first, then thesis, valuation, catalyst, risks.',
    120,
  ),
  free(
    { id: 'mk-q-036', subtopic: 'current-markets', difficulty: 'intermediate', pools: ['mock'] },
    'What’s going on in the markets right now?',
    [
      ['rates', 'Where rates and central bank policy stand', [['rate*|fed|central bank|inflation']]],
      ['equity', 'Equity and credit markets', [['equity|stock*|s&p|credit|spread*']]],
      ['deals', 'What it means for M&A, IPOs or financing', [['m&a|ipo*|deal*|financing']]],
      ['view', 'A view and what you’re watching', [['i think|my view|watching|watch']]],
    ],
    'The main story is [rates and inflation: where the policy rate is and where markets expect it to go]. Equity markets are [level and direction], and credit spreads are [tight or wide], which means financing is [available or expensive]. For deals, that has meant [M&A, IPO or financing trend]. I think [your view], and I’m watching [one indicator] over the next few months.',
    'Framework answer: fill it weekly from your Market Notes.',
    90,
  ),
  mcq(
    { id: 'mk-q-037', subtopic: 'current-markets', difficulty: 'basic', pools: ['pre', 'post'] },
    'How should you prepare for “what’s going on in the markets?”',
    [
      ['Track a few numbers weekly (policy rate, 10-year yield, S&P 500 level, credit spreads) and one or two deal trends, and form a simple view', 'Consistency beats cramming; interviewers want a coherent view.', true],
      ['Memorize every headline the night before', 'Shallow and easy to trip up.'],
      ['Say you don’t follow markets', 'A red flag for banking.'],
      ['Only follow crypto prices', 'Too narrow for a banking interview.'],
    ],
    'A few numbers, a few deals, one view.',
  ),
  mcq(
    { id: 'mk-q-038', subtopic: 'rates-macro', difficulty: 'basic', pools: ['pre', 'post'] },
    'Why does the 10-year Treasury yield matter so much to bankers?',
    [
      ['It’s the usual risk-free rate in valuations and a benchmark for mortgage and corporate borrowing costs', 'Moves in the 10-year ripple through every DCF and financing.', true],
      ['It sets the price of every stock directly', 'It influences, but doesn’t set, stock prices.'],
      ['It’s the interest rate on bank deposits', 'Deposit rates differ.'],
      ['It only matters to bond traders', 'It matters across banking.'],
    ],
    'Risk-free rate and borrowing benchmark.',
  ),
  mcq(
    { id: 'mk-q-039', subtopic: 'rates-macro', difficulty: 'advanced', pools: ['mock'] },
    'In 2022 the Federal Reserve raised rates rapidly from near zero. Which effect on capital markets fits that period?',
    [
      ['Valuations of long-duration growth stocks fell sharply, IPO activity dropped and leveraged buyouts became more expensive to finance', 'A textbook example of rates feeding through to valuations and deal activity.', true],
      ['IPO activity hit record highs', 'IPO issuance fell sharply in 2022.'],
      ['Bond prices rose sharply', 'Rising yields meant falling bond prices.'],
      ['Growth stocks outperformed value stocks', 'Value generally outperformed growth that year.'],
    ],
    'Use 2022 as the case study for rate shocks.',
  ),
  mcq(
    { id: 'mk-q-040', subtopic: 'pitch-deal', difficulty: 'intermediate', pools: ['post'] },
    'What is a SPAC?',
    [
      ['A special purpose acquisition company: a listed shell that raises cash in an IPO and then merges with a private company (a “de-SPAC”), taking it public', 'An alternative route to going public.', true],
      ['A type of bond', 'It’s an equity vehicle.'],
      ['A private equity fund', 'It’s publicly listed.'],
      ['A government regulator', 'Not a regulator.'],
    ],
    'Blank-check company.',
  ),
  mcq(
    { id: 'mk-q-041', subtopic: 'pitch-deal', difficulty: 'elite', pools: ['mock'] },
    'After a stock-for-stock deal is announced, the acquirer’s shares fall 8% while the market is flat. What is the most likely interpretation, and what might the bankers suggest?',
    [
      ['Investors think the acquirer overpaid or doubt the synergies; the company might strengthen the synergy case, add buybacks or highlight downside protections', 'In a fixed exchange ratio deal, the fall also cuts the value going to target holders.', true],
      ['Investors love the deal', 'A relative fall signals skepticism.'],
      ['The fall is irrelevant to the target’s shareholders', 'With stock consideration, it lowers the value they receive.'],
      ['The deal will certainly be cancelled', 'Not necessarily.'],
    ],
    'Read the market’s verdict, then respond.',
  ),
];
