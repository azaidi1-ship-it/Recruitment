import { Link } from 'react-router-dom';
import { CheckCircle2, Circle, Flame, Lock, Snowflake } from 'lucide-react';
import { SECTIONS } from '../../content/sections';
import { useGameStore } from '../../store/useGameStore';
import { useProfileStore } from '../../store/useProfileStore';
import { STAT_LABEL, type StatKey } from '../../types/models';
import { totalXpForLevel } from '../../engine/levels';
import { Badge, Card, PageHeader } from '../../components/ui';
import { GradeBadge } from '../../components/GradeBadge';
import { ProgressBar, masteryTone } from '../../components/Progress';

/**
 * TODO(Phase 7): stats radar, Interview Readiness Score, weakest subtopics,
 * activity heatmap, mock trends, Due Today queue and next best action.
 */
export function Dashboard() {
  const profile = useProfileStore((s) => s.profile);
  const snap = useGameStore((s) => s.snapshot);
  if (!snap) return null;

  const toNextRank = snap.nextRank ? totalXpForLevel(snap.nextRank.minLevel) - profile.totalXp : 0;

  return (
    <>
      <PageHeader title={`Welcome back, ${profile.displayName}`} />

      <div className="mb-4 grid gap-4 lg:grid-cols-[2fr_1fr]">
        <Card>
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-accent">{snap.rank.title}</p>
              <p className="mt-1 text-3xl font-semibold tabular">Level {snap.level.level}</p>
            </div>
            <p className="text-sm text-muted tabular">{profile.totalXp.toLocaleString()} XP total</p>
          </div>
          <ProgressBar value={snap.level.progress} className="mt-4 h-3" label="Progress to next level" />
          <div className="mt-2 flex flex-wrap justify-between gap-2 text-xs text-muted tabular">
            <span>
              {snap.level.xpIntoLevel.toLocaleString()} / {snap.level.xpForNext.toLocaleString()} XP to level {snap.level.level + 1}
            </span>
            {snap.nextRank && (
              <span>
                {toNextRank.toLocaleString()} XP to {snap.nextRank.title} (level {snap.nextRank.minLevel})
              </span>
            )}
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <Flame size={36} className={snap.displayStreak > 0 ? 'text-accent' : 'text-faint'} />
          <div>
            <p className="text-3xl font-semibold tabular">
              {snap.displayStreak} <span className="text-base font-normal text-muted">day streak</span>
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-muted">
              <Snowflake size={13} /> {profile.streak.freezes} freeze{profile.streak.freezes === 1 ? '' : 's'} banked · longest{' '}
              {profile.streak.longest}
            </p>
          </div>
        </Card>
      </div>

      <div className="mb-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="mb-3 font-semibold">Today’s quests</h2>
          <ul className="space-y-3">
            {snap.quests.map((q) => (
              <li key={q.id} className="flex items-start gap-3">
                {q.completedAt ? (
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-ok" />
                ) : (
                  <Circle size={18} className="mt-0.5 shrink-0 text-faint" />
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2 text-sm">
                    <span className={q.completedAt ? 'text-muted line-through' : ''}>{q.title}</span>
                    <span className="shrink-0 text-xs text-accent tabular">+{q.xpReward} XP</span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-2">
                    <ProgressBar value={q.progress / q.target} barClassName={q.completedAt ? 'bg-ok' : 'bg-accent'} />
                    <span className="text-xs text-muted tabular">
                      {q.progress}/{q.target}
                    </span>
                  </div>
                  {q.stat && <p className="mt-1 text-[11px] text-faint">Trains {STAT_LABEL[q.stat]}</p>}
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <h2 className="mb-3 font-semibold">Stats</h2>
          <ul className="space-y-2.5">
            {(Object.keys(STAT_LABEL) as StatKey[]).map((k) => (
              <li key={k} className="grid grid-cols-[90px_1fr_32px] items-center gap-3 text-sm">
                <span className="text-muted">{STAT_LABEL[k]}</span>
                <ProgressBar value={snap.stats[k] / 100} barClassName={masteryTone(snap.stats[k] / 100)} />
                <span className="text-right tabular">{snap.stats[k]}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="font-semibold">Sections</h2>
          <Link to="/tree" className="text-sm text-accent hover:underline">
            Skill tree →
          </Link>
        </div>
        <ul className="divide-y divide-line">
          {SECTIONS.map((s) => {
            const locked = !snap.unlocked.includes(s.id);
            const m = snap.mastery[s.id].mastery;
            return (
              <li key={s.id} className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1.5 py-2.5 text-sm sm:grid-cols-[1fr_160px_auto]">
                <span className={locked ? 'text-faint' : ''}>
                  <span className="mr-2 text-faint tabular">{String(s.number).padStart(2, '0')}</span>
                  {s.title}
                  {locked && <Lock size={12} className="ml-1.5 inline" />}
                </span>
                <span className="order-3 col-span-2 flex items-center gap-2 sm:order-none sm:col-span-1">
                  <ProgressBar value={m} barClassName={masteryTone(m)} label={`${s.title} mastery`} />
                  <span className="w-9 text-right text-xs text-muted tabular">{Math.round(m * 100)}%</span>
                </span>
                <GradeBadge grade={snap.grades[s.id]} />
              </li>
            );
          })}
        </ul>
        <p className="mt-3 flex items-center gap-2 text-xs text-faint">
          <Badge>Grades</Badge> come from your best Boss Fight and your last three runs. S needs three runs.
        </p>
      </Card>
    </>
  );
}
