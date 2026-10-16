import type { Settings, UserProfile } from '../types/models';
import { nowIso } from '../lib/dates';

export const DEFAULT_LLM_MODEL = 'claude-sonnet-5-5';

export function defaultProfile(): UserProfile {
  return {
    id: 'me',
    displayName: 'Ameen',
    createdAt: nowIso(),
    totalXp: 0,
    streak: {
      current: 0,
      longest: 0,
      lastActiveDate: null,
      freezes: 0,
      lastFreezeGrantWeek: null,
    },
  };
}

export function defaultSettings(): Settings {
  return {
    id: 'settings',
    theme: 'dark',
    defaultTaxRate: 0.25,
    dailyGoalMinutes: 60,
    llmProvider: 'anthropic',
    llmApiKey: '',
    llmModel: DEFAULT_LLM_MODEL,
    reduceMotion: false,
  };
}
