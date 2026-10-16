import { Link } from 'react-router-dom';
import { ArrowRight, Compass, Crosshair, Gauge, Repeat } from 'lucide-react';
import type { Readiness } from '../../engine/readiness';
import type { NextAction } from '../../engine/recommend';
import { drillPath } from '../../engine/recommend';
import type { WeakSubtopic } from '../../engine/analytics';
import { Button, Card } from '../../components/ui';
import { ProgressBar, masteryTone } from '../../components/Progress';

function readinessBand(score: number): string {
  if (score >= 85) return 'Interview-ready';
  if (score >= 70) return 'Nearly there';
  if (score >= 40) return 'Building';
  return 'Getting started';
}

export function ReadinessCard({ readiness }: { readiness: Readiness }) {
  return (
    <Card>
      <h2 className="flex items-center gap-2 text-sm font-medium text-muted">
        <Gauge size={15} /> Interview Readiness
      </h2>
      <p className="mt-2 flex items-baseline gap-2">
        <span className="text-5xl font-semibold tabular">{readiness.score}</span>
        <span className="text-sm text-muted">/ 100 · {readinessBand(readiness.score)}</span>
      </p>
      <ProgressBar value={readiness.score / 100} className="mt-3" label="Interview readiness" />
      {readiness.levers.length > 0 && (
        <>
          <p className="mt-4 mb-1.5 text-xs text-faint">Biggest levers (points still available)</p>
          <ul className="space-y-1 text-sm">
            {readiness.levers.map((l) => (
              <li key={l.sectionId} className="flex justify-between gap-2">
                <Link to={`/section/${l.sectionId}`} className="truncate hover:text-accent">
                  {l.title}
                  {l.sectionId === 'fit' && <span className="text-faint"> (incl. stories)</span>}
                </Link>
                <span className="shrink-0 text-muted tabular">+{l.gap.toFixed(1)}</span>
              </li>
            ))}
          </ul>
        </>
      )}
      <p className="mt-3 text-[11px] text-faint">Mastery weighted by how often each topic comes up in interviews.</p>
    </Card>
  );
}

export function NextActionCard({ action }: { action: NextAction }) {
  return (
    <Card className="flex flex-col border-accent/40">
      <h2 className="flex items-center gap-2 text-sm font-medium text-accent">
        <Compass size={15} /> Next best action
      </h2>
      <p className="mt-2 text-lg font-semibold leading-snug">{action.title}</p>
      <p className="mt-1 flex-1 text-sm text-muted">{action.detail}</p>
      <Link to={action.to} className="mt-4">
        <Button variant="primary" className="w-full">
          {action.cta} <ArrowRight size={16} />
        </Button>
      </Link>
    </Card>
  );
}

export function DueTodayCard({ due, fresh, missed }: { due: number; fresh: number; missed: number }) {
  const total = due + fresh;
  return (
    <Card className="flex flex-col">
      <h2 className="flex items-center gap-2 text-sm font-medium text-muted">
        <Repeat size={15} /> Due today
      </h2>
      <p className="mt-2 text-5xl font-semibold tabular">{total}</p>
      <p className="mt-1 flex-1 text-sm text-muted">
        {total === 0
          ? 'All caught up.'
          : [
              due - missed > 0 && `${due - missed} review${due - missed === 1 ? '' : 's'}`,
              missed > 0 && `${missed} missed question${missed === 1 ? '' : 's'}`,
              fresh > 0 && `${fresh} new`,
            ]
              .filter(Boolean)
              .join(' · ')}
      </p>
      <Link to="/review" className="mt-4">
        <Button className="w-full" disabled={total === 0}>
          {total === 0 ? 'Open review' : 'Start review'}
        </Button>
      </Link>
    </Card>
  );
}

export function WeakSubtopicsCard({ items }: { items: WeakSubtopic[] }) {
  return (
    <Card>
      <h2 className="mb-1 flex items-center gap-2 font-semibold">
        <Crosshair size={16} className="text-muted" /> Weakest subtopics
      </h2>
      {items.length === 0 ? (
        <p className="mt-2 text-sm text-muted">Answer some questions and your weak spots will show up here with one-click drills.</p>
      ) : (
        <ul className="mt-2 divide-y divide-line">
          {items.map((w) => (
            <li key={`${w.sectionId}/${w.subtopicId}`} className="flex items-center gap-3 py-2.5">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm">{w.title}</p>
                <div className="mt-1 flex items-center gap-2">
                  <ProgressBar value={w.mastery} barClassName={masteryTone(w.mastery)} label={`${w.title} mastery`} />
                  <span className="w-24 shrink-0 text-right text-[11px] text-muted tabular">
                    {w.attempts > 0 ? `${Math.round(w.mastery * 100)}% · ${w.sectionTitle}` : `untested · ${w.sectionTitle}`}
                  </span>
                </div>
              </div>
              <Link to={drillPath(w.sectionId, w.subtopicId)}>
                <Button className="!px-3 !py-1.5 text-xs">Drill</Button>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
