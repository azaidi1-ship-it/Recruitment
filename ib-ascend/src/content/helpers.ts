/**
 * Compact builders for authoring questions. They produce the same objects as
 * writing them out in full (see src/types/questions.ts) and are validated by
 * the content tests.
 */
import type { Difficulty, SectionId } from '../types/models';
import type {
  FreeTextQuestion,
  MultipleChoiceQuestion,
  NumericQuestion,
  OrderingQuestion,
  QuestionPool,
  RapidFireQuestion,
  RubricPoint,
  Tolerance,
  WalkthroughLine,
  WalkthroughQuestion,
} from '../types/questions';

export interface Meta {
  id: string;
  subtopic: string;
  difficulty: Difficulty;
  pools: QuestionPool[];
  followUps?: string[];
  tags?: string[];
}

/** [option text, why it's right/wrong, true if correct]. Display order is shuffled at runtime. */
export type Opt = [string, string] | [string, string, true];

/** [key, label, expected change] — and for balance sheet lines, the side. */
export type Line = [string, string, number];
export type BsLine = [string, string, number, 'A' | 'LE'];

export function builders(sectionId: SectionId) {
  return {
    mcq(meta: Meta, prompt: string, options: Opt[], explanation: string): MultipleChoiceQuestion {
      return {
        ...meta,
        sectionId,
        type: 'mcq',
        prompt,
        explanation,
        options: options.map(([text, why, correct], i) => ({
          id: String.fromCharCode(97 + i),
          text,
          explanation: why,
          ...(correct ? { correct: true } : {}),
        })),
      };
    },

    num(
      meta: Meta,
      prompt: string,
      answer: number,
      solution: string[],
      explanation: string,
      opts: { unit?: string; tolerance?: Tolerance } = {},
    ): NumericQuestion {
      return {
        ...meta,
        sectionId,
        type: 'numeric',
        prompt,
        answer,
        tolerance: opts.tolerance ?? { kind: 'abs', value: 0.5 },
        unit: opts.unit ?? '$',
        solution,
        explanation,
      };
    },

    rapid(meta: Meta, prompt: string, answer: number, explanation: string, opts: { unit?: string; seconds?: number; tolerance?: Tolerance } = {}): RapidFireQuestion {
      return {
        ...meta,
        sectionId,
        type: 'rapidFire',
        prompt,
        answer,
        tolerance: opts.tolerance ?? { kind: 'abs', value: 0 },
        timeLimitSec: opts.seconds ?? 15,
        unit: opts.unit ?? '$',
        explanation,
      };
    },

    order(meta: Meta, prompt: string, itemsInOrder: string[], explanation: string): OrderingQuestion {
      return {
        ...meta,
        sectionId,
        type: 'ordering',
        prompt,
        items: itemsInOrder.map((text, i) => ({ id: `i${i + 1}`, text })),
        explanation,
      };
    },

    walk(
      meta: Meta,
      prompt: string,
      spec: { IS: Line[]; CFS: Line[]; BS: BsLine[] },
      explanation: string,
      opts: { taxRate?: number; assumptions?: string[] } = {},
    ): WalkthroughQuestion {
      const lines: WalkthroughLine[] = [
        ...spec.IS.map(([key, label, expected]) => ({ statement: 'IS' as const, key, label, expected })),
        ...spec.CFS.map(([key, label, expected]) => ({ statement: 'CFS' as const, key, label, expected })),
        ...spec.BS.map(([key, label, expected, side]) => ({ statement: 'BS' as const, key, label, expected, side })),
      ];
      return {
        ...meta,
        sectionId,
        type: 'walkthrough',
        prompt,
        taxRate: opts.taxRate ?? 0.25,
        ...(opts.assumptions ? { assumptions: opts.assumptions } : {}),
        lines,
        explanation,
      };
    },

    free(
      meta: Meta,
      prompt: string,
      rubric: [id: string, point: string, keywords: string[][], weight?: number][],
      modelAnswer: string,
      explanation: string,
      targetSeconds = 60,
    ): FreeTextQuestion {
      const points: RubricPoint[] = rubric.map(([id, point, keywords, weight]) => ({ id, point, keywords, weight: weight ?? 1 }));
      return { ...meta, sectionId, type: 'freeText', prompt, rubric: points, modelAnswer, explanation, targetSeconds };
    },
  };
}
