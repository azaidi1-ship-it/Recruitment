import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Layers, MessageSquareQuote, RotateCcw, XCircle } from 'lucide-react';
import { db } from '../../db/db';
import { getFlashcard, getQuestion } from '../../content/registry';
import { SECTIONS } from '../../content/sections';
import { grade as gradeQuestion, type GradeResult } from '../../engine/grading';
import { previewInterval } from '../../engine/srs';
import { SRS, type ReviewButton } from '../../config/gameConfig';
import { answerQuestion, reviewCard } from '../../services/progression';
import { newId } from '../../lib/id';
import { toLocalDate } from '../../lib/dates';
import type { Card as SrsCard, Flashcard, SectionId, Story } from '../../types/models';
import type { Question, QuestionResponse } from '../../types/questions';
import { Badge, Button, Card, cx } from '../../components/ui';
import { ProgressBar } from '../../components/Progress';
import { QuestionView } from '../questions/QuestionView';
import { Feedback } from '../questions/Feedback';

const SECTION_TITLE = Object.fromEntries(SECTIONS.map((s) => [s.id, s.shortTitle])) as Record<SectionId, string>;
const BUTTONS: { key: ReviewButton; label: string; tone: string }[] = [
  { key: 'again', label: 'Again', tone: 'border-bad/40 text-bad hover:bg-bad-soft' },
  { key: 'hard', label: 'Hard', tone: 'border-warn/40 text-warn hover:bg-warn-soft' },
  { key: 'good', label: 'Good', tone: 'border-ok/40 text-ok hover:bg-ok-soft' },
  { key: 'easy', label: 'Easy', tone: 'border-info/40 text-info hover:bg-info-soft' },
];

type Loaded =
  | { kind: 'flashcard'; card: SrsCard; flashcard: Flashcard }
  | { kind: 'question'; card: SrsCard; question: Question }
  | { kind: 'story'; card: SrsCard; story: Story };

interface Tally {
  reviewed: number;
  recalled: number;
  xp: number;
}

/**
 * Works through a fixed list of cards. Flashcards and stories are self-graded
 * with the four SM-2 buttons; missed questions are answered again for real,
 * and only a correct answer can be marked Hard / Good / Easy.
 */
