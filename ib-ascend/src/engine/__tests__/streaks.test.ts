import { describe, expect, it } from 'vitest';
import { displayStreak, tickStreak } from '../streaks';
import type { Streak } from '../../types/models';

const empty: Streak = { current: 0, longest: 0, lastActiveDate: null, freezes: 0, lastFreezeGrantWeek: null };

// 2026-10-12 is a Monday; 12–18 Oct is ISO week 42.
describe('tickStreak', () => {
  it('starts at 1 and grants the week’s freeze', () => {
    const t = tickStreak(empty, '2026-10-12');
    expect(t.streak).toMatchObject({ current: 1, longest: 1, freezes: 1, lastFreezeGrantWeek: '2026-W42' });
    expect(t.freezeGranted).toBe(true);
  });

  it('is idempotent within a day', () => {
    const a = tickStreak(empty, '2026-10-12').streak;
    const b = tickStreak(a, '2026-10-12');
    expect(b.advanced).toBe(false);
    expect(b.streak.current).toBe(1);
  });

  it('continues day to day, bridges a missed day with a freeze, then breaks when out of freezes', () => {
    let s = tickStreak(empty, '2026-10-12').streak;
    s = tickStreak(s, '2026-10-13').streak;
    expect(s).toMatchObject({ current: 2, freezes: 1 });

    const bridged = tickStreak(s, '2026-10-15'); // missed the 14th
    expect(bridged.freezesUsed).toBe(1);
    expect(bridged.streak).toMatchObject({ current: 3, freezes: 0 });

    const broken = tickStreak(bridged.streak, '2026-10-18'); // missed 16th and 17th, no freezes
    expect(broken.reset).toBe(true);
    expect(broken.streak).toMatchObject({ current: 1, longest: 3 });

    const nextWeek = tickStreak(broken.streak, '2026-10-19');
    expect(nextWeek.streak).toMatchObject({ current: 2, freezes: 1 });
    expect(nextWeek.freezeGranted).toBe(true);
  });

  it('banks at most 2 freezes', () => {
    const s: Streak = { current: 5, longest: 5, lastActiveDate: '2026-10-18', freezes: 2, lastFreezeGrantWeek: '2026-W42' };
    const t = tickStreak(s, '2026-10-19');
    expect(t.streak.freezes).toBe(2);
    expect(t.freezeGranted).toBe(false);
  });
});

describe('displayStreak', () => {
  const s: Streak = { current: 2, longest: 2, lastActiveDate: '2026-10-13', freezes: 0, lastFreezeGrantWeek: '2026-W42' };
  it('shows the streak while it can still continue', () => {
    expect(displayStreak(s, '2026-10-13')).toBe(2);
    expect(displayStreak(s, '2026-10-14')).toBe(2);
  });
  it('shows 0 once a day is missed with no freezes', () => {
    expect(displayStreak(s, '2026-10-15')).toBe(0);
    expect(displayStreak({ ...s, freezes: 1 }, '2026-10-15')).toBe(2);
  });
});
