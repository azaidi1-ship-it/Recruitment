import { useEffect, useRef, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Gamepad2, Medal, Play, RotateCcw, SkipForward, Timer } from 'lucide-react';
import { db } from '../../db/db';
import { ARCADE_DRILLS, isCorrect, type ArcadeDrill, type ArcadeProblem } from '../../engine/arcade';
import { arcadeXp } from '../../engine/xp';
import { recordActivity } from '../../services/progression';
import { parseNumberInput } from '../../lib/numberInput';
import { mulberry32 } from '../../lib/random';
import { newId } from '../../lib/id';
import type { ArcadeScore } from '../../types/models';
import { Badge, Button, Card, PageHeader, cx } from '../../components/ui';

interface Answered {
  problem: ArcadeProblem;
  given: string | null;
  correct: boolean;
}

type Stage = { kind: 'menu' } | { kind: 'playing'; drill: ArcadeDrill } | { kind: 'done'; drill: ArcadeDrill; log: Answered[]; xp: number; rank: number };

/** Timed sprints against your own past scores. */
export function Arcade() {
  const [stage, setStage] = useState<Stage>({ kind: 'menu' });
  const scores = useLiveQuery(() => db.arcadeScores.toArray(), []);
  const byDrill = (id: string) => (scores ?? []).filter((s) => s.drillId === id).sort((a, b) => b.score - a.score || a.createdAt.localeCompare(b.createdAt));

  async function finish(drill: ArcadeDrill, log: Answered[]) {
    const correct = log.filter((a) => a.correct).length;
    const row: ArcadeScore = { id: newId('arc'), drillId: drill.id, score: correct, correct, total: log.length, durationSec: drill.seconds, createdAt: new Date().toISOString() };
    await db.arcadeScores.add(row);
    const board = [...byDrill(drill.id), row].sort((a, b) => b.score - a.score || a.createdAt.localeCompare(b.createdAt));
    const xp = await recordActivity({ kind: 'arcadeRun' }, arcadeXp(correct), 'Arcade run');
    setStage({ kind: 'done', drill, log, xp, rank: board.findIndex((r) => r.id === row.id) + 1 });
  }

  return (
    <>
      <PageHeader title="Mental Math Arcade" subtitle="Answer as many as you can before the clock runs out. Enter submits; a miss shows the shortcut and moves on." />
      {stage.kind === 'menu' && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ARCADE_DRILLS.map((d) => {
            const board = byDrill(d.id);
            return (
              <Card key={d.id} className="flex flex-col">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <h2 className="font-semibold">{d.title}</h2>
                  <Badge>{d.seconds}s</Badge>
                </div>
                <p className="flex-1 text-sm text-muted">{d.description}</p>
                <p className="mt-3 text-xs text-faint tabular">
                  {board[0] ? `Best ${board[0].score} · ${board.length} run${board.length === 1 ? '' : 's'}` : 'No runs yet'}
                </p>
                <Button variant="primary" className="mt-3" onClick={() => setStage({ kind: 'playing', drill: d })}>
                  <Play size={15} /> Play
                </Button>
              </Card>
            );
          })}
        </div>
      )}
      {stage.kind === 'playing' && <Sprint drill={stage.drill} onDone={(log) => void finish(stage.drill, log)} onQuit={() => setStage({ kind: 'menu' })} />}
      {stage.kind === 'done' && (
        <Results
          drill={stage.drill}
          log={stage.log}
          xp={stage.xp}
          rank={stage.rank}
          board={byDrill(stage.drill.id)}
          onAgain={() => setStage({ kind: 'playing', drill: stage.drill })}
          onMenu={() => setStage({ kind: 'menu' })}
        />
      )}
    </>
  );
}

