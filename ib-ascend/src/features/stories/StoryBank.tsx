import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { AlertTriangle, CheckCircle2, Copy, Dices, Mic, Search, Timer } from 'lucide-react';
import { db } from '../../db/db';
import { SEED_RESUME } from '../../content/resume/resume';
import { BEHAVIORAL_QUESTIONS, behavioralRubric } from '../../content/stories/behavioralQuestions';
import { shortOrg } from '../../content/superday/probes';
import { coverageMatrix, resumeWalkthrough, whyFirm, whyIb } from '../../engine/storyBank';
import { matchRubric, scoreRubric } from '../../engine/grading/rubric';
import { recordPractice } from '../../services/storyBank';
import { listFirms } from '../../services/tracker';
import { newId } from '../../lib/id';
import type { BehavioralQuestion, Resume, Story } from '../../types/models';
import { Badge, Button, Card, PageHeader, cx } from '../../components/ui';
import { StoriesTab } from './StoriesTab';
import { CompetencyChip, FillInText, speakSeconds, wordCount } from './shared';

const TABS = [
  { id: 'stories', label: 'Stories' },
  { id: 'questions', label: 'Questions' },
  { id: 'coverage', label: 'Coverage' },
  { id: 'practice', label: 'Practice' },
  { id: 'answers', label: 'Walkthrough & Why' },
  { id: 'fill-ins', label: 'Fill-ins' },
] as const;
type TabId = (typeof TABS)[number]['id'];

export function StoryBank() {
  const [params, setParams] = useSearchParams();
  const tab = (TABS.find((t) => t.id === params.get('tab'))?.id ?? 'stories') as TabId;
  const resume = useLiveQuery(async () => (await db.resumes.orderBy('version').last()) ?? SEED_RESUME, []);
  const rawStories = useLiveQuery(() => db.stories.toArray(), []);
  // Resume order, then title, so every view lists stories the same way.
  const stories = useMemo(() => {
    if (!rawStories || !resume) return undefined;
    const pos = new Map(resume.items.map((i, k) => [i.id, k]));
    return [...rawStories].sort((a, b) => (pos.get(a.resumeItemId) ?? 999) - (pos.get(b.resumeItemId) ?? 999) || a.createdAt.localeCompare(b.createdAt) || a.title.localeCompare(b.title));
  }, [rawStories, resume]);
  if (!resume || !stories) return null;
  const openFillIns = stories.reduce((n, s) => n + s.fillIns.length, 0);
  const go = (t: TabId, extra: Record<string, string> = {}) => setParams({ tab: t, ...extra });

  return (
    <>
      <PageHeader
        title="Story Bank"
        subtitle="STAR stories for every item on your resume, the behavioral question bank, a coverage check and timed practice. Everything is editable and versioned."
      />
      <nav className="mb-4 flex gap-1 overflow-x-auto border-b border-line" aria-label="Story Bank sections">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => go(t.id)}
            aria-current={tab === t.id ? 'page' : undefined}
            className={cx('-mb-px shrink-0 border-b-2 px-3 py-2 text-sm transition', tab === t.id ? 'border-accent text-ink' : 'border-transparent text-muted hover:text-ink')}
          >
            {t.label}
            {t.id === 'fill-ins' && openFillIns > 0 && <span className="ml-1.5 rounded bg-warn-soft px-1 text-[11px] text-warn tabular">{openFillIns}</span>}
          </button>
        ))}
      </nav>
      {tab === 'stories' && <StoriesTab resume={resume} stories={stories} />}
      {tab === 'questions' && <QuestionsTab stories={stories} onPractice={(id) => go('practice', { q: id })} />}
      {tab === 'coverage' && <CoverageTab resume={resume} stories={stories} />}
      {tab === 'practice' && <PracticeTab key={params.get('q') ?? 'random'} stories={stories} initialId={params.get('q')} />}
      {tab === 'answers' && <AnswersTab resume={resume} />}
      {tab === 'fill-ins' && <FillInsTab resume={resume} stories={stories} />}
    </>
  );
}

// ───────────────────────────── Questions ─────────────────────────────

