import type { Question } from '../../../types/questions';
import { builders } from '../../helpers';

const { mcq, rapid, order, free } = builders('fit');

/**
 * Fit & Behavioral. Model answers use only facts from the resume (and the
 * confirmed notes); anything else is a [your detail] placeholder to fill in
 * from the Story Bank.
 */
export const questions: Question[] = [
  // ── Resume walkthrough ──
  order(
    { id: 'fit-q-001', subtopic: 'resume-walkthrough', difficulty: 'basic', pools: ['pre', 'post'] },
    'Put the parts of a strong “walk me through your resume” answer in order.',
    [
      'Where you’re from and where you study, in one or two lines',
      'The first experience that sparked your interest in finance',
      'How each later experience built on the last (the thread)',
      'Your most relevant, recent finance work',
      'Why that led you to banking and to this interview',
    ],
    'Chronological, with a thread, landing on why you’re in the room.',
  ),
  mcq(
    { id: 'fit-q-002', subtopic: 'resume-walkthrough', difficulty: 'basic', pools: ['pre', 'post'] },
    'How long should your answer to “walk me through your resume” be in a first-round interview?',
    [
      ['About 60–120 seconds, with a version ready for each length', 'Long enough to show a thread, short enough to leave room for follow-ups.', true],
      ['About 10 seconds', 'Too short to show any story.'],
      ['Five minutes or more, covering every bullet', 'You’ll lose the interviewer.'],
      ['As long as it takes to read the resume aloud', 'They have the resume; give them the story behind it.'],
    ],
    'Prepare a 60-second and a 2-minute version.',
  ),
  mcq(
    { id: 'fit-q-003', subtopic: 'resume-walkthrough', difficulty: 'intermediate', pools: ['post'] },
    'What is the most common mistake in resume walkthroughs?',
    [
      ['Listing experiences one by one without explaining why you moved from each to the next', 'Interviewers want the logic behind your choices, not a recitation.', true],
      ['Mentioning where you grew up', 'A one-line background is fine.'],
      ['Ending with why you want banking', 'That’s exactly how it should end.'],
      ['Being under three minutes', 'Shorter is usually better.'],
    ],
    'Narrate the thread, not the list.',
  ),
  rapid(
    { id: 'fit-q-004', subtopic: 'resume-walkthrough', difficulty: 'basic', pools: ['pre', 'post'] },
    'Most people speak about 150 words per minute. Roughly how many words should a 2-minute walkthrough script be?',
    300,
    '150 × 2 = 300 words. A 60-second version is about 150.',
    { unit: 'words', seconds: 15, tolerance: { kind: 'abs', value: 0 } },
  ),
  mcq(
    { id: 'fit-q-005', subtopic: 'resume-walkthrough', difficulty: 'intermediate', pools: ['post', 'mock'] },
    'An interviewer points at a resume bullet and asks, “What exactly did you do here?” What’s the best approach?',
    [
      ['Describe your own specific actions, the tools you used and the result, using “I” rather than “we”', 'They’re testing whether you did the work and understand it.', true],
      ['Describe what the whole team did', 'They want your role.'],
      ['Repeat the bullet word for word', 'Adds nothing.'],
      ['Exaggerate to sound more impressive', 'Follow-ups will expose it.'],
    ],
    'Assume every bullet will be probed two levels deep.',
  ),
  mcq(
    { id: 'fit-q-006', subtopic: 'resume-walkthrough', difficulty: 'advanced', pools: ['mock'] },
    'Your resume says you built a three-statement model for your business. Which follow-up should you be most ready for?',
    [
      ['“Walk me through how the three statements were linked and which assumption mattered most”', 'Anything technical on your resume is fair game for technical questions.', true],
      ['“What font did you use?”', 'Not a real follow-up.'],
      ['“How many tabs did it have?”', 'Unlikely and unimportant.'],
      ['None: interviewers never ask about resume models', 'They very often do.'],
    ],
    'Your resume sets the technical agenda.',
  ),
  free(
    { id: 'fit-q-007', subtopic: 'resume-walkthrough', difficulty: 'intermediate', pools: ['mock'], followUps: ['fit-q-008', 'fit-q-027'] },
    'Walk me through your resume.',
    [
      ['background', 'Background in a line or two', [['dubai|swarthmore']]],
      ['spark', 'What first sparked the interest in finance', [['ayah|three statement|first']]],
      ['thread', 'A thread connecting each step', [['which led|that led|since then|that got me|building on']]],
      ['finance', 'Recent, relevant finance work with a number', [['stratus|clarus'], ['250*|dcf|comps']]],
      ['close', 'Lands on why banking', [['bank*|analyst']]],
    ],
    'I went to school in Dubai, at Dubai College, and I’m now at Swarthmore studying economics and philosophy. [your detail: where your interest in finance started, e.g. with my own business]: in December 2023 I founded Ayah Apparel, a streetwear brand in the UAE, and built a three-statement model from our sales records to set prices and sourcing. [your detail: what that experience showed you about finance]. Building on that, I interned at Improve ME Institute, where I built a MECE framework across six Dubai submarkets, quantifying yields and price growth, and made a variant-view expansion recommendation to the founders. Since then my work has become more directly financial: I built the model and investor deck behind Stratus Labs’ $250K pre-seed raise, which closed, and at Swarthmore I build DCF and comps models for Clarus Capital and work on strategy projects with 180 Degrees Consulting. Now I want to do this kind of analysis in banking, on live transactions, with a team that will push me much further.',
    'Thread: building things → numbers drive decisions → increasingly financial work → banking.',
    120,
  ),
  free(
    { id: 'fit-q-008', subtopic: 'resume-walkthrough', difficulty: 'advanced', pools: ['mock'] },
    'Tell me about the Stratus Labs raise. What did you actually build?',
    [
      ['context', 'What Stratus Labs is and the goal of the raise', [['stratus'], ['pre seed|raise|fundrais*']]],
      ['model', 'What the model contained and which assumptions drove it', [['model'], ['assumption*|driver*|revenue|burn']]],
      ['deck', 'The deck and investor targeting', [['deck|investor*']]],
      ['result', 'The outcome: the $250K raise closed', [['250*|closed']]],
      ['learning', 'What it taught you', [['learn*|taught']]],
    ],
    'Stratus Labs is an early-stage company based in San Francisco, and I worked with them remotely from October to December 2025 as an advisor and analyst. The goal was a pre-seed raise. I built the financial model, with [your detail: the revenue build, key drivers and burn assumptions], and the investor pitch deck that presented it, and I helped shape which investors to target and directed the outreach. I also supported business development conversations with Fortune 500 prospects and frontier AI labs, including xAI. The $250K raise closed. The biggest thing I learned was [your detail: e.g. how investors pressure-test the assumptions that drive the whole model].',
    'Be ready for: which assumption mattered most, how you picked investors, what you’d change.',
    90,
  ),
  mcq(
    { id: 'fit-q-009', subtopic: 'resume-walkthrough', difficulty: 'intermediate', pools: ['post'] },
    'You study economics and philosophy. How should you frame a non-finance major?',
    [
      ['As an asset: it trained you to build arguments and test assumptions, and your finance work proves the technical side', 'Turn the question into evidence of fit.', true],
      ['Apologize for it', 'Never apologize for your background.'],
      ['Say you picked it by accident', 'Undercuts your judgment.'],
      ['Claim you’ll switch to finance', 'Unnecessary and unconvincing.'],
    ],
    'Major + finance experience = a complete story.',
  ),

  // ── Why IB ──
  mcq(
    { id: 'fit-q-010', subtopic: 'why-ib', difficulty: 'basic', pools: ['pre', 'post'] },
    'Which is the strongest “why investment banking” answer?',
    [
      ['A specific story of how you got interested, evidence you’ve tested that interest, and what you want to learn as an analyst', 'Personal, proven and forward-looking.', true],
      ['“Because it pays well”', 'True for many, but a weak answer.'],
      ['“Because it has prestige and exit opportunities”', 'Signals you want to leave.'],
      ['“I’ve always loved finance”', 'Too generic without evidence.'],
    ],
    'Story + evidence + what you’ll learn.',
  ),
  mcq(
    { id: 'fit-q-011', subtopic: 'why-ib', difficulty: 'intermediate', pools: ['post', 'mock'] },
    'Why is mentioning “exit opportunities” in your why-IB answer a mistake?',
    [
      ['It suggests you see banking only as a stepping stone and may leave as soon as you can', 'Banks invest heavily in training analysts.', true],
      ['Exit opportunities don’t exist', 'They do, but it’s the wrong thing to lead with.'],
      ['Interviewers have never heard of them', 'They have.'],
      ['It’s fine to lead with it', 'It undermines your commitment.'],
    ],
    'Talk about what you want to learn and do, not where you go next.',
  ),
  mcq(
    { id: 'fit-q-012', subtopic: 'why-ib', difficulty: 'intermediate', pools: ['post'] },
    'Which description best matches what a summer analyst actually does?',
    [
      ['Builds and updates models and comps, prepares pitch book and deal materials, researches companies and supports the deal team on live transactions', 'Lots of Excel and PowerPoint, attention to detail and long hours.', true],
      ['Leads client negotiations', 'That’s senior bankers.'],
      ['Makes the final investment decisions', 'Bankers advise; clients decide.'],
      ['Trades securities all day', 'That’s sales & trading.'],
    ],
    'Show you know the job.',
  ),
  mcq(
    { id: 'fit-q-013', subtopic: 'why-ib', difficulty: 'advanced', pools: ['mock'] },
    '“Why banking and not consulting?” You’ve done consulting work. What’s the best angle?',
    [
      ['Acknowledge what you enjoyed in consulting (structure, problem solving), then explain that you want to work on transactions, where financial analysis decides a concrete outcome', 'Shows you made an informed choice, not a default.', true],
      ['Say consulting is boring', 'Disrespectful and unconvincing.'],
      ['Say you’d take either', 'Signals no conviction.'],
      ['Avoid mentioning your consulting work', 'It’s on your resume; use it.'],
    ],
    'Contrast, don’t criticize.',
  ),
  free(
    { id: 'fit-q-014', subtopic: 'why-ib', difficulty: 'intermediate', pools: ['mock'], followUps: ['fit-q-011', 'fit-q-013'] },
    'Why investment banking rather than consulting?',
    [
      ['consulting', 'What you’ve seen of consulting work', [['consulting|180']]],
      ['transactions', 'Banking is about transactions and financial analysis that decide an outcome', [['transaction*|deal*|raise']]],
      ['evidence', 'Evidence from your own experience', [['stratus|clarus|model*']]],
      ['learning', 'What you want to learn', [['learn*']]],
    ],
    'I’ve done strategy work with 180 Degrees Consulting, structuring problems for nonprofit clients, and [your detail: what you value in it]. But [your detail: why transaction work engages you more]. At Stratus Labs, I built the model and deck behind a $250K pre-seed raise that closed, and at Clarus Capital my DCF and comps models support equity research and portfolio analysis for the club’s fund. Banking puts that kind of analysis at the center of live transactions, and that’s what I want to learn: how deals are valued, negotiated and closed.',
    'Respect consulting, then show why transactions pull you more.',
    60,
  ),
  mcq(
    { id: 'fit-q-015', subtopic: 'why-ib', difficulty: 'basic', pools: ['pre', 'post'] },
    'An interviewer asks, “Do you know what the hours are like?” What’s the best response?',
    [
      ['Yes: acknowledge long and unpredictable hours, and explain concretely why you’re prepared (times you’ve sustained intense workloads)', 'Show realism and evidence, not bravado.', true],
      ['Say you’ll negotiate shorter hours', 'Not how it works.'],
      ['Say you love working all night', 'Sounds naive.'],
      ['Change the subject', 'Avoidance is a red flag.'],
    ],
    'Realism plus evidence of resilience.',
  ),

  // ── Why this firm ──
  mcq(
    { id: 'fit-q-016', subtopic: 'why-firm', difficulty: 'basic', pools: ['pre', 'post'] },
    'What makes a “why our firm” answer strong?',
    [
      ['Specifics: a deal or sector strength, conversations with people at the firm, and why that fits you', 'Generic praise (“great culture”) could apply to any bank.', true],
      ['Saying it’s the best bank on Wall Street', 'Flattery isn’t a reason.'],
      ['Mentioning the salary', 'Never.'],
      ['Saying you applied everywhere', 'Honest, but fatal.'],
    ],
    'Deal + person + fit.',
  ),
  mcq(
    { id: 'fit-q-017', subtopic: 'why-firm', difficulty: 'intermediate', pools: ['post', 'mock'] },
    'What are typical differences between a bulge bracket and an elite boutique?',
    [
      ['Bulge brackets offer advisory plus lending, capital markets and trading across many products; elite boutiques focus on advisory (M&A, restructuring) with leaner deal teams', 'Boutiques don’t lend; bulge brackets can finance deals off their balance sheet.', true],
      ['Elite boutiques have larger balance sheets', 'Bulge brackets do.'],
      ['Bulge brackets don’t do M&A', 'They do a lot of it.'],
      ['There is no difference', 'The business models differ.'],
    ],
    'Products and balance sheet vs pure advisory.',
  ),
  mcq(
    { id: 'fit-q-018', subtopic: 'why-firm', difficulty: 'elite', pools: ['mock'] },
    'Which firm is best known as a technology-focused advisory boutique?',
    [
      ['Qatalyst Partners', 'Founded by Frank Quattrone; focused on technology M&A.', true],
      ['Houlihan Lokey', 'Known for restructuring and middle-market M&A.'],
      ['Lazard', 'A global, diversified advisory firm with asset management.'],
      ['PJT Partners', 'Known for strategic advisory and restructuring.'],
    ],
    'Know each boutique’s angle before you interview there.',
  ),
  mcq(
    { id: 'fit-q-019', subtopic: 'why-firm', difficulty: 'elite', pools: ['mock'] },
    'Which pair of firms is best known for restructuring advisory?',
    [
      ['Houlihan Lokey and PJT Partners', 'Both have leading restructuring practices (alongside others such as Evercore, Lazard, Moelis and Perella Weinberg).', true],
      ['Qatalyst Partners and Centerview Partners', 'Both are best known for M&A, not restructuring.'],
      ['Only bulge brackets do restructuring', 'Boutiques lead much of it.'],
      ['Restructuring is done only by law firms', 'Banks advise on the financial side.'],
    ],
    'Restructuring is a core boutique strength.',
  ),
  mcq(
    { id: 'fit-q-020', subtopic: 'why-firm', difficulty: 'elite', pools: ['mock'] },
    'Which description best fits Centerview Partners?',
    [
      ['An independent advisory firm known for large strategic M&A with very lean teams, so analysts get unusual exposure', 'A common reason candidates give for targeting it.', true],
      ['A bank with a large lending business', 'It doesn’t lend.'],
      ['A restructuring-only shop', 'It is mainly known for M&A.'],
      ['A middle-market bank focused on small deals', 'It works mostly on large-cap deals.'],
    ],
    'Lean teams on large deals.',
  ),
  mcq(
    { id: 'fit-q-021', subtopic: 'why-firm', difficulty: 'advanced', pools: ['post', 'mock'] },
    'Which firm was spun off from Blackstone’s advisory business in 2015?',
    [
      ['PJT Partners', 'Also includes Park Hill, a fund placement business.', true],
      ['Evercore', 'Founded independently in 1995.'],
      ['Moelis & Company', 'Founded by Ken Moelis in 2007.'],
      ['Perella Weinberg Partners', 'Founded in 2006.'],
    ],
    'Know each firm’s origin story.',
  ),
  mcq(
    { id: 'fit-q-022', subtopic: 'why-firm', difficulty: 'intermediate', pools: ['post', 'mock'] },
    'You’re interviewing at a middle-market bank. Which reason for wanting to work there is strongest?',
    [
      ['Smaller deal teams and more deals per year mean more responsibility and broader exposure as an analyst', 'A specific, true advantage of the middle market.', true],
      ['It’s easier to get in than a bulge bracket', 'Never say this.'],
      ['The hours are always shorter', 'Not reliably true.'],
      ['You couldn’t get other interviews', 'Never say this.'],
    ],
    'Sell the real advantage of their platform.',
  ),
  free(
    { id: 'fit-q-023', subtopic: 'why-firm', difficulty: 'advanced', pools: ['mock'], followUps: ['fit-q-017', 'fit-q-022'] },
    'Why an elite boutique rather than a bulge bracket?',
    [
      ['advisory', 'Focus on pure advisory work', [['advisory|advice|independent']]],
      ['lean', 'Lean teams mean more responsibility and exposure', [['lean|small team*|exposure|responsibilit*']]],
      ['conflicts', 'No lending or balance sheet conflicts', [['conflict*|lending|balance sheet']]],
      ['fit', 'Why that fits you', [['stratus|ayah|my experience|fit*']]],
    ],
    'Two reasons. First, the work: elite boutiques focus on advisory, so the work is centered on strategic M&A and restructuring advice rather than selling lending or other products, and the advice is independent of any balance sheet conflicts. Second, the team structure: deal teams are lean, so analysts get real responsibility and exposure to senior bankers and clients early. That fits how I’ve worked so far. At Stratus Labs I built the model and deck behind the raise and shaped investor targeting, and at Ayah Apparel I ran the business myself. As an analyst I want [your detail: what you want more of, e.g. that level of responsibility and exposure].',
    'Advisory focus, independence, lean teams, and why it fits you.',
    60,
  ),
  free(
    { id: 'fit-q-024', subtopic: 'why-firm', difficulty: 'intermediate', pools: ['mock'] },
    'What do you know about our firm?',
    [
      ['business', 'What the firm does and where it’s strong', [['advis*|sector|group|restructuring|m&a']]],
      ['deal', 'A recent deal and why it was interesting', [['deal|transaction|advised']]],
      ['people', 'What you learned from people at the firm', [['spoke|spoken|met|conversation*']]],
      ['fit', 'How that connects to you', [['fit*|my experience|interest*']]],
    ],
    '[Firm] is [one-line description: e.g. an independent advisory firm founded in X, known for Y]. One recent deal I followed is [deal], where the firm advised [client] on [transaction]; it was interesting because [reason]. I also spoke with [name] in [group], who told me [specific point about the analyst experience]. That fits my interest in [sector or product] and my experience building models at Stratus Labs and Clarus Capital.',
    'Fill this per firm from the Firm Tracker.',
    60,
  ),

  // ── Strengths and weaknesses ──
  mcq(
    { id: 'fit-q-025', subtopic: 'strengths-weaknesses', difficulty: 'basic', pools: ['pre', 'post'] },
    'Which weakness answer is best?',
    [
      ['A real but manageable weakness, an example of when it hurt you and the concrete steps you’re taking to fix it', 'Self-awareness plus progress.', true],
      ['“I’m a perfectionist”', 'A disguised strength; interviewers roll their eyes.'],
      ['“I don’t have any weaknesses”', 'Shows no self-awareness.'],
      ['“I hate attention to detail”', 'A dealbreaker for an analyst.'],
    ],
    'Real, specific, improving.',
  ),
  mcq(
    { id: 'fit-q-026', subtopic: 'strengths-weaknesses', difficulty: 'intermediate', pools: ['post', 'mock'] },
    'Which weakness is risky to name for an analyst role?',
    [
      ['Lack of attention to detail', 'It’s core to the job; if you name it, the fix must be very convincing.', true],
      ['Public speaking nerves', 'Common and manageable.'],
      ['Taking on too much yourself instead of delegating', 'Common and manageable.'],
      ['Impatience with slow processes', 'Manageable if framed well.'],
    ],
    'Don’t name a weakness at the heart of the job.',
  ),
  free(
    { id: 'fit-q-027', subtopic: 'strengths-weaknesses', difficulty: 'intermediate', pools: ['mock'], followUps: ['fit-q-026'] },
    'What is your greatest strength, with an example?',
    [
      ['strength', 'Names one clear strength', [['strength']]],
      ['example', 'A specific example from your resume', [['ayah|stratus|clarus|improve me|modelcore']]],
      ['result', 'The result it produced', [['result*|closed|led to|recommendation']]],
      ['relevance', 'Why it matters for an analyst', [['analyst|bank*|deal*']]],
    ],
    'My greatest strength is turning raw information into a clear financial picture that someone can act on. For example, at Ayah Apparel I built a three-statement model from our primary sales records to drive our pricing and sourcing decisions. I did something similar at Stratus Labs, where I built the model and deck behind a $250K pre-seed raise that closed. As an analyst, that’s much of the job: taking raw information and building something a deal team and a client can rely on.',
    'One strength, one proof, one link to the job.',
    60,
  ),
  mcq(
    { id: 'fit-q-028', subtopic: 'strengths-weaknesses', difficulty: 'advanced', pools: ['mock'] },
    'An interviewer asks, “What would your teammates say you need to work on?” What’s the best approach?',
    [
      ['Give honest feedback you’ve actually received, how you responded to it, and evidence of improvement', 'Same structure as a weakness answer, but framed through others’ eyes.', true],
      ['Say they’d have nothing to criticize', 'Not credible.'],
      ['Criticize your teammates instead', 'A major red flag.'],
      ['Say you don’t know', 'Signals you don’t seek feedback.'],
    ],
    'Feedback → response → evidence.',
  ),

  // ── Behavioral stories ──
  order(
    { id: 'fit-q-029', subtopic: 'behavioral-stories', difficulty: 'basic', pools: ['pre', 'post'] },
    'Put the STAR structure in order.',
    ['Situation', 'Task', 'Action', 'Result'],
    'Situation → Task → Action → Result. Spend most of the time on Action.',
  ),
  mcq(
    { id: 'fit-q-030', subtopic: 'behavioral-stories', difficulty: 'basic', pools: ['pre', 'post', 'mock'] },
    'In a STAR answer, where should you spend most of your time?',
    [
      ['On the Action: what you specifically did and why', 'That’s what shows your skills and judgment.', true],
      ['On the Situation, giving lots of background', 'Keep context to a sentence or two.'],
      ['On the Task, describing the goal', 'Brief.'],
      ['Equally on all four', 'Action deserves the most time.'],
    ],
    'Roughly: S 10%, T 10%, A 60%, R 20%.',
  ),
  mcq(
    { id: 'fit-q-031', subtopic: 'behavioral-stories', difficulty: 'intermediate', pools: ['post', 'mock'] },
    'Asked about a failure, a candidate describes a time a teammate made a mistake. What went wrong?',
    [
      ['The question is about your own failure; blaming someone else signals a lack of ownership', 'Own a real mistake, what you learned and what you changed.', true],
      ['Nothing: it’s a good answer', 'It dodges the question.'],
      ['The story was too short', 'Length isn’t the issue.'],
      ['They should have picked a bigger failure', 'Size isn’t the issue; ownership is.'],
    ],
    'Own it.',
  ),
  mcq(
    { id: 'fit-q-032', subtopic: 'behavioral-stories', difficulty: 'intermediate', pools: ['post'] },
    'Why should you prepare 6–8 core stories rather than one per possible question?',
    [
      ['Each strong story can answer several questions (leadership, teamwork, conflict, failure), and you’ll know them well enough to tell naturally', 'Interviewers ask dozens of variants; a flexible story bank covers them.', true],
      ['Interviewers only ask six questions', 'They ask many more variants.'],
      ['Memorizing scripts word for word sounds best', 'It sounds robotic.'],
      ['You should only ever tell one story', 'Too narrow.'],
    ],
    'A small story bank, mapped to many questions.',
  ),
  free(
    { id: 'fit-q-033', subtopic: 'behavioral-stories', difficulty: 'intermediate', pools: ['mock'], followUps: ['fit-q-030'] },
    'Tell me about a time you led a team.',
    [
      ['situation', 'Situation: the team and the goal', [['modelcore|business society|team']]],
      ['action', 'Actions you personally took', [['i ']]],
      ['result', 'Result, ideally with specifics', [['careem|property finder|speaker*']]],
      ['learning', 'What you learned about leading', [['learn*|taught']]],
    ],
    'At Dubai College I was vice president of Modelcore, the school’s business society. Our goal was to bring C-suite executives in to speak and build a speaker network. I led a cross-functional team: [your detail: how you split the work, who owned what and how you tracked progress]. As a result we hosted executives from companies including Careem and Property Finder. What I learned about leading is [your detail: e.g. that giving people clear ownership worked better than checking everything myself].',
    'STAR with most time on your actions; fill the brackets from the Story Bank.',
    90,
  ),
  free(
    { id: 'fit-q-034', subtopic: 'behavioral-stories', difficulty: 'advanced', pools: ['mock'] },
    'Tell me about a time you made a recommendation others might have disagreed with.',
    [
      ['situation', 'The context and the question you were answering', [['improve me|submarket*|dubai']]],
      ['analysis', 'The analysis behind it', [['mece|yield*|price growth|framework']]],
      ['variant', 'Why it went against the obvious answer', [['variant|independent|disagree*|obvious|consensus']]],
      ['result', 'How it was received and the outcome', [['founders|recommend*']]],
    ],
    'At the Improve ME Institute, the founders were weighing an expansion decision. I structured a MECE framework across six Dubai submarkets and quantified rental yields and price growth for each. The analysis pointed to [your detail: the submarket you recommended and why], which was a variant view compared with [your detail: the obvious choice]. I presented the independent recommendation to the founders and backed it with the yield and growth numbers, and [your detail: how they responded]. It taught me that a contrarian recommendation only works if the numbers are clear enough that people can check them.',
    'Show the analysis, why it was contrarian, and how you defended it.',
    90,
  ),
  free(
    { id: 'fit-q-035', subtopic: 'behavioral-stories', difficulty: 'advanced', pools: ['mock'] },
    'Tell me about a time you worked with messy or incomplete data.',
    [
      ['situation', 'The dataset and the goal', [['tcs|credit risk|500|dataset']]],
      ['diagnose', 'How you diagnosed the data problems', [['data quality|missing|diagnos*|clean*']]],
      ['choice', 'The analytical choice and why', [['decision tree|logistic regression|model']]],
      ['result', 'The recommendation', [['recommend*|strategy']]],
    ],
    'In my Tata Consultancy Services externship I worked on credit risk analysis using a 500-record dataset with 19 variables. Before modeling, I diagnosed data-quality issues: [your detail: e.g. missing values or inconsistent fields] and [your detail: how you treated them]. I then compared a decision-tree model with logistic regression using precision, recall and AUC-ROC, and tested for bias, which justified choosing the decision tree. I translated the findings into a SMART collections-strategy recommendation and a governance framework mapped to ECOA, FCRA and GDPR requirements.',
    'Diagnose → choose the method → recommend.',
    90,
  ),
  mcq(
    { id: 'fit-q-036', subtopic: 'behavioral-stories', difficulty: 'advanced', pools: ['mock'] },
    'It’s 11pm. Your VP asks for a model update by 8am, and you’re already committed to a deliverable for another deal due at 9am. What do you do?',
    [
      ['Tell both deal teams about the conflict early, give realistic timings and ask which takes priority, then deliver on what you agree', 'Flag conflicts early; never silently miss a deadline.', true],
      ['Quietly do both badly', 'Quality and trust both suffer.'],
      ['Ignore the VP’s request', 'Not an option.'],
      ['Wait until 7am to mention the conflict', 'Far too late to fix.'],
    ],
    'Communicate early and let seniors prioritize.',
  ),
  mcq(
    { id: 'fit-q-037', subtopic: 'behavioral-stories', difficulty: 'elite', pools: ['mock'] },
    'Just before a pitch book goes to the client, you notice a number in the comps table that you think is wrong. Your associate has already signed off. What do you do?',
    [
      ['Check it quickly, then tell the associate immediately with the evidence, even though it’s late', 'A wrong number in front of a client is far worse than an awkward conversation.', true],
      ['Say nothing; it’s been signed off', 'Errors that reach clients hurt the firm.'],
      ['Change it yourself without telling anyone', 'Never edit approved materials silently.'],
      ['Email the client directly', 'Not your call.'],
    ],
    'Accuracy and transparency beat hierarchy.',
  ),
  order(
    { id: 'fit-q-038', subtopic: 'why-ib', difficulty: 'basic', pools: ['pre', 'post'] },
    'Order a typical banking deal team from most junior to most senior.',
    ['Analyst', 'Associate', 'Vice President', 'Director (Executive Director / Senior VP)', 'Managing Director'],
    'Titles vary by firm, but the ladder is roughly the same.',
  ),
  mcq(
    { id: 'fit-q-039', subtopic: 'why-firm', difficulty: 'basic', pools: ['pre', 'post'] },
    'What should you do after a networking call or coffee chat?',
    [
      ['Send a short thank-you email within 24 hours mentioning something specific from the conversation, and note it in your tracker', 'Specific follow-ups build relationships and help you answer “who have you spoken to?”', true],
      ['Ask them for a referral in the first message', 'Too early.'],
      ['Wait a month, then follow up', 'Momentum is lost.'],
      ['Do nothing', 'Missed opportunity.'],
    ],
    'Thank, be specific, record it.',
  ),
  free(
    { id: 'fit-q-040', subtopic: 'why-ib', difficulty: 'elite', pools: ['mock'] },
    'Do you have any questions for me?',
    [
      ['personal', 'A question about the interviewer’s own experience', [['you|your']]],
      ['specific', 'Something specific to the firm or group', [['group|firm|deal*']]],
      ['analyst', 'A question about what makes analysts succeed', [['analyst*|successful|succeed']]],
    ],
    'Yes, a couple. First, what’s a deal you’ve worked on at the firm that you found most rewarding, and why? Second, I read about the group’s work on [deal or sector]; how has that changed the kind of work analysts in the group do? And finally, what separates the analysts who do really well in their first year from the rest?',
    'Prepare three: their experience, the firm or group specifically, and how to succeed.',
    45,
  ),
  mcq(
    { id: 'fit-q-041', subtopic: 'why-firm', difficulty: 'advanced', pools: ['mock'] },
    'An interviewer asks, “Where else are you interviewing?” What’s the best response?',
    [
      ['Be honest at a high level (similar firms or groups), show a consistent story, and make clear why this firm stands out for you', 'Consistency signals focus; naming only unrelated industries signals confusion.', true],
      ['Say this is the only place you applied', 'Rarely true or believed.'],
      ['List every bank in detail', 'Unnecessary.'],
      ['Mention you’re mainly interested in consulting', 'Undermines your candidacy.'],
    ],
    'Honest, consistent, and steer back to why them.',
  ),
  mcq(
    { id: 'fit-q-042', subtopic: 'behavioral-stories', difficulty: 'elite', pools: ['mock'] },
    'In a superday, a senior banker says your story “sounds rehearsed” and asks you to go deeper. What’s the best move?',
    [
      ['Stay calm, drop the script and give specific details: what you were thinking, a decision you weighed, what you’d do differently', 'Depth and candor show the story is real.', true],
      ['Repeat the same story more slowly', 'Doesn’t address the concern.'],
      ['Argue that it isn’t rehearsed', 'Defensive.'],
      ['Switch to a completely different story', 'Looks like you’re hiding something.'],
    ],
    'Know your stories well enough to go off-script.',
  ),
];
