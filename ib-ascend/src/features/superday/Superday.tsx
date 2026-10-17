import { useState, type ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { Check, ChevronDown, Info, RotateCcw, Sparkles, Swords, ThumbsDown, ThumbsUp } from 'lucide-react';
import { db } from '../../db/db';
import { PERSONAS, PERSONA_BY_ID, type Persona } from '../../content/superday/personas';
import { resumeProbes } from '../../content/superday/probes';
import { SEED_RESUME } from '../../content/resume/resume';
import { getSectionContent } from '../../content/registry';
import { SECTIONS } from '../../content/sections';
import { CATEGORY_LABEL, buildSuperday, scoreSuperday, type Category, type Scorecard, type SuperdayRound } from '../../engine/superday';
import { correctAnswerText } from '../../engine/grading';
import { completeSession } from '../../services/progression';
import { useGameStore } from '../../store/useGameStore';
import { mulberry32 } from '../../lib/random';
import type { SectionId } from '../../types/models';
import type { Question } from '../../types/questions';
import { Badge, Button, Card, PageHeader, cx } from '../../components/ui';
import { ProgressBar, masteryTone } from '../../components/Progress';
import { SuperdayRun, type SuperdayLogEntry } from './SuperdayRun';
import { AiInterview, type AiInterviewResult } from './AiInterview';
import { transcriptText, type InterviewerSetup } from '../../engine/ai';
import { llmEnabled } from '../../services/llm';
import { useSettingsStore } from '../../store/useSettingsStore';

type Stage =
  | { kind: 'setup' }
  | { kind: 'running'; persona: Persona; rounds: SuperdayRound[]; startedAt: string }
  | { kind: 'done'; persona: Persona; rounds: SuperdayRound[]; scorecard: Scorecard; log: SuperdayLogEntry[]; xp: number }
  | { kind: 'ai'; setup: InterviewerSetup; startedAt: string }
  | { kind: 'aiDone'; persona: Persona; result: AiInterviewResult; xp: number };

const LENGTHS = [
  { minutes: 10, label: '10 min', note: 'Quick practice' },
  { minutes: 20, label: '20 min' },
  { minutes: 25, label: '25 min' },
  { minutes: 30, label: '30 min', note: 'Full length' },
];

export function Superday() {
  const [stage, setStage] = useState<Stage>({ kind: 'setup' });
  const [params] = useSearchParams();
  const [personaId, setPersonaId] = useState(PERSONA_BY_ID[params.get('persona') ?? '']?.id ?? PERSONAS[0]!.id);
  const [roundCount, setRoundCount] = useState(3);
  const [minutes, setMinutes] = useState(20);
  const [scope, setScope] = useState<'all' | 'unlocked'>('all');
  const aiAvailable = useSettingsStore((s) => llmEnabled(s.settings));
  const [aiMode, setAiMode] = useState(false);
  const useAi = aiAvailable && aiMode;
  const unlocked = useGameStore((s) => s.snapshot?.unlocked ?? []);
  const storyTitles = useLiveQuery(async () => (await db.stories.toArray()).map((s) => s.title), []);
  const resume = useLiveQuery(async () => (await db.resumes.orderBy('version').last()) ?? SEED_RESUME, []);
  const history = useLiveQuery(() => db.sessions.where('mode').equals('superday').reverse().sortBy('startedAt'), []);

  function start() {
    const persona = PERSONA_BY_ID[personaId]!;
    if (useAi) {
      const topics = (Object.entries(persona.sectionWeights) as [SectionId, number][])
        .filter(([id]) => scope === 'all' || unlocked.includes(id))
        .sort((a, b) => b[1] - a[1])
        .map(([id]) => SECTIONS.find((x) => x.id === id)?.title ?? id);
      setStage({
        kind: 'ai',
        setup: { persona, minutes, topics, resume: resume ?? SEED_RESUME, storyTitles: storyTitles ?? [] },
        startedAt: new Date().toISOString(),
      });
      return;
    }
    const technical: Partial<Record<SectionId, Question[]>> = {};
    for (const s of SECTIONS) {
      if (s.id === 'fit') continue;
      if (scope === 'unlocked' && !unlocked.includes(s.id)) continue;
      technical[s.id] = getSectionContent(s.id).questions.filter((q) => q.pools.includes('mock') || q.pools.includes('post'));
    }
    const rounds = buildSuperday({
      persona,
      rounds: roundCount,
      minutes,
      technical,
      behavioral: getSectionContent('fit').questions,
      probes: resumeProbes(resume ?? SEED_RESUME),
      rng: mulberry32(Date.now() >>> 0),
    });
    setStage({ kind: 'running', persona, rounds, startedAt: new Date().toISOString() });
  }

  if (stage.kind === 'running') {
    return (
      <SuperdayRun
        persona={stage.persona}
        rounds={stage.rounds}
        onAbandon={() => setStage({ kind: 'setup' })}
        onFinish={async (answers, log) => {
          const scorecard = scoreSuperday(answers, stage.rounds, stage.persona);
          const res = await completeSession({
            mode: 'superday',
            sectionId: null,
            title: `Superday · ${stage.persona.title}`,
            questionIds: stage.rounds.flatMap((r) => r.items.map((i) => i.question.id)),
            score: scorecard.overall,
            startedAt: stage.startedAt,
            meta: {
              personaId: stage.persona.id,
              wouldAdvance: scorecard.wouldAdvance,
              categories: scorecard.categories,
              rounds: scorecard.rounds,
              minutes,
            },
          });
          setStage({ kind: 'done', persona: stage.persona, rounds: stage.rounds, scorecard, log, xp: res.bonus.xp });
        }}
      />
    );
  }

  if (stage.kind === 'ai') {
    const { setup } = stage;
    return (
      <AiInterview
        setup={setup}
        onAbandon={() => setStage({ kind: 'setup' })}
        onFinish={async (result) => {
          const res = await completeSession({
            mode: 'superday',
            sectionId: null,
            title: `AI Superday · ${setup.persona.title}`,
            questionIds: [],
            score: result.scorecard.overall,
            startedAt: stage.startedAt,
            meta: {
              personaId: setup.persona.id,
              wouldAdvance: result.scorecard.wouldAdvance,
              categories: result.scorecard.categories,
              rounds: result.scorecard.rounds,
              minutes: setup.minutes,
              ai: true,
              aiWouldAdvance: result.ai.would_advance,
              answers: result.turns.filter((t) => t.role === 'candidate').length,
            },
          });
          setStage({ kind: 'aiDone', persona: setup.persona, result, xp: res.bonus.xp });
        }}
      />
    );
  }

  if (stage.kind === 'aiDone') {
    return (
      <ScorecardView persona={stage.persona} scorecard={stage.result.scorecard} xp={stage.xp} onAgain={() => setStage({ kind: 'setup' })}>
        <AiWriteUp result={stage.result} />
      </ScorecardView>
    );
  }

  if (stage.kind === 'done') {
    return (
      <ScorecardView persona={stage.persona} scorecard={stage.scorecard} xp={stage.xp} onAgain={() => setStage({ kind: 'setup' })}>
        <Card>
          <h2 className="mb-3 font-semibold">Every question</h2>
          <ul className="divide-y divide-line">
            {stage.log.map((e, k) => (
              <ReviewRow key={k} entry={e} />
            ))}
          </ul>
        </Card>
      </ScorecardView>
    );
  }

  const unlockedCount = SECTIONS.filter((s) => s.id !== 'fit' && unlocked.includes(s.id)).length;
  return (
    <>
      <PageHeader
        title="Superday Simulator"
        subtitle="Back-to-back timed interviews (technical, behavioral and mixed) with follow-ups, curveballs and probes on your own resume. No feedback until the end, then a scorecard and a verdict."
      />
      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-4">
          <Card>
            <h2 className="mb-1 font-semibold">Interviewer style</h2>
            <p className="mb-3 flex items-start gap-1.5 text-xs text-faint">
              <Info size={13} className="mt-0.5 shrink-0" /> Practice archetypes based on what candidates commonly report about each type of firm. They are not real interviewers or any
              firm’s actual process.
            </p>
            <div className="grid gap-2 sm:grid-cols-2" role="radiogroup" aria-label="Interviewer style">
              {PERSONAS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  role="radio"
                  aria-checked={personaId === p.id}
                  onClick={() => setPersonaId(p.id)}
                  className={cx('rounded-lg border p-3 text-left transition', personaId === p.id ? 'border-accent bg-accent-soft/50' : 'border-line hover:border-faint')}
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className="font-medium">{p.title}</span>
                    {personaId === p.id && <Check size={16} className="text-accent" />}
                  </span>
                  <span className="block text-xs text-accent">{p.style}</span>
                  <span className="mt-1 block text-xs text-muted">{p.description}</span>
                </button>
              ))}
            </div>
          </Card>
          <Card>
            {aiAvailable && (
              <div className="mb-4">
                <Choice
                  label="Format"
                  value={aiMode ? 'ai' : 'classic'}
                  options={[
                    { value: 'classic', label: 'Question rounds' },
                    { value: 'ai', label: 'AI interviewer' },
                  ]}
                  onChange={(v) => setAiMode(v === 'ai')}
                />
                {aiMode && (
                  <p className="mt-2 flex items-start gap-1.5 text-xs text-muted">
                    <Sparkles size={13} className="mt-0.5 shrink-0 text-info" /> One conversational interview with Claude in this style. It asks follow-ups based on your answers and probes
                    your resume, then writes up a scorecard. Uses your API key.
                  </p>
                )}
              </div>
            )}
            <div className={cx('grid gap-4', useAi ? 'sm:grid-cols-2' : 'sm:grid-cols-3')}>
              {!useAi && <Choice label="Rounds" value={roundCount} options={[3, 4].map((n) => ({ value: n, label: String(n) }))} onChange={setRoundCount} />}
              <Choice label={useAi ? 'Interview length' : 'Round length'} value={minutes} options={LENGTHS.map((l) => ({ value: l.minutes, label: l.label }))} onChange={setMinutes} />
              <Choice
                label="Technical scope"
                value={scope}
                options={[
                  { value: 'all', label: 'Everything' },
                  { value: 'unlocked', label: `Unlocked (${unlockedCount})` },
                ]}
                onChange={setScope}
              />
            </div>
            <p className="mt-4 text-xs text-muted">
              {useAi
                ? `One mixed interview of about ${minutes} minutes. Technicals lean toward this style’s focus areas.`
                : `Lineup: ${PERSONA_BY_ID[personaId]!.rounds.slice(0, roundCount).join(' → ')} · about ${roundCount * minutes} minutes in total. Rounds can’t be paused.`}
            </p>
            <Button variant="primary" className="mt-4" onClick={start} disabled={scope === 'unlocked' && unlockedCount === 0}>
              {useAi ? <Sparkles size={16} /> : <Swords size={16} />} {useAi ? 'Start AI interview' : 'Start Superday'}
            </Button>
          </Card>
        </div>
        <Card className="h-fit">
          <h2 className="mb-3 font-semibold">Past Superdays</h2>
          {!history?.length ? (
            <p className="text-sm text-muted">None yet. A full day takes an hour or more; try 10-minute rounds first.</p>
          ) : (
            <ul className="divide-y divide-line text-sm">
              {history.slice(0, 10).map((s) => {
                const adv = s.meta?.wouldAdvance === true;
                return (
                  <li key={s.id} className="flex items-center justify-between gap-2 py-2">
                    <span>
                      <span className="block">
                        {PERSONA_BY_ID[String(s.meta?.personaId)]?.title ?? s.title}
                        {s.meta?.ai === true && (
                          <span className="ml-1.5">
                            <Badge tone="info">AI</Badge>
                          </span>
                        )}
                      </span>
                      <span className="text-xs text-faint">{new Date(s.startedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                    </span>
                    <span className="flex items-center gap-2 tabular">
                      {Math.round((s.score ?? 0) * 100)}%<Badge tone={adv ? 'ok' : 'bad'}>{adv ? 'Advance' : 'Ding'}</Badge>
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}

function Choice<T extends string | number>({ label, value, options, onChange }: { label: string; value: T; options: { value: T; label: string }[]; onChange: (v: T) => void }) {
  return (
    <div>
      <p className="mb-1.5 text-xs text-muted">{label}</p>
      <div className="flex flex-wrap gap-1" role="radiogroup" aria-label={label}>
        {options.map((o) => (
          <button
            key={String(o.value)}
            type="button"
            role="radio"
            aria-checked={value === o.value}
            onClick={() => onChange(o.value)}
            className={cx('rounded-md border px-2.5 py-1 text-sm transition', value === o.value ? 'border-accent/60 bg-accent-soft text-accent' : 'border-line text-muted hover:text-ink')}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function ScorecardView({ persona, scorecard, xp, onAgain, children }: { persona: Persona; scorecard: Scorecard; xp: number; onAgain: () => void; children: ReactNode }) {
  const cats = Object.entries(scorecard.categories) as [Category, number | null][];
  return (
    <>
      <PageHeader title="Superday scorecard" subtitle={`${persona.title} interviewer (${persona.style})`} />
      <div className="mb-4 grid gap-4 lg:grid-cols-[1fr_1.4fr]">
        <Card className={cx('text-center', scorecard.wouldAdvance ? 'border-ok/50' : 'border-bad/50')}>
          <p className="text-xs uppercase tracking-widest text-faint">Would advance?</p>
          <p className={cx('mt-2 flex items-center justify-center gap-2 text-4xl font-semibold', scorecard.wouldAdvance ? 'text-ok' : 'text-bad')}>
            {scorecard.wouldAdvance ? <ThumbsUp size={30} /> : <ThumbsDown size={30} />}
            {scorecard.wouldAdvance ? 'Yes' : 'No'}
          </p>
          <p className="mt-2 text-sm text-muted tabular">
            Overall {Math.round(scorecard.overall * 100)}% · bar {Math.round(persona.bar * 100)}% · <span className="text-accent">+{xp} XP</span>
          </p>
          <ul className="mt-4 space-y-1 text-left text-sm text-muted">
            {scorecard.reasons.map((r) => (
              <li key={r}>• {r}</li>
            ))}
          </ul>
          <Button variant="primary" className="mt-5" onClick={onAgain}>
            <RotateCcw size={16} /> Another Superday
          </Button>
        </Card>
        <Card>
          <h2 className="mb-3 font-semibold">How you scored</h2>
          <ul className="space-y-3">
            {cats.map(([k, v]) => (
              <li key={k} className="grid grid-cols-[130px_1fr_44px] items-center gap-3 text-sm">
                <span className="text-muted">
                  {CATEGORY_LABEL[k]}
                  <span className="block text-[11px] text-faint">weight {Math.round(persona.weights[k] * 100)}%</span>
                </span>
                {v === null ? <span className="text-xs text-faint">Not tested</span> : <ProgressBar value={v} barClassName={masteryTone(v)} label={CATEGORY_LABEL[k]} />}
                <span className="text-right tabular">{v === null ? '—' : `${Math.round(v * 100)}%`}</span>
              </li>
            ))}
          </ul>
          <h3 className="mt-5 mb-2 text-sm font-semibold">By round</h3>
          <table className="w-full text-sm tabular">
            <tbody className="divide-y divide-line">
              {scorecard.rounds.map((r) => (
                <tr key={r.index}>
                  <td className="py-1.5 text-muted">Round {r.index + 1}</td>
                  <td className="py-1.5 capitalize">{r.kind}</td>
                  <td className="py-1.5 text-right text-muted">
                    {r.answered}/{r.total} answered
                  </td>
                  <td className={cx('py-1.5 text-right font-semibold', r.score < 0.5 && 'text-bad')}>{Math.round(r.score * 100)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
          {scorecard.weakest && (
            <p className="mt-4 text-sm text-muted">
              Work on <span className="text-ink">{CATEGORY_LABEL[scorecard.weakest].toLowerCase()}</span> first
              {scorecard.strongest && (
                <>
                  ; your strongest area was <span className="text-ink">{CATEGORY_LABEL[scorecard.strongest].toLowerCase()}</span>
                </>
              )}
              .
            </p>
          )}
        </Card>
      </div>
      {children}
    </>
  );
}

function AiWriteUp({ result }: { result: AiInterviewResult }) {
  const { ai, turns } = result;
  const [open, setOpen] = useState(false);
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <h2 className="mb-3 flex items-center gap-2 font-semibold">
          <Sparkles size={16} className="text-info" /> Interviewer’s write-up
        </h2>
        <h3 className="mb-1 text-sm font-semibold text-ok">Strengths</h3>
        <ul className="mb-4 space-y-1 text-sm">
          {ai.strengths.map((x) => (
            <li key={x}>• {x}</li>
          ))}
        </ul>
        <h3 className="mb-1 text-sm font-semibold text-warn">Fix next</h3>
        <ul className="space-y-1 text-sm">
          {ai.improvements.map((x) => (
            <li key={x}>• {x}</li>
          ))}
        </ul>
      </Card>
      <Card>
        <h2 className="mb-3 font-semibold">Question by question</h2>
        <ul className="divide-y divide-line text-sm">
          {ai.questions.map((q, k) => (
            <li key={k} className="py-2">
              <p className="text-ink">{q.question}</p>
              <p className="mt-0.5 text-muted">{q.note}</p>
            </li>
          ))}
        </ul>
        <button type="button" onClick={() => setOpen(!open)} className="mt-3 flex items-center gap-1 text-sm text-accent hover:underline" aria-expanded={open}>
          <ChevronDown size={15} className={cx('transition', open && 'rotate-180')} /> Full transcript
        </button>
        {open && <pre className="mt-2 max-h-96 overflow-auto rounded-lg bg-sunk p-3 text-xs whitespace-pre-wrap">{transcriptText(turns)}</pre>}
      </Card>
    </div>
  );
}

function ReviewRow({ entry }: { entry: SuperdayLogEntry }) {
  const [open, setOpen] = useState(false);
  const q = entry.item.question;
  const s = entry.grade.score;
  return (
    <li className="py-2">
      <button type="button" onClick={() => setOpen(!open)} className="flex w-full items-start gap-3 text-left text-sm" aria-expanded={open}>
        <span className={cx('mt-0.5 w-10 shrink-0 text-right font-semibold tabular', entry.response === null ? 'text-faint' : s >= 0.7 ? 'text-ok' : s > 0 ? 'text-warn' : 'text-bad')}>
          {entry.response === null ? '—' : `${Math.round(s * 100)}%`}
        </span>
        <span className="flex-1">
          <span className="mr-1.5 text-xs text-faint">R{entry.round + 1}</span>
          {q.prompt}
          {entry.item.curveball && (
            <span className="ml-1.5">
              <Badge tone="warn">Curveball</Badge>
            </span>
          )}
          {entry.item.probe && (
            <span className="ml-1.5">
              <Badge tone="info">Resume probe</Badge>
            </span>
          )}
        </span>
        <ChevronDown size={16} className={cx('mt-0.5 shrink-0 text-faint transition', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="mt-2 ml-13 rounded-lg bg-sunk p-3 text-sm text-muted">
          {entry.response === null && <p className="mb-1 text-bad">Not answered before time ran out.</p>}
          {q.type === 'freeText' ? (
            <>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-faint">Model answer</p>
              <p className="text-ink">{q.modelAnswer}</p>
            </>
          ) : (
            <p>
              Answer: <span className="whitespace-pre-line text-ink">{correctAnswerText(q)}</span>
            </p>
          )}
          <p className="mt-2">{q.explanation}</p>
        </div>
      )}
    </li>
  );
}
