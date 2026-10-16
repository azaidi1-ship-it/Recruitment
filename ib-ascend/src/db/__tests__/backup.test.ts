import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { IbAscendDb } from '../db';
import { ensureSeeded } from '../seed';
import { BackupError, exportBackup, importBackup, parseBackup, wipeAll } from '../backup';
import { SECTIONS } from '../../content/sections';

let source: IbAscendDb;
let target: IbAscendDb;
let n = 0;

beforeEach(async () => {
  n += 1;
  source = new IbAscendDb(`test-src-${n}`);
  target = new IbAscendDb(`test-dst-${n}`);
  await ensureSeeded(source);
  await ensureSeeded(target);
});

afterEach(async () => {
  await source.delete();
  await target.delete();
});

describe('ensureSeeded', () => {
  it('creates the singletons once and is idempotent', async () => {
    await ensureSeeded(source);
    expect(await source.profile.count()).toBe(1);
    expect(await source.settings.count()).toBe(1);
    expect(await source.sectionProgress.count()).toBe(SECTIONS.length);
    expect(await source.resumes.count()).toBe(1);
  });

  it('never overwrites existing rows', async () => {
    await source.profile.update('me', { totalXp: 1234 });
    await ensureSeeded(source);
    expect((await source.profile.get('me'))?.totalXp).toBe(1234);
  });
});

describe('export / import', () => {
  it('round-trips every table through JSON', async () => {
    await source.profile.update('me', { totalXp: 777 });
    await source.deals.add({
      id: 'd1',
      acquirer: 'Acquirer Co',
      target: 'Target Co',
      valueMm: 1500,
      multiple: '12.0x EBITDA',
      sector: 'Industrials',
      announcedOn: '2026-09-01',
      rationale: 'Scale',
      myView: 'Fair price',
      createdAt: '2026-10-01T00:00:00.000Z',
      updatedAt: '2026-10-01T00:00:00.000Z',
    });

    const file = parseBackup(JSON.stringify(await exportBackup(source)));
    const summary = await importBackup(file, target);

    expect(summary.counts.deals).toBe(1);
    expect((await target.profile.get('me'))?.totalXp).toBe(777);
    expect((await target.deals.get('d1'))?.valueMm).toBe(1500);
    expect(await target.sectionProgress.count()).toBe(SECTIONS.length);
  });

  it('replaces existing data rather than merging', async () => {
    await target.deals.add({
      id: 'stale',
      acquirer: 'A',
      target: 'B',
      valueMm: null,
      multiple: '',
      sector: '',
      announcedOn: null,
      rationale: '',
      myView: '',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    });
    await importBackup(await exportBackup(source), target);
    expect(await target.deals.get('stale')).toBeUndefined();
  });

  it('strips the API key unless asked to include it', async () => {
    await source.settings.update('settings', { llmApiKey: 'sk-secret' });
    const without = await exportBackup(source);
    expect(JSON.stringify(without)).not.toContain('sk-secret');
    expect(without.includesApiKey).toBe(false);

    const withKey = await exportBackup(source, { includeApiKey: true });
    expect(JSON.stringify(withKey)).toContain('sk-secret');
  });

  it('keeps the API key already stored in this browser when the backup has none', async () => {
    await target.settings.update('settings', { llmApiKey: 'sk-local' });
    await importBackup(await exportBackup(source), target);
    expect((await target.settings.get('settings'))?.llmApiKey).toBe('sk-local');
  });
});

describe('parseBackup', () => {
  it('rejects non-JSON', () => {
    expect(() => parseBackup('not json')).toThrow(BackupError);
  });

  it('rejects files from other apps', () => {
    expect(() => parseBackup(JSON.stringify({ app: 'other', tables: {} }))).toThrow(/not an IB Ascend backup/);
  });

  it('rejects backups from a newer format', () => {
    const file = { app: 'ib-ascend', schemaVersion: 999, exportedAt: '', includesApiKey: false, tables: {} };
    expect(() => parseBackup(JSON.stringify(file))).toThrow(/newer version/);
  });

  it('rejects rows without a primary key', () => {
    const file = {
      app: 'ib-ascend',
      schemaVersion: 1,
      exportedAt: '',
      includesApiKey: false,
      tables: { deals: [{ acquirer: 'x' }] },
    };
    expect(() => parseBackup(JSON.stringify(file))).toThrow(/missing its "id"/);
  });
});

describe('wipeAll', () => {
  it('empties every table', async () => {
    await wipeAll(source);
    expect(await source.profile.count()).toBe(0);
    expect(await source.resumes.count()).toBe(0);
  });
});
