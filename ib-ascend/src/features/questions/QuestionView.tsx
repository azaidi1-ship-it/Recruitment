import type { Question, QuestionResponse } from '../../types/questions';
import type { GradeResult } from '../../engine/grading';
import { MultipleChoice } from './MultipleChoice';
import { NumericInput } from './NumericInput';
import { Ordering } from './Ordering';
import { WalkthroughBuilder } from './WalkthroughBuilder';
import { FreeText } from './FreeText';
import { RapidFire } from './RapidFire';

interface Props {
  question: Question;
  submitted: { response: QuestionResponse; grade: GradeResult } | null;
  reveal: boolean;
  onSubmit: (r: QuestionResponse) => void;
}

/** Renders the right input for any question type. Keyed by question id by the caller. */
export function QuestionView({ question, ...rest }: Props) {
  switch (question.type) {
    case 'mcq':
      return <MultipleChoice question={question} {...rest} />;
    case 'numeric':
      return <NumericInput question={question} {...rest} />;
    case 'ordering':
      return <Ordering question={question} {...rest} />;
    case 'walkthrough':
      return <WalkthroughBuilder question={question} {...rest} />;
    case 'freeText':
      return <FreeText question={question} {...rest} />;
    case 'rapidFire':
      return <RapidFire question={question} {...rest} />;
  }
}
