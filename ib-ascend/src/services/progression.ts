/**
 * Progression service: the single path through which activity becomes XP,
 * streaks, quests, mastery, grades, unlocks and achievements.
 *
 * UI code calls answerQuestion / completeSession / markLessonRead / … and
 * never touches XP or quest rows directly. All game rules live in the pure
 * engine modules (src/engine) and tunables in src/config/gameConfig.ts.
 */
import { db } from '../db/db';
import { COMPETENCIES } from '../content/behavioral/competencies';
import { ACHIEVEMENT_BY_ID, TECHNICAL_SECTION_IDS } from '../content/achievements';
import { getSectionContent } from '../content/registry';
import { SECTIONS } from '../content/sections';
import { newlyEarned, type AchievementContext } from '../engine/achievements';
import { sectionGrade } from '../engine/grades';
import { describeXpChange, levelFromXp, nextRank, rankForLevel } from '../engine/levels';
import { sectionMastery, subtopicMastery, type MasteryResult } from '../engine/mastery';
import { applyQuestEvent, generateDailyQuests, type ActivityEvent } from '../engine/quests';
import { buildQueue, schedule } from '../engine/srs';
import { computeStats, storyCoverage } from '../engine/stats';
import { displayStreak, tickStreak } from '../engine/streaks';
import { isSectionUnlocked, passesPostQuiz, qualifiesForFastTrack, type ProgressMap } from '../engine/unlocks';
import {
  attemptXp,
  exampleXp,
  flashcardXp,
  lessonXp,
  sessionBonus,
  type SessionBonus,
  type XpLine,
  type XpResult,
} from '../engine/xp';
import type { Grade } from '../config/gameConfig';
import { toLocalDate } from '../lib/dates';
import { newId } from '../lib/id';
import { useGameStore, type GameSnapshot } from '../store/useGameStore';
import { useProfileStore } from '../store/useProfileStore';
import { useProgressStore } from '../store/useProgressStore';
import { useUiEvents } from '../store/useUiEvents';
import { enrolSectionDeck, upsertMissedQuestionCard } from './cards';
import type {
  Attempt,
  AttemptMode,
  Card,
  Difficulty,
  Mistake,
  Quest,
  SectionId,
  SectionProgress,
  Session,
} from '../types/models';
import type { QuestionResponse } from '../types/questions';

// ───────────────────────────── Derived state ─────────────────────────────

interface Derived {
  snapshot: GameSnapshot;
  achievementCtx: AchievementContext;
}

