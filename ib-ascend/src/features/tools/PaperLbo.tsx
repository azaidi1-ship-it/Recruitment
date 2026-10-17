import { useEffect, useMemo, useRef, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { CheckCircle2, PenLine, Play, RotateCcw, Timer, XCircle } from 'lucide-react';
import { db } from '../../db/db';
import { checkStep, describeScenario, generateScenario, solveScenario, type PaperLboScenario } from '../../engine/paperLbo';
import { paperLboXp } from '../../engine/xp';
import { recordActivity } from '../../services/progression';
import { parseNumberInput } from '../../lib/numberInput';
import { mulberry32 } from '../../lib/random';
import { newId } from '../../lib/id';
import { Badge, Button, Card, PageHeader, cx } from '../../components/ui';

const DRILL_ID = 'paper-lbo';

const RULES = [
  'No calculator: work it out on paper, rounding sensibly as you go.',
  'Interest is charged on the starting debt every year.',
  'D&A equals capex and working capital doesn’t change.',
  'All free cash flow repays debt; no fees or dividends.',
  'Answers within about 1% count; MOIC within 0.1x; IRR within 3 points.',
];

type Stage = { kind: 'intro' } | { kind: 'solving'; scenario: PaperLboScenario; startedAt: number } | { kind: 'done'; scenario: PaperLboScenario; seconds: number; xp: number };

export function PaperLbo() {
  const [stage, setStage] = useState<Stage>({ kind: 'intro' });
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const runs = useLiveQuery(() => db.arcadeScores.where('drillId').equals(DRILL_ID).reverse().sortBy('createdAt'), []);
  const steps = useMemo(() => (stage.kind === 'intro' ? [] : solveScenario(stage.scenario)), [stage]);
  const best = runs?.filter((r) => r.correct === r.total).sort((a, b) => a.durationSec - b.durationSec)[0];

  const start = () => {
    setAnswers({});
    setStage({ kind: 'solving', scenario: generateScenario(mulberry32(Date.now() >>> 0)), startedAt: Date.now() });
  };

  const submit = async () => {
    if (stage.kind !== 'solving') return;
    const seconds = Math.round((Date.now() - stage.startedAt) / 1000);
    const correct = steps.filter((s) => {
      const v = parseNumberInput(answers[s.id] ?? '');
      return v !== null && checkStep(s, v);
    }).length;
    await db.arcadeScores.add({ id: newId('arc'), drillId: DRILL_ID, score: correct, correct, total: steps.length, durationSec: seconds, createdAt: new Date().toISOString() });
    const xp = await recordActivity({ kind: 'arcadeRun' }, paperLboXp(correct, steps.length), 'Paper LBO');
    setStage({ kind: 'done', scenario: stage.scenario, seconds, xp });
  };

  return (
    <>
      <PageHeader
        title="Paper LBO Trainer"
        subtitle="A fresh scenario every time, built so each step works by hand. Solve it the way you would in an interview, then check every step against the worked solution."
        right={best && <Badge tone="accent">Best clean run {formatTime(best.durationSec)}</Badge>}
      />

      {stage.kind === 'intro' && (
        <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
          <Card>
            <PenLine className="mb-3 text-accent" size={28} />
            <h2 className="mb-2 font-semibold">The rules</h2>
            <ul className="mb-5 list-disc space-y-1.5 pl-5 text-sm text-muted">
              {RULES.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
            <p className="mb-4 text-xs text-faint">Interview benchmark: a clean paper LBO in under 5 minutes. Under 3 is excellent.</p>
            <Button variant="primary" onClick={start}>
              <Play size={16} /> New scenario
            </Button>
          </Card>
          <History runs={runs ?? []} />
        </div>
      )}

      {stage.kind !== 'intro' && (
        <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
          <Card className="h-fit lg:sticky lg:top-6">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-semibold">Scenario</h2>
              {stage.kind === 'solving' ? <Stopwatch since={stage.startedAt} /> : <Badge>{formatTime(stage.seconds)}</Badge>}
            </div>
            <div className="space-y-2 text-sm leading-relaxed">
              {describeScenario(stage.scenario).map((l) => (
                <p key={l}>{l}</p>
              ))}
            </div>
            <ul className="mt-4 space-y-1 border-t border-line pt-3 text-xs text-faint">
              {RULES.slice(1, 4).map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </Card>

          <Card>
            <ol className="space-y-3">
              {steps.map((s, k) => {
                const v = parseNumberInput(answers[s.id] ?? '');
                const ok = v !== null && checkStep(s, v);
                const done = stage.kind === 'done';
                return (
                  <li key={s.id} className={cx('rounded-lg border p-3', done ? (ok ? 'border-ok/40 bg-ok-soft/40' : 'border-bad/40 bg-bad-soft/40') : 'border-line')}>
                    <label className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-sm">
                        <span className="mr-2 text-faint tabular">{k + 1}.</span>
                        {s.prompt}
                      </span>
                      <span className="flex items-center gap-1.5">
                        {s.unit === '$' && <span className="text-xs text-faint">$</span>}
                        <input
                          inputMode="decimal"
                          aria-label={s.label}
                          disabled={done}
                          value={answers[s.id] ?? ''}
                          onChange={(e) => setAnswers((a) => ({ ...a, [s.id]: e.target.value }))}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') (e.currentTarget.closest('li')?.nextElementSibling?.querySelector('input') as HTMLInputElement | null)?.focus();
                          }}
                          className="w-28 rounded-md border border-line bg-sunk px-2 py-1 text-right tabular outline-none focus:border-accent disabled:opacity-80"
                        />
                        <span className="w-4 text-xs text-faint">{s.unit === '$' ? '' : s.unit}</span>
                      </span>
                    </label>
                    {done && (
                      <div className="mt-2 text-xs">
                        <p className={cx('flex items-center gap-1.5 font-medium', ok ? 'text-ok' : 'text-bad')}>
                          {ok ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                          {ok ? 'Correct' : `Answer: ${s.unit === '$' ? '$' : ''}${s.answer.toLocaleString('en-US', { maximumFractionDigits: 2 })}${s.unit === '$' ? '' : s.unit}`}
                        </p>
                        <ul className="mt-1 space-y-0.5 text-muted">
                          {s.working.map((w) => (
                            <li key={w}>{w}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>
                );
              })}
            </ol>
            {stage.kind === 'solving' ? (
              <div className="mt-4 flex justify-end">
                <Button variant="primary" onClick={() => void submit()}>
                  Check my answers
                </Button>
              </div>
            ) : (
              <Result steps={steps} answers={answers} seconds={stage.seconds} xp={stage.xp} onAgain={start} />
            )}
          </Card>
        </div>
      )}
    </>
  );
}

function Result({
  steps,
  answers,
  seconds,
  xp,
  onAgain,
}: {
  steps: ReturnType<typeof solveScenario>;
  answers: Record<string, string>;
  seconds: number;
  xp: number;
  onAgain: () => void;
}) {
  const correct = steps.filter((s) => {
    const v = parseNumberInput(answers[s.id] ?? '');
    return v !== null && checkStep(s, v);
  }).length;
  const clean = correct === steps.length;
  return (
    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
      <p className="text-sm">
        <span className="text-lg font-semibold tabular">
          {correct}/{steps.length}
        </span>{' '}
        steps in {formatTime(seconds)}
        {clean && seconds < 300 && <span className="ml-2 text-ok">Interview-ready pace.</span>}
        <span className="ml-2 text-accent tabular">+{xp} XP</span>
      </p>
      <Button variant="primary" onClick={onAgain}>
        <RotateCcw size={16} /> New scenario
      </Button>
    </div>
  );
}

function History({ runs }: { runs: { id: string; correct: number; total: number; durationSec: number; createdAt: string }[] }) {
  return (
    <Card>
      <h2 className="mb-3 font-semibold">Your runs</h2>
      {runs.length === 0 ? (
        <p className="text-sm text-muted">No runs yet.</p>
      ) : (
        <ul className="divide-y divide-line text-sm">
          {runs.slice(0, 8).map((r) => (
            <li key={r.id} className="flex justify-between py-1.5 tabular">
              <span className="text-muted">{new Date(r.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
              <span className={r.correct === r.total ? 'text-ok' : ''}>
                {r.correct}/{r.total}
              </span>
              <span>{formatTime(r.durationSec)}</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

function Stopwatch({ since }: { since: number }) {
  const [now, setNow] = useState(Date.now());
  const t = useRef<ReturnType<typeof setInterval>>(undefined);
  useEffect(() => {
    t.current = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(t.current);
  }, []);
  const secs = Math.floor((now - since) / 1000);
  return (
    <span className={cx('flex items-center gap-1.5 rounded-md border px-2 py-1 text-sm font-semibold tabular', secs >= 300 ? 'border-warn/50 text-warn' : 'border-line')} role="timer">
      <Timer size={14} /> {formatTime(secs)}
    </span>
  );
}

export function formatTime(secs: number): string {
  return `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`;
}
