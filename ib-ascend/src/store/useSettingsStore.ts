import { create } from 'zustand';
import { db } from '../db/db';
import { defaultSettings } from '../db/defaults';
import type { Settings } from '../types/models';

interface SettingsState {
  settings: Settings;
  load: () => Promise<void>;
  update: (patch: Partial<Omit<Settings, 'id'>>) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: defaultSettings(),
  load: async () => {
    const s = await db.settings.get('settings');
    if (s) set({ settings: { ...defaultSettings(), ...s } });
  },
  update: async (patch) => {
    const next = { ...get().settings, ...patch };
    set({ settings: next });
    await db.settings.put(next);
  },
}));

export function hasLlmKey(settings: Settings): boolean {
  return settings.llmApiKey.trim().length > 0;
}
