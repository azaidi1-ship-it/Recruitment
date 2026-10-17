import { Link } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { Calculator, Calendar, Gamepad2, GitMerge, Landmark, Newspaper, PenLine, TrendingUp } from 'lucide-react';
import type { ComponentType } from 'react';
import { db } from '../../db/db';
import { Badge, Card, PageHeader } from '../../components/ui';
import { formatTime } from './PaperLbo';

interface Tool {
  to: string;
  title: string;
  description: string;
  icon: ComponentType<{ size?: number; className?: string }>;
}

const TOOLS: Tool[] = [
  { to: '/tools/paper-lbo', title: 'Paper LBO Trainer', description: 'Randomized scenarios you solve by hand, timed, with step-by-step solutions.', icon: PenLine },
  { to: '/tools/arcade', title: 'Mental Math Arcade', description: 'Timed sprints on percentages, multiplication, IRRs and valuation chains, with a leaderboard against yourself.', icon: Gamepad2 },
  { to: '/tools/models/dcf', title: 'DCF builder', description: 'Five-year projection, Gordon or exit-multiple terminal value, and a WACC × growth sensitivity table.', icon: TrendingUp },
  { to: '/tools/models/accretion', title: 'Accretion / dilution', description: 'Pro forma EPS for any cash / debt / stock mix, breakeven synergies and a sensitivity table.', icon: GitMerge },
  { to: '/tools/models/lbo', title: 'LBO builder', description: 'Debt schedule with a cash sweep, MOIC and IRR, and entry / exit / leverage sensitivities.', icon: Calculator },
  { to: '/tools/firms', title: 'Firm Tracker', description: 'Target firms, people you’ve met, deals you’ve researched, interview notes and a Why-[firm] draft.', icon: Landmark },
  { to: '/tools/journal', title: 'Deal & Market Journal', description: 'Log deals and weekly market notes; practice “pitch me a deal” from your own journal.', icon: Newspaper },
  { to: '/tools/calendar', title: 'Recruiting Calendar', description: 'Deadlines and interview dates, with a countdown that adjusts your daily study load.', icon: Calendar },
];

export function ToolsHub() {
  const scores = useLiveQuery(() => db.arcadeScores.toArray(), []);
  const paper = (scores ?? []).filter((s) => s.drillId === 'paper-lbo');
  const bestPaper = paper.filter((s) => s.correct === s.total).sort((a, b) => a.durationSec - b.durationSec)[0];
  const arcadeRuns = (scores ?? []).filter((s) => s.drillId !== 'paper-lbo').length;
  const stat: Partial<Record<string, string | null>> = {
    '/tools/paper-lbo': bestPaper ? `Best clean run ${formatTime(bestPaper.durationSec)}` : paper.length ? `${paper.length} runs` : null,
    '/tools/arcade': arcadeRuns ? `${arcadeRuns} runs` : null,
  };
  return (
    <>
      <PageHeader title="Tools" subtitle="Practice the mechanics outside the quizzes, and run your recruiting: firms, deals and dates." />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map((t) => (
          <Link key={t.title} to={t.to}>
            <Card className="h-full transition hover:border-faint">
              <div className="mb-2 flex items-center justify-between gap-2">
                <t.icon size={20} className="text-accent" />
                {stat[t.to] && <Badge tone="accent">{stat[t.to]}</Badge>}
              </div>
              <h2 className="font-semibold">{t.title}</h2>
              <p className="mt-1 text-sm text-muted">{t.description}</p>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}
