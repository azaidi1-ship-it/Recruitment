import type { CompetencyId } from '../../types/models';

/**
 * Where on the resume a missing competency could come from. Used by the
 * coverage matrix to suggest a story for any competency with fewer than two.
 * Ideas use the drafted story details where the seed stories supply them
 * (listed there as unverified for the user to check); the rest are prompts.
 */
export const COVERAGE_SUGGESTIONS: Record<CompetencyId, { itemId: string; idea: string }[]> = {
  leadership: [
    { itemId: 'exp-ayah', idea: 'Leading the business as founder: a decision only you could make' },
    { itemId: 'exp-180dc', idea: 'Taking the lead on your workstream or a client meeting' },
  ],
  teamwork: [
    { itemId: 'exp-stratus', idea: 'Working with the founders on the raise' },
    { itemId: 'exp-improveme', idea: 'Co-authoring course materials with colleagues' },
  ],
  conflict: [
    { itemId: 'exp-180dc', idea: 'The teammate who wanted paid tutors, and how you compared the options' },
    { itemId: 'lead-modelcore', idea: 'A disagreement within the Modelcore team' },
    { itemId: 'exp-stratus', idea: 'Investor pushback on customer acquisition cost' },
  ],
  failure: [
    { itemId: 'exp-fitness', idea: 'The client who nearly quit: what you had misjudged, and what you changed' },
    { itemId: 'lead-modelcore', idea: 'The autumn 2023 stall, when cold emails got almost no replies' },
  ],
  initiative: [
    { itemId: 'exp-clarus', idea: 'Proposing a stock or strategy nobody asked you to look at' },
    { itemId: 'lead-door-of-awareness', idea: 'Offering to build the fundraising models' },
  ],
  pressure: [
    { itemId: 'exp-stratus', idea: 'Three weeks to get the model and deck ready before investor meetings' },
    { itemId: 'proj-tcs', idea: 'Delivering the externship analysis on its timeline' },
  ],
  detail: [
    { itemId: 'exp-clarus', idea: 'Checking a model before it went to the club' },
    { itemId: 'proj-tcs', idea: 'Diagnosing data-quality issues' },
  ],
  analytical: [
    { itemId: 'proj-lumiere', idea: 'Sizing the AgTech market' },
    { itemId: 'exp-clarus', idea: 'A DCF or reverse DCF' },
  ],
  persuasion: [
    { itemId: 'exp-clarus', idea: 'Pitching your Nike hold view to the investment committee' },
    { itemId: 'lead-mun', idea: 'Winning support for a resolution' },
  ],
  ethics: [
    { itemId: 'exp-clarus', idea: 'Reporting the corrected backtest result after you found look-ahead bias' },
    { itemId: 'exp-improveme', idea: 'Giving an independent view rather than the answer people expected' },
    { itemId: 'exp-ayah', idea: 'Telling your supplier upfront after the winter hoodie over-order' },
  ],
  adaptability: [
    { itemId: 'exp-improveme', idea: 'Getting up to speed on Dubai real estate quickly' },
    { itemId: 'proj-tcs', idea: 'Learning credit-risk modeling in a short externship' },
  ],
  criticism: [
    { itemId: 'exp-stratus', idea: 'Investor questions on CAC that led you to add a payback sensitivity' },
    { itemId: 'exp-improveme', idea: 'Feedback from the founders on your analysis' },
    { itemId: 'exp-clarus', idea: 'Pushback on your stock pitch from the club' },
  ],
  'time-management': [
    { itemId: 'exp-stratus', idea: 'The raise alongside your studies at Swarthmore' },
    { itemId: 'lead-door-of-awareness', idea: 'Weekly teaching alongside university' },
  ],
  'client-focus': [
    { itemId: 'exp-stratus', idea: 'Fortune 500 and AI-lab conversations' },
    { itemId: 'exp-180dc', idea: 'What the nonprofit client actually needed' },
  ],
  'greatest-achievement': [
    { itemId: 'exp-ayah', idea: 'Building a business from nothing' },
    { itemId: 'ach-mun-award', idea: 'Best Researcher in the Security Council' },
  ],
};
