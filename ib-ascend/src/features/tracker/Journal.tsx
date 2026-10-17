import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { Dices, Mic, Pencil, Plus, Timer, Trash2 } from 'lucide-react';
import { db } from '../../db/db';
import { dealModelAnswer, dealPitchRubric, dealValueText, weekOf } from '../../engine/journal';
import { matchRubric, scoreRubric } from '../../engine/grading/rubric';
import { deleteDeal, recordDealPitch, saveDeal, saveMarketNote } from '../../services/tracker';
import { toLocalDate } from '../../lib/dates';
import type { DealEntry } from '../../types/models';
import { Badge, Button, Card, PageHeader, cx } from '../../components/ui';
import { FillInText, speakSeconds, wordCount } from '../stories/shared';
import { AiFeedback, PointNote, useAiGrade } from '../questions/useAiGrade';

const TABS = [
  { id: 'deals', label: 'Deals' },
  { id: 'notes', label: 'Market notes' },
  { id: 'pitch', label: 'Pitch me a deal' },
] as const;

const INPUT = 'w-full rounded-md border border-line bg-sunk px-2.5 py-1.5 text-sm outline-none focus:border-accent';

const allDeals = async () => (await db.deals.toArray()).sort((a, b) => (b.announcedOn ?? b.createdAt).localeCompare(a.announcedOn ?? a.createdAt));

export function Journal() {
  const [params, setParams] = useSearchParams();
  const tab = TABS.find((t) => t.id === params.get('tab'))?.id ?? 'deals';
  return (
    <>
      <PageHeader title="Deal & Market Journal" subtitle="Log the deals you follow and a short market note each week, then practice pitching them. This is where “tell me about a deal” and “what’s going on in the markets?” answers come from." />
      <nav className="mb-4 flex gap-1 border-b border-line" aria-label="Journal sections">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setParams({ tab: t.id })}
            aria-current={tab === t.id ? 'page' : undefined}
            className={cx('-mb-px border-b-2 px-3 py-2 text-sm transition', tab === t.id ? 'border-accent text-ink' : 'border-transparent text-muted hover:text-ink')}
          >
            {t.label}
          </button>
        ))}
      </nav>
      {tab === 'deals' && <Deals />}
      {tab === 'notes' && <Notes />}
      {tab === 'pitch' && <Pitch />}
    </>
  );
}

// ───────────────────────────── Deals ─────────────────────────────

type DealForm = { id?: string; acquirer: string; target: string; value: string; multiple: string; sector: string; announcedOn: string; rationale: string; myView: string };
const EMPTY: DealForm = { acquirer: '', target: '', value: '', multiple: '', sector: '', announcedOn: '', rationale: '', myView: '' };

function Deals() {
  const deals = useLiveQuery(allDeals, []);
  const [form, setForm] = useState<DealForm | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  if (!deals) return null;
  const edit = (d: DealEntry) => setForm({ id: d.id, acquirer: d.acquirer, target: d.target, value: d.valueMm === null ? '' : String(d.valueMm), multiple: d.multiple, sector: d.sector, announcedOn: d.announcedOn ?? '', rationale: d.rationale, myView: d.myView });

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1.3fr]">
      <Card className="h-fit">
        {form ? (
          <form
            className="space-y-2.5"
            onSubmit={async (e) => {
              e.preventDefault();
              if (!form.acquirer.trim() || !form.target.trim()) return;
              const value = Number(form.value.replace(/[$,]/g, ''));
              const { xp } = await saveDeal({
                id: form.id,
                acquirer: form.acquirer.trim(),
                target: form.target.trim(),
                valueMm: form.value.trim() && Number.isFinite(value) ? value : null,
                multiple: form.multiple.trim(),
                sector: form.sector.trim(),
                announcedOn: form.announcedOn || null,
                rationale: form.rationale.trim(),
                myView: form.myView.trim(),
              });
              setToast(xp ? `Deal logged · +${xp} XP` : 'Deal updated');
              setForm(null);
            }}
          >
            <h2 className="font-semibold">{form.id ? 'Edit deal' : 'Log a deal'}</h2>
            <div className="grid grid-cols-2 gap-2">
              <Input label="Acquirer" value={form.acquirer} onChange={(v) => setForm({ ...form, acquirer: v })} />
              <Input label="Target" value={form.target} onChange={(v) => setForm({ ...form, target: v })} />
              <Input label="Value ($ millions)" value={form.value} onChange={(v) => setForm({ ...form, value: v })} inputMode="decimal" />
              <Input label="Multiple (e.g. 14x EBITDA)" value={form.multiple} onChange={(v) => setForm({ ...form, multiple: v })} />
              <Input label="Sector" value={form.sector} onChange={(v) => setForm({ ...form, sector: v })} />
              <Input label="Announced" type="date" value={form.announcedOn} onChange={(v) => setForm({ ...form, announcedOn: v })} />
            </div>
            <Area label="Rationale: why the buyer did it" value={form.rationale} onChange={(v) => setForm({ ...form, rationale: v })} />
            <Area label="Your view: would you have done it? What’s the main risk?" value={form.myView} onChange={(v) => setForm({ ...form, myView: v })} />
            <p className="text-[11px] text-faint">Use the press release or the acquirer’s investor presentation; note where numbers came from.</p>
            <div className="flex gap-2">
              <Button type="submit" variant="primary">
                Save
              </Button>
              <Button variant="ghost" onClick={() => setForm(null)}>
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div>
            <h2 className="mb-1 font-semibold">{deals.length} deal{deals.length === 1 ? '' : 's'} logged</h2>
            <p className="mb-3 text-sm text-muted">Aim for three to five deals you can discuss two levels deep, ideally in the sectors of the firms you’re targeting.</p>
            {toast && <p className="mb-3 text-sm text-ok">{toast}</p>}
            <Button variant="primary" onClick={() => (setForm(EMPTY), setToast(null))}>
              <Plus size={15} /> Log a deal
            </Button>
          </div>
        )}
      </Card>
      <div className="space-y-3">
        {deals.length === 0 && (
          <Card>
            <p className="text-sm text-muted">No deals yet.</p>
          </Card>
        )}
        {deals.map((d) => (
          <Card key={d.id}>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold">
                  {d.acquirer} / {d.target}
                </h3>
                <p className="text-xs text-muted tabular">
                  {[dealValueText(d.valueMm), d.multiple, d.sector, d.announcedOn].filter(Boolean).join(' · ')}
                </p>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" className="!px-2 !py-1" aria-label="Edit deal" onClick={() => edit(d)}>
                  <Pencil size={14} />
                </Button>
                <Button
                  variant="ghost"
                  className="!px-2 !py-1"
                  aria-label="Delete deal"
                  onClick={async () => {
                    if (window.confirm('Delete this deal?')) await deleteDeal(d.id);
                  }}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
            {d.rationale && <p className="mt-2 text-sm"><span className="text-muted">Rationale:</span> {d.rationale}</p>}
            {d.myView && <p className="mt-1 text-sm"><span className="text-muted">My view:</span> {d.myView}</p>}
          </Card>
        ))}
      </div>
    </div>
  );
}

