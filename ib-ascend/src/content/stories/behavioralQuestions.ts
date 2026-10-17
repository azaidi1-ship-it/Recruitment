import type { BehavioralQuestion, CompetencyId } from '../../types/models';
import type { RubricPoint } from '../../types/questions';

/**
 * Behavioral question bank. Every question maps to its best one or two seed
 * stories, with a note on how to angle the story for that question. Rubrics
 * are generated (STAR structure plus a point for each competency) so offline
 * grading is consistent; an LLM grader can use the same points (Phase 10).
 */

type Match = [storyId: string, angle: string];

function q(id: string, prompt: string, category: BehavioralQuestion['category'], competencies: CompetencyId[], matches: Match[]): BehavioralQuestion {
  return {
    id,
    prompt,
    category,
    competencies,
    storyMatches: matches.map(([storyId, angle]) => ({ storyId, angle })),
    rubric: [],
  };
}

const BANK: BehavioralQuestion[] = [
  // ── Core ──
  q('bq-01', 'Tell me about yourself.', 'core', ['analytical', 'initiative'], [
    ['st-ayah-model', 'Open with where your interest in finance started: Lumiere sparked it, and building the model for Ayah Apparel made it practical.'],
    ['st-stratus-raise', 'Land on your most relevant, recent finance work and why it led to banking.'],
  ]),
  q('bq-02', 'Walk me through your resume.', 'core', ['analytical', 'initiative'], [
    ['st-ayah-model', 'Use it as the first step in the thread.'],
    ['st-stratus-raise', 'Use it as the high point before you land on banking.'],
  ]),
  q('bq-03', 'What is your greatest achievement?', 'core', ['greatest-achievement'], [
    ['st-stratus-raise', 'Lead with the $250K raise closing and your ownership of the model and deck.'],
    ['st-academics-balance', 'Alternative if you want a personal achievement: results while running a business.'],
  ]),
  q('bq-04', 'What is your biggest weakness?', 'core', ['criticism', 'adaptability'], [
    ['st-dc-maths', 'Use the Maths B as evidence of a past gap and what you did to close it.'],
    ['st-ayah-mistake', 'Name the habit behind the over-order (committing on TikTok buzz before checking sell-through) and your fix: sizing from the model and pre-orders.'],
  ]),
  q('bq-05', 'What is your greatest strength?', 'core', ['analytical'], [
    ['st-ayah-model', 'Strength: turning raw sales records into a model that drives pricing and sourcing decisions.'],
    ['st-stratus-raise', 'Second proof of the same strength, with an outcome.'],
  ]),
  q('bq-06', 'Tell me about a time you failed.', 'core', ['failure'], [
    ['st-ayah-mistake', 'Own the mistake in the first sentence; spend most of the time on the fix and the process change.'],
    ['st-clarus-backtest', 'The backtest that looked too good: the look-ahead bias, how you found it by tracing trades, and the corrected Sharpe ratio.'],
  ]),
  q('bq-07', 'Tell me about a time you made a mistake under pressure.', 'core', ['failure', 'pressure'], [
    ['st-clarus-backtest', 'Stress that you caught the look-ahead bias yourself and reported the corrected result, even though the Sharpe fell from about 1.1 to 0.6.'],
    ['st-ayah-mistake', 'The pressure was early TikTok buzz pushing you to order fast; explain how it led you to skip the sell-through check.'],
  ]),
  q('bq-08', 'Tell me about a time you disagreed with a teammate.', 'core', ['conflict', 'teamwork'], [
    ['st-modelcore-leadership', 'Use the autumn 2023 stall: show how you listened to the team and reset the outreach approach.'],
    ['st-180dc-engagement', 'A teammate wanted paid tutors: show how you asked what worried them (reliability) and compared both options on cost per retained tutor.'],
  ]),
  q('bq-09', 'Tell me about a time you led without formal authority.', 'core', ['leadership', 'persuasion'], [
    ['st-mun-trainer', 'As a trainer you developed junior delegates: explain how you got them to take your advice beyond what the title alone gave you.'],
    ['st-stratus-investors', 'As an advisor you shaped the fundraising strategy and investor targeting: explain how you got the team to adopt your view.'],
  ]),
  q('bq-10', 'What is the most difficult decision you’ve made?', 'core', ['analytical', 'pressure'], [
    ['st-improveme-variant', 'Choosing to back a non-obvious recommendation over the safe one.'],
    ['st-clarus-backtest', 'Choosing to report the corrected, less exciting backtest result instead of the Sharpe of about 1.1.'],
  ]),
  q('bq-11', 'Tell me about a time you showed leadership.', 'core', ['leadership'], [
    ['st-modelcore-leadership', 'Clear ownership, follow-up and the speaker results.'],
    ['st-mun-trainer', 'Leadership as developing others.'],
  ]),
  q('bq-12', 'Tell me about a time you worked in a team to achieve a goal.', 'core', ['teamwork'], [
    ['st-180dc-engagement', 'Your workstream and how it fit with the rest of the team.'],
    ['st-modelcore-leadership', 'A team goal with a concrete result.'],
  ]),
  q('bq-13', 'Why should we hire you?', 'core', ['greatest-achievement', 'analytical'], [
    ['st-stratus-raise', 'Proof you can already do analyst work that affects an outcome.'],
    ['st-academics-balance', 'Proof you can handle a heavy workload.'],
  ]),
  q('bq-14', 'How would your friends or teammates describe you?', 'core', ['teamwork', 'client-focus'], [
    ['st-mun-trainer', 'Back the adjective with how you helped others improve.'],
    ['st-fitness-retention', 'Reliable and consistent: you built to five recurring clients over two years; mention the client who nearly quit and then stayed another year.'],
  ]),

  // ── Motivation ──
  q('bq-15', 'Why investment banking?', 'motivation', ['initiative'], [
    ['st-ayah-model', 'The origin: Lumiere sparked your interest, and the Ayah model was where you first saw numbers drive real decisions.'],
    ['st-stratus-raise', 'The evidence: you’ve done the work, and it was the first time your analysis decided a real outcome.'],
  ]),
  q('bq-16', 'Why investment banking and not consulting?', 'motivation', ['analytical'], [
    ['st-180dc-engagement', 'Respect consulting: say what you valued in the 180 Degrees work.'],
    ['st-stratus-raise', 'Contrast: a transaction where your model and deck were behind a raise that closed.'],
  ]),
  q('bq-17', 'Why our firm?', 'motivation', ['client-focus'], [
    ['st-stratus-raise', 'Link the firm’s lean teams and client exposure to how you worked at Stratus.'],
  ]),
  q('bq-18', 'Why an elite boutique rather than a bulge bracket?', 'motivation', ['client-focus', 'initiative'], [
    ['st-stratus-raise', 'Link working directly with the Stratus founders on the model, deck and investor list to lean boutique teams.'],
    ['st-ayah-model', 'Founder experience: you want real responsibility early.'],
  ]),
  q('bq-19', 'You study economics and philosophy. Why finance?', 'motivation', ['analytical'], [
    ['st-swarthmore-major', 'The combination is the point: models plus testing assumptions.'],
    ['st-clarus-reverse-dcf', 'Evidence you apply both in finance.'],
  ]),
  q('bq-20', 'Where do you see yourself in five years?', 'motivation', ['initiative'], [
    ['st-stratus-raise', 'Show you want to grow into advising clients on transactions.'],
  ]),
  q('bq-21', 'What do you think an analyst does day to day?', 'motivation', ['detail', 'time-management'], [
    ['st-improveme-reports', 'Accurate materials on a deadline for senior people.'],
    ['st-stratus-raise', 'Building the model and deck behind a raise; explain how you checked one against the other.'],
  ]),
  q('bq-22', 'Are you ready for the hours?', 'motivation', ['time-management', 'pressure'], [
    ['st-academics-balance', 'Proof: A-Levels plus a business plus a society.'],
    ['st-stratus-bd', 'Remote work across time zones alongside university.'],
  ]),
  q('bq-23', 'What do you want to learn in your first year?', 'motivation', ['adaptability'], [
    ['st-cs-python', 'Show how you learn: apply a new tool to a real problem straight away.'],
  ]),
  q('bq-24', 'Why do you want to work in the US rather than in Dubai?', 'motivation', ['adaptability'], [
    ['st-stratus-bd', 'You’ve already worked with a San Francisco company and US-scale prospects.'],
    ['st-swarthmore-major', 'Explain why you chose to study in the US.'],
  ]),

  // ── Resume probes ──
  q('bq-25', 'Tell me about founding Ayah Apparel.', 'resume', ['initiative', 'analytical'], [
    ['st-ayah-model', 'Lead with the model and the decision it changed.'],
    ['st-ayah-channels', 'Add the e-commerce and TikTok build if asked about growth.'],
  ]),
  q('bq-26', 'Walk me through your work at Stratus Labs.', 'resume', ['analytical', 'greatest-achievement'], [
    ['st-stratus-raise', 'The model and deck, then the outcome.'],
    ['st-stratus-bd', 'Mention the BD work only briefly unless asked.'],
  ]),
  q('bq-27', 'What exactly did you build at Stratus Labs, and which assumption mattered most?', 'resume', ['analytical', 'detail'], [
    ['st-stratus-raise', 'Name the key driver (pilot-to-paid conversion) and how you tested it with base, downside and upside cases.'],
  ]),
  q('bq-28', 'What have you learned from building valuation models at Clarus Capital?', 'resume', ['analytical'], [
    ['st-clarus-reverse-dcf', 'The reverse DCF insight: argue about expectations, not targets.'],
    ['st-clarus-backtest', 'What backtesting taught you: be most suspicious of the results that look best.'],
  ]),
  q('bq-29', 'Pitch me the stock you analyzed at Clarus Capital.', 'resume', ['persuasion', 'analytical'], [
    ['st-clarus-reverse-dcf', 'Recommendation first, then what the price implies vs your view.'],
  ]),
  q('bq-30', 'Tell me about your internship at the Improve ME Institute.', 'resume', ['analytical', 'persuasion'], [
    ['st-improveme-variant', 'The six-submarket analysis and the variant view.'],
    ['st-improveme-reports', 'The reporting work if asked what else you did.'],
  ]),
  q('bq-31', 'What did you do on your 180 Degrees Consulting engagement?', 'resume', ['client-focus', 'teamwork'], [
    ['st-180dc-engagement', 'Your workstream, the MECE structure and the recommendation.'],
  ]),
  q('bq-32', 'Tell me about your Tata Consultancy Services externship.', 'resume', ['analytical', 'ethics'], [
    ['st-tcs-model', 'The modeling choice and why.'],
    ['st-tcs-ethics', 'The governance framework if they ask about AI risk.'],
  ]),
  q('bq-33', 'Why did you choose a decision tree over logistic regression?', 'resume', ['analytical', 'detail'], [
    ['st-tcs-model', 'Explain the metrics and the business reason, simply.'],
  ]),
  q('bq-34', 'Tell me about your Lumiere research paper.', 'resume', ['analytical', 'initiative'], [
    ['st-lumiere-memo', 'Market sizing and the diligence-memo structure.'],
  ]),
  q('bq-35', 'What did you do as vice president of Modelcore?', 'resume', ['leadership', 'persuasion'], [
    ['st-modelcore-leadership', 'Team structure and results.'],
    ['st-modelcore-outreach', 'How you got executives to say yes.'],
  ]),
  q('bq-36', 'Tell me about your work with Door of Awareness.', 'resume', ['client-focus', 'analytical'], [
    ['st-door-teaching', 'The weekly teaching and what it taught you.'],
    ['st-door-fundraising', 'The fundraising models, for a finance angle.'],
  ]),
  q('bq-37', 'Tell me about your Model United Nations experience.', 'resume', ['analytical', 'leadership'], [
    ['st-mun-researcher', 'Best Researcher: preparation that held up under pressure.'],
    ['st-mun-trainer', 'Training junior delegates.'],
  ]),
  q('bq-38', 'How did you build a coaching business to five clients?', 'resume', ['client-focus', 'initiative'], [
    ['st-fitness-retention', 'Acquisition, then retention as the real measure.'],
  ]),
  q('bq-39', 'What was your EPQ about?', 'resume', ['initiative', 'analytical'], [
    ['st-dc-epq', 'The question, the method and the A*.'],
  ]),
  q('bq-40', 'You got a B in A-Level Maths. Should we worry about your quantitative skills?', 'resume', ['failure', 'adaptability'], [
    ['st-dc-maths', 'Answer directly: what went wrong, what you did, and the models you’ve built, including the DCF and comps models at Clarus since then.'],
  ]),
  q('bq-41', 'How do you use Python in your work?', 'resume', ['adaptability', 'analytical'], [
    ['st-cs-python', 'Where you learned it and a concrete use.'],
  ]),

  // ── Competencies ──
  q('bq-42', 'Tell me about a time you worked under a tight deadline.', 'competency', ['pressure', 'time-management'], [
    ['st-stratus-raise', 'About three weeks to get the model and deck ready before investor meetings, alongside university; explain how you prioritized.'],
    ['st-academics-balance', 'Exam season while running a business.'],
  ]),
  q('bq-43', 'Describe a time you had to manage competing priorities.', 'competency', ['time-management'], [
    ['st-academics-balance', 'Your system for A-Levels, Ayah Apparel and Modelcore.'],
    ['st-stratus-bd', 'BD discussions and the fundraise at the same time.'],
  ]),
  q('bq-44', 'Tell me about a time you persuaded someone to change their mind.', 'competency', ['persuasion'], [
    ['st-improveme-variant', 'You took a variant view to the founders with transparent numbers, and they added Silicon Oasis to their shortlist.'],
    ['st-stratus-investors', 'Investors pushed back on customer acquisition cost; explain the CAC and payback sensitivity you added.'],
  ]),
  q('bq-45', 'Tell me about a time you went above and beyond.', 'competency', ['initiative'], [
    ['st-lumiere-memo', 'You turned a research paper into a diligence memo.'],
    ['st-ayah-channels', 'You built the site and the channel yourself.'],
  ]),
  q('bq-46', 'Tell me about a time you received critical feedback.', 'competency', ['criticism'], [
    ['st-stratus-raise', 'Investor questions about customer acquisition cost changed your model: explain the sensitivity you added.'],
    ['st-dc-maths', 'Feedback from a result, and how you responded.'],
  ]),
  q('bq-47', 'Tell me about a time you had to learn something new quickly.', 'competency', ['adaptability'], [
    ['st-cs-python', 'Python, applied immediately.'],
    ['st-ayah-channels', 'E-commerce and TikTok creative from scratch.'],
  ]),
  q('bq-48', 'Describe a time you faced an ethical dilemma.', 'competency', ['ethics'], [
    ['st-tcs-ethics', 'Fairness versus accuracy in a credit model.'],
    ['st-clarus-backtest', 'Reporting the corrected, less flattering backtest result rather than the exciting one.'],
  ]),
  q('bq-49', 'Tell me about a time you dealt with a difficult client or customer.', 'competency', ['client-focus', 'conflict'], [
    ['st-fitness-difficult', 'Show how you responded, what you changed in the plan, and how you checked progress.'],
  ]),
  q('bq-50', 'Tell me about a time you had to adapt to a big change.', 'competency', ['adaptability'], [
    ['st-swarthmore-major', 'Moving from Dubai to a US liberal arts college.'],
    ['st-door-teaching', 'Use how you adapt your lessons for your students.'],
  ]),
  q('bq-51', 'Give an example of your attention to detail.', 'competency', ['detail'], [
    ['st-stratus-raise', 'Explain how you checked the deck against the model.'],
    ['st-improveme-reports', 'Checking reports before they went to leadership.'],
  ]),
  q('bq-52', 'Tell me about a time you caught an error before it caused a problem.', 'competency', ['detail', 'ethics'], [
    ['st-clarus-backtest', 'The look-ahead bias you caught before the fund relied on the result.'],
    ['st-improveme-reports', 'An error you caught in a report.'],
  ]),
  q('bq-53', 'Tell me about a time you used data to make a recommendation.', 'competency', ['analytical', 'persuasion'], [
    ['st-improveme-variant', 'Six submarkets, yields and price growth.'],
    ['st-tcs-model', 'Model choice backed by metrics.'],
  ]),
  q('bq-54', 'Tell me about a time you took initiative.', 'competency', ['initiative'], [
    ['st-ayah-model', 'You chose to build the model yourself; say why.'],
    ['st-lumiere-memo', 'Choosing an ambitious structure for your paper.'],
  ]),
  q('bq-55', 'Describe a time you worked with people from very different backgrounds.', 'competency', ['teamwork', 'adaptability'], [
    ['st-door-teaching', 'Your students in Lahore: who they are and how you adapt your teaching for them.'],
    ['st-stratus-bd', 'Fortune 500 prospects and AI labs.'],
  ]),
  q('bq-56', 'Tell me about a time you had to deliver bad news.', 'competency', ['ethics', 'client-focus'], [
    ['st-clarus-backtest', 'Telling the group the Sharpe fell from about 1.1 to 0.6 once the bug was fixed.'],
    ['st-ayah-mistake', 'Telling your supplier straight away that the next order would be smaller and later.'],
  ]),
  q('bq-57', 'Tell me about a time you had to influence senior people.', 'competency', ['persuasion', 'client-focus'], [
    ['st-modelcore-outreach', 'C-suite executives with no reason to say yes.'],
    ['st-improveme-variant', 'Founders, with a contrarian recommendation.'],
  ]),
  q('bq-58', 'Tell me about a time you motivated others.', 'competency', ['leadership', 'teamwork'], [
    ['st-modelcore-leadership', 'Keeping a team going for almost two years.'],
    ['st-mun-trainer', 'The delegate who froze when challenged, and the practice rebuttals you ran with her.'],
  ]),
  q('bq-59', 'Tell me about a time a project didn’t go to plan.', 'competency', ['failure', 'adaptability'], [
    ['st-clarus-backtest', 'The backtest that looked too good, and what changed once you fixed it.'],
    ['st-ayah-mistake', 'A business decision that went wrong.'],
  ]),
  q('bq-60', 'Tell me about a time you had to work with incomplete or messy data.', 'competency', ['analytical', 'detail'], [
    ['st-tcs-model', 'Diagnosing data-quality issues before modeling.'],
    ['st-ayah-model', 'Building a model from raw sales records.'],
  ]),
  q('bq-61', 'How do you handle stress?', 'competency', ['pressure'], [
    ['st-mun-researcher', 'Preparation is what lets you stay clear under pressure.'],
    ['st-academics-balance', 'Your system when everything collides.'],
  ]),
  q('bq-62', 'Tell me about a time you set a goal and achieved it.', 'competency', ['initiative', 'greatest-achievement'], [
    ['st-fitness-retention', 'Five recurring clients over two years.'],
    ['st-dc-epq', 'An A* in a self-directed project.'],
  ]),
  q('bq-63', 'Tell me about a time you put a client’s needs first.', 'competency', ['client-focus'], [
    ['st-180dc-engagement', 'The director’s cost constraint and how you cut the plan to low-cost steps.'],
    ['st-fitness-difficult', 'Changing the plan around what the client wanted.'],
  ]),
  q('bq-64', 'Tell me about a time you explained something complex simply.', 'competency', ['client-focus', 'persuasion'], [
    ['st-door-teaching', 'Explaining a concept a new way.'],
    ['st-tcs-model', 'Explaining the decision tree as if-then rules, like a loan officer’s checklist.'],
  ]),
  q('bq-65', 'Tell me about a time you were wrong.', 'competency', ['failure', 'criticism'], [
    ['st-clarus-backtest', 'Your first backtest result was wrong: the look-ahead bias and what you changed.'],
    ['st-fitness-difficult', 'You focused on the long-term target and missed how the daily scale swings felt to her.'],
  ]),
  q('bq-66', 'Tell me about a time you managed a team through a setback.', 'competency', ['leadership', 'adaptability'], [
    ['st-modelcore-leadership', 'The autumn 2023 stall when cold emails got no replies, and how you rebuilt the outreach.'],
  ]),
  q('bq-67', 'Tell me about a time you balanced accuracy against speed.', 'competency', ['detail', 'pressure'], [
    ['st-stratus-raise', 'Explain how you balanced speed and accuracy on the model and deck.'],
    ['st-improveme-reports', 'Reports on a deadline that still had to be right.'],
  ]),

  // ── Curveballs ──
  q('bq-68', 'If you could redo one experience on your resume, what would you do differently?', 'curveball', ['failure', 'criticism'], [
    ['st-ayah-mistake', 'Say what you would do differently at Ayah Apparel, and why.'],
  ]),
  q('bq-69', 'Tell me something about yourself that isn’t on your resume.', 'curveball', ['initiative'], [
    ['st-door-teaching', 'Mention running half-marathons, or bridge to what teaching taught you about yourself.'],
  ]),
  q('bq-70', 'What’s the last book you read, and what did you take from it?', 'curveball', ['analytical'], [
    ['st-swarthmore-major', 'Connect it to how you think about assumptions.'],
  ]),
  q('bq-71', 'Convince me you’ll still be motivated at 2am on a Saturday.', 'curveball', ['pressure', 'time-management'], [
    ['st-academics-balance', 'Evidence you’ve chosen hard workloads before.'],
    ['st-stratus-raise', 'Say what motivated you during the raise.'],
  ]),
  q('bq-72', 'What would you do if your MD asked you to change a number you believed was correct?', 'curveball', ['ethics', 'persuasion'], [
    ['st-clarus-backtest', 'You report what the analysis shows and explain it.'],
    ['st-tcs-ethics', 'Defensibility matters as much as the answer.'],
  ]),
  q('bq-73', 'Tell me about a time you had to say no.', 'curveball', ['time-management', 'persuasion'], [
    ['st-academics-balance', 'What you gave up to keep your priorities.'],
  ]),
  q('bq-74', 'What’s something you believe that most people disagree with?', 'curveball', ['analytical', 'persuasion'], [
    ['st-improveme-variant', 'You’re comfortable holding a variant view when the numbers support it.'],
    ['st-clarus-reverse-dcf', 'The market can misprice expectations.'],
  ]),
  q('bq-75', 'What would your previous manager say you need to work on?', 'curveball', ['criticism'], [
    ['st-stratus-raise', 'Investor questions about customer acquisition cost during the raise, and the sensitivity you added.'],
    ['st-improveme-reports', 'Feedback on a report and how you used it.'],
  ]),
  q('bq-76', 'You’ve run your own business. Why would you want to be a junior employee?', 'curveball', ['adaptability', 'teamwork'], [
    ['st-ayah-model', 'Running Ayah alone, e.g. the over-order, showed you how much you still have to learn from experienced people.'],
    ['st-stratus-raise', 'Say what you liked about advising at Stratus compared with running your own business.'],
  ]),
  q('bq-77', 'Tell me about a time you had to work with someone you didn’t get along with.', 'curveball', ['conflict', 'teamwork'], [
    ['st-180dc-engagement', 'Focus on the work and the shared goal.'],
    ['st-modelcore-leadership', 'When the team was frustrated by the outreach stall, show how you kept it focused and professional.'],
  ]),
  q('bq-78', 'What’s the biggest risk you’ve taken?', 'curveball', ['initiative', 'pressure'], [
    ['st-ayah-model', 'Starting a business at school.'],
    ['st-improveme-variant', 'Putting your name to a contrarian recommendation.'],
  ]),
  q('bq-79', 'Describe a time you had to make a decision without all the information.', 'curveball', ['analytical', 'pressure'], [
    ['st-stratus-raise', 'Building forecasts for an early-stage company.'],
    ['st-mun-researcher', 'Responding to new developments in session.'],
  ]),
  q('bq-80', 'How do you handle a manager who gives you vague instructions?', 'curveball', ['client-focus', 'adaptability'], [
    ['st-180dc-engagement', 'Structuring an ambiguous problem and checking in early.'],
  ]),
];

