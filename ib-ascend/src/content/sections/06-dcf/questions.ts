import type { Question } from '../../../types/questions';
import { builders } from '../../helpers';

const { mcq, num, rapid, order, free } = builders('dcf');

export const questions: Question[] = [
  // ── Unlevered free cash flow ──
  mcq(
    { id: 'dcf-q-001', subtopic: 'ufcf', difficulty: 'basic', pools: ['pre', 'post'] },
    'Which formula gives unlevered free cash flow?',
    [
      ['EBIT × (1 − tax rate) + D&A − capex − increase in net working capital', 'Start from after-tax operating profit (NOPAT), add back non-cash D&A, subtract reinvestment.', true],
      ['Net income + D&A − capex', 'Net income is after interest, so this is closer to levered FCF.'],
      ['EBITDA − interest − taxes', 'Unlevered FCF ignores interest and must subtract capex and working capital.'],
      ['Revenue − operating expenses', 'That is operating income, not cash flow.'],
    ],
    'UFCF = NOPAT + D&A − capex − ΔNWC.',
  ),
  num(
    { id: 'dcf-q-002', subtopic: 'ufcf', difficulty: 'intermediate', pools: ['pre', 'post'] },
    'EBIT is $200, the tax rate 25%, D&A $40, capex $60, and net working capital increases by $10. What is unlevered free cash flow?',
    120,
    ['NOPAT = 200 × (1 − 25%) = 150', '+ D&A 40 = 190', '− capex 60 = 130', '− increase in NWC 10 = 120'],
    'An increase in NWC uses cash, so subtract it.',
  ),
  num(
    { id: 'dcf-q-005', subtopic: 'ufcf', difficulty: 'advanced', pools: ['mock'] },
    'EBITDA is $500 and D&A $100. The tax rate is 25%, capex $120 and the increase in net working capital $20. What is unlevered free cash flow?',
    260,
    ['EBIT = 500 − 100 = 400', 'NOPAT = 400 × 75% = 300', '+ D&A 100 − capex 120 − ΔNWC 20 = 260'],
    'Go to EBIT first so taxes are calculated on operating profit, not EBITDA.',
  ),
  mcq(
    { id: 'dcf-q-003', subtopic: 'ufcf', difficulty: 'intermediate', pools: ['post'] },
    'Why do most DCFs use unlevered free cash flow?',
    [
      ['It is the cash available to all capital providers, so discounting it at WACC gives enterprise value, independent of capital structure', 'Debt and equity holders are both paid from it.', true],
      ['Because levered FCF can’t be calculated', 'It can; it’s used with the cost of equity to get equity value.'],
      ['Because it is always higher than levered FCF', 'It usually is (no interest), but that isn’t the reason.'],
      ['Because banks are required to use it', 'It’s a modeling choice.'],
    ],
    'Unlevered FCF + WACC → EV. Levered FCF + cost of equity → equity value.',
  ),
  mcq(
    { id: 'dcf-q-004', subtopic: 'ufcf', difficulty: 'intermediate', pools: ['post', 'mock'] },
    'Why isn’t interest expense subtracted when calculating unlevered free cash flow?',
    [
      ['Interest is a financing cost; the cost of debt is captured in the WACC instead', 'Subtracting it as well would double-count the cost of debt.', true],
      ['Interest isn’t tax-deductible', 'It is deductible; the tax shield goes into the after-tax cost of debt.'],
      ['Interest is a non-cash expense', 'Interest is paid in cash.'],
      ['Interest is already included in capex', 'Capex is unrelated.'],
    ],
    'Financing effects belong in the discount rate, not the cash flows.',
  ),
  mcq(
    { id: 'dcf-q-006', subtopic: 'ufcf', difficulty: 'intermediate', pools: ['post'] },
    'Which pairing is correct for a levered DCF?',
    [
      ['Levered FCF (after interest and debt repayments), discounted at the cost of equity, gives equity value', 'Levered FCF belongs to shareholders only.', true],
      ['Levered FCF discounted at WACC gives enterprise value', 'Mismatched: WACC is for unlevered cash flows.'],
      ['Unlevered FCF discounted at the cost of equity gives equity value', 'Mismatched cash flow and discount rate.'],
      ['Levered FCF discounted at the cost of debt gives debt value', 'Not how a levered DCF works.'],
    ],
    'Match cash flows to the investors whose return rate you use.',
  ),
  mcq(
    { id: 'dcf-q-007', subtopic: 'ufcf', difficulty: 'basic', pools: ['pre'] },
    'How long is a typical DCF projection period?',
    [
      ['About 5–10 years: long enough for the business to reach a steady state', 'High-growth companies need longer projections before a terminal value makes sense.', true],
      ['One year', 'Too short to capture growth.'],
      ['50 years', 'Forecasts that far out are guesses; the terminal value handles the long run.'],
      ['Until the company is acquired', 'There is no such convention.'],
    ],
    'Project until growth and margins stabilize.',
  ),
  mcq(
    { id: 'dcf-q-008', subtopic: 'ufcf', difficulty: 'advanced', pools: ['mock'] },
    'Should stock-based compensation be added back when calculating unlevered free cash flow?',
    [
      ['It’s debated: adding it back overstates cash flow unless you also count the dilution; many treat SBC as a real cash-like cost', 'Either don’t add it back, or add it back and include future dilution in the share count; just be consistent.', true],
      ['Always add it back, because it’s non-cash', 'Non-cash doesn’t mean free: it dilutes shareholders.'],
      ['Never include SBC anywhere in the DCF', 'It must be reflected somewhere: as a cost or as dilution.'],
      ['Add it back twice to reflect taxes', 'That’s not a valid treatment.'],
    ],
    'Strong candidates say “it depends, but be consistent”.',
  ),

  // ── WACC ──
  mcq(
    { id: 'dcf-q-009', subtopic: 'wacc', difficulty: 'basic', pools: ['pre', 'post'] },
    'Which formula gives WACC?',
    [
      ['E/(D+E) × cost of equity + D/(D+E) × cost of debt × (1 − tax rate)', 'Weights use market values; debt is tax-effected because interest is deductible.', true],
      ['Cost of equity + cost of debt', 'The costs must be weighted by the capital mix.'],
      ['(Cost of equity + cost of debt) / 2', 'An unweighted average ignores the capital structure.'],
      ['E/(D+E) × cost of equity + D/(D+E) × cost of debt × (1 + tax rate)', 'The tax shield lowers the cost of debt: (1 − t).'],
    ],
    'Weighted, market-value-based, with after-tax cost of debt.',
  ),
  num(
    { id: 'dcf-q-010', subtopic: 'wacc', difficulty: 'intermediate', pools: ['pre', 'post', 'mock'], followUps: ['dcf-q-015', 'dcf-q-013'] },
    'Equity is worth $600 and debt $400. The cost of equity is 10%, the pre-tax cost of debt 6%, and the tax rate 25%. What is WACC (in %)?',
    7.8,
    ['Weights: equity 60%, debt 40%', 'After-tax cost of debt = 6% × 0.75 = 4.5%', 'WACC = 0.6 × 10% + 0.4 × 4.5% = 6.0% + 1.8% = 7.8%'],
    'Don’t forget the tax shield on debt.',
    { unit: '%', tolerance: { kind: 'abs', value: 0.05 } },
  ),
  num(
    { id: 'dcf-q-015', subtopic: 'wacc', difficulty: 'advanced', pools: ['mock'] },
    'The capital structure is 70% equity and 30% debt. Cost of equity 12%, pre-tax cost of debt 8%, tax rate 25%. What is WACC (in %)?',
    10.2,
    ['After-tax cost of debt = 8% × 0.75 = 6.0%', 'WACC = 0.7 × 12% + 0.3 × 6% = 8.4% + 1.8% = 10.2%'],
    'Same formula, different mix.',
    { unit: '%', tolerance: { kind: 'abs', value: 0.05 } },
  ),
  mcq(
    { id: 'dcf-q-011', subtopic: 'wacc', difficulty: 'intermediate', pools: ['post'] },
    'Why is the cost of debt tax-effected in WACC?',
    [
      ['Interest is tax-deductible, so the company’s true cost of borrowing is lower by the tax shield', 'After-tax cost of debt = pre-tax cost × (1 − t).', true],
      ['Because lenders pay the company’s taxes', 'They don’t.'],
      ['Because equity is taxed twice', 'Double taxation of dividends isn’t why debt is tax-effected.'],
      ['It isn’t: WACC uses the pre-tax cost of debt', 'Standard WACC uses the after-tax cost.'],
    ],
    'The tax shield is debt’s main cost advantage.',
  ),
  mcq(
    { id: 'dcf-q-012', subtopic: 'wacc', difficulty: 'intermediate', pools: ['post', 'mock'] },
    'Should WACC use the company’s current or target capital structure?',
    [
      ['The long-run target structure (often informed by peers), at market values', 'The discount rate should reflect how the business will be financed over the projection period.', true],
      ['Always the current book-value structure', 'Book values don’t reflect what investors require today.'],
      ['Whatever structure gives the highest valuation', 'That’s not a defensible approach.'],
      ['100% equity, always', 'Only if the company will truly carry no debt.'],
    ],
    'Target, market-value weights.',
  ),
  mcq(
    { id: 'dcf-q-013', subtopic: 'wacc', difficulty: 'advanced', pools: ['mock'] },
    'A company adds more and more debt. What happens to its WACC?',
    [
      ['It falls at first, because after-tax debt is cheaper than equity, then rises as financial risk pushes up the cost of both debt and equity', 'WACC is roughly U-shaped in leverage; the optimal structure balances the tax shield against distress risk.', true],
      ['It falls forever, because debt is always cheaper', 'The cost of equity and debt both rise with leverage.'],
      ['It is unaffected by leverage', 'That’s only true in a world with no taxes or distress costs.'],
      ['It rises immediately', 'Moderate debt usually lowers WACC through the tax shield.'],
    ],
    'Tax shield vs. distress costs.',
  ),
  mcq(
    { id: 'dcf-q-014', subtopic: 'wacc', difficulty: 'intermediate', pools: ['post'] },
    'Which is usually higher, the cost of equity or the cost of debt? Why?',
    [
      ['Cost of equity: shareholders are paid last and bear more risk', 'Debt holders have contractual payments and priority in bankruptcy.', true],
      ['Cost of debt: lenders charge interest every year', 'Contractual payments make debt less risky, not more expensive.'],
      ['They are always equal', 'They differ because the risks differ.'],
      ['Cost of debt, because of taxes', 'Taxes make debt cheaper, not more expensive.'],
    ],
    'More risk → higher required return.',
  ),
  mcq(
    { id: 'dcf-q-016', subtopic: 'wacc', difficulty: 'basic', pools: ['pre'] },
    'Should WACC use market or book values for the weights of debt and equity?',
    [
      ['Market values', 'Investors require returns on what their claims are worth today.', true],
      ['Book values', 'Book equity can be far from market value (or even negative).'],
      ['Whichever is smaller', 'Not a principled approach.'],
      ['Average of the two', 'Not standard.'],
    ],
    'Market values (book value of debt is a common proxy if it trades near par).',
  ),

  // ── CAPM and beta ──
  mcq(
    { id: 'dcf-q-017', subtopic: 'capm-beta', difficulty: 'basic', pools: ['pre', 'post'] },
    'How does CAPM estimate the cost of equity?',
    [
      ['Risk-free rate + beta × equity risk premium', 'Investors require the risk-free return plus compensation for systematic risk.', true],
      ['Dividend yield + growth rate', 'That is the dividend growth model, an alternative approach.'],
      ['Cost of debt + 2%', 'An ad-hoc premium isn’t CAPM.'],
      ['Beta × risk-free rate', 'Missing the equity risk premium.'],
    ],
    'Ke = Rf + β × (Rm − Rf).',
  ),
  num(
    { id: 'dcf-q-018', subtopic: 'capm-beta', difficulty: 'intermediate', pools: ['pre', 'post', 'mock'], followUps: ['dcf-q-021', 'dcf-q-022'] },
    'The risk-free rate is 4.0%, beta is 1.2 and the equity risk premium is 5.5%. What is the cost of equity (in %)?',
    10.6,
    ['Ke = 4.0% + 1.2 × 5.5% = 4.0% + 6.6% = 10.6%'],
    'Plug into CAPM.',
    { unit: '%', tolerance: { kind: 'abs', value: 0.05 } },
  ),
  mcq(
    { id: 'dcf-q-019', subtopic: 'capm-beta', difficulty: 'intermediate', pools: ['post'] },
    'What does beta measure?',
    [
      ['How much a stock’s returns move with the overall market: its systematic (non-diversifiable) risk', 'Beta of 1.2 means the stock tends to move 1.2% for every 1% market move.', true],
      ['The total volatility of a stock', 'Beta excludes company-specific risk that diversification removes.'],
      ['The company’s leverage ratio', 'Leverage affects beta but isn’t what it measures.'],
      ['The probability of bankruptcy', 'That’s credit risk.'],
    ],
    'Only systematic risk is priced in CAPM.',
  ),
  mcq(
    { id: 'dcf-q-020', subtopic: 'capm-beta', difficulty: 'advanced', pools: ['post', 'mock'] },
    'Why do bankers unlever and relever beta?',
    [
      ['Peers’ observed betas include their own leverage; unlevering strips that out, and relevering applies the target’s capital structure', 'Leverage amplifies equity risk, so betas must be put on the same footing.', true],
      ['To remove the risk-free rate from beta', 'Beta doesn’t contain the risk-free rate.'],
      ['Because regulators require unlevered betas', 'There is no such rule.'],
      ['To convert beta into a cost of debt', 'Beta is used for the cost of equity.'],
    ],
    'Unlever peers → take median → relever at target D/E.',
  ),
  num(
    { id: 'dcf-q-021', subtopic: 'capm-beta', difficulty: 'advanced', pools: ['mock'] },
    'A peer has a levered beta of 1.5, a debt-to-equity ratio of 0.5 and a 25% tax rate. What is its unlevered beta (to 2 decimals)?',
    1.09,
    ['Unlevered beta = levered beta / (1 + (1 − t) × D/E)', '= 1.5 / (1 + 0.75 × 0.5) = 1.5 / 1.375 = 1.09'],
    'Hamada formula (assuming debt beta of zero).',
    { unit: '', tolerance: { kind: 'abs', value: 0.01 } },
  ),
  num(
    { id: 'dcf-q-022', subtopic: 'capm-beta', difficulty: 'elite', pools: ['mock'] },
    'The median unlevered beta of peers is 1.0. The target’s target debt-to-equity is 0.8 and its tax rate 25%. With a 4% risk-free rate and a 5% equity risk premium, what is the target’s cost of equity (in %)?',
    12,
    ['Relevered beta = 1.0 × (1 + 0.75 × 0.8) = 1.6', 'Ke = 4% + 1.6 × 5% = 12%'],
    'Relever at the target’s structure, then apply CAPM.',
    { unit: '%', tolerance: { kind: 'abs', value: 0.05 } },
  ),
  mcq(
    { id: 'dcf-q-023', subtopic: 'capm-beta', difficulty: 'intermediate', pools: ['post'] },
    'Which risk-free rate is typically used in CAPM for a US company?',
    [
      ['The yield on a long-term government bond, such as the 10-year Treasury, matching the long horizon of the cash flows', 'Long-dated cash flows call for a long-dated risk-free rate.', true],
      ['The overnight Fed funds rate', 'Too short-term for a long-horizon valuation.'],
      ['The company’s own bond yield', 'That reflects the company’s credit risk, not a risk-free rate.'],
      ['The current inflation rate', 'Inflation isn’t a risk-free return.'],
    ],
    'Match the horizon: long-term government bonds.',
  ),
  mcq(
    { id: 'dcf-q-024', subtopic: 'capm-beta', difficulty: 'advanced', pools: ['mock'] },
    'How would you estimate beta for a private company?',
    [
      ['Unlever the betas of comparable public companies, take the median, relever at the private company’s target capital structure, and consider a size premium', 'A private company has no trading history, so peers stand in.', true],
      ['Assume a beta of zero, since it isn’t traded', 'Its business still carries systematic risk.'],
      ['Use the market beta of 1.0 for all private companies', 'Ignores the industry’s risk.'],
      ['Use the owner’s personal investment returns', 'Not a market measure.'],
    ],
    'Peers stand in for the market data you don’t have.',
  ),

  // ── Terminal value ──
  mcq(
    { id: 'dcf-q-025', subtopic: 'terminal-value', difficulty: 'basic', pools: ['pre', 'post'] },
    'What are the two common ways to calculate terminal value?',
    [
      ['The perpetuity growth (Gordon growth) method and the exit multiple method', 'One assumes cash flows grow forever at a constant rate; the other applies a market multiple to final-year EBITDA.', true],
      ['Book value and liquidation value', 'These are used only in special situations.'],
      ['Sum of the projected cash flows, undiscounted', 'Undiscounted sums ignore the time value of money.'],
      ['The IPO price and the current price', 'Not terminal value methods.'],
    ],
    'Use one as the primary method and the other as a cross-check.',
  ),
  num(
    { id: 'dcf-q-026', subtopic: 'terminal-value', difficulty: 'intermediate', pools: ['pre', 'post', 'mock'], followUps: ['dcf-q-030', 'dcf-q-031'] },
    'Final-year free cash flow is $100, the long-term growth rate is 2% and WACC is 8%. What is the terminal value (perpetuity growth method)?',
    1700,
    ['TV = FCF × (1 + g) / (WACC − g)', '= 100 × 1.02 / (0.08 − 0.02) = 102 / 0.06 = 1,700'],
    'Use next year’s cash flow, FCF × (1 + g), in the numerator.',
  ),
  num(
    { id: 'dcf-q-027', subtopic: 'terminal-value', difficulty: 'intermediate', pools: ['post', 'mock'] },
    'Year-5 EBITDA is $250 and comparable companies trade at 9.0x EV/EBITDA. What is the terminal value (exit multiple method)?',
    2250,
    ['TV = 9.0 × 250 = 2,250'],
    'Apply a reasonable long-term multiple, not today’s peak.',
  ),
  mcq(
    { id: 'dcf-q-028', subtopic: 'terminal-value', difficulty: 'intermediate', pools: ['post'] },
    'Why shouldn’t the long-term growth rate in a DCF exceed the growth of the overall economy?',
    [
      ['A company growing faster than the economy forever would eventually become larger than the economy; long-term rates are usually around 2–3%', 'Terminal growth should be at or below long-run nominal GDP growth.', true],
      ['Because WACC is always below GDP growth', 'WACC must exceed g for the formula to work, but that’s not the reason.'],
      ['Because regulators cap growth rates', 'There’s no regulation.'],
      ['Because inflation is zero in the long run', 'Long-run nominal growth includes inflation.'],
    ],
    'Perpetual growth must be sustainable forever.',
  ),
  mcq(
    { id: 'dcf-q-029', subtopic: 'terminal-value', difficulty: 'advanced', pools: ['mock'] },
    'What share of a DCF’s total value does the terminal value usually represent?',
    [
      ['Often well over half, frequently 60–80% or more', 'Which is why terminal assumptions dominate the result and must be sensitized.', true],
      ['About 5%', 'Far too low for a going concern.'],
      ['Exactly 50%, by construction', 'It depends on the projection length and assumptions.'],
      ['None: terminal value isn’t part of enterprise value', 'It’s a major part of it.'],
    ],
    'Terminal value dominates, so scrutinize it.',
  ),
  num(
    { id: 'dcf-q-030', subtopic: 'terminal-value', difficulty: 'advanced', pools: ['mock'] },
    'Your exit-multiple terminal value is $2,000. Final-year FCF is $120 and WACC is 9%. What perpetual growth rate does that terminal value imply, using the perpetuity growth formula on next year’s cash flow (in %, to 1 decimal)?',
    2.8,
    ['TV = FCF × (1 + g) / (WACC − g) → g = (TV × WACC − FCF) / (TV + FCF)', '= (2,000 × 0.09 − 120) / (2,000 + 120) = 60 / 2,120 = 2.83%'],
    'Cross-check: an exit multiple implying 6% perpetual growth would be unrealistic.',
    { unit: '%', tolerance: { kind: 'abs', value: 0.1 } },
  ),
  num(
    { id: 'dcf-q-031', subtopic: 'terminal-value', difficulty: 'elite', pools: ['mock'] },
    'A perpetuity growth method gives a terminal value of $1,700. Final-year EBITDA is $200. What EV/EBITDA exit multiple does that imply?',
    8.5,
    ['Implied multiple = TV / final-year EBITDA = 1,700 / 200 = 8.5x'],
    'Always cross-check the two methods against each other.',
    { unit: 'x', tolerance: { kind: 'abs', value: 0.05 } },
  ),
  mcq(
    { id: 'dcf-q-032', subtopic: 'terminal-value', difficulty: 'advanced', pools: ['mock'] },
    'In an end-of-year DCF with a 5-year projection, why is the terminal value discounted back 5 years, not 6?',
    [
      ['The terminal value is the value of all cash flows from year 6 onward as of the end of year 5', 'The Gordon formula uses year-6 cash flow to give a value at the end of year 5.', true],
      ['Because the sixth year is never discounted', 'All future cash flows are discounted.'],
      ['Because terminal value is in today’s dollars already', 'It is a future value that must be discounted.'],
      ['By convention only; 6 would be equally correct', 'Using 6 would undervalue the company.'],
    ],
    'TV sits at the end of the final projection year.',
  ),

  // ── Discounting and the mid-year convention ──
  num(
    { id: 'dcf-q-033', subtopic: 'mid-year', difficulty: 'basic', pools: ['pre', 'post'] },
    'What is the present value of $110 received in one year at a 10% discount rate?',
    100,
    ['PV = 110 / 1.10 = 100'],
    'PV = CF / (1 + r)^t.',
  ),
  num(
    { id: 'dcf-q-037', subtopic: 'mid-year', difficulty: 'intermediate', pools: ['post'] },
    'What is the present value of $100 received in two years at an 8% discount rate (to 2 decimals)?',
    85.73,
    ['PV = 100 / 1.08² = 100 / 1.1664 = 85.73'],
    'Discount factor for year 2 at 8% = 0.857.',
    { tolerance: { kind: 'abs', value: 0.05 } },
  ),
  mcq(
    { id: 'dcf-q-034', subtopic: 'mid-year', difficulty: 'intermediate', pools: ['post'] },
    'What is the mid-year convention, and what does it do to the valuation?',
    [
      ['It assumes cash flows arrive evenly through each year, so each is discounted half a year less (t − 0.5), which raises the valuation', 'More realistic than assuming all cash arrives on December 31.', true],
      ['It discounts every cash flow by an extra half year, lowering the value', 'It discounts by less, not more.'],
      ['It ignores the first half of every year’s cash flows', 'It changes timing, not amounts.'],
      ['It only applies to the terminal value', 'It applies to each projected cash flow.'],
    ],
    'Discount periods 0.5, 1.5, 2.5…',
  ),
  num(
    { id: 'dcf-q-035', subtopic: 'mid-year', difficulty: 'advanced', pools: ['mock'] },
    'Year-1 free cash flow is $100 and WACC is 10%. Using the mid-year convention, what is its present value (to 2 decimals)?',
    95.35,
    ['Discount period = 0.5', 'PV = 100 / 1.10^0.5 = 100 / 1.0488 = 95.35'],
    'Compare with 90.91 under the end-of-year convention.',
    { tolerance: { kind: 'abs', value: 0.05 } },
  ),
  mcq(
    { id: 'dcf-q-036', subtopic: 'mid-year', difficulty: 'elite', pools: ['mock'] },
    'You use the mid-year convention for a 5-year DCF. How should the terminal value be discounted?',
    [
      ['Exit-multiple TV is a point-in-time value at year-end, so discount it 5.0 years; perpetuity-growth TV builds on mid-year cash flows, so many practitioners discount it 4.5 years', 'Keeping the TV’s timing consistent with how it was derived avoids over- or understating it.', true],
      ['Always discount the terminal value 4.5 years', 'That overstates an exit-multiple TV, which is valued at year-end.'],
      ['Always discount the terminal value 5.5 years', 'Neither method implies 5.5.'],
      ['Don’t discount the terminal value at all', 'It must be discounted.'],
    ],
    'An elite-boutique detail: match the discount period to how the TV was built.',
  ),

  // ── Sensitivity and judgment ──
  mcq(
    { id: 'dcf-q-038', subtopic: 'sensitivity', difficulty: 'intermediate', pools: ['post'] },
    'Which two inputs are most commonly sensitized in a DCF table?',
    [
      ['WACC and the terminal growth rate (or exit multiple)', 'They drive the terminal value, which dominates total value.', true],
      ['The tax rate and share count', 'They matter, but less than the discount rate and terminal assumptions.'],
      ['Revenue in year 1 and year 2', 'Near-term revenue has less impact than terminal assumptions.'],
      ['Interest rate and dividend yield', 'Not the standard pair for a DCF.'],
    ],
    'Show how value moves with the assumptions you’re least sure about.',
  ),
  mcq(
    { id: 'dcf-q-039', subtopic: 'sensitivity', difficulty: 'advanced', pools: ['mock'] },
    'Your DCF comes out far above trading comps. What is the most likely culprit?',
    [
      ['Aggressive terminal assumptions (growth or exit multiple) or hockey-stick projections', 'Check the implied exit multiple, the implied growth rate and whether margins are realistic.', true],
      ['The discount rate is too high', 'A higher discount rate lowers DCF value.'],
      ['The comps are always wrong', 'Investigate your own assumptions first.'],
      ['You forgot to subtract interest from free cash flow', 'Unlevered FCF should exclude interest.'],
    ],
    'Cross-check your DCF against the market.',
  ),
  mcq(
    { id: 'dcf-q-040', subtopic: 'sensitivity', difficulty: 'advanced', pools: ['mock'] },
    'Curveball: the company has large NOLs. How would you reflect them in a DCF?',
    [
      ['Lower the cash taxes in the projections as the NOLs are used (subject to limits), or value the tax savings separately and add their present value', 'NOLs are worth the present value of the taxes they save, not their face value.', true],
      ['Add the full NOL balance to enterprise value', 'That ignores the tax rate and the timing of use.'],
      ['Ignore them: NOLs have no value', 'They reduce future cash taxes.'],
      ['Increase WACC', 'NOLs affect cash flows, not the discount rate.'],
    ],
    'Value = PV of tax savings; note usage limits after an ownership change (e.g. Section 382 in the US).',
  ),
  order(
    { id: 'dcf-q-041', subtopic: 'ufcf', difficulty: 'basic', pools: ['pre'] },
    'Put the steps of a DCF in order.',
    [
      'Project revenue, margins and unlevered free cash flow for 5–10 years',
      'Calculate the discount rate (WACC)',
      'Calculate the terminal value',
      'Discount the cash flows and terminal value to today and add them to get enterprise value',
      'Bridge to equity value and divide by diluted shares',
    ],
    'Cash flows → WACC → terminal value → discount → bridge.',
  ),
  free(
    { id: 'dcf-q-042', subtopic: 'ufcf', difficulty: 'basic', pools: ['mock'], followUps: ['dcf-q-029', 'dcf-q-040'] },
    'Walk me through a DCF.',
    [
      ['fcf', 'Project unlevered free cash flow (EBIT after tax + D&A − capex − change in working capital) for 5–10 years', [['free cash flow|fcf']]],
      ['wacc', 'Discount at WACC (cost of equity from CAPM, after-tax cost of debt)', [['wacc|weighted average cost of capital']]],
      ['tv', 'Terminal value via perpetuity growth or exit multiple', [['terminal value']]],
      ['pv', 'Discount and sum to get enterprise value', [['present value|discount*', 'enterprise value']]],
      ['bridge', 'Subtract net debt, divide by diluted shares', [['net debt|equity value', 'share*']]],
    ],
    'A DCF values a company based on the present value of its future cash flows. First, you project the company’s unlevered free cash flow for five to ten years: EBIT after tax, plus D&A, minus capex and the change in working capital. Then you calculate the discount rate, the WACC, using CAPM for the cost of equity and the after-tax cost of debt. Next you calculate a terminal value for the years beyond the projection, using either the perpetuity growth method or an exit multiple. You discount the cash flows and terminal value back to today and add them to get enterprise value. Finally, you subtract net debt to get equity value and divide by diluted shares to get an implied share price.',
    'The four steps: cash flows, discount rate, terminal value, bridge.',
  ),
  free(
    { id: 'dcf-q-043', subtopic: 'wacc', difficulty: 'advanced', pools: ['mock'], followUps: ['dcf-q-013'] },
    'How do you calculate WACC, and what is hardest to estimate?',
    [
      ['formula', 'Weights of equity and debt at market value, times their costs, with debt after tax', [['weight*', 'equity', 'debt']]],
      ['capm', 'Cost of equity from CAPM: risk-free rate + beta × equity risk premium', [['capm|risk free|beta']]],
      ['debt', 'Cost of debt from yields on the company’s debt or its rating, after tax', [['yield*|rating|interest rate', 'tax']]],
      ['hard', 'The judgment calls: beta, the equity risk premium and the target capital structure', [['equity risk premium|erp|beta|target capital structure|judgment']]],
    ],
    'WACC is the weighted average of the cost of equity and the after-tax cost of debt, using market-value weights for the target capital structure. The cost of equity comes from CAPM: the risk-free rate plus beta times the equity risk premium, with beta usually taken from peers, unlevered and relevered at the target structure. The cost of debt comes from the yield on the company’s debt or what a company with its credit rating would pay, multiplied by one minus the tax rate. The hardest parts are judgment calls: which beta to use, what equity risk premium to assume and what the long-run capital structure will be.',
    'Formula, then each input, then the judgment calls.',
  ),
  free(
    { id: 'dcf-q-044', subtopic: 'sensitivity', difficulty: 'elite', pools: ['mock'] },
    'Why might a DCF be wrong?',
    [
      ['tv', 'The terminal value dominates and depends on a growth rate or exit multiple that’s hard to pin down', [['terminal value|terminal']]],
      ['proj', 'Projections may be optimistic (hockey stick) or the company may be cyclical', [['projection*|forecast*|optimistic|hockey stick|cyclical']]],
      ['wacc', 'WACC inputs like beta and the equity risk premium are estimates; small changes swing value', [['wacc|discount rate|beta']]],
      ['fix', 'So you sensitize key inputs and cross-check against comps and precedents', [['sensitiv*|cross check|cross-check|comps|precedent*']]],
    ],
    'A DCF is only as good as its assumptions. Most of the value usually sits in the terminal value, which depends on a growth rate or exit multiple that’s hard to know. The projections may be optimistic, with hockey-stick growth, or the company may be cyclical, so the final year isn’t representative. And the WACC rests on estimates like beta and the equity risk premium, where a one-point change can move value a lot. That’s why you sensitize the key inputs and cross-check the result against comps and precedent transactions.',
    'Terminal value, projections, discount rate, then what you do about it.',
  ),
  rapid(
    { id: 'dcf-q-045', subtopic: 'terminal-value', difficulty: 'basic', pools: ['post', 'mock'] },
    'Free cash flow is $50 a year forever with no growth, and WACC is 10%. What is the terminal value?',
    500,
    '50 / 0.10 = 500.',
  ),
  rapid(
    { id: 'dcf-q-046', subtopic: 'mid-year', difficulty: 'intermediate', pools: ['post'] },
    'What is the present value of $121 received in two years at 10%?',
    100,
    '121 / 1.21 = 100.',
  ),
  rapid(
    { id: 'dcf-q-047', subtopic: 'capm-beta', difficulty: 'intermediate', pools: ['pre'] },
    'Risk-free rate 4%, beta 1.0, equity risk premium 6%. What is the cost of equity (in %)?',
    10,
    '4% + 1.0 × 6% = 10%.',
    { unit: '%' },
  ),
];
