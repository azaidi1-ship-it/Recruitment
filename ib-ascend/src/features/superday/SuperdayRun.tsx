import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, CornerDownRight, Mic, Swords, Timer, Zap } from 'lucide-react';
import type { Persona } from '../../content/superday/personas';
import { grade as gradeQuestion, type GradeResult } from '../../engine/grading';
import { timeBudgetSec } from '../../engine/quiz/builder';
import type { SuperdayAnswer, SuperdayItem, SuperdayRound } from '../../engine/superday';
import { answerQuestion } from '../../services/progression';
import { newId } from '../../lib/id';
import { DIFFICULTY_LABEL } from '../../types/models';
import type { QuestionResponse } from '../../types/questions';
import { Badge, Button, Card, cx } from '../../components/ui';
import { ProgressBar } from '../../components/Progress';
import { QuestionView } from '../questions/QuestionView';
import { confirmAction } from '../../lib/confirm';

export interface SuperdayLogEntry {
  item: SuperdayItem;
  round: number;
  response: QuestionResponse | null;
  grade: GradeResult;
}

interface Props {
  persona: Persona;
  rounds: SuperdayRound[];
  onFinish: (answers: SuperdayAnswer[], log: SuperdayLogEntry[]) => void;
  onAbandon: () => void;
}

const KIND_LABEL = { technical: 'Technical', behavioral: 'Behavioral', mixed: 'Mixed' } as const;

/**
 * Back-to-back timed rounds. No feedback and no going back; when a round's
 * clock runs out, its unanswered questions score zero and the next round
 * starts after a short break screen.
 */
