import type { Lesson } from '../../../types/models';

export const lessons: Lesson[] = [
  {
    id: 'fit-l1',
    sectionId: 'fit',
    order: 1,
    title: 'Walk me through your resume',
    minutes: 7,
    blocks: [
      {
        kind: 'p',
        text: 'This is almost always the first question, and it sets the tone for the whole interview. Interviewers aren’t checking whether you can read your resume aloud. They want to see a story: why you made each choice, how your interest in finance developed, and why you’re in this room. A good walkthrough also steers the interview toward the experiences you most want to discuss.',
      },
      {
        kind: 'formula',
        title: 'The structure',
        lines: [
          '1. Background in one or two lines (where you’re from, school, major)',
          '2. The spark: the first experience that drew you to finance',
          '3. The thread: how each step built on the last',
          '4. The most relevant recent work, with a number',
          '5. The landing: why that led you to banking',
        ],
        note: '60-second version ≈ 150 words; 2-minute version ≈ 300 words.',
      },
      {
        kind: 'example',
        title: 'Your 60-second version',
        text: 'I grew up in Dubai and I’m now at Swarthmore studying economics and philosophy. My interest in finance started with my own business: I founded Ayah Apparel, a streetwear brand in the UAE, and built a three-statement model from our sales records to set prices and sourcing. Since then my work has become more directly financial. I built the model and investor deck behind Stratus Labs’ $250K pre-seed raise, which closed, and I build DCF and comps models for Clarus Capital at Swarthmore. That’s what led me to banking: I want to do this analysis on live transactions.',
      },
      {
        kind: 'p',
        text: 'For the 2-minute version, add Improve ME Institute (the six-submarket MECE framework and the variant-view recommendation), 180 Degrees Consulting and one line on Dubai College. Practice both versions until you can deliver them naturally, then use the Story Bank (Phase 9) to keep them in sync with your resume.',
      },
      {
        kind: 'h',
        text: 'Expect every bullet to be probed',
      },
      {
        kind: 'list',
        items: [
          'Stratus Labs: what was in the model, which assumption mattered most, how you chose investors.',
          'Ayah Apparel: how the three statements linked, what decision the model changed, results.',
          'Clarus Capital: walk me through a DCF you built; what did the reverse DCF tell you?',
          'TCS externship: why a decision tree over logistic regression?',
        ],
      },
      {
        kind: 'trap',
        title: 'The list trap',
        text: '“Then I did X. Then I did Y.” is a list, not a story. Use linking phrases (“that got me interested in…”, “building on that…”, “which is what led me to…”) so the interviewer hears why each step followed the last.',
      },
    ],
    sixtySecond:
      'Walk through your resume as a story: background in a line, the spark (Ayah Apparel’s model), the thread to more financial work (Stratus Labs’ $250K raise, Clarus Capital), then land on why banking. Have a 60-second (≈ 150 words) and 2-minute (≈ 300 words) version, link the steps, and be ready for two levels of follow-up on every bullet.',
  },
  {
    id: 'fit-l2',
    sectionId: 'fit',
    order: 2,
    title: 'Why banking, why this firm',
    minutes: 8,
    blocks: [
      {
        kind: 'p',
        text: '“Why investment banking?” tests whether you understand the job and have tested your interest. “Why our firm?” tests whether you’ve done your homework. Both need specifics; generic answers are the most common reason good candidates get dinged on fit.',
      },
      {
        kind: 'formula',
        title: 'Why IB: three parts',
        lines: [
          'Story: how you first got interested (a real moment)',
          'Evidence: what you’ve done that’s close to the work',
          'Forward: what you want to learn and do as an analyst',
        ],
        note: 'Don’t lead with money, prestige or exit opportunities.',
      },
      {
        kind: 'formula',
        title: 'Why this firm: three parts',
        lines: ['A deal or sector strength you’ve researched', 'People you’ve spoken to and what you learned', 'Why that fits you specifically'],
      },
      {
        kind: 'table',
        caption: 'Elite boutiques at a glance',
        headers: ['Firm', 'Known for'],
        rows: [
          ['Centerview Partners', 'Large strategic M&A with very lean teams'],
          ['Evercore', 'Large independent advisory franchise; also restructuring and equity research'],
          ['PJT Partners', 'Spun off from Blackstone in 2015; strategic advisory, restructuring, Park Hill fund placement'],
          ['Lazard', 'Long-established global advisory firm with an asset management arm'],
          ['Moelis & Company', 'Founded 2007 by Ken Moelis; generalist M&A and restructuring'],
          ['Perella Weinberg Partners', 'Founded 2006; advisory and restructuring'],
          ['Qatalyst Partners', 'Technology-focused M&A, founded by Frank Quattrone'],
          ['Houlihan Lokey', 'Restructuring leader; middle-market M&A and fairness opinions'],
        ],
      },
      {
        kind: 'table',
        caption: 'Types of banks',
        headers: ['Type', 'What sets it apart'],
        rows: [
          ['Bulge bracket', 'Advisory plus lending, capital markets and trading; very large deals and a global platform'],
          ['Elite boutique', 'Pure advisory; lean teams; no balance sheet conflicts'],
          ['Middle market', 'Smaller deals and more of them; broad exposure for analysts'],
        ],
      },
      {
        kind: 'trap',
        title: 'Facts change',
        text: 'Leadership, headcount and league-table rankings change every year. Use this table to orient yourself, then check the firm’s recent deals and news in the Firm Tracker before each interview. Never quote a ranking you haven’t checked.',
      },
    ],
    sixtySecond:
      'Why IB = a real story of how you got interested, evidence you’ve tested it (Stratus Labs raise, Clarus Capital models) and what you want to learn. Never lead with money or exits. Why this firm = a deal or sector strength, a person you spoke to, and why it fits you. Know the boutique landscape (Centerview, Evercore, PJT, Lazard, Moelis, PWP, Qatalyst, Houlihan Lokey) and how bulge brackets and middle-market banks differ.',
  },
  {
    id: 'fit-l3',
    sectionId: 'fit',
    order: 3,
    title: 'Behavioral stories, strengths and weaknesses',
    minutes: 7,
    blocks: [
      {
        kind: 'p',
        text: 'Behavioral questions (“tell me about a time…”) check whether you’d be a reliable, coachable teammate at 2am. You don’t need a unique story for every question. You need six to eight strong stories, each of which can answer several kinds of question.',
      },
      {
        kind: 'formula',
        title: 'STAR',
        lines: ['Situation: one or two sentences of context', 'Task: what you needed to achieve', 'Action: what you did and why (most of the time)', 'Result: the outcome, with a number if possible, and what you learned'],
        note: 'Rough split: S 10%, T 10%, A 60%, R 20%.',
      },
      {
        kind: 'table',
        caption: 'Your stories mapped to themes',
        headers: ['Story', 'Themes it can cover'],
        rows: [
          ['Stratus Labs raise', 'Impact, tight deadline, working with senior people'],
          ['Ayah Apparel model', 'Initiative, analytical skill, learning quickly'],
          ['Improve ME recommendation', 'Variant view, persuasion, analysis'],
          ['Modelcore speaker network', 'Leadership, teamwork'],
          ['TCS credit risk analysis', 'Messy data, technical judgment, ethics'],
          ['Door of Awareness', 'Commitment, values, teaching'],
          ['Failure or mistake', '[your detail: pick a real one and own it]'],
        ],
      },
      {
        kind: 'h',
        text: 'Strengths and weaknesses',
      },
      {
        kind: 'list',
        items: [
          'Strength: one clear strength, one example from your resume, one link to the analyst job.',
          'Weakness: a real one, when it hurt you, and what you’re actively doing about it.',
          'Avoid disguised strengths (“perfectionist”) and weaknesses at the heart of the job (attention to detail).',
        ],
      },
      {
        kind: 'trap',
        title: 'Ownership',
        text: 'In a failure or conflict story, never make someone else the problem. Use “I”, own the mistake, and spend the time on what you changed afterwards.',
      },
    ],
    sixtySecond:
      'Prepare six to eight STAR stories and map each to several themes (leadership, teamwork, failure, conflict, persuasion, deadlines). Spend most of each answer on your actions. For strengths, give one strength with one proof and a link to the job; for weaknesses, give a real one with a concrete fix that’s already underway. Always own your mistakes.',
  },
  {
    id: 'fit-l4',
    sectionId: 'fit',
    order: 4,
    title: 'Networking, superdays and closing well',
    minutes: 6,
    blocks: [
      {
        kind: 'p',
        text: 'Fit is judged across the whole process, not just in one answer: on networking calls, in how you follow up and in how you handle pressure on a superday. Small things add up.',
      },
      {
        kind: 'list',
        ordered: true,
        items: [
          'Networking calls: prepare two or three questions about their work and group; take notes.',
          'Follow-up: a specific thank-you within 24 hours; record the conversation in the Firm Tracker.',
          'Superday: several back-to-back interviews mixing technicals and fit; consistency across them matters.',
          'Close: ask good questions, thank the interviewer and send a short note afterwards.',
        ],
      },
      { kind: 'h', text: 'Good questions to ask' },
      {
        kind: 'list',
        items: [
          'What’s a deal you worked on here that you found most rewarding, and why?',
          'How has the group’s work in [sector] changed what analysts do?',
          'What separates the analysts who do best in their first year?',
        ],
      },
      {
        kind: 'table',
        caption: 'Judgment situations',
        headers: ['Situation', 'What to do'],
        rows: [
          ['Two deadlines conflict', 'Flag it early to both teams; ask who has priority'],
          ['You spot an error after sign-off', 'Check, then tell your associate immediately'],
          ['You don’t know a technical answer', 'Say so, reason out loud, don’t bluff'],
          ['Your story is challenged', 'Go deeper with specifics, stay calm'],
        ],
      },
      {
        kind: 'trap',
        title: 'Consistency across interviews',
        text: 'On a superday, interviewers compare notes. If your “why this firm” or your story about Stratus Labs changes between rooms, it looks rehearsed or untrue. Use the same core stories, told naturally.',
      },
    ],
    sixtySecond:
      'Fit is judged everywhere: networking calls, follow-ups and every superday room. Prepare questions, send specific thank-yous within 24 hours and track conversations. In judgment situations, communicate early, own errors and don’t bluff. Keep your stories consistent across interviews and close with thoughtful questions.',
  },
];
