import type { WorkedExample } from '../../../types/models';

export const examples: WorkedExample[] = [
  {
    id: 'val-ex1',
    sectionId: 'valuation',
    subtopic: 'football-field',
    difficulty: 'basic',
    title: 'Comps to a share price range',
    prompt: 'EBITDA is $150. Peers trade at 7.0x–9.0x EV/EBITDA. Net debt is $300 and there are 50 diluted shares. What is the implied share price range?',
    steps: [
      { title: 'EV range', body: '7 × 150 = 1,050; 9 × 150 = 1,350.' },
      { title: 'Equity value range', body: '1,050 − 300 = 750; 1,350 − 300 = 1,050.' },
      { title: 'Per share', body: '750 / 50 = $15.00; 1,050 / 50 = $21.00.' },
    ],
    answer: '$15.00–$21.00 per share.',
  },
  {
    id: 'val-ex2',
    sectionId: 'valuation',
    subtopic: 'football-field',
    difficulty: 'intermediate',
    title: 'Reading a football field',
    prompt:
      'Comps imply $15–21, precedents $19–25, the DCF $17–26 and the 52-week range is $12–18. The unaffected share price is $16 and a buyer offers $22. Is the offer reasonable?',
    steps: [
      { title: 'Premium', body: '22 / 16 − 1 = 37.5% premium to the unaffected price.' },
      { title: 'Against the market', body: 'The offer is above the entire 52-week range ($12–18) and above the comps range.' },
      { title: 'Against control and intrinsic value', body: '$22 is inside the precedents range ($19–25) and the DCF range ($17–26).' },
      { title: 'Conclusion', body: 'The offer sits within the ranges that reflect control (precedents) and intrinsic value (DCF): it looks supportable, though below the top of both, so a board might push for more.' },
    ],
    answer: 'Reasonable: a 37.5% premium, inside the precedents and DCF ranges, above comps and the 52-week range.',
  },
  {
    id: 'val-ex3',
    sectionId: 'valuation',
    subtopic: 'multiples-intuition',
    difficulty: 'advanced',
    title: 'What a P/E multiple implies',
    prompt: 'A mature company pays out 40% of earnings. Its cost of equity is 10% and it grows 5% a year forever. What forward P/E does the Gordon growth model imply? What if growth were 6%?',
    steps: [
      { title: 'Formula', body: 'Forward P/E = payout / (cost of equity − growth).' },
      { title: 'Base case', body: '0.40 / (0.10 − 0.05) = 0.40 / 0.05 = 8.0x.' },
      { title: '6% growth', body: '0.40 / (0.10 − 0.06) = 0.40 / 0.04 = 10.0x.' },
      { title: 'Lesson', body: 'One extra point of perpetual growth adds 25% to the multiple. Growth assumptions near the cost of equity explode valuations.' },
    ],
    answer: '8.0x at 5% growth; 10.0x at 6% growth.',
  },
  {
    id: 'val-ex4',
    sectionId: 'valuation',
    subtopic: 'when-to-use',
    difficulty: 'advanced',
    title: 'Valuing an unprofitable software company',
    prompt: 'A SaaS company has $200 of revenue growing 40% next year and negative EBITDA. Peers trade at 8.0x–10.0x next-twelve-months (NTM) revenue. Net cash is $100. What is the implied equity value range, and why use revenue?',
    steps: [
      { title: 'Why revenue', body: 'EBITDA and earnings are negative, so EV/EBITDA and P/E are meaningless. Revenue is still a meaningful scale metric for high-growth software.' },
      { title: 'NTM revenue', body: '200 × 1.40 = 280.' },
      { title: 'EV range', body: '8 × 280 = 2,240; 10 × 280 = 2,800.' },
      { title: 'Equity value', body: 'Add net cash: 2,340–2,900.' },
    ],
    answer: 'Equity value $2,340–2,900, using NTM revenue because profitability metrics are negative.',
  },
  {
    id: 'val-ex5',
    sectionId: 'valuation',
    subtopic: 'football-field',
    difficulty: 'elite',
    title: 'Precedents via premiums paid',
    prompt: 'A target’s unaffected share price is $40. Comparable deals paid a median premium of 28% (25th–75th percentile: 20%–35%). What implied price range do premiums-paid analysis give, and what is the main caveat?',
    steps: [
      { title: 'Median', body: '40 × 1.28 = $51.20.' },
      { title: 'Range', body: '40 × 1.20 = $48.00 to 40 × 1.35 = $54.00.' },
      { title: 'Caveat', body: 'Premiums depend on how the stock traded before the deal. If the unaffected price was depressed (or inflated by takeover speculation), applying a “normal” premium gives a misleading answer.' },
    ],
    answer: '$48.00–$54.00 (median $51.20); check that the unaffected price is truly unaffected.',
  },
  {
    id: 'val-ex6',
    sectionId: 'valuation',
    subtopic: 'when-to-use',
    difficulty: 'advanced',
    title: 'The LBO floor, worked backwards',
    prompt:
      'EBITDA is $100 today and $130 in year 5. A sponsor can borrow 5.0x ($500), expects to repay down to $300 by exit, exits at 8.0x and needs a 20% IRR over 5 years. What is the most it can pay?',
    steps: [
      { title: 'Exit equity', body: 'Exit EV = 8 × 130 = 1,040. Exit equity = 1,040 − 300 = 740.' },
      { title: 'Required money multiple', body: '1.2^5 = 2.488x.' },
      { title: 'Max equity today', body: '740 / 2.488 = 297.4.' },
      { title: 'Max entry EV', body: '297.4 + 500 = 797.4, or about 8.0x today’s EBITDA.' },
    ],
    answer: 'About $797 of enterprise value (≈8.0x EBITDA).',
  },
];
