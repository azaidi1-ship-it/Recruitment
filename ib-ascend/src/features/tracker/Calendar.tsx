import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { CalendarClock, Clock, Plus, Trash2 } from 'lucide-react';
import { db } from '../../db/db';
import { PHASE_LABEL, studyPlan, type StudyPlan } from '../../engine/studyPlan';
import { deleteEvent, listFirms, saveEvent } from '../../services/tracker';
import { useSettingsStore } from '../../store/useSettingsStore';
import { daysBetween, parseLocalDate, toLocalDate } from '../../lib/dates';
import type { CalendarEvent } from '../../types/models';
import { Badge, Button, Card, PageHeader, cx } from '../../components/ui';

export const KIND_LABEL: Record<CalendarEvent['kind'], string> = {
  deadline: 'Application deadline',
  interview: 'Interview',
  superday: 'Superday',
  networking: 'Networking call',
  other: 'Other',
};

const KIND_TONE: Record<CalendarEvent['kind'], 'warn' | 'accent' | 'info' | 'neutral'> = {
  deadline: 'warn',
  interview: 'accent',
  superday: 'accent',
  networking: 'info',
  other: 'neutral',
};

const INPUT = 'w-full rounded-md border border-line bg-sunk px-2.5 py-1.5 text-sm outline-none focus:border-accent';

export function useStudyPlan(): StudyPlan | null {
  const base = useSettingsStore((s) => s.settings.dailyGoalMinutes);
  return useLiveQuery(async () => {
    const [events, firms] = await Promise.all([db.events.toArray(), db.firms.toArray()]);
    return studyPlan(events, toLocalDate(), base, (id) => firms.find((f) => f.id === id)?.name);
  }, [base]) ?? null;
}

export function countdown(days: number): string {
  return days === 0 ? 'Today' : days === 1 ? 'Tomorrow' : `In ${days} days`;
}

export function RecruitingCalendar() {
  const events = useLiveQuery(() => db.events.orderBy('date').toArray(), []);
  const firms = useLiveQuery(() => listFirms(), []);
  const plan = useStudyPlan();
  const today = toLocalDate();
  const [form, setForm] = useState({ title: '', kind: 'interview' as CalendarEvent['kind'], date: '', firmId: '', notes: '' });
  const [showPast, setShowPast] = useState(false);
  if (!events || !firms) return null;
  const upcoming = events.filter((e) => e.date >= today);
  const past = events.filter((e) => e.date < today).reverse();
  const firmName = (id: string | null) => firms.find((f) => f.id === id)?.name;

  return (
    <>
      <PageHeader title="Recruiting Calendar" subtitle="Deadlines, interviews and Superdays. The closer the next interview, the more your suggested daily study load shifts toward interview practice." />
      <div className="mb-4 grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        {plan && <PlanCard plan={plan} />}
        <Card>
          <h2 className="mb-3 flex items-center gap-2 font-semibold">
            <Plus size={16} className="text-muted" /> Add a date
          </h2>
          <form
            className="grid gap-2 sm:grid-cols-2"
            onSubmit={async (e) => {
              e.preventDefault();
              if (!form.title.trim() || !form.date) return;
              await saveEvent({ title: form.title.trim(), kind: form.kind, date: form.date, firmId: form.firmId || null, notes: form.notes.trim() });
              setForm({ ...form, title: '', date: '', notes: '' });
            }}
          >
            <label className="text-sm sm:col-span-2">
              <span className="mb-1 block text-xs text-muted">What</span>
              <input className={INPUT} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Evercore first round" />
            </label>
            <label className="text-sm">
              <span className="mb-1 block text-xs text-muted">Type</span>
              <select className={INPUT} value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value as CalendarEvent['kind'] })}>
                {Object.entries(KIND_LABEL).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm">
              <span className="mb-1 block text-xs text-muted">Date</span>
              <input type="date" className={INPUT} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </label>
            <label className="text-sm">
              <span className="mb-1 block text-xs text-muted">Firm</span>
              <select className={INPUT} value={form.firmId} onChange={(e) => setForm({ ...form, firmId: e.target.value })}>
                <option value="">None</option>
                {firms.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm">
              <span className="mb-1 block text-xs text-muted">Notes</span>
              <input className={INPUT} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </label>
            <Button type="submit" variant="primary" className="sm:col-span-2">
              Add to calendar
            </Button>
          </form>
        </Card>
      </div>

      <Card>
        <h2 className="mb-3 font-semibold">Upcoming</h2>
        {upcoming.length === 0 ? (
          <p className="text-sm text-muted">Nothing scheduled. Add application deadlines and interview dates as you get them.</p>
        ) : (
          <EventList events={upcoming} today={today} firmName={firmName} />
        )}
        {past.length > 0 && (
          <>
            <button type="button" className="mt-4 text-sm text-muted hover:text-ink" onClick={() => setShowPast(!showPast)}>
              {showPast ? 'Hide' : 'Show'} {past.length} past date{past.length === 1 ? '' : 's'}
            </button>
            {showPast && <EventList events={past} today={today} firmName={firmName} muted />}
          </>
        )}
      </Card>
    </>
  );
}

