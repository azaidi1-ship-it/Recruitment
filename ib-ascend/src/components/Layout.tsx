import { NavLink, Outlet } from 'react-router-dom';
import { BookOpen, FileText, Gauge, GitBranch, Repeat, Settings, Swords, Wrench } from 'lucide-react';
import type { ComponentType } from 'react';
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
  { to: '/superday', label: 'Superday', icon: Swords },
  { to: '/tools', label: 'Tools', icon: Wrench },
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
  return (
    <div className="min-h-dvh md:grid md:grid-cols-[220px_1fr]">
      <aside className="no-print sticky top-0 hidden h-dvh flex-col border-r border-line bg-surface p-4 md:flex">
        <div className="mb-6 flex items-center gap-2 px-2">
          <img src="./favicon.svg" alt="" className="size-7" />
          <span className="text-lg font-semibold tracking-tight">IB Ascend</span>
        </div>
        <nav className="flex flex-col gap-1">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} end={to === '/'} className={linkClass}>
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="mx-auto w-full max-w-6xl px-4 pb-24 pt-5 sm:px-6 md:pb-10 md:pt-8">
        <Outlet />
      </main>

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
