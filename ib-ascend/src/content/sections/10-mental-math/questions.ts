import type { Question } from '../../../types/questions';
import { builders } from '../../helpers';

const { mcq, num, rapid, order, free } = builders('mental-math');

/** Mental math and brain teasers. Rapid-fire answers must be exact unless a tolerance is given. */
export const questions: Question[] = [
  // ── Percentages ──
  rapid({ id: 'mm-q-001', subtopic: 'percentages', difficulty: 'basic', pools: ['pre', 'post'] }, 'What is 15% of 80?', 12, '10% is 8, 5% is 4: 12.', { unit: '' }),
  rapid({ id: 'mm-q-002', subtopic: 'percentages', difficulty: 'basic', pools: ['pre', 'post'] }, 'What is 18% of 250?', 45, '10% = 25, 8% = 20: 45. Or 250 × 0.18 = 45.', { unit: '' }),
  rapid({ id: 'mm-q-003', subtopic: 'percentages', difficulty: 'intermediate', pools: ['post', 'mock'] }, 'What is 7% of 350?', 24.5, '1% = 3.5, so 7% = 24.5.', { unit: '', tolerance: { kind: 'abs', value: 0.05 } }),
  rapid({ id: 'mm-q-004', subtopic: 'percentages', difficulty: 'basic', pools: ['pre', 'post'] }, 'A value goes from 80 to 100. What is the percentage increase?', 25, '20 / 80 = 25%.', { unit: '%' }),
  rapid({ id: 'mm-q-005', subtopic: 'percentages', difficulty: 'basic', pools: ['post', 'mock'] }, 'A value goes from 100 to 80. What is the percentage change? (Enter a negative number.)', -20, '−20 / 100 = −20%. Note: a 25% rise followed by a 20% fall gets you back to the start.', { unit: '%' }),
  rapid({ id: 'mm-q-006', subtopic: 'percentages', difficulty: 'intermediate', pools: ['post', 'mock'] }, 'Revenue of 100 grows 30%, then falls 10%. What is the new revenue?', 117, '100 × 1.3 = 130; 130 × 0.9 = 117. Percentage changes don’t add.', { unit: '' }),
  rapid({ id: 'mm-q-007', subtopic: 'percentages', difficulty: 'intermediate', pools: ['post'] }, 'What is 3/7 as a percentage (to 1 decimal)?', 42.9, '1/7 ≈ 14.29%, so 3/7 ≈ 42.86%.', { unit: '%', tolerance: { kind: 'abs', value: 0.1 }, seconds: 20 }),
  rapid({ id: 'mm-q-008', subtopic: 'percentages', difficulty: 'basic', pools: ['pre'] }, 'What is 1/8 as a percentage?', 12.5, 'Memorize eighths: 12.5, 25, 37.5, 50, 62.5, 75, 87.5.', { unit: '%' }),
  rapid({ id: 'mm-q-009', subtopic: 'percentages', difficulty: 'intermediate', pools: ['post', 'mock'] }, 'A company earns 360 pre-tax at a 25% tax rate. What is after-tax income?', 270, '360 × 0.75 = 270.', { unit: '' }),
  num(
    { id: 'mm-q-010', subtopic: 'percentages', difficulty: 'advanced', pools: ['mock'] },
    '200 grows 15% a year for two years. What is the result (to 1 decimal)?',
    264.5,
    ['Year 1: 200 × 1.15 = 230', 'Year 2: 230 × 1.15 = 264.5', '(1.15² = 1.3225)'],
    'Compounding, not 200 × 1.30.',
    { unit: '', tolerance: { kind: 'abs', value: 0.05 } },
  ),
  rapid({ id: 'mm-q-011', subtopic: 'percentages', difficulty: 'advanced', pools: ['mock'] }, 'What is 1.05³ (to 3 decimals)?', 1.158, '1.05² = 1.1025; × 1.05 = 1.157625 ≈ 1.158.', { unit: '', tolerance: { kind: 'abs', value: 0.001 }, seconds: 30 }),
  mcq(
    { id: 'mm-q-012', subtopic: 'percentages', difficulty: 'intermediate', pools: ['post'] },
    'A stock falls 50%. What percentage gain does it need to get back to where it started?',
    [
      ['100%', 'From 50 back to 100 is a gain of 50 on a base of 50: 100%.', true],
      ['50%', 'A 50% gain on 50 only gets you to 75.'],
      ['75%', '50 × 1.75 = 87.5, still short.'],
      ['150%', '50 × 2.5 = 125, overshoots.'],
    ],
    'Losses need bigger percentage gains to recover because the base is smaller.',
  ),

  // ── Multiples and division ──
  rapid({ id: 'mm-q-013', subtopic: 'multiples', difficulty: 'basic', pools: ['pre', 'post'] }, 'What is 125 × 8?', 1000, '125 = 1,000 / 8.', { unit: '' }),
  rapid({ id: 'mm-q-014', subtopic: 'multiples', difficulty: 'intermediate', pools: ['post', 'mock'] }, 'What is 17 × 23?', 391, '(20 − 3)(20 + 3) = 400 − 9 = 391.', { unit: '', seconds: 20 }),
  rapid({ id: 'mm-q-015', subtopic: 'multiples', difficulty: 'basic', pools: ['pre', 'post'] }, 'What is 64 × 25?', 1600, '× 25 = × 100 ÷ 4: 6,400 / 4 = 1,600.', { unit: '' }),
  rapid({ id: 'mm-q-016', subtopic: 'multiples', difficulty: 'intermediate', pools: ['post'] }, 'What is 35²?', 1225, 'Numbers ending in 5: 3 × 4 = 12, then append 25 → 1,225.', { unit: '' }),
  rapid({ id: 'mm-q-017', subtopic: 'multiples', difficulty: 'basic', pools: ['pre'] }, 'What is 450 / 15?', 30, '15 × 30 = 450.', { unit: '' }),
  rapid({ id: 'mm-q-018', subtopic: 'multiples', difficulty: 'intermediate', pools: ['post', 'mock'] }, 'EBITDA is 120 and the multiple is 9.5x. What is EV?', 1140, '10 × 120 = 1,200 minus 0.5 × 120 = 60: 1,140.', { unit: '' }),
  rapid({ id: 'mm-q-019', subtopic: 'multiples', difficulty: 'basic', pools: ['post', 'mock'] }, 'EV is 1,800 and EBITDA is 150. What is EV/EBITDA?', 12, '1,800 / 150 = 12.0x.', { unit: 'x' }),
  rapid({ id: 'mm-q-020', subtopic: 'multiples', difficulty: 'basic', pools: ['pre', 'post'] }, 'P/E is 25x and EPS is $1.60. What is the share price?', 40, '25 × 1.6 = 40.', { unit: '$' }),
  rapid({ id: 'mm-q-021', subtopic: 'multiples', difficulty: 'intermediate', pools: ['post'] }, 'What is 0.75 × 0.8?', 0.6, '3/4 × 4/5 = 3/5 = 0.6.', { unit: '', tolerance: { kind: 'abs', value: 0.001 } }),
  rapid({ id: 'mm-q-022', subtopic: 'multiples', difficulty: 'intermediate', pools: ['post', 'mock'] }, 'What is 1 / 0.08?', 12.5, '1 / 8% = 12.5: the perpetuity multiple at an 8% discount rate.', { unit: '', tolerance: { kind: 'abs', value: 0.05 } }),
  rapid({ id: 'mm-q-023', subtopic: 'multiples', difficulty: 'intermediate', pools: ['post'] }, 'A perpetuity pays 60 a year at a 12% discount rate. What is it worth?', 500, '60 / 0.12 = 500.', { unit: '' }),
  num(
    { id: 'mm-q-024', subtopic: 'multiples', difficulty: 'advanced', pools: ['mock'] },
    'A company has EBITDA of 85 and trades at 11x. Net debt is 235 and there are 35 shares. What is the share price?',
    20,
    ['EV = 11 × 85 = 935', 'Equity = 935 − 235 = 700', 'Price = 700 / 35 = 20'],
    'Break 11 × 85 into 10 × 85 + 85.',
  ),

  // ── IRR and compounding ──
  rapid({ id: 'mm-q-025', subtopic: 'irr-rules', difficulty: 'basic', pools: ['pre', 'post'] }, 'Rule of 72: at 9% a year, roughly how many years to double?', 8, '72 / 9 = 8.', { unit: 'years' }),
  rapid({ id: 'mm-q-026', subtopic: 'irr-rules', difficulty: 'basic', pools: ['pre', 'post'] }, '2x in 5 years is roughly what IRR (in %)?', 15, '2^(1/5) − 1 = 14.9%.', { unit: '%', tolerance: { kind: 'abs', value: 1 } }),
  rapid({ id: 'mm-q-027', subtopic: 'irr-rules', difficulty: 'intermediate', pools: ['post', 'mock'] }, '3x in 5 years is roughly what IRR (in %)?', 25, '3^(1/5) − 1 = 24.6%.', { unit: '%', tolerance: { kind: 'abs', value: 1 } }),
  rapid({ id: 'mm-q-028', subtopic: 'irr-rules', difficulty: 'intermediate', pools: ['post'] }, '2.5x in 5 years is roughly what IRR (in %)?', 20, '2.5^(1/5) − 1 = 20.1%.', { unit: '%', tolerance: { kind: 'abs', value: 1 } }),
  rapid({ id: 'mm-q-029', subtopic: 'irr-rules', difficulty: 'advanced', pools: ['mock'] }, '4x in 5 years is roughly what IRR (in %)?', 32, '4^(1/5) − 1 = 32.0%.', { unit: '%', tolerance: { kind: 'abs', value: 1.5 } }),
  rapid({ id: 'mm-q-030', subtopic: 'irr-rules', difficulty: 'advanced', pools: ['mock'] }, '1.5x in 3 years is roughly what IRR (in %)?', 14.5, '1.5^(1/3) − 1 = 14.5%.', { unit: '%', tolerance: { kind: 'abs', value: 1 } }),
  rapid({ id: 'mm-q-031', subtopic: 'irr-rules', difficulty: 'intermediate', pools: ['post', 'mock'] }, '2x in 3 years is roughly what IRR (in %)?', 26, '2^(1/3) − 1 = 26.0%.', { unit: '%', tolerance: { kind: 'abs', value: 1 } }),
  num(
    { id: 'mm-q-032', subtopic: 'irr-rules', difficulty: 'elite', pools: ['mock'] },
    'Revenue doubles from 100 to 200 over 7 years. Roughly what compound annual growth rate is that (in %)?',
    10.4,
    ['Rule of 72: 72 / 7 ≈ 10.3%', 'Exact: 2^(1/7) − 1 = 10.4%'],
    'The rule of 72 gets you within a few tenths of a point.',
    { unit: '%', tolerance: { kind: 'abs', value: 0.5 } },
  ),
  mcq(
    { id: 'mm-q-033', subtopic: 'irr-rules', difficulty: 'intermediate', pools: ['post'] },
    'Which is the better investment: 2x in 3 years or 2.5x in 5 years?',
    [
      ['2x in 3 years by IRR (≈26% vs ≈20%), though 2.5x makes more total money', 'IRR favors speed; MOIC favors size. Say both.', true],
      ['2.5x in 5 years, always, because MOIC is higher', 'Ignores time value.'],
      ['They are identical', 'Different IRRs and MOICs.'],
      ['Neither: both are below 10% IRR', 'Both are well above 10%.'],
    ],
    'Compare on IRR and MOIC, and say which matters for the investor.',
  ),

  // ── Brain teasers ──
  mcq(
    { id: 'mm-q-034', subtopic: 'brain-teasers', difficulty: 'basic', pools: ['pre', 'post'] },
    'A bat and a ball cost $1.10 together. The bat costs $1.00 more than the ball. How much is the ball?',
    [
      ['$0.05', 'Ball = x, bat = x + 1.00 → 2x + 1.00 = 1.10 → x = 0.05.', true],
      ['$0.10', 'Then the bat would be $1.10 and the total $1.20.'],
      ['$0.01', '0.01 + 1.01 = 1.02.'],
      ['$0.55', '0.55 + 1.55 = 2.10.'],
    ],
    'Set up the equation instead of trusting the instinct.',
  ),
  rapid(
    { id: 'mm-q-035', subtopic: 'brain-teasers', difficulty: 'intermediate', pools: ['post', 'mock'] },
    'What is the angle between the hour and minute hands at 3:15 (in degrees)?',
    7.5,
    'Minute hand at 90°. Hour hand at 90° + 15 × 0.5° = 97.5°. Difference 7.5°.',
    { unit: '°', tolerance: { kind: 'abs', value: 0.05 }, seconds: 30 },
  ),
  rapid(
    { id: 'mm-q-036', subtopic: 'brain-teasers', difficulty: 'basic', pools: ['pre', 'post'] },
    'What is the sum of the integers from 1 to 100?',
    5050,
    'Gauss: 100 × 101 / 2 = 5,050.',
    { unit: '', seconds: 20 },
  ),
  rapid(
    { id: 'mm-q-037', subtopic: 'brain-teasers', difficulty: 'basic', pools: ['post'] },
    'Ten people each shake hands with everyone else once. How many handshakes?',
    45,
    '10 × 9 / 2 = 45.',
    { unit: '', seconds: 20 },
  ),
  mcq(
    { id: 'mm-q-038', subtopic: 'brain-teasers', difficulty: 'intermediate', pools: ['post', 'mock'] },
    'A lily pad patch doubles in size every day and covers the whole lake on day 48. On what day did it cover half the lake?',
    [
      ['Day 47', 'It doubles daily, so the day before full coverage it was half.', true],
      ['Day 24', 'Linear thinking; growth is exponential.'],
      ['Day 46', 'On day 46 it covered a quarter.'],
      ['Day 1', 'Far too early.'],
    ],
    'Work backwards with doubling.',
  ),
  mcq(
    { id: 'mm-q-039', subtopic: 'brain-teasers', difficulty: 'advanced', pools: ['mock'] },
    'Monty Hall: you pick one of three doors; the host, who knows where the car is, opens another door with a goat and offers you a switch. Should you switch?',
    [
      ['Yes: switching wins with probability 2/3', 'Your first pick is right 1/3 of the time; the host’s reveal moves the other 2/3 onto the remaining door.', true],
      ['It doesn’t matter: it’s 50/50', 'The host’s choice isn’t random, so the odds aren’t equal.'],
      ['No: staying wins 2/3 of the time', 'Staying wins only 1/3.'],
      ['Only if the host opened the left door', 'Which door is opened doesn’t matter.'],
    ],
    'Conditional probability: the host’s knowledge changes the odds.',
  ),
  mcq(
    { id: 'mm-q-040', subtopic: 'brain-teasers', difficulty: 'advanced', pools: ['mock'] },
    'You have two ropes that each take exactly 60 minutes to burn, but burn unevenly. How do you measure 45 minutes?',
    [
      ['Light rope A at both ends and rope B at one end; when A burns out (30 min), light B’s other end: it finishes 15 minutes later', 'Burning from both ends halves the time regardless of unevenness.', true],
      ['Cut each rope in half and burn one half', 'Uneven burning means half the length isn’t half the time.'],
      ['Burn both ropes end to end', 'That takes 120 minutes.'],
      ['It can’t be done', 'It can, using both-end burning.'],
    ],
    'Both ends = half the remaining time.',
  ),
  mcq(
    { id: 'mm-q-041', subtopic: 'brain-teasers', difficulty: 'elite', pools: ['mock'] },
    'You have 25 horses and a track that races 5 at a time, with no timer. What is the minimum number of races to find the fastest 3?',
    [
      ['7', 'Five heats (5 races), a race of the five winners (6), then one race of the only horses that can still be top-3 (7).', true],
      ['5', 'Five heats don’t compare horses across heats.'],
      ['6', 'After the winners’ race you still don’t know 2nd and 3rd overall.'],
      ['10', 'More than necessary.'],
    ],
    'After race 6, only 5 horses can still be 2nd or 3rd overall; race them once.',
  ),
  mcq(
    { id: 'mm-q-042', subtopic: 'brain-teasers', difficulty: 'intermediate', pools: ['post'] },
    'Eight balls look identical; one is slightly heavier. Using a balance scale, what is the minimum number of weighings to find it?',
    [
      ['2', 'Weigh 3 vs 3. If balanced, weigh the remaining 2. If not, take the heavier 3 and weigh 1 vs 1.', true],
      ['3', 'Splitting into halves needs 3; splitting into thirds needs only 2.'],
      ['1', 'One weighing can’t isolate 1 of 8.'],
      ['4', 'Far more than needed.'],
    ],
    'Split into three groups, not two.',
  ),
  rapid(
    { id: 'mm-q-043', subtopic: 'brain-teasers', difficulty: 'basic', pools: ['pre'] },
    'If today is Friday, how many days after Friday is it in 100 days? (Enter the remainder of 100 ÷ 7.)',
    2,
    '100 = 14 × 7 + 2, so it’s 2 days after Friday: Sunday.',
    { unit: 'days', seconds: 20 },
  ),
  mcq(
    { id: 'mm-q-044', subtopic: 'brain-teasers', difficulty: 'intermediate', pools: ['post', 'mock'] },
    'You flip a fair coin twice. What is the probability of at least one head?',
    [
      ['75%', '1 − P(no heads) = 1 − 1/4 = 3/4.', true],
      ['50%', 'That is the chance of a head on one flip.'],
      ['25%', 'That is the chance of two heads (or two tails).'],
      ['100%', 'Two tails is possible.'],
    ],
    '“At least one” → use the complement.',
  ),
  order(
    { id: 'mm-q-045', subtopic: 'brain-teasers', difficulty: 'basic', pools: ['pre'] },
    'Put the steps of a market-sizing answer in order.',
    [
      'Clarify the question and the unit (e.g. per year, in the US)',
      'Lay out the structure out loud before calculating',
      'State each assumption with a round number',
      'Calculate step by step, rounding as you go',
      'Sanity-check the result and say what would change it',
    ],
    'Interviewers grade the structure more than the final number.',
  ),
  free(
    { id: 'mm-q-046', subtopic: 'brain-teasers', difficulty: 'advanced', pools: ['mock'] },
    'Estimate how many piano tuners work in a city of 3 million people.',
    [
      ['structure', 'Lays out a structure: households → pianos → tunings needed → tunings per tuner', [['household*'], ['piano*', 'tun*']]],
      ['assumptions', 'States explicit, round assumptions', [['assum*|let s say|lets say|say']]],
      ['math', 'Calculates step by step to a number', [['per year|a year|each year']]],
      ['check', 'Sanity-checks the answer', [['sanity|check|reasonable|seems']]],
    ],
    'Let’s say 3 million people at about 2.5 per household is 1.2 million households. If 1 in 20 has a piano, that’s 60,000 pianos. Assume each is tuned once a year: 60,000 tunings a year. A tuner might do 4 tunings a day for 250 working days, or 1,000 a year. So the city needs about 60 piano tuners. That seems reasonable; the biggest swing factor is the share of households with a piano.',
    'Structure first, round numbers, then sanity-check.',
    60,
  ),
];
