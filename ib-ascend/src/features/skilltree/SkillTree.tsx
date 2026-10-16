import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { SECTION_BY_ID } from '../../content/sections';
import { useGameStore } from '../../store/useGameStore';
import { useProgressStore } from '../../store/useProgressStore';
import { missingPrerequisites } from '../../engine/unlocks';
import { STAT_LABEL, type SectionId, type StatKey } from '../../types/models';
import { Badge, Card, PageHeader, cx } from '../../components/ui';
import { GradeBadge } from '../../components/GradeBadge';
import { ProgressBar, masteryTone } from '../../components/Progress';

/** Tiers of the technical tree, top to bottom. */
const TIERS: SectionId[][] = [
  ['accounting'],
  ['walkthroughs'],
  ['ev-equity'],
  ['valuation'],
  ['comps', 'dcf'],
  ['mna'],
  ['lbo'],
  ['restructuring'],
];
const OPEN: SectionId[] = ['mental-math', 'markets', 'fit'];

export function SkillTree() {
  return (
    <>
      <PageHeader
        title="Skill Tree"
        subtitle="Pass a section’s post-quiz (80%+) to unlock the next tier. Mental Math, Markets and Fit are always open."
      />
      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="flex flex-col items-center">
          {TIERS.map((tier, i) => (
            <div key={i} className="flex w-full flex-col items-center">
              {i > 0 && <div className="h-5 w-px bg-line" aria-hidden />}
              <div className={cx('grid w-full gap-3', tier.length > 1 ? 'max-w-2xl grid-cols-1 sm:grid-cols-2' : 'max-w-sm')}>
                {tier.map((id) => (
                  <Node key={id} id={id} />
                ))}
              </div>
            </div>
          ))}
        </div>
        <div>
          <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted">Always open</h2>
          <div className="grid gap-3">
            {OPEN.map((id) => (
              <Node key={id} id={id} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function Node({ id }: { id: SectionId }) {
  const snap = useGameStore((s) => s.snapshot);
  const progress = useProgressStore((s) => s.sections);
  if (!snap) return null;
  const section = SECTION_BY_ID[id];
  const locked = !snap.unlocked.includes(id);
  const m = snap.mastery[id].mastery;
  const missing = missingPrerequisites(section, progress);

  const body = (
    <Card className={cx('h-full transition', locked ? 'opacity-60' : 'hover:border-faint')}>
      <div className="mb-1 flex items-center justify-between gap-2">
        <span className="text-xs text-faint tabular">Section {section.number}</span>
        {locked ? <Lock size={14} className="text-faint" /> : <GradeBadge grade={snap.grades[id]} />}
      </div>
      <h3 className="font-semibold leading-snug">{section.title}</h3>
      <div className="mt-3 flex items-center gap-2">
        <ProgressBar value={m} barClassName={masteryTone(m)} label={`${section.title} mastery`} />
        <span className="w-9 text-right text-xs text-muted tabular">{Math.round(m * 100)}%</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {Object.keys(section.statWeights).map((k) => (
          <Badge key={k} tone="accent">
            {STAT_LABEL[k as StatKey]}
          </Badge>
        ))}
        {progress[id].fastTracked && <Badge tone="info">Fast-tracked</Badge>}
        {progress[id].postQuizPassedAt && <Badge tone="ok">Cleared</Badge>}
      </div>
      {locked && (
        <p className="mt-3 text-xs text-faint">
          Pass {missing.map((p) => SECTION_BY_ID[p].shortTitle).join(' and ')} to unlock
        </p>
      )}
    </Card>
  );

  return locked ? (
    <div aria-disabled="true">{body}</div>
  ) : (
    <Link to={`/section/${id}`} className="block h-full">
      {body}
    </Link>
  );
}
