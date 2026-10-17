import type { Firm } from '../../types/models';

/**
 * Starter Firm Tracker cards: long-standing, well-known facts only (what each
 * firm is known for). Recent deals, people and interview notes are added by
 * the user, since they change and must be current.
 */
export type FirmProfile = Pick<Firm, 'id' | 'name' | 'tier' | 'focusAreas' | 'personaId'> & { about: string };

export const FIRM_PROFILES: FirmProfile[] = [
  { id: 'centerview', name: 'Centerview Partners', tier: 'elite-boutique', focusAreas: ['M&A advisory', 'Restructuring'], personaId: 'deep-technical', about: 'Independent advisory firm known for large strategic M&A and very lean deal teams.' },
  { id: 'evercore', name: 'Evercore', tier: 'elite-boutique', focusAreas: ['M&A advisory', 'Restructuring', 'Equity research'], personaId: 'ma-heavy', about: 'One of the largest independent advisory firms, founded in 1995; also has restructuring and equity research (ISI).' },
  { id: 'pjt', name: 'PJT Partners', tier: 'elite-boutique', focusAreas: ['Strategic advisory', 'Restructuring', 'Fund placement'], personaId: 'restructuring', about: 'Spun off from Blackstone’s advisory business in 2015; strong restructuring practice and Park Hill fund placement.' },
  { id: 'lazard', name: 'Lazard', tier: 'elite-boutique', focusAreas: ['M&A advisory', 'Restructuring', 'Asset management'], personaId: 'ma-heavy', about: 'Long-established global advisory firm with an asset management arm.' },
  { id: 'moelis', name: 'Moelis & Company', tier: 'elite-boutique', focusAreas: ['M&A advisory', 'Restructuring', 'Capital markets advisory'], personaId: 'ma-heavy', about: 'Founded in 2007 by Ken Moelis; generalist advisory firm with a large restructuring practice.' },
  { id: 'pwp', name: 'Perella Weinberg Partners', tier: 'elite-boutique', focusAreas: ['M&A advisory', 'Restructuring'], personaId: 'restructuring', about: 'Independent advisory firm founded in 2006.' },
  { id: 'guggenheim', name: 'Guggenheim Securities', tier: 'elite-boutique', focusAreas: ['M&A advisory', 'Restructuring', 'Capital markets'], personaId: 'generalist', about: 'Investment banking arm of Guggenheim Partners.' },
  { id: 'qatalyst', name: 'Qatalyst Partners', tier: 'elite-boutique', focusAreas: ['Technology M&A'], personaId: 'tech-focused', about: 'Technology-focused advisory boutique founded by Frank Quattrone.' },
  { id: 'houlihan', name: 'Houlihan Lokey', tier: 'middle-market', focusAreas: ['Restructuring', 'Middle-market M&A', 'Fairness opinions'], personaId: 'restructuring', about: 'Leading restructuring adviser; also known for middle-market M&A and fairness opinions.' },
  { id: 'goldman', name: 'Goldman Sachs', tier: 'bulge-bracket', focusAreas: ['M&A advisory', 'Equity and debt capital markets', 'Leveraged finance'], personaId: 'generalist', about: 'Bulge bracket with a leading global M&A franchise.' },
  { id: 'morgan-stanley', name: 'Morgan Stanley', tier: 'bulge-bracket', focusAreas: ['M&A advisory', 'Equity capital markets', 'Leveraged finance'], personaId: 'generalist', about: 'Bulge bracket known for M&A and equity capital markets.' },
  { id: 'jpmorgan', name: 'J.P. Morgan', tier: 'bulge-bracket', focusAreas: ['M&A advisory', 'Debt capital markets', 'Leveraged finance'], personaId: 'generalist', about: 'Bulge bracket with one of the largest balance sheets and financing franchises.' },
  { id: 'jefferies', name: 'Jefferies', tier: 'middle-market', focusAreas: ['M&A advisory', 'Leveraged finance', 'Sponsor coverage'], personaId: 'generalist', about: 'Large independent investment bank with strong financial sponsor coverage.' },
  { id: 'harris-williams', name: 'Harris Williams', tier: 'middle-market', focusAreas: ['Middle-market M&A', 'Sponsor coverage'], personaId: 'generalist', about: 'Middle-market M&A advisory firm.' },
  { id: 'william-blair', name: 'William Blair', tier: 'middle-market', focusAreas: ['Middle-market M&A', 'Equity capital markets'], personaId: 'generalist', about: 'Independent investment bank focused on growth and middle-market companies.' },
];

export function seedFirms(nowIso: string): Firm[] {
  return FIRM_PROFILES.map(({ about, ...p }) => ({
    ...p,
    status: 'researching',
    researchedDeals: [],
    contacts: [],
    interviewNotes: about,
    whyFirmDraft: '',
    createdAt: nowIso,
    updatedAt: nowIso,
  }));
}
