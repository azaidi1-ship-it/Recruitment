import type { Question } from '../../../types/questions';
import { builders } from '../../helpers';

const { mcq, num, rapid, order, free } = builders('ev-equity');

export const questions: Question[] = [
  // ── Definitions ──
  mcq(
    { id: 'ev-q-001', subtopic: 'definitions', difficulty: 'basic', pools: ['pre', 'post'] },
    'What does enterprise value represent?',
    [
      ['The value of a company’s core operations to all of its capital providers: equity, debt and other claims', 'EV is capital-structure neutral: it values the business itself, whoever funds it.', true],
      ['The company’s market capitalization', 'Market cap is (roughly) equity value: the value to common shareholders only.'],
      ['The book value of the company’s total assets', 'EV is a market value of operations, not an accounting total.'],
      ['Equity value plus cash', 'Cash is subtracted from equity value (with debt added) to get EV, not added.'],
    ],
    'EV = value of the operating business to everyone with a claim on it.',
  ),
  mcq(
    { id: 'ev-q-002', subtopic: 'definitions', difficulty: 'basic', pools: ['pre', 'post'] },
    'What does equity value represent?',
    [
      ['The value of the company to its common shareholders only', 'Equity value = diluted shares × share price. It includes everything the company owns, including cash, net of everything owed to others.', true],
      ['The value of the company to debt and equity holders combined', 'That describes enterprise value.'],
      ['Shareholders’ equity on the balance sheet', 'That is book value of equity. Equity value is a market value.'],
      ['The value of the company’s operating assets only', 'That is closer to enterprise value; equity value also reflects cash and debt.'],
    ],
    'Equity value is what common shareholders own; enterprise value is what the operations are worth to all investors.',
  ),
  mcq(
    { id: 'ev-q-043', subtopic: 'definitions', difficulty: 'intermediate', pools: ['pre', 'post'] },
    'How does equity value differ from market capitalization in a banker’s analysis?',
    [
      ['Equity value uses diluted shares (options, RSUs, convertibles); market cap usually uses basic shares', 'Bankers use the diluted count because in-the-money securities would claim part of the equity.', true],
      ['Market cap includes debt; equity value doesn’t', 'Neither includes debt.'],
      ['Equity value uses book value; market cap uses market value', 'Both use the market share price.'],
      ['They are always identical', 'They differ whenever there are dilutive securities.'],
    ],
    'Equity value = share price × fully diluted shares.',
  ),
  mcq(
    { id: 'ev-q-011', subtopic: 'definitions', difficulty: 'intermediate', pools: ['post', 'mock'] },
    'Can enterprise value be negative?',
    [
      ['Yes, if a company’s cash exceeds its equity value plus debt and other claims', 'It happens with cash-rich companies the market values below their cash, often because it expects the cash to be burned or trapped.', true],
      ['No, enterprise value is always positive', 'Nothing prevents cash from exceeding equity value plus debt.'],
      ['Only if equity value is negative', 'Equity value can’t be negative; EV can be negative even with positive equity value.'],
      ['Only for private companies', 'It is observed in public markets too.'],
    ],
    'Negative EV means the market values the operations at less than zero, usually because it expects losses to consume the cash.',
  ),
  mcq(
    { id: 'ev-q-012', subtopic: 'definitions', difficulty: 'intermediate', pools: ['post'] },
    'Can equity value be negative?',
    [
      ['Market equity value can’t (shareholders have limited liability), but book equity can', 'The share price floors at zero. Book equity can be negative from accumulated losses or buybacks funded by debt.', true],
      ['Yes, whenever debt exceeds assets', 'That can make book equity negative, but the market value of equity stops at zero.'],
      ['Yes, whenever net income is negative', 'Losses don’t make the share price negative.'],
      ['No, and book equity can’t be negative either', 'Book equity can be negative.'],
    ],
    'Distinguish market equity value (≥ 0) from book shareholders’ equity (can be negative).',
  ),
  mcq(
    { id: 'ev-q-036', subtopic: 'definitions', difficulty: 'advanced', pools: ['mock'] },
    'When calculating enterprise value, should you use the book value or market value of debt?',
    [
      ['Market value in theory; book value is common in practice unless the debt trades far from par', 'For healthy companies the two are close. For distressed companies, market value matters because the debt trades at a big discount.', true],
      ['Always book value, because that is what the company owes', 'For distressed companies book value overstates the claim that a buyer could settle at market prices.'],
      ['Always face value plus accrued interest', 'Accrued interest is usually immaterial and not standard in the bridge.'],
      ['Neither: debt is excluded from enterprise value', 'Debt is a core part of the bridge.'],
    ],
    'Say “market value in theory, book value in practice unless distressed” and you’ve covered it.',
  ),

  // ── The bridge ──
  num(
    { id: 'ev-q-003', subtopic: 'ev-bridge', difficulty: 'basic', pools: ['pre', 'post'] },
    'The share price is $25 and there are 80 diluted shares. The company has $600 of debt and $150 of cash. What is enterprise value?',
    2450,
    ['Equity value = 25 × 80 = 2,000', 'EV = 2,000 + 600 − 150 = 2,450'],
    'EV = equity value + debt − cash.',
  ),
  mcq(
    { id: 'ev-q-004', subtopic: 'ev-bridge', difficulty: 'basic', pools: ['pre', 'post'] },
    'Why do you subtract cash when calculating enterprise value?',
    [
      ['Cash is a non-operating asset: EV values the core business, and a buyer effectively gets the cash back', 'An acquirer could use the target’s cash to pay down debt or reduce the net cost of the deal.', true],
      ['Because cash is a liability', 'Cash is an asset.'],
      ['Because cash is already counted in debt', 'Debt and cash are separate balance sheet items.'],
      ['Because cash is taxed when it is distributed', 'Taxes on distribution aren’t the reason; the point is that cash isn’t part of operations.'],
    ],
    'EV strips out non-operating assets like cash so it reflects only the operating business.',
  ),
  mcq(
    { id: 'ev-q-005', subtopic: 'ev-bridge', difficulty: 'intermediate', pools: ['post'] },
    'Why do you add noncontrolling interest (minority interest) to get to enterprise value?',
    [
      ['The parent consolidates 100% of a majority-owned subsidiary’s revenue and EBITDA, so EV must include the part it doesn’t own', 'Adding NCI keeps the numerator (EV) consistent with the denominator (consolidated EBITDA) in EV/EBITDA.', true],
      ['Because minority shareholders have a claim senior to debt', 'NCI is equity in the subsidiary; it isn’t senior to debt.'],
      ['Because NCI is a form of cash', 'NCI is an equity claim, not cash.'],
      ['To account for equity-method investments', 'Equity investments are subtracted, for the opposite reason.'],
    ],
    'Consistency: consolidated metrics include 100% of the subsidiary, so EV should too.',
  ),
  mcq(
    { id: 'ev-q-006', subtopic: 'ev-bridge', difficulty: 'intermediate', pools: ['post', 'mock'] },
    'Why do you subtract equity-method investments (stakes of roughly 20–50%) when calculating enterprise value?',
    [
      ['Their revenue and EBITDA aren’t in the company’s consolidated figures, so their value shouldn’t be in EV either', 'Only the company’s share of the investee’s net income appears, below EBITDA. Subtracting keeps EV/EBITDA consistent.', true],
      ['Because they are a liability', 'They are assets.'],
      ['Because they are consolidated at 100%', 'Equity-method investments are not consolidated; majority-owned subsidiaries are.'],
      ['Because they are always worth zero', 'They have value; it just doesn’t belong in an EV paired with consolidated EBITDA.'],
    ],
    'Equity investments are non-operating from the perspective of consolidated EBITDA, like cash.',
  ),
  mcq(
    { id: 'ev-q-007', subtopic: 'ev-bridge', difficulty: 'intermediate', pools: ['post'] },
    'How is preferred stock treated in the bridge from equity value to enterprise value?',
    [
      ['Add it: it’s a claim senior to common equity, with fixed dividends and a liquidation preference, much like debt', 'An acquirer typically must pay off or assume it.', true],
      ['Subtract it, like cash', 'It’s a claim on the company, not an asset.'],
      ['Ignore it, because it’s equity', 'It is equity legally, but economically it behaves like debt.'],
      ['Include it in diluted shares at its liquidation preference', 'Only convertible preferred that is in the money would be treated as shares.'],
    ],
    'Preferred stock is added to equity value along with debt and NCI.',
  ),
  mcq(
    { id: 'ev-q-008', subtopic: 'ev-bridge', difficulty: 'advanced', pools: ['mock'] },
    'Under US GAAP (ASC 842), operating leases appear on the balance sheet. Should operating lease liabilities be added to enterprise value?',
    [
      ['Only if you also use a metric that excludes lease expense, such as EBITDAR; otherwise most bankers leave them out', 'Under US GAAP operating lease cost sits inside operating expenses, so EBITDA is already after rent. Adding the liability to EV without adjusting EBITDA would be inconsistent.', true],
      ['Always: all balance sheet liabilities belong in enterprise value', 'Operating liabilities like accounts payable are not added; consistency with the metric matters.'],
      ['Never: leases are off-balance sheet', 'Since ASC 842 they are on the balance sheet.'],
      ['Yes, and subtract the right-of-use asset as well', 'The ROU asset is an operating asset; you wouldn’t subtract it.'],
    ],
    'The rule is consistency: if a claim’s cost is below the metric (like interest), add the claim; if its cost is already in the metric (like rent in EBITDA), don’t.',
  ),
  num(
    { id: 'ev-q-009', subtopic: 'ev-bridge', difficulty: 'intermediate', pools: ['post', 'mock'] },
    'Equity value is $5,000. The company has $1,500 of debt, $300 of preferred stock, $200 of noncontrolling interest, $700 of cash and $400 of equity-method investments. What is enterprise value?',
    5900,
    ['Add debt, preferred and NCI: 5,000 + 1,500 + 300 + 200 = 7,000', 'Subtract cash and equity investments: 7,000 − 700 − 400 = 5,900'],
    'Add claims on the business; subtract non-operating assets.',
  ),
  num(
    { id: 'ev-q-010', subtopic: 'ev-bridge', difficulty: 'advanced', pools: ['mock'] },
    'A company has an enterprise value of $4,000, debt of $1,200, cash of $500 and preferred stock of $100. It has 160 diluted shares. What is the implied share price?',
    20,
    ['Equity value = EV − debt − preferred + cash = 4,000 − 1,200 − 100 + 500 = 3,200', 'Share price = 3,200 / 160 = 20'],
    'Run the bridge backwards: subtract claims, add back cash.',
  ),
  mcq(
    { id: 'ev-q-037', subtopic: 'ev-bridge', difficulty: 'intermediate', pools: ['post'] },
    'Should unfunded pension obligations be included in the bridge to enterprise value?',
    [
      ['Often yes: an unfunded pension is a debt-like claim, usually added (sometimes after tax), as long as the treatment matches EBITDA', 'Contributions to fix the deficit are cash the company owes; many banks treat the after-tax deficit as debt.', true],
      ['No, pensions are an operating cost already in EBITDA', 'Service cost is operating, but the unfunded deficit is a separate claim.'],
      ['Only for companies in the UK', 'Pension deficits matter wherever there are defined-benefit plans.'],
      ['Yes, and it should be subtracted like cash', 'A deficit is an obligation, so it is added, not subtracted.'],
    ],
    'Treat any debt-like claim (pension deficits, some contingent liabilities) consistently with how its cost flows through your metric.',
  ),
  order(
    { id: 'ev-q-025', subtopic: 'ev-bridge', difficulty: 'basic', pools: ['pre'] },
    'Put the steps from share price to enterprise value in order.',
    [
      'Start with the share price',
      'Calculate the diluted share count (treasury stock method)',
      'Multiply to get equity value',
      'Add debt, preferred stock and noncontrolling interest',
      'Subtract cash and non-operating assets such as equity investments',
      'The result is enterprise value',
    ],
    'Price × diluted shares = equity value; + claims − non-operating assets = EV.',
  ),
  mcq(
    { id: 'ev-q-026', subtopic: 'ev-bridge', difficulty: 'intermediate', pools: ['post', 'mock'], followUps: ['ev-q-027', 'ev-q-028'] },
    'A company raises $100 of debt and keeps the proceeds as cash. What happens to its equity value and enterprise value?',
    [
      ['Both stay the same', 'Equity value: no change in shares or (in theory) price. EV: debt +100 and cash +100 cancel.', true],
      ['Enterprise value rises by $100', 'The extra debt is offset by the extra cash.'],
      ['Equity value falls by $100', 'Shareholders gained $100 of cash and $100 of debt: no net change.'],
      ['Both rise by $100', 'Neither changes.'],
    ],
    'Raising and holding cash changes neither: debt and cash offset in the bridge.',
  ),
  mcq(
    { id: 'ev-q-027', subtopic: 'ev-bridge', difficulty: 'advanced', pools: ['mock'] },
    'Now the company uses that $100 of new debt to buy back $100 of its stock. What happens to equity value and enterprise value?',
    [
      ['Equity value falls by $100; enterprise value is unchanged', 'Fewer shares (at the same price in theory) means equity −100; debt +100 offsets it in EV.', true],
      ['Both fall by $100', 'EV doesn’t change: the operations are the same.'],
      ['Equity value is unchanged; EV rises by $100', 'The buyback reduces equity value.'],
      ['Both are unchanged', 'Equity value falls because shares were retired.'],
    ],
    'Recapitalizations shift value between debt and equity but leave the operations, and EV, unchanged.',
  ),
  mcq(
    { id: 'ev-q-028', subtopic: 'ev-bridge', difficulty: 'advanced', pools: ['mock'] },
    'The company instead pays a $50 dividend from existing cash. What happens to equity value and enterprise value?',
    [
      ['Equity value falls by $50; enterprise value is unchanged', 'In theory the share price drops by the dividend per share; cash −50 and equity value −50 cancel in the bridge.', true],
      ['Enterprise value falls by $50', 'Cash leaving doesn’t change the value of operations.'],
      ['Equity value is unchanged because shareholders received the cash', 'Shareholders are no worse off in total, but the company’s equity value falls.'],
      ['Both rise by $50', 'Nothing rises.'],
    ],
    'Paying out cash reduces equity value; EV is unchanged because cash is excluded from it anyway.',
  ),
  mcq(
    { id: 'ev-q-029', subtopic: 'ev-bridge', difficulty: 'elite', pools: ['mock'] },
    'A company issues $200 of new shares at the market price and uses the cash to acquire another business for $200 (a fair price). What happens to equity value and enterprise value?',
    [
      ['Both rise by $200', 'Equity value +200 from new shares. The cash came in and went out, but the company now owns $200 more of operations, so EV +200 too.', true],
      ['Equity value rises by $200; EV is unchanged', 'EV rises because the company has acquired new operations.'],
      ['Neither changes because the cash went in and out', 'The cash is a wash, but the new business adds operating value.'],
      ['EV rises by $200; equity value is unchanged', 'New shares were issued, so equity value rises.'],
    ],
    'EV changes only when the operations change. Financing and cash movements alone don’t move it.',
  ),

  // ── Diluted shares ──
  mcq(
    { id: 'ev-q-013', subtopic: 'diluted-shares', difficulty: 'basic', pools: ['pre', 'post'] },
    'Why do bankers use diluted shares rather than basic shares to calculate equity value?',
    [
      ['In-the-money options, RSUs and convertibles could become shares and claim part of the equity', 'Ignoring them would overstate value per share for existing holders.', true],
      ['Because basic shares are not disclosed', 'Basic shares are disclosed on every 10-K and 10-Q cover.'],
      ['Because diluted shares are always lower', 'Diluted shares are always at least as high as basic.'],
      ['To make the company look cheaper', 'It is about accuracy, not presentation.'],
    ],
    'Diluted share count captures every security likely to become common stock.',
  ),
  num(
    { id: 'ev-q-014', subtopic: 'diluted-shares', difficulty: 'intermediate', pools: ['pre', 'post'], followUps: ['ev-q-041'] },
    'The share price is $40 and there are 100 million basic shares. There are 12 million options with a $20 strike. Using the treasury stock method, what is the diluted share count (in millions)?',
    106,
    ['Options are in the money (20 < 40): +12m shares', 'Proceeds = 12m × $20 = $240m', 'Shares repurchased = 240 / 40 = 6m', 'Net new shares = 12 − 6 = 6m', 'Diluted = 100 + 6 = 106m'],
    'TSM: add ITM options, assume the exercise proceeds buy back shares at the current price.',
    { unit: 'm shares' },
  ),
  num(
    { id: 'ev-q-015', subtopic: 'diluted-shares', difficulty: 'advanced', pools: ['post', 'mock'] },
    'The share price is $30 with 50 million basic shares. Options outstanding: 4 million at a $15 strike, 3 million at $25 and 2 million at $35. What is the diluted share count (in millions)?',
    52.5,
    [
      'The $35 tranche is out of the money: exclude it',
      'ITM options: 4 + 3 = 7m; proceeds = 4 × 15 + 3 × 25 = 60 + 75 = $135m',
      'Repurchased = 135 / 30 = 4.5m',
      'Net new = 7 − 4.5 = 2.5m; diluted = 52.5m',
    ],
    'Apply TSM tranche by tranche, excluding out-of-the-money options.',
    { unit: 'm shares', tolerance: { kind: 'abs', value: 0.05 } },
  ),
  mcq(
    { id: 'ev-q-016', subtopic: 'diluted-shares', difficulty: 'intermediate', pools: ['post'] },
    'How are out-of-the-money options treated in the treasury stock method?',
    [
      ['They are excluded: no one would exercise them at today’s price', 'Exercising an option with a strike above the share price would lose money.', true],
      ['They are included at full count', 'Only in-the-money options are assumed exercised.'],
      ['They are included at half count', 'There is no partial treatment in the standard TSM.'],
      ['They are subtracted from basic shares', 'They don’t reduce the share count.'],
    ],
    'Only in-the-money instruments are counted.',
  ),
  mcq(
    { id: 'ev-q-017', subtopic: 'diluted-shares', difficulty: 'intermediate', pools: ['post'] },
    'Under the treasury stock method, what is the company assumed to do with the cash from option exercises?',
    [
      ['Repurchase shares at the current share price', 'This offsets part of the dilution: net new shares = options − proceeds / share price.', true],
      ['Pay a special dividend', 'The method assumes a buyback, not a dividend.'],
      ['Repay debt', 'The method assumes a buyback.'],
      ['Hold it as cash and add it to equity value', 'That is a different (and less standard) approach.'],
    ],
    'Proceeds buy back shares at today’s price.',
  ),
  mcq(
    { id: 'ev-q-018', subtopic: 'diluted-shares', difficulty: 'advanced', pools: ['mock'] },
    'How are restricted stock units (RSUs) treated in the diluted share count?',
    [
      ['Add them in full: they have no exercise price, so there are no proceeds to repurchase shares with', 'RSUs convert into shares at vesting for free.', true],
      ['Apply the TSM using the grant-date price as the strike', 'RSUs have no strike price.'],
      ['Exclude them until they vest', 'Bankers generally include outstanding RSUs because they are expected to vest.'],
      ['Add half of them', 'There is no convention for partial inclusion.'],
    ],
    'RSUs are simply added to the share count.',
  ),
  rapid(
    { id: 'ev-q-035', subtopic: 'diluted-shares', difficulty: 'intermediate', pools: ['pre'] },
    'The share price is $50. There are 2 million options with a $25 strike. How many net new shares does the TSM add (in millions)?',
    1,
    'Proceeds = 2 × 25 = 50; repurchase 50 / 50 = 1; net new = 2 − 1 = 1.',
    { unit: 'm shares', seconds: 20 },
  ),
  mcq(
    { id: 'ev-q-040', subtopic: 'diluted-shares', difficulty: 'elite', pools: ['mock'] },
    'In an acquisition, which share price should you use in the treasury stock method to calculate the target’s diluted shares?',
    [
      ['The offer price', 'The offer price determines which options are in the money and how many shares the buyer must pay for. Options out of the money today can be in the money at the offer.', true],
      ['The current trading price', 'That’s right for trading comps but not for the deal: the buyer pays the offer price.'],
      ['The 52-week high', 'The 52-week high has no role in the calculation.'],
      ['The average of the current and offer prices', 'There is no such convention.'],
    ],
    'For deal math, run the TSM at the offer price.',
  ),
  num(
    { id: 'ev-q-041', subtopic: 'diluted-shares', difficulty: 'elite', pools: ['mock'] },
    'An acquirer offers $30 per share. The target has 40 million basic shares and trades at $24. Options: 5 million at an $18 strike and 3 million at $28. What is the diluted share count at the offer price (in millions)?',
    42.2,
    [
      'At the $30 offer, both tranches are in the money (the $28 tranche is out of the money at $24, but in at $30)',
      'Options: 5 + 3 = 8m; proceeds = 5 × 18 + 3 × 28 = 90 + 84 = $174m',
      'Repurchased at the offer price: 174 / 30 = 5.8m',
      'Net new = 8 − 5.8 = 2.2m; diluted = 40 + 2.2 = 42.2m',
    ],
    'Using the trading price would wrongly exclude the $28 tranche.',
    { unit: 'm shares', tolerance: { kind: 'abs', value: 0.05 } },
  ),

  // ── Convertibles ──
  num(
    { id: 'ev-q-019', subtopic: 'convertibles', difficulty: 'intermediate', pools: ['post', 'mock'], followUps: ['ev-q-020'] },
    'A company has $200 million of convertible bonds with a conversion price of $40. The share price is $50. How many additional shares should be included in the diluted count (in millions)?',
    5,
    ['Conversion is in the money (50 > 40)', 'Shares on conversion = 200 / 40 = 5m'],
    'In-the-money convertibles are treated as converted (if-converted method).',
    { unit: 'm shares' },
  ),
  mcq(
    { id: 'ev-q-020', subtopic: 'convertibles', difficulty: 'advanced', pools: ['mock'] },
    'If a convertible bond is in the money, how should it be treated in the bridge to enterprise value?',
    [
      ['Count the conversion shares in diluted equity value and do not also add the bond as debt', 'Counting it twice would overstate EV. If it’s out of the money, treat it as debt instead.', true],
      ['Add it as debt and also count the conversion shares', 'That double-counts the same claim.'],
      ['Ignore it entirely', 'It is a real claim on the company either way.'],
      ['Subtract it like cash', 'It is a claim, not an asset.'],
    ],
    'A convertible is either shares (ITM) or debt (OTM), never both.',
  ),
  num(
    { id: 'ev-q-021', subtopic: 'convertibles', difficulty: 'elite', pools: ['mock'] },
    'Share price $60; 100 million basic shares; 6 million options at a $30 strike; 1 million RSUs; and $300 million of convertible bonds with a $50 conversion price. What is diluted equity value (in $ millions)?',
    6600,
    [
      'Options (ITM): 6m; proceeds 6 × 30 = 180; repurchased 180 / 60 = 3m; net +3m',
      'RSUs: +1m',
      'Convertible (ITM, 60 > 50): 300 / 50 = +6m',
      'Diluted shares = 100 + 3 + 1 + 6 = 110m',
      'Equity value = 110 × 60 = 6,600',
    ],
    'Handle each security separately, then add them up. Remember the convertible is then excluded from debt.',
    { unit: '$m', tolerance: { kind: 'pct', value: 0.5 } },
  ),

  // ── Multiples ──
  mcq(
    { id: 'ev-q-022', subtopic: 'multiples-pairing', difficulty: 'basic', pools: ['pre', 'post'] },
    'Which of these multiples uses equity value in the numerator?',
    [
      ['P/E (price-to-earnings)', 'Price per share (equity) over earnings per share (after interest, so belonging to equity holders).', true],
      ['EV/EBITDA', 'Enterprise value is in the numerator.'],
      ['EV/Revenue', 'Enterprise value is in the numerator.'],
      ['EV/EBIT', 'Enterprise value is in the numerator.'],
    ],
    'Equity-value multiples pair with metrics after interest: net income, EPS, levered FCF, book value.',
  ),
  mcq(
    { id: 'ev-q-023', subtopic: 'multiples-pairing', difficulty: 'intermediate', pools: ['pre', 'post'] },
    'Why is EV / net income an inconsistent multiple?',
    [
      ['Net income is after interest, so it belongs only to equity holders, while EV represents all capital providers', 'Numerator and denominator must refer to the same investors.', true],
      ['Because net income can be negative', 'True but beside the point; the issue is mismatched claims.'],
      ['Because EV is a market value and net income is accounting', 'Every multiple mixes a market value with an accounting metric.'],
      ['Because net income includes taxes', 'EBIT-based metrics can be after-tax too (e.g. NOPAT); the issue is interest.'],
    ],
    'Match the metric to the investors: EV with pre-interest metrics, equity value with post-interest metrics.',
  ),
  mcq(
    { id: 'ev-q-024', subtopic: 'multiples-pairing', difficulty: 'intermediate', pools: ['post', 'mock'] },
    'Which metric pairs correctly with enterprise value?',
    [
      ['EBITDA', 'EBITDA is before interest, so it is available to all capital providers.', true],
      ['Levered free cash flow', 'Levered FCF is after interest and debt repayment: it belongs to equity.'],
      ['Net income', 'Net income is after interest: an equity metric.'],
      ['Earnings per share', 'EPS is an equity, per-share metric.'],
    ],
    'EV pairs with revenue, EBITDA, EBIT and unlevered FCF.',
  ),
  mcq(
    { id: 'ev-q-042', subtopic: 'multiples-pairing', difficulty: 'basic', pools: ['pre', 'post'] },
    'When is EV/Revenue most useful?',
    [
      ['For companies with negative or tiny EBITDA, such as early-stage high-growth businesses', 'If EBITDA is negative, EV/EBITDA is meaningless, but revenue is still a usable base.', true],
      ['For banks and insurers', 'Financial institutions are valued on P/E and P/BV.'],
      ['For mature companies with stable margins', 'For those, EV/EBITDA or P/E captures profitability better.'],
      ['Never: revenue multiples are not used', 'They are widely used for software and other growth companies.'],
    ],
    'Revenue multiples ignore profitability, so use them only when profit metrics aren’t meaningful.',
  ),
  num(
    { id: 'ev-q-038', subtopic: 'multiples-pairing', difficulty: 'advanced', pools: ['mock'] },
    'A company has an enterprise value of $1,000, net debt of $400 and net income of $60. What is its P/E multiple?',
    10,
    ['Equity value = EV − net debt = 1,000 − 400 = 600', 'P/E = 600 / 60 = 10x'],
    'Convert EV to equity value before using an equity multiple.',
    { unit: 'x', tolerance: { kind: 'abs', value: 0.05 } },
  ),
  num(
    { id: 'ev-q-039', subtopic: 'multiples-pairing', difficulty: 'intermediate', pools: ['post'] },
    'EBITDA is $200 and peers trade at 9.0x EV/EBITDA. The company has net debt of $500 and 65 diluted shares. What is the implied share price?',
    20,
    ['EV = 9 × 200 = 1,800', 'Equity value = 1,800 − 500 = 1,300', 'Share price = 1,300 / 65 = 20'],
    'Multiple → EV → subtract net debt → divide by diluted shares.',
  ),
  rapid(
    { id: 'ev-q-033', subtopic: 'ev-bridge', difficulty: 'basic', pools: ['post'] },
    'Equity value is $800 and net debt is $200. What is enterprise value?',
    1000,
    'EV = 800 + 200 = 1,000.',
  ),
  rapid(
    { id: 'ev-q-034', subtopic: 'multiples-pairing', difficulty: 'basic', pools: ['post', 'mock'] },
    'Enterprise value is $1,200 and EBITDA is $150. What is EV/EBITDA?',
    8,
    '1,200 / 150 = 8.0x.',
    { unit: 'x' },
  ),

  // ── Verbal ──
  free(
    { id: 'ev-q-030', subtopic: 'definitions', difficulty: 'basic', pools: ['mock'], followUps: ['ev-q-031', 'ev-q-032'] },
    'What’s the difference between equity value and enterprise value?',
    [
      ['eq', 'Equity value: the value to common shareholders, diluted shares × share price', [['equity value', 'shareholders|shares']]],
      ['ev', 'Enterprise value: the value of the core operations to all investors (debt and equity)', [['enterprise value', 'operations|operating|core|business']]],
      ['bridge', 'Bridge: add debt, preferred and noncontrolling interest; subtract cash', [['debt', 'cash', 'add|plus', 'subtract|minus|less']]],
      ['why', 'EV is independent of capital structure, so it’s used to compare companies (EV/EBITDA)', [['capital structure'], ['compar*']]],
    ],
    'Equity value is the value of the company to its common shareholders: diluted shares times the share price. Enterprise value is the value of the core business operations to all investors, both debt and equity. To get from equity value to enterprise value you add debt, preferred stock and noncontrolling interest, and subtract cash and other non-operating assets. Because enterprise value doesn’t depend on how a company is financed, it’s what we use to compare companies with different capital structures, for example with EV/EBITDA.',
    'Define both, give the bridge, and say why EV is useful.',
    45,
  ),
  free(
    { id: 'ev-q-031', subtopic: 'ev-bridge', difficulty: 'intermediate', pools: ['mock'] },
    'Why do we add debt and subtract cash to get from equity value to enterprise value?',
    [
      ['debt', 'Debt is another claim on the business: an acquirer must assume or repay it', [['debt', 'repay|assume|claim|pay off']]],
      ['cash', 'Cash is a non-operating asset; the buyer effectively gets it back, reducing the net cost', [['cash', 'non operating|non-operating|offset|get it back|gets it back|reduce*']]],
      ['neutral', 'The goal is the value of the operations regardless of how they’re financed', [['operations|operating|core business'], ['capital structure|financed|financing']]],
      ['analogy', 'An analogy or example (e.g. buying a house with a mortgage)', [['house|home|mortgage'], ['for example|e.g.|imagine']]],
    ],
    'Enterprise value is meant to capture the value of the core operations, regardless of how they’re financed. Debt is another claim on those operations, so if you bought the company you’d have to repay or assume it; it gets added. Cash is a non-operating asset: when you buy the company you get its cash, which offsets part of what you paid, so it gets subtracted. It’s like buying a house: the true cost is your down payment plus the mortgage you take over, less any cash left in the house.',
    'Interviewers like the house analogy, but the key is “claims on operations” versus “non-operating assets”.',
    45,
  ),
  free(
    { id: 'ev-q-032', subtopic: 'multiples-pairing', difficulty: 'advanced', pools: ['mock'] },
    'Why is P/E affected by a company’s capital structure while EV/EBITDA isn’t?',
    [
      ['ni', 'Net income is after interest, so more debt changes it', [['interest', 'net income|earnings'], ['after interest']]],
      ['ebitda', 'EBITDA is before interest, so it doesn’t depend on financing', [['ebitda', 'before interest|pre interest']]],
      ['ev', 'EV includes debt, so a recap shifts value between debt and equity without changing EV', [['ev|enterprise value', 'debt']]],
      ['compare', 'That’s why EV/EBITDA is better for comparing companies with different leverage', [['compar*'], ['leverage|levered']]],
    ],
    'P/E uses net income, which is after interest expense, so if a company adds debt its interest goes up, its earnings change and so does its P/E, even though the business is the same. EV/EBITDA uses EBITDA, which is before interest, and enterprise value includes debt, so a recapitalization just shifts value between debt and equity and leaves both the numerator and denominator unchanged. That’s why EV/EBITDA is better for comparing companies with different leverage.',
    'The core idea: post-interest metrics move with leverage; pre-interest metrics don’t.',
    45,
  ),
];
