import { create } from 'zustand';
import { newId } from '../lib/id';
import type { Rank } from '../engine/levels';
import type { XpLine } from '../engine/xp';

/** Celebrations and toasts produced by the progression service, consumed by overlays. */
export type UiEvent =
  | { id: string; kind: 'xp'; amount: number; reason: string; lines?: XpLine[] }
  | { id: string; kind: 'levelUp'; level: number }
  | { id: string; kind: 'rankUp'; rank: Rank; level: number }
  | { id: string; kind: 'achievement'; achievementId: string }
  | { id: string; kind: 'quest'; title: string; xp: number }
  | { id: string; kind: 'streakFreeze'; used: number };

export type UiEventInput = UiEvent extends infer E ? (E extends UiEvent ? Omit<E, 'id'> : never) : never;

interface UiEventState {
  queue: UiEvent[];
  push: (e: UiEventInput) => void;
  dismiss: (id: string) => void;
  clear: () => void;
}

/**
 * Level-ups and rank-ups are merged so a burst of XP shows one celebration:
 * a rank-up absorbs any pending level-ups, and a level-up while a rank-up is
 * pending just raises the rank-up's level.
 */
function enqueue(queue: UiEvent[], e: UiEventInput): UiEvent[] {
  const event = { ...e, id: newId('ev') } as UiEvent;
  if (event.kind === 'rankUp') {
    return [...queue.filter((q) => q.kind !== 'levelUp' && q.kind !== 'rankUp'), event];
  }
  if (event.kind === 'levelUp') {
    const pendingRank = queue.find((q) => q.kind === 'rankUp');
    if (pendingRank) {
      return queue.map((q) => (q.kind === 'rankUp' ? { ...q, level: Math.max(q.level, event.level) } : q));
    }
    return [...queue.filter((q) => q.kind !== 'levelUp'), event];
  }
  return [...queue, event];
}

export const useUiEvents = create<UiEventState>((set) => ({
  queue: [],
  push: (e) => set((s) => ({ queue: enqueue(s.queue, e) })),
  dismiss: (id) => set((s) => ({ queue: s.queue.filter((e) => e.id !== id) })),
  clear: () => set({ queue: [] }),
}));
