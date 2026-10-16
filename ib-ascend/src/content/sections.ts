import type { Section, SectionId } from '../types/models';

/**
 * Skill-tree definition. Prerequisites: 1 → 2 → 3 → 4 → (5, 6) → 7 → 8 → 9.
 * Sections 10–12 are always open.
 *
 * interviewWeight: relative share of a typical first-round + Superday that the
 * topic takes up at a US elite boutique. The Readiness Score normalizes these,
 * so they only need to be right relative to each other.
 */
export const SECTIONS: Section[] = [
  {
    id: 'accounting',
    number: 1,
    title: 'Accounting Foundations',
    shortTitle: 'Accounting',
    description:
      'The three statements, how they link, the key line items, accrual vs cash accounting and working capital.',
    prerequisites: [],
    alwaysOpen: false,
    statWeights: { accounting: 1 },
    interviewWeight: 10,
    subtopics: [
      { id: 'three-statements', title: 'The three statements' },
      { id: 'linkages', title: 'How the statements link' },
      { id: 'income-statement', title: 'Income statement line items' },
      { id: 'balance-sheet', title: 'Balance sheet line items' },
      { id: 'cash-flow-statement', title: 'Cash flow statement line items' },
      { id: 'accrual-vs-cash', title: 'Accrual vs cash accounting' },
      { id: 'working-capital', title: 'Working capital' },
    ],
  },
  {
    id: 'walkthroughs',
    number: 2,
    title: 'Statement Walk-throughs',
    shortTitle: 'Walk-throughs',
    description:
      'Change one item and walk it through the IS, CFS and BS: depreciation, inventory write-downs, PP&E bought with debt, SBC, deferred taxes, goodwill impairment, dividends and buybacks.',
    prerequisites: ['accounting'],
    alwaysOpen: false,
    statWeights: { accounting: 1 },
    interviewWeight: 12,
    subtopics: [
      { id: 'depreciation', title: 'Depreciation and amortization' },
      { id: 'inventory', title: 'Inventory purchases and write-downs' },
      { id: 'ppe-debt', title: 'PP&E purchases and debt financing' },
      { id: 'debt-interest', title: 'Debt issuance, interest and repayment' },
      { id: 'sbc', title: 'Stock-based compensation' },
      { id: 'deferred-taxes', title: 'Deferred taxes and NOLs' },
      { id: 'goodwill-impairment', title: 'Goodwill and asset impairment' },
      { id: 'dividends-buybacks', title: 'Dividends and share buybacks' },
      { id: 'revenue-expenses', title: 'Revenue, accruals and prepaid items' },
    ],
  },
  {
    id: 'ev-equity',
    number: 3,
    title: 'Equity Value vs Enterprise Value',
    shortTitle: 'EV vs Equity',
    description:
      'The bridge from equity value to enterprise value, diluted share counts (TSM, convertibles) and which multiples pair with which value.',
    prerequisites: ['walkthroughs'],
    alwaysOpen: false,
    statWeights: { valuation: 1 },
    interviewWeight: 10,
    subtopics: [
      { id: 'definitions', title: 'Equity value and enterprise value' },
      { id: 'ev-bridge', title: 'The bridge items' },
      { id: 'diluted-shares', title: 'Diluted shares and the TSM' },
      { id: 'convertibles', title: 'Convertible securities' },
      { id: 'multiples-pairing', title: 'Matching multiples to values' },
    ],
  },
  {
    id: 'valuation',
    number: 4,
    title: 'Valuation Overview',
    shortTitle: 'Valuation',
    description:
      'Comps, precedents, DCF and the LBO floor; how to read a football field; which method to use when.',
    prerequisites: ['ev-equity'],
    alwaysOpen: false,
    statWeights: { valuation: 1 },
    interviewWeight: 9,
    subtopics: [
      { id: 'methodologies', title: 'The main methodologies' },
      { id: 'football-field', title: 'The football field' },
      { id: 'when-to-use', title: 'Choosing a method' },
      { id: 'multiples-intuition', title: 'What drives multiples' },
    ],
  },
  {
    id: 'comps',
    number: 5,
    title: 'Trading Comps & Precedent Transactions',
    shortTitle: 'Comps',
    description:
      'Selecting peers, spreading and calendarizing financials, precedent transaction screens and control premiums.',
    prerequisites: ['valuation'],
    alwaysOpen: false,
    statWeights: { valuation: 1 },
    interviewWeight: 6,
    subtopics: [
      { id: 'peer-selection', title: 'Peer selection' },
      { id: 'spreading', title: 'Spreading comps and normalizing' },
      { id: 'calendarization', title: 'Calendarization' },
      { id: 'precedents', title: 'Precedent transactions' },
      { id: 'control-premium', title: 'Control premiums' },
    ],
  },
  {
    id: 'dcf',
    number: 6,
    title: 'Discounted Cash Flow',
    shortTitle: 'DCF',
    description:
      'Unlevered FCF, WACC (CAPM, levering and unlevering beta), terminal value, the mid-year convention and sensitivity tables.',
    prerequisites: ['valuation'],
    alwaysOpen: false,
    statWeights: { valuation: 1 },
    interviewWeight: 12,
    subtopics: [
      { id: 'ufcf', title: 'Unlevered free cash flow' },
      { id: 'wacc', title: 'WACC' },
      { id: 'capm-beta', title: 'CAPM and beta' },
      { id: 'terminal-value', title: 'Terminal value' },
      { id: 'mid-year', title: 'Discounting and the mid-year convention' },
      { id: 'sensitivity', title: 'Sensitivities and DCF judgment' },
    ],
  },
  {
    id: 'mna',
    number: 7,
    title: 'Mergers & Acquisitions',
    shortTitle: 'M&A',
    description:
      'Accretion/dilution, purchase price allocation, goodwill, synergies, cash vs stock consideration and deal structures.',
    prerequisites: ['comps', 'dcf'],
    alwaysOpen: false,
    statWeights: { modeling: 1 },
    interviewWeight: 9,
    subtopics: [
      { id: 'accretion-dilution', title: 'Accretion/dilution' },
      { id: 'ppa-goodwill', title: 'Purchase price allocation and goodwill' },
      { id: 'synergies', title: 'Synergies' },
      { id: 'consideration', title: 'Cash vs stock consideration' },
      { id: 'deal-structures', title: 'Deal structures and process' },
    ],
  },
  {
    id: 'lbo',
    number: 8,
    title: 'Leveraged Buyouts',
    shortTitle: 'LBO',
    description:
      'Sources & uses, debt tranches, returns drivers, IRR and MOIC, and the paper LBO.',
    prerequisites: ['mna'],
    alwaysOpen: false,
    statWeights: { modeling: 1 },
    interviewWeight: 9,
    subtopics: [
      { id: 'sources-uses', title: 'Sources & uses' },
      { id: 'debt-tranches', title: 'Debt tranches and terms' },
      { id: 'returns-drivers', title: 'Returns drivers' },
      { id: 'irr-moic', title: 'IRR and MOIC' },
      { id: 'paper-lbo', title: 'Paper LBO' },
    ],
  },
  {
    id: 'restructuring',
    number: 9,
    title: 'Restructuring & Distressed Basics',
    shortTitle: 'Restructuring',
    description:
      'Capital structure, priority of claims, Chapter 11 vs Chapter 7, DIP financing and distressed valuation.',
    prerequisites: ['lbo'],
    alwaysOpen: false,
    statWeights: { modeling: 0.4, valuation: 0.3, marketIq: 0.3 },
    interviewWeight: 4,
    subtopics: [
      { id: 'capital-structure', title: 'Capital structure' },
      { id: 'priority-claims', title: 'Priority of claims' },
      { id: 'chapter-11-vs-7', title: 'Chapter 11 vs Chapter 7' },
      { id: 'dip-financing', title: 'DIP financing' },
      { id: 'distressed-valuation', title: 'Distressed valuation and recoveries' },
    ],
  },
  {
    id: 'mental-math',
    number: 10,
    title: 'Mental Math & Brain Teasers',
    shortTitle: 'Mental Math',
    description:
      'Percentages, multiples, IRR rules of thumb and the brain teasers interviewers still ask.',
    prerequisites: [],
    alwaysOpen: true,
    statWeights: { speed: 1 },
    interviewWeight: 4,
    subtopics: [
      { id: 'percentages', title: 'Percentages and growth' },
      { id: 'multiples', title: 'Multiples and division' },
      { id: 'irr-rules', title: 'IRR rules of thumb' },
      { id: 'brain-teasers', title: 'Brain teasers' },
    ],
  },
  {
    id: 'markets',
    number: 11,
    title: 'Markets & Deal Awareness',
    shortTitle: 'Markets',
    description: 'How to pitch a deal and a stock, and how to talk about current markets.',
    prerequisites: [],
    alwaysOpen: true,
    statWeights: { marketIq: 1 },
    interviewWeight: 7,
    subtopics: [
      { id: 'pitch-deal', title: 'Pitching a deal' },
      { id: 'pitch-stock', title: 'Pitching a stock' },
      { id: 'current-markets', title: 'Current markets' },
      { id: 'rates-macro', title: 'Rates and macro' },
    ],
  },
  {
    id: 'fit',
    number: 12,
    title: 'Fit & Behavioral',
    shortTitle: 'Fit',
    description:
      'Why IB, why this firm, walk me through your resume, strengths and weaknesses, all built from your resume and Story Bank.',
    prerequisites: [],
    alwaysOpen: true,
    statWeights: { polish: 1 },
    interviewWeight: 18,
    subtopics: [
      { id: 'resume-walkthrough', title: 'Walk me through your resume' },
      { id: 'why-ib', title: 'Why investment banking' },
      { id: 'why-firm', title: 'Why this firm' },
      { id: 'strengths-weaknesses', title: 'Strengths and weaknesses' },
      { id: 'behavioral-stories', title: 'Behavioral stories' },
    ],
  },
];

export const SECTION_BY_ID: Record<SectionId, Section> = Object.fromEntries(
  SECTIONS.map((s) => [s.id, s]),
) as Record<SectionId, Section>;

export function getSection(id: SectionId): Section {
  return SECTION_BY_ID[id];
}
