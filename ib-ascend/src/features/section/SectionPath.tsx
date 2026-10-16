import { Link } from 'react-router-dom';
import { BookOpen, CheckCircle2, Circle, Lock, Swords, Target, ClipboardCheck, Lightbulb, SkipForward } from 'lucide-react';
import type { ComponentType } from 'react';
import type { StepState } from '../../engine/unlocks';
import { UNLOCK } from '../../config/gameConfig';
import type { SectionStep } from '../../types/models';
import { Badge, Card, cx } from '../../components/ui';
import { useSection } from './useSection';

interface StepDef {
  step: SectionStep;
  title: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  to: string;
  describe: (c: NonNullable<ReturnType<typeof useSection>>) => string;
}

const STEPS: StepDef[] = [
  {
    step: 'preQuiz',
    title: 'Pre-quiz (diagnostic)',
    icon: Target,
    to: 'quiz/pre',
    describe: ({ progress }) =>
      progress.preQuizScore === null
        ? 'A short diagnostic sets your starting mastery. Score 90%+ to fast-track to the post-quiz.'
        : `Best score ${pct(progress.preQuizScore)}${progress.fastTracked ? ' · fast-tracked' : ''}.`,
  },
  {
    step: 'reading',
    title: 'Reading',
    icon: BookOpen,
    to: 'read',
    describe: ({ progress, content }) => `${progress.lessonsRead.length} of ${content.lessons.length} chapters read.`,
  },
  {
    step: 'examples',
    title: 'Worked examples',
    icon: Lightbulb,
    to: 'examples',
    describe: ({ progress, content }) => `${progress.examplesCompleted.length} of ${content.examples.length} examples worked through.`,
  },
  {
    step: 'postQuiz',
    title: 'Post-reading quiz',
    icon: ClipboardCheck,
    to: 'quiz/post',
    describe: ({ progress }) =>
      `Mixed formats. ${pct(UNLOCK.postQuizPass)} unlocks the Boss Fight.${progress.postQuizBest !== null ? ` Best ${pct(progress.postQuizBest)}.` : ''}`,
  },
  {
    step: 'mock',
    title: 'Boss Fight (mock interview)',
    icon: Swords,
    to: 'quiz/mock',
    describe: ({ progress }) =>
      `Timed, interview-style, with follow-ups. Different every time.${progress.mockBest !== null ? ` Best ${pct(progress.mockBest)}.` : ''}`,
  },
];

function pct(x: number) {
  return `${Math.round(x * 100)}%`;
}

const STATE_LABEL: Record<StepState, string> = { locked: 'Locked', available: 'Up next', done: 'Done', skipped: 'Optional' };

export function SectionPath() {
  const ctx = useSection();
  if (!ctx) return null;
  const firstAvailable = STEPS.find((s) => ctx.steps[s.step] === 'available')?.step;

  return (
    <ol className="space-y-3">
      {STEPS.map((s, i) => {
        const state = ctx.steps[s.step];
        const Icon = s.icon;
        const StateIcon = state === 'done' ? CheckCircle2 : state === 'locked' ? Lock : state === 'skipped' ? SkipForward : Circle;
        const clickable = state !== 'locked';
        const body = (
          <Card className={cx('flex items-start gap-4 transition', clickable ? 'hover:border-faint' : 'opacity-55', firstAvailable === s.step && 'border-accent/60')}>
            <span className={cx('grid size-10 shrink-0 place-items-center rounded-lg border', state === 'done' ? 'border-ok/40 bg-ok-soft text-ok' : 'border-line bg-sunk text-accent')}>
              <Icon size={18} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-faint tabular">Step {i + 1}</span>
                <h2 className="font-semibold">{s.title}</h2>
              </div>
              <p className="mt-0.5 text-sm text-muted">{s.describe(ctx)}</p>
            </div>
            <span className="flex items-center gap-1.5 text-xs text-muted">
              <StateIcon size={15} className={state === 'done' ? 'text-ok' : undefined} />
              {firstAvailable === s.step ? <Badge tone="accent">Up next</Badge> : STATE_LABEL[state]}
            </span>
          </Card>
        );
        return <li key={s.step}>{clickable ? <Link to={`/section/${ctx.section.id}/${s.to}`}>{body}</Link> : body}</li>;
      })}
    </ol>
  );
}
