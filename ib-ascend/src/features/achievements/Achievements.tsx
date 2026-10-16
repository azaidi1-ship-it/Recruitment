import { useLiveQuery } from 'dexie-react-hooks';
import { Lock } from 'lucide-react';
import { db } from '../../db/db';
import { ACHIEVEMENTS } from '../../content/achievements';
import { AchievementIcon } from '../../components/AchievementIcon';
import { Card, PageHeader, cx } from '../../components/ui';

export function Achievements() {
  const unlocked = useLiveQuery(() => db.achievements.toArray(), [], []);
  const at = new Map(unlocked.map((u) => [u.id, u.unlockedAt]));

  return (
    <>
      <PageHeader title="Achievements" subtitle={`${at.size} of ${ACHIEVEMENTS.length} unlocked`} />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {ACHIEVEMENTS.map((a) => {
          const when = at.get(a.id);
          const hidden = a.secret && !when;
          return (
            <Card key={a.id} className={cx('flex gap-3', !when && 'opacity-55')}>
              <span
                className={cx(
                  'grid size-10 shrink-0 place-items-center rounded-lg border',
                  when ? 'border-accent/40 bg-accent-soft text-accent' : 'border-line bg-sunk text-faint',
                )}
              >
                {hidden ? <Lock size={18} /> : <AchievementIcon name={a.icon} />}
              </span>
              <div className="min-w-0">
                <h2 className="text-sm font-semibold">{hidden ? 'Secret achievement' : a.title}</h2>
                <p className="text-xs text-muted">{hidden ? 'Keep going.' : a.description}</p>
                <p className="mt-1 text-[11px] text-faint tabular">
                  {when ? `Unlocked ${new Date(when).toLocaleDateString()}` : a.xpReward > 0 ? `+${a.xpReward} XP` : ''}
                </p>
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
}
