import type { Question } from '../../../types/questions';
import { builders } from '../../helpers';

const { mcq, num, rapid, order, free } = builders('mna');

export const questions: Question[] = [
  // ── Accretion / dilution ──
  mcq(
    { id: 'ma-q-001', subtopic: 'accretion-dilution', difficulty: 'basic', pools: ['pre', 'post'] },
    'What does it mean for an acquisition to be “accretive”?',
    [
      ['The acquirer’s pro forma EPS after the deal is higher than its standalone EPS', 'Accretion/dilution compares EPS with and without the deal.', true],
      ['The acquirer pays less than the target’s book value', 'That relates to goodwill, not accretion.'],
      ['The combined company has more revenue', 'Revenue always rises when you combine companies; EPS may not.'],
      ['The target’s shareholders receive a premium', 'Every deal has a premium; accretion is about the buyer’s EPS.'],
    ],
    'Accretive = pro forma EPS > standalone EPS; dilutive = lower.',
  ),
  num(
    { id: 'ma-q-002', subtopic: 'accretion-dilution', difficulty: 'intermediate', pools: ['pre', 'post'] },
    'The acquirer has net income of $100 and 50 shares (EPS $2.00). It buys a target with net income of $30 in an all-stock deal, issuing 10 new shares. Ignoring synergies and fees, what is pro forma EPS (to 2 decimals)?',
    2.17,
    ['Pro forma net income = 100 + 30 = 130', 'Pro forma shares = 50 + 10 = 60', 'Pro forma EPS = 130 / 60 = 2.17 (8.3% accretive)'],
    'Combine net income, add new shares, divide.',
    { tolerance: { kind: 'abs', value: 0.01 } },
  ),
  mcq(
    { id: 'ma-q-003', subtopic: 'accretion-dilution', difficulty: 'intermediate', pools: ['post', 'mock'] },
    'In an all-stock deal with no synergies, when is the deal accretive?',
    [
      ['When the acquirer’s P/E is higher than the P/E it pays for the target', 'The acquirer issues expensive currency (its stock) to buy cheaper earnings.', true],
      ['When the target’s P/E is higher than the acquirer’s', 'Buying earnings at a higher multiple than your own stock is dilutive.'],
      ['Whenever the target is profitable', 'Profitability alone doesn’t decide it; the price does.'],
      ['Always: stock deals are accretive by definition', 'They are often dilutive.'],
    ],
    'Stock deals: compare P/Es (at the purchase price).',
  ),
  num(
    { id: 'ma-q-004', subtopic: 'accretion-dilution', difficulty: 'intermediate', pools: ['post'] },
    'The acquirer has net income of $200 and 100 shares (EPS $2.00). It pays $400 of cash on hand for a target with net income of $20. Its cash earned 5% pre-tax interest; the tax rate is 25%. What is pro forma EPS?',
    2.05,
    ['Foregone interest after tax = 400 × 5% × (1 − 25%) = 15', 'Pro forma net income = 200 + 20 − 15 = 205', 'Shares unchanged at 100: EPS = 2.05 (2.5% accretive)'],
    'Cash isn’t free: you lose the interest it was earning.',
  ),
  num(
    { id: 'ma-q-005', subtopic: 'accretion-dilution', difficulty: 'advanced', pools: ['mock'] },
    'The acquirer has net income of $300 and 150 shares (EPS $2.00). It borrows $600 at 8% to buy a target with net income of $40. Tax rate 25%. What is the accretion (in %, to 1 decimal)?',
    1.3,
    ['After-tax interest = 600 × 8% × 0.75 = 36', 'Pro forma net income = 300 + 40 − 36 = 304', 'Pro forma EPS = 304 / 150 = 2.027', 'Accretion = 2.027 / 2.00 − 1 = 1.3%'],
    'Debt-funded: compare the target’s earnings with the after-tax interest cost.',
    { unit: '%', tolerance: { kind: 'abs', value: 0.1 } },
  ),
  mcq(
    { id: 'ma-q-006', subtopic: 'accretion-dilution', difficulty: 'advanced', pools: ['mock'] },
    'Which general rule tells you whether a deal is accretive, whatever mix of cash, debt and stock funds it?',
    [
      ['It’s accretive if the target’s earnings yield (at the purchase price) exceeds the weighted after-tax cost of the funding', 'Cost of cash = foregone after-tax interest; cost of debt = after-tax interest rate; cost of stock = acquirer’s earnings yield (1 / P/E).', true],
      ['It’s accretive if the target has higher revenue growth', 'Growth matters for value, not this year’s EPS math.'],
      ['It’s accretive if the deal is funded with at least 50% cash', 'Funding mix matters only through its cost.'],
      ['It’s accretive if the premium is under 30%', 'The premium affects the price, but the yield comparison decides it.'],
    ],
    'Target yield vs. weighted cost of acquisition currency.',
  ),
  num(
    { id: 'ma-q-007', subtopic: 'accretion-dilution', difficulty: 'elite', pools: ['mock'] },
    'The acquirer trades at 20x P/E. It funds a deal 50% with stock and 50% with debt at 6% pre-tax (25% tax rate). What is the weighted after-tax cost of funding (in %)? (The target is bought at 15x, a 6.7% earnings yield.)',
    4.75,
    ['Cost of stock = 1 / 20 = 5.0%', 'Cost of debt = 6% × 0.75 = 4.5%', 'Weighted = 0.5 × 5.0% + 0.5 × 4.5% = 4.75%', '4.75% < 6.7% target yield, so the deal is accretive'],
    'The yield method lets you answer accretion questions without building a model.',
    { unit: '%', tolerance: { kind: 'abs', value: 0.05 } },
  ),
  mcq(
    { id: 'ma-q-008', subtopic: 'accretion-dilution', difficulty: 'intermediate', pools: ['post'] },
    'Is an accretive deal always a good deal?',
    [
      ['No: EPS accretion can hide overpaying; value is created when returns on the deal exceed the cost of capital', 'A cheap-debt-funded deal can be accretive and still destroy value.', true],
      ['Yes, by definition', 'Accretion is an accounting test, not a value test.'],
      ['Yes, if it’s funded with stock', 'Funding doesn’t make a deal good.'],
      ['No, accretive deals always destroy value', 'Some accretive deals create value; it depends on price and returns.'],
    ],
    'Accretion ≠ value creation.',
  ),
  mcq(
    { id: 'ma-q-009', subtopic: 'accretion-dilution', difficulty: 'intermediate', pools: ['post'] },
    'In EPS terms, which funding source is usually cheapest and which most expensive?',
    [
      ['Cash on hand is usually cheapest (low foregone interest), then debt, with stock usually most expensive', 'Stock’s cost is the earnings yield, typically above after-tax interest rates.', true],
      ['Stock is always cheapest because no interest is paid', 'Issuing shares dilutes EPS; its “cost” is the earnings yield.'],
      ['Debt is always most expensive', 'Interest is tax-deductible and usually below the earnings yield.'],
      ['All three always cost the same', 'They have different costs.'],
    ],
    'Order of cost (usually): cash < debt < stock.',
  ),
  num(
    { id: 'ma-q-010', subtopic: 'accretion-dilution', difficulty: 'elite', pools: ['mock'] },
    'The acquirer has net income of $100 and 50 shares (EPS $2.00). It issues 20 shares to buy a target earning $30. What pre-tax synergies are needed for the deal to break even on EPS (25% tax rate)?',
    13.3,
    ['Pro forma shares = 70; to keep EPS at 2.00, pro forma NI must be 2.00 × 70 = 140', 'Without synergies NI = 130, so 10 of after-tax synergies are needed', 'Pre-tax = 10 / 0.75 = 13.3'],
    'Breakeven synergies close the gap between pro forma and standalone EPS.',
    { tolerance: { kind: 'abs', value: 0.1 } },
  ),
  rapid(
    { id: 'ma-q-041', subtopic: 'accretion-dilution', difficulty: 'basic', pools: ['post', 'mock'] },
    'Acquirer standalone EPS is $2.00 and pro forma EPS is $2.10. What is the accretion (in %)?',
    5,
    '2.10 / 2.00 − 1 = 5%.',
    { unit: '%' },
  ),

  // ── Purchase price allocation & goodwill ──
  mcq(
    { id: 'ma-q-011', subtopic: 'ppa-goodwill', difficulty: 'basic', pools: ['pre', 'post'] },
    'How is goodwill calculated in an acquisition?',
    [
      ['Purchase price minus the fair value of the target’s identifiable net assets (after write-ups and their deferred taxes)', 'Goodwill is the residual the buyer paid for things it can’t separately identify, such as synergies and workforce.', true],
      ['Purchase price minus the target’s market capitalization', 'That is roughly the premium, not goodwill.'],
      ['The target’s revenue times a multiple', 'That’s a valuation, not goodwill.'],
      ['The target’s existing goodwill carried over', 'Existing goodwill is written off and replaced with new goodwill.'],
    ],
    'Goodwill = price − FV of identifiable net assets.',
  ),
  num(
    { id: 'ma-q-012', subtopic: 'ppa-goodwill', difficulty: 'intermediate', pools: ['pre', 'post', 'mock'], followUps: ['ma-q-013'] },
    'An acquirer pays $1,000 of equity for a target with $400 of book equity (no existing goodwill). PP&E is written up by $100 and new intangibles of $150 are identified. Ignoring deferred taxes, how much goodwill is created?',
    350,
    ['Fair value of identifiable net assets = 400 + 100 + 150 = 650', 'Goodwill = 1,000 − 650 = 350'],
    'Write-ups reduce goodwill dollar for dollar (before taxes).',
  ),
  num(
    { id: 'ma-q-013', subtopic: 'ppa-goodwill', difficulty: 'advanced', pools: ['mock'] },
    'Same deal: $1,000 purchase price, $400 of book equity, $250 of total write-ups. Now record a deferred tax liability on the write-ups at 25% (a stock deal). How much goodwill is created?',
    412.5,
    ['DTL = 250 × 25% = 62.5', 'Adjusted net assets = 650 − 62.5 = 587.5', 'Goodwill = 1,000 − 587.5 = 412.5'],
    'The DTL is a new liability, so it reduces net assets and increases goodwill.',
  ),
  mcq(
    { id: 'ma-q-014', subtopic: 'ppa-goodwill', difficulty: 'intermediate', pools: ['post'] },
    'Why does a stock acquisition with asset write-ups create a deferred tax liability?',
    [
      ['The book basis of the assets is stepped up but the tax basis isn’t, so future book depreciation exceeds tax depreciation and cash taxes will exceed book taxes', 'The DTL records the extra cash tax that will be paid relative to book tax as the write-ups depreciate.', true],
      ['Because the buyer must pay tax on the goodwill immediately', 'There’s no immediate tax on goodwill.'],
      ['Because write-ups are taxed as income', 'Write-ups aren’t income.'],
      ['Because the seller’s taxes transfer to the buyer as a DTL', 'The DTL arises from the basis difference, not the seller’s taxes.'],
    ],
    'Book basis ≠ tax basis → deferred tax.',
  ),
  mcq(
    { id: 'ma-q-015', subtopic: 'ppa-goodwill', difficulty: 'advanced', pools: ['mock'] },
    'How do the tax consequences differ between a stock purchase and an asset purchase (or a Section 338(h)(10) election)?',
    [
      ['In an asset deal the buyer gets a stepped-up tax basis, so write-ups and goodwill are tax-deductible (goodwill over 15 years in the US) and no DTL arises; the seller may face more tax', 'That tax benefit is why buyers often prefer asset deals and sellers stock deals.', true],
      ['There is no tax difference', 'The tax basis treatment differs significantly.'],
      ['In a stock deal goodwill is tax-deductible; in an asset deal it isn’t', 'It’s the other way around.'],
      ['Asset deals always create larger DTLs', 'Asset deals typically create no DTL on write-ups.'],
    ],
    'Asset deals step up the tax basis; stock deals usually don’t.',
  ),
  mcq(
    { id: 'ma-q-016', subtopic: 'ppa-goodwill', difficulty: 'intermediate', pools: ['post'] },
    'Under US GAAP, what happens to goodwill after an acquisition at a public company?',
    [
      ['It isn’t amortized; it’s tested for impairment at least annually and written down if impaired', 'Private companies may elect to amortize it, but public companies test for impairment.', true],
      ['It’s amortized straight-line over 40 years', 'That rule was replaced in 2001 (SFAS 142).'],
      ['It’s expensed immediately', 'Goodwill is capitalized as an asset.'],
      ['It’s revalued upward each year to market value', 'Goodwill can’t be written up.'],
    ],
    'Impair, don’t amortize (US public companies).',
  ),
  mcq(
    { id: 'ma-q-017', subtopic: 'ppa-goodwill', difficulty: 'advanced', pools: ['mock'] },
    'What happens if an acquirer pays less than the fair value of the target’s identifiable net assets?',
    [
      ['After reassessing the valuation, it records a bargain-purchase gain on the income statement (“negative goodwill”)', 'Rare, usually in distressed or forced sales.', true],
      ['It records negative goodwill as a liability forever', 'The excess is recognized as a gain, not carried as a liability.'],
      ['The deal is illegal', 'Bargain purchases are allowed.'],
      ['It increases the target’s goodwill', 'There is no goodwill in a bargain purchase.'],
    ],
    'Bargain purchase → gain, after double-checking the fair values.',
  ),
  num(
    { id: 'ma-q-018', subtopic: 'ppa-goodwill', difficulty: 'intermediate', pools: ['post'] },
    'An acquirer pays $800 for a target whose book equity is $300, including $50 of existing goodwill. PP&E is written up by $100. Ignoring deferred taxes, how much new goodwill is created?',
    450,
    ['Write off existing goodwill: identifiable book net assets = 300 − 50 = 250', 'Add the write-up: 250 + 100 = 350', 'New goodwill = 800 − 350 = 450'],
    'The target’s old goodwill is eliminated and replaced.',
  ),

  // ── Synergies ──
  mcq(
    { id: 'ma-q-019', subtopic: 'synergies', difficulty: 'basic', pools: ['pre', 'post'] },
    'What are revenue and cost synergies?',
    [
      ['Cost synergies come from eliminating overlapping costs (e.g. duplicate functions, procurement); revenue synergies from selling more together (cross-selling, pricing, new markets)', 'Both are reasons the combination is worth more than the parts.', true],
      ['Revenue synergies are tax savings; cost synergies are interest savings', 'Neither is the standard definition.'],
      ['They are the fees paid to bankers', 'Fees are deal costs.'],
      ['They are the same thing', 'They come from different sources and carry different risk.'],
    ],
    'Cost synergies are more reliable; revenue synergies more speculative.',
  ),
  mcq(
    { id: 'ma-q-020', subtopic: 'synergies', difficulty: 'intermediate', pools: ['post', 'mock'] },
    'Why do investors usually give more credit to cost synergies than revenue synergies?',
    [
      ['Cost synergies are largely within management’s control; revenue synergies depend on customers and competitors', 'Closing a duplicate office is more certain than cross-selling success.', true],
      ['Revenue synergies are not allowed in models', 'They’re allowed, just discounted.'],
      ['Cost synergies are always larger', 'Not necessarily; they’re just more certain.'],
      ['Revenue synergies are taxed and cost synergies aren’t', 'Both affect taxable income.'],
    ],
    'Certainty drives credibility.',
  ),
  num(
    { id: 'ma-q-021', subtopic: 'synergies', difficulty: 'intermediate', pools: ['post'] },
    'A deal is expected to deliver $50 of run-rate pre-tax cost synergies. The tax rate is 25%, and you capitalize after-tax synergies at 10x. What are the synergies worth?',
    375,
    ['After-tax synergies = 50 × 0.75 = 37.5', 'Capitalized value = 37.5 × 10 = 375'],
    'Ignoring the cost to achieve them and phase-in timing (which would reduce this).',
  ),
  mcq(
    { id: 'ma-q-022', subtopic: 'synergies', difficulty: 'advanced', pools: ['mock'] },
    'What should a synergy analysis include besides the run-rate synergy figure?',
    [
      ['One-time costs to achieve (severance, IT, facility closures) and a realistic phase-in over 2–3 years', 'Ignoring costs and timing overstates the value created.', true],
      ['Nothing: run-rate synergies are all that matter', 'Timing and costs materially change their present value.'],
      ['The target’s historical stock price', 'Not relevant to synergy value.'],
      ['Only the revenue synergies', 'Cost synergies are usually the core.'],
    ],
    'Run-rate, phase-in, costs to achieve.',
  ),
  num(
    { id: 'ma-q-023', subtopic: 'synergies', difficulty: 'advanced', pools: ['mock'] },
    'The present value of expected synergies is $600 and the target’s unaffected market cap is $2,000. If the acquirer is willing to give away all of the synergy value, what is the maximum premium it can pay (in %)?',
    30,
    ['Max premium = synergy value / market cap = 600 / 2,000 = 30%'],
    'Paying away all synergies leaves the acquirer’s shareholders with no value creation.',
    { unit: '%', tolerance: { kind: 'abs', value: 0.1 } },
  ),
  rapid(
    { id: 'ma-q-042', subtopic: 'synergies', difficulty: 'intermediate', pools: ['post'] },
    '$40 of pre-tax synergies at a 25% tax rate is worth how much after tax?',
    30,
    '40 × 0.75 = 30.',
  ),

  // ── Consideration ──
  mcq(
    { id: 'ma-q-024', subtopic: 'consideration', difficulty: 'basic', pools: ['pre', 'post'] },
    'How does paying with stock rather than cash change who bears the risk?',
    [
      ['With stock, the target’s shareholders share in the combined company’s upside and downside; with cash they get certain value and the acquirer bears all the risk', 'Stock shifts some risk to the sellers.', true],
      ['Stock deals have no risk for anyone', 'Both sides bear the combined company’s performance risk.'],
      ['Cash deals transfer all the risk to the target’s shareholders', 'Cash gives the sellers certainty.'],
      ['Risk is the same either way', 'Consideration type changes who bears it.'],
    ],
    'Cash = certainty for sellers; stock = shared risk.',
  ),
  mcq(
    { id: 'ma-q-025', subtopic: 'consideration', difficulty: 'intermediate', pools: ['post'] },
    'When would an acquirer prefer to pay with stock?',
    [
      ['When its shares are richly valued, it wants to preserve cash or limit leverage, or the deal is large relative to its size', 'Expensive stock is a cheap currency.', true],
      ['When its stock is undervalued', 'Then issuing stock is expensive; cash or debt is better.'],
      ['When interest rates are very low', 'Low rates make debt more attractive, not stock.'],
      ['Never: stock is always more expensive', 'Sometimes stock is the right currency.'],
    ],
    'Use your currency when it’s expensive.',
  ),
  mcq(
    { id: 'ma-q-026', subtopic: 'consideration', difficulty: 'intermediate', pools: ['post', 'mock'] },
    'What is the difference between a fixed exchange ratio and a fixed price (fixed value) structure?',
    [
      ['Fixed ratio: the number of shares per target share is set, so the value moves with the acquirer’s stock; fixed price: the value is set, so the number of shares floats', 'Collars limit how far either can move.', true],
      ['Fixed ratio means the deal is all cash', 'Exchange ratios apply to stock deals.'],
      ['Fixed price means the acquirer’s share price can’t change', 'It means the value delivered per target share is fixed.'],
      ['They are identical', 'They allocate price risk differently.'],
    ],
    'Who bears the acquirer’s share-price risk between signing and closing?',
  ),
  num(
    { id: 'ma-q-027', subtopic: 'consideration', difficulty: 'intermediate', pools: ['post'], followUps: [] },
    'The offer is $45 per target share, paid in acquirer stock trading at $60. What is the exchange ratio?',
    0.75,
    ['Exchange ratio = 45 / 60 = 0.75 acquirer shares per target share'],
    'Offer price per share ÷ acquirer share price.',
    { unit: 'x', tolerance: { kind: 'abs', value: 0.005 } },
  ),
  num(
    { id: 'ma-q-028', subtopic: 'consideration', difficulty: 'advanced', pools: ['mock'] },
    'At a 0.75 exchange ratio, how many new acquirer shares are issued for a target with 40 million diluted shares (in millions)?',
    30,
    ['New shares = 40 × 0.75 = 30m'],
    'Diluted target shares × exchange ratio.',
    { unit: 'm shares' },
  ),
  mcq(
    { id: 'ma-q-029', subtopic: 'consideration', difficulty: 'advanced', pools: ['mock'] },
    'Why might the target’s shareholders prefer to be paid in stock?',
    [
      ['A stock deal can qualify as a tax-free reorganization, deferring their tax, and lets them share in the upside and synergies', 'Cash triggers an immediate taxable gain.', true],
      ['Because stock is always worth more than cash', 'Not necessarily.'],
      ['Because stock deals close faster', 'They often take longer (registration, votes).'],
      ['Because they avoid all risk', 'They take on the combined company’s risk.'],
    ],
    'Tax deferral + upside.',
  ),
  rapid(
    { id: 'ma-q-043', subtopic: 'consideration', difficulty: 'intermediate', pools: ['pre'] },
    'The offer is $30 per share in acquirer stock trading at $40. What is the exchange ratio?',
    0.75,
    '30 / 40 = 0.75.',
    { unit: 'x', tolerance: { kind: 'abs', value: 0.005 } },
  ),

  // ── Deal structures and process ──
  mcq(
    { id: 'ma-q-030', subtopic: 'deal-structures', difficulty: 'intermediate', pools: ['post'] },
    'What is the difference between a stock purchase and an asset purchase?',
    [
      ['In a stock purchase the buyer acquires the entity with all its assets and liabilities; in an asset purchase it picks specific assets and liabilities', 'Asset deals let buyers avoid unwanted liabilities and step up the tax basis.', true],
      ['A stock purchase is paid in stock; an asset purchase in cash', 'The labels refer to what is acquired, not how it’s paid for.'],
      ['Asset purchases are only for private companies', 'They’re more common for private targets and carve-outs, but not exclusive.'],
      ['There’s no legal difference', 'The legal and tax treatment differs significantly.'],
    ],
    'Entity vs. selected assets.',
  ),
  mcq(
    { id: 'ma-q-031', subtopic: 'deal-structures', difficulty: 'intermediate', pools: ['post'] },
    'What is a “merger of equals”?',
    [
      ['A combination of two similar-sized companies, usually all-stock with little or no premium and shared governance', 'Neither side is clearly the acquirer, so control and board seats are negotiated.', true],
      ['Any deal where the price equals book value', 'It’s about relative size and governance.'],
      ['A deal between two companies in the same industry', 'Industry overlap doesn’t make it a merger of equals.'],
      ['A deal financed 50% with debt', 'Financing mix is unrelated.'],
    ],
    'Similar size, low premium, shared control.',
  ),
  mcq(
    { id: 'ma-q-032', subtopic: 'deal-structures', difficulty: 'advanced', pools: ['mock'] },
    'How does a tender offer differ from a one-step merger?',
    [
      ['A tender offer goes directly to shareholders to buy their shares and can close faster; a one-step merger needs a shareholder vote via a proxy', 'Tender offers are common for all-cash deals that want speed.', true],
      ['Tender offers are only for private companies', 'They’re used for public targets.'],
      ['A one-step merger doesn’t need any approvals', 'It needs board and shareholder approval.'],
      ['They are the same', 'They follow different legal processes.'],
    ],
    'Speed vs. a shareholder vote.',
  ),
  mcq(
    { id: 'ma-q-033', subtopic: 'deal-structures', difficulty: 'basic', pools: ['pre', 'post'] },
    'What are the trade-offs between a broad auction and a negotiated sale?',
    [
      ['A broad auction maximizes competition and price tension but takes longer and risks leaks; a negotiated sale with one buyer is faster and more confidential but may leave value on the table', 'Targeted auctions sit in between.', true],
      ['A negotiated sale always gets the highest price', 'Less competition usually means less price tension.'],
      ['Broad auctions are always confidential', 'More bidders means more leak risk.'],
      ['There is no difference', 'The process shapes price, speed and confidentiality.'],
    ],
    'Price tension vs. speed and confidentiality.',
  ),
  order(
    { id: 'ma-q-034', subtopic: 'deal-structures', difficulty: 'intermediate', pools: ['post'] },
    'Put the stages of a sell-side auction in order.',
    [
      'Prepare materials (teaser, CIM, model) and the buyer list',
      'Contact buyers; sign NDAs and send the CIM',
      'Receive first-round non-binding indications of interest',
      'Management presentations and data-room diligence',
      'Receive final binding bids and purchase agreement markups',
      'Sign the definitive agreement',
      'Obtain regulatory and shareholder approvals, then close',
    ],
    'Prep → marketing → first round → diligence → final bids → sign → close.',
  ),
  mcq(
    { id: 'ma-q-035', subtopic: 'deal-structures', difficulty: 'advanced', pools: ['mock'] },
    'What is a fairness opinion?',
    [
      ['A bank’s opinion to a board that the consideration in a deal is fair, from a financial point of view, to the shareholders', 'It is backed by valuation analysis (comps, precedents, DCF) and supports the board’s decision.', true],
      ['A legal opinion that the deal complies with antitrust law', 'That’s for lawyers and regulators.'],
      ['An audit of the target’s financial statements', 'That’s for accountants.'],
      ['A guarantee that the deal will close', 'It guarantees nothing about closing.'],
    ],
    'Financial point of view, to the board.',
  ),
  mcq(
    { id: 'ma-q-036', subtopic: 'deal-structures', difficulty: 'elite', pools: ['mock'] },
    'What is a reverse termination fee?',
    [
      ['A fee the buyer pays the target if the deal fails for buyer-side reasons, such as financing failure or regulatory blocks', 'It protects the target, which took itself off the market; common in sponsor deals and antitrust-heavy deals.', true],
      ['A fee the target pays if it accepts a better offer', 'That’s a (regular) termination or breakup fee.'],
      ['A refund of the bankers’ fees', 'Not what it is.'],
      ['A fee paid when the deal closes early', 'Unrelated.'],
    ],
    'Breakup fee: target → buyer. Reverse termination fee: buyer → target.',
  ),
  mcq(
    { id: 'ma-q-037', subtopic: 'deal-structures', difficulty: 'advanced', pools: ['mock'] },
    'What is a breakup (termination) fee, and roughly how large is it?',
    [
      ['A fee the target pays the buyer if it walks away, e.g. for a superior offer; often around 2–4% of equity value', 'It compensates the buyer and discourages, without fully blocking, competing bids.', true],
      ['A fee the buyer pays the target; usually 20–30% of the deal value', 'That’s far too large and describes the wrong direction.'],
      ['A fee paid to regulators', 'Not a regulatory fee.'],
      ['A fee for splitting a company into parts', 'Unrelated to spin-offs.'],
    ],
    'Small enough to keep the auction open, large enough to compensate.',
  ),

  // ── Verbal ──
  free(
    { id: 'ma-q-038', subtopic: 'accretion-dilution', difficulty: 'basic', pools: ['mock'], followUps: ['ma-q-003', 'ma-q-010'] },
    'Walk me through an accretion/dilution analysis.',
    [
      ['inputs', 'Start with the purchase price and how it’s funded (cash, debt, stock)', [['purchase price|offer price', 'cash|debt|stock']]],
      ['ni', 'Combine net incomes, subtract foregone interest on cash and after-tax interest on new debt, add synergies', [['net income', 'interest|synerg*']]],
      ['shares', 'Add any new shares issued to the acquirer’s share count', [['new shares|shares issued|share count']]],
      ['compare', 'Compare pro forma EPS to standalone EPS', [['pro forma', 'eps']]],
    ],
    'You start with the purchase price and how it’s funded: cash on hand, new debt or stock. Then you combine the acquirer’s and target’s net income, subtract the after-tax interest lost on cash used and the after-tax interest on any new debt, and add after-tax synergies, along with adjustments like new D&A from asset write-ups. Then you add any new shares issued to the acquirer’s share count. Finally you divide pro forma net income by pro forma shares and compare that pro forma EPS to the acquirer’s standalone EPS: higher is accretive, lower is dilutive.',
    'Price and funding → pro forma net income → pro forma shares → compare EPS.',
  ),
  free(
    { id: 'ma-q-039', subtopic: 'ppa-goodwill', difficulty: 'intermediate', pools: ['mock'] },
    'How is goodwill created in an acquisition, and what happens to it afterwards?',
    [
      ['create', 'Goodwill = purchase price minus the fair value of identifiable net assets', [['purchase price', 'fair value']]],
      ['writeups', 'Asset write-ups (and their DTLs) change the amount', [['write up*|written up|write-up*', 'deferred tax|dtl|intangible*']]],
      ['after', 'Afterwards it isn’t amortized (US GAAP public companies) but tested for impairment', [['impair*']]],
    ],
    'Goodwill is the excess of the purchase price over the fair value of the target’s identifiable net assets. The buyer first writes the target’s assets up to fair value and recognizes new intangibles like customer relationships, and in a stock deal records a deferred tax liability on those write-ups; whatever’s left over is goodwill. Afterwards, for a US public company, goodwill isn’t amortized: it’s tested for impairment at least once a year, and if the acquired business is worth less than its carrying value, the company records an impairment charge.',
    'Creation, then accounting afterwards.',
    45,
  ),
  free(
    { id: 'ma-q-040', subtopic: 'consideration', difficulty: 'advanced', pools: ['mock'], followUps: ['ma-q-029'] },
    'Why would a company choose to pay with stock rather than cash?',
    [
      ['valuation', 'Its own stock is richly valued, so it’s a cheap currency', [['valued|valuation|expensive|overvalued|high p e|p/e']]],
      ['balance', 'To preserve cash or avoid taking on too much debt', [['cash|debt|leverage|balance sheet']]],
      ['size', 'The deal is too large to fund with cash or debt', [['large|size']]],
      ['risk', 'To share risk and upside with the target’s shareholders (and they may get tax deferral)', [['risk|upside|tax']]],
    ],
    'A company might use stock if its shares are richly valued, because then it’s a relatively cheap currency compared with its earnings yield. Stock also preserves cash and avoids taking on too much debt, which matters if the deal is large relative to the acquirer’s size. And it shares risk with the target’s shareholders, who participate in the upside and synergies, and who may be able to defer tax in a stock deal. The trade-off is dilution, so the deal is more likely to be EPS-dilutive.',
    'Valuation, balance sheet, size, risk-sharing.',
    45,
  ),
];