async function computeDerived(now: Date): Promise<Derived> {
  const today = toLocalDate(now);
  const [attempts, sessions, cards, stories, arcade, unlockedRows, quests, mistakes, reviewCount, questsDone] =
    await Promise.all([
      db.attempts.toArray(),
      db.sessions.toArray(),
      db.cards.toArray(),
      db.stories.toArray(),
      db.arcadeScores.orderBy('createdAt').toArray(),
      db.achievements.toArray(),
      db.quests.where('date').equals(today).toArray(),
      db.mistakes.toArray(),
      db.reviewLogs.count(),
      db.quests.filter((q) => q.completedAt !== null).count(),
    ]);
  const progress = useProgressStore.getState().sections;
  const profile = useProfileStore.getState().profile;

  const finished = sessions
    .filter((s) => s.finishedAt !== null && s.score !== null)
    .sort((a, b) => a.startedAt.localeCompare(b.startedAt));

  const mastery = {} as Record<SectionId, MasteryResult>;
  const grades = {} as Record<SectionId, Grade | null>;
  const subtopic: Record<string, number> = {};
  const subtopicAttempts: Record<string, number> = {};
  const peakPatches: [SectionId, number][] = [];

  for (const section of SECTIONS) {
    const p = progress[section.id];
    const secAttempts = attempts.filter((a) => a.sectionId === section.id);
    const mockScores = finished
      .filter((s) => s.mode === 'mock' && s.sectionId === section.id)
      .map((s) => s.score as number);
    const m = sectionMastery({
      attempts: secAttempts,
      mockScores,
      cards: cards.filter((c) => c.sectionId === section.id),
      preQuizScore: p.preQuizScore,
      peak: p.masteryPeak,
      lastActivity: p.lastActivityAt ? new Date(p.lastActivityAt) : null,
      now,
    });
    mastery[section.id] = m;
    grades[section.id] = sectionGrade(mockScores).grade;
    if (m.mastery > p.masteryPeak + 1e-6) peakPatches.push([section.id, m.mastery]);

    for (const t of section.subtopics) {
      const subAttempts = secAttempts.filter((a) => a.subtopic === t.id);
      subtopic[`${section.id}/${t.id}`] = subtopicMastery(subAttempts, now);
      subtopicAttempts[`${section.id}/${t.id}`] = subAttempts.length;
    }
  }
  for (const [id, peak] of peakPatches) {
    await useProgressStore.getState().updateSection(id, { masteryPeak: peak });
  }

  const masteryValues = Object.fromEntries(SECTIONS.map((s) => [s.id, mastery[s.id].mastery])) as Record<
    SectionId,
    number
  >;
  const behavioral = attempts
    .filter((a) => a.mode === 'behavioral' || a.mode === 'hirevue')
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 10);
  const recentArcade = arcade.slice(-5);
  const stats = computeStats({
    mastery: masteryValues,
    storyCoverage: storyCoverage(
      stories,
      COMPETENCIES.map((c) => c.id),
    ),
    behavioralPractice: behavioral.length ? avg(behavioral.map((a) => a.score)) : null,
    arcadeAccuracy: recentArcade.length
      ? avg(recentArcade.map((r) => (r.total > 0 ? r.correct / r.total : 0)))
      : null,
  });

  const level = levelFromXp(profile.totalXp);
  const rank = rankForLevel(level.level);
  const unlocked = SECTIONS.filter((s) => isSectionUnlocked(s, progress)).map((s) => s.id);
  const queue = buildQueue(cards, today);
  const mistakesBySection: Partial<Record<SectionId, number>> = {};
  for (const m of mistakes) if (m.resolvedAt === null) mistakesBySection[m.sectionId] = (mistakesBySection[m.sectionId] ?? 0) + 1;

  const snapshot: GameSnapshot = {
    level,
    rank,
    nextRank: nextRank(level.level),
    mastery,
    subtopicMastery: subtopic,
    subtopicAttempts,
    grades,
    stats,
    unlocked,
    quests: quests.sort((a, b) => a.id.localeCompare(b.id)),
    displayStreak: displayStreak(profile.streak, today),
    cardsDue: queue.due.length + queue.fresh.length,
    cardsNew: queue.fresh.length,
    openMistakes: mistakes.filter((m) => m.resolvedAt === null).length,
    mistakesBySection,
    unlockedAchievements: unlockedRows.map((r) => r.id),
  };

  // Achievement facts.
  const correctIds = new Set(attempts.filter((a) => a.correct).map((a) => a.questionId));
  const eliteClearedSections = TECHNICAL_SECTION_IDS.filter((id) => {
    const elite = getSectionContent(id).questions.filter((q) => q.difficulty === 'elite');
    return elite.length > 0 && elite.every((q) => correctIds.has(q.id));
  });
  const paperRuns = arcade.filter((r) => r.drillId === 'paper-lbo' && r.total > 0 && r.correct === r.total);
  const competencyCounts = COMPETENCIES.map(
    (c) => stories.filter((s) => s.competencies.includes(c.id)).length,
  );

  const achievementCtx: AchievementContext = {
    totalAttempts: attempts.length,
    flawlessWalkthroughs: attempts.filter((a) => a.response.type === 'walkthrough' && a.score >= 1 - 1e-9).length,
    fastTrackedSections: SECTIONS.filter((s) => progress[s.id].fastTracked).length,
    mockBest: Object.fromEntries(
      SECTIONS.filter((s) => progress[s.id].mockBest !== null).map((s) => [s.id, progress[s.id].mockBest]),
    ),
    grades,
    passedSections: SECTIONS.filter((s) => progress[s.id].postQuizPassedAt).map((s) => s.id),
    eliteClearedSections,
    paperLboBestSec: paperRuns.length ? Math.min(...paperRuns.map((r) => r.durationSec)) : null,
    longestStreak: profile.streak.longest,
    rankId: rank.id,
    minStoriesPerCompetency: competencyCounts.length ? Math.min(...competencyCounts) : 0,
    behavioralPractices: attempts.filter((a) => a.mode === 'behavioral' || a.mode === 'hirevue').length,
    superdayAdvances: finished.filter((s) => s.mode === 'superday' && s.meta?.wouldAdvance === true).length,
    weeklyBossClears: finished.filter((s) => s.mode === 'weeklyBoss' && (s.score ?? 0) >= 0.8).length,
    personalBests: finished.filter((s) => s.meta?.personalBest === true).length,
    cardsReviewed: reviewCount,
    mistakesResolved: mistakes.filter((m) => m.resolvedAt !== null).length,
    questsCompleted: questsDone,
  };

  return { snapshot, achievementCtx };
}

