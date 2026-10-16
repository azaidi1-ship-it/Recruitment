import { Link, useNavigate, useParams } from 'react-router-dom';
import { CheckCircle2, Clock, Timer } from 'lucide-react';
import { useState } from 'react';
import { markLessonRead } from '../../services/progression';
import { Blocks } from '../../components/Blocks';
import { Button, Card } from '../../components/ui';
import { useSection } from './useSection';

export function ReadingList() {
  const ctx = useSection();
  if (!ctx) return null;
  if (ctx.steps.reading === 'locked') return <GateNotice what="the reading" />;
  return (
    <ol className="space-y-3">
      {ctx.content.lessons.map((l) => {
        const read = ctx.progress.lessonsRead.includes(l.id);
        return (
          <li key={l.id}>
            <Link to={`/section/${ctx.section.id}/read/${l.id}`}>
              <Card className="flex items-center gap-4 transition hover:border-faint">
                <span className="text-sm text-faint tabular">Ch. {l.order}</span>
                <span className="flex-1 font-medium">{l.title}</span>
                <span className="flex items-center gap-1 text-xs text-muted">
                  <Clock size={13} /> {l.minutes} min
                </span>
                {read && <CheckCircle2 size={17} className="text-ok" aria-label="Read" />}
              </Card>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}

export function Chapter() {
  const ctx = useSection();
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [xp, setXp] = useState<number | null>(null);
  if (!ctx) return null;
  if (ctx.steps.reading === 'locked') return <GateNotice what="the reading" />;
  const lessons = ctx.content.lessons;
  const idx = lessons.findIndex((l) => l.id === lessonId);
  const lesson = lessons[idx];
  if (!lesson) return <p className="text-sm text-muted">Chapter not found.</p>;
  const read = ctx.progress.lessonsRead.includes(lesson.id);
  const next = lessons[idx + 1];

  return (
    <article className="mx-auto max-w-3xl">
      <p className="text-xs text-faint tabular">
        Chapter {lesson.order} of {lessons.length} · {lesson.minutes} min
      </p>
      <h2 className="mb-5 mt-1 text-2xl font-semibold tracking-tight">{lesson.title}</h2>
      <Blocks blocks={lesson.blocks} />
      <Card className="mt-6 border-accent/40">
        <p className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-accent">
          <Timer size={14} /> The 60-second version
        </p>
        <p className="text-sm leading-relaxed">{lesson.sixtySecond}</p>
      </Card>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        {!read ? (
          <Button
            variant="primary"
            onClick={async () => {
              setXp(await markLessonRead(ctx.section.id, lesson.id));
            }}
          >
            <CheckCircle2 size={16} /> Mark as read
          </Button>
        ) : (
          <span className="flex items-center gap-1.5 text-sm text-ok">
            <CheckCircle2 size={16} /> Read{xp ? ` · +${xp} XP` : ''}
          </span>
        )}
        {next ? (
          <Button onClick={() => navigate(`/section/${ctx.section.id}/read/${next.id}`)}>Next: {next.title}</Button>
        ) : (
          <Button onClick={() => navigate(`/section/${ctx.section.id}/examples`)}>On to worked examples</Button>
        )}
      </div>
    </article>
  );
}

export function GateNotice({ what }: { what: string }) {
  const ctx = useSection();
  return (
    <Card>
      <p className="text-sm text-muted">
        Finish the earlier steps first to open {what}.{' '}
        <Link to={`/section/${ctx?.section.id ?? ''}`} className="text-accent hover:underline">
          Back to the path
        </Link>
      </p>
    </Card>
  );
}