const COMPETENCY_KEYWORDS: Record<CompetencyId, string> = {
  leadership: 'led|lead|team|ownership|delegat*',
  teamwork: 'team*|together|we|colleague*',
  conflict: 'disagree*|conflict|frustrat*|listen*',
  failure: 'mistake|fail*|wrong|own*',
  initiative: 'built|started|founded|chose|initiative|myself',
  pressure: 'deadline|pressure|time|quickly',
  detail: 'check*|detail|accura*|tie*|error*',
  analytical: 'model*|data|analys*|numbers|framework',
  persuasion: 'convinc*|persuad*|recommend*|pitch*|case',
  ethics: 'fair*|honest*|right thing|ethic*|complian*',
  adaptability: 'adapt*|learn*|new|chang*',
  criticism: 'feedback|criticism|critic*|improv*',
  'time-management': 'prioriti*|schedule|time|balanc*',
  'client-focus': 'client*|customer*|needs|wanted',
  'greatest-achievement': 'proud*|closed|achiev*|result*',
};

/** Rubric for offline grading: STAR structure plus one point per competency. */
export function behavioralRubric(question: BehavioralQuestion): RubricPoint[] {
  return [
    { id: 'situation', point: 'Sets the scene briefly: where, when and what was at stake', keywords: [['at|when|during|in my|while']], weight: 1 },
    { id: 'action', point: 'Spends most of the answer on what you personally did (“I …”)', keywords: [['i built|i led|i decided|i asked|i changed|i structured|i made|i took|i chose|i worked|i focused|i realized|i presented|i delivered|i set|i owned|i used|i tested|i found|i reported']], weight: 2 },
    { id: 'result', point: 'Gives a concrete result, ideally with a number', keywords: [['result*|outcome|closed|grew|increased|reduced|won|awarded|delivered|finished']], weight: 1 },
    { id: 'learning', point: 'Says what you learned and links it to banking', keywords: [['learn*|taught me|bank*|analyst']], weight: 1 },
    ...question.competencies.map((c) => ({
      id: `c-${c}`,
      point: `Shows ${c.replace('-', ' ')}`,
      keywords: [[COMPETENCY_KEYWORDS[c]]],
      weight: 1,
    })),
  ];
}

export const BEHAVIORAL_QUESTIONS: BehavioralQuestion[] = BANK.map((b) => ({ ...b, rubric: behavioralRubric(b).map(({ point, keywords, weight }) => ({ point, keywords, weight })) }));