/** Recompute mastery, stats, grades, unlocks, level and quests into useGameStore. */
export async function refreshDerived(now: Date = new Date()): Promise<GameSnapshot> {
  const { snapshot } = await computeDerived(now);
  useGameStore.getState().setSnapshot(snapshot);
  return snapshot;
}

/** Create today's three quests if they don't exist yet. */
export async function ensureDailyQuests(now: Date = new Date()): Promise<Quest[]> {
  const today = toLocalDate(now);
  const existing = await db.quests.where('date').equals(today).toArray();
  if (existing.length > 0) return existing;
  const snap = useGameStore.getState().snapshot ?? (await refreshDerived(now));
  const quests = generateDailyQuests({
    date: today,
    stats: snap.stats,
    mastery: Object.fromEntries(Object.entries(snap.mastery).map(([k, v]) => [k, v.mastery])) as Record<
      SectionId,
      number
    >,
    unlocked: snap.unlocked,
    cardsDue: snap.cardsDue,
    openMistakes: snap.openMistakes,
  });
  await db.quests.bulkPut(quests);
  useGameStore.getState().setSnapshot({ ...snap, quests });
  return quests;
}

// ───────────────────────────── Applying gains ─────────────────────────────

interface Gains {
  xp: number;
  reason: string;
  lines?: XpLine[];
  events: ActivityEvent[];
  /** Show an XP toast (off for per-question awards, which the quiz shows inline). */
  toast?: boolean;
}

/**
 * Tick the streak, award XP, advance quests, unlock achievements and emit
 * level-up / rank-up celebrations.
 */
async function applyGains(g: Gains, now: Date): Promise<number> {
  const today = toLocalDate(now);
  const at = now.toISOString();
  const ui = useUiEvents.getState();
  const profileStore = useProfileStore.getState();
  const startXp = profileStore.profile.totalXp;

  // Streak: any recorded activity counts.
  const tick = tickStreak(profileStore.profile.streak, today);
  if (tick.freezesUsed > 0) ui.push({ kind: 'streakFreeze', used: tick.freezesUsed });

  // Quests.
  let quests = await ensureDailyQuests(now);
  let questXp = 0;
  for (const ev of g.events) {
    const r = applyQuestEvent(quests, ev, at);
    quests = r.quests;
    for (const q of r.completed) {
      questXp += q.xpReward;
      ui.push({ kind: 'quest', title: q.title, xp: q.xpReward });
    }
  }
  await db.quests.bulkPut(quests);

  let total = startXp + g.xp + questXp;
  await profileStore.update({ totalXp: total, streak: tick.streak });
  if (g.toast && g.xp > 0) ui.push({ kind: 'xp', amount: g.xp, reason: g.reason, lines: g.lines });

  // Achievements. Their XP can cause a rank-up that unlocks a rank achievement, so loop.
  for (let pass = 0; pass < 3; pass++) {
    const { snapshot, achievementCtx } = await computeDerived(now);
    const earned = newlyEarned(achievementCtx, new Set(snapshot.unlockedAchievements));
    if (earned.length === 0) break;
    await db.achievements.bulkAdd(earned.map((id) => ({ id, unlockedAt: at })));
    let bonus = 0;
    for (const id of earned) {
      bonus += ACHIEVEMENT_BY_ID[id]?.xpReward ?? 0;
      ui.push({ kind: 'achievement', achievementId: id });
    }
    total += bonus;
    await profileStore.update({ totalXp: total });
  }

  const change = describeXpChange(startXp, total);
  if (change.newRank) ui.push({ kind: 'rankUp', rank: change.newRank, level: change.after.level });
  else if (change.leveledUp) ui.push({ kind: 'levelUp', level: change.after.level });

  await refreshDerived(now);
  return total - startXp;
}

// ───────────────────────────── Public API ─────────────────────────────

export interface AnswerInput {
  questionId: string;
  sectionId: SectionId;
  subtopic: string;
  difficulty: Difficulty;
  mode: AttemptMode;
  sessionId: string;
  response: QuestionResponse;
  correct: boolean;
  /** 0–1 */
  score: number;
  timeMs: number;
}

export interface AnswerResult {
  attempt: Attempt;
  xp: XpResult;
  resolvedMistakes: number;
}

