import Dexie, { type EntityTable } from 'dexie';
import type {
  ArcadeScore,
  Attempt,
  CalendarEvent,
  Card,
  DealEntry,
  Firm,
  MarketNote,
  Mistake,
  Quest,
  Resume,
  SectionProgress,
  Session,
  Settings,
  Story,
  StoryVersion,
  UnlockedAchievement,
  UserProfile,
} from '../types/models';

/**
 * IndexedDB schema. Only user data lives here; content ships with the app.
 *
 * To change the schema: add a new `this.version(n)` block below with the full
 * store list and, if needed, an `.upgrade()` migration. Never edit an old
 * version block. Bump BACKUP_SCHEMA_VERSION in backup.ts if the backup format
 * changes too.
 */
export class IbAscendDb extends Dexie {
  profile!: EntityTable<UserProfile, 'id'>;
  settings!: EntityTable<Settings, 'id'>;
  sectionProgress!: EntityTable<SectionProgress, 'sectionId'>;
  attempts!: EntityTable<Attempt, 'id'>;
  sessions!: EntityTable<Session, 'id'>;
  mistakes!: EntityTable<Mistake, 'id'>;
  cards!: EntityTable<Card, 'id'>;
  achievements!: EntityTable<UnlockedAchievement, 'id'>;
  quests!: EntityTable<Quest, 'id'>;
  resumes!: EntityTable<Resume, 'id'>;
  stories!: EntityTable<Story, 'id'>;
  storyVersions!: EntityTable<StoryVersion, 'id'>;
  firms!: EntityTable<Firm, 'id'>;
  deals!: EntityTable<DealEntry, 'id'>;
  marketNotes!: EntityTable<MarketNote, 'id'>;
  events!: EntityTable<CalendarEvent, 'id'>;
  arcadeScores!: EntityTable<ArcadeScore, 'id'>;

  constructor(name = 'ib-ascend') {
    super(name);
    this.version(1).stores({
      profile: 'id',
      settings: 'id',
      sectionProgress: 'sectionId',
      attempts: 'id, questionId, sectionId, sessionId, mode, createdAt, [sectionId+subtopic]',
      sessions: 'id, mode, sectionId, startedAt',
      mistakes: 'id, questionId, sectionId, resolvedAt, createdAt',
      cards: 'id, &[source+sourceId], sectionId, due',
      achievements: 'id',
      quests: 'id, date',
      resumes: 'id, version',
      stories: 'id, resumeItemId',
      storyVersions: 'id, storyId, createdAt',
      firms: 'id, tier',
      deals: 'id, announcedOn',
      marketNotes: 'id, weekOf',
      events: 'id, date, firmId',
      arcadeScores: 'id, drillId, createdAt',
    });
  }
}

/** Every user-data table, in the order they are exported and restored. */
export const TABLE_NAMES = [
  'profile',
  'settings',
  'sectionProgress',
  'attempts',
  'sessions',
  'mistakes',
  'cards',
  'achievements',
  'quests',
  'resumes',
  'stories',
  'storyVersions',
  'firms',
  'deals',
  'marketNotes',
  'events',
  'arcadeScores',
] as const;

export type TableName = (typeof TABLE_NAMES)[number];

export const db = new IbAscendDb();
