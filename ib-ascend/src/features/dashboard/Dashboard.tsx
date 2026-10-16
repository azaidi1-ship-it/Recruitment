import { Link } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/db';
import { SECTIONS } from '../../content/sections';
import { useProfileStore } from '../../store/useProfileStore';
import { useProgressStore } from '../../store/useProgressStore';
import { Badge, Card, PageHeader } from '../../components/ui';

/**
 * Phase 1 dashboard: shows what is persisted so far.
 * TODO(Phase 2): level, rank, XP bar, quests. TODO(Phase 7): radar, readiness,
 * heatmap, mock trends, weakest subtopics, next best action.
 */
export function Dashboard() {
  const profile = useProfileStore((s) => s.profile);
  const sections = useProgressStore((s) => s.sections);
  const counts = useLiveQuery(async () => ({
    attempts: await db.attempts.count(),
    openMistakes: await db.mistakes.filter((m) => m.resolvedAt === null).count(),
    cards: await db.cards.count(),
  }));

  return (
    <>
      <PageHeader title={`Welcome back, ${profile.displayName}`} subtitle="Your progress is saved in this browser. Back it up from Settings." />

      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Total XP" value={profile.totalXp.toLocaleString()} />
        <Stat label="Streak" value={`${profile.streak.current} day${profile.streak.current === 1 ? '' : 's'}`} />
        <Stat label="Questions answered" value={String(counts?.attempts ?? 0)} />
        <Stat label="Open mistakes" value={String(counts?.openMistakes ?? 0)} />
      </div>

      <Card>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold">Sections</h2>
          <Link to="/tree" className="text-sm text-accent hover:underline">
            Skill tree →
          </Link>
        </div>
        <ul className="divide-y divide-line">
          {SECTIONS.map((s) => {
            const p = sections[s.id];
            return (
              <li key={s.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5 text-sm">
                <span>
                  <span className="mr-2 text-faint tabular">{String(s.number).padStart(2, '0')}</span>
                  {s.title}
                </span>
                <span className="flex gap-1.5">
                  {p.postQuizPassedAt ? <Badge tone="ok">Post-quiz passed</Badge> : null}
                  {p.mockBest !== null ? <Badge tone="accent">Mock best {Math.round(p.mockBest * 100)}%</Badge> : null}
                  {!p.postQuizPassedAt && p.mockBest === null ? <Badge>Not started</Badge> : null}
                </span>
              </li>
            );
          })}
        </ul>
      </Card>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Card className="!p-4">
      <div className="text-xs text-muted">{label}</div>
      <div className="mt-1 text-xl font-semibold tabular">{value}</div>
    </Card>
  );
}
