import type { AchievementDef, SectionId } from '../types/models';
import { SECTIONS } from './sections';

/** Achievement definitions. Unlock rules live in src/engine/achievements.ts, keyed by id. */
const CORE: AchievementDef[] = [
  { id: 'first-answer', title: 'Day One', description: 'Answer your first question.', icon: 'Sparkles', xpReward: 25 },
  { id: 'answers-100', title: 'Reps', description: 'Answer 100 questions.', icon: 'Dumbbell', xpReward: 100 },
  { id: 'answers-1000', title: 'Grinder', description: 'Answer 1,000 questions.', icon: 'Pickaxe', xpReward: 500 },
  { id: 'flawless-walkthrough', title: 'Flawless Walk-through', description: 'Get every line of a statement walk-through right.', icon: 'ListChecks', xpReward: 75 },
  { id: 'walkthroughs-10', title: 'Three-Statement Machine', description: 'Complete 10 flawless walk-throughs.', icon: 'Cog', xpReward: 200 },
  { id: 'fast-track', title: 'Fast Track', description: 'Score 90%+ on a pre-quiz and skip ahead.', icon: 'FastForward', xpReward: 75 },
  { id: 'first-boss', title: 'Boss Slayer', description: 'Finish your first Boss Fight mock with 80% or better.', icon: 'Swords', xpReward: 100 },
  { id: 's-rank', title: 'S-Rank', description: 'Earn an S grade in any section.', icon: 'Crown', xpReward: 250 },
  { id: 'technicals-cleared', title: 'Technically Sound', description: 'Pass the post-quiz in all nine technical sections.', icon: 'GraduationCap', xpReward: 500 },
  { id: 's-rank-all', title: 'Superday Ready', description: 'Earn an S grade in all nine technical sections.', icon: 'Trophy', xpReward: 1500, secret: true },
  { id: 'paper-lbo-5', title: 'Paper LBO under 5 min', description: 'Solve a Paper LBO correctly in under 5 minutes.', icon: 'Timer', xpReward: 150 },
  { id: 'paper-lbo-3', title: 'Back of the Napkin', description: 'Solve a Paper LBO correctly in under 3 minutes.', icon: 'Zap', xpReward: 300, secret: true },
  { id: 'streak-7', title: 'One Week In', description: 'Keep a 7-day streak.', icon: 'Flame', xpReward: 100 },
  { id: 'streak-30', title: '30-Day Streak', description: 'Keep a 30-day streak.', icon: 'Flame', xpReward: 400 },
  { id: 'streak-100', title: 'Lifer', description: 'Keep a 100-day streak.', icon: 'Flame', xpReward: 1500, secret: true },
  { id: 'rank-associate', title: 'Promoted: Associate', description: 'Reach the Associate rank.', icon: 'Briefcase', xpReward: 0 },
  { id: 'rank-md', title: 'Promoted: MD', description: 'Reach the MD rank.', icon: 'Briefcase', xpReward: 0 },
  { id: 'rank-rainmaker', title: 'Rainmaker', description: 'Reach the Rainmaker rank.', icon: 'CloudRain', xpReward: 0 },
  { id: 'full-coverage', title: 'Full Coverage', description: 'Have 2+ stories for every behavioral competency.', icon: 'LayoutGrid', xpReward: 300 },
  { id: 'story-reps-25', title: 'Polished', description: 'Practice 25 behavioral answers.', icon: 'Mic', xpReward: 200 },
  { id: 'would-advance', title: 'Moving Forward', description: 'Get a “Would advance: Yes” in the Superday Simulator.', icon: 'BadgeCheck', xpReward: 300 },
  { id: 'weekly-boss', title: 'Weekly Boss Down', description: 'Clear a Weekly Boss with 80% or better.', icon: 'Skull', xpReward: 200 },
  { id: 'comeback-5', title: 'Comeback Kid', description: 'Beat your previous best mock score 5 times.', icon: 'TrendingUp', xpReward: 150 },
  { id: 'cards-500', title: 'Spaced Out', description: 'Complete 500 flashcard reviews.', icon: 'Layers', xpReward: 200 },
  { id: 'mistakes-25', title: 'Mistake Hunter', description: 'Resolve 25 entries in your Mistake Log.', icon: 'Bug', xpReward: 150 },
  { id: 'quests-10', title: 'Questing', description: 'Complete 10 daily quests.', icon: 'ScrollText', xpReward: 150 },
];

/** Technical sections (1–9) each get an "all Elite Boutique questions cleared" badge. */
export const TECHNICAL_SECTION_IDS: SectionId[] = SECTIONS.filter((s) => s.number <= 9).map((s) => s.id);

export function eliteAchievementId(sectionId: SectionId): string {
  return `elite-${sectionId}`;
}

const ELITE: AchievementDef[] = SECTIONS.filter((s) => s.number <= 9).map((s) => ({
  id: eliteAchievementId(s.id),
  title: `Elite: ${s.shortTitle}`,
  description: `Clear every Elite Boutique question in ${s.title}.`,
  icon: 'Gem',
  xpReward: 250,
}));

export const ACHIEVEMENTS: AchievementDef[] = [...CORE, ...ELITE];

export const ACHIEVEMENT_BY_ID: Record<string, AchievementDef> = Object.fromEntries(
  ACHIEVEMENTS.map((a) => [a.id, a]),
);
