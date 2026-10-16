import type { Flashcard } from '../../../types/models';

export const flashcards: Flashcard[] = [
  { id: 'acc-fc1', sectionId: 'accounting', subtopic: 'balance-sheet', front: 'The balance sheet identity', back: 'Assets = Liabilities + Shareholders’ Equity' },
  {
    id: 'acc-fc2',
    sectionId: 'accounting',
    subtopic: 'cash-flow-statement',
    front: 'The three sections of the cash flow statement',
    back: 'Operating (net income + non-cash charges ± working capital), Investing (capex, acquisitions, investments), Financing (debt, equity, dividends).',
  },
  { id: 'acc-fc3', sectionId: 'accounting', subtopic: 'working-capital', front: 'Accounts receivable rises by $50. Effect on cash from operations?', back: 'CFO falls by $50. An increase in an operating asset is a use of cash.' },
  { id: 'acc-fc4', sectionId: 'accounting', subtopic: 'balance-sheet', front: 'Deferred revenue: asset or liability?', back: 'Liability: cash received for goods or services not yet delivered.' },
  {
    id: 'acc-fc5',
    sectionId: 'accounting',
    subtopic: 'accrual-vs-cash',
    front: 'Three reasons net income ≠ cash',
    back: 'Accrual timing (credit sales, unpaid bills), non-cash charges (D&A, SBC, impairments), and cash items that skip the income statement (capex, debt principal).',
  },
  { id: 'acc-fc6', sectionId: 'accounting', subtopic: 'linkages', front: 'Where does a share buyback show up on the balance sheet?', back: 'Cash falls and treasury stock (a contra-equity account) reduces equity. Retained earnings are unchanged.' },
];
