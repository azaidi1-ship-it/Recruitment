import { useMemo, useState, type ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { AlertTriangle, History, Pencil, Plus, RotateCcw, Save, Trash2, X } from 'lucide-react';
import { db } from '../../db/db';
import { COMPETENCIES } from '../../content/behavioral/competencies';
import { shortOrg } from '../../content/superday/probes';
import { createStory, deleteStory, restoreVersion, saveStory } from '../../services/storyBank';
import type { CompetencyId, Resume, Story } from '../../types/models';
import { Badge, Button, Card, cx } from '../../components/ui';
import { CompetencyChip, FillInText, speakSeconds, wordCount } from './shared';
import { confirmAction } from '../../lib/confirm';

export function StoriesTab({ resume, stories }: { resume: Resume; stories: Story[] }) {
  const [params, setParams] = useSearchParams();
  const [filter, setFilter] = useState<CompetencyId | 'needs-work' | ''>('');
  const selectedId = params.get('story') ?? stories[0]?.id;
  const selected = stories.find((s) => s.id === selectedId) ?? null;
  const select = (id: string) => setParams((p) => {
    p.set('story', id);
    return p;
  }, { replace: true });

  const shown = stories.filter((s) => (filter === '' ? true : filter === 'needs-work' ? s.needsRewrite || s.fillIns.length > 0 : s.competencies.includes(filter)));
  const groups = resume.items
    .map((item) => ({ item, stories: shown.filter((s) => s.resumeItemId === item.id) }))
    .filter((g) => g.stories.length > 0);
  const orphans = shown.filter((s) => !resume.items.some((i) => i.id === s.resumeItemId));

  return (
    <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
      <Card className="h-fit !p-3 lg:sticky lg:top-6">
        <div className="mb-3 flex gap-2">
          <select
            aria-label="Filter stories"
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
            className="w-full rounded-md border border-line bg-sunk px-2 py-1.5 text-sm"
          >
            <option value="">All stories ({stories.length})</option>
            <option value="needs-work">Needs work</option>
            {COMPETENCIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
          <NewStory resume={resume} onCreated={select} />
        </div>
        <div className="max-h-[70vh] space-y-3 overflow-y-auto pr-1">
          {groups.map(({ item, stories: own }) => (
            <div key={item.id}>
              <p className="mb-1 px-1 text-[11px] font-semibold uppercase tracking-wide text-faint">{shortOrg(item.org)}</p>
              {own.map((s) => (
                <StoryRow key={s.id} story={s} active={s.id === selected?.id} onClick={() => select(s.id)} />
              ))}
            </div>
          ))}
          {orphans.length > 0 && (
            <div>
              <p className="mb-1 px-1 text-[11px] font-semibold uppercase tracking-wide text-faint">No longer on resume</p>
              {orphans.map((s) => (
                <StoryRow key={s.id} story={s} active={s.id === selected?.id} onClick={() => select(s.id)} />
              ))}
            </div>
          )}
          {shown.length === 0 && <p className="px-1 text-sm text-muted">No stories match.</p>}
        </div>
      </Card>
      {selected ? <StoryEditor key={selected.id} story={selected} resume={resume} /> : <Card><p className="text-sm text-muted">Pick a story.</p></Card>}
    </div>
  );
}

function StoryRow({ story, active, onClick }: { story: Story; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx('mb-0.5 flex w-full items-start gap-2 rounded-md px-2 py-1.5 text-left text-sm transition', active ? 'bg-accent-soft text-accent' : 'hover:bg-sunk')}
    >
      <span className="flex-1">{story.title}</span>
      {story.fillIns.length > 0 && (
        <span className="mt-0.5 shrink-0 rounded bg-warn-soft px-1 text-[10px] text-warn tabular" title={`${story.fillIns.length} open [FILL IN] questions`}>
          {story.fillIns.length}
        </span>
      )}
      {story.needsRewrite && story.fillIns.length === 0 && <AlertTriangle size={13} className="mt-1 shrink-0 text-warn" aria-label="Needs rewrite" />}
    </button>
  );
}

function NewStory({ resume, onCreated }: { resume: Resume; onCreated: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  if (!open)
    return (
      <Button className="!px-2.5" onClick={() => setOpen(true)} aria-label="New story">
        <Plus size={16} />
      </Button>
    );
  return (
    <select
      autoFocus
      aria-label="Resume item for the new story"
      className="w-full rounded-md border border-accent bg-sunk px-2 py-1.5 text-sm"
      defaultValue=""
      onBlur={() => setOpen(false)}
      onChange={async (e) => {
        if (!e.target.value) return;
        const s = await createStory(e.target.value);
        setOpen(false);
        onCreated(s.id);
      }}
    >
      <option value="">New story for…</option>
      {resume.items.map((i) => (
        <option key={i.id} value={i.id}>
          {i.role}, {shortOrg(i.org)}
        </option>
      ))}
    </select>
  );
}

const FIELDS: { key: 'situation' | 'task' | 'action' | 'result'; label: string; rows: number }[] = [
  { key: 'situation', label: 'Situation', rows: 3 },
  { key: 'task', label: 'Task', rows: 2 },
  { key: 'action', label: 'Action (the longest part: what you did)', rows: 7 },
  { key: 'result', label: 'Result (a number, what you learned, the link to banking)', rows: 4 },
];

function StoryEditor({ story, resume }: { story: Story; resume: Resume }) {
  const [editing, setEditing] = useState(story.title === 'New story');
  const [draft, setDraft] = useState(story);
  const [note, setNote] = useState('');
  const versions = useLiveQuery(() => db.storyVersions.where('storyId').equals(story.id).reverse().sortBy('createdAt'), [story.id]);
  const item = resume.items.find((i) => i.id === story.resumeItemId);
  const set = <K extends keyof Story>(k: K, v: Story[K]) => setDraft((d) => ({ ...d, [k]: v }));
  const spokenWords = wordCount(story.spoken);
  const starText = useMemo(() => [draft.situation, draft.task, draft.action, draft.result].filter(Boolean).join(' '), [draft]);

  if (editing) {
    return (
      <Card>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-semibold">Edit story</h2>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => (setDraft(story), setEditing(false))}>
              <X size={15} /> Cancel
            </Button>
            <Button
              variant="primary"
              onClick={async () => {
                await saveStory(draft, note.trim() || 'Edited');
                setNote('');
                setEditing(false);
              }}
            >
              <Save size={15} /> Save
            </Button>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Title">
            <input className={INPUT} value={draft.title} onChange={(e) => set('title', e.target.value)} />
          </Field>
          <Field label="Angle (e.g. leadership, failure)">
            <input className={INPUT} value={draft.angle} onChange={(e) => set('angle', e.target.value)} />
          </Field>
        </div>
        <Field label="Competencies it proves" className="mt-3">
          <div className="flex flex-wrap gap-1.5">
            {COMPETENCIES.map((c) => {
              const on = draft.competencies.includes(c.id);
              return (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => set('competencies', on ? draft.competencies.filter((x) => x !== c.id) : [...draft.competencies, c.id])}
                  className={cx('rounded-full border px-2 py-0.5 text-xs transition', on ? 'border-accent/60 bg-accent-soft text-accent' : 'border-line text-muted hover:text-ink')}
                >
                  {c.label}
                </button>
              );
            })}
          </div>
        </Field>
        {FIELDS.map((f) => (
          <Field key={f.key} label={`${f.label} · ${wordCount(draft[f.key])} words`} className="mt-3">
            <textarea className={INPUT} rows={f.rows} value={draft[f.key]} onChange={(e) => set(f.key, e.target.value)} />
          </Field>
        ))}
        <Field label={`Spoken version · ${wordCount(draft.spoken)} words ≈ ${speakSeconds(draft.spoken)}s (aim for 150–225 words)`} className="mt-3">
          <textarea className={INPUT} rows={7} value={draft.spoken} onChange={(e) => set('spoken', e.target.value)} />
          <button type="button" className="mt-1 text-xs text-accent hover:underline" onClick={() => set('spoken', starText)}>
            Rebuild from Situation–Task–Action–Result
          </button>
        </Field>
        <Field label={`20-second version · ${wordCount(draft.short)} words`} className="mt-3">
          <textarea className={INPUT} rows={3} value={draft.short} onChange={(e) => set('short', e.target.value)} />
        </Field>
        <Field label="Note for the version history (optional)" className="mt-3">
          <input className={INPUT} value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Added the Stratus revenue drivers" />
        </Field>
        <p className="mt-3 text-xs text-faint">Replace each [FILL IN: …] with your own detail. Anything left in brackets is listed under Fill-ins.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <div className="mb-2 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">{story.title}</h2>
            <p className="text-sm text-muted">
              {item ? `${item.role}, ${shortOrg(item.org)}` : 'Resume item removed'} · {story.angle}
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setEditing(true)}>
              <Pencil size={15} /> Edit
            </Button>
            <Button
              variant="ghost"
              aria-label="Delete story"
              onClick={async () => {
                if (await confirmAction(`Delete “${story.title}” and its version history?`)) await deleteStory(story.id);
              }}
            >
              <Trash2 size={15} />
            </Button>
          </div>
        </div>
        <div className="mb-3 flex flex-wrap gap-1.5">
          {story.competencies.map((c) => (
            <CompetencyChip key={c} id={c} />
          ))}
          {story.fillIns.length > 0 && <Badge tone="warn">{story.fillIns.length} to fill in</Badge>}
          {story.unverifiedDetails.length > 0 && <Badge tone="warn">{story.unverifiedDetails.length} made-up details to check</Badge>}
          {story.needsRewrite && <Badge tone="warn">Flagged for rewrite</Badge>}
          {story.practiceScore !== null && <Badge tone={story.practiceScore >= 0.7 ? 'ok' : 'bad'}>Last practice {Math.round(story.practiceScore * 100)}%</Badge>}
          {story.userEdited && <Badge tone="info">Edited by you</Badge>}
        </div>
        {story.unverifiedDetails.length > 0 && <UnverifiedBox story={story} />}
        <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-faint">
          60–90 second version · {spokenWords} words ≈ {speakSeconds(story.spoken)}s
        </h3>
        <p className="text-[15px] leading-relaxed">
          <FillInText text={story.spoken} />
        </p>
        <h3 className="mt-4 mb-1 text-xs font-semibold uppercase tracking-wide text-faint">20-second version</h3>
        <p className="text-sm leading-relaxed text-muted">
          <FillInText text={story.short} />
        </p>
      </Card>
      <Card>
        <h3 className="mb-2 font-semibold">STAR breakdown</h3>
        <dl className="space-y-2 text-sm">
          {FIELDS.map((f) => (
            <div key={f.key} className="grid gap-1 sm:grid-cols-[90px_1fr]">
              <dt className="font-medium text-muted capitalize">{f.key}</dt>
              <dd>
                <FillInText text={story[f.key]} />
              </dd>
            </div>
          ))}
        </dl>
      </Card>
      <Card>
        <h3 className="mb-2 flex items-center gap-2 font-semibold">
          <History size={16} className="text-muted" /> Version history
        </h3>
        {!versions?.length ? (
          <p className="text-sm text-muted">No earlier versions. Every save keeps the previous text here.</p>
        ) : (
          <ul className="divide-y divide-line text-sm">
            {versions.map((v) => (
              <li key={v.id} className="flex items-center justify-between gap-3 py-2">
                <span>
                  {v.note}
                  <span className="block text-xs text-faint">{new Date(v.createdAt).toLocaleString()}</span>
                </span>
                <Button
                  variant="ghost"
                  className="!px-2 !py-1 text-xs"
                  onClick={async () => {
                    if (await confirmAction('Restore this version? Your current text is saved as a version first.')) await restoreVersion(v.id);
                  }}
                >
                  <RotateCcw size={13} /> Restore
                </Button>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

/** Details the app invented to complete the story; the user confirms or rewrites them. */
function UnverifiedBox({ story }: { story: Story }) {
  return (
    <div className="mb-4 rounded-lg border border-warn/40 bg-warn-soft/40 p-3 text-sm">
      <p className="mb-1 flex items-center gap-1.5 font-semibold text-warn">
        <AlertTriangle size={14} /> Made up by the app: check before you say it
      </p>
      <p className="mb-2 text-xs text-muted">These details aren’t on your resume. An interviewer can ask about any of them, so change anything that isn’t true (Edit), then confirm.</p>
      <ul className="mb-2 list-disc space-y-0.5 pl-5">
        {story.unverifiedDetails.map((d) => (
          <li key={d}>{d}</li>
        ))}
      </ul>
      <Button
        className="!px-2.5 !py-1 text-xs"
        onClick={async () => {
          if (await confirmAction('Confirm these details are true (or that you have edited the story to make them true)?'))
            await db.stories.update(story.id, { unverifiedDetails: [], userEdited: true, updatedAt: new Date().toISOString() });
        }}
      >
        These are true now
      </Button>
    </div>
  );
}

const INPUT = 'w-full rounded-md border border-line bg-sunk px-2.5 py-1.5 text-sm outline-none focus:border-accent';

function Field({ label, className, children }: { label: string; className?: string; children: ReactNode }) {
  return (
    <div className={className}>
      <span className="mb-1 block text-xs text-muted">{label}</span>
      {children}
    </div>
  );
}