export function ReviewSession({ cardIds, onExit }: { cardIds: string[]; onExit: () => void }) {
  const [sessionId] = useState(() => newId('ses'));
  const [index, setIndex] = useState(0);
  const [item, setItem] = useState<Loaded | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [answered, setAnswered] = useState<{ response: QuestionResponse; grade: GradeResult; xp: number } | null>(null);
  const [busy, setBusy] = useState(false);
  const [tally, setTally] = useState<Tally>({ reviewed: 0, recalled: 0, xp: 0 });
  const started = useRef(Date.now());
  const done = index >= cardIds.length;

  // Load the current card's content; drop cards whose content no longer exists.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      for (let i = index; i < cardIds.length; i++) {
        const loaded = await load(cardIds[i]!);
        if (cancelled) return;
        if (loaded) {
          if (i !== index) setIndex(i);
          setItem(loaded);
          setRevealed(false);
          setAnswered(null);
          started.current = Date.now();
          return;
        }
        await db.cards.delete(cardIds[i]!);
      }
      if (!cancelled) {
        setItem(null);
        setIndex(cardIds.length);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [index, cardIds]);

  const rate = useCallback(
    async (button: ReviewButton) => {
      if (!item || busy) return;
      setBusy(true);
      const quality = SRS.quality[button];
      const r = await reviewCard(item.card.id, quality);
      setTally((t) => ({ reviewed: t.reviewed + 1, recalled: t.recalled + (quality >= 3 ? 1 : 0), xp: t.xp + r.xp }));
      setBusy(false);
      setIndex((i) => i + 1);
    },
    [item, busy],
  );

  async function submitAnswer(response: QuestionResponse) {
    if (!item || item.kind !== 'question' || busy || answered) return;
    setBusy(true);
    const q = item.question;
    const elapsed = Date.now() - started.current;
    const g = gradeQuestion(q, response, elapsed);
    const res = await answerQuestion({
      questionId: q.id,
      sectionId: item.card.sectionId ?? q.sectionId,
      subtopic: q.subtopic,
      difficulty: q.difficulty,
      mode: 'review',
      sessionId,
      response,
      correct: g.correct,
      score: g.score,
      timeMs: elapsed,
    });
    setTally((t) => ({ ...t, xp: t.xp + res.xp.xp }));
    setAnswered({ response, grade: g, xp: res.xp.xp });
    setBusy(false);
  }

  // Keyboard: space/enter reveals, 1–4 grade (self-graded cards only).
  useEffect(() => {
    if (!item || item.kind === 'question') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && e.target.closest('input, textarea, select')) return;
      if (!revealed && (e.key === ' ' || e.key === 'Enter')) {
        e.preventDefault();
        setRevealed(true);
      } else if (revealed && ['1', '2', '3', '4'].includes(e.key)) {
        void rate(BUTTONS[Number(e.key) - 1]!.key);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [item, revealed, rate]);

  if (done) return <Summary tally={tally} onExit={onExit} />;
  if (!item) return null;

  const today = toLocalDate();
  const intervals = Object.fromEntries(BUTTONS.map((b) => [b.key, previewInterval(item.card, SRS.quality[b.key], today)])) as Record<ReviewButton, number>;
  const section = item.card.sectionId ? SECTION_TITLE[item.card.sectionId] : null;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-accent">Review</p>
          <p className="text-sm text-muted tabular">
            Card {index + 1} of {cardIds.length}
          </p>
        </div>
        <Button variant="ghost" onClick={onExit}>
          Finish later
        </Button>
      </div>
      <ProgressBar value={index / cardIds.length} className="mb-5" label="Review progress" />

      <Card>
        <div className="mb-3 flex flex-wrap gap-1.5">
          <Badge tone={item.kind === 'question' ? 'bad' : item.kind === 'story' ? 'info' : 'neutral'}>
            {item.kind === 'question' ? 'Missed question' : item.kind === 'story' ? 'Story' : item.card.lastReviewedAt ? 'Flashcard' : 'New flashcard'}
          </Badge>
          {section && <Badge>{section}</Badge>}
          {item.card.lapses > 0 && <Badge tone="warn">Lapsed {item.card.lapses}×</Badge>}
        </div>

        {item.kind === 'flashcard' && (
          <SelfGraded
            front={<p className="text-lg font-medium">{item.flashcard.front}</p>}
            back={<p className="whitespace-pre-line leading-relaxed">{item.flashcard.back}</p>}
            revealed={revealed}
            onReveal={() => setRevealed(true)}
          />
        )}

        {item.kind === 'story' && (
          <SelfGraded
            front={
              <div>
                <p className="flex items-center gap-2 text-lg font-medium">
                  <MessageSquareQuote size={18} className="text-info" /> {item.story.title}
                </p>
                <p className="mt-2 text-sm text-muted">Tell this story out loud in 60–90 seconds, then compare it with your saved version.</p>
              </div>
            }
            back={<p className="whitespace-pre-line leading-relaxed">{item.story.spoken || item.story.short}</p>}
            revealed={revealed}
            onReveal={() => setRevealed(true)}
          />
        )}

        {item.kind === 'question' && (
          <>
            <h2 className="mb-4 text-lg font-medium leading-snug">{item.question.prompt}</h2>
            <QuestionView key={item.card.id} question={item.question} submitted={answered} reveal onSubmit={(r) => void submitAnswer(r)} />
            {answered && item.question.type !== 'freeText' && <Feedback question={item.question} grade={answered.grade} xp={answered.xp} />}
          </>
        )}

        {(item.kind !== 'question' ? revealed : answered) && (
          <div className="mt-5 border-t border-line pt-4">
            {item.kind === 'question' && !answered!.grade.correct ? (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-muted">It comes back tomorrow.</p>
                <Button variant="primary" autoFocus disabled={busy} onClick={() => void rate('again')}>
                  Next <ArrowRight size={16} />
                </Button>
              </div>
            ) : (
              <>
                <p className="mb-2 text-xs text-muted">How well did you recall it?</p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {BUTTONS.filter((b) => item.kind !== 'question' || b.key !== 'again').map((b, i) => (
                    <button
                      key={b.key}
                      type="button"
                      disabled={busy}
                      onClick={() => void rate(b.key)}
                      className={cx('rounded-lg border px-3 py-2 text-sm font-medium transition disabled:opacity-50', b.tone)}
                    >
                      {b.label}
                      <span className="block text-[11px] font-normal text-muted tabular">
                        {formatInterval(intervals[b.key])}
                        {item.kind !== 'question' && <span className="hidden sm:inline"> · {i + 1}</span>}
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </Card>
      {item.kind !== 'question' && !revealed && <p className="mt-3 text-center text-xs text-faint">Space to reveal, then 1–4 to grade.</p>}
    </div>
  );
}

function SelfGraded({ front, back, revealed, onReveal }: { front: ReactNode; back: ReactNode; revealed: boolean; onReveal: () => void }) {
  return (
    <div>
      <div className="min-h-24">{front}</div>
      {revealed ? (
        <div className="mt-4 rounded-lg border border-line bg-sunk p-4 text-sm">{back}</div>
      ) : (
        <Button className="mt-4" onClick={onReveal} autoFocus>
          Show answer
        </Button>
      )}
    </div>
  );
}

function Summary({ tally, onExit }: { tally: Tally; onExit: () => void }) {
  const pct = tally.reviewed ? Math.round((tally.recalled / tally.reviewed) * 100) : 0;
  return (
    <div className="mx-auto max-w-md text-center">
      <Card>
        <CheckCircle2 size={36} className="mx-auto mb-3 text-ok" />
        <h1 className="text-xl font-semibold">Review done</h1>
        <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
          <div>
            <p className="text-2xl font-semibold tabular">{tally.reviewed}</p>
            <p className="text-xs text-muted">reviewed</p>
          </div>
          <div>
            <p className="text-2xl font-semibold tabular">{pct}%</p>
            <p className="text-xs text-muted">recalled</p>
          </div>
          <div>
            <p className="text-2xl font-semibold tabular text-accent">+{tally.xp}</p>
            <p className="text-xs text-muted">XP</p>
          </div>
        </div>
        {tally.reviewed > 0 && tally.recalled < tally.reviewed && (
          <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted">
            <XCircle size={13} /> Missed cards come back tomorrow.
          </p>
        )}
        <div className="mt-5 flex justify-center gap-2">
          <Button variant="primary" onClick={onExit}>
            <RotateCcw size={16} /> Back to review
          </Button>
          <Link to="/">
            <Button>
              <Layers size={16} /> Dashboard
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}

async function load(id: string): Promise<Loaded | null> {
  const card = await db.cards.get(id);
  if (!card) return null;
  if (card.source === 'flashcard') {
    const flashcard = getFlashcard(card.sourceId);
    return flashcard ? { kind: 'flashcard', card, flashcard } : null;
  }
  if (card.source === 'question') {
    const question = getQuestion(card.sourceId);
    return question ? { kind: 'question', card, question } : null;
  }
  const story = await db.stories.get(card.sourceId);
  return story ? { kind: 'story', card, story } : null;
}

function formatInterval(days: number): string {
  if (days < 30) return `${days}d`;
  if (days < 365) return `${Math.round(days / 30)}mo`;
  return `${(days / 365).toFixed(1)}y`;
}
