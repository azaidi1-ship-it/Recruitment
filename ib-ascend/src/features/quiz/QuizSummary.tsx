import { CheckCircle2, MinusCircle, XCircle } from 'lucide-react';
import { UNLOCK } from '../../config/gameConfig';
import { correctAnswerText, responseText } from '../../engine/grading';
import type { BuiltQuiz } from '../../engine/quiz/builder';
import type { SessionResult } from '../../services/progression';
import { SECTION_BY_ID } from '../../content/sections';
import type { AttemptMode, SectionId } from '../../types/models';
import { Button, Card, cx } from '../../components/ui';
import { ProgressBar } from '../../components/Progress';
import type { QuizResult } from './QuizRunner';

interface Props {
  title: string;
  mode: AttemptMode;
  sectionId: SectionId;
  quiz: BuiltQuiz;
  session: SessionResult;
  results: QuizResult[];
  timedOut: boolean;
  onExit: () => void;
}

export function QuizSummary({ title, mode, sectionId, quiz, session, results, timedOut, onExit }: Props) {
  const score = session.session.score ?? 0;
  const pct = Math.round(score * 100);
  const answerXp = results.reduce((n, r) => n + r.xp, 0);
  const section = SECTION_BY_ID[sectionId];
  const byId = new Map(quiz.items.map((i) => [i.question.id, i.question]));

  // Accuracy by subtopic (useful after diagnostics and mocks).
  const subtopicTitles = new Map(section.subtopics.map((s) => [s.id, s.title]));
  const bySub = new Map<string, { score: number; n: number }>();
  for (const r of results) {
    const q = byId.get(r.questionId);
    if (!q) continue;
    const agg = bySub.get(q.subtopic) ?? { score: 0, n: 0 };
    agg.score += r.grade.score;
    agg.n += 1;
    bySub.set(q.subtopic, agg);
  }

  let verdict = '';
  let tone: 'ok' | 'warn' | 'bad' = 'warn';
  if (mode === 'pre') {
    const start = Math.round(score * 50);
    verdict = session.fastTracked
      ? `90%+ on the diagnostic: you can fast-track straight to the post-quiz. Starting mastery: at least ${start}%.`
      : `Diagnostic done. Starting mastery: at least ${start}%. The reading is unlocked; focus on your weakest subtopics below.`;
    tone = session.fastTracked ? 'ok' : 'warn';
  } else if (mode === 'post') {
    const pass = score >= UNLOCK.postQuizPass - 1e-9;
    verdict = pass
      ? `Passed (80% needed).${session.newlyPassed ? ` The Boss Fight is unlocked and ${section.shortTitle} now counts as cleared for the skill tree.` : ''}`
      : `You need 80% to unlock the Boss Fight. Review your misses below and in the Mistake Log, then retake.`;
    tone = pass ? 'ok' : 'bad';
  } else if (mode === 'mock') {
    verdict = timedOut
      ? 'Time ran out. Unanswered questions count as zero, as they would in a real interview.'
      : session.bonus.personalBest
        ? 'New personal best.'
        : 'Boss Fight complete.';
    tone = pct >= 80 ? 'ok' : pct >= 60 ? 'warn' : 'bad';
  } else if (mode === 'mistakes') {
    const fixed = results.filter((r) => r.grade.correct).length;
    verdict = `${fixed} of ${results.length} mistakes fixed and cleared from your log.`;
    tone = fixed === results.length ? 'ok' : 'warn';
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <Card>
        <p className="text-xs font-medium uppercase tracking-wide text-accent">{title}</p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
          <p className="text-5xl font-semibold tabular">{pct}%</p>
          <div className="text-right text-sm text-muted tabular">
            <p>+{answerXp} XP from answers</p>
            {session.bonus.lines.map((l) => (
              <p key={l.label}>
                +{l.amount} XP · {l.label}
              </p>
            ))}
          </div>
        </div>
        <p className={cx('mt-3 text-sm', tone === 'ok' ? 'text-ok' : tone === 'bad' ? 'text-bad' : 'text-warn')}>{verdict}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="primary" onClick={onExit}>
            Back to section
          </Button>
        </div>
      </Card>

      {bySub.size > 1 && (
        <Card>
          <h3 className="mb-3 font-semibold">By subtopic</h3>
          <ul className="space-y-2">
            {[...bySub.entries()]
              .sort((a, b) => a[1].score / a[1].n - b[1].score / b[1].n)
              .map(([id, agg]) => (
                <li key={id} className="grid grid-cols-[1fr_120px_40px] items-center gap-3 text-sm">
                  <span className="text-muted">{subtopicTitles.get(id) ?? id}</span>
                  <ProgressBar value={agg.score / agg.n} />
                  <span className="text-right tabular">{Math.round((agg.score / agg.n) * 100)}%</span>
                </li>
              ))}
          </ul>
        </Card>
      )}

      <Card>
        <h3 className="mb-3 font-semibold">Review</h3>
        <ol className="space-y-3">
          {results.map((r, i) => {
            const q = byId.get(r.questionId);
            if (!q) return null;
            const Icon = r.response === null ? MinusCircle : r.grade.correct ? CheckCircle2 : XCircle;
            return (
              <li key={r.questionId} className="rounded-lg border border-line bg-sunk p-3">
                <details>
                  <summary className="flex cursor-pointer list-none items-start gap-2 text-sm">
                    <Icon
                      size={17}
                      className={cx('mt-0.5 shrink-0', r.response === null ? 'text-faint' : r.grade.correct ? 'text-ok' : 'text-bad')}
                    />
                    <span className="flex-1">
                      <span className="mr-1 text-faint tabular">{i + 1}.</span>
                      {q.prompt}
                    </span>
                    {!r.grade.correct && r.grade.score > 0 && <span className="text-xs text-warn tabular">{Math.round(r.grade.score * 100)}%</span>}
                  </summary>
                  <div className="mt-3 space-y-2 pl-6 text-sm">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-faint">Your answer</p>
                      <p className="whitespace-pre-wrap">{r.response ? responseText(q, r.response) : '(not answered)'}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-faint">Correct answer</p>
                      <p className="whitespace-pre-wrap text-ok">{correctAnswerText(q)}</p>
                    </div>
                    <p className="text-muted">{q.explanation}</p>
                  </div>
                </details>
              </li>
            );
          })}
        </ol>
      </Card>
    </div>
  );
}
