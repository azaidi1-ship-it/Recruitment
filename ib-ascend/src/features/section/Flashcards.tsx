import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw, Shuffle } from 'lucide-react';
import { getFlashcardDeck } from '../../content/registry';
import { mulberry32, shuffle } from '../../lib/random';
import { Button, Card } from '../../components/ui';
import { useSection } from './useSection';

/**
 * Browse the section deck (authored cards + every formula callout).
 * TODO(Phase 7): enrol cards in SM-2 spaced repetition and the Due Today queue.
 */
export function Flashcards() {
  const ctx = useSection();
  const base = useMemo(() => (ctx ? getFlashcardDeck(ctx.section.id) : []), [ctx?.section.id]);
  const [deck, setDeck] = useState(base);
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  if (!ctx) return null;
  const card = deck[i];
  if (!card) return <p className="text-sm text-muted">No flashcards yet.</p>;

  const go = (d: number) => {
    setFlipped(false);
    setI((i + d + deck.length) % deck.length);
  };

  return (
    <div className="mx-auto max-w-xl">
      <p className="mb-3 text-sm text-muted">
        Card {i + 1} of {deck.length}. Spaced repetition scheduling arrives in Phase 7; for now, browse and self-test.
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
