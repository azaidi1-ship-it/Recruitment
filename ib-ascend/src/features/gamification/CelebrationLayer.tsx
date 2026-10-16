import { useEffect } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Flame, ScrollText, Snowflake, Star } from 'lucide-react';
import { ACHIEVEMENT_BY_ID } from '../../content/achievements';
import { AchievementIcon } from '../../components/AchievementIcon';
import { Button } from '../../components/ui';
import { useSettingsStore } from '../../store/useSettingsStore';
import { useUiEvents, type UiEvent } from '../../store/useUiEvents';

const TOAST_MS = 3500;

/**
 * Renders progression events: full-screen rank-ups, level-up cards and
 * toasts for XP, quests, achievements and streak freezes.
 */
export function CelebrationLayer() {
  const queue = useUiEvents((s) => s.queue);
  const dismiss = useUiEvents((s) => s.dismiss);
  const reduceSetting = useSettingsStore((s) => s.settings.reduceMotion);
  const reduceSystem = useReducedMotion();
  const reduce = reduceSetting || Boolean(reduceSystem);

  const modal = queue.find((e) => e.kind === 'rankUp' || e.kind === 'levelUp');
  const toasts = queue.filter((e) => e.kind !== 'rankUp' && e.kind !== 'levelUp').slice(0, 4);

  return (
    <>
      <AnimatePresence>
        {modal?.kind === 'rankUp' && <RankUp key={modal.id} event={modal} reduce={reduce} onClose={() => dismiss(modal.id)} />}
        {modal?.kind === 'levelUp' && <LevelUp key={modal.id} event={modal} reduce={reduce} onClose={() => dismiss(modal.id)} />}
      </AnimatePresence>
      <div className="no-print pointer-events-none fixed inset-x-4 bottom-20 z-40 flex flex-col items-end gap-2 md:bottom-6 md:left-auto md:right-6">
        <AnimatePresence initial={false}>
          {toasts.map((t) => (
            <Toast key={t.id} event={t} reduce={reduce} />
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}

function RankUp({ event, reduce, onClose }: { event: Extract<UiEvent, { kind: 'rankUp' }>; reduce: boolean; onClose: () => void }) {
  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`Promoted to ${event.rank.title}`}
      className="fixed inset-0 z-50 grid place-items-center overflow-hidden bg-bg/95 p-6 backdrop-blur"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      {!reduce && (
        <>
          {Array.from({ length: 18 }, (_, i) => (
            <motion.span
              key={i}
              className="absolute size-2 rounded-full bg-accent"
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{
                x: Math.cos((i / 18) * Math.PI * 2) * 260,
                y: Math.sin((i / 18) * Math.PI * 2) * 260,
                opacity: 0,
                scale: 0.4,
              }}
              transition={{ duration: 1.4, ease: 'easeOut', delay: 0.25 }}
            />
          ))}
          <motion.div
            className="absolute size-72 rounded-full border-2 border-accent/40"
            initial={{ scale: 0.2, opacity: 1 }}
            animate={{ scale: 2.4, opacity: 0 }}
            transition={{ duration: 1.6, ease: 'easeOut' }}
          />
        </>
      )}
      <motion.div
        className="relative text-center"
        initial={reduce ? false : { scale: 0.6, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 160, damping: 14 }}
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-accent">Promotion</p>
        <h2 className="mt-3 text-5xl font-semibold tracking-tight sm:text-7xl">{event.rank.title}</h2>
        <p className="mt-3 text-muted">You reached level {event.level}.</p>
        <Button variant="primary" className="mt-8" onClick={onClose} autoFocus>
          Continue
        </Button>
      </motion.div>
    </motion.div>
  );
}

function LevelUp({ event, reduce, onClose }: { event: Extract<UiEvent, { kind: 'levelUp' }>; reduce: boolean; onClose: () => void }) {
  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`Level ${event.level}`}
      className="fixed inset-0 z-50 grid place-items-center bg-bg/70 p-6 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="w-full max-w-xs rounded-2xl border border-accent/40 bg-surface p-6 text-center shadow-2xl"
        initial={reduce ? false : { scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 220, damping: 18 }}
        onClick={(e) => e.stopPropagation()}
      >
        <Star className="mx-auto text-accent" size={32} />
        <p className="mt-2 text-xs font-medium uppercase tracking-widest text-muted">Level up</p>
        <p className="text-5xl font-semibold tabular">{event.level}</p>
        <Button variant="primary" className="mt-5 w-full" onClick={onClose} autoFocus>
          Nice
        </Button>
      </motion.div>
    </motion.div>
  );
}

function Toast({ event, reduce }: { event: UiEvent; reduce: boolean }) {
  const dismiss = useUiEvents((s) => s.dismiss);
  const onDone = () => dismiss(event.id);
  useEffect(() => {
    const t = setTimeout(() => dismiss(event.id), TOAST_MS);
    return () => clearTimeout(t);
  }, [dismiss, event.id]);

  let icon = <Flame size={18} />;
  let title = '';
  let detail = '';
  switch (event.kind) {
    case 'xp':
      icon = <Star size={18} />;
      title = `+${event.amount} XP`;
      detail = event.reason;
      break;
    case 'quest':
      icon = <ScrollText size={18} />;
      title = `Quest complete · +${event.xp} XP`;
      detail = event.title;
      break;
    case 'achievement': {
      const a = ACHIEVEMENT_BY_ID[event.achievementId];
      icon = <AchievementIcon name={a?.icon ?? 'Trophy'} size={18} />;
      title = `Achievement: ${a?.title ?? event.achievementId}`;
      detail = a && a.xpReward > 0 ? `+${a.xpReward} XP · ${a.description}` : (a?.description ?? '');
      break;
    }
    case 'streakFreeze':
      icon = <Snowflake size={18} />;
      title = 'Streak saved';
      detail = `Used ${event.used} streak freeze${event.used === 1 ? '' : 's'}.`;
      break;
    default:
      return null;
  }

  return (
    <motion.div
      layout={!reduce}
      role="status"
      className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border border-line bg-surface p-3 shadow-xl"
      initial={reduce ? false : { opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 40 }}
      onClick={onDone}
    >
      <span className="mt-0.5 text-accent">{icon}</span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold">{title}</span>
        {detail && <span className="block truncate text-xs text-muted">{detail}</span>}
      </span>
    </motion.div>
  );
}
