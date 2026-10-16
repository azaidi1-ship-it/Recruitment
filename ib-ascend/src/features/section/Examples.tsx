import { useState } from 'react';
import { CheckCircle2, ChevronDown, Eye } from 'lucide-react';
import { markExampleCompleted } from '../../services/progression';
import { DIFFICULTY_LABEL, type WorkedExample } from '../../types/models';
import { Badge, Button, Card, cx } from '../../components/ui';
import { GateNotice } from './Reading';
import { useSection } from './useSection';

const ORDER = { basic: 0, intermediate: 1, advanced: 2, elite: 3 } as const;

export function Examples() {
  const ctx = useSection();
  const [open, setOpen] = useState<string | null>(null);
  if (!ctx) return null;
  if (ctx.steps.examples === 'locked') return <GateNotice what="the worked examples" />;
  const list = [...ctx.content.examples].sort((a, b) => ORDER[a.difficulty] - ORDER[b.difficulty]);

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted">Try each one on paper first, then reveal the solution one step at a time.</p>
      {list.map((ex, i) => (
        <ExampleCard
          key={ex.id}
          n={i + 1}
          example={ex}
          done={ctx.progress.examplesCompleted.includes(ex.id)}
          open={open === ex.id}
          onToggle={() => setOpen(open === ex.id ? null : ex.id)}
          onComplete={() => markExampleCompleted(ctx.section.id, ex.id, ex.difficulty)}
        />
      ))}
    </div>
  );
}

function ExampleCard({
  n,
  example,
  done,
  open,
  onToggle,
  onComplete,
}: {
  n: number;
  example: WorkedExample;
  done: boolean;
  open: boolean;
  onToggle: () => void;
  onComplete: () => Promise<number>;
}) {
  const [revealed, setRevealed] = useState(0);
  const [xp, setXp] = useState<number | null>(null);
  const allShown = revealed > example.steps.length;

  return (
    <Card>
      <button type="button" onClick={onToggle} className="flex w-full items-start gap-3 text-left" aria-expanded={open}>
        <span className="text-sm text-faint tabular">{n}.</span>
        <span className="flex-1">
          <span className="font-medium">{example.title}</span>
          <span className="ml-2 inline-flex gap-1.5 align-middle">
            <Badge tone={example.difficulty === 'elite' ? 'accent' : 'neutral'}>{DIFFICULTY_LABEL[example.difficulty]}</Badge>
          </span>
        </span>
        {done && <CheckCircle2 size={17} className="text-ok" aria-label="Completed" />}
        <ChevronDown size={18} className={cx('text-muted transition', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="mt-4 space-y-3 pl-6">
          <p className="rounded-lg bg-sunk p-3 text-sm leading-relaxed">{example.prompt}</p>
          <ol className="space-y-2">
            {example.steps.slice(0, revealed).map((s, i) => (
              <li key={s.title} className="rounded-lg border border-line p-3 text-sm">
                <p className="mb-0.5 text-xs font-semibold uppercase tracking-wide text-accent">
                  Step {i + 1}: {s.title}
                </p>
                <p className="leading-relaxed">{s.body}</p>
              </li>
            ))}
          </ol>
          {allShown && (
            <p className="rounded-lg border border-ok/40 bg-ok-soft/50 p-3 text-sm">
              <span className="font-semibold text-ok">Answer: </span>
              {example.answer}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-3">
            {!allShown ? (
              <Button variant="primary" onClick={() => setRevealed(revealed + 1)}>
                <Eye size={16} />
                {revealed < example.steps.length ? `Reveal step ${revealed + 1} of ${example.steps.length}` : 'Reveal answer'}
              </Button>
            ) : done ? (
              <span className="text-sm text-ok">Completed{xp ? ` · +${xp} XP` : ''}</span>
            ) : (
              <Button variant="primary" onClick={async () => setXp(await onComplete())}>
                <CheckCircle2 size={16} /> Mark complete
              </Button>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
