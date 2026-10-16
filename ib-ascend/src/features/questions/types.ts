import type { GradeResult } from '../../engine/grading';
import type { Question, QuestionResponse } from '../../types/questions';

export interface QuestionProps<Q extends Question> {
  question: Q;
  /** Set once answered; components switch to review mode. */
  submitted: { response: QuestionResponse; grade: GradeResult } | null;
  /** Show right/wrong styling and explanations after submitting. */
  reveal: boolean;
  onSubmit: (response: QuestionResponse) => void;
}
