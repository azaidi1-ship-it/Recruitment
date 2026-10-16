import { useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { Clock, Crosshair, CornerDownRight, ListChecks, Swords, Target } from 'lucide-react';
import { db } from '../../db/db';
import { buildDrill, buildMistakeQuiz, buildMock, buildPostQuiz, buildPreQuiz, type BuiltQuiz } from '../../engine/quiz/builder';
import { hashString, mulberry32 } from '../../lib/random';
import { DASHBOARD, UNLOCK } from '../../config/gameConfig';
import type { AttemptMode } from '../../types/models';
import { Button, Card, PageHeader } from '../../components/ui';
import { QuizRunner } from '../quiz/QuizRunner';
import { GateNotice } from './Reading';
import { useSection, type SectionCtx } from './useSection';

type QuizMode = 'pre' | 'post' | 'mock' | 'mistakes' | 'drill';

const META: Record<QuizMode, { title: string; feedback: 'immediate' | 'end'; icon: typeof Target; rules: string[] }> = {
  pre: {
    title: 'Pre-quiz',
    feedback: 'end',
    icon: Target,
    rules: [
      'A short diagnostic across the section. No feedback until the end.',
      'Your score sets your starting mastery (half your score).',
      `Score ${Math.round(UNLOCK.fastTrack * 100)}%+ to fast-track straight to the post-quiz.`,
    ],
  },
  post: {
    title: 'Post-reading quiz',
    feedback: 'immediate',
    icon: ListChecks,
    rules: [
      'Mixed formats: multiple choice, numbers, ordering, walk-throughs, verbal answers and rapid fire.',
      'You see the answer and explanation after each question.',
      `${Math.round(UNLOCK.postQuizPass * 100)}% unlocks the Boss Fight and clears the section on the skill tree.`,
    ],
  },
  mock: {
    title: 'Boss Fight',
    feedback: 'end',
    icon: Swords,
    rules: [
      'Timed, like a real interview. When the clock hits zero, unanswered questions score zero.',
      'No going back, and no feedback until the end.',
      'Expect follow-ups that dig into your previous answer.',
      'Questions are drawn at random, so every attempt is different.',
    ],
  },
  drill: {
    title: 'Subtopic drill',
    feedback: 'immediate',
    icon: Crosshair,
    rules: [
      `Up to ${DASHBOARD.drillSize} questions from one subtopic, ones you haven’t got right yet first.`,
      'You see the answer and explanation after each question.',
      'Misses join your review queue and Mistake Log.',
    ],
  },
  mistakes: {
    title: 'Redo my mistakes',
    feedback: 'immediate',
    icon: CornerDownRight,
    rules: ['Every question you’ve missed in this section, once each.', 'Get it right and it’s cleared from your Mistake Log.'],
  },
};

/** Keyed by section and mode so moving between quizzes always starts fresh. */
export function QuizPage() {
  const { sectionId, mode } = useParams();
  const [params] = useSearchParams();
  return <QuizPageInner key={`${sectionId}-${mode}-${params.get('subtopic') ?? ''}`} />;
}

function QuizPageInner() {
  const ctx = useSection();
  const { mode: rawMode } = useParams();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const mode = (['pre', 'post', 'mock', 'mistakes', 'drill'] as const).find((m) => m === rawMode);
  const subtopic = mode === 'drill' ? ctx?.section.subtopics.find((t) => t.id === params.get('subtopic')) : undefined;
  const correctIds = useLiveQuery(
    async () =>
      mode === 'drill' && ctx
        ? new Set((await db.attempts.where('sectionId').equals(ctx.section.id).filter((a) => a.correct).toArray()).map((a) => a.questionId))
        : new Set<string>(),
    [mode, ctx?.section.id],
  );
  const openMistakeIds = useLiveQuery(
    async () =>
      ctx
        ? (await db.mistakes.where('sectionId').equals(ctx.section.id).reverse().sortBy('createdAt'))
            .filter((m) => m.resolvedAt === null)
            .map((m) => m.questionId)
        : [],
    [ctx?.section.id],
  );
  const [quiz, setQuiz] = useState<BuiltQuiz | null>(null);

  if (!ctx || !mode) return <p className="text-sm text-muted">Unknown quiz.</p>;
  if (mode === 'drill' && !subtopic) return <p className="text-sm text-muted">Unknown subtopic.</p>;
  const meta = META[mode];
  const title = subtopic ? `${meta.title}: ${subtopic.title}` : meta.title;
  const exit = () => navigate(`/section/${ctx.section.id}`);

  // Once started, a quiz runs to the end even if its gate changes underneath it
  // (e.g. Redo My Mistakes resolves the last open mistake).
  if (quiz) {
    return (
      <QuizRunner
        title={`${ctx.section.shortTitle} · ${title}`}
        mode={mode as AttemptMode}
        sectionId={ctx.section.id}
        quiz={quiz}
        feedback={meta.feedback}
        onExit={exit}
      />
    );
  }

  const gate = gateFor(mode, ctx, openMistakeIds?.length ?? 0);
  if (gate) return gate;

  const start = () => {
    const rng = mulberry32(hashString(`${ctx.section.id}-${mode}-${Date.now()}`));
    const qs = ctx.content.questions;
    const built =
      mode === 'pre'
        ? buildPreQuiz(qs, rng)
        : mode === 'post'
          ? buildPostQuiz(qs, rng)
          : mode === 'mock'
            ? buildMock(qs, rng)
            : mode === 'drill'
              ? buildDrill(qs, subtopic!.id, rng, DASHBOARD.drillSize, correctIds)
              : buildMistakeQuiz(qs, openMistakeIds ?? []);
    setQuiz(built);
  };

  const Icon = meta.icon;
  return (
    <div className="mx-auto max-w-xl">
      <PageHeader title={title} />
      <Card>
        <Icon className="mb-3 text-accent" size={28} />
        <ul className="mb-5 list-disc space-y-1.5 pl-5 text-sm text-muted">
          {meta.rules.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
        {mode === 'mock' && (
          <p className="mb-4 flex items-center gap-2 text-xs text-faint">
            <Clock size={13} /> The timer is set from the questions you draw: about 1–3 minutes each.
          </p>
        )}
        <div className="flex gap-2">
          <Button variant="primary" onClick={start}>
            Start
          </Button>
          <Button variant="ghost" onClick={exit}>
            Cancel
          </Button>
        </div>
      </Card>
    </div>
  );
}

function gateFor(mode: QuizMode, ctx: SectionCtx, openMistakes: number) {
  if (mode === 'post' && ctx.steps.postQuiz === 'locked') return <GateNotice what="the post-quiz" />;
  if (mode === 'mock' && ctx.steps.mock === 'locked') {
    return (
      <Card>
        <p className="text-sm text-muted">
          Score {Math.round(UNLOCK.postQuizPass * 100)}%+ on the post-quiz to unlock the Boss Fight.{' '}
          <Link to={`/section/${ctx.section.id}`} className="text-accent hover:underline">
            Back to the path
          </Link>
        </p>
      </Card>
    );
  }
  if (mode === 'mistakes' && openMistakes === 0) {
    return (
      <Card>
        <p className="text-sm text-muted">No open mistakes in this section.</p>
      </Card>
    );
  }
  return null;
}
