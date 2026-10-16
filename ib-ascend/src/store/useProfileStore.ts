import { create } from 'zustand';
import { db } from '../db/db';
import { defaultProfile } from '../db/defaults';
import type { UserProfile } from '../types/models';

/** Profile row (XP total, streak). XP is only ever changed by services/progression.ts. */
interface ProfileState {
  profile: UserProfile;
  load: () => Promise<void>;
  update: (patch: Partial<Omit<UserProfile, 'id'>>) => Promise<void>;
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
