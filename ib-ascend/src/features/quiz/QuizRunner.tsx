import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, CornerDownRight, Timer } from 'lucide-react';
import { grade as gradeQuestion, type GradeResult } from '../../engine/grading';
import type { BuiltQuiz } from '../../engine/quiz/builder';
import { answerQuestion, completeSession, type SessionResult } from '../../services/progression';
import { newId } from '../../lib/id';
import { DIFFICULTY_LABEL, type AttemptMode, type SectionId } from '../../types/models';
import type { QuestionResponse } from '../../types/questions';
import { Badge, Button, Card, cx } from '../../components/ui';
import { ProgressBar } from '../../components/Progress';
import { QuestionView } from '../questions/QuestionView';
import { Feedback } from '../questions/Feedback';
import { QuizSummary } from './QuizSummary';

export interface QuizResult {
  questionId: string;
  response: QuestionResponse | null;
  grade: GradeResult;
  xp: number;
}

interface Props {
  title: string;
  mode: AttemptMode;
  sectionId: SectionId;
  quiz: BuiltQuiz;
  /** 'immediate' shows the answer after each question; 'end' saves feedback for the summary (diagnostics, mocks). */
  feedback: 'immediate' | 'end';
  onExit: () => void;
}

/**
 * Runs a quiz one question at a time with no going back. Every answer is
 * recorded through the progression service as it's given; the session is
 * completed (and bonuses paid) at the end or when the timer runs out.
 */
export function QuizRunner({ title, mode, sectionId, quiz, feedback, onExit }: Props) {
  const [sessionId] = useState(() => newId('ses'));
  const [startedAt] = useState(() => new Date().toISOString());
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [current, setCurrent] = useState<{ response: QuestionResponse; grade: GradeResult; xp: number } | null>(null);
  const [busy, setBusy] = useState(false);
  const [summary, setSummary] = useState<{ session: SessionResult; results: QuizResult[]; timedOut: boolean } | null>(null);
  const questionStart = useRef(Date.now());
  const finishing = useRef(false);

  const item = quiz.items[index];
  const total = quiz.items.length;

  const finish = useCallback(
    async (all: QuizResult[], timedOut: boolean) => {
      if (finishing.current) return;
      finishing.current = true;
      // Unanswered questions (timer ran out) count as zero.
      const answeredIds = new Set(all.map((r) => r.questionId));
      const padded = [
        ...all,
        ...quiz.items
          .filter((i) => !answeredIds.has(i.question.id))
          .map((i) => ({ questionId: i.question.id, response: null, grade: { correct: false, score: 0 }, xp: 0 })),
      ];
      const score = padded.length ? padded.reduce((n, r) => n + r.grade.score, 0) / padded.length : 0;
      const session = await completeSession({
        mode,
        sectionId,
        title,
        questionIds: quiz.items.map((i) => i.question.id),
        score,
        startedAt,
        meta: { timedOut, answered: all.length },
      });
      setSummary({ session, results: padded, timedOut });
    },
    [mode, sectionId, title, quiz.items, startedAt],
  );

  async function submit(response: QuestionResponse) {
    if (!item || busy || current) return;
    setBusy(true);
    const elapsed = Date.now() - questionStart.current;
    const g = gradeQuestion(item.question, response, elapsed);
    const res = await answerQuestion({
      questionId: item.question.id,
      sectionId,
      subtopic: item.question.subtopic,
      difficulty: item.question.difficulty,
      mode,
      sessionId,
      response,
      correct: g.correct,
      score: g.score,
      timeMs: elapsed,
    });
    const entry: QuizResult = { questionId: item.question.id, response, grade: g, xp: res.xp.xp };
    const nextResults = [...results, entry];
    setResults(nextResults);
    setBusy(false);
    if (feedback === 'immediate') {
      setCurrent({ response, grade: g, xp: res.xp.xp });
    } else {
      advance(nextResults);
    }
  }

  function advance(all: QuizResult[] = results) {
    setCurrent(null);
    if (index + 1 >= total) {
      void finish(all, false);
    } else {
      setIndex(index + 1);
      questionStart.current = Date.now();
    }
  }

  if (summary) {
    return <QuizSummary title={title} mode={mode} sectionId={sectionId} quiz={quiz} {...summary} onExit={onExit} />;
  }
  if (!item) return null;

  const q = item.question;
  const lead = item.followUpOf ? quiz.items.find((i) => i.question.id === item.followUpOf)?.question : null;
  const needsOwnSubmitFlow = q.type === 'freeText';

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-accent">{title}</p>
          <p className="text-sm text-muted tabular">
            Question {index + 1} of {total}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {quiz.timeLimitSec !== null && (
            <QuizTimer seconds={quiz.timeLimitSec} onExpire={() => void finish(results, true)} paused={Boolean(summary)} />
          )}
          <Button variant="ghost" onClick={() => (window.confirm('Leave this quiz? Answers so far are saved, but the quiz won’t count as finished.') ? onExit() : null)}>
            Exit
          </Button>
        </div>
      </div>
      <ProgressBar value={index / total} className="mb-5" label="Quiz progress" />

      <Card>
        {lead && (
          <p className="mb-3 flex items-start gap-2 rounded-md bg-sunk px-3 py-2 text-xs text-muted">
            <CornerDownRight size={14} className="mt-0.5 shrink-0 text-accent" />
            <span>
              <span className="font-semibold text-accent">Follow-up.</span> Building on: “{lead.prompt}”
            </span>
          </p>
        )}
        <div className="mb-3 flex flex-wrap gap-1.5">
          <Badge tone={q.difficulty === 'elite' ? 'accent' : 'neutral'}>{DIFFICULTY_LABEL[q.difficulty]}</Badge>
          <Badge>{typeLabel(q.type)}</Badge>
        </div>
        <h2 className="mb-4 text-lg font-medium leading-snug">{q.prompt}</h2>

        <QuestionView
          key={q.id}
          question={q}
          submitted={current}
          reveal={feedback === 'immediate'}
          onSubmit={(r) => void submit(r)}
        />

        {current && feedback === 'immediate' && (
          <>
            {!needsOwnSubmitFlow && <Feedback question={q} grade={current.grade} xp={current.xp} />}
            {needsOwnSubmitFlow && (
              <p className="mt-3 text-xs text-accent tabular">{current.xp > 0 ? `+${current.xp} XP` : '0 XP'}</p>
            )}
            <div className="mt-4 flex justify-end">
              <Button variant="primary" autoFocus onClick={() => advance()}>
                {index + 1 >= total ? 'See results' : 'Next question'} <ArrowRight size={16} />
              </Button>
            </div>
          </>
        )}
        {busy && <p className="mt-3 text-xs text-muted">Saving…</p>}
      </Card>
    </div>
  );
}

