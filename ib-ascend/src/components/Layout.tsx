import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { BookOpen, CalendarDays, FileText, Gauge, GitBranch, Landmark, Newspaper, Repeat, Settings, Swords, Trophy, Video, Wrench } from 'lucide-react';
import { CelebrationLayer } from '../features/gamification/CelebrationLayer';
import { useGameStore } from '../store/useGameStore';
import type { ComponentType, ReactNode } from 'react';
import { cx } from './ui';

interface NavItem {
  to: string;
  label: string;
  icon: ComponentType<{ size?: number }>;
  mobile?: boolean;
}

const NAV: NavItem[] = [
  { to: '/', label: 'Dashboard', icon: Gauge, mobile: true },
  { to: '/tree', label: 'Skill Tree', icon: GitBranch, mobile: true },
  { to: '/review', label: 'Review', icon: Repeat, mobile: true },
  { to: '/stories', label: 'Story Bank', icon: BookOpen, mobile: true },
  { to: '/hirevue', label: 'HireVue', icon: Video },
  { to: '/superday', label: 'Superday', icon: Swords },
  { to: '/tools', label: 'Tools', icon: Wrench },
  { to: '/tools/firms', label: 'Firms', icon: Landmark },
  { to: '/tools/journal', label: 'Journal', icon: Newspaper },
  { to: '/tools/calendar', label: 'Calendar', icon: CalendarDays },
  { to: '/achievements', label: 'Achievements', icon: Trophy },
  { to: '/resume', label: 'Resume', icon: FileText },
  { to: '/settings', label: 'Settings', icon: Settings, mobile: true },
];

function linkClass({ isActive }: { isActive: boolean }) {
  return cx(
    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition',
    isActive ? 'bg-accent-soft text-accent' : 'text-muted hover:bg-sunk hover:text-ink',
  );
}

export function Layout() {
  const snap = useGameStore((s) => s.snapshot);
  return (
    <div className="min-h-dvh md:grid md:grid-cols-[220px_1fr] print:block">
      <aside className="no-print sticky top-0 hidden h-dvh flex-col border-r border-line bg-surface p-4 md:flex">
        <div className="mb-6 flex items-center gap-2 px-2">
          <img src="./favicon.svg" alt="" className="size-7" />
          <span className="text-lg font-semibold tracking-tight">IB Ascend</span>
        </div>
        {snap && (
          <div className="mb-5 rounded-lg border border-line bg-sunk px-3 py-2.5">
            <div className="flex items-baseline justify-between text-xs">
              <span className="font-medium text-accent">{snap.rank.title}</span>
              <span className="text-muted tabular">Lv {snap.level.level}</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-bg">
              <div className="h-full rounded-full bg-accent" style={{ width: `${Math.round(snap.level.progress * 100)}%` }} />
            </div>
          </div>
        )}
        <nav className="flex flex-col gap-1">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} end={to === '/' || to === '/tools'} className={linkClass}>
              <Icon size={17} />
              {label}
              {to === '/review' && snap && snap.cardsDue > 0 && (
                <span className="ml-auto rounded-full bg-accent-soft px-1.5 text-[11px] font-medium text-accent tabular" aria-label={`${snap.cardsDue} due`}>
                  {snap.cardsDue}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="mx-auto w-full max-w-6xl px-4 pb-24 pt-5 sm:px-6 md:pb-10 md:pt-8 print:p-0">
        <PageFade>
          <Outlet />
        </PageFade>
      </main>
      <CelebrationLayer />

      <nav className="no-print fixed inset-x-0 bottom-0 z-20 flex justify-around border-t border-line bg-surface/95 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
        {NAV.filter((n) => n.mobile).map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cx('flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px]', isActive ? 'text-accent' : 'text-muted')
            }
          >
            <Icon size={20} />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

/** A short fade on each page change; keyed by path so query changes within a page don't replay it. */
function PageFade({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  return (
    <div key={pathname} className="anim-page">
      {children}
    </div>
  );
}
