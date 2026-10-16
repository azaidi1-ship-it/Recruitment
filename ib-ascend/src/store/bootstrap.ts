import { ensureSeeded } from '../db/seed';
import { useProfileStore } from './useProfileStore';
import { useProgressStore } from './useProgressStore';
import { useSettingsStore } from './useSettingsStore';

/** Seed missing rows, then load every store from IndexedDB. Run on launch and after import/reset. */
export async function hydrateAll(): Promise<void> {
  await ensureSeeded();
  await Promise.all([
    useProfileStore.getState().load(),
    useSettingsStore.getState().load(),
    useProgressStore.getState().load(),
  ]);
}
