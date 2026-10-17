import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { ArrowLeft, CalendarDays, Plus, RefreshCw, Swords, Trash2, Users } from 'lucide-react';
import { db } from '../../db/db';
import { PERSONAS } from '../../content/superday/personas';
import { SEED_RESUME } from '../../content/resume/resume';
import { whyFirm } from '../../engine/storyBank';
import { addFirm, deleteFirm, listFirms, updateFirm } from '../../services/tracker';
import { newId } from '../../lib/id';
import { toLocalDate } from '../../lib/dates';
import type { Firm, FirmStatus } from '../../types/models';
import { Badge, Button, Card, PageHeader, cx } from '../../components/ui';
import { FillInText } from '../stories/shared';

export const TIER_LABEL: Record<Firm['tier'], string> = {
  'elite-boutique': 'Elite boutique',
  'bulge-bracket': 'Bulge bracket',
  'middle-market': 'Middle market',
  international: 'International',
  gcc: 'GCC',
};

export const STATUS_LABEL: Record<FirmStatus, string> = {
  researching: 'Researching',
  networking: 'Networking',
  applied: 'Applied',
  interviewing: 'Interviewing',
  offer: 'Offer',
  rejected: 'Rejected',
  'not-applying': 'Not applying',
};

const STATUS_TONE: Record<FirmStatus, 'neutral' | 'info' | 'accent' | 'ok' | 'bad' | 'warn'> = {
  researching: 'neutral',
  networking: 'info',
  applied: 'accent',
  interviewing: 'warn',
  offer: 'ok',
  rejected: 'bad',
  'not-applying': 'neutral',
};

export function FirmTracker() {
  const { firmId } = useParams();
  if (firmId) return <FirmDetail key={firmId} id={firmId} />;
  return <FirmList />;
}

