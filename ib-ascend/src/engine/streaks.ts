import { STREAK } from '../config/gameConfig';
import { daysBetween, isoWeek } from '../lib/dates';
import type { ISODate, Streak } from '../types/models';

export interface StreakTick {
  streak: Streak;
  /** Freezes spent to bridge missed days. */
  freezesUsed: number;
  /** A new freeze was granted this week. */
  freezeGranted: boolean;
  /** The streak broke and restarted at 1. */
  reset: boolean;
  /** First qualifying activity today. */
  advanced: boolean;
}

/**
 * Register qualifying activity on `today`. Idempotent within a day.
 * Missed days are bridged with banked freezes if there are enough; otherwise
 * the streak restarts. One freeze is granted per ISO week of activity.
 */
export function tickStreak(prev: Streak, today: ISODate): StreakTick {
  const s: Streak = { ...prev };
  let freezesUsed = 0;
  let reset = false;
  let freezeGranted = false;

  if (s.lastActiveDate === today) {
    return { streak: s, freezesUsed, freezeGranted, reset, advanced: false };
  }

  if (s.lastActiveDate === null) {
    s.current = 1;
  } else {
    const gap = daysBetween(s.lastActiveDate, today);
    const missed = gap - 1;
    if (gap <= 0) {
      // Clock moved backwards; don't punish, don't advance.
      return { streak: s, freezesUsed, freezeGranted, reset, advanced: false };
    } else if (missed === 0) {
      s.current += 1;
    } else if (missed <= s.freezes) {
      s.freezes -= missed;
      freezesUsed = missed;
      s.current += 1;
    } else {
      s.current = 1;
      reset = true;
    }
  }

  s.lastActiveDate = today;
  s.longest = Math.max(s.longest, s.current);

  const week = isoWeek(today);
  if (s.lastFreezeGrantWeek !== week) {
    s.lastFreezeGrantWeek = week;
    if (s.freezes < STREAK.maxFreezes) {
      s.freezes += 1;
      freezeGranted = true;
    }
  }
  return { streak: s, freezesUsed, freezeGranted, reset, advanced: true };
}

/** Streak as it should be displayed today (0 if it has lapsed beyond what freezes can cover). */
export function displayStreak(s: Streak, today: ISODate): number {
  if (!s.lastActiveDate) return 0;
  const missed = daysBetween(s.lastActiveDate, today) - 1;
  return missed <= s.freezes ? s.current : 0;
}