function typeLabel(t: string): string {
  return (
    {
      mcq: 'Multiple choice',
      numeric: 'Numeric',
      ordering: 'Ordering',
      walkthrough: 'Statement walk-through',
      freeText: 'Verbal answer',
      rapidFire: 'Rapid fire',
    } as Record<string, string>
  )[t] ?? t;
}

function QuizTimer({ seconds, onExpire, paused }: { seconds: number; onExpire: () => void; paused: boolean }) {
  const [left, setLeft] = useState(seconds);
  const expire = useRef(onExpire);
  expire.current = onExpire;

  useEffect(() => {
    if (paused) return;
    const end = Date.now() + seconds * 1000;
    const t = setInterval(() => {
      const remaining = Math.max(0, Math.round((end - Date.now()) / 1000));
      setLeft(remaining);
      if (remaining <= 0) {
        clearInterval(t);
        expire.current();
      }
    }, 250);
    return () => clearInterval(t);
  }, [seconds, paused]);

  const m = Math.floor(left / 60);
  const s = String(left % 60).padStart(2, '0');
  return (
    <span
      className={cx('flex items-center gap-1.5 rounded-md border px-2 py-1 text-sm font-semibold tabular', left < 60 ? 'border-bad/50 text-bad' : 'border-line text-ink')}
      role="timer"
      aria-label={`${m} minutes ${s} seconds left`}
    >
      <Timer size={14} /> {m}:{s}
    </span>
  );
}
