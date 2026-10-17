import { describe, expect, it } from 'vitest';
import { db } from '../db';

// Every source file as text (Vite glob, so no Node APIs in app code).
const sources = import.meta.glob(['../../**/*.{ts,tsx}', '!../../**/__tests__/**'], { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

describe('Dexie queries', () => {
  it('only orderBy / where on indexed fields', () => {
    expect(Object.keys(sources).length).toBeGreaterThan(50);
    const indexed = new Map(db.tables.map((t) => [t.name, new Set([t.schema.primKey.name, ...t.schema.indexes.map((i) => i.name)])]));
    const bad: string[] = [];
    for (const [file, src] of Object.entries(sources)) {
      for (const m of src.matchAll(/db\.(\w+)\s*\.(?:orderBy|where)\(\s*'([^']+)'/g)) {
        const [, table, field] = m;
        if (!indexed.get(table!)?.has(field!)) bad.push(`${file}: ${table}.${field}`);
      }
    }
    expect(bad).toEqual([]);
  });
});
