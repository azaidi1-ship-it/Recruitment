import type { WorkedExample } from '../../../types/models';

export const examples: WorkedExample[] = [
  {
    id: 'ev-ex1',
    sectionId: 'ev-equity',
    subtopic: 'ev-bridge',
    difficulty: 'basic',
    title: 'Build enterprise value',
    prompt: 'Share price $20; 100 diluted shares; debt $500; cash $200; preferred stock $100; noncontrolling interest $50. What are equity value and enterprise value?',
    steps: [
      { title: 'Equity value', body: '20 × 100 = $2,000.' },
      { title: 'Add claims', body: '2,000 + 500 debt + 100 preferred + 50 NCI = 2,650.' },
      { title: 'Subtract cash', body: '2,650 − 200 = $2,450.' },
    ],
    answer: 'Equity value $2,000; enterprise value $2,450.',
  },
  {
    id: 'ev-ex2',
    sectionId: 'ev-equity',
    subtopic: 'diluted-shares',
    difficulty: 'intermediate',
    title: 'Treasury stock method',
    prompt: 'Share price $50; 100m basic shares; 10m options at a $20 strike and 5m at a $60 strike. What are diluted shares and equity value?',
    steps: [
      { title: 'Which options count?', body: 'The $20 tranche is in the money; the $60 tranche is out of the money and excluded.' },
      { title: 'Proceeds and buyback', body: 'Proceeds = 10m × $20 = $200m. Shares repurchased = 200 / 50 = 4m.' },
      { title: 'Net new shares', body: '10 − 4 = 6m. Diluted shares = 106m.' },
      { title: 'Equity value', body: '106m × $50 = $5,300m.' },
    ],
    answer: 'Diluted shares 106m; equity value $5,300m.',
  },
  {
    id: 'ev-ex3',
    sectionId: 'ev-equity',
    subtopic: 'multiples-pairing',
    difficulty: 'intermediate',
    title: 'From a multiple to a share price',
    prompt: 'EBITDA is $300 and comparable companies trade at 8.0x EV/EBITDA. Net debt is $600 and there are 90 diluted shares. What is the implied share price?',
    steps: [
      { title: 'Enterprise value', body: '8.0 × 300 = $2,400.' },
      { title: 'Equity value', body: '2,400 − 600 = $1,800.' },
      { title: 'Per share', body: '1,800 / 90 = $20.00.' },
    ],
    answer: '$20.00 per share.',
  },
  {
    id: 'ev-ex4',
    sectionId: 'ev-equity',
    subtopic: 'ev-bridge',
    difficulty: 'advanced',
    title: 'NCI and equity investments',
    prompt:
      'Equity value is $3,000. The company has $800 of debt and $300 of cash. It owns 80% of Sub C (consolidated; noncontrolling interest $150) and 30% of Company B (equity method, carrying value $200). What is enterprise value, and why do NCI and the B stake go in opposite directions?',
    steps: [
      { title: 'Add claims', body: '3,000 + 800 debt + 150 NCI = 3,950.' },
      { title: 'Subtract non-operating assets', body: '3,950 − 300 cash − 200 equity investment = $3,450.' },
      { title: 'Why NCI is added', body: 'Sub C is consolidated, so 100% of its EBITDA is in the company’s EBITDA. The 20% the company doesn’t own must be in EV for EV/EBITDA to be consistent.' },
      { title: 'Why B is subtracted', body: 'B isn’t consolidated: none of its EBITDA is in the numbers (only 30% of its net income, below EBITDA). So its value must come out of EV.' },
    ],
    answer: 'EV = $3,450.',
  },
  {
    id: 'ev-ex5',
    sectionId: 'ev-equity',
    subtopic: 'convertibles',
    difficulty: 'advanced',
    title: 'Options, RSUs and a convertible',
    prompt:
      'Share price $40; basic shares 200m. Options: 10m at $10, 8m at $30, 5m at $45. RSUs 3m. Convertible bonds: $400m, conversion price $25. What are diluted shares and equity value?',
    steps: [
      { title: 'Options', body: 'The $45 tranche is out of the money. ITM: 10m + 8m = 18m; proceeds 10 × 10 + 8 × 30 = $340m; repurchased 340 / 40 = 8.5m; net new 9.5m.' },
      { title: 'RSUs', body: '+3m in full.' },
      { title: 'Convertible', body: 'In the money (40 > 25): 400 / 25 = +16m shares. Remove the $400m from debt in the bridge.' },
      { title: 'Total', body: 'Diluted shares = 200 + 9.5 + 3 + 16 = 228.5m. Equity value = 228.5 × 40 = $9,140m.' },
    ],
    answer: 'Diluted shares 228.5m; equity value $9,140m (and the convertible is not counted as debt).',
  },
  {
    id: 'ev-ex6',
    sectionId: 'ev-equity',
    subtopic: 'ev-bridge',
    difficulty: 'elite',
    title: 'What moves EV, and what doesn’t',
    prompt:
      'A company has equity value $1,000 and EV $1,200. What happens to each in four separate scenarios: (a) raise $100 of debt and hold the cash; (b) use $100 of new debt to buy back stock; (c) pay a $100 dividend from cash; (d) issue $100 of stock to buy a business for $100.',
    steps: [
      { title: '(a) Debt raised, cash held', body: 'Equity value unchanged ($1,000). EV: debt +100, cash +100 → unchanged ($1,200).' },
      { title: '(b) Debt-funded buyback', body: 'Equity value −100 ($900). EV: equity −100, debt +100 → unchanged ($1,200).' },
      { title: '(c) Dividend from cash', body: 'Equity value −100 ($900). EV: equity −100, cash −100 (so −cash adds back 100) → unchanged ($1,200).' },
      { title: '(d) Stock-funded acquisition', body: 'Equity value +100 ($1,100). The company owns more operations: EV +100 ($1,300).' },
      { title: 'The principle', body: 'EV moves only when the operations change. Financing and cash movements shift value between claims.' },
    ],
    answer: '(a) 1,000 / 1,200; (b) 900 / 1,200; (c) 900 / 1,200; (d) 1,100 / 1,300 (equity value / EV).',
  },
];