function FirmList() {
  const firms = useLiveQuery(() => listFirms(), []);
  const events = useLiveQuery(() => db.events.toArray(), []);
  const [tier, setTier] = useState<Firm['tier'] | ''>('');
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const today = toLocalDate();
  if (!firms) return null;
  const shown = firms.filter((f) => !tier || f.tier === tier);

  return (
    <>
      <PageHeader
        title="Firm Tracker"
        subtitle="One card per target firm: what it’s known for, who you’ve spoken to, deals you’ve researched and what to know for the interview."
        right={
          <Button variant="primary" onClick={() => setAdding(true)}>
            <Plus size={16} /> Add firm
          </Button>
        }
      />
      {adding && (
        <Card className="mb-4">
          <form
            className="flex flex-wrap gap-2"
            onSubmit={async (e) => {
              e.preventDefault();
              if (!name.trim()) return;
              const f = await addFirm(name.trim(), 'elite-boutique');
              setAdding(false);
              setName('');
              navigate(`/tools/firms/${f.id}`);
            }}
          >
            <input autoFocus aria-label="Firm name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Firm name" className="flex-1 rounded-md border border-line bg-sunk px-2.5 py-1.5 text-sm outline-none focus:border-accent" />
            <Button type="submit" variant="primary">
              Add
            </Button>
            <Button variant="ghost" onClick={() => setAdding(false)}>
              Cancel
            </Button>
          </form>
        </Card>
      )}
      <div className="mb-3 flex flex-wrap gap-1.5" role="group" aria-label="Filter by tier">
        {(['', 'elite-boutique', 'bulge-bracket', 'middle-market'] as const).map((t) => (
          <button
            key={t}
            type="button"
            aria-pressed={tier === t}
            onClick={() => setTier(t)}
            className={cx('rounded-full border px-2.5 py-1 text-xs transition', tier === t ? 'border-accent/50 bg-accent-soft text-accent' : 'border-line text-muted hover:text-ink')}
          >
            {t ? TIER_LABEL[t] : `All (${firms.length})`}
          </button>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((f) => {
          const next = events?.filter((e) => e.firmId === f.id && e.date >= today).sort((a, b) => a.date.localeCompare(b.date))[0];
          const status = f.status ?? 'researching';
          return (
            <Link key={f.id} to={`/tools/firms/${f.id}`}>
              <Card className="h-full transition hover:border-faint">
                <div className="mb-1 flex items-start justify-between gap-2">
                  <h2 className="font-semibold">{f.name}</h2>
                  <Badge tone={STATUS_TONE[status]}>{STATUS_LABEL[status]}</Badge>
                </div>
                <p className="text-xs text-faint">{TIER_LABEL[f.tier]}</p>
                <p className="mt-2 text-sm text-muted">{f.focusAreas.join(' · ') || 'Add focus areas'}</p>
                <p className="mt-3 flex flex-wrap gap-3 text-xs text-muted tabular">
                  <span className="flex items-center gap-1">
                    <Users size={13} /> {f.contacts.length} contact{f.contacts.length === 1 ? '' : 's'}
                  </span>
                  <span>{f.researchedDeals.length} deal{f.researchedDeals.length === 1 ? '' : 's'}</span>
                  {next && (
                    <span className="flex items-center gap-1 text-accent">
                      <CalendarDays size={13} /> {next.title} · {next.date}
                    </span>
                  )}
                </p>
              </Card>
            </Link>
          );
        })}
      </div>
    </>
  );
}

const INPUT = 'w-full rounded-md border border-line bg-sunk px-2.5 py-1.5 text-sm outline-none focus:border-accent';

function FirmDetail({ id }: { id: string }) {
  const firm = useLiveQuery(() => db.firms.get(id), [id]);
  // Deals without a date aren't in the announcedOn index, so sort in memory.
  const deals = useLiveQuery(async () => (await db.deals.toArray()).sort((a, b) => (b.announcedOn ?? '').localeCompare(a.announcedOn ?? '')), []);
  const events = useLiveQuery(() => db.events.where('firmId').equals(id).sortBy('date'), [id]);
  const resume = useLiveQuery(async () => (await db.resumes.orderBy('version').last()) ?? SEED_RESUME, []);
  const navigate = useNavigate();
  const [contact, setContact] = useState({ name: '', role: '', date: '', notes: '' });
  if (firm === undefined || !deals || !resume) return null;
  if (!firm) return <p className="text-sm text-muted">Firm not found.</p>;
  const save = (patch: Partial<Omit<Firm, 'id'>>) => updateFirm(firm.id, patch);
  const generated = whyFirm(firm, deals, resume);

  return (
    <>
      <Link to="/tools/firms" className="mb-3 inline-flex items-center gap-1 text-sm text-muted hover:text-ink">
        <ArrowLeft size={15} /> All firms
      </Link>
      <PageHeader
        title={firm.name}
        subtitle={`${TIER_LABEL[firm.tier]}${firm.focusAreas.length ? ` · ${firm.focusAreas.join(' · ')}` : ''}`}
        right={
          <div className="flex gap-2">
            {firm.personaId && (
              <Link to={`/superday?persona=${firm.personaId}`}>
                <Button>
                  <Swords size={15} /> Practice Superday
                </Button>
              </Link>
            )}
            <Button
              variant="ghost"
              aria-label="Delete firm"
              onClick={async () => {
                if (window.confirm(`Delete ${firm.name}?`)) {
                  await deleteFirm(firm.id);
                  navigate('/tools/firms');
                }
              }}
            >
              <Trash2 size={15} />
            </Button>
          </div>
        }
      />
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <Card>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm">
              <span className="mb-1 block text-xs text-muted">Status</span>
              <select className={INPUT} value={firm.status ?? 'researching'} onChange={(e) => void save({ status: e.target.value as FirmStatus })}>
                {Object.entries(STATUS_LABEL).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm">
              <span className="mb-1 block text-xs text-muted">Tier</span>
              <select className={INPUT} value={firm.tier} onChange={(e) => void save({ tier: e.target.value as Firm['tier'] })}>
                {Object.entries(TIER_LABEL).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm sm:col-span-2">
              <span className="mb-1 block text-xs text-muted">Focus areas (comma separated)</span>
              <input
                className={INPUT}
                defaultValue={firm.focusAreas.join(', ')}
                onBlur={(e) => void save({ focusAreas: e.target.value.split(',').map((x) => x.trim()).filter(Boolean) })}
              />
            </label>
            <label className="text-sm sm:col-span-2">
              <span className="mb-1 block text-xs text-muted">Superday interviewer style</span>
              <select className={INPUT} value={firm.personaId ?? ''} onChange={(e) => void save({ personaId: e.target.value || null })}>
                <option value="">None</option>
                {PERSONAS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} ({p.style})
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="mt-3 block text-sm">
            <span className="mb-1 block text-xs text-muted">Interview notes: what to know before you walk in</span>
            <textarea className={INPUT} rows={6} defaultValue={firm.interviewNotes} onBlur={(e) => void save({ interviewNotes: e.target.value })} />
          </label>
        </Card>

        <Card>
          <h2 className="mb-2 font-semibold">People you’ve spoken to</h2>
          {firm.contacts.length === 0 ? (
            <p className="mb-3 text-sm text-muted">No one yet. “Who have you spoken to?” is a standard question; log every call.</p>
          ) : (
            <ul className="mb-3 divide-y divide-line text-sm">
              {firm.contacts.map((c) => (
                <li key={c.id} className="flex items-start justify-between gap-2 py-2">
                  <span>
                    <span className="font-medium">{c.name}</span>
                    {c.role && <span className="text-muted"> · {c.role}</span>}
                    {c.date && <span className="text-faint"> · {c.date}</span>}
                    {c.notes && <span className="block text-muted">{c.notes}</span>}
                  </span>
                  <button type="button" aria-label={`Remove ${c.name}`} className="text-faint hover:text-bad" onClick={() => void save({ contacts: firm.contacts.filter((x) => x.id !== c.id) })}>
                    <Trash2 size={14} />
                  </button>
                </li>
              ))}
            </ul>
          )}
          <form
            className="grid gap-2 sm:grid-cols-3"
            onSubmit={async (e) => {
              e.preventDefault();
              if (!contact.name.trim()) return;
              await save({ contacts: [...firm.contacts, { id: newId('ct'), name: contact.name.trim(), role: contact.role.trim(), date: contact.date || null, notes: contact.notes.trim() }] });
              setContact({ name: '', role: '', date: '', notes: '' });
            }}
          >
            <input aria-label="Contact name" placeholder="Name" className={INPUT} value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} />
            <input aria-label="Contact role" placeholder="Role / group" className={INPUT} value={contact.role} onChange={(e) => setContact({ ...contact, role: e.target.value })} />
            <input aria-label="Date spoken" type="date" className={INPUT} value={contact.date} onChange={(e) => setContact({ ...contact, date: e.target.value })} />
            <input aria-label="What stood out" placeholder="What stood out" className={cx(INPUT, 'sm:col-span-2')} value={contact.notes} onChange={(e) => setContact({ ...contact, notes: e.target.value })} />
            <Button type="submit">
              <Plus size={15} /> Add contact
            </Button>
          </form>

          <h2 className="mt-5 mb-2 font-semibold">Deals you’ve researched</h2>
          {deals.length === 0 ? (
            <p className="text-sm text-muted">
              Log deals in the{' '}
              <Link to="/tools/journal" className="text-accent hover:underline">
                Deal Journal
              </Link>{' '}
              and tag them here.
            </p>
          ) : (
            <ul className="max-h-48 space-y-1 overflow-y-auto text-sm">
              {deals.map((d) => (
                <li key={d.id}>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="accent-[var(--c-accent)]"
                      checked={firm.researchedDeals.includes(d.id)}
                      onChange={(e) => void save({ researchedDeals: e.target.checked ? [...firm.researchedDeals, d.id] : firm.researchedDeals.filter((x) => x !== d.id) })}
                    />
                    {d.acquirer} / {d.target}
                    <span className="text-xs text-faint">{d.announcedOn}</span>
                  </label>
                </li>
              ))}
            </ul>
          )}
          {events && events.length > 0 && (
            <>
              <h2 className="mt-5 mb-2 font-semibold">On the calendar</h2>
              <ul className="space-y-1 text-sm">
                {events.map((e) => (
                  <li key={e.id} className="flex justify-between">
                    <span>{e.title}</span>
                    <span className="text-muted tabular">{e.date}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </Card>

        <Card className="lg:col-span-2">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-semibold">Why {firm.name}?</h2>
            <Button variant="ghost" className="!px-2 !py-1 text-xs" onClick={() => void save({ whyFirmDraft: generated })}>
              <RefreshCw size={13} /> {firm.whyFirmDraft ? 'Regenerate from this card' : 'Start from the generated draft'}
            </Button>
          </div>
          {firm.whyFirmDraft ? (
            <textarea key={firm.whyFirmDraft} className={INPUT} rows={6} defaultValue={firm.whyFirmDraft} onBlur={(e) => void save({ whyFirmDraft: e.target.value })} aria-label={`Why ${firm.name}`} />
          ) : (
            <p className="text-[15px] leading-relaxed">
              <FillInText text={generated} />
            </p>
          )}
          <p className="mt-2 text-xs text-faint">Generated from your contacts, tagged deals and resume. Edit it into your own words.</p>
        </Card>
      </div>
    </>
  );
}
