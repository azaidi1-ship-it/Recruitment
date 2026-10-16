import type { FreeTextQuestion } from '../../types/questions';

export type HireVueCategory = 'motivation' | 'resume' | 'behavioral' | 'technical' | 'markets' | 'curveball';

export const HV_CATEGORY_LABEL: Record<HireVueCategory, string> = {
  motivation: 'Motivation',
  resume: 'Resume',
  behavioral: 'Behavioral',
  technical: 'Technical',
  markets: 'Markets',
  curveball: 'Curveball',
};

/**
 * A HireVue-style prompt. It is a free-text question (so it can be graded on
 * its rubric, logged and redone like any other), plus timing and coaching.
 * `modelAnswer` is an answer OUTLINE: it uses only facts from the resume and
 * marks anything personal you still need to supply as [your detail].
 */
export interface HireVueQuestion extends FreeTextQuestion {
  category: HireVueCategory;
  prepSec: number;
  answerSec: number;
  tips: string[];
  /** Resume item ids (src/content/resume/resume.ts) worth drawing on. */
  resumeItems?: string[];
}
