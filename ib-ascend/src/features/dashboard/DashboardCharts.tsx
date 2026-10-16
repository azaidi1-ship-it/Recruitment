import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  CartesianGrid,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Activity, LineChart as LineIcon, Radar as RadarIcon } from 'lucide-react';
import { db } from '../../db/db';
import { SECTIONS } from '../../content/sections';
import { DASHBOARD, GRADES } from '../../config/gameConfig';
import { activityGrid, mockSeries } from '../../engine/analytics';
import type { Stats } from '../../engine/stats';
import { addDays, parseLocalDate, toLocalDate } from '../../lib/dates';
import { STAT_LABEL, type SectionId, type StatKey } from '../../types/models';
import { Card, cx } from '../../components/ui';
import { CHART, SrTable, TooltipBox } from '../../components/charts';
import { ProgressBar, masteryTone } from '../../components/Progress';

// ───────────────────────────── Stats radar ─────────────────────────────

export function StatsRadar({ stats }: { stats: Stats }) {
  const keys = Object.keys(STAT_LABEL) as StatKey[];
  const data = keys.map((k) => ({ stat: STAT_LABEL[k], value: stats[k] }));
  return (
    <Card>
      <h2 className="mb-2 flex items-center gap-2 font-semibold">
        <RadarIcon size={16} className="text-muted" /> Stats
      </h2>
      <div className="grid items-center gap-4 sm:grid-cols-[1fr_180px]">
        <div className="h-56" role="img" aria-label={`Stats radar: ${data.map((d) => `${d.stat} ${d.value}`).join(', ')}`}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={data} outerRadius="72%">
              <PolarGrid stroke={CHART.grid} />
              <PolarAngleAxis dataKey="stat" tick={CHART.tick} />
              <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
              <Tooltip content={({ active, payload }) => (active && payload?.[0] ? <TooltipBox title={String(payload[0].payload.stat)}>{String(payload[0].value)} / 100</TooltipBox> : null)} />
              <Radar dataKey="value" stroke={CHART.series} strokeWidth={2} fill={CHART.series} fillOpacity={0.22} dot={{ r: 3, fill: CHART.series, strokeWidth: 0 }} isAnimationActive={false} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <ul className="space-y-2">
          {keys.map((k) => (
            <li key={k} className="grid grid-cols-[80px_1fr_28px] items-center gap-2 text-sm">
              <span className="text-muted">{STAT_LABEL[k]}</span>
              <ProgressBar value={stats[k] / 100} barClassName={masteryTone(stats[k] / 100)} label={`${STAT_LABEL[k]} stat`} />
              <span className="text-right tabular">{stats[k]}</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}

// ───────────────────────────── Activity heatmap ─────────────────────────────

const SHADE = [null, 28, 50, 75, 100] as const;

function shade(level: number): string | undefined {
  const pct = SHADE[level];
  return pct === null || pct === undefined ? undefined : `color-mix(in srgb, var(--c-accent) ${pct}%, var(--c-sunk))`;
}

export function ActivityHeatmap() {
  const today = toLocalDate();
  const since = parseLocalDate(addDays(today, -DASHBOARD.heatmapWeeks * 7 - 7)).toISOString();
  const stamps = useLiveQuery(async () => {
    const [attempts, reviews] = await Promise.all([
      db.attempts.where('createdAt').aboveOrEqual(since).toArray(),
      db.reviewLogs.where('reviewedAt').aboveOrEqual(since).toArray(),
    ]);
    return [...attempts.map((a) => a.createdAt), ...reviews.map((r) => r.reviewedAt)];
  }, [since]);
  const [hover, setHover] = useState<{ date: string; count: number } | null>(null);
  const grid = useMemo(() => (stamps ? activityGrid(stamps, today, DASHBOARD.heatmapWeeks, DASHBOARD.heatBins) : null), [stamps, today]);
  // On narrow screens the grid scrolls; start at the most recent weeks.
  const scroller = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scroller.current) scroller.current.scrollLeft = scroller.current.scrollWidth;
  }, [grid]);
  if (!grid) return <Card className="h-56">{null}</Card>;

  return (
    <Card>
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="flex items-center gap-2 font-semibold">
          <Activity size={16} className="text-muted" /> Activity
        </h2>
        <p className="text-xs text-muted tabular">
          {grid.activeDays} active day{grid.activeDays === 1 ? '' : 's'} · {grid.total.toLocaleString()} answers and reviews
        </p>
      </div>
      <div ref={scroller} className="overflow-x-auto pb-1">
        <div className="flex gap-[3px]" onMouseLeave={() => setHover(null)}>
          <div className="mr-1 grid grid-rows-7 gap-[3px] text-[10px] leading-[13px] text-faint">
            {['Mon', '', 'Wed', '', 'Fri', '', ''].map((d, i) => (
              <span key={i} className="h-[13px]">
                {d}
              </span>
            ))}
          </div>
          {grid.weeks.map((week, w) => (
            <div key={w} className="grid grid-rows-7 gap-[3px]">
              {week.map((c) => (
                <div
                  key={c.date}
                  role="img"
                  aria-label={`${c.date}: ${c.count}`}
                  title={`${c.date}: ${c.count}`}
                  onMouseEnter={() => setHover(c)}
                  className={cx('size-[13px] rounded-[3px]', c.level === 0 && 'border border-line bg-sunk', c.date === today && 'ring-1 ring-ink/50')}
                  style={{ background: shade(c.level) }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted">
        <span className="tabular">
          {hover
            ? `${parseLocalDate(hover.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}: ${hover.count} answer${hover.count === 1 ? '' : 's'} and reviews`
            : 'Hover a day for details'}
        </span>
        <span className="flex items-center gap-1">
          Less
          {[0, 1, 2, 3, 4].map((l) => (
            <span key={l} className={cx('size-2.5 rounded-[2px]', l === 0 && 'border border-line bg-sunk')} style={{ background: shade(l) }} />
          ))}
          More
        </span>
      </div>
    </Card>
  );
}

// ───────────────────────────── Mock trends ─────────────────────────────

const A_GRADE = Math.round((GRADES.find((g) => g.grade === 'A')?.min ?? 0.85) * 100);

export function MockTrends() {
  const sessions = useLiveQuery(() => db.sessions.where('mode').equals('mock').toArray(), []);
  const withMocks = useMemo(() => {
    if (!sessions) return [];
    const latest = new Map<SectionId, string>();
    for (const s of sessions) {
      if (!s.sectionId || !s.finishedAt) continue;
      const prev = latest.get(s.sectionId);
      if (!prev || s.finishedAt > prev) latest.set(s.sectionId, s.finishedAt);
    }
    return SECTIONS.filter((s) => latest.has(s.id)).map((s) => ({ ...s, latest: latest.get(s.id)! }));
  }, [sessions]);
  const [picked, setPicked] = useState<SectionId | null>(null);
  const mostRecent = [...withMocks].sort((a, b) => b.latest.localeCompare(a.latest))[0]?.id ?? null;
  const sectionId = picked && withMocks.some((s) => s.id === picked) ? picked : mostRecent;
  const series = useMemo(() => (sessions && sectionId ? mockSeries(sessions, sectionId) : []), [sessions, sectionId]);

  return (
    <Card>
      <h2 className="mb-1 flex items-center gap-2 font-semibold">
        <LineIcon size={16} className="text-muted" /> Boss Fight trend
      </h2>
      {withMocks.length === 0 ? (
        <p className="mt-2 text-sm text-muted">
          Your mock scores will chart here. Pass a section’s post-quiz to unlock its Boss Fight, starting with{' '}
          <Link to="/tree" className="text-accent hover:underline">
            the skill tree
          </Link>
          .
        </p>
      ) : (
        <>
          <div className="mb-3 mt-2 flex flex-wrap gap-1.5" role="group" aria-label="Choose a section">
            {withMocks.map((s) => (
              <button
                key={s.id}
                type="button"
                aria-pressed={s.id === sectionId}
                onClick={() => setPicked(s.id)}
                className={cx(
                  'rounded-full border px-2.5 py-1 text-xs transition',
                  s.id === sectionId ? 'border-accent/50 bg-accent-soft text-accent' : 'border-line text-muted hover:border-faint hover:text-ink',
                )}
              >
                {s.shortTitle}
              </button>
            ))}
          </div>
          <div className="h-48" role="img" aria-label={`Boss Fight scores: ${series.map((p) => `run ${p.run} ${p.score}%`).join(', ')}`}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={series} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
                <CartesianGrid vertical={false} stroke={CHART.grid} />
                <XAxis dataKey="run" tick={CHART.tick} tickLine={false} axisLine={{ stroke: CHART.grid }} tickFormatter={(r) => `#${r}`} />
                <YAxis domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tick={CHART.tick} tickLine={false} axisLine={false} unit="%" width={44} />
                <ReferenceLine y={A_GRADE} stroke={CHART.reference} label={{ value: `A grade ${A_GRADE}%`, position: 'insideTopLeft', fill: 'var(--c-muted)', fontSize: 10 }} />
                <Tooltip
                  cursor={{ stroke: CHART.grid }}
                  content={({ active, payload }) =>
                    active && payload?.[0] ? (
                      <TooltipBox title={`Run #${payload[0].payload.run} · ${parseLocalDate(String(payload[0].payload.date)).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`}>
                        {String(payload[0].value)}%
                      </TooltipBox>
                    ) : null
                  }
                />
                <Line type="monotone" dataKey="score" stroke={CHART.series} strokeWidth={2} dot={{ r: 4, fill: CHART.series, stroke: 'var(--c-surface)', strokeWidth: 2 }} activeDot={{ r: 5 }} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
            <SrTable caption="Boss Fight scores" headers={['Run', 'Date', 'Score']} rows={series.map((p) => [p.run, p.date, `${p.score}%`])} />
          </div>
        </>
      )}
    </Card>
  );
}