function Sprint({ drill, onDone, onQuit }: { drill: ArcadeDrill; onDone: (log: Answered[]) => void; onQuit: () => void }) {
  const rng = useRef(mulberry32(Date.now() >>> 0));
  const [problem, setProblem] = useState(() => drill.generate(rng.current));
  const [text, setText] = useState('');
  const [log, setLog] = useState<Answered[]>([]);
  const [left, setLeft] = useState(drill.seconds);
  const [flash, setFlash] = useState<Answered | null>(null);
  const logRef = useRef(log);
  logRef.current = log;
  const doneRef = useRef(onDone);
  doneRef.current = onDone;
  const ended = useRef(false);

  useEffect(() => {
    const end = Date.now() + drill.seconds * 1000;
    const t = setInterval(() => {
      const s = Math.max(0, Math.ceil((end - Date.now()) / 1000));
      setLeft(s);
      if (s <= 0 && !ended.current) {
        ended.current = true;
        clearInterval(t);
        doneRef.current(logRef.current);
      }
    }, 200);
    return () => clearInterval(t);
  }, [drill.seconds]);

  const next = (given: string | null) => {
    if (ended.current) return;
    const v = given === null ? null : parseNumberInput(given);
    const entry = { problem, given, correct: v !== null && isCorrect(problem, v) };
    setLog((l) => [...l, entry]);
    setFlash(entry);
    setText('');
    setProblem(drill.generate(rng.current));
  };

  const correct = log.filter((a) => a.correct).length;
  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-4 flex items-center justify-between">
        <p className="flex items-center gap-2 text-sm text-muted">
          <Gamepad2 size={16} className="text-accent" /> {drill.title}
        </p>
        <span className={cx('flex items-center gap-1.5 rounded-md border px-2 py-1 text-lg font-semibold tabular', left <= 10 ? 'border-bad/50 text-bad' : 'border-line')} role="timer">
          <Timer size={16} /> {left}s
        </span>
      </div>
      <Card className="text-center">
        <p className="text-xs uppercase tracking-widest text-faint">Score {correct}</p>
        <p className="my-6 text-3xl font-semibold tabular sm:text-4xl">{problem.prompt}</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (text.trim()) next(text);
          }}
          className="flex justify-center gap-2"
        >
          <input
            autoFocus
            inputMode="decimal"
            aria-label="Your answer"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-40 rounded-lg border border-line bg-sunk px-3 py-2 text-center text-xl tabular outline-none focus:border-accent"
          />
          <Button type="submit" variant="primary">
            Enter
          </Button>
        </form>
        <div className="mt-3 h-5 text-sm">
          {flash &&
            (flash.correct ? (
              <span className="text-ok">✓ {flash.problem.prompt}</span>
            ) : (
              <span className="text-bad">
                ✗ {flash.problem.answer.toLocaleString('en-US')}
                {flash.problem.unit && flash.problem.unit !== '$' ? flash.problem.unit : ''} · <span className="text-muted">{flash.problem.hint}</span>
              </span>
            ))}
        </div>
      </Card>
      <div className="mt-3 flex justify-between">
        <Button variant="ghost" onClick={onQuit}>
          Quit
        </Button>
        <Button variant="ghost" onClick={() => next(null)}>
          <SkipForward size={15} /> Skip
        </Button>
      </div>
    </div>
  );
}

function Results({
  drill,
  log,
  xp,
  rank,
  board,
  onAgain,
  onMenu,
}: {
  drill: ArcadeDrill;
  log: Answered[];
  xp: number;
  rank: number;
  board: ArcadeScore[];
  onAgain: () => void;
  onMenu: () => void;
}) {
  const correct = log.filter((a) => a.correct).length;
  const missed = log.filter((a) => !a.correct);
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <p className="text-xs uppercase tracking-widest text-faint">{drill.title}</p>
        <p className="mt-2 text-5xl font-semibold tabular">{correct}</p>
        <p className="text-sm text-muted tabular">
          correct of {log.length} in {drill.seconds}s · {log.length ? Math.round((correct / log.length) * 100) : 0}% accuracy ·{' '}
          <span className="text-accent">+{xp} XP</span>
        </p>
        <p className="mt-3 flex items-center gap-1.5 text-sm">
          <Medal size={16} className={rank === 1 ? 'text-accent' : 'text-muted'} />
          {rank === 1 ? 'New personal best!' : `#${rank} of your ${board.length} runs`}
        </p>
        {missed.length > 0 && (
          <>
            <h3 className="mt-5 mb-2 text-sm font-semibold">Review your misses</h3>
            <ul className="space-y-1.5 text-sm">
              {missed.slice(0, 8).map((m, k) => (
                <li key={k} className="rounded-md bg-sunk px-3 py-1.5">
                  <span className="tabular">{m.problem.prompt}</span> = <span className="font-semibold tabular">{m.problem.answer.toLocaleString('en-US')}</span>
                  {m.given !== null && <span className="text-bad"> (you: {m.given})</span>}
                  <span className="block text-xs text-muted">{m.problem.hint}</span>
                </li>
              ))}
            </ul>
          </>
        )}
        <div className="mt-5 flex gap-2">
          <Button variant="primary" onClick={onAgain}>
            <RotateCcw size={15} /> Play again
          </Button>
          <Button onClick={onMenu}>All drills</Button>
        </div>
      </Card>
      <Card>
        <h3 className="mb-3 font-semibold">Leaderboard: you vs you</h3>
        <ol className="divide-y divide-line text-sm">
          {board.slice(0, 10).map((s, k) => (
            <li key={s.id} className={cx('grid grid-cols-[2rem_1fr_auto_auto] items-center gap-3 py-1.5 tabular', k === rank - 1 && 'text-accent')}>
              <span className="text-faint">#{k + 1}</span>
              <span className="text-muted">{new Date(s.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
              <span>{s.total ? Math.round((s.correct / s.total) * 100) : 0}%</span>
              <span className="w-8 text-right font-semibold">{s.score}</span>
            </li>
          ))}
        </ol>
      </Card>
    </div>
  );
}
