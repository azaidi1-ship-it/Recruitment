import type { SectionId } from '../../types/models';

export type RoundKind = 'technical' | 'behavioral' | 'mixed';

export interface ScoreWeights {
  technical: number;
  structure: number;
  speed: number;
  story: number;
}

/**
 * An interviewing style, loosely modeled on what candidates commonly report
 * about firms' Superdays. These are archetypes for practice, not real people
 * or any firm's actual process.
 */
export interface Persona {
  id: string;
  title: string;
  /** "Associated with" label shown in the UI. */
  style: string;
  description: string;
  /** Relative weight of each section when drawing technical questions. */
  sectionWeights: Partial<Record<SectionId, number>>;
  /** Follow-ups asked after a technical lead (0–2). */
  followUps: number;
  /** Chance (0–1) of a curveball after a technical lead. */
  curveballRate: number;
  /** Share of technical questions drawn at Advanced or Elite. */
  hardShare: number;
  /** Round lineup for a 4-round day; a 3-round day drops the last. */
  rounds: RoundKind[];
  weights: ScoreWeights;
  /** Overall score needed to advance (0–1). */
  bar: number;
  /** One line the interviewer opens each round with, by kind. */
  openers: Record<RoundKind, string>;
}

export const PERSONAS: Persona[] = [
  {
    id: 'deep-technical',
    title: 'Deep technicals',
    style: 'Centerview-style',
    description: 'Fewer questions, each pushed two levels deep. Valuation, DCF, M&A and LBO mechanics, with curveballs to test whether you understand rather than memorize.',
    sectionWeights: { valuation: 3, dcf: 4, mna: 4, lbo: 3, 'ev-equity': 2, comps: 2, accounting: 1, walkthroughs: 2 },
    followUps: 2,
    curveballRate: 0.6,
    hardShare: 0.6,
    rounds: ['technical', 'behavioral', 'technical', 'mixed'],
    weights: { technical: 0.5, structure: 0.2, speed: 0.1, story: 0.2 },
    bar: 0.75,
    openers: {
      technical: 'I’m going to go deep on a few topics rather than wide. Take your time and think out loud.',
      behavioral: 'Let’s talk about you. I’ll ask for specifics, so tell me what you did, not the team.',
      mixed: 'A bit of everything this round: your background, then some technicals.',
    },
  },
  {
    id: 'restructuring',
    title: 'Restructuring angle',
    style: 'PJT / Houlihan Lokey-style',
    description: 'Capital structure, distressed valuation, LBO credit and the EV bridge. Expect “who gets paid first?” and “what happens in Chapter 11?”.',
    sectionWeights: { restructuring: 5, lbo: 3, 'ev-equity': 2, dcf: 2, accounting: 2, walkthroughs: 2, valuation: 1 },
    followUps: 1,
    curveballRate: 0.5,
    hardShare: 0.5,
    rounds: ['technical', 'behavioral', 'technical', 'mixed'],
    weights: { technical: 0.45, structure: 0.2, speed: 0.1, story: 0.25 },
    bar: 0.72,
    openers: {
      technical: 'Our work is mostly companies in trouble, so let’s start with the capital structure.',
      behavioral: 'Restructuring is long hours with a lot of stakeholders. Tell me how you work.',
      mixed: 'Some fit, some technicals. Let’s see how you think about risk.',
    },
  },
  {
    id: 'ma-heavy',
    title: 'M&A-heavy',
    style: 'Evercore / Lazard-style',
    description: 'Accretion/dilution, synergies, precedents and deal rationale, plus “tell me about a deal” and market awareness.',
    sectionWeights: { mna: 5, comps: 3, valuation: 3, dcf: 2, markets: 2, 'ev-equity': 1, accounting: 1 },
    followUps: 1,
    curveballRate: 0.4,
    hardShare: 0.45,
    rounds: ['technical', 'behavioral', 'mixed', 'technical'],
    weights: { technical: 0.4, structure: 0.25, speed: 0.1, story: 0.25 },
    bar: 0.72,
    openers: {
      technical: 'We advise on a lot of strategic M&A, so let’s talk deals.',
      behavioral: 'Tell me about yourself and why you want to do M&A advisory.',
      mixed: 'Walk me through your background, then we’ll talk about a deal you’ve followed.',
    },
  },
  {
    id: 'tech-focused',
    title: 'Tech-focused',
    style: 'Qatalyst-style',
    description: 'Growth-company valuation: revenue multiples, DCFs with long horizons, unprofitable companies and stock-based deals.',
    sectionWeights: { valuation: 4, comps: 3, dcf: 3, mna: 3, markets: 2, 'ev-equity': 2 },
    followUps: 1,
    curveballRate: 0.5,
    hardShare: 0.5,
    rounds: ['technical', 'behavioral', 'mixed', 'technical'],
    weights: { technical: 0.45, structure: 0.2, speed: 0.1, story: 0.25 },
    bar: 0.72,
    openers: {
      technical: 'Most of our clients are high-growth tech companies, so let’s start with valuation.',
      behavioral: 'Why tech, and why this kind of firm? Then I’ll ask about your experience.',
      mixed: 'Let’s mix it up: your story first, then some valuation.',
    },
  },
  {
    id: 'generalist',
    title: 'Generalist',
    style: 'Bulge bracket-style',
    description: 'Broad and standard: accounting, walk-throughs, EV, valuation and a heavier fit component. Speed and polish matter.',
    sectionWeights: { accounting: 3, walkthroughs: 3, 'ev-equity': 3, valuation: 3, dcf: 2, comps: 2, mna: 2, lbo: 1, 'mental-math': 1 },
    followUps: 1,
    curveballRate: 0.25,
    hardShare: 0.25,
    rounds: ['behavioral', 'technical', 'mixed', 'technical'],
    weights: { technical: 0.35, structure: 0.2, speed: 0.15, story: 0.3 },
    bar: 0.7,
    openers: {
      technical: 'Standard technicals this round. Clear, structured answers.',
      behavioral: 'Let’s start with your story. Walk me through your resume.',
      mixed: 'A mix this round: some fit, some technicals, maybe some quick math.',
    },
  },
];

export const PERSONA_BY_ID: Record<string, Persona> = Object.fromEntries(PERSONAS.map((p) => [p.id, p]));
