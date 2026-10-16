import {
  BadgeCheck,
  Briefcase,
  Bug,
  CloudRain,
  Cog,
  Crown,
  Dumbbell,
  FastForward,
  Flame,
  Gem,
  GraduationCap,
  Layers,
  LayoutGrid,
  ListChecks,
  Mic,
  Pickaxe,
  ScrollText,
  Skull,
  Sparkles,
  Swords,
  Timer,
  TrendingUp,
  Trophy,
  Zap,
  type LucideIcon,
} from 'lucide-react';

/** Icons referenced by name in src/content/achievements.ts. Add here when adding a new icon name. */
const ICONS: Record<string, LucideIcon> = {
  BadgeCheck,
  Briefcase,
  Bug,
  CloudRain,
  Cog,
  Crown,
  Dumbbell,
  FastForward,
  Flame,
  Gem,
  GraduationCap,
  Layers,
  LayoutGrid,
  ListChecks,
  Mic,
  Pickaxe,
  ScrollText,
  Skull,
  Sparkles,
  Swords,
  Timer,
  TrendingUp,
  Trophy,
  Zap,
};

export function AchievementIcon({ name, size = 20 }: { name: string; size?: number }) {
  const Icon = ICONS[name] ?? Trophy;
  return <Icon size={size} />;
}

export function hasAchievementIcon(name: string): boolean {
  return name in ICONS;
}