/** Record one answered question. Wrong answers go to the Mistake Log. */
export async function answerQuestion(input: AnswerInput, now: Date = new Date()): Promise<AnswerResult> {
  const at = now.toISOString();
  const prior = await db.attempts.where('questionId').equals(input.questionId).toArray();
  const lastCorrect = prior
    .filter((a) => a.correct)
    .map((a) => a.createdAt)
    .sort()
    .at(-1);
  const subAttempts = await db.attempts
    .where('[sectionId+subtopic]')
    .equals([input.sectionId, input.subtopic])
    .toArray();
  const profile = useProfileStore.getState().profile;

  const xp = attemptXp({
    difficulty: input.difficulty,
    mode: input.mode,
    score: input.score,
    correct: input.correct,
    firstTry: prior.length === 0,
    subtopicMastery: subtopicMastery(subAttempts, now),
    lastCorrectAt: lastCorrect ? new Date(lastCorrect) : null,
    streakDays: displayStreak(profile.streak, toLocalDate(now)),
    now,
  });

  const attempt: Attempt = {
    ...input,
    id: newId('att'),
    firstTry: prior.length === 0,
    xpAwarded: xp.xp,
    createdAt: at,
  };

  let resolvedMistakes = 0;
  await db.transaction('rw', db.attempts, db.mistakes, async () => {
    await db.attempts.add(attempt);
    // HireVue answers are reviewed in their own flow, not the Mistake Log.
    if (!attempt.correct && attempt.mode !== 'hirevue') {
      const mistake: Mistake = {
        id: newId('mis'),
        questionId: attempt.questionId,
        sectionId: attempt.sectionId,
        attemptId: attempt.id,
        response: attempt.response,
        createdAt: at,
        resolvedAt: null,
      };
      await db.mistakes.add(mistake);
    } else if (attempt.mode === 'mistakes') {
      resolvedMistakes = await db.mistakes
        .where('questionId')
        .equals(attempt.questionId)
        .filter((m) => m.resolvedAt === null)
        .modify({ resolvedAt: at });
    }
  });
  // Missed questions join the review queue; the review queue schedules its own.
  if (!attempt.correct && attempt.mode !== 'hirevue' && attempt.mode !== 'review') {
    await upsertMissedQuestionCard(attempt.questionId, attempt.sectionId, now);
  }
  await useProgressStore.getState().updateSection(input.sectionId, { lastActivityAt: at });

  const events: ActivityEvent[] = [
    {
      kind: 'attempt',
      sectionId: input.sectionId,
      correct: input.correct,
      flawlessWalkthrough: input.response.type === 'walkthrough' && input.score >= 1 - 1e-9,
    },
  ];
  for (let i = 0; i < resolvedMistakes; i++) events.push({ kind: 'mistakeResolved', sectionId: input.sectionId });
  if (input.mode === 'behavioral' || input.mode === 'hirevue') events.push({ kind: 'storyPracticed' });

  await applyGains({ xp: xp.xp, reason: 'Answer', lines: xp.lines, events }, now);
  return { attempt, xp, resolvedMistakes };
}

export interface SessionInput {
  mode: AttemptMode;
  sectionId: SectionId | null;
  title: string;
  questionIds: string[];
  /** 0–1 */
  score: number;
  startedAt: string;
  meta?: Record<string, unknown>;
}

export interface SessionResult {
  session: Session;
  bonus: SessionBonus;
  /** Post-quiz only: passed the 80% bar for the first time. */
  newlyPassed: boolean;
  /** Pre-quiz only: qualified for fast-track. */
  fastTracked: boolean;
}

/** Record a finished quiz / mock / drill / Superday round and update section progress. */
export async function completeSession(input: SessionInput, now: Date = new Date()): Promise<SessionResult> {
  const at = now.toISOString();
  const previous = await db.sessions
    .where('mode')
    .equals(input.mode)
    .filter((s) => s.sectionId === input.sectionId && s.finishedAt !== null && s.score !== null)
    .toArray();
  const previousBest = previous.length ? Math.max(...previous.map((s) => s.score as number)) : null;
  const bonus = sessionBonus({
    mode: input.mode,
    score: input.score,
    questionCount: input.questionIds.length,
    previousBest,
  });

  const session: Session = {
    id: newId('ses'),
    mode: input.mode,
    sectionId: input.sectionId,
    title: input.title,
    startedAt: input.startedAt,
    finishedAt: at,
    questionIds: input.questionIds,
    score: input.score,
    xpAwarded: bonus.xp,
    meta: { ...input.meta, personalBest: bonus.personalBest },
  };
  await db.sessions.add(session);

  let newlyPassed = false;
  let fastTracked = false;
  if (input.sectionId) {
    const p = useProgressStore.getState().sections[input.sectionId];
    const patch: Partial<SectionProgress> = { lastActivityAt: at };
    if (input.mode === 'pre') {
      patch.preQuizScore = Math.max(p.preQuizScore ?? 0, input.score);
      fastTracked = qualifiesForFastTrack(input.score);
      if (fastTracked) patch.fastTracked = true;
    } else if (input.mode === 'post') {
      patch.postQuizBest = Math.max(p.postQuizBest ?? 0, input.score);
      if (passesPostQuiz(input.score) && !p.postQuizPassedAt) {
        patch.postQuizPassedAt = at;
        newlyPassed = true;
      }
    } else if (input.mode === 'mock') {
      patch.mockBest = Math.max(p.mockBest ?? 0, input.score);
    }
    await useProgressStore.getState().updateSection(input.sectionId, patch);
    // Starting real work in a section puts its flashcards into rotation.
    await enrolSectionDeck(input.sectionId, now);
  }

  await applyGains(
    {
      xp: bonus.xp,
      reason: input.title,
      lines: bonus.lines,
      events: [{ kind: 'session', sectionId: input.sectionId, mode: input.mode, score: input.score }],
      toast: true,
    },
    now,
  );
  return { session, bonus, newlyPassed, fastTracked };
}

