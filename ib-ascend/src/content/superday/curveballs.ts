import type { SectionId } from '../../types/models';
import type { Question } from '../../types/questions';
import { builders } from '../helpers';

/**
 * Curveballs: the "now what if…" questions interviewers throw after a
 * standard technical. They are merged into each section's question bank
 * (Boss Fight pool, tagged "curveball") and the Superday Simulator drops
 * them in after a technical question from the same section.
 */
const tags = ['curveball'];

const dcf = builders('dcf');
const lbo = builders('lbo');
const mna = builders('mna');
const val = builders('valuation');
const comps = builders('comps');
const ev = builders('ev-equity');
const acc = builders('accounting');
const rx = builders('restructuring');
const mk = builders('markets');
const fit = builders('fit');

export const CURVEBALLS: Partial<Record<SectionId, Question[]>> = {
  dcf: [
    dcf.free(
      { id: 'cb-dcf-01', subtopic: 'ufcf', difficulty: 'advanced', pools: ['mock'], tags: [...tags, 'nol'] },
      'What would change in your DCF if the company had large net operating losses (NOLs)?',
      [
        ['taxes', 'Cash taxes fall while the NOLs are used, so free cash flow rises in those years', [['tax*'], ['lower|fall*|reduc*|less']]],
        ['separate', 'Either model cash taxes with the NOL or value the NOL separately as the PV of tax savings, but not both', [['separately|present value|pv'], ['double count*|not both|either']]],
        ['limits', 'Usage can be limited (e.g. Section 382 after an ownership change) and NOLs can expire', [['382|limit*|expire*']]],
        ['size', 'The effect is a modest value boost, larger the bigger the NOL relative to taxable income', [['modest|boost|increase*|higher']]],
      ],
      'Cash taxes fall in the years the NOLs offset taxable income, so free cash flow is higher and the value goes up. I’d either model cash taxes with the NOL balance running down, or value the NOLs separately as the present value of the tax savings and add them to enterprise value, but not both, or I’d double count them. I’d also check whether their use is limited, for example by Section 382 after an ownership change, and whether any will expire unused. The overall effect is usually a modest increase in value.',
      'NOLs lower cash taxes. Model them once, and check limits like Section 382.',
      60,
    ),
    dcf.free(
      { id: 'cb-dcf-02', subtopic: 'sensitivity', difficulty: 'intermediate', pools: ['mock'], tags },
      'Why might a DCF be wrong here?',
      [
        ['tv', 'Terminal value is often most of the value, so small changes in growth or exit multiple swing it', [['terminal value|terminal']]],
        ['inputs', 'It is very sensitive to WACC and growth assumptions', [['wacc|discount rate'], ['growth|sensitiv*']]],
        ['projections', 'Projections may be optimistic or the company may not be in a steady state', [['projection*|forecast*|optimistic|management case|steady state']]],
        ['crosscheck', 'Cross-check against trading comps and precedents', [['comps|precedent*|cross check|cross checked|multiples']]],
      ],
      'A DCF is only as good as its inputs. The terminal value is often 60 to 80 percent of the total, so small changes in the terminal growth rate or exit multiple swing the answer. It is also very sensitive to the WACC and growth assumptions. The projections might be optimistic, especially if they’re a management case, or the company might not be in a steady state by the final year, for example if it’s cyclical or still growing fast. That’s why I’d run sensitivities and cross-check the result against trading comps and precedent transactions.',
      'TV share, input sensitivity, projections, cross-checks.',
      60,
    ),
    dcf.mcq(
      { id: 'cb-dcf-03', subtopic: 'terminal-value', difficulty: 'advanced', pools: ['mock'], tags },
      'The terminal value is 90% of a DCF’s enterprise value. What’s the best reaction?',
      [
        ['Check that the final-year cash flow is a sustainable steady state, consider extending the projection period, and cross-check the implied exit multiple or growth rate', 'High TV share means the answer rests on assumptions far in the future.', true],
        ['Nothing: TV should always be over 90%', 'Typical shares are 60–80%; 90% is a warning sign.'],
        ['Remove the terminal value', 'A DCF without TV ignores most of the value.'],
        ['Lower the WACC until TV is smaller', 'A lower WACC increases the TV share.'],
      ],
      'When TV dominates, test the assumptions that drive it.',
    ),
  ],
  lbo: [
    lbo.free(
      { id: 'cb-lbo-01', subtopic: 'returns-drivers', difficulty: 'advanced', pools: ['mock'], tags: [...tags, 'nol'] },
      'What would change in your LBO if the target had NOLs?',
      [
        ['taxes', 'Lower cash taxes increase free cash flow', [['tax*'], ['lower|less|reduc*']]],
        ['paydown', 'More cash goes to debt paydown, so returns rise', [['paydown|pay down|repay*|deleverag*'], ['return*|irr']]],
        ['limits', 'The buyout is a change of control, so Section 382 can limit annual use', [['382|change of control|ownership change|limit*']]],
      ],
      'NOLs lower the company’s cash taxes, so free cash flow is higher in the years they’re used. More cash goes to pay down debt, so the equity value at exit and the returns are higher. But the buyout is a change of control, so Section 382 can limit how much of the NOL can be used each year, which reduces the benefit.',
      'More FCF, more paydown, but Section 382 limits.',
      45,
    ),
    lbo.mcq(
      { id: 'cb-lbo-02', subtopic: 'debt-tranches', difficulty: 'intermediate', pools: ['mock'], tags },
      'Before signing, base rates rise by 2 percentage points. What happens to the LBO?',
      [
        ['Interest costs rise and debt capacity falls, so the sponsor must either accept a lower IRR, put in more equity or pay a lower price', 'Higher rates squeeze every part of the LBO.', true],
        ['Returns rise because lenders earn more', 'Lenders’ gain is the equity’s cost.'],
        ['Nothing, because the debt is fixed at signing', 'Leveraged loans are usually floating rate, and financing isn’t locked until committed.'],
        ['The exit multiple automatically rises', 'If anything, higher rates pressure multiples down.'],
      ],
      'Rates up: less leverage, lower returns or a lower price.',
    ),
    lbo.free(
      { id: 'cb-lbo-03', subtopic: 'irr-moic', difficulty: 'elite', pools: ['mock'], tags },
      'Your LBO shows a 30% IRR but only a 1.4x MOIC. How is that possible, and is it a good deal?',
      [
        ['hold', 'A short hold period: IRR is time-weighted, MOIC isn’t', [['short|quick|hold period|time']]],
        ['example', 'E.g. 1.4x in about 1.3 years is roughly 30%', [['1 3|year*|months']]],
        ['tradeoff', 'Investors care about both: a high IRR on little money multiplied may not be worth it', [['both|absolute|dollar*|lps|investors']]],
      ],
      'It means the hold period was short. IRR is time-weighted and MOIC isn’t, so making 1.4x in about 1.3 years works out to roughly a 30% IRR. It could also come from an early dividend recap. Whether it’s good depends on the fund’s goals: investors look at both, because a high IRR on a small multiple returns relatively few dollars, and the fund then has to redeploy that money.',
      'Short hold: high IRR, low MOIC. Investors care about both.',
      45,
    ),
  ],
  mna: [
    mna.free(
      { id: 'cb-mna-01', subtopic: 'accretion-dilution', difficulty: 'advanced', pools: ['mock'], tags },
      'The deal is accretive. Does that mean it creates value for the acquirer’s shareholders?',
      [
        ['no', 'Not necessarily: accretion is an accounting EPS measure', [['not necessarily|no'], ['eps|earnings per share|accounting']]],
        ['value', 'Value is created if the price paid is below the target’s value plus synergies, or returns beat the cost of capital', [['synerg*|cost of capital|return*']]],
        ['pe', 'A low-P/E acquirer buying a higher-yield target looks accretive regardless of value', [['p e|pe|cheaper|cost of']]],
      ],
      'Not necessarily. Accretion is an accounting measure of earnings per share. A deal can be accretive just because the acquirer’s cost of financing is cheaper than the target’s earnings yield, for example a low P/E acquirer paying in stock, or cheap debt. Value is created only if the price paid is less than what the target is worth plus the synergies the acquirer can realistically capture, or put another way, if the return on the investment beats the acquirer’s cost of capital.',
      'Accretion ≠ value creation.',
      60,
    ),
    mna.mcq(
      { id: 'cb-mna-02', subtopic: 'consideration', difficulty: 'intermediate', pools: ['mock'], tags },
      'An acquirer at 10x P/E buys a target at 20x P/E entirely in stock, with no synergies. Accretive or dilutive?',
      [
        ['Dilutive: the acquirer issues “expensive” earnings (a 10% earnings yield on its stock) to buy 5%-yield earnings', 'In an all-stock deal, buying a higher P/E than your own is dilutive.', true],
        ['Accretive', 'Only if the target’s P/E were lower than the acquirer’s.'],
        ['Neither: all-stock deals are always neutral', 'They depend on relative P/Es.'],
        ['It depends on the tax rate', 'In an all-stock deal tax doesn’t enter this comparison.'],
      ],
      'Compare the cost of stock (1 / acquirer P/E) with the target yield (1 / purchase P/E).',
    ),
    mna.free(
      { id: 'cb-mna-03', subtopic: 'consideration', difficulty: 'advanced', pools: ['mock'], tags },
      'Why might a company pay in stock even if the deal is dilutive?',
      [
        ['balance', 'It may lack cash or debt capacity, or want to protect its credit rating', [['cash|debt capacity|leverage|rating|balance sheet']]],
        ['risk', 'Stock shares the risk with the target’s shareholders', [['share*'], ['risk']]],
        ['valued', 'Its stock may be richly valued, making it an attractive currency', [['valued|valuation|currency|expensive']]],
        ['longterm', 'Long-term strategic value can outweigh near-term EPS dilution', [['long term|strategic|growth']]],
      ],
      'A few reasons. It may not have the cash or debt capacity, or it may want to protect its credit rating. Paying in stock also shares the risk with the target’s shareholders, who keep exposure to how the combined company performs. If the acquirer’s stock is richly valued, it’s an attractive currency. And the long-term strategic value, such as faster growth, can outweigh some near-term EPS dilution.',
      'Balance sheet, risk sharing, valuation, strategy.',
      60,
    ),
  ],
  valuation: [
    val.free(
      { id: 'cb-val-01', subtopic: 'when-to-use', difficulty: 'advanced', pools: ['mock'], tags },
      'How would you value a company with negative EBITDA?',
      [
        ['revenue', 'Revenue (or gross profit) multiples instead of EBITDA', [['revenue|gross profit']]],
        ['dcf', 'A DCF with a longer projection period until it reaches steady-state margins', [['dcf|discounted cash flow'], ['longer|steady state|profitab*']]],
        ['metrics', 'Operating metrics such as users or subscribers', [['users|subscribers|customers|metric*']]],
        ['precedents', 'Precedent transactions or a sum of the parts', [['precedent*|sum of the parts']]],
      ],
      'EBITDA multiples don’t work, so I’d use revenue or gross profit multiples against comparable companies. I’d also build a DCF with a longer projection period, out to the point where the company reaches steady-state margins and becomes profitable. For some businesses, operating metrics such as value per user or per subscriber are useful, and precedent transactions can show what acquirers have paid. If it has distinct divisions, a sum of the parts can help.',
      'Revenue multiples, long DCF, operating metrics, precedents.',
      60,
    ),
    val.mcq(
      { id: 'cb-val-02', subtopic: 'football-field', difficulty: 'advanced', pools: ['mock'], tags },
      'Trading comps imply $40 per share; your DCF implies $70. What do you tell the client?',
      [
        ['Explain what drives the gap (e.g. the DCF assumes growth or margins above what the market prices into peers), test those assumptions, and present a range weighted by how reliable each method is', 'The gap is information about assumptions.', true],
        ['Average them to $55', 'Averaging hides why they differ.'],
        ['Use the DCF because it’s more academic', 'Neither method is automatically right.'],
        ['Drop the comps', 'Discarding evidence isn’t analysis.'],
      ],
      'Explain the gap, test it, present a range.',
    ),
  ],
  comps: [
    comps.mcq(
      { id: 'cb-co-01', subtopic: 'precedents', difficulty: 'intermediate', pools: ['mock'], tags },
      'Precedent transactions imply a lower multiple than trading comps today. Why might that be?',
      [
        ['The precedents happened in weaker markets or at lower valuations, and the comps reflect today’s higher multiples', 'Precedents usually include a control premium, so a lower result often points to timing.', true],
        ['Precedents never include a control premium', 'They usually do.'],
        ['Trading comps always exceed precedents', 'Normally the opposite.'],
        ['It’s a calculation error', 'There are real reasons this can happen.'],
      ],
      'Precedents are snapshots of past markets.',
    ),
    comps.free(
      { id: 'cb-co-02', subtopic: 'peer-selection', difficulty: 'advanced', pools: ['mock'], tags },
      'There are no good public comparables for this company. What do you do?',
      [
        ['widen', 'Widen the criteria: adjacent sectors, similar business models or other regions', [['widen|broaden|adjacent|similar|other regions|international']]],
        ['adjust', 'Adjust for differences in growth and margins', [['adjust*'], ['growth|margin*']]],
        ['other', 'Lean more on a DCF and precedent transactions, including private deals', [['dcf|precedent*|private']]],
      ],
      'I’d widen the criteria to companies with a similar business model, end market or growth profile, including adjacent sectors and other regions, and then adjust for differences in growth and margins rather than taking the median blindly. I’d also lean more on a DCF and on precedent transactions, including acquisitions of private companies, and be clear with the client that the comps carry less weight.',
      'Widen, adjust, lean on other methods.',
      45,
    ),
  ],
  'ev-equity': [
    ev.mcq(
      { id: 'cb-ev-01', subtopic: 'ev-bridge', difficulty: 'intermediate', pools: ['mock'], tags },
      'Can enterprise value be negative?',
      [
        ['Yes: if cash exceeds the market cap plus debt and other claims, which happens for some distressed or cash-rich, out-of-favor companies', 'It means the market values the operating business below zero.', true],
        ['No, never', 'It’s rare but possible.'],
        ['Only for private companies', 'It’s seen in public markets.'],
        ['Only if net income is negative', 'Net income doesn’t enter the EV bridge.'],
      ],
      'Negative EV: cash > equity value + debt.',
    ),
    ev.mcq(
      { id: 'cb-ev-02', subtopic: 'ev-bridge', difficulty: 'basic', pools: ['mock'], tags },
      'A company raises $100 of debt and keeps all of it as cash. What happens to enterprise value?',
      [
        ['Nothing: debt and cash both rise by $100, so net debt is unchanged', 'Raising debt alone doesn’t change the value of the operations.', true],
        ['EV rises by $100', 'The cash offsets the debt.'],
        ['EV falls by $100', 'No.'],
        ['Equity value falls by $100', 'Equity value is unchanged too.'],
      ],
      'Financing alone doesn’t move EV.',
    ),
  ],
  accounting: [
    acc.free(
      { id: 'cb-acc-01', subtopic: 'three-statements', difficulty: 'intermediate', pools: ['mock'], tags },
      'If you could only look at one financial statement, which would you choose and why?',
      [
        ['cfs', 'The cash flow statement', [['cash flow statement']]],
        ['why', 'It shows the actual cash generated and is harder to manipulate than net income', [['actual cash|real cash|cash generat*|manipulat*']]],
        ['bs', 'Acknowledges the balance sheet trade-off', [['balance sheet']]],
      ],
      'I’d pick the cash flow statement. It shows the actual cash the business generates and spends, which is what ultimately matters for valuation and solvency, and it’s harder to manipulate with accounting choices than net income. It also starts from net income, so you get a view of profitability too. The trade-off is that you don’t see the full balance sheet, so you’d know less about leverage and liquidity.',
      'Cash flow statement: real cash, harder to game.',
      45,
    ),
    acc.mcq(
      { id: 'cb-acc-02', subtopic: 'three-statements', difficulty: 'basic', pools: ['mock'], tags },
      'Can a profitable company go bankrupt?',
      [
        ['Yes: it can run out of cash, e.g. if cash is tied up in receivables and inventory or it can’t refinance maturing debt', 'Profit isn’t cash.', true],
        ['No, profitable companies always have cash', 'Accrual profit can differ sharply from cash.'],
        ['Only if it pays dividends', 'Not the core reason.'],
        ['Only private companies can', 'Any company can.'],
      ],
      'Liquidity, not profitability, keeps a company alive.',
    ),
  ],
  restructuring: [
    rx.free(
      { id: 'cb-rx-01', subtopic: 'distressed-valuation', difficulty: 'advanced', pools: ['mock'], tags },
      'A distressed company’s debt trades well below par, yet its equity still has a positive market value. Why?',
      [
        ['option', 'Equity has option value: if things improve it captures the upside', [['option*|upside']]],
        ['uncertain', 'The valuation and outcome are uncertain', [['uncertain*|unknown|range']]],
        ['time', 'Time before a default or filing, and the chance of an out-of-court fix', [['time|out of court|before']]],
      ],
      'Equity behaves like an option on the company. Its downside is capped at zero, but if the business recovers or the company refinances, equity captures all of the upside, so it has value even when the company looks insolvent today. The valuation is also uncertain, so investors may disagree about whether the equity is out of the money. And there’s time: the company may have months before a default or filing, with some chance of an out-of-court fix.',
      'Option value, uncertainty, time.',
      45,
    ),
    rx.mcq(
      { id: 'cb-rx-02', subtopic: 'priority-claims', difficulty: 'advanced', pools: ['mock'], tags },
      'What is the “fulcrum security” in a restructuring?',
      [
        ['The most senior class of claims that isn’t fully covered by the company’s value, which typically receives most of the new equity', 'Classes above it are paid in full; classes below usually get little or nothing.', true],
        ['The most junior debt', 'Junior classes are often wiped out.'],
        ['The DIP loan', 'DIP loans are senior and repaid in full.'],
        ['Common equity', 'Equity is usually out of the money.'],
      ],
      'Find where value runs out.',
    ),
  ],
  markets: [
    mk.free(
      { id: 'cb-mk-01', subtopic: 'pitch-deal', difficulty: 'advanced', pools: ['mock'], tags },
      'What would make you change your view on the deal you just pitched?',
      [
        ['signal', 'A specific, observable signal', [['if|signal|evidence']]],
        ['synergies', 'E.g. synergies not materializing or integration problems', [['synerg*|integration']]],
        ['regulatory', 'Or regulatory or financing risk', [['regulat*|antitrust|financing']]],
      ],
      'I’d change my view if the evidence on the key assumption went the other way. For example, if early results showed the synergies weren’t materializing, or integration problems were driving away customers or key people. A regulatory challenge, such as antitrust remedies that remove the main benefit, or a financing problem would also make me reconsider. I’d watch [the specific metric for your deal] as the clearest signal.',
      'Name the signal that would prove you wrong.',
      45,
    ),
  ],
  fit: [
    fit.free(
      { id: 'cb-fit-01', subtopic: 'behavioral-stories', difficulty: 'advanced', pools: ['mock'], tags },
      'If you could redo one experience on your resume, what would you do differently?',
      [
        ['choice', 'Names a specific experience', [['ayah|stratus|clarus|improve me|modelcore|180|tcs|lumiere']]],
        ['differently', 'Says concretely what you’d change', [['differently|would have|i d have|id have|change']]],
        ['learning', 'What you learned and how you apply it now', [['learn*|now i|apply']]],
      ],
      'At Ayah Apparel, I’d have built the three-statement model earlier. [your detail: what you did before you had the model, and the decision it would have improved.] Doing it differently would have meant [your detail]. What I learned is to put numbers behind decisions from the start, and now I apply that by building a simple model before I commit to a plan.',
      'Specific, honest, and what you do differently now.',
      60,
    ),
    fit.free(
      { id: 'cb-fit-02', subtopic: 'behavioral-stories', difficulty: 'intermediate', pools: ['mock'], tags },
      'Tell me something about yourself that isn’t on your resume.',
      [
        ['personal', 'Something genuine and specific', [['i ']]],
        ['link', 'Connects it to how you work', [['which|that s|thats|taught|means']]],
      ],
      'I [your detail: a genuine interest or experience that isn’t on the resume, e.g. a sport, hobby or family responsibility], which taught me [your detail: a trait it built, such as discipline or patience] and that’s part of how I approach long, demanding work.',
      'Short, genuine, linked to how you work.',
      30,
    ),
  ],
};

export const ALL_CURVEBALLS: Question[] = Object.values(CURVEBALLS).flat();
