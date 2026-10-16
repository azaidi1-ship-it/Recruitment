import type { Question } from '../../../types/questions';
import { builders } from '../../helpers';

const { mcq, num, rapid, order, free } = builders('restructuring');

export const questions: Question[] = [
  // ── Capital structure and distress ──
  mcq(
    { id: 'rx-q-001', subtopic: 'capital-structure', difficulty: 'basic', pools: ['pre', 'post'] },
    'What does a restructuring banker do?',
    [
      ['Advises a distressed company (debtor) or its creditors on reorganizing the balance sheet: renegotiating debt, raising rescue financing, selling assets or running a bankruptcy process', 'The work centers on liquidity, capital structure and recoveries rather than growth.', true],
      ['Advises healthy companies on IPOs', 'That’s equity capital markets.'],
      ['Restructures a company’s org chart and layoffs', 'Operational turnaround consultants do that; bankers focus on the balance sheet.'],
      ['Audits a company’s financial statements', 'That’s accountants.'],
    ],
    'Restructuring = fixing an unsustainable capital structure.',
  ),
  mcq(
    { id: 'rx-q-002', subtopic: 'capital-structure', difficulty: 'basic', pools: ['pre', 'post'] },
    'Which signs suggest a company may need a restructuring?',
    [
      ['Rising leverage, falling interest coverage, shrinking liquidity, upcoming debt maturities it can’t refinance, and bonds trading far below par', 'Distress is usually a liquidity problem before it is a solvency problem.', true],
      ['A rising share price and strong cash flow', 'Those signal health.'],
      ['Paying a regular dividend', 'Not a distress signal by itself.'],
      ['Hiring a new CFO', 'Not, on its own, a sign of distress.'],
    ],
    'Watch liquidity, maturities, leverage and where the debt trades.',
  ),
  num(
    { id: 'rx-q-003', subtopic: 'capital-structure', difficulty: 'intermediate', pools: ['pre', 'post'] },
    'A company has $800 of debt. Its EBITDA falls from $200 to $100. What is its new leverage (debt / EBITDA)?',
    8,
    ['Before: 800 / 200 = 4.0x', 'After: 800 / 100 = 8.0x'],
    'Leverage doubles when EBITDA halves: that is how distress arrives.',
    { unit: 'x', tolerance: { kind: 'abs', value: 0.05 } },
  ),
  rapid(
    { id: 'rx-q-004', subtopic: 'capital-structure', difficulty: 'intermediate', pools: ['post', 'mock'] },
    'EBITDA is $100 and annual cash interest is $90. What is interest coverage (EBITDA / interest), to 2 decimals?',
    1.11,
    '100 / 90 = 1.11x: barely covering interest before any capex or taxes.',
    { unit: 'x', tolerance: { kind: 'abs', value: 0.01 }, seconds: 20 },
  ),
  mcq(
    { id: 'rx-q-005', subtopic: 'capital-structure', difficulty: 'intermediate', pools: ['post', 'mock'] },
    'What is the difference between a liquidity problem and a solvency problem?',
    [
      ['Liquidity: not enough cash to meet near-term obligations. Solvency: the business is worth less than its debt, so the capital structure is unsustainable', 'A company can be solvent but illiquid (bridgeable) or liquid but insolvent (a slow-moving problem).', true],
      ['They are the same thing', 'They need different fixes.'],
      ['Liquidity is about equity; solvency is about cash', 'Reversed and imprecise.'],
      ['Solvency problems are always short-term', 'Insolvency is a structural problem.'],
    ],
    'Liquidity fixes buy time; solvency fixes cut debt.',
  ),
  mcq(
    { id: 'rx-q-006', subtopic: 'capital-structure', difficulty: 'intermediate', pools: ['post'] },
    'What is a 13-week cash flow forecast?',
    [
      ['A weekly, receipts-and-disbursements forecast of cash used to manage liquidity in distress', 'It tells management and creditors exactly when the cash runs out.', true],
      ['A 13-year DCF', 'Different tool, different purpose.'],
      ['The quarterly earnings forecast', 'It’s weekly and cash-based, not accrual earnings.'],
      ['A bond’s coupon schedule', 'Unrelated.'],
    ],
    'In distress, cash is measured weekly.',
  ),
  mcq(
    { id: 'rx-q-007', subtopic: 'capital-structure', difficulty: 'advanced', pools: ['mock'] },
    'What is a liability management exercise (LME)?',
    [
      ['An out-of-court transaction that reshapes debt, such as a distressed exchange, an “uptier” that elevates participating lenders, or a “drop-down” of assets into an unrestricted subsidiary', 'LMEs (e.g. J.Crew’s drop-down, Serta’s uptier) became common and controversial because they can favor some creditors over others.', true],
      ['A routine interest payment', 'That’s ordinary debt service.'],
      ['A type of equity offering', 'LMEs restructure debt.'],
      ['A Chapter 7 liquidation', 'LMEs are out of court.'],
    ],
    'Out-of-court debt engineering, often creditor-on-creditor.',
  ),
  mcq(
    { id: 'rx-q-008', subtopic: 'capital-structure', difficulty: 'advanced', pools: ['mock'] },
    'Why is it hard to restructure US bonds out of court?',
    [
      ['Changing a bond’s core payment terms generally needs each holder’s consent (Trust Indenture Act §316(b)), so holdouts can refuse an exchange and still be paid in full', 'That holdout problem is a major reason companies use Chapter 11, where a class vote binds dissenters.', true],
      ['Bonds can’t be traded', 'Bonds trade actively.'],
      ['Bondholders have no rights until maturity', 'They have contractual rights throughout.'],
      ['The SEC must approve every exchange', 'Not the main obstacle.'],
    ],
    'Out of court: unanimity problems. In court: class voting binds holdouts.',
  ),

  // ── Priority of claims ──
  order(
    { id: 'rx-q-009', subtopic: 'priority-claims', difficulty: 'basic', pools: ['pre', 'post'] },
    'Order these claims from first paid to last paid in a typical US bankruptcy.',
    [
      'DIP financing (super-priority)',
      'Secured debt (up to the value of its collateral)',
      'Administrative and priority claims',
      'Senior unsecured debt and general unsecured claims',
      'Subordinated debt',
      'Preferred equity',
      'Common equity',
    ],
    'The absolute priority rule: senior classes are paid in full before junior classes receive anything (absent consent).',
  ),
  mcq(
    { id: 'rx-q-010', subtopic: 'priority-claims', difficulty: 'basic', pools: ['pre', 'post'] },
    'What is the absolute priority rule?',
    [
      ['Senior claims must be paid in full before more junior claims or equity receive anything under a plan, unless the senior class agrees otherwise', 'It underpins cramdown: a plan can’t give value to junior classes while a dissenting senior class is impaired.', true],
      ['All creditors are paid the same percentage', 'Only within the same class.'],
      ['Equity holders are paid first', 'Equity is last.'],
      ['Creditors are paid in the order they lent money', 'Priority depends on security and ranking, not timing.'],
    ],
    'Top-down, class by class.',
  ),
  mcq(
    { id: 'rx-q-011', subtopic: 'priority-claims', difficulty: 'intermediate', pools: ['post'] },
    'What is the difference between contractual and structural subordination?',
    [
      ['Contractual: a debt agreement says it ranks behind other debt. Structural: debt at a holding company ranks behind all creditors of the operating subsidiaries that hold the assets', 'Holdco creditors get only what’s left after opco creditors are paid.', true],
      ['They mean the same thing', 'They arise differently.'],
      ['Structural subordination means the debt is secured', 'Security is about collateral, not structure.'],
      ['Contractual subordination only applies to equity', 'It applies to debt.'],
    ],
    'Where debt sits in the corporate structure matters as much as what its contract says.',
  ),
  mcq(
    { id: 'rx-q-012', subtopic: 'priority-claims', difficulty: 'intermediate', pools: ['post', 'mock'] },
    'What is the “fulcrum security”?',
    [
      ['The most senior class that isn’t paid in full: it typically receives most of the equity in the reorganized company', 'Classes above it are paid in full; classes below it usually get little or nothing.', true],
      ['The most senior secured loan', 'Senior secured debt is usually paid in full.'],
      ['The company’s common stock', 'Common stock is usually wiped out.'],
      ['The DIP loan', 'DIP lenders are paid first.'],
    ],
    'Find where value runs out: that class controls the outcome.',
  ),
  num(
    { id: 'rx-q-013', subtopic: 'priority-claims', difficulty: 'intermediate', pools: ['pre', 'post', 'mock'], followUps: ['rx-q-014', 'rx-q-012'] },
    'The reorganized company is worth $500. It has $300 of secured debt and $400 of unsecured debt. What percentage recovery do unsecured creditors receive?',
    50,
    ['Secured is paid in full: 500 − 300 = 200 left', 'Unsecured recovery = 200 / 400 = 50%', 'Equity receives nothing'],
    'Run the waterfall top-down.',
    { unit: '%', tolerance: { kind: 'abs', value: 0.5 } },
  ),
  num(
    { id: 'rx-q-014', subtopic: 'priority-claims', difficulty: 'advanced', pools: ['mock'] },
    'Distributable value is $600. Claims: DIP $50, administrative $20, secured term loan $300, senior unsecured notes $200 and trade claims $50 (pari passu with the notes), subordinated notes $100. What recovery (in %) do the senior unsecured notes get?',
    92,
    ['DIP 50 + admin 20 + secured 300 = 370 paid in full; 600 − 370 = 230 left', 'Unsecured pool = notes 200 + trade 50 = 250', 'Recovery = 230 / 250 = 92%', 'Subordinated notes and equity get nothing; the senior notes are the fulcrum'],
    'Pari passu claims share pro rata.',
    { unit: '%', tolerance: { kind: 'abs', value: 0.5 } },
  ),
  mcq(
    { id: 'rx-q-015', subtopic: 'priority-claims', difficulty: 'advanced', pools: ['mock'] },
    'A secured lender is owed $300, but its collateral is worth only $200. How is its claim treated?',
    [
      ['It has a $200 secured claim and a $100 unsecured “deficiency” claim that shares with other unsecured creditors', 'Security only protects up to the value of the collateral.', true],
      ['It is paid $300 in full because it is secured', 'Only up to collateral value is secured.'],
      ['It loses its lien entirely', 'The lien survives to the extent of the collateral.'],
      ['The full $300 becomes unsecured', 'The $200 covered by collateral stays secured.'],
    ],
    'Undersecured claims split into secured and unsecured pieces.',
  ),
  mcq(
    { id: 'rx-q-016', subtopic: 'priority-claims', difficulty: 'elite', pools: ['mock'] },
    'Why might senior creditors agree to give some value (a “gift” or “tip”) to a junior class or equity that is technically out of the money?',
    [
      ['To win their support and avoid a costly, slow fight over valuation or plan confirmation', 'A small tip can buy a faster, consensual exit; courts have limited some gifting structures.', true],
      ['Because the absolute priority rule requires it', 'The rule protects seniors; it doesn’t require gifts.'],
      ['Because junior creditors always have veto power', 'They don’t, but litigation can be expensive.'],
      ['To reduce the seniors’ taxes', 'Not the reason.'],
    ],
    'Speed and certainty can be worth a small concession.',
  ),

  // ── Chapter 11 vs Chapter 7 ──
  mcq(
    { id: 'rx-q-017', subtopic: 'chapter-11-vs-7', difficulty: 'basic', pools: ['pre', 'post'] },
    'What is the difference between Chapter 11 and Chapter 7?',
    [
      ['Chapter 11 reorganizes the company as a going concern with management usually still running it; Chapter 7 liquidates it under a trustee', 'Chapter 11 preserves going-concern value when the business is worth more alive than dead.', true],
      ['Chapter 11 is for individuals; Chapter 7 for companies', 'Both can apply to companies.'],
      ['Chapter 7 lets the company keep operating indefinitely', 'Chapter 7 is liquidation.'],
      ['They are identical', 'Reorganization vs liquidation.'],
    ],
    '11 = reorganize; 7 = liquidate.',
  ),
  mcq(
    { id: 'rx-q-018', subtopic: 'chapter-11-vs-7', difficulty: 'intermediate', pools: ['post', 'mock'] },
    'What is the automatic stay?',
    [
      ['On filing, most creditor collection actions (lawsuits, foreclosures, enforcement) are halted, giving the company breathing room', 'It protects the estate while a plan is negotiated.', true],
      ['A pause on employee salaries', 'Employees generally continue to be paid.'],
      ['A freeze on the company’s stock trading', 'The stock can keep trading.'],
      ['A ban on new financing', 'The company can raise DIP financing.'],
    ],
    'Section 362 of the Bankruptcy Code.',
  ),
  mcq(
    { id: 'rx-q-019', subtopic: 'chapter-11-vs-7', difficulty: 'intermediate', pools: ['post'] },
    'In Chapter 11, what does it take for a class of creditors to accept a plan?',
    [
      ['Votes from at least two-thirds in dollar amount and more than half in number of the claims in that class that vote', 'Once a class accepts, dissenters in that class are bound.', true],
      ['Unanimous approval of every creditor', 'That is the out-of-court problem Chapter 11 solves.'],
      ['A simple majority by dollar amount', 'Both an amount and a number test apply.'],
      ['Approval by the equity holders only', 'Creditors vote by class.'],
    ],
    'Two-thirds in amount, majority in number.',
  ),
  mcq(
    { id: 'rx-q-020', subtopic: 'chapter-11-vs-7', difficulty: 'advanced', pools: ['mock'] },
    'What is a cramdown?',
    [
      ['Confirming a plan over a dissenting class, if at least one impaired class accepts and the plan is “fair and equitable” and doesn’t discriminate unfairly', 'Fair and equitable largely means respecting absolute priority for the dissenting class.', true],
      ['Cutting management’s pay', 'Not what cramdown means.'],
      ['Forcing equity to buy more shares', 'Unrelated.'],
      ['Converting a case to Chapter 7', 'That is a conversion.'],
    ],
    'Section 1129(b).',
  ),
  mcq(
    { id: 'rx-q-021', subtopic: 'chapter-11-vs-7', difficulty: 'advanced', pools: ['mock'] },
    'What is the “best interests of creditors” test?',
    [
      ['Each dissenting creditor must receive at least as much under the plan as it would in a Chapter 7 liquidation', 'That’s why a liquidation analysis is part of every plan.', true],
      ['Creditors must receive 100 cents on the dollar', 'Not required.'],
      ['The plan must maximize equity value', 'Equity is usually out of the money.'],
      ['The court must pick the plan creditors prefer', 'It’s a minimum-recovery test.'],
    ],
    'Plan ≥ liquidation, for every dissenting holder.',
  ),
  mcq(
    { id: 'rx-q-022', subtopic: 'chapter-11-vs-7', difficulty: 'intermediate', pools: ['post'] },
    'What is a prepackaged Chapter 11?',
    [
      ['A case where the plan is negotiated and votes are solicited before filing, so the company can exit in weeks rather than months', 'Pre-negotiated cases agree terms before filing but solicit votes afterwards; free-fall cases have no deal at all.', true],
      ['A Chapter 7 liquidation sold as a package', 'Prepacks are reorganizations.'],
      ['A bankruptcy for small businesses only', 'Size isn’t the defining feature.'],
      ['A filing where creditors are paid in full upfront', 'Creditors are usually impaired.'],
    ],
    'Prepack → pre-negotiated → free-fall: from fastest to slowest.',
  ),
  mcq(
    { id: 'rx-q-023', subtopic: 'chapter-11-vs-7', difficulty: 'advanced', pools: ['mock'] },
    'What is a Section 363 sale?',
    [
      ['A court-approved sale of assets during Chapter 11, free and clear of liens and claims, often with a “stalking horse” bid that sets the floor for an auction', 'Buyers get clean title; secured creditors can often credit bid their debt.', true],
      ['A sale of shares on the stock exchange', 'Not a bankruptcy mechanism.'],
      ['The sale of a company after it exits bankruptcy', '363 sales happen during the case.'],
      ['A tax-free spin-off', 'Unrelated.'],
    ],
    'Fast, clean asset sales inside Chapter 11.',
  ),
  mcq(
    { id: 'rx-q-024', subtopic: 'chapter-11-vs-7', difficulty: 'elite', pools: ['mock'] },
    'Why might a secured lender “credit bid” in a 363 sale?',
    [
      ['It can bid using the face value of its claim instead of cash, which lets it take ownership of the assets if others won’t pay more', 'Credit bidding protects secured lenders from a fire-sale price.', true],
      ['To lend the buyer money at a lower rate', 'That is financing, not credit bidding.'],
      ['Because cash bids are prohibited in bankruptcy', 'Cash bids are normal.'],
      ['To convert its loan into common stock of the old company', 'Old equity is usually wiped out.'],
    ],
    'Credit bid = bid with your claim.',
  ),

  // ── DIP financing ──
  mcq(
    { id: 'rx-q-025', subtopic: 'dip-financing', difficulty: 'basic', pools: ['pre', 'post'] },
    'What is DIP financing?',
    [
      ['A loan to a company in Chapter 11 (the “debtor in possession”) to fund operations during the case, with court-approved priority protections', 'It keeps the lights on through the restructuring.', true],
      ['A dividend paid to equity holders before filing', 'Not DIP financing.'],
      ['Debt raised after the company exits bankruptcy', 'That is exit financing.'],
      ['An equity investment by management', 'DIP is debt.'],
    ],
    'Debtor-in-possession financing.',
  ),
  mcq(
    { id: 'rx-q-026', subtopic: 'dip-financing', difficulty: 'intermediate', pools: ['post', 'mock'] },
    'Why are lenders willing to lend to a bankrupt company through a DIP?',
    [
      ['DIP loans usually get super-priority administrative status and strong liens (sometimes priming existing liens), plus high fees and close court oversight', 'Those protections make DIPs among the safest loans despite the borrower’s distress.', true],
      ['The government guarantees DIP loans', 'There is no general government guarantee.'],
      ['DIP lenders become the company’s owners', 'Not automatically.'],
      ['DIP loans are interest-free', 'They carry interest and fees.'],
    ],
    'Priority and security make DIPs safe.',
  ),
  mcq(
    { id: 'rx-q-027', subtopic: 'dip-financing', difficulty: 'advanced', pools: ['mock'] },
    'Why do existing lenders often provide the DIP themselves (a “defensive DIP”)?',
    [
      ['To protect their position, avoid being primed by a third-party lender, and gain influence over the case (e.g. through milestones or a roll-up of pre-petition debt)', 'Control of the DIP often means control of the process.', true],
      ['Because third parties are banned from providing DIPs', 'Third parties can provide them.'],
      ['Because DIPs have no risk', 'They are low-risk, not risk-free.'],
      ['To convert their debt into DIP equity', 'DIPs are loans.'],
    ],
    'DIP = control of the process.',
  ),
  mcq(
    { id: 'rx-q-028', subtopic: 'dip-financing', difficulty: 'elite', pools: ['mock'] },
    'What is a DIP “roll-up”?',
    [
      ['Part of the lender’s pre-bankruptcy debt is converted into DIP debt, gaining super-priority status, usually in exchange for new money', 'Courts scrutinize roll-ups because they elevate old claims above other creditors.', true],
      ['Combining several bankruptcies into one case', 'That is joint administration.'],
      ['Rolling the DIP into exit financing at emergence', 'That’s a DIP-to-exit conversion, a different feature.'],
      ['Capitalizing interest into principal', 'That is PIK interest.'],
    ],
    'Roll-ups elevate pre-petition debt.',
  ),

  // ── Distressed valuation and recoveries ──
  num(
    { id: 'rx-q-029', subtopic: 'distressed-valuation', difficulty: 'intermediate', pools: ['post', 'mock'] },
    'A distressed bond trades at 40 (cents on the dollar). You expect a recovery worth 55 in one year. What is your expected return (in %)?',
    37.5,
    ['Return = 55 / 40 − 1 = 37.5%'],
    'Distressed investing is about buying claims below expected recovery.',
    { unit: '%', tolerance: { kind: 'abs', value: 0.1 } },
  ),
  num(
    { id: 'rx-q-030', subtopic: 'distressed-valuation', difficulty: 'advanced', pools: ['post', 'mock'] },
    'Liquidation analysis: cash $50 (100% recovery), receivables $100 (80%), inventory $120 (50%), PP&E $200 (40%), and $30 of wind-down costs. What are net liquidation proceeds?',
    240,
    ['Cash 50 + AR 80 + inventory 60 + PP&E 80 = 270', 'Less wind-down costs 30 = 240'],
    'Every plan must beat this for dissenting creditors (best interests test).',
  ),
  num(
    { id: 'rx-q-031', subtopic: 'distressed-valuation', difficulty: 'advanced', pools: ['mock'] },
    '$400 of unsecured notes will receive 80% of the reorganized company’s equity, valued at $300. What recovery (in %) do the notes get?',
    60,
    ['Value received = 80% × 300 = 240', 'Recovery = 240 / 400 = 60%'],
    'In a debt-for-equity swap, recovery depends on the plan valuation.',
    { unit: '%', tolerance: { kind: 'abs', value: 0.5 } },
  ),
  mcq(
    { id: 'rx-q-032', subtopic: 'distressed-valuation', difficulty: 'advanced', pools: ['mock'] },
    'Why do senior and junior creditors often argue about the plan valuation?',
    [
      ['A lower valuation gives more of the equity to seniors and less to juniors; a higher one pushes value down to juniors', 'The fulcrum moves with valuation, so each class argues for the number that maximizes its recovery.', true],
      ['Because valuation determines the interest rate on the DIP', 'Not the main driver of the dispute.'],
      ['They never disagree about valuation', 'Valuation fights are central to contested cases.'],
      ['Because a higher valuation always helps seniors', 'Seniors usually prefer lower valuations when they’re receiving equity.'],
    ],
    'Valuation determines who owns the company.',
  ),
  mcq(
    { id: 'rx-q-033', subtopic: 'distressed-valuation', difficulty: 'intermediate', pools: ['post'] },
    'How do you value a company emerging from Chapter 11?',
    [
      ['Usually with the standard methods (comps, DCF, precedents) applied to the post-restructuring business plan, plus a liquidation analysis as a floor', 'The reorganized company is valued as a going concern with its new, lower debt.', true],
      ['Only by book value', 'Book value rarely reflects going-concern value.'],
      ['By the face value of the debt', 'Debt face value isn’t enterprise value.'],
      ['At zero, by convention', 'The company has value; that’s the point of reorganizing.'],
    ],
    'Going-concern valuation for the plan; liquidation value as the floor.',
  ),
  mcq(
    { id: 'rx-q-034', subtopic: 'distressed-valuation', difficulty: 'intermediate', pools: ['post'] },
    'What is a distressed exchange?',
    [
      ['An out-of-court swap of existing debt for new securities worth less (lower principal, longer maturity, or equity), often treated by rating agencies as a default', 'Cheaper and faster than bankruptcy but vulnerable to holdouts.', true],
      ['Trading distressed bonds on an exchange', 'Not the meaning.'],
      ['A merger of two bankrupt companies', 'Unrelated.'],
      ['A Chapter 7 auction', 'Distressed exchanges are out of court.'],
    ],
    'Out-of-court debt-for-debt or debt-for-equity swaps.',
  ),
  num(
    { id: 'rx-q-035', subtopic: 'distressed-valuation', difficulty: 'elite', pools: ['mock'] },
    'An investor buys $100 face of unsecured claims for $30. The plan gives unsecured creditors 45% recovery, paid in one year. What is the investor’s profit on a $100 face position?',
    15,
    ['Recovery = 45% × 100 = 45', 'Profit = 45 − 30 = 15 (a 50% return)'],
    'Buy the claim below its expected recovery.',
  ),

  // ── Verbal and rapid ──
  free(
    { id: 'rx-q-036', subtopic: 'chapter-11-vs-7', difficulty: 'basic', pools: ['mock'], followUps: ['rx-q-018', 'rx-q-021'] },
    'Walk me through what happens in a Chapter 11 bankruptcy.',
    [
      ['filing', 'The company files and the automatic stay halts creditor actions', [['automatic stay|stay']]],
      ['dip', 'It usually raises DIP financing to fund operations, and management keeps running the business', [['dip|debtor in possession']]],
      ['plan', 'It negotiates a plan of reorganization that creditors vote on by class', [['plan', 'vote*|class*']]],
      ['confirm', 'The court confirms the plan (possibly by cramdown) and the company emerges with a new capital structure', [['confirm*|cramdown|emerge*']]],
    ],
    'The company files for Chapter 11, and the automatic stay immediately stops creditors from suing or foreclosing. Management usually keeps running the business as the debtor in possession, typically funded by DIP financing that gets super-priority status. The company negotiates a plan of reorganization with its creditors, who are grouped into classes and vote on it. Once the court confirms the plan, either with enough class votes or through a cramdown, the company emerges with a new, smaller capital structure, and the fulcrum creditors often end up owning the equity.',
    'Filing → stay → DIP → plan → vote → confirmation → emergence.',
  ),
  free(
    { id: 'rx-q-037', subtopic: 'capital-structure', difficulty: 'intermediate', pools: ['mock'], followUps: ['rx-q-008'] },
    'What options does a distressed company have before filing for bankruptcy?',
    [
      ['amend', 'Negotiate with lenders: amend-and-extend, covenant waivers', [['amend*|extend|waiver*|covenant*']]],
      ['exchange', 'Distressed exchanges or debt-for-equity swaps, or liability management transactions', [['exchange|swap|debt for equity|liability management']]],
      ['capital', 'Raise new capital: rescue financing or equity', [['new money|rescue|raise|equity']]],
      ['assets', 'Sell assets or businesses to raise cash', [['sell|sale|asset*|divest*']]],
      ['cost', 'Operational fixes: cut costs and preserve liquidity', [['cost*|liquidity|operational']]],
    ],
    'Before filing, a company can try to fix things out of court. It can negotiate with lenders for covenant waivers or an amend-and-extend that pushes maturities out. It can do a distressed exchange or debt-for-equity swap, or other liability management transactions. It can raise new money, like rescue financing or equity, and it can sell assets or divisions to raise cash. Alongside that, it would cut costs to preserve liquidity. The challenge out of court is holdouts, which is why many companies end up in Chapter 11 anyway.',
    'Lenders, exchanges, new capital, asset sales, operations.',
    45,
  ),
  free(
    { id: 'rx-q-038', subtopic: 'priority-claims', difficulty: 'advanced', pools: ['mock'] },
    'Why do restructuring groups at firms like PJT, Houlihan Lokey, Moelis and Lazard often advise creditors rather than the company?',
    [
      ['creditors', 'Large creditor groups (ad hoc groups, committees) hire their own advisors', [['ad hoc|committee|creditor group*']]],
      ['fees', 'Creditor mandates are numerous and often paid for by the debtor', [['paid|fee*']]],
      ['influence', 'Creditors, especially the fulcrum class, drive the outcome and often end up owning the company', [['fulcrum|own*|control']]],
      ['both', 'Banks build reputations on both sides: debtor-side and creditor-side', [['debtor', 'creditor']]],
    ],
    'In a large restructuring there is usually one debtor advisor but several creditor groups: ad hoc groups of bondholders or lenders and the official unsecured creditors’ committee. Each hires its own advisors, and their fees are often paid by the debtor, so there are more creditor mandates than debtor mandates. Creditors, especially the fulcrum class, also drive the outcome because they often end up owning the reorganized company. The leading restructuring groups build reputations on both sides, debtor and creditor.',
    'Show you understand how restructuring mandates actually work.',
    45,
  ),
  rapid(
    { id: 'rx-q-039', subtopic: 'priority-claims', difficulty: 'basic', pools: ['pre'] },
    'Value of $250 must cover $200 of secured debt and $100 of unsecured debt. What recovery (in %) do unsecured creditors get?',
    50,
    '250 − 200 = 50 left for 100 of unsecured claims: 50%.',
    { unit: '%' },
  ),
  rapid(
    { id: 'rx-q-040', subtopic: 'distressed-valuation', difficulty: 'intermediate', pools: ['post', 'mock'] },
    'A bond bought at 50 recovers 70. What is the return (in %)?',
    40,
    '70 / 50 − 1 = 40%.',
    { unit: '%' },
  ),
  mcq(
    { id: 'rx-q-041', subtopic: 'chapter-11-vs-7', difficulty: 'intermediate', pools: ['post'] },
    'What usually happens to the old common equity in a Chapter 11 where creditors are impaired?',
    [
      ['It is usually cancelled with little or no recovery, and the fulcrum creditors receive the new equity', 'Under absolute priority, equity is last in line.', true],
      ['It is converted 1:1 into new shares', 'Only if creditors are paid in full.'],
      ['It gets paid before unsecured creditors', 'Equity is junior to all creditors.'],
      ['It automatically becomes preferred stock', 'No such conversion.'],
    ],
    'Equity is the first to be wiped out.',
  ),
  mcq(
    { id: 'rx-q-042', subtopic: 'dip-financing', difficulty: 'basic', pools: ['pre'] },
    'What is exit financing?',
    [
      ['New debt or equity raised so the company can repay the DIP and fund the business when it emerges from Chapter 11', 'It replaces the DIP at emergence.', true],
      ['Financing used to liquidate the company', 'That’s not exit financing.'],
      ['A fee paid to leave a bankruptcy', 'Not a fee.'],
      ['The DIP itself', 'The DIP funds the case; exit financing funds emergence.'],
    ],
    'DIP funds the case; exit financing funds the reorganized company.',
  ),
];