function Input({ label, value, onChange, type = 'text', inputMode }: { label: string; value: string; onChange: (v: string) => void; type?: string; inputMode?: 'decimal' }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-xs text-muted">{label}</span>
      <input type={type} inputMode={inputMode} className={INPUT} value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

function Area({ label, value, onChange, rows = 3 }: { label: string; value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-xs text-muted">{label}</span>
      <textarea rows={rows} className={INPUT} value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

// ───────────────────────────── Market notes ─────────────────────────────

const NOTE_TEMPLATE = 'Rates and the Fed: \n10-year yield: \nS&P 500: \nCredit spreads: \nDeals / IPOs: \nMy view and what I’m watching: ';

function Notes() {
  const notes = useLiveQuery(() => db.marketNotes.orderBy('weekOf').reverse().toArray(), []);
  const thisWeek = weekOf(toLocalDate());
  const current = notes?.find((n) => n.weekOf === thisWeek);
  const [text, setText] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  if (!notes) return null;
  const value = text ?? current?.text ?? NOTE_TEMPLATE;
  return (
    <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
      <Card>
        <h2 className="mb-1 font-semibold">Week of {thisWeek}</h2>
        <p className="mb-3 text-sm text-muted">Four numbers and a view. Takes five minutes and covers “what’s going on in the markets?”.</p>
        <textarea aria-label="This week’s market note" rows={10} className={INPUT} value={value} onChange={(e) => (setText(e.target.value), setSaved(false))} />
        <div className="mt-3 flex items-center gap-3">
          <Button
            variant="primary"
            onClick={async () => {
              await saveMarketNote({ weekOf: thisWeek, text: value });
              setSaved(true);
            }}
          >
            Save note
          </Button>
          {saved && <span className="text-sm text-ok">Saved</span>}
        </div>
      </Card>
      <Card className="h-fit">
        <h2 className="mb-3 font-semibold">Past weeks</h2>
        {notes.filter((n) => n.weekOf !== thisWeek).length === 0 ? (
          <p className="text-sm text-muted">Your earlier notes will appear here.</p>
        ) : (
          <ul className="space-y-3">
            {notes
              .filter((n) => n.weekOf !== thisWeek)
              .map((n) => (
                <li key={n.id}>
                  <p className="text-xs font-semibold text-faint">Week of {n.weekOf}</p>
                  <p className="whitespace-pre-line text-sm text-muted">{n.text}</p>
                </li>
              ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

// ───────────────────────────── Pitch practice ─────────────────────────────

function Pitch() {
  const deals = useLiveQuery(allDeals, []);
  const [dealId, setDealId] = useState<string | null>(null);
  const [round, setRound] = useState(0);
  if (!deals) return null;
  if (deals.length === 0)
    return (
      <Card>
        <p className="text-sm text-muted">Log a deal first; the practice prompts come from your own journal.</p>
      </Card>
    );
  const deal = deals.find((d) => d.id === dealId) ?? deals[0]!;
  const others = deals.length > 1 ? deals.filter((d) => d.id !== deal.id) : deals;
  return (
    <PitchRound
      key={`${deal.id}-${round}`}
      deal={deal}
      deals={deals}
      onPick={(id) => (setDealId(id), setRound((r) => r + 1))}
      onRandom={() => (setDealId(others[Math.floor(Math.random() * others.length)]!.id), setRound((r) => r + 1))}
    />
  );
}

function PitchRound({ deal, deals, onPick, onRandom }: { deal: DealEntry; deals: DealEntry[]; onPick: (id: string) => void; onRandom: () => void }) {
  const rubric = useMemo(() => dealPitchRubric(deal), [deal]);
  const [text, setText] = useState('');
  const [hits, setHits] = useState<string[] | null>(null);
  const [xp, setXp] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const start = useRef(Date.now());
  useEffect(() => {
    if (hits) return;
    const t = setInterval(() => setElapsed(Math.floor((Date.now() - start.current) / 1000)), 500);
    return () => clearInterval(t);
  }, [hits]);
  const score = hits ? scoreRubric(rubric, hits) : 0;
  const ai = useAiGrade((g) => setHits(g.hits));

  return (
    <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
      <Card>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <select aria-label="Deal" className="flex-1 rounded-md border border-line bg-sunk px-2 py-1.5 text-sm" value={deal.id} onChange={(e) => onPick(e.target.value)}>
            {deals.map((d) => (
              <option key={d.id} value={d.id}>
                {d.acquirer} / {d.target}
              </option>
            ))}
          </select>
          <Button variant="ghost" className="!px-2 !py-1 text-xs" onClick={onRandom}>
            <Dices size={14} /> Random
          </Button>
        </div>
        <h2 className="mb-1 text-lg font-medium">“Tell me about a deal you’ve been following.”</h2>
        <p className="mb-3 text-sm text-muted">
          Pitch {deal.acquirer}’s acquisition of {deal.target}: facts, rationale, valuation, your view and the main risk.
        </p>
        {!hits ? (
          <>
            <div className="mb-2 flex justify-between text-xs text-muted">
              <span className="flex items-center gap-1.5">
                <Mic size={14} /> Type it as you’d say it; aim for about 90 seconds.
              </span>
              <span className="flex items-center gap-1 tabular">
                <Timer size={13} /> {Math.floor(elapsed / 60)}:{String(elapsed % 60).padStart(2, '0')} · ≈ {speakSeconds(text)}s
              </span>
            </div>
            <textarea aria-label="Your pitch" rows={8} className={INPUT} value={text} onChange={(e) => setText(e.target.value)} />
            <Button variant="primary" className="mt-3" disabled={wordCount(text) < 5} onClick={() => {
                setHits(matchRubric(rubric, text));
                void ai.run({ prompt: `Tell me about a deal you've been following (${deal.acquirer} / ${deal.target}).`, rubric, modelAnswer: dealModelAnswer(deal), answer: text, context: 'The reference answer was built from the candidate’s own deal journal entry.' });
              }}>
              Submit and grade
            </Button>
          </>
        ) : (
          <>
            <div className="mb-3">
              <AiFeedback state={ai.state} />
            </div>
            <ul className="space-y-1.5">
              {rubric.map((r) => (
                <li key={r.id}>
                  <label className="flex items-start gap-2 text-sm">
                    <input
                      type="checkbox"
                      className="mt-1 accent-[var(--c-accent)]"
                      disabled={xp !== null}
                      checked={hits.includes(r.id)}
                      onChange={(e) => setHits(e.target.checked ? [...hits, r.id] : hits.filter((x) => x !== r.id))}
                    />
                    <span>
                      {r.point}
                      <PointNote state={ai.state} id={r.id} />
                    </span>
                  </label>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm">
              Score: <span className="font-semibold tabular">{Math.round(score * 100)}%</span>
            </p>
            {xp === null ? (
              <Button variant="primary" className="mt-3" onClick={async () => setXp(await recordDealPitch(score))}>
                Confirm score
              </Button>
            ) : (
              <div className="mt-3 flex items-center gap-3">
                <Badge tone={score >= 0.75 ? 'ok' : 'warn'}>{score >= 0.75 ? 'Interview-ready' : 'Keep practicing'}</Badge>
                <span className="text-sm text-accent tabular">+{xp} XP</span>
                <Button onClick={onRandom}>Another deal</Button>
              </div>
            )}
          </>
        )}
      </Card>
      <Card className="h-fit">
        <h3 className="mb-2 font-semibold">From your journal</h3>
        {hits ? (
          <p className="text-sm leading-relaxed">
            <FillInText text={dealModelAnswer(deal)} />
          </p>
        ) : (
          <p className="text-sm text-muted">Your journal entry turned into a model answer appears after you submit.</p>
        )}
      </Card>
    </div>
  );
}