const CATEGORY_LABEL: Record<BehavioralQuestion['category'], string> = {
  core: 'Core',
  motivation: 'Motivation',
  resume: 'Resume',
  competency: 'Competency',
  curveball: 'Curveball',
};

function QuestionsTab({ stories, onPractice }: { stories: Story[]; onPractice: (id: string) => void }) {
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState<BehavioralQuestion['category'] | ''>('');
  const byId = new Map(stories.map((s) => [s.id, s]));
  const shown = BEHAVIORAL_QUESTIONS.filter((q) => (!cat || q.category === cat) && q.prompt.toLowerCase().includes(query.toLowerCase()));
  return (
    <Card>
      <div className="mb-4 flex flex-wrap gap-2">
        <label className="flex flex-1 items-center gap-2 rounded-md border border-line bg-sunk px-2.5">
          <Search size={15} className="text-faint" />
          <input className="w-full bg-transparent py-1.5 text-sm outline-none" placeholder={`Search ${BEHAVIORAL_QUESTIONS.length} questions`} value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search questions" />
        </label>
        <select aria-label="Category" value={cat} onChange={(e) => setCat(e.target.value as typeof cat)} className="rounded-md border border-line bg-sunk px-2 py-1.5 text-sm">
          <option value="">All categories</option>
          {Object.entries(CATEGORY_LABEL).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
      </div>
      <ul className="divide-y divide-line">
        {shown.map((q) => (
          <li key={q.id} className="py-3">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <p className="font-medium">{q.prompt}</p>
              <div className="flex shrink-0 items-center gap-2">
                <Badge>{CATEGORY_LABEL[q.category]}</Badge>
                <Button className="!px-2.5 !py-1 text-xs" onClick={() => onPractice(q.id)}>
                  <Mic size={13} /> Practice
                </Button>
              </div>
            </div>
            <ul className="mt-1.5 space-y-1">
              {q.storyMatches.map((m) => {
                const s = byId.get(m.storyId);
                return (
                  <li key={m.storyId} className="text-sm text-muted">
                    <Link to={`/stories?tab=stories&story=${m.storyId}`} className="text-ink hover:text-accent">
                      {s?.title ?? m.storyId}
                    </Link>
                    : {m.angle}
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ul>
    </Card>
  );
}

// ───────────────────────────── Coverage ─────────────────────────────

function CoverageTab({ resume, stories }: { resume: Resume; stories: Story[] }) {
  const rows = coverageMatrix(stories, resume);
  const ready = stories.filter((s) => s.fillIns.length === 0);
  const gaps = rows.filter((r) => r.gap);
  return (
    <div className="space-y-4">
      <Card>
        <h2 className="mb-1 font-semibold">Competencies × stories</h2>
        <p className="mb-3 text-sm text-muted">
          Aim for at least two stories per competency. Columns with fewer are highlighted. {ready.length} of {stories.length} stories are complete (no open [FILL IN]s); only complete stories count toward your Polish stat.
        </p>
        <div className="overflow-x-auto">
          <table className="text-xs">
            <thead>
              <tr>
                <th className="sticky left-0 z-10 bg-surface px-2 py-1 text-left font-medium text-faint">Story</th>
                {rows.map((r) => (
                  <th key={r.competency.id} scope="col" className={cx('h-28 px-1 align-bottom font-medium', r.gap ? 'text-warn' : 'text-muted')}>
                    <span className="inline-block w-4 rotate-180 whitespace-nowrap [writing-mode:vertical-rl]">{r.competency.label}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stories.map((s) => (
                <tr key={s.id} className="border-t border-line">
                  <th scope="row" className="sticky left-0 z-10 max-w-56 truncate bg-surface px-2 py-1 text-left font-normal">
                    <Link to={`/stories?tab=stories&story=${s.id}`} className="hover:text-accent" title={s.title}>
                      {s.title}
                    </Link>
                  </th>
                  {rows.map((r) => (
                    <td key={r.competency.id} className={cx('px-1 text-center', r.gap && 'bg-warn-soft/40')}>
                      {s.competencies.includes(r.competency.id) ? <span className={cx('inline-block size-2.5 rounded-full', s.fillIns.length ? 'border border-accent' : 'bg-accent')} aria-label="yes" /> : null}
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="border-t-2 border-line font-semibold">
                <th scope="row" className="sticky left-0 bg-surface px-2 py-1 text-left">Stories</th>
                {rows.map((r) => (
                  <td key={r.competency.id} className={cx('px-1 py-1 text-center tabular', r.gap ? 'text-warn' : '')}>
                    {r.stories.length}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-2 flex items-center gap-3 text-[11px] text-faint">
          <span className="inline-flex items-center gap-1">
            <span className="inline-block size-2.5 rounded-full bg-accent" /> complete
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="inline-block size-2.5 rounded-full border border-accent" /> has open [FILL IN]s
          </span>
        </p>
      </Card>
      <Card>
        <h2 className="mb-3 font-semibold">{gaps.length ? `Gaps to fill (${gaps.length})` : 'No gaps: every competency has two or more stories'}</h2>
        <ul className="space-y-3">
          {gaps.map((g) => (
            <li key={g.competency.id}>
              <p className="flex items-center gap-2 text-sm font-medium">
                <AlertTriangle size={14} className="text-warn" /> {g.competency.label}: {g.stories.length} stor{g.stories.length === 1 ? 'y' : 'ies'}
              </p>
              <ul className="mt-1 list-disc pl-6 text-sm text-muted">
                {g.suggestions.map((s) => (
                  <li key={s.itemId}>
                    {s.org}: {s.idea}
                  </li>
                ))}
                {g.suggestions.length === 0 && <li>Tag an existing story with this competency, or add one from a new resume item.</li>}
              </ul>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

// ───────────────────────────── Practice ─────────────────────────────

function PracticeTab({ stories, initialId }: { stories: Story[]; initialId: string | null }) {
  const [question, setQuestion] = useState<BehavioralQuestion>(() => BEHAVIORAL_QUESTIONS.find((q) => q.id === initialId) ?? randomQuestion());
  const [text, setText] = useState('');
  const [stage, setStage] = useState<'answer' | 'grade' | 'done'>('answer');
  const [hits, setHits] = useState<string[]>([]);
  const [result, setResult] = useState<{ xp: number; weak: boolean; score: number } | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const started = useRef(Date.now());
  const [sessionId] = useState(() => newId('ses'));
  // STAR + competency points, plus length: a 20-word answer can't tell a story.
  const rubric = useMemo(() => [...behavioralRubric(question), { id: 'length', point: 'Long enough to tell the story (100+ words, about 40 seconds spoken)', keywords: [], weight: 1 }], [question]);
  const matched = question.storyMatches.map((m) => ({ ...m, story: stories.find((s) => s.id === m.storyId) })).filter((m) => m.story);
  const score = scoreRubric(rubric, hits);

  useEffect(() => {
    if (stage !== 'answer') return;
    const t = setInterval(() => setElapsed(Math.floor((Date.now() - started.current) / 1000)), 500);
    return () => clearInterval(t);
  }, [stage]);

  function next(q: BehavioralQuestion = randomQuestion(question.id)) {
    setQuestion(q);
    setText('');
    setStage('answer');
    setHits([]);
    setResult(null);
    started.current = Date.now();
    setElapsed(0);
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
      <Card>
        <div className="mb-3 flex items-center justify-between gap-2">
          <Badge>{CATEGORY_LABEL[question.category]}</Badge>
          <Button variant="ghost" className="!px-2 !py-1 text-xs" onClick={() => next()}>
            <Dices size={14} /> Another question
          </Button>
        </div>
        <h2 className="mb-4 text-lg font-medium">{question.prompt}</h2>
        {stage === 'answer' && (
          <>
            <div className="mb-2 flex items-center justify-between text-xs text-muted">
              <span className="flex items-center gap-1.5">
                <Mic size={14} /> Type it the way you’d say it. Aim for 60–90 seconds spoken.
              </span>
              <span className={cx('flex items-center gap-1 tabular', elapsed > 120 && 'text-warn')}>
                <Timer size={13} /> {Math.floor(elapsed / 60)}:{String(elapsed % 60).padStart(2, '0')} · {wordCount(text)} words ≈ {speakSeconds(text)}s
              </span>
            </div>
            <textarea aria-label="Your answer" rows={10} value={text} onChange={(e) => setText(e.target.value)} className="w-full rounded-md border border-line bg-sunk p-3 text-sm outline-none focus:border-accent" />
            <Button
              variant="primary"
              className="mt-3"
              disabled={wordCount(text) < 5}
              onClick={() => {
                setHits([...matchRubric(rubric, text), ...(wordCount(text) >= 100 ? ['length'] : [])]);
                setStage('grade');
              }}
            >
              Submit and grade
            </Button>
          </>
        )}
        {stage !== 'answer' && (
          <>
            <p className="mb-3 whitespace-pre-line rounded-md bg-sunk p-3 text-sm text-muted">{text}</p>
            <h3 className="mb-2 text-sm font-semibold">Rubric {stage === 'grade' && <span className="font-normal text-muted">(points found in your answer are ticked; adjust honestly)</span>}</h3>
            <ul className="space-y-1.5">
              {rubric.map((r) => (
                <li key={r.id}>
                  <label className="flex items-start gap-2 text-sm">
                    <input
                      type="checkbox"
                      className="mt-1 accent-[var(--c-accent)]"
                      disabled={stage === 'done'}
                      checked={hits.includes(r.id)}
                      onChange={(e) => setHits((h) => (e.target.checked ? [...h, r.id] : h.filter((x) => x !== r.id)))}
                    />
                    <span>
                      {r.point}
                      {r.weight > 1 && <span className="ml-1 text-xs text-faint">(×{r.weight})</span>}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm">
              Score: <span className="font-semibold tabular">{Math.round(score * 100)}%</span>
            </p>
            {stage === 'grade' ? (
              <Button
                variant="primary"
                className="mt-3"
                onClick={async () => {
                  const r = await recordPractice({ question, story: matched[0]?.story ?? null, text, hitPointIds: hits, score, timeMs: Date.now() - started.current, sessionId });
                  setResult({ ...r, score });
                  setStage('done');
                }}
              >
                Confirm score
              </Button>
            ) : (
              result && (
                <div className={cx('mt-3 rounded-lg border p-3 text-sm', result.weak ? 'border-warn/40 bg-warn-soft/40' : 'border-ok/40 bg-ok-soft/40')}>
                  <p className="flex items-center gap-2 font-medium">
                    {result.weak ? <AlertTriangle size={16} className="text-warn" /> : <CheckCircle2 size={16} className="text-ok" />}
                    {result.weak
                      ? `Below 70%: “${matched[0]?.story?.title ?? 'this story'}” is flagged for a rewrite and added to your review queue.`
                      : 'Solid answer.'}
                    <span className="ml-auto text-accent tabular">+{result.xp} XP</span>
                  </p>
                  <Button className="mt-3" onClick={() => next()}>
                    Next question
                  </Button>
                </div>
              )
            )}
          </>
        )}
      </Card>
      <Card className="h-fit">
        <h3 className="mb-2 font-semibold">Your best stories for this</h3>
        {stage === 'answer' ? (
          <p className="text-sm text-muted">
            {matched.map((m) => m.story!.title).join(' · ') || 'No mapped story.'}
            <span className="mt-2 block text-xs text-faint">The full story and angle appear after you answer, so you practice recalling it.</span>
          </p>
        ) : (
          <ul className="space-y-4">
            {matched.map((m) => (
              <li key={m.storyId}>
                <Link to={`/stories?tab=stories&story=${m.storyId}`} className="font-medium hover:text-accent">
                  {m.story!.title}
                </Link>
                <p className="mt-0.5 text-xs text-accent">Angle: {m.angle}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">
                  <FillInText text={m.story!.spoken} />
                </p>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {question.competencies.map((c) => (
            <CompetencyChip key={c} id={c} />
          ))}
        </div>
      </Card>
    </div>
  );
}

function randomQuestion(not?: string): BehavioralQuestion {
  const pool = BEHAVIORAL_QUESTIONS.filter((q) => q.id !== not);
  return pool[Math.floor(Math.random() * pool.length)]!;
}

// ───────────────────────────── Walkthrough & Why ─────────────────────────────

function AnswersTab({ resume }: { resume: Resume }) {
  const firms = useLiveQuery(() => listFirms(), []);
  const deals = useLiveQuery(() => db.deals.toArray(), []);
  const [firmId, setFirmId] = useState<string>('');
  const firm = firms?.find((f) => f.id === firmId) ?? firms?.[0];
  const blocks = [
    { title: 'Walk me through your resume: 60 seconds', text: resumeWalkthrough(resume, '60s') },
    { title: 'Walk me through your resume: 2 minutes', text: resumeWalkthrough(resume, '2min') },
    { title: 'Why investment banking?', text: whyIb(resume) },
  ];
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {blocks.map((b) => (
        <AnswerCard key={b.title} title={b.title} text={b.text} />
      ))}
      <Card>
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-semibold">Why [firm]?</h3>
          <select aria-label="Firm" value={firm?.id ?? ''} onChange={(e) => setFirmId(e.target.value)} className="rounded-md border border-line bg-sunk px-2 py-1 text-sm">
            {firms?.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>
        {firm && deals && (
          <>
            <p className="text-[15px] leading-relaxed">
              <FillInText text={firm.whyFirmDraft || whyFirm(firm, deals, resume)} />
            </p>
            <p className="mt-3 text-xs text-faint">
              Built from your{' '}
              <Link to={`/tools/firms/${firm.id}`} className="text-accent hover:underline">
                {firm.name} card
              </Link>
              : add a contact and a researched deal there and the [FILL IN]s disappear.
            </p>
          </>
        )}
      </Card>
      <p className="text-xs text-faint lg:col-span-2">
        These are generated from resume v{resume.version}, so they update when you re-import your resume. Practice them out loud; don’t memorize word for word.
      </p>
    </div>
  );
}

function AnswerCard({ title, text }: { title: string; text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Card>
      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 className="font-semibold">{title}</h3>
        <Button
          variant="ghost"
          className="!px-2 !py-1 text-xs"
          onClick={async () => {
            await navigator.clipboard?.writeText(text).catch(() => {});
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
        >
          <Copy size={13} /> {copied ? 'Copied' : 'Copy'}
        </Button>
      </div>
      <p className="text-[15px] leading-relaxed">
        <FillInText text={text} />
      </p>
      <p className="mt-2 text-xs text-faint tabular">
        {wordCount(text)} words ≈ {speakSeconds(text)} seconds spoken
      </p>
    </Card>
  );
}

// ───────────────────────────── Fill-ins ─────────────────────────────

function FillInsTab({ resume, stories }: { resume: Resume; stories: Story[] }) {
  const groups = resume.items
    .map((item) => ({ item, stories: stories.filter((s) => s.resumeItemId === item.id && s.fillIns.length > 0) }))
    .filter((g) => g.stories.length);
  const total = stories.reduce((n, s) => n + s.fillIns.length, 0);
  return (
    <Card>
      <h2 className="mb-1 font-semibold">{total} open questions</h2>
      <p className="mb-4 text-sm text-muted">
        Details only you can supply. Answer them by editing the story: replace the bracketed text with your detail. The app never fills these in for you.
      </p>
      <div className="space-y-5">
        {groups.map(({ item, stories: own }) => (
          <section key={item.id}>
            <h3 className="mb-2 text-sm font-semibold">
              {item.role}, {shortOrg(item.org)}
            </h3>
            {own.map((s) => (
              <div key={s.id} className="mb-3">
                <Link to={`/stories?tab=stories&story=${s.id}`} className="text-sm text-accent hover:underline">
                  {s.title}
                </Link>
                <ol className="mt-1 list-decimal space-y-0.5 pl-6 text-sm text-muted">
                  {s.fillIns.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ol>
              </div>
            ))}
          </section>
        ))}
        {total === 0 && <p className="text-sm text-ok">All filled in.</p>}
      </div>
    </Card>
  );
}

