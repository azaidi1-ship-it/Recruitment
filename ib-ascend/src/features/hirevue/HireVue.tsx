import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Camera, CameraOff, Download, Mic, RotateCcw, Square, Video } from 'lucide-react';
import { db } from '../../db/db';
import { HIREVUE_QUESTIONS } from '../../content/hirevue/questions';
import { HV_CATEGORY_LABEL, type HireVueQuestion } from '../../content/hirevue/types';
import { buildHireVue, FOCUS_LABEL, type HireVueFocus } from '../../engine/hirevue/build';
import { analyzeDelivery, DELIVERY_CHECKS, hireVueScore, PACE } from '../../engine/hirevue/delivery';
import { matchRubric, scoreRubric } from '../../engine/grading/rubric';
import { answerQuestion, completeSession } from '../../services/progression';
import { hashString, mulberry32 } from '../../lib/random';
import { newId } from '../../lib/id';
import { Badge, Button, Card, PageHeader, cx } from '../../components/ui';
import { createTranscriber, mediaSupported, openCamera, speechSupported, stopStream, TakeRecorder, type Transcriber } from './media';

interface Settings {
  count: number;
  focus: HireVueFocus;
  prepSec: number;
  /** 0 = use each question's own time. */
  answerSec: number;
  retakes: number;
  camera: boolean;
  transcript: boolean;
}

export interface Take {
  question: HireVueQuestion;
  allowedSec: number;
  durationSec: number;
  transcript: string;
  videoUrl: string | null;
  mimeType: string | null;
  takesUsed: number;
}

const DEFAULTS: Settings = { count: 5, focus: 'mixed', prepSec: 30, answerSec: 0, retakes: 1, camera: true, transcript: true };

export function HireVuePage() {
  const [stage, setStage] = useState<'setup' | 'run' | 'review'>('setup');
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [questions, setQuestions] = useState<HireVueQuestion[]>([]);
  const [takes, setTakes] = useState<Take[]>([]);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [startedAt, setStartedAt] = useState('');

  useEffect(() => () => stopStream(stream), [stream]);

  // Release recordings when leaving the page.
  const takesRef = useRef<Take[]>([]);
  takesRef.current = takes;
  useEffect(() => () => takesRef.current.forEach((t) => t.videoUrl && URL.revokeObjectURL(t.videoUrl)), []);

  if (stage === 'run') {
    return (
      <HireVueRun
        questions={questions}
        settings={settings}
        stream={stream}
        onDone={(t) => {
          setTakes(t);
          stopStream(stream);
          setStream(null);
          setStage('review');
        }}
        onQuit={() => {
          stopStream(stream);
          setStream(null);
          setStage('setup');
        }}
      />
    );
  }
  if (stage === 'review') {
    return (
      <HireVueReview
        takes={takes}
        startedAt={startedAt}
        onRestart={() => {
          takes.forEach((t) => t.videoUrl && URL.revokeObjectURL(t.videoUrl));
          setTakes([]);
          setStage('setup');
        }}
      />
    );
  }
  return (
    <HireVueSetup
      settings={settings}
      onChange={setSettings}
      stream={stream}
      setStream={setStream}
      onStart={() => {
        const rng = mulberry32(hashString(`hv-${Date.now()}`));
        setQuestions(buildHireVue(HIREVUE_QUESTIONS, settings.focus, settings.count, rng));
        setStartedAt(new Date().toISOString());
        setStage('run');
      }}
    />
  );
}

// ───────────────────────────── Setup ─────────────────────────────

