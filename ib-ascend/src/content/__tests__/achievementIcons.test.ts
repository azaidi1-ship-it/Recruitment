import { describe, expect, it } from 'vitest';
import { ACHIEVEMENTS } from '../achievements';
import { hasAchievementIcon } from '../../components/AchievementIcon';

describe('achievement icons', () => {
  it('every achievement icon is registered in AchievementIcon', () => {
    for (const a of ACHIEVEMENTS) expect(hasAchievementIcon(a.icon), `${a.id}: ${a.icon}`).toBe(true);
  });
});
