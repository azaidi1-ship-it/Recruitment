import { Link, NavLink, Outlet } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/db';
import { SECTION_BY_ID } from '../../content/sections';
import { missingPrerequisites } from '../../engine/unlocks';
import { useProgressStore } from '../../store/useProgressStore';
import { Card, PageHeader, cx } from '../../components/ui';
import { GradeBadge } from '../../components/GradeBadge';
import { ProgressBar, masteryTone } from '../../components/Progress';
import { useSection } from './useSection';

const TABS = [
  { to: '', label: 'Path', end: true },
  { to: 'read', label: 'Reading' },
  { to: 'examples', label: 'Examples' },
  { to: 'flashcards', label: 'Flashcards' },
  { to: 'mistakes', label: 'Mistakes' },
  { to: 'cheatsheet', label: 'Cheat sheet' },
];

export function SectionLayout() {
  const ctx = useSection();
  const progress = useProgressStore((s) => s.sections);
  const openMistakes = useLiveQuery(
    () => (ctx ? db.mistakes.where('sectionId').equals(ctx.section.id).filter((m) => m.resolvedAt === null).count() : 0),
    [ctx?.section.id],
    0,
  );
  if (!ctx) return <PageHeader title="Section not found" />;
  const { section, content, mastery, grade, unlocked } = ctx;

  if (!unlocked) {
    const missing = missingPrerequisites(section, progress);
    return (
      <>
        <PageHeader title={section.title} subtitle={section.description} />
        <Card className="flex items-start gap-3">
          <Lock className="mt-0.5 text-faint" size={18} />
          <div className="text-sm">
            <p className="font-medium">Locked</p>
            <p className="text-muted">
              Pass the post-quiz (80%+) in{' '}
              {missing.map((id, i) => (
                <span key={id}>
                  {i > 0 && ' and '}
                  <Link className="text-accent hover:underline" to={`/section/${id}`}>
                    {SECTION_BY_ID[id].title}
                  </Link>
                </span>
              ))}{' '}
              to unlock this section.
            </p>
          </div>
        </Card>
      </>
    );
  }

  if (content.status === 'empty') {
    const phase = section.number <= 4 ? 4 : section.number <= 8 ? 5 : 6;
    return (
      <>
        <PageHeader title={section.title} subtitle={section.description} />
        <Card>
          <p className="text-xs font-medium uppercase tracking-wide text-accent">Content ships in Phase {phase}</p>
          <p className="mt-1 text-sm text-muted">The lessons, examples and question bank for this section haven’t been written yet.</p>
        </Card>
      </>
    );
  }

  return (
    <>
      <div className="no-print">
        <PageHeader
          title={section.title}
          subtitle={section.description}
          right={
            <div className="flex items-center gap-3">
              <div className="w-36">
                <div className="mb-1 flex justify-between text-xs text-muted">
                  <span>Mastery</span>
                  <span className="tabular">{Math.round(mastery.mastery * 100)}%</span>
                </div>
                <ProgressBar value={mastery.mastery} barClassName={masteryTone(mastery.mastery)} />
              </div>
              <GradeBadge grade={grade} />
            </div>
          }
        />
        <nav className="-mx-1 mb-5 flex gap-1 overflow-x-auto border-b border-line px-1" aria-label="Section">
          {TABS.map((t) => (
            <NavLink
              key={t.label}
              to={`/section/${section.id}${t.to ? `/${t.to}` : ''}`}
              end={t.end}
              className={({ isActive }) =>
                cx(
                  '-mb-px whitespace-nowrap border-b-2 px-3 py-2 text-sm transition',
                  isActive ? 'border-accent text-ink' : 'border-transparent text-muted hover:text-ink',
                )
              }
            >
              {t.label}
              {t.label === 'Mistakes' && openMistakes > 0 && (
                <span className="ml-1.5 rounded-full bg-bad-soft px-1.5 text-[11px] text-bad tabular">{openMistakes}</span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
      <div key={section.id}>
        <Outlet />
      </div>
    </>
  );
}
