import { beforeEach, describe, expect, it } from 'vitest';
import { useUiEvents } from '../useUiEvents';
import { rankForLevel } from '../../engine/levels';

beforeEach(() => useUiEvents.getState().clear());

describe('celebration queue', () => {
  it('merges consecutive level-ups into the highest one', () => {
    const { push } = useUiEvents.getState();
    push({ kind: 'levelUp', level: 2 });
    push({ kind: 'levelUp', level: 3 });
    const q = useUiEvents.getState().queue;
    expect(q).toHaveLength(1);
    expect(q[0]).toMatchObject({ kind: 'levelUp', level: 3 });
  });

  it('lets a rank-up absorb pending level-ups and later ones', () => {
    const { push } = useUiEvents.getState();
    push({ kind: 'levelUp', level: 2 });
    push({ kind: 'achievement', achievementId: 'first-answer' });
    push({ kind: 'rankUp', rank: rankForLevel(3), level: 3 });
    push({ kind: 'levelUp', level: 4 });
    const q = useUiEvents.getState().queue;
    expect(q.map((e) => e.kind)).toEqual(['achievement', 'rankUp']);
    expect(q[1]).toMatchObject({ level: 4 });
  });
});