function EventList({ events, today, firmName, muted = false }: { events: CalendarEvent[]; today: string; firmName: (id: string | null) => string | undefined; muted?: boolean }) {
  return (
    <ul className={cx('divide-y divide-line', muted && 'opacity-70')}>
      {events.map((e) => {
        const d = daysBetween(today, e.date);
        return (
          <li key={e.id} className="flex flex-wrap items-center gap-3 py-2.5">
            <span className="w-24 shrink-0 text-sm tabular">
              {parseLocalDate(e.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm">{e.title}</span>
              <span className="text-xs text-muted">
                {firmName(e.firmId) && (
                  <Link to={`/tools/firms/${e.firmId}`} className="hover:text-accent">
                    {firmName(e.firmId)}
                  </Link>
                )}
                {e.notes && ` · ${e.notes}`}
              </span>
            </span>
            <Badge tone={KIND_TONE[e.kind]}>{KIND_LABEL[e.kind]}</Badge>
            {!muted && <span className={cx('w-20 text-right text-xs tabular', d <= 7 ? 'text-accent' : 'text-muted')}>{countdown(d)}</span>}
            <button type="button" aria-label={`Delete ${e.title}`} className="text-faint hover:text-bad" onClick={() => void deleteEvent(e.id)}>
              <Trash2 size={14} />
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export function PlanCard({ plan, compact = false }: { plan: StudyPlan; compact?: boolean }) {
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-sm font-medium text-muted">
            <CalendarClock size={15} /> {plan.next ? 'Next interview' : 'Study plan'}
          </h2>
          {plan.next ? (
            <>
              <p className="mt-1 text-lg font-semibold">{plan.next.event.title}</p>
              <p className="text-sm text-accent">
                {countdown(plan.next.daysLeft)} · {KIND_LABEL[plan.next.event.kind]}
              </p>
            </>
          ) : (
            <p className="mt-1 text-sm text-muted">
              No interviews on the calendar.{' '}
              <Link to="/tools/calendar" className="text-accent hover:underline">
                Add dates
              </Link>{' '}
              and your daily load adjusts as they approach.
            </p>
          )}
        </div>
        <div className="text-right">
          <p className="flex items-center justify-end gap-1.5 text-3xl font-semibold tabular">
            <Clock size={20} className="text-muted" />
            {plan.minutes}
            <span className="text-sm font-normal text-muted">min / day</span>
          </p>
          <Badge tone={plan.phase === 'final-week' ? 'accent' : plan.phase === 'taper' ? 'info' : 'neutral'}>{PHASE_LABEL[plan.phase]}</Badge>
        </div>
      </div>
      {!compact || plan.next || plan.deadlines.length ? (
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted">
          {plan.focus.slice(0, compact ? 3 : undefined).map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      ) : null}
    </Card>
  );
}
