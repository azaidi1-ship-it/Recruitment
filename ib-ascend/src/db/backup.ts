import { z } from 'zod';
import { db, TABLE_NAMES, type IbAscendDb, type TableName } from './db';
import { nowIso } from '../lib/dates';

/**
 * Backup format. Bump BACKUP_SCHEMA_VERSION whenever the shape of exported
 * rows changes, and add a step to `migrateBackup` that upgrades older files.
 */
export const BACKUP_SCHEMA_VERSION = 1;

const PRIMARY_KEY: Record<TableName, string> = {
  profile: 'id',
  settings: 'id',
  sectionProgress: 'sectionId',
  attempts: 'id',
  sessions: 'id',
  mistakes: 'id',
  cards: 'id',
  achievements: 'id',
  quests: 'id',
  resumes: 'id',
  stories: 'id',
  storyVersions: 'id',
  firms: 'id',
  deals: 'id',
  marketNotes: 'id',
  events: 'id',
  arcadeScores: 'id',
};

const rowSchema = z.record(z.string(), z.unknown());

const backupSchema = z.object({
  app: z.literal('ib-ascend'),
  schemaVersion: z.number().int().positive(),
  exportedAt: z.string(),
  includesApiKey: z.boolean(),
  tables: z.record(z.string(), z.array(rowSchema)),
});

export type BackupFile = z.infer<typeof backupSchema>;

export interface ExportOptions {
  /** Include the LLM API key. Off by default so backups are safe to share. */
  includeApiKey?: boolean;
}

export async function exportBackup(
  database: IbAscendDb = db,
  options: ExportOptions = {},
): Promise<BackupFile> {
  const tables: Record<string, Record<string, unknown>[]> = {};
  await database.transaction('r', TABLE_NAMES.map((t) => database.table(t)), async () => {
    for (const name of TABLE_NAMES) {
      tables[name] = (await database.table(name).toArray()) as Record<string, unknown>[];
    }
  });
  if (!options.includeApiKey) {
    tables.settings = (tables.settings ?? []).map((s) => ({ ...s, llmApiKey: '' }));
  }
  return {
    app: 'ib-ascend',
    schemaVersion: BACKUP_SCHEMA_VERSION,
    exportedAt: nowIso(),
    includesApiKey: Boolean(options.includeApiKey),
    tables,
  };
}

export function backupFileName(date = new Date()): string {
  const stamp = date.toISOString().slice(0, 16).replace(/[:T]/g, '-');
  return `ib-ascend-backup-${stamp}.json`;
}

export class BackupError extends Error {}

/** Parse and validate a backup file's text. Throws BackupError with a readable message. */
export function parseBackup(text: string): BackupFile {
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    throw new BackupError('That file is not valid JSON.');
  }
  const parsed = backupSchema.safeParse(json);
  if (!parsed.success) {
    throw new BackupError('That file is not an IB Ascend backup.');
  }
  const file = parsed.data;
  if (file.schemaVersion > BACKUP_SCHEMA_VERSION) {
    throw new BackupError(
      `This backup was made by a newer version of IB Ascend (format v${file.schemaVersion}). Update the app first.`,
    );
  }
  for (const name of TABLE_NAMES) {
    const rows = file.tables[name] ?? [];
    const key = PRIMARY_KEY[name];
    rows.forEach((row, i) => {
      if (typeof row[key] !== 'string') {
        throw new BackupError(`Row ${i + 1} in "${name}" is missing its "${key}".`);
      }
    });
  }
  return migrateBackup(file);
}

/** Upgrade older backup formats to the current one. v1 is current. */
function migrateBackup(file: BackupFile): BackupFile {
  return file;
}

export interface ImportSummary {
  counts: Partial<Record<TableName, number>>;
}

/**
 * Replace all user data with the backup's contents, atomically. If the backup
 * has no API key, the key currently stored in this browser is kept.
 */
export async function importBackup(file: BackupFile, database: IbAscendDb = db): Promise<ImportSummary> {
  const counts: ImportSummary['counts'] = {};
  await database.transaction('rw', TABLE_NAMES.map((t) => database.table(t)), async () => {
    const currentSettings = await database.settings.get('settings');
    for (const name of TABLE_NAMES) {
      let rows = file.tables[name] ?? [];
      if (name === 'settings' && currentSettings?.llmApiKey) {
        rows = rows.map((s) => (s.llmApiKey ? s : { ...s, llmApiKey: currentSettings.llmApiKey }));
      }
      const table = database.table(name);
      await table.clear();
      if (rows.length) await table.bulkAdd(rows);
      counts[name] = rows.length;
    }
  });
  return { counts };
}

/** Delete every row in every table. Used by "Reset all progress". */
export async function wipeAll(database: IbAscendDb = db): Promise<void> {
  await database.transaction('rw', TABLE_NAMES.map((t) => database.table(t)), async () => {
    for (const name of TABLE_NAMES) await database.table(name).clear();
  });
}
