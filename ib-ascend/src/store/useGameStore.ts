import { create } from 'zustand';
import type { Grade } from '../config/gameConfig';
import type { LevelInfo, Rank } from '../engine/levels';
import type { MasteryResult } from '../engine/mastery';
import type { Stats } from '../engine/stats';
import type { Quest, SectionId } from '../types/models';

/** Derived game state, recomputed by services/progression.ts → refreshDerived(). */
export interface GameSnapshot {
  level: LevelInfo;
  rank: Rank;
  nextRank: Rank | null;
  mastery: Record<SectionId, MasteryResult>;
  /** Key: `${sectionId}/${subtopicId}`, value 0–1. */
  subtopicMastery: Record<string, number>;
  grades: Record<SectionId, Grade | null>;
  stats: Stats;
  unlocked: SectionId[];
  quests: Quest[];
  displayStreak: number;
  cardsDue: number;
  openMistakes: number;
  unlockedAchievements: string[];
}

interface GameState {
  snapshot: GameSnapshot | null;
  setSnapshot: (s: GameSnapshot) => void;
}

export const useGameStore = create<GameState>((set) => ({
  snapshot: null,
  setSnapshot: (snapshot) => set({ snapshot }),
}));
