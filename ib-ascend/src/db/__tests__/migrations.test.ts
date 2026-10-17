import { describe, expect, it } from 'vitest';
import Dexie from 'dexie';
import { IbAscendDb } from '../db';

/** Create a database at schema v2 holding the given settings rows. */
async function v2With(name: string, rows: object[]) {
  const old = new Dexie(name);
  old.version(1).stores({ settings: 'id' });
  old.version(2).stores({ reviewLogs: 'id, cardId, sectionId, reviewedAt' });
  await old.open();
  await old.table('settings').bulkPut(rows);
  old.close();
}

describe('v3 settings migration', () => {
  it('moves a keyless Sonnet default to the current default model and turns on auto-grading', async () => {
    await v2With('mig-a', [{ id: 'settings', llmProvider: 'anthropic', llmApiKey: '', llmModel: 'claude-sonnet-5-5' }]);
    const db = new IbAscendDb('mig-a');
    const s = await db.settings.get('settings');
    expect(s?.llmModel).toBe('claude-opus-5-5');
    expect(s?.llmAutoGrade).toBe(true);
    await db.delete();
  });

  it('keeps a model the user chose alongside their own key', async () => {
    await v2With('mig-b', [{ id: 'settings', llmProvider: 'anthropic', llmApiKey: 'sk-test', llmModel: 'claude-sonnet-5-5', llmAutoGrade: false }]);
    const db = new IbAscendDb('mig-b');
    const s = await db.settings.get('settings');
    expect(s?.llmModel).toBe('claude-sonnet-5-5');
    expect(s?.llmAutoGrade).toBe(false);
    await db.delete();
  });
});
