import { LEVEL, RANKS, type RankId } from '../config/gameConfig';

/** XP needed to advance from `level` to `level + 1`. */
export function xpToNext(level: number): number {
  return Math.round(LEVEL.base * Math.pow(level, LEVEL.exponent));
}

/** Total XP needed to reach `level` from zero (level 1 = 0 XP). */
export function totalXpForLevel(level: number): number {
  let total = 0;
  for (let l = 1; l < level; l++) total += xpToNext(l);
  return total;
}

export interface LevelInfo {
  level: number;
  /** XP earned since reaching the current level. */
  xpIntoLevel: number;
  /** XP needed for the next level. */
  xpForNext: number;
  /** 0–1 progress through the current level. */
  progress: number;
}

export function levelFromXp(totalXp: number): LevelInfo {
  let level = 1;
  let remaining = Math.max(0, Math.floor(totalXp));
  while (remaining >= xpToNext(level)) {
    remaining -= xpToNext(level);
    level += 1;
  }
  const xpForNext = xpToNext(level);
  return { level, xpIntoLevel: remaining, xpForNext, progress: remaining / xpForNext };
}

export interface Rank {
  id: RankId;
  title: string;
  minLevel: number;
}

export function rankForLevel(level: number): Rank {
  let rank: Rank = RANKS[0];
  for (const r of RANKS) if (level >= r.minLevel) rank = r;
  return rank;
}

export function nextRank(level: number): Rank | null {
  return RANKS.find((r) => r.minLevel > level) ?? null;
}

export interface XpChange {
  before: LevelInfo;
  after: LevelInfo;
  leveledUp: boolean;
  /** Set when the change crosses into a new rank. */
  newRank: Rank | null;
}

export function describeXpChange(prevTotal: number, nextTotal: number): XpChange {
  const before = levelFromXp(prevTotal);
  const after = levelFromXp(nextTotal);
  const rb = rankForLevel(before.level);
  const ra = rankForLevel(after.level);
  return {
    before,
    after,
    leveledUp: after.level > before.level,
    newRank: ra.id !== rb.id && after.level > before.level ? ra : null,
  };
}
