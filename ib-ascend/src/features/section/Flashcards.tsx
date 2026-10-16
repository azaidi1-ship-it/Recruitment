import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { ArrowLeft, ArrowRight, Repeat, RotateCcw, Shuffle } from 'lucide-react';
import { db } from '../../db/db';
import { getFlashcardDeck } from '../../content/registry';
import { buildQueue, isNewFlashcard } from '../../engine/srs';
import { enrolSectionDeck } from '../../services/cards';
import { refreshDerived } from '../../services/progression';
import { toLocalDate } from '../../lib/dates';
import { mulberry32, shuffle } from '../../lib/random';
import { Button, Card } from '../../components/ui';
import { useSection } from './useSection';

/**
 * Browse the section deck (authored cards + every formula callout). The deck
 * joins the spaced-repetition queue when you start the section (or on demand
 * here); browsing doesn't affect scheduling.
 */
export function Flashcards() {
  const ctx = useSection();
  const base = useMemo(() => (ctx ? getFlashcardDeck(ctx.section.id) : []), [ctx?.section.id]);
  const [deck, setDeck] = useState(base);
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const sectionId = ctx?.section.id;
  const srs = useLiveQuery(async () => {
    if (!sectionId) return null;
    const all = await db.cards.toArray();
    const own = all.filter((c) => c.sectionId === sectionId);
    const q = buildQueue(all, toLocalDate(), { sectionId });
    return {
      enrolled: own.some((c) => c.source === 'flashcard'),
      learned: own.filter((c) => c.source === 'flashcard' && !isNewFlashcard(c)).length,
      queued: q.due.length + q.fresh.length,
    };
  }, [sectionId]);
  if (!ctx) return null;
  const card = deck[i];
  if (!card) return <p className="text-sm text-muted">No flashcards yet.</p>;

  const go = (d: number) => {
    setFlipped(false);
    setI((i + d + deck.length) % deck.length);
  };

  return (
    <div className="mx-auto max-w-xl">
      {srs && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line bg-sunk px-3 py-2.5 text-sm">
          <span className="flex items-center gap-2 text-muted">
            <Repeat size={15} className="text-accent" />
            {srs.enrolled
              ? `In your review queue: ${srs.learned} of ${base.length} learned, ${srs.queued} to review today.`
              : 'This deck isn’t in your review queue yet.'}
          </span>
          {srs.enrolled ? (
            <Link to={`/review?section=${ctx.section.id}`} className="text-accent hover:underline">
              Review this deck →
            </Link>
          ) : (
            <Button
              variant="primary"
              onClick={async () => {
                await enrolSectionDeck(ctx.section.id);
                await refreshDerived();
              }}
            >
              Add to review queue
            </Button>
          )}
        </div>
      )}
      <p className="mb-3 text-sm text-muted">
        Card {i + 1} of {deck.length}. Browse and self-test here; grading happens in Review.
      </p>
      <button
        type="button"
        onClick={() => setFlipped(!flipped)}
        className="block w-full text-left"
        aria-label={flipped ? 'Show question' : 'Show answer'}
      >
        <Card className="grid min-h-56 place-items-center text-center transition hover:border-faint">
          <div>
            <p className="mb-3 text-xs uppercase tracking-widest text-faint">{flipped ? 'Answer' : 'Question'}</p>
            <p className={flipped ? 'whitespace-pre-line text-base leading-relaxed' : 'text-lg font-medium'}>{flipped ? card.back : card.front}</p>
            {!flipped && <p className="mt-4 text-xs text-faint">Tap to flip</p>}
          </div>
        </Card>
      </button>
      <div className="mt-4 flex flex-wrap justify-between gap-2">
        <Button onClick={() => go(-1)}>
          <ArrowLeft size={16} /> Prev
        </Button>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            onClick={() => {
              setDeck(shuffle(base, mulberry32(Date.now())));
              setI(0);
              setFlipped(false);
            }}
          >
            <Shuffle size={16} /> Shuffle
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              setDeck(base);
              setI(0);
              setFlipped(false);
            }}
          >
            <RotateCcw size={16} /> Reset
          </Button>
        </div>
        <Button onClick={() => go(1)}>
          Next <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
}
