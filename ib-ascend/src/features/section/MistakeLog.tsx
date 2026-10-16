import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { Repeat } from 'lucide-react';
import { db } from '../../db/db';
import { getQuestion } from '../../content/registry';
import { correctAnswerText, responseText } from '../../engine/grading';
import { Badge, Card, cx } from '../../components/ui';
import { useSection } from './useSection';

/** Every wrong answer, with what you said, the right answer and why. */
export function MistakeLog() {
  const ctx = useSection();
  const [showResolved, setShowResolved] = useState(false);
  const mistakes = useLiveQuery(
    () => (ctx ? db.mistakes.where('sectionId').equals(ctx.section.id).reverse().sortBy('createdAt') : []),
    [ctx?.section.id],
    [],
  );
  if (!ctx) return null;
  const open = mistakes.filter((m) => m.resolvedAt === null);
  const list = showResolved ? mistakes : open;
  const distinctOpen = new Set(open.map((m) => m.questionId)).size;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">
          {distinctOpen} question{distinctOpen === 1 ? '' : 's'} to redo · {mistakes.length - open.length} resolved
        </p>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-muted">
            <input type="checkbox" checked={showResolved} onChange={(e) => setShowResolved(e.target.checked)} /> Show resolved
          </label>
          {distinctOpen > 0 && (
            <Link
              to={`/section/${ctx.section.id}/quiz/mistakes`}
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-3.5 py-2 text-sm font-medium text-accent-ink hover:brightness-110"
            >
              <Repeat size={16} /> Redo my mistakes
            </Link>
          )}
        </div>
      </div>
      {list.length === 0 && (
        <Card>
          <p className="text-sm text-muted">{showResolved ? 'No mistakes logged yet.' : 'No open mistakes. Nice.'}</p>
        </Card>
      )}
      {list.map((m) => {
        const q = getQuestion(m.questionId);
        if (!q) return null;
        return (
          <Card key={m.id} className={cx(m.resolvedAt && 'opacity-60')}>
            <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-faint">
              <span className="tabular">{new Date(m.createdAt).toLocaleString()}</span>
              {m.resolvedAt && <Badge tone="ok">Resolved</Badge>}
            </div>
            <p className="mb-3 font-medium">{q.prompt}</p>
            <div className="grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-wide text-faint">Your answer</p>
                <p className="whitespace-pre-wrap text-bad">{responseText(q, m.response)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-faint">Correct answer</p>
                <p className="whitespace-pre-wrap text-ok">{correctAnswerText(q)}</p>
              </div>
            </div>
            <p className="mt-3 text-sm text-muted">{q.explanation}</p>
          </Card>
        );
      })}
    </div>
  );
}
