import { z } from 'zod';

/**
 * Runtime schemas for authored content. src/content/__tests__/content.test.ts
 * validates every registered section against these plus cross-checks (unique
 * ids, balanced walk-throughs, follow-ups that exist, content minimums).
 */

const nonEmpty = z.string().trim().min(1);

export const sectionIdSchema = z.enum([
  'accounting',
  'walkthroughs',
  'ev-equity',
  'valuation',
  'comps',
  'dcf',
  'mna',
  'lbo',
  'restructuring',
  'mental-math',
  'markets',
  'fit',
]);

const difficulty = z.enum(['basic', 'intermediate', 'advanced', 'elite']);
const tolerance = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('pct'), value: z.number().positive() }),
  z.object({ kind: z.literal('abs'), value: z.number().nonnegative() }),
]);

const questionBase = {
  id: nonEmpty,
  sectionId: sectionIdSchema,
  subtopic: nonEmpty,
  difficulty,
  prompt: nonEmpty,
  explanation: nonEmpty,
  pools: z.array(z.enum(['pre', 'post', 'mock'])).min(1),
  followUps: z.array(nonEmpty).optional(),
  tags: z.array(nonEmpty).optional(),
  firmStyles: z.array(nonEmpty).optional(),
};

const mcq = z
  .object({
    ...questionBase,
    type: z.literal('mcq'),
    options: z
      .array(z.object({ id: nonEmpty, text: nonEmpty, correct: z.boolean().optional(), explanation: nonEmpty }))
      .min(3)
      .max(6),
  })
  .refine((q) => q.options.filter((o) => o.correct).length === 1, { message: 'MCQ needs exactly one correct option' })
  .refine((q) => new Set(q.options.map((o) => o.id)).size === q.options.length, { message: 'MCQ option ids must be unique' });

const numeric = z.object({
  ...questionBase,
  type: z.literal('numeric'),
  answer: z.number().finite(),
  tolerance,
  unit: z.string().optional(),
  solution: z.array(nonEmpty).optional(),
});

const ordering = z
  .object({
    ...questionBase,
    type: z.literal('ordering'),
    items: z.array(z.object({ id: nonEmpty, text: nonEmpty })).min(3),
  })
  .refine((q) => new Set(q.items.map((i) => i.id)).size === q.items.length, { message: 'Ordering ids must be unique' });

const walkthrough = z
  .object({
    ...questionBase,
    type: z.literal('walkthrough'),
    taxRate: z.number().min(0).max(1),
    assumptions: z.array(nonEmpty).optional(),
    lineTolerance: z.number().nonnegative().optional(),
    lines: z
      .array(
        z.object({
          statement: z.enum(['IS', 'CFS', 'BS']),
          key: nonEmpty,
          label: nonEmpty,
          expected: z.number().finite(),
          side: z.enum(['A', 'LE']).optional(),
        }),
      )
      .min(3),
  })
  .refine((q) => q.lines.every((l) => (l.statement === 'BS') === (l.side !== undefined)), {
    message: 'Every BS line needs a side (A or LE), and only BS lines may have one',
  })
  .refine((q) => new Set(q.lines.map((l) => l.key)).size === q.lines.length, { message: 'Line keys must be unique' });

const rubricPoint = z.object({
  id: nonEmpty,
  point: nonEmpty,
  keywords: z.array(z.array(nonEmpty).min(1)).min(1),
  weight: z.number().positive(),
});

const freeText = z.object({
  ...questionBase,
  type: z.literal('freeText'),
  rubric: z.array(rubricPoint).min(2),
  modelAnswer: nonEmpty,
  targetSeconds: z.number().positive().optional(),
});

const rapidFire = z.object({
  ...questionBase,
  type: z.literal('rapidFire'),
  answer: z.number().finite(),
  tolerance,
  timeLimitSec: z.number().positive(),
  unit: z.string().optional(),
});

export const questionSchema = z.union([mcq, numeric, ordering, walkthrough, freeText, rapidFire]);

const block = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('p'), text: nonEmpty }),
  z.object({ kind: z.literal('h'), text: nonEmpty }),
  z.object({ kind: z.literal('list'), items: z.array(nonEmpty).min(1), ordered: z.boolean().optional() }),
  z.object({ kind: z.literal('formula'), title: nonEmpty, lines: z.array(nonEmpty).min(1), note: z.string().optional() }),
  z.object({ kind: z.literal('trap'), title: nonEmpty, text: nonEmpty }),
  z.object({
    kind: z.literal('table'),
    headers: z.array(z.string()).min(1),
    rows: z.array(z.array(z.string())).min(1),
    caption: z.string().optional(),
  }),
  z.object({ kind: z.literal('example'), title: z.string().optional(), text: nonEmpty }),
]);

export const lessonSchema = z.object({
  id: nonEmpty,
  sectionId: sectionIdSchema,
  order: z.number().int().positive(),
  title: nonEmpty,
  minutes: z.number().int().min(3).max(10),
  blocks: z.array(block).min(3),
  sixtySecond: nonEmpty,
});

export const workedExampleSchema = z.object({
  id: nonEmpty,
  sectionId: sectionIdSchema,
  subtopic: nonEmpty,
  difficulty,
  title: nonEmpty,
  prompt: nonEmpty,
  steps: z.array(z.object({ title: nonEmpty, body: nonEmpty })).min(2),
  answer: nonEmpty,
});

export const flashcardSchema = z.object({
  id: nonEmpty,
  sectionId: sectionIdSchema,
  subtopic: nonEmpty,
  front: nonEmpty,
  back: nonEmpty,
});

export const cheatSheetSchema = z.object({
  sectionId: sectionIdSchema,
  blocks: z.array(block).min(3),
});

/** Minimums for a section marked 'complete'. */
export const CONTENT_MINIMUMS = {
  questions: 40,
  preQuestions: 8,
  postQuestions: 15,
  mockQuestions: 12,
  examples: 5,
  lessons: 3,
} as const;