function HireVueSetup({
  settings,
  onChange,
  stream,
  setStream,
  onStart,
}: {
  settings: Settings;
  onChange: (s: Settings) => void;
  stream: MediaStream | null;
  setStream: (s: MediaStream | null) => void;
  onStart: () => void;
}) {
  const [camError, setCamError] = useState<string | null>(null);
  const [opening, setOpening] = useState(false);
  const canRecord = mediaSupported();
  const canTranscribe = speechSupported();
  const history = useLiveQuery(() => db.sessions.where('mode').equals('hirevue').reverse().sortBy('startedAt'), [], []);
  const set = <K extends keyof Settings>(k: K, v: Settings[K]) => onChange({ ...settings, [k]: v });

  async function enableCamera() {
    setOpening(true);
    setCamError(null);
    try {
      setStream(await openCamera());
    } catch (e) {
      setCamError(e instanceof Error && e.name === 'NotAllowedError' ? 'Camera or microphone permission was denied.' : 'Couldn’t open a camera on this device.');
    } finally {
      setOpening(false);
    }
  }

  const needsCamera = settings.camera && canRecord && !stream;

  return (
    <>
      <PageHeader
        title="HireVue practice"
        subtitle="A one-way video interview: no interviewer, a prep countdown, a recording countdown and limited retakes. Many banks use this format for first rounds."
      />
      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <Card>
          <h2 className="mb-4 font-semibold">Set up your session</h2>
          <div className="grid gap-4 text-sm sm:grid-cols-2">
            <Field label="Questions">
              <Segmented value={settings.count} options={[3, 5, 7].map((n) => [n, String(n)])} onChange={(v) => set('count', v)} />
            </Field>
            <Field label="Prep time">
              <Segmented value={settings.prepSec} options={[30, 45, 60].map((n) => [n, `${n}s`])} onChange={(v) => set('prepSec', v)} />
            </Field>
            <Field label="Answer time">
              <Segmented
                value={settings.answerSec}
                options={[
                  [0, 'Per question'],
                  [60, '1 min'],
                  [120, '2 min'],
                  [180, '3 min'],
                ]}
                onChange={(v) => set('answerSec', v)}
              />
            </Field>
            <Field label="Retakes per question">
              <Segmented value={settings.retakes} options={[0, 1, 2].map((n) => [n, String(n)])} onChange={(v) => set('retakes', v)} />
            </Field>
            <Field label="Focus" wide>
              <select className="w-full rounded-lg border border-line bg-sunk px-3 py-2" value={settings.focus} onChange={(e) => set('focus', e.target.value as HireVueFocus)}>
                {(Object.keys(FOCUS_LABEL) as HireVueFocus[]).map((f) => (
                  <option key={f} value={f}>
                    {FOCUS_LABEL[f]}
                  </option>
                ))}
              </select>
            </Field>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={settings.camera && canRecord} disabled={!canRecord} onChange={(e) => set('camera', e.target.checked)} />
              Record video {!canRecord && <span className="text-faint">(not supported here)</span>}
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={settings.transcript && canTranscribe} disabled={!canTranscribe} onChange={(e) => set('transcript', e.target.checked)} />
              Live transcript {!canTranscribe && <span className="text-faint">(not supported in this browser)</span>}
            </label>
          </div>
          {canTranscribe && settings.transcript && (
            <p className="mt-3 text-xs text-faint">
              The live transcript uses your browser’s speech service (in Chrome, audio is sent to Google for recognition). Recordings never leave this device.
            </p>
          )}
          <div className="mt-5 flex flex-wrap gap-2">
            {needsCamera ? (
              <Button variant="primary" onClick={enableCamera} disabled={opening}>
                <Camera size={16} /> {opening ? 'Opening camera…' : 'Turn on camera'}
              </Button>
            ) : (
              <Button variant="primary" onClick={onStart}>
                <Video size={16} /> Start HireVue
              </Button>
            )}
            {needsCamera && (
              <Button variant="ghost" onClick={() => set('camera', false)}>
                <CameraOff size={16} /> Practice without video
              </Button>
            )}
          </div>
          {camError && <p className="mt-2 text-sm text-bad">{camError} You can still practice without video.</p>}
        </Card>

        <div className="space-y-4">
          <Card className="overflow-hidden !p-0">
            {stream ? <LiveVideo stream={stream} /> : (
              <div className="grid aspect-video place-items-center bg-sunk text-sm text-faint">
                <span className="flex items-center gap-2">
                  <CameraOff size={16} /> Camera off
                </span>
              </div>
            )}
          </Card>
          <Card>
            <h3 className="mb-2 text-sm font-semibold">How the real thing works</h3>
            <ul className="list-disc space-y-1 pl-5 text-xs text-muted">
              <li>Usually 3–6 questions, each with about 30 seconds to prepare and 1–3 minutes to answer.</li>
              <li>Recording starts automatically when prep time ends.</li>
              <li>Retakes are often limited to one, or none at all.</li>
              <li>Reviewers watch for structure, specifics and how you come across on camera.</li>
            </ul>
          </Card>
          {history.length > 0 && (
            <Card>
              <h3 className="mb-2 text-sm font-semibold">Past sessions</h3>
              <ul className="space-y-1.5 text-sm">
                {history.slice(0, 6).map((s) => (
                  <li key={s.id} className="flex justify-between text-muted tabular">
                    <span>{new Date(s.startedAt).toLocaleDateString()} · {s.questionIds.length} questions</span>
                    <span className="text-ink">{Math.round((s.score ?? 0) * 100)}%</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}

function Field({ label, wide, children }: { label: string; wide?: boolean; children: ReactNode }) {
  return (
    <div className={wide ? 'sm:col-span-2' : ''}>
      <div className="mb-1.5 font-medium">{label}</div>
      {children}
    </div>
  );
}

function Segmented<T extends number>({ value, options, onChange }: { value: T; options: [T, string][]; onChange: (v: T) => void }) {
  return (
    <div className="inline-flex flex-wrap rounded-lg border border-line bg-sunk p-0.5">
      {options.map(([v, label]) => (
        <button
          key={String(v)}
          type="button"
          aria-pressed={v === value}
          onClick={() => onChange(v)}
          className={cx('rounded-md px-3 py-1.5 text-sm', v === value ? 'bg-accent text-accent-ink' : 'text-muted hover:text-ink')}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function LiveVideo({ stream }: { stream: MediaStream }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.srcObject = stream;
  }, [stream]);
  return <video ref={ref} autoPlay muted playsInline className="aspect-video w-full -scale-x-100 bg-black object-cover" aria-label="Your camera" />;
}

// ───────────────────────────── Run ─────────────────────────────

function useCountdown(seconds: number, running: boolean, onEnd: () => void, key: unknown) {
  const [left, setLeft] = useState(seconds);
  const endRef = useRef(onEnd);
  endRef.current = onEnd;
  useEffect(() => {
    setLeft(seconds);
    if (!running) return;
    const end = Date.now() + seconds * 1000;
    const t = setInterval(() => {
      const r = Math.max(0, (end - Date.now()) / 1000);
      setLeft(r);
      if (r <= 0) {
        clearInterval(t);
        endRef.current();
      }
    }, 200);
    return () => clearInterval(t);
  }, [seconds, running, key]);
  return left;
}

function HireVueRun({
  questions,
  settings,
  stream,
  onDone,
  onQuit,
}: {
  questions: HireVueQuestion[];
  settings: Settings;
  stream: MediaStream | null;
  onDone: (takes: Take[]) => void;
  onQuit: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<'prep' | 'rec' | 'review'>('prep');
  const [attempt, setAttempt] = useState(0); // bumps on retake to restart timers
  const [takesUsed, setTakesUsed] = useState(1);
  const [current, setCurrent] = useState<Take | null>(null);
  const [liveText, setLiveText] = useState({ final: '', interim: '' });
  const [results, setResults] = useState<Take[]>([]);
  const recorder = useRef<TakeRecorder | null>(null);
  const transcriber = useRef<Transcriber | null>(null);
  const recStart = useRef(0);

  const q = questions[index]!;
  const allowed = settings.answerSec || q.answerSec;
  const useVideo = settings.camera && stream !== null;

  const prepLeft = useCountdown(settings.prepSec, phase === 'prep', () => void startRecording(), `${index}-${attempt}-prep`);
  const recLeft = useCountdown(allowed, phase === 'rec', () => void stopRecording(), `${index}-${attempt}-rec`);

  async function startRecording() {
    if (phase !== 'prep') return;
    setLiveText({ final: '', interim: '' });
    if (useVideo && stream) {
      recorder.current = new TakeRecorder(stream);
      recorder.current.start();
    }
    if (settings.transcript) {
      transcriber.current = createTranscriber((final, interim) => setLiveText({ final, interim }));
      transcriber.current?.start();
    }
    recStart.current = Date.now();
    setPhase('rec');
  }

  async function stopRecording() {
    if (phase !== 'rec') return;
    const durationSec = Math.min(allowed, (Date.now() - recStart.current) / 1000);
    const text = transcriber.current?.stop() ?? '';
    transcriber.current = null;
    let videoUrl: string | null = null;
    let mimeType: string | null = null;
    if (recorder.current) {
      const blob = await recorder.current.stop();
      mimeType = recorder.current.mimeType;
      recorder.current = null;
      if (blob.size > 0) videoUrl = URL.createObjectURL(blob);
    }
    setCurrent({ question: q, allowedSec: allowed, durationSec, transcript: text, videoUrl, mimeType, takesUsed });
    setPhase('review');
  }

  function retake() {
    if (current?.videoUrl) URL.revokeObjectURL(current.videoUrl);
    setCurrent(null);
    setTakesUsed((n) => n + 1);
    setAttempt((a) => a + 1);
    setPhase('prep');
  }

  function next() {
    if (!current) return;
    const all = [...results, current];
    setResults(all);
    setCurrent(null);
    if (index + 1 >= questions.length) {
      onDone(all);
      return;
    }
    setIndex(index + 1);
    setTakesUsed(1);
    setAttempt((a) => a + 1);
    setPhase('prep');
  }

  const retakesLeft = settings.retakes - (takesUsed - 1);
  const fmt = (s: number) => `${Math.floor(Math.ceil(s) / 60)}:${String(Math.ceil(s) % 60).padStart(2, '0')}`;

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-accent">HireVue practice</p>
          <p className="text-sm text-muted tabular">
            Question {index + 1} of {questions.length}
          </p>
        </div>
        <Button variant="ghost" onClick={() => window.confirm('Quit this HireVue? Your answers so far won’t be saved.') && onQuit()}>
          Quit
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <Card>
          <div className="mb-3 flex flex-wrap gap-1.5">
            <Badge tone="accent">{HV_CATEGORY_LABEL[q.category]}</Badge>
            <Badge>{fmt(allowed)} to answer</Badge>
            {settings.retakes > 0 && <Badge>{Math.max(0, retakesLeft)} retake{retakesLeft === 1 ? '' : 's'} left</Badge>}
          </div>
          <h2 className="text-xl font-medium leading-snug">{q.prompt}</h2>

          {phase === 'prep' && (
            <div className="mt-6">
              <p className="text-sm text-muted">Prepare your answer. Recording starts automatically.</p>
              <p className="my-3 text-5xl font-semibold tabular" role="timer" aria-label="Prep time left">
                {fmt(prepLeft)}
              </p>
              <Button variant="primary" onClick={() => void startRecording()}>
                <Mic size={16} /> Start recording now
              </Button>
            </div>
          )}

          {phase === 'rec' && (
            <div className="mt-6">
              <p className="flex items-center gap-2 text-sm font-semibold text-bad">
                <span className="inline-block size-2.5 animate-pulse rounded-full bg-bad" /> Recording
              </p>
              <p className="my-3 text-5xl font-semibold tabular" role="timer" aria-label="Answer time left">
                {fmt(recLeft)}
              </p>
              <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-sunk">
                <div className="h-full bg-bad transition-[width] duration-200" style={{ width: `${(recLeft / allowed) * 100}%` }} />
              </div>
              <Button variant="danger" onClick={() => void stopRecording()}>
                <Square size={14} /> Finish answer
              </Button>
              {settings.transcript && (liveText.final || liveText.interim) && (
                <p className="mt-4 max-h-32 overflow-y-auto rounded-lg bg-sunk p-3 text-sm text-muted">
                  {liveText.final} <span className="text-faint">{liveText.interim}</span>
                </p>
              )}
            </div>
          )}

          {phase === 'review' && current && (
            <div className="mt-6 space-y-4">
              {current.videoUrl ? (
                <video src={current.videoUrl} controls playsInline className="aspect-video w-full rounded-lg bg-black" aria-label="Your recorded answer" />
              ) : (
                <p className="text-sm text-muted">Answer recorded ({Math.round(current.durationSec)}s).</p>
              )}
              {current.transcript && <p className="rounded-lg bg-sunk p-3 text-sm text-muted">{current.transcript}</p>}
              <div className="flex flex-wrap gap-2">
                <Button variant="primary" onClick={next}>
                  {index + 1 >= questions.length ? 'Finish and review' : 'Submit and continue'}
                </Button>
                {retakesLeft > 0 && (
                  <Button onClick={retake}>
                    <RotateCcw size={16} /> Retake ({retakesLeft} left)
                  </Button>
                )}
              </div>
            </div>
          )}
        </Card>

        <div className="space-y-4">
          <Card className="overflow-hidden !p-0">
            {useVideo && stream ? <LiveVideo stream={stream} /> : (
              <div className="grid aspect-video place-items-center bg-sunk text-sm text-faint">Audio only: say your answer out loud</div>
            )}
          </Card>
          {phase === 'prep' && (
            <Card>
              <h3 className="mb-2 text-sm font-semibold">Quick tips</h3>
              <ul className="list-disc space-y-1 pl-5 text-xs text-muted">
                {q.tips.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────── Review ─────────────────────────────

interface Review {
  transcript: string;
  hits: string[];
  delivery: string[];
}

function HireVueReview({ takes, startedAt, onRestart }: { takes: Take[]; startedAt: string; onRestart: () => void }) {
  const [reviews, setReviews] = useState<Review[]>(() =>
    takes.map((t) => ({ transcript: t.transcript, hits: matchRubric(t.question.rubric, t.transcript), delivery: [] })),
  );
  const [saved, setSaved] = useState<{ score: number; xp: number } | null>(null);
  const [saving, setSaving] = useState(false);

  const scoreOf = (i: number) => hireVueScore(scoreRubric(takes[i]!.question.rubric, reviews[i]!.hits), reviews[i]!.delivery);
  const overall = takes.length ? takes.reduce((n, _, i) => n + scoreOf(i), 0) / takes.length : 0;
  const update = (i: number, patch: Partial<Review>) => setReviews((rs) => rs.map((r, j) => (j === i ? { ...r, ...patch } : r)));

  async function save() {
    setSaving(true);
    const sessionId = newId('ses');
    let xp = 0;
    for (const [i, t] of takes.entries()) {
      const score = scoreOf(i);
      const r = await answerQuestion({
        questionId: t.question.id,
        sectionId: t.question.sectionId,
        subtopic: t.question.subtopic,
        difficulty: t.question.difficulty,
        mode: 'hirevue',
        sessionId,
        response: { type: 'freeText', text: reviews[i]!.transcript, hitPointIds: reviews[i]!.hits, selfScore: score },
        correct: score >= 0.7,
        score,
        timeMs: Math.round(t.durationSec * 1000),
      });
      xp += r.xp.xp;
    }
    const s = await completeSession({
      mode: 'hirevue',
      sectionId: null,
      title: 'HireVue practice',
      questionIds: takes.map((t) => t.question.id),
      score: overall,
      startedAt,
      meta: { takes: takes.map((t) => t.takesUsed) },
    });
    setSaved({ score: overall, xp: xp + s.bonus.xp });
    setSaving(false);
  }

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <PageHeader
        title="Review your HireVue"
        subtitle="Watch each answer, fix the transcript if needed, tick what you covered, then save. Reviewers score structure, specifics and delivery."
        right={<p className="text-3xl font-semibold tabular">{Math.round(overall * 100)}%</p>}
      />

      {takes.map((t, i) => (
        <ReviewCard key={t.question.id} n={i + 1} take={t} review={reviews[i]!} score={scoreOf(i)} locked={Boolean(saved)} onChange={(p) => update(i, p)} />
      ))}

      <Card className="flex flex-wrap items-center justify-between gap-3">
        {saved ? (
          <>
            <p className="text-sm text-ok">
              Saved: {Math.round(saved.score * 100)}% overall, +{saved.xp} XP. Recordings aren’t stored; download any you want to keep.
            </p>
            <Button variant="primary" onClick={onRestart}>
              New session
            </Button>
          </>
        ) : (
          <>
            <p className="text-sm text-muted">Score = 70% content (rubric) + 30% delivery (checklist).</p>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => window.confirm('Discard this session without saving?') && onRestart()}>
                Discard
              </Button>
              <Button variant="primary" onClick={() => void save()} disabled={saving}>
                {saving ? 'Saving…' : 'Save session'}
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}

function ReviewCard({
  n,
  take,
  review,
  score,
  locked,
  onChange,
}: {
  n: number;
  take: Take;
  review: Review;
  score: number;
  locked: boolean;
  onChange: (p: Partial<Review>) => void;
}) {
  const q = take.question;
  const stats = analyzeDelivery(review.transcript, take.durationSec, take.allowedSec);
  const toggle = (list: string[], id: string) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);
  const ext = take.mimeType?.includes('mp4') ? 'mp4' : 'webm';

  return (
    <Card>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xs text-faint tabular">
            {n}. {HV_CATEGORY_LABEL[q.category]} · {Math.round(take.durationSec)}s of {take.allowedSec}s · take {take.takesUsed}
          </p>
          <h2 className="font-medium">{q.prompt}</h2>
        </div>
        <span className={cx('text-lg font-semibold tabular', score >= 0.7 ? 'text-ok' : 'text-warn')}>{Math.round(score * 100)}%</span>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-3">
          {take.videoUrl && (
            <>
              <video src={take.videoUrl} controls playsInline className="aspect-video w-full rounded-lg bg-black" />
              <a href={take.videoUrl} download={`hirevue-${q.id}.${ext}`} className="inline-flex items-center gap-1.5 text-xs text-accent hover:underline">
                <Download size={13} /> Download recording
              </a>
            </>
          )}
          <label className="block text-xs font-medium uppercase tracking-wide text-muted">
            Transcript {take.transcript ? '(edit if the recognition was off)' : '(type roughly what you said)'}
            <textarea
              rows={6}
              disabled={locked}
              value={review.transcript}
              onChange={(e) => onChange({ transcript: e.target.value, hits: matchRubric(q.rubric, e.target.value) })}
              className="mt-1 w-full rounded-lg border border-line bg-sunk p-2.5 text-sm font-normal normal-case tracking-normal text-ink"
            />
          </label>
          <dl className="grid grid-cols-3 gap-2 text-center text-xs">
            <Stat label="Words" value={String(stats.words)} />
            <Stat
              label="Pace"
              value={stats.wpm === null ? '—' : `${stats.wpm} wpm`}
              tone={stats.pace === 'good' ? 'ok' : stats.pace ? 'warn' : undefined}
              hint={`${PACE.slowBelow}–${PACE.fastAbove} is comfortable`}
            />
            <Stat label="Fillers" value={String(stats.fillerCount)} tone={stats.fillerRate > 3 ? 'warn' : 'ok'} hint={stats.fillers.map((f) => `${f.phrase} ×${f.count}`).join(', ') || 'none'} />
          </dl>
          {stats.timeUsed < 0.5 && take.durationSec > 0 && (
            <p className="text-xs text-warn">You used under half the time; most strong answers use 60–90% of it.</p>
          )}
        </div>

        <div className="space-y-4">
          <Checklist
            title="Content (pre-ticked from your transcript)"
            items={q.rubric.map((p) => ({ id: p.id, label: p.point }))}
            checked={review.hits}
            locked={locked}
            onToggle={(id) => onChange({ hits: toggle(review.hits, id) })}
          />
          <Checklist
            title="Delivery (your honest call)"
            items={DELIVERY_CHECKS.map((c) => ({ id: c.id, label: c.label }))}
            checked={review.delivery}
            locked={locked}
            onToggle={(id) => onChange({ delivery: toggle(review.delivery, id) })}
          />
          <details className="text-sm">
            <summary className="cursor-pointer text-accent">Answer outline and tips</summary>
            <p className="mt-2 rounded-lg border border-accent/30 bg-accent-soft/40 p-3 leading-relaxed">{q.modelAnswer}</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-muted">
              {q.tips.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </details>
        </div>
      </div>
    </Card>
  );
}

function Stat({ label, value, tone, hint }: { label: string; value: string; tone?: 'ok' | 'warn'; hint?: string }) {
  return (
    <div className="rounded-lg bg-sunk p-2" title={hint}>
      <dt className="text-faint">{label}</dt>
      <dd className={cx('mt-0.5 font-semibold tabular', tone === 'ok' && 'text-ok', tone === 'warn' && 'text-warn')}>{value}</dd>
    </div>
  );
}

function Checklist({
  title,
  items,
  checked,
  locked,
  onToggle,
}: {
  title: string;
  items: { id: string; label: string }[];
  checked: string[];
  locked: boolean;
  onToggle: (id: string) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted">{title}</legend>
      <ul className="space-y-1">
        {items.map((it) => (
          <li key={it.id}>
            <label className="flex items-start gap-2 text-sm">
              <input type="checkbox" className="mt-1" disabled={locked} checked={checked.includes(it.id)} onChange={() => onToggle(it.id)} />
              <span className={checked.includes(it.id) ? '' : 'text-muted'}>{it.label}</span>
            </label>
          </li>
        ))}
      </ul>
    </fieldset>
  );
}
