import { afterEach, describe, expect, it } from 'vitest';
import { IbAscendDb } from '../db';
import { ensureSeeded } from '../seed';
import { seedStories } from '../../content/stories/seedStories';

let n = 0;
let database: IbAscendDb;
afterEach(async () => {
  await database.delete();
});

describe('seed story refresh', () => {
  it('brings unedited starter stories up to the current seed text and leaves edited ones alone', async () => {
    database = new IbAscendDb(`seed-${++n}`);
    await ensureSeeded(database);
    const [a, b] = seedStories('2026-01-01T00:00:00.000Z');
    await database.stories.update(a!.id, { action: 'Old app-written text', practiceScore: 0.8 });
    await database.stories.update(b!.id, { action: 'My own words', userEdited: true });

    await ensureSeeded(database);
    const ra = await database.stories.get(a!.id);
    const rb = await database.stories.get(b!.id);
    expect(ra?.action).toBe(a!.action);
    expect(ra?.practiceScore).toBe(0.8);
    expect(rb?.action).toBe('My own words');
  });

  it('does not re-add stories the user deleted', async () => {
    database = new IbAscendDb(`seed-${++n}`);
    await ensureSeeded(database);
    const [a] = seedStories('2026-01-01T00:00:00.000Z');
    await database.stories.delete(a!.id);
    await ensureSeeded(database);
    expect(await database.stories.get(a!.id)).toBeUndefined();
  });
});
