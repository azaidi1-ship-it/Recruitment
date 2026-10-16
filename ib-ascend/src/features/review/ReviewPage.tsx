import { useMemo, useState, type ReactNode } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { CalendarClock, CheckCircle2, Layers, Repeat, Sparkles } from 'lucide-react';
import { db } from '../../db/db';
import { SECTIONS } from '../../content/sections';
import { buildQueue, forecast, isNewFlashcard } from '../../engine/srs';
import { addDays, parseLocalDate, toLocalDate } from '../../lib/dates';
import { SRS } from '../../config/gameConfig';
import type { SectionId } from '../../types/models';
import { Button, Card, PageHeader, cx } from '../../components/ui';
import { CHART, SrTable, TooltipBox } from '../../components/charts';
import { ReviewSession } from './ReviewSession';

const SECTION_TITLE = Object.fromEntries(SECTIONS.map((s) => [s.id, s.shortTitle])) as Record<SectionId, string>;

/** The spaced-repetition hub: today's queue, a 14-day forecast and per-section counts. */
export function ReviewPage() {
  const [params, setParams] = useSearchParams();
  const sectionFilter = (SECTIONS.find((s) => s.id === params.get('section'))?.id ?? null) as SectionId | null;
  const [session, setSession] = useState<string[] | null>(null);
  const today = toLocalDate();

  const cards = useLiveQuery(() => db.cards.toArray(), []);
  const reviewedToday = useLiveQuery(
    () => db.reviewLogs.where('reviewedAt').aboveOrEqual(parseLocalDate(today).toISOString()).count(),
    [today],
  );

  const data = useMemo(() => {
    if (!cards) return null;
    const all = buildQueue(cards, today);
    const scoped = buildQueue(cards, today, { sectionId: sectionFilter });
    // Respect the global new-card allowance when filtering by section.
    const freshIds = new Set(all.fresh.map((c) => c.id));
    const scopedFresh = scoped.fresh.filter((c) => freshIds.has(c.id));
    const bySection = SECTIONS.map((s) => {
      const own = cards.filter((c) => c.sectionId === s.id);
      return {
        id: s.id,
        title: s.shortTitle,
        due: all.due.filter((c) => c.sectionId === s.id).length,
        fresh: all.fresh.filter((c) => c.sectionId === s.id).length,
        learned: own.filter((c) => !isNewFlashcard(c)).length,
        total: own.length,
      };
    }).filter((r) => r.total > 0);
    const upcoming = cards.filter((c) => !isNewFlashcard(c) && c.due > today).sort((a, b) => a.due.localeCompare(b.due))[0];
    return {
      queue: [...scoped.due, ...scopedFresh],
      dueCount: all.due.length,
      freshCount: all.fresh.length,
      missedDue: all.due.filter((c) => c.source === 'question').length,
      inRotation: cards.filter((c) => !isNewFlashcard(c)).length,
      bySection,
      forecast: forecast(cards, today, 14),
      nextDue: upcoming?.due ?? null,
    };
  }, [cards, today, sectionFilter]);

  if (session) {
    return <ReviewSession cardIds={session} onExit={() => setSession(null)} />;
  }
  if (!data) return null;

  const setFilter = (id: SectionId | null) => setParams(id ? { section: id } : {});

  return (
    <>
      <PageHeader
        title="Review"
        subtitle="Spaced repetition (SM-2) across your flashcards and every question you’ve missed. A few minutes a day keeps what you’ve learned from fading."
      />

      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat icon={Repeat} label="Due now" value={data.dueCount} note={data.missedDue ? `${data.missedDue} missed question${data.missedDue === 1 ? '' : 's'}` : 'Cards in rotation'} />
        <Stat icon={Sparkles} label="New today" value={data.freshCount} note={`Up to ${SRS.newCardsPerDay} new cards a day`} />
        <Stat icon={CheckCircle2} label="Reviewed today" value={reviewedToday ?? 0} />
        <Stat icon={Layers} label="In rotation" value={data.inRotation} note={`of ${cards?.length ?? 0} cards`} />
      </div>

      <Card className="mb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold">{sectionFilter ? `${SECTION_TITLE[sectionFilter]} queue` : 'Today’s queue'}</h2>
            <p className="text-sm text-muted">
              {data.queue.length
                ? `${data.queue.length} card${data.queue.length === 1 ? '' : 's'}: due reviews first, then new cards.`
                : data.nextDue
                  ? `All caught up. Next review ${relativeDay(data.nextDue, today)}.`
                  : 'Nothing to review yet. Read a chapter or take a quiz and its flashcards join the queue.'}
            </p>
          </div>
          <Button variant="primary" disabled={!data.queue.length} onClick={() => setSession(data.queue.map((c) => c.id))}>
            Start review{data.queue.length ? ` (${data.queue.length})` : ''}
          </Button>
        </div>
        {data.bySection.length > 1 && (
          <div className="mt-4 flex flex-wrap gap-1.5" role="group" aria-label="Filter by section">
            <Chip active={!sectionFilter} onClick={() => setFilter(null)}>
              All sections
            </Chip>
            {data.bySection
              .filter((r) => r.due + r.fresh > 0)
              .map((r) => (
                <Chip key={r.id} active={sectionFilter === r.id} onClick={() => setFilter(r.id)}>
                  {r.title} <span className="tabular opacity-70">{r.due + r.fresh}</span>
                </Chip>
              ))}
          </div>
        )}
      </Card>

      <div className="grid gap-4 lg:grid-cols-[3fr_2fr]">
        <Card>
          <h2 className="mb-1 flex items-center gap-2 font-semibold">
            <CalendarClock size={16} className="text-muted" /> Next 14 days
          </h2>
          <p className="mb-3 text-xs text-muted">Reviews coming due each day (overdue cards count today). New cards aren’t included.</p>
          <ForecastChart data={data.forecast} today={today} />
        </Card>

        <Card>
          <h2 className="mb-3 font-semibold">By section</h2>
          {data.bySection.length === 0 ? (
            <p className="text-sm text-muted">No decks yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-faint">
                  <th className="pb-2 font-medium">Section</th>
                  <th className="pb-2 text-right font-medium">Due</th>
                  <th className="pb-2 text-right font-medium">New</th>
                  <th className="pb-2 text-right font-medium">Learned</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {data.bySection.map((r) => (
                  <tr key={r.id}>
                    <td className="py-1.5">
                      <Link to={`/section/${r.id}/flashcards`} className="hover:text-accent">
                        {r.title}
                      </Link>
                    </td>
                    <td className="py-1.5 text-right tabular">{r.due}</td>
                    <td className="py-1.5 text-right tabular text-muted">{r.fresh}</td>
                    <td className="py-1.5 text-right tabular text-muted">
                      {r.learned}/{r.total}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </div>
    </>
  );
}

function ForecastChart({ data, today }: { data: { date: string; count: number }[]; today: string }) {
  const rows = data.map((d, i) => ({ ...d, label: i === 0 ? 'Today' : dayLabel(d.date) }));
  const max = Math.max(...rows.map((r) => r.count));
  if (max === 0) return <p className="py-10 text-center text-sm text-muted">Nothing scheduled in the next two weeks yet.</p>;
  return (
    <div className="h-48" role="img" aria-label={`Reviews due over the next 14 days, peaking at ${max} in one day`}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows} margin={{ top: 4, right: 4, bottom: 0, left: 0 }} barCategoryGap={2}>
          <CartesianGrid vertical={false} stroke={CHART.grid} />
          <XAxis dataKey="label" tick={CHART.tick} tickLine={false} axisLine={{ stroke: CHART.grid }} interval="preserveStartEnd" minTickGap={12} />
          <YAxis allowDecimals={false} tick={CHART.tick} tickLine={false} axisLine={false} width={32} />
          <Tooltip
            cursor={{ fill: 'var(--c-sunk)' }}
            content={({ active, payload }) =>
              active && payload?.[0] ? (
                <TooltipBox title={relativeDay(String(payload[0].payload.date), today, true)}>
                  {String(payload[0].value)} review{payload[0].value === 1 ? '' : 's'}
                </TooltipBox>
              ) : null
            }
          />
          <Bar dataKey="count" fill={CHART.series} radius={[4, 4, 0, 0]} maxBarSize={18} isAnimationActive={false} />
        </BarChart>
      </ResponsiveContainer>
      <SrTable caption="Reviews due by day" headers={['Date', 'Reviews']} rows={rows.map((r) => [r.date, r.count])} />
    </div>
  );
}

function Stat({ icon: Icon, label, value, note }: { icon: typeof Repeat; label: string; value: number; note?: string }) {
  return (
    <Card className="!p-4">
      <p className="flex items-center gap-1.5 text-xs text-muted">
        <Icon size={14} /> {label}
      </p>
      <p className="mt-1 text-2xl font-semibold tabular">{value}</p>
      {note && <p className="mt-0.5 text-[11px] text-faint">{note}</p>}
    </Card>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cx(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition',
        active ? 'border-accent/50 bg-accent-soft text-accent' : 'border-line text-muted hover:border-faint hover:text-ink',
      )}
    >
      {children}
    </button>
  );
}

function dayLabel(date: string): string {
  return parseLocalDate(date).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric' });
}

function relativeDay(date: string, today: string, long = false): string {
  if (date <= today) return 'today';
  if (date === addDays(today, 1)) return 'tomorrow';
  return parseLocalDate(date).toLocaleDateString(undefined, long ? { weekday: 'long', month: 'short', day: 'numeric' } : { month: 'short', day: 'numeric' });
}

