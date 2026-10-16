import { create } from 'zustand';
import { db } from '../db/db';
import { defaultProfile } from '../db/defaults';
import type { UserProfile } from '../types/models';

interface ProfileState {
  profile: UserProfile;
  load: () => Promise<void>;
  update: (patch: Partial<Omit<UserProfile, 'id'>>) => Promise<void>;
  // TODO(Phase 2): awardXp, level/rank derivation, streak tick, achievements.
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: defaultProfile(),
  load: async () => {
    const p = await db.profile.get('me');
    if (p) set({ profile: p });
  },
  update: async (patch) => {
    const next = { ...get().profile, ...patch };
    set({ profile: next });
    await db.profile.put(next);
  },
}));
