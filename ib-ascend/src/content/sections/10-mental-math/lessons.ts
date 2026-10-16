import type { Lesson } from '../../../types/models';

export const lessons: Lesson[] = [
  {
    id: 'mm-l1',
    sectionId: 'mental-math',
    order: 1,
    title: 'Percentages and fractions',
    minutes: 5,
    blocks: [
      {
        kind: 'p',
        text: 'Interviewers test mental math to see whether you can sanity-check numbers live. Speed comes from a few memorized anchors and from breaking problems into easy pieces.',
      },
      {
        kind: 'table',
        caption: 'Fractions to memorize',
        headers: ['Fraction', 'Percent'],
        rows: [
          ['1/3', '33.3%'],
          ['1/6', '16.7%'],
          ['1/7', '14.3%'],
          ['1/8', '12.5%'],
          ['1/9', '11.1%'],
          ['1/11', '9.1%'],
          ['1/12', '8.3%'],
          ['1/16', '6.25%'],
        ],
      },
      {
        kind: 'formula',
        title: 'Tricks',
        lines: ['x% of y = y% of x (18% of 50 = 50% of 18 = 9)', 'Build from 10% and 1%: 7% of 350 = 7 × 3.5 = 24.5', 'Change = (new − old) / old'],
      },
      {
        kind: 'trap',
        title: 'Percentages don’t add',
        text: '+30% then −10% is +17%, not +20% (1.3 × 0.9 = 1.17). A 50% fall needs a 100% gain to recover. A 25% rise and a 20% fall cancel out.',
      },
    ],
    sixtySecond:
      'Memorize the common fractions as percentages, build percentages from 10% and 1%, and flip x% of y when it’s easier. Percentage changes compound by multiplying, never adding: a 50% loss needs a 100% gain to recover.',
  },
  {
    id: 'mm-l2',
    sectionId: 'mental-math',
    order: 2,
    title: 'Multiplication and division shortcuts',
    minutes: 5,
    blocks: [
      {
        kind: 'formula',
        title: 'Shortcuts',
        lines: [
          '× 25 = × 100 ÷ 4;  × 125 = × 1,000 ÷ 8',
          'Difference of squares: 48 × 52 = 50² − 2² = 2,496',
          'Ending in 5: 35² → 3 × 4 = 12, then 25 → 1,225',
          'Split: 11 × 85 = 850 + 85 = 935;  9.5 × 120 = 1,200 − 60',
        ],
      },
      {
        kind: 'example',
        title: 'A banking chain',
        text: 'EBITDA 85 at 11x, net debt 235, 35 shares: EV 935, equity 700, $20 per share. Each step uses one shortcut.',
      },
      {
        kind: 'formula',
        title: 'Division anchors',
        lines: ['1 / 0.08 = 12.5;  1 / 0.12 = 8.33;  1 / 0.125 = 8', 'Perpetuity = cash flow / rate (60 / 12% = 500)'],
      },
      {
        kind: 'trap',
        title: 'Say it, then simplify',
        text: 'In an interview, say the setup first (“11 times 85 is 850 plus 85”). It shows structure, and if you slip, the interviewer sees the method was right.',
      },
    ],
    sixtySecond:
      'Turn hard products into easy ones: × 25 is × 100 ÷ 4, differences of squares for numbers near a round number, the ending-in-5 trick for squares, and splitting multiples (9.5x = 10x minus 0.5x). Know 1 ÷ common rates. Narrate your setup.',
  },
  {
    id: 'mm-l3',
    sectionId: 'mental-math',
    order: 3,
    title: 'Compounding and IRR rules of thumb',
    minutes: 6,
    blocks: [
      {
        kind: 'formula',
        title: 'Rule of 72',
        lines: ['Years to double ≈ 72 / annual rate (%)', 'Rate to double in n years ≈ 72 / n'],
        note: '9% → 8 years; doubling in 7 years ≈ 10.3% (exact 10.4%).',
      },
      {
        kind: 'table',
        caption: 'IRR from MOIC',
        headers: ['MOIC', '3 years', '5 years'],
        rows: [
          ['1.5x', '14.5%', '8.4%'],
          ['2.0x', '26%', '15%'],
          ['2.5x', '36%', '20%'],
          ['3.0x', '44%', '25%'],
          ['4.0x', '59%', '32%'],
        ],
      },
      {
        kind: 'formula',
        title: 'Useful powers',
        lines: ['1.05² = 1.1025;  1.05³ ≈ 1.158', '1.08² = 1.1664;  1.1³ = 1.331', '1.07^10 ≈ 1.97 (≈ doubling)'],
      },
      {
        kind: 'trap',
        title: 'Interpolate, don’t freeze',
        text: 'Asked for 2.4x over 5 years? It sits between 2x (15%) and 2.5x (20%): about 19%. Interviewers want a confident estimate, not a calculator.',
      },
    ],
    sixtySecond:
      'Use the rule of 72 for doubling, and memorize the IRR table: 2x in 5 years ≈ 15%, 2.5x ≈ 20%, 3x ≈ 25%; 2x in 3 years ≈ 26%. Interpolate for anything in between, and know a few powers like 1.1³ = 1.331.',
  },
  {
    id: 'mm-l4',
    sectionId: 'mental-math',
    order: 4,
    title: 'Brain teasers and market sizing',
    minutes: 7,
    blocks: [
      {
        kind: 'p',
        text: 'Brain teasers are rarer than they used to be, but they still appear, especially in first rounds. The point is how you think: structure the problem, say your reasoning out loud and check the answer.',
      },
      {
        kind: 'list',
        items: [
          'Set up equations for word problems (bat and ball: 2x + 1.00 = 1.10).',
          'Work backwards for exponential growth (lily pad: half-covered the day before full).',
          'Split into three groups for balance problems (8 balls, 2 weighings).',
          'Use the complement for “at least one” probabilities.',
          'Clock angles: the hour hand moves 0.5° per minute; the minute hand 6° per minute.',
        ],
      },
      {
        kind: 'example',
        title: 'Market sizing: piano tuners in a city of 3 million',
        text: 'Assume 2.5 people per household → 1.2m households. 1 in 20 has a piano → 60,000 pianos. One tuning a year each → 60,000 tunings. A tuner does 4 a day × 250 days = 1,000 a year. Answer: about 60 tuners.',
      },
      {
        kind: 'trap',
        title: 'Don’t go silent',
        text: 'If you’re stuck, say what you know and what you’d try. A structured partial answer beats a silent pause.',
      },
    ],
    sixtySecond:
      'For brain teasers, set up equations, work backwards on exponential growth, divide into thirds for weighing puzzles and use complements for probabilities. For market sizing, clarify the question, lay out the structure, use round assumptions, calculate step by step and sanity-check.',
  },
];