export function SuperdayRun({ persona, rounds, onFinish, onAbandon }: Props) {
  const [sessionId] = useState(() => newId('ses'));
  const [roundIdx, setRoundIdx] = useState(0);
  const [phase, setPhase] = useState<'intro' | 'active' | 'break'>('intro');
  const [qIdx, setQIdx] = useState(0);
  const [busy, setBusy] = useState(false);
  const answers = useRef<SuperdayAnswer[]>([]);
  const log = useRef<SuperdayLogEntry[]>([]);
  const qStart = useRef(Date.now());
  const roundClosed = useRef(false);

  const round = rounds[roundIdx]!;
  const item = round.items[qIdx];

  const closeRound = useCallback(() => {
    if (roundClosed.current) return;
    roundClosed.current = true;
    const done = new Set(answers.current.filter((a) => a.round === round.index).map((a) => a.questionId));
    for (const it of round.items) {
      if (done.has(it.question.id)) continue;
      answers.current.push({
        questionId: it.question.id,
        round: round.index,
        kind: it.kind,
        type: it.question.type,
        score: 0,
        timeMs: null,
        budgetMs: timeBudgetSec(it.question) * 1000,
      });
      log.current.push({ item: it, round: round.index, response: null, grade: { correct: false, score: 0 } });
    }
    if (roundIdx + 1 >= rounds.length) onFinish(answers.current, log.current);
    else setPhase('break');
  }, [round, roundIdx, rounds.length, onFinish]);

  async function submit(response: QuestionResponse) {
    if (!item || busy) return;
    setBusy(true);
    const elapsed = Date.now() - qStart.current;
    const g = gradeQuestion(item.question, response, elapsed);
    await answerQuestion({
      questionId: item.question.id,
      sectionId: item.question.sectionId,
      subtopic: item.question.subtopic,
      difficulty: item.question.difficulty,
      mode: 'superday',
      sessionId,
      response,
      correct: g.correct,
      score: g.score,
      timeMs: elapsed,
    });
    if (roundClosed.current) return; // the clock ran out while saving
    answers.current.push({
      questionId: item.question.id,
      round: round.index,
      kind: item.kind,
      type: item.question.type,
      score: g.score,
      timeMs: elapsed,
      budgetMs: timeBudgetSec(item.question) * 1000,
    });
    log.current.push({ item, round: round.index, response, grade: g });
    setBusy(false);
    if (qIdx + 1 >= round.items.length) closeRound();
    else {
      setQIdx(qIdx + 1);
      qStart.current = Date.now();
    }
  }

  function startRound() {
    roundClosed.current = false;
    setQIdx(0);
    setPhase('active');
    setBusy(false);
    qStart.current = Date.now();
  }

  if (phase === 'intro' || phase === 'break') {
    const next = phase === 'break' ? rounds[roundIdx + 1]! : round;
    return (
      <div className="mx-auto max-w-xl">
        <Card className="text-center">
          <Swords size={30} className="mx-auto mb-3 text-accent" />
          {phase === 'break' && <p className="mb-1 text-sm text-ok">Round {roundIdx + 1} complete.</p>}
          <p className="text-xs uppercase tracking-widest text-faint">
            Round {next.index + 1} of {rounds.length}
          </p>
          <h2 className="mt-1 text-xl font-semibold">
            {KIND_LABEL[next.kind]} · {next.minutes} minutes
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm italic text-muted">“{persona.openers[next.kind]}”</p>
          <p className="mt-1 text-xs text-faint">
            {persona.title} interviewer ({persona.style})
          </p>
          <div className="mt-5 flex justify-center gap-2">
            <Button
              variant="primary"
              autoFocus
              onClick={() => {
                if (phase === 'break') setRoundIdx(roundIdx + 1);
                startRound();
              }}
            >
              Start round {next.index + 1} <ArrowRight size={16} />
            </Button>
            <Button variant="ghost" onClick={async () => { if (await confirmAction('Leave this Superday? It won’t be scored.')) onAbandon(); }}>
              Leave
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!item) return null;
  const q = item.question;
  const lead = item.followUpOf ? round.items.find((i) => i.question.id === item.followUpOf)?.question : null;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-accent">
            Superday · Round {round.index + 1} of {rounds.length} · {KIND_LABEL[round.kind]}
          </p>
          <p className="text-sm text-muted tabular">
            Question {qIdx + 1} of {round.items.length}
          </p>
        </div>
        <RoundTimer key={round.index} seconds={round.minutes * 60} onExpire={closeRound} />
      </div>
      <ProgressBar value={qIdx / round.items.length} className="mb-5" label="Round progress" />
      <Card>
        {(lead || item.probe) && (
          <p className={cx('mb-3 flex items-start gap-2 rounded-md px-3 py-2 text-xs', item.curveball ? 'bg-warn-soft text-warn' : 'bg-sunk text-muted')}>
            {item.curveball ? <Zap size={14} className="mt-0.5 shrink-0" /> : item.probe ? <Mic size={14} className="mt-0.5 shrink-0 text-accent" /> : <CornerDownRight size={14} className="mt-0.5 shrink-0 text-accent" />}
            <span>
              <span className="font-semibold">{item.curveball ? 'Curveball.' : item.probe ? 'Resume probe.' : 'Follow-up.'}</span>
              {lead && <> Building on: “{lead.prompt}”</>}
            </span>
          </p>
        )}
        <div className="mb-3 flex flex-wrap gap-1.5">
          <Badge tone={q.difficulty === 'elite' ? 'accent' : 'neutral'}>{DIFFICULTY_LABEL[q.difficulty]}</Badge>
          <Badge>{item.kind === 'technical' ? 'Technical' : 'Behavioral'}</Badge>
        </div>
        <h2 className="mb-4 text-lg font-medium leading-snug">{q.prompt}</h2>
        <QuestionView key={`${round.index}-${q.id}`} question={q} submitted={null} reveal={false} onSubmit={(r) => void submit(r)} />
        {busy && <p className="mt-3 text-xs text-muted">Saving…</p>}
      </Card>
      <p className="mt-3 text-center text-xs text-faint">No feedback until the end of the day, and no going back.</p>
    </div>
  );
}

function RoundTimer({ seconds, onExpire }: { seconds: number; onExpire: () => void }) {
  const [left, setLeft] = useState(seconds);
  const expire = useRef(onExpire);
  expire.current = onExpire;
  useEffect(() => {
    const end = Date.now() + seconds * 1000;
    const t = setInterval(() => {
      const r = Math.max(0, Math.round((end - Date.now()) / 1000));
      setLeft(r);
      if (r <= 0) {
        clearInterval(t);
        expire.current();
      }
    }, 250);
    return () => clearInterval(t);
  }, [seconds]);
  const m = Math.floor(left / 60);
  const s = String(left % 60).padStart(2, '0');
  return (
    <span
      className={cx('flex items-center gap-1.5 rounded-md border px-2 py-1 text-sm font-semibold tabular', left < 120 ? 'border-bad/50 text-bad' : 'border-line')}
      role="timer"
      aria-label={`${m} minutes ${s} seconds left in this round`}
    >
      <Timer size={14} /> {m}:{s}
    </span>
  );
}
