import { ensureSeeded } from '../db/seed';
import { ensureDailyQuests, refreshDerived } from '../services/progression';
import { useGameStore } from './useGameStore';
import { useProfileStore } from './useProfileStore';
import { useProgressStore } from './useProgressStore';
import { useSettingsStore } from './useSettingsStore';

/**
 * Seed missing rows, load every store from IndexedDB, compute derived game
 * state and make sure today's quests exist. Run on launch and after
 * import/reset.
 */
export async function hydrateAll(now: Date = new Date()): Promise<void> {
  await ensureSeeded();
  await Promise.all([
    useProfileStore.getState().load(),
    useSettingsStore.getState().load(),
    useProgressStore.getState().load(),
  ]);
  useGameStore.setState({ snapshot: null });
  await refreshDerived(now);
  await ensureDailyQuests(now);
}