/** Mark a reading chapter as read. Returns XP awarded (0 if already read). */
export async function markLessonRead(sectionId: SectionId, lessonId: string, now: Date = new Date()): Promise<number> {
  const p = useProgressStore.getState().sections[sectionId];
  if (p.lessonsRead.includes(lessonId)) return 0;
  await useProgressStore
    .getState()
    .updateSection(sectionId, { lessonsRead: [...p.lessonsRead, lessonId], lastActivityAt: now.toISOString() });
  await enrolSectionDeck(sectionId, now);
  return applyGains(
    { xp: lessonXp(), reason: 'Chapter read', events: [{ kind: 'lessonRead', sectionId }], toast: true },
    now,
  );
}

/** Mark a worked example as completed. Returns XP awarded (0 if already done). */
export async function markExampleCompleted(
  sectionId: SectionId,
  exampleId: string,
  difficulty: Difficulty,
  now: Date = new Date(),
): Promise<number> {
  const p = useProgressStore.getState().sections[sectionId];
  if (p.examplesCompleted.includes(exampleId)) return 0;
  await useProgressStore.getState().updateSection(sectionId, {
    examplesCompleted: [...p.examplesCompleted, exampleId],
    lastActivityAt: now.toISOString(),
  });
  return applyGains(
    {
      xp: exampleXp(difficulty),
      reason: 'Worked example',
      events: [{ kind: 'exampleCompleted', sectionId }],
      toast: true,
    },
    now,
  );
}

export interface ReviewResult {
  card: Card;
  xp: number;
}

/**
 * Review one spaced-repetition card: apply SM-2, log the review and pay XP.
 * Question cards earn their XP through answerQuestion (mode 'review'), so
 * only flashcards and stories earn review XP here.
 */
export async function reviewCard(id: string, quality: number, now: Date = new Date()): Promise<ReviewResult> {
  const card = await db.cards.get(id);
  if (!card) throw new Error(`Unknown card ${id}`);
  const at = now.toISOString();
  const updated: Card = {
    ...card,
    ...schedule(card, quality, toLocalDate(now)),
    lastReviewedAt: at,
    firstReviewedAt: card.firstReviewedAt ?? at,
  };
  await db.cards.put(updated);
  await db.reviewLogs.add({
    id: newId('rev'),
    cardId: card.id,
    source: card.source,
    sectionId: card.sectionId,
    quality,
    reviewedAt: at,
  });
  if (card.sectionId) await useProgressStore.getState().updateSection(card.sectionId, { lastActivityAt: at });
  const xp = card.source === 'question' ? 0 : flashcardXp(quality);
  const gained = await applyGains(
    { xp, reason: 'Review', events: [{ kind: 'cardReviewed', sectionId: card.sectionId }] },
    now,
  );
  return { card: updated, xp: gained };
}

/**
 * Generic hook for later tools (story practice, arcade runs, deal journal):
 * award XP and advance matching quests.
 */
export async function recordActivity(
  event: Extract<ActivityEvent, { kind: 'storyPracticed' | 'arcadeRun' | 'dealLogged' }>,
  xp: number,
  reason: string,
  now: Date = new Date(),
): Promise<number> {
  return applyGains({ xp, reason, events: [event], toast: xp > 0 }, now);
}

function avg(xs: number[]): number {
  return xs.reduce((a, b) => a + b, 0) / xs.length;
}

/** Re-exported for screens that need unlock checks without the full snapshot. */
export function sectionUnlocked(sectionId: SectionId, progress: ProgressMap): boolean {
  const s = SECTIONS.find((x) => x.id === sectionId);
  return s ? isSectionUnlocked(s, progress) : false;
}
