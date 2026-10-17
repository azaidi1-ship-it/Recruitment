import { QUESTS } from '../config/gameConfig';
import { QUEST_TEMPLATES, type QuestTemplate } from '../content/questTemplates';
import { SECTIONS, SECTION_BY_ID } from '../content/sections';
import { hashString, mulberry32, shuffle } from '../lib/random';
import type { AttemptMode, ISODate, ISODateTime, Quest, SectionId, StatKey } from '../types/models';

export interface QuestGenInput {
  date: ISODate;
  /** Stats 0–100. */
  stats: Record<StatKey, number>;
  /** Section mastery 0–1. */
  mastery: Record<SectionId, number>;
  unlocked: SectionId[];
  cardsDue: number;
  openMistakes: number;
}

function resolveSection(t: QuestTemplate, input: QuestGenInput): SectionId | null | undefined {
  if (!t.sectionScope) return null;
  const pool =
    t.sectionScope === 'byStat'
      ? SECTIONS.filter((s) => t.stat && (s.statWeights[t.stat] ?? 0) > 0).map((s) => s.id)
      : t.sectionScope;
  const open = pool.filter((id) => input.unlocked.includes(id));
  if (open.length === 0) return undefined; // template not applicable today
  // Weakest open section first; ties keep the tree order.
  return [...open].sort((a, b) => (input.mastery[a] ?? 0) - (input.mastery[b] ?? 0))[0]!;
}

function instantiate(t: QuestTemplate, sectionId: SectionId | null, date: ISODate, index: number): Quest {
  const title = sectionId ? t.title.replace('{section}', SECTION_BY_ID[sectionId].shortTitle) : t.title;
  return {
    id: `${date}-${index}`,
    date,
    templateId: t.id,
    title,
    stat: t.stat,
    sectionId,
    metric: t.metric,
    target: t.target,
    progress: 0,
    xpReward: t.xpReward,
    completedAt: null,
    ...(t.minScore !== undefined ? { minScore: t.minScore } : {}),
  };
}

/**
 * Three quests for `date`, aimed at the weakest stats. Deterministic for a
 * given date and input. If enough flashcards are due (or mistakes open), the
 * third quest becomes a review (or Redo Mistakes) quest.
 */
export function generateDailyQuests(input: QuestGenInput): Quest[] {
  const rng = mulberry32(hashString(input.date));
  const statOrder = shuffle(Object.keys(input.stats) as StatKey[], rng).sort(
    (a, b) => input.stats[a] - input.stats[b],
  );

  const chosen: { t: QuestTemplate; sectionId: SectionId | null }[] = [];
  for (const stat of statOrder) {
    if (chosen.length >= QUESTS.perDay) break;
    const options = shuffle(
      QUEST_TEMPLATES.filter((t) => t.stat === stat),
      rng,
    );
    for (const t of options) {
      const sectionId = resolveSection(t, input);
      if (sectionId !== undefined) {
        chosen.push({ t, sectionId });
        break;
      }
    }
  }

  const general =
    input.cardsDue >= QUESTS.reviewQuestDueThreshold
      ? QUEST_TEMPLATES.find((t) => t.id === 'gen-review')
      : input.openMistakes >= QUESTS.mistakeQuestThreshold
        ? QUEST_TEMPLATES.find((t) => t.id === 'gen-mistakes')
        : undefined;
  if (general) {
    if (chosen.length >= QUESTS.perDay) chosen.pop();
    chosen.push({ t: general, sectionId: null });
  }

  return chosen.slice(0, QUESTS.perDay).map((c, i) => instantiate(c.t, c.sectionId, input.date, i));
}

/** Everything that can advance a quest. */
export type ActivityEvent =
  | { kind: 'attempt'; sectionId: SectionId; correct: boolean; flawlessWalkthrough: boolean }
  | { kind: 'session'; sectionId: SectionId | null; mode: AttemptMode; score: number }
  | { kind: 'lessonRead'; sectionId: SectionId }
  | { kind: 'exampleCompleted'; sectionId: SectionId }
  | { kind: 'cardReviewed'; sectionId: SectionId | null }
  | { kind: 'mistakeResolved'; sectionId: SectionId }
  | { kind: 'storyPracticed' }
  | { kind: 'arcadeRun' }
  | { kind: 'dealLogged' }
  | { kind: 'dealPitched' };

const SCORED_SESSION_MODES: AttemptMode[] = ['pre', 'post', 'mock', 'drill', 'review', 'mistakes', 'weeklyBoss'];

/** How much `event` advances `quest` (0 if unrelated). */
export function questIncrement(quest: Quest, event: ActivityEvent): number {
  const sectionOk = (id: SectionId | null) => quest.sectionId === null || quest.sectionId === id;
  switch (quest.metric) {
    case 'correctAnswers':
      return event.kind === 'attempt' && event.correct && sectionOk(event.sectionId) ? 1 : 0;
    case 'flawlessWalkthroughs':
      return event.kind === 'attempt' && event.flawlessWalkthrough ? 1 : 0;
    case 'sessionScore':
      return event.kind === 'session' &&
        SCORED_SESSION_MODES.includes(event.mode) &&
        sectionOk(event.sectionId) &&
        event.score >= (quest.minScore ?? 0) - 1e-9
        ? 1
        : 0;
    case 'mocksCompleted':
      return event.kind === 'session' && event.mode === 'mock' && sectionOk(event.sectionId) ? 1 : 0;
    case 'lessonsRead':
      return event.kind === 'lessonRead' && sectionOk(event.sectionId) ? 1 : 0;
    case 'examplesCompleted':
      return event.kind === 'exampleCompleted' && sectionOk(event.sectionId) ? 1 : 0;
    case 'cardsReviewed':
      return event.kind === 'cardReviewed' ? 1 : 0;
    case 'mistakesResolved':
      return event.kind === 'mistakeResolved' ? 1 : 0;
    case 'storiesPracticed':
      return event.kind === 'storyPracticed' ? 1 : 0;
    case 'arcadeRuns':
      return event.kind === 'arcadeRun' ? 1 : 0;
    case 'dealsLogged':
      return event.kind === 'dealLogged' ? 1 : 0;
  }
}

export interface QuestUpdate {
  quests: Quest[];
  /** Quests that completed with this event. */
  completed: Quest[];
}

export function applyQuestEvent(quests: Quest[], event: ActivityEvent, at: ISODateTime): QuestUpdate {
  const completed: Quest[] = [];
  const next = quests.map((q) => {
    if (q.completedAt) return q;
    const inc = questIncrement(q, event);
    if (inc === 0) return q;
    const progress = Math.min(q.target, q.progress + inc);
    const done = progress >= q.target;
    const updated: Quest = { ...q, progress, completedAt: done ? at : null };
    if (done) completed.push(updated);
    return updated;
  });
  return { quests: next, completed };
}
