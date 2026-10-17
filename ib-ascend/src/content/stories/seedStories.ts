import type { Story } from '../../types/models';

/**
 * Seed STAR stories: at least one for every item on the resume, and two or
 * three, each from a different angle, for the richer items.
 *
 * Rules (enforced by src/content/__tests__/stories.test.ts):
 *  - Only facts from the resume or the user's confirmed notes. Anything else
 *    is a "[FILL IN: question]" placeholder, listed in `fillIns`.
 *  - First person. Action is the longest part. The spoken version is
 *    150–225 words (60–90 seconds); the short version is ~20 seconds.
 *  - Result ends with what was learned and the link to banking.
 */
export type SeedStory = Omit<Story, 'spoken' | 'fillIns' | 'unverifiedDetails' | 'practiceScore' | 'needsRewrite' | 'userEdited' | 'createdAt' | 'updatedAt'>;

function story(s: SeedStory): SeedStory {
  return s;
}

export const SEED_STORY_DRAFTS: SeedStory[] = [
  // ── Education ──
  story({
    id: 'st-swarthmore-major',
    resumeItemId: 'edu-swarthmore',
    title: 'Choosing economics and philosophy',
    angle: 'motivation',
    competencies: ['analytical', 'adaptability'],
    situation:
      'When I moved from Dubai to Swarthmore, I had to choose a major in a liberal arts system where I could study almost anything.',
    task: 'I wanted a combination that would train me to think rigorously about both numbers and arguments, because [FILL IN: why you wanted this combination, and whether you were already set on finance].',
    action:
      'I chose an intended double major in economics and philosophy. On the economics side, I took Statistics, Intermediate Economics and Behavioral Economics to build the quantitative and decision-making foundation for financial modeling, and I took Physics because [FILL IN: why you took Physics]. On the philosophy side, [FILL IN: Which philosophy course or idea has most changed how you analyze problems, and how?]. [FILL IN: How do economics and philosophy work together in how you analyze problems?]',
    result:
      '[FILL IN: A concrete moment where this combination helped you, e.g. a paper, a grade or a project.] That combination is what I want to bring to banking: questioning the assumptions in a model, not just building it, which is what a good analyst does before a number goes in front of a client.',
    short:
      'I study economics and philosophy at Swarthmore. Economics, including Statistics and Behavioral Economics, gives me the quantitative tools, and philosophy trains me to test the assumptions behind an argument. That combination is what I want to bring to banking: building the model and questioning what drives it.',
  }),
  story({
    id: 'st-dc-epq',
    resumeItemId: 'edu-dubai-college',
    title: 'Independent research for my EPQ (A*)',
    angle: 'initiative',
    competencies: ['initiative', 'time-management', 'analytical'],
    situation:
      'At Dubai College, alongside my A-Levels, I took the Extended Project Qualification, an independent research project with no set syllabus.',
    task: 'I had to choose my own question, plan the research and write it up myself.',
    action:
      'My project asked [FILL IN: What was your EPQ topic and research question?]. I planned the work by [FILL IN: how you scheduled the project around A-Level revision]. I gathered and evaluated sources, and [FILL IN: one specific method you used, e.g. a survey, data analysis or a framework]. When I hit [FILL IN: the hardest problem in the project], I [FILL IN: how you solved it], and [FILL IN: how you made sure your conclusion only claimed what the evidence supported].',
    result:
      'I was awarded an A* for the project. It taught me to manage a long, self-directed piece of work from a blank page to a finished product, which is how analysts own their part of a live deal.',
    short:
      'For my Extended Project at Dubai College I chose my own research question, planned the project myself and wrote it up independently alongside my A-Levels. It earned an A*, and it taught me to run a long, self-directed project, which is how analysts own their part of a deal.',
  }),
  story({
    id: 'st-dc-maths',
    resumeItemId: 'edu-dubai-college',
    title: 'Learning from a B in Mathematics',
    angle: 'failure',
    competencies: ['failure', 'criticism', 'adaptability'],
    situation:
      'At A-Level I got an A* in English Literature, an A* in my Extended Project and As in Physics and Economics, but a B in Mathematics.',
    task: 'Because I want to work in finance, I knew that grade would raise questions, and I needed to understand honestly what went wrong and close the gap.',
    action:
      'Looking back, [FILL IN: What honestly went wrong in Maths: preparation, a specific topic, or exam technique?]. I didn’t treat the grade as the end of it. I [FILL IN: what you did afterwards to strengthen your maths, e.g. extra practice or a topic you mastered], and at Swarthmore I chose quantitative courses, including Statistics. I also built the skills through real work rather than just exams: a three-statement model for my own business, Ayah Apparel, and DCF, reverse-DCF and comps models for Clarus Capital.',
    result:
      '[FILL IN: A quantitative result since then, e.g. your Statistics grade.] I learned that a weak result is information: find the cause, fix it with deliberate practice, and show the improvement in your work. That is how I would want to handle a mistake as an analyst too.',
    short:
      'My one weak A-Level grade was a B in Mathematics. I worked out what went wrong, took quantitative courses like Statistics at Swarthmore, and built real models: a three-statement model for my own business and, since then, DCF and comps models for Clarus Capital. I learned to treat a weak result as information and fix it.',
  }),

  // ── Experience ──
  story({
    id: 'st-180dc-engagement',
    resumeItemId: 'exp-180dc',
    title: 'Pro bono strategy work for a mission-driven client',
    angle: 'client focus',
    competencies: ['client-focus', 'teamwork', 'analytical'],
    situation:
      'At Swarthmore I was selected as a consultant for 180 Degrees Consulting, which does pro bono strategy work for nonprofits and social enterprises.',
    task: 'On my first engagement, our team had to help [FILL IN: Describe the client without naming it if confidential] with a problem in its [FILL IN: outreach or operations, and what the problem was].',
    action:
      'I owned [FILL IN: your specific workstream on the team]. I structured the problem with a MECE breakdown so the team covered every driver without overlap, and [FILL IN: what analysis you did, e.g. interviews, data or benchmarks]. I [FILL IN: how you worked with the client during the engagement]. [FILL IN: What were the client’s constraints, and how did you reflect them in the recommendations?]',
    result:
      'We delivered [FILL IN: the recommendation and any measurable outcome]. I’ve since started a second engagement. I learned to structure an ambiguous problem for a client who relies on the answer, which is what bankers do every day.',
    short:
      'At 180 Degrees Consulting I worked on a pro bono strategy engagement. I owned [FILL IN: your specific workstream on the team], structured it MECE and [FILL IN: how you worked with the client during the engagement]. We delivered [FILL IN: the recommendation and any measurable outcome], and I’m now on my second engagement.',
  }),
  story({
    id: 'st-clarus-reverse-dcf',
    resumeItemId: 'exp-clarus',
    title: 'Using a reverse DCF to test a stock idea',
    angle: 'analytical',
    competencies: ['analytical', 'persuasion', 'detail'],
    situation:
      'At Clarus Capital, Swarthmore’s student investment club, I build DCF, reverse-DCF and comparable-company models to support equity research for the club’s fund.',
    task: 'For [FILL IN: the company you analyzed], I needed to decide whether the stock was mispriced. [FILL IN: Who was the analysis for, e.g. the portfolio managers or the whole club?]',
    action:
      'I built a DCF and a comps analysis first. Then I built a reverse DCF to see what growth the current share price implied, so I could judge the market’s expectations rather than only a target price. [FILL IN: What growth or margin did the price imply, and what did you think was realistic, and why?] I tested the key assumptions by [FILL IN: how you tested them, e.g. sensitivity tables or a peer cross-check]. My recommendation was [FILL IN: your recommendation], and I [FILL IN: what you did with it, e.g. presented it, and to whom].',
    result:
      '[FILL IN: The outcome, e.g. whether the fund acted on it and how it has performed.] [FILL IN: What did the reverse DCF teach you?] A reverse DCF asks not just what a company is worth, but whether the expectations built into its price are right, which is the same lens a banker uses when a client’s stock reacts to a deal.',
    short:
      'At Clarus Capital I analyzed [FILL IN: the company you analyzed] with a DCF, comps and a reverse DCF to see what growth the price implied. My recommendation was [FILL IN: your recommendation], and I [FILL IN: what you did with it, e.g. presented it, and to whom].',
  }),
  story({
    id: 'st-clarus-backtest',
    resumeItemId: 'exp-clarus',
    title: 'Backtesting a trading strategy for the fund',
    angle: 'failure',
    competencies: ['failure', 'detail', 'analytical'],
    situation:
      'At Clarus Capital, Swarthmore’s student investment club, I conduct stock market analysis and backtest systematic trading strategies to help decide how the club’s fund is positioned.',
    task: 'I was testing [FILL IN: the strategy, e.g. momentum or mean reversion] on [FILL IN: what data and time period you tested it on] to see whether it would have worked historically.',
    action:
      '[FILL IN: Did a strategy look good at first and then fail a closer test? What was the flaw, e.g. look-ahead bias, overfitting or ignoring transaction costs?] I found the problem by [FILL IN: how you found it], and I re-ran the test with [FILL IN: the fix]. [FILL IN: If the corrected result was worse, how did you report it to the group, and what did you explain?]',
    result:
      '[FILL IN: the corrected result and what the fund did.] I learned [FILL IN: what you learned from backtesting], which matters when a client is relying on your numbers.',
    short:
      'At Clarus Capital I backtest systematic trading strategies to inform how the club’s fund is positioned. I tested [FILL IN: the strategy, e.g. momentum or mean reversion], and I learned [FILL IN: what you learned from backtesting].',
  }),
  story({
    id: 'st-stratus-raise',
    resumeItemId: 'exp-stratus',
    title: 'Building the model and deck behind a $250K raise',
    angle: 'greatest achievement',
    competencies: ['greatest-achievement', 'analytical', 'pressure'],
    situation:
      'From October to December 2025 I worked remotely as an advisor and analyst for Stratus Labs, an early-stage company in San Francisco, while studying at Swarthmore.',
    task: 'The company was raising a pre-seed round, and I was responsible for building the financial model and the investor pitch deck.',
    action:
      'I built the financial model: [FILL IN: the main revenue drivers and cost assumptions]. [FILL IN: How did you check the deck against the model?] I pressure-tested the assumptions by [FILL IN: how you tested them, e.g. scenarios or comparisons with similar companies]. I then helped shape which investors to target and directed the outreach to them. [FILL IN: One moment that tested the work, e.g. an investor question that made you change the model, and what you changed.]',
    result:
      'The $250K pre-seed raise closed. [FILL IN: Is this the work you’re proudest of, and why?] Building the model and deck behind a raise is the kind of work bankers do for clients.',
    short:
      'At Stratus Labs I built the financial model and investor deck for a pre-seed raise and directed outreach to investors. The $250K round closed. [FILL IN: Is this the work you’re proudest of, and why?]',
  }),
  story({
    id: 'st-stratus-investors',
    resumeItemId: 'exp-stratus',
    title: 'Choosing which investors to approach',
    angle: 'persuasion',
    competencies: ['persuasion', 'initiative', 'client-focus'],
    situation:
      'At Stratus Labs, an early-stage company in San Francisco raising a pre-seed round, I worked remotely as an advisor and analyst and helped shape the fundraising strategy and investor targeting.',
    task: 'We needed to decide which investors to approach and how to approach them.',
    action:
      'I built the target list by [FILL IN: how you built it, e.g. criteria like stage, sector focus and check size], and [FILL IN: how you prioritized investors]. [FILL IN: Did you tailor the pitch for different investors? One example.] I directed the outreach to prospective investors, alongside building the financial model and pitch deck they would see. [FILL IN: Did an investor push back? On what, and how did you respond?]',
    result:
      'The $250K pre-seed round closed. I learned that persuasion starts before the pitch: picking the right audience and knowing what they care about matters as much as the deck, which is how bankers think about buyer lists in a sale process.',
    short:
      'At Stratus Labs I helped shape which investors to target for a pre-seed round and directed the outreach. The $250K round closed. I learned that persuasion starts with choosing the right audience.',
  }),
  story({
    id: 'st-stratus-bd',
    resumeItemId: 'exp-stratus',
    title: 'Business development with Fortune 500 prospects and AI labs',
    angle: 'adaptability',
    competencies: ['adaptability', 'client-focus', 'time-management'],
    situation:
      'Alongside the fundraise at Stratus Labs, I advanced business development discussions with Fortune 500 prospects and frontier AI labs, including xAI.',
    task: 'I needed to [FILL IN: your role in those discussions, e.g. preparing materials or running follow-ups] for very different audiences at the same time as delivering the raise.',
    action:
      'For each conversation I [FILL IN: how you prepared differently for a large company versus an AI lab, and what you tailored]. I kept the pipeline moving by [FILL IN: how you tracked follow-ups], while still delivering the model and deck for the fundraise. All of this was remote, from Swarthmore to a team in San Francisco three hours behind, so I [FILL IN: how you managed communication and deadlines across the time difference].',
    result:
      '[FILL IN: Where those discussions got to.] It taught me to switch quickly between audiences and keep several workstreams moving at once, which is what an analyst staffed on multiple deals has to do.',
    short:
      'At Stratus Labs I worked on business development with Fortune 500 prospects and AI labs including xAI, while also building the model and deck for the raise, remotely from Swarthmore. It taught me to switch between audiences and keep several workstreams moving.',
  }),
  story({
    id: 'st-ayah-model',
    resumeItemId: 'exp-ayah',
    title: 'A three-statement model from my own sales data',
    angle: 'analytical',
    competencies: ['analytical', 'initiative', 'detail'],
    situation: 'In December 2023 I founded Ayah Apparel, a direct-to-consumer streetwear brand selling across the UAE.',
    task: 'I needed a reliable way to make pricing and sourcing decisions. [FILL IN: How did you make those decisions before the model?]',
    action:
      'I built a three-statement model from our primary sales records. [FILL IN: What did the sales data contain, and how did you clean it?] I linked the income statement, balance sheet and cash flow statement, so I could see how a pricing or sourcing decision flowed through to profit and, more importantly, to cash. Then I used it to [FILL IN: one specific pricing or sourcing decision the model changed, and what the numbers showed].',
    result:
      '[FILL IN: The result of that decision, ideally a number such as margin, cash or units sold.] [FILL IN: What first got you interested in finance? Did building this model play a part?] Using a model to drive real decisions is the work I want to do in banking.',
    short:
      'At Ayah Apparel, my streetwear brand, I built a three-statement model from our sales records and used it to drive pricing and sourcing decisions. [FILL IN: What first got you interested in finance? Did building this model play a part?]',
  }),
  story({
    id: 'st-ayah-channels',
    resumeItemId: 'exp-ayah',
    title: 'Building the e-commerce site and TikTok channel myself',
    angle: 'initiative',
    competencies: ['initiative', 'adaptability', 'time-management'],
    situation: 'When I launched Ayah Apparel, I needed both a way to sell online and a way to reach customers across the UAE.',
    task: 'As founder, I had to build both and make them work, alongside school.',
    action:
      'I engineered the e-commerce platform myself and built our TikTok acquisition channel. I owned the creative and the copywriting, which meant [FILL IN: what you had to learn to do this, e.g. video editing or writing for social]. I also produced monthly reports so I could see what was working rather than guess. [FILL IN: One thing the monthly reporting showed you and what you changed as a result.] [FILL IN: Which piece of content or campaign worked best, and why do you think it did?]',
    result:
      '[FILL IN: A number, e.g. orders, followers or the share of sales from TikTok.] I learned to teach myself new skills quickly and to measure everything, which is what I’ll need to do in my first months as an analyst.',
    short:
      'For Ayah Apparel I built the e-commerce site and a TikTok acquisition channel myself, owned the creative and tracked results in monthly reports. It taught me to learn new skills fast and to measure what works.',
  }),
  story({
    id: 'st-ayah-mistake',
    resumeItemId: 'exp-ayah',
    title: 'A mistake running my own business',
    angle: 'failure',
    competencies: ['failure', 'criticism', 'adaptability'],
    situation: 'I founded Ayah Apparel in December 2023 and run it as founder and CEO, so its mistakes are mine to own.',
    task: 'The mistake I learned most from was [FILL IN: a real mistake, e.g. over-ordering stock, a pricing error or a launch that didn’t work].',
    action:
      'I realized something was wrong when [FILL IN: what told you, e.g. the numbers or customer feedback]. The root cause was [FILL IN: the root cause, e.g. a decision made without checking the numbers]. I [FILL IN: what you did to fix it], and [FILL IN: whether and how you told anyone affected, e.g. customers or suppliers]. Afterwards I [FILL IN: what you changed afterwards, e.g. checking decisions against the three-statement model first].',
    result:
      '[FILL IN: The cost of the mistake and the result of the fix.] The lesson was [FILL IN: what you learned]. In banking, the cost of a mistake is higher, so catching it early matters even more.',
    short:
      'At Ayah Apparel I made a mistake: [FILL IN: a real mistake, e.g. over-ordering stock, a pricing error or a launch that didn’t work]. I [FILL IN: what you did to fix it], and afterwards I [FILL IN: what you changed afterwards, e.g. checking decisions against the three-statement model first]. The lesson was [FILL IN: what you learned].',
  }),
  story({
    id: 'st-improveme-variant',
    resumeItemId: 'exp-improveme',
    title: 'A variant-view expansion recommendation',
    angle: 'persuasion',
    competencies: ['persuasion', 'analytical', 'initiative'],
    situation: 'In December 2024 and January 2025, I was a research and operations intern at the Improve ME Institute in Dubai.',
    task: 'The founders were weighing an expansion decision, and I was asked to [FILL IN: the exact question you were asked to answer].',
    action:
      'I structured a MECE framework across six Dubai submarkets and quantified rental yields and price growth for each one, so the comparison was complete and apples to apples. The analysis pointed to [FILL IN: which submarket you recommended], which was not the obvious answer; most people would have picked [FILL IN: the obvious choice and why]. I delivered it to the founders as an independent, variant-view recommendation, supported by the yield and price-growth numbers from the framework.',
    result:
      '[FILL IN: How the founders responded and what they decided.] I learned that a contrarian view only persuades if the analysis is transparent and complete, which is exactly what a client needs from a banker’s recommendation.',
    short:
      'At the Improve ME Institute I compared six Dubai submarkets on yields and price growth and recommended a non-obvious option to the founders, backing every claim with numbers. I learned that a contrarian view persuades only when the analysis is transparent.',
  }),
  story({
    id: 'st-improveme-reports',
    resumeItemId: 'exp-improveme',
    title: 'Course materials and quarterly reports for leadership',
    angle: 'attention to detail',
    competencies: ['detail', 'time-management', 'teamwork'],
    situation: 'At the Improve ME Institute, alongside the expansion analysis, I co-authored and marketed course materials and textbooks.',
    task: 'I also produced quarterly performance reports for the leadership team.',
    action:
      'The reports covered [FILL IN: what the reports covered and where the data came from]. Before anything went to leadership, I [FILL IN: how you checked the numbers and the wording]. For the course materials and textbooks, I worked with [FILL IN: who you co-authored them with] and [FILL IN: what you contributed and how you marketed them]. Juggling both meant I had to [FILL IN: how you prioritized the two workstreams]. I treated the reports like a client deliverable: [FILL IN: one error or inconsistency you caught before a report went out, and how you caught it].',
    result:
      '[FILL IN: The outcome, e.g. how leadership used the reports.] It was good practice in producing accurate, polished materials on a deadline for senior people, which is much of what an analyst does.',
    short:
      'At the Improve ME Institute I produced quarterly performance reports for leadership and co-authored course materials. Before anything went to leadership, I [FILL IN: how you checked the numbers and the wording]. It was good practice in accurate, polished work for senior people on a deadline.',
  }),
  story({
    id: 'st-fitness-retention',
    resumeItemId: 'exp-fitness',
    title: 'Five recurring coaching clients over two years',
    angle: 'client focus',
    competencies: ['client-focus', 'initiative', 'time-management'],
    situation: 'In 2024 I founded an independent online fitness coaching practice, which I still run.',
    task: 'I owned both acquisition and retention, so I had to find clients and then keep them.',
    action:
      'I found my first clients by [FILL IN: how you found them]. For each client, I [FILL IN: how you tailored their plan and tracked their progress], and I [FILL IN: how often and how you kept in touch with clients]. I ran the practice alongside school, Ayah Apparel and Modelcore, so I [FILL IN: how you fitted coaching around everything else]. [FILL IN: One client whose progress you’re proudest of, and what you changed in their plan to get there.] [FILL IN: How did you think about retention versus finding new clients?]',
    result:
      'I built the practice to five recurring clients over two years. I learned [FILL IN: what kept clients with you], which is the same reason clients stay loyal to a bank.',
    short:
      'I founded an online fitness coaching practice in 2024 and grew it to five recurring clients over two years, owning acquisition and retention. I learned [FILL IN: what kept clients with you], which applies to banking clients too.',
  }),
  story({
    id: 'st-fitness-difficult',
    resumeItemId: 'exp-fitness',
    title: 'A difficult coaching client',
    angle: 'conflict',
    competencies: ['conflict', 'client-focus', 'persuasion'],
    situation: 'I run an online fitness coaching practice, which I founded in 2024, and one of my clients [FILL IN: what the problem was, e.g. was frustrated with their progress and close to quitting].',
    task: 'I needed to keep the client, but without overpromising results I couldn’t deliver.',
    action:
      'I first [FILL IN: how you first responded to the client], and [FILL IN: what they told you]. I realized [FILL IN: what you had misjudged]. I changed the plan to [FILL IN: the specific change] and [FILL IN: anything else you changed, e.g. targets or how often you checked in]. [FILL IN: How did you check that the new plan was working for them over the following weeks?]',
    result:
      '[FILL IN: The outcome, e.g. whether they stayed and for how long.] I’ve built the practice to five recurring clients over two years. I learned [FILL IN: what this client taught you about handling a difficult client], which applies directly to banking clients.',
    short:
      'One of my online coaching clients [FILL IN: what the problem was, e.g. was frustrated with their progress and close to quitting]. I changed the plan to [FILL IN: the specific change], and [FILL IN: The outcome, e.g. whether they stayed and for how long.] I’ve built the practice to five recurring clients over two years.',
  }),

  // ── Projects ──
  story({
    id: 'st-tcs-model',
    resumeItemId: 'proj-tcs',
    title: 'Choosing the right credit-risk model',
    angle: 'analytical',
    competencies: ['analytical', 'detail', 'adaptability'],
    situation:
      'In September 2026 I completed Tata Consultancy Services’ GenAI-powered data analytics externship, working as an AI transformation consulting extern.',
    task: 'I had to analyze credit risk on a dataset of 500 records and 19 variables and recommend a modeling approach.',
    action:
      'Before modeling anything, I diagnosed the data-quality issues: [FILL IN: the main issues, e.g. missing values or inconsistent fields, and how you treated them]. Then I compared a decision tree with logistic regression, using precision, recall and AUC-ROC, and bias-tested both. That framework justified choosing the decision tree because [FILL IN: the main reason, e.g. better recall or easier to explain to the business]. [FILL IN: How did you explain the choice to a non-technical audience?]',
    result:
      'I translated the findings into a SMART collections-strategy recommendation. I learned that choosing a model is a judgment call that has to be explained to the client, not just a score, the same way a banker has to explain why one valuation method deserves more weight.',
    short:
      'In a Tata Consultancy Services externship I diagnosed data-quality issues in a 500-record credit dataset, compared a decision tree with logistic regression on precision, recall and AUC-ROC with bias testing, and chose the decision tree. I turned it into a collections-strategy recommendation.',
  }),
  story({
    id: 'st-tcs-ethics',
    resumeItemId: 'proj-tcs',
    title: 'Building fairness into an AI recommendation',
    angle: 'ethics',
    competencies: ['ethics', 'detail', 'client-focus'],
    situation:
      'In my Tata Consultancy Services externship I was building a credit-risk model, the kind of model that informs decisions about borrowers. [FILL IN: Was the dataset live or simulated?]',
    task: 'I had to make sure the recommendation was fair and compliant, not just accurate.',
    action:
      'I bias-tested the models as part of the evaluation rather than as an afterthought, and I built an agentic-AI governance framework mapped to ECOA, FCRA and GDPR requirements. [FILL IN: One specific risk you found, e.g. a variable that could act as a proxy for a protected characteristic, and what you did about it.] [FILL IN: Did you document any trade-off between accuracy and fairness? How?] [FILL IN: What did the governance framework require, e.g. human review of decisions or regular bias checks?]',
    result:
      '[FILL IN: How the governance framework was received.] I learned that the right answer has to be defensible to regulators and customers as well as accurate, which is how banks have to think about every recommendation they put their name to.',
    short:
      'In my Tata Consultancy Services externship I bias-tested a credit-risk model and built a governance framework mapped to ECOA, FCRA and GDPR, so the recommendation was fair and compliant as well as accurate.',
  }),
  story({
    id: 'st-lumiere-memo',
    resumeItemId: 'proj-lumiere',
    title: 'A 30-page diligence memo on AgTech',
    angle: 'initiative',
    competencies: ['initiative', 'analytical', 'time-management'],
    situation: 'In the summer of 2023 I was an Individual Research Scholar with Lumiere Education.',
    task: 'I chose to write an independent research paper on sensor-based agricultural technology, an emerging growth sector.',
    action:
      'I structured the 30-page paper as a commercial-viability diligence memo rather than a purely academic essay. I sized the total addressable market by [FILL IN: how you sized it, e.g. top-down or bottom-up, and your main data sources], and I quantified the waste-reduction impact of the technology. The hardest judgment call was [FILL IN: the hardest judgment call in the analysis], and I handled it by [FILL IN: how you resolved it]. I wrote it for a reader deciding whether to back the technology, and [FILL IN: how you made each section useful for that reader].',
    result:
      '[FILL IN: Your conclusion and any feedback or recognition.] Writing it as a diligence memo was my first taste of the analysis banks do for clients evaluating an investment: size the opportunity, test the claims, and give a clear view.',
    short:
      'With Lumiere Education I wrote a 30-page paper on sensor-based AgTech, structured as a diligence memo: I sized the market and quantified the waste-reduction impact. It was my first taste of investment-style analysis.',
  }),

  // ── Leadership ──
  story({
    id: 'st-cs-python',
    resumeItemId: 'lead-cs-society',
    title: 'Learning Python for analysis',
    angle: 'learning quickly',
    competencies: ['adaptability', 'initiative'],
    situation: 'In my first year at Swarthmore I joined the Computer Science Society.',
    task: 'My goal was [FILL IN: why you joined the workshops].',
    action:
      'I attended the society’s workshops on Python and data analysis, and afterwards I [FILL IN: how you applied what you learned, e.g. a script or analysis you built]. Today I use Python, R and SQL alongside Excel and VBA, and I [FILL IN: where you use Python now, e.g. for data cleaning or backtests]. The workshops covered [FILL IN: what the workshops covered, e.g. pandas or data visualization]. The first thing I built on my own was [FILL IN: the first thing you built], and [FILL IN: what building it taught you].',
    result:
      '[FILL IN: A concrete result of applying it.] I learned to pick up a new technical tool by applying it to a real problem, which is how analysts get up to speed on a firm’s models and templates.',
    short:
      'At Swarthmore I joined the Computer Science Society’s Python and data analysis workshops, and afterwards I [FILL IN: how you applied what you learned, e.g. a script or analysis you built]. I now use Python, R and SQL alongside Excel and VBA.',
  }),
  story({
    id: 'st-modelcore-leadership',
    resumeItemId: 'lead-modelcore',
    title: 'Leading Modelcore’s speaker network',
    angle: 'leadership',
    competencies: ['leadership', 'teamwork', 'time-management'],
    situation: 'From September 2023 to June 2025 I was vice president of Modelcore, Dubai College’s business society, alongside my A-Levels and running Ayah Apparel.',
    task: 'Our goal was to bring C-suite executives in to speak and build a national speaker network.',
    action:
      'I led a cross-functional team: [FILL IN: how you split the work, who owned what, and how you tracked progress]. When [FILL IN: a moment the team fell behind or disagreed], I [FILL IN: what you did]. My own part in the outreach was [FILL IN: which executives you contacted yourself, if any], and [FILL IN: your role in running the events]. [FILL IN: How did you keep the team motivated across almost two years?]',
    result:
      'We hosted executives from companies including Careem and Property Finder. [FILL IN: How many speakers or events in total.] I learned that leading peers means giving clear ownership and following up, not doing everything yourself, which is how good deal teams run.',
    short:
      'As vice president of Modelcore, Dubai College’s business society, I led a cross-functional team that sourced and hosted C-suite speakers, including executives from Careem and Property Finder. I learned to lead by giving clear ownership and following up.',
  }),
  story({
    id: 'st-modelcore-outreach',
    resumeItemId: 'lead-modelcore',
    title: 'Getting senior executives to say yes',
    angle: 'persuasion',
    competencies: ['persuasion', 'initiative', 'client-focus'],
    situation: 'As vice president of Modelcore, Dubai College’s business society, my team had to bring in senior speakers who had no obligation to give their time to a school society.',
    task: 'We needed C-suite executives to agree to speak to our students. [FILL IN: What was your personal role in getting them to say yes?]',
    action:
      'We reached executives by [FILL IN: how you reached them, e.g. cold email, LinkedIn or introductions]. I pitched each executive by [FILL IN: how you framed what they would get from it], and I made it easy to say yes by [FILL IN: what you offered or how you handled the logistics]. When someone said no or didn’t reply, I [FILL IN: how you followed up]. [FILL IN: Roughly how many executives did you contact, and how many said yes?]',
    result:
      'We hosted executives from companies including Careem and Property Finder. I learned that persuading senior people means respecting their time and showing them why it’s worth it, which is the same skill bankers use with clients.',
    short:
      'At Modelcore I led the team that sourced and hosted C-suite speakers, including executives from Careem and Property Finder. [FILL IN: What was your personal role in getting them to say yes?]',
  }),
  story({
    id: 'st-door-teaching',
    resumeItemId: 'lead-door-of-awareness',
    title: 'Weekly teaching in Lahore',
    angle: 'adaptability',
    competencies: ['adaptability', 'client-focus'],
    situation:
      'Since July 2024 I’ve volunteered with Door of Awareness in Lahore, Pakistan, delivering weekly English, mathematics and business lessons to underserved students.',
    task: 'I had to make the material work for [FILL IN: who your students are and what made teaching them challenging].',
    action:
      'I deliver the lessons [FILL IN: how, e.g. in person or online] and adapt them by [FILL IN: how you adapt your lessons]. For example, [FILL IN: a concept you had to explain in a new way, and how]. In the business lessons I focus on foundational financial literacy, so the material is useful in students’ everyday lives, not just in class. [FILL IN: How do you check whether students have actually understood a lesson?] [FILL IN: How has teaching every week changed the way you explain things?]',
    result:
      '[FILL IN: A result, e.g. how many students you teach or their progress.] I learned that explaining an idea clearly to the person in front of you is what a good pitch book does for a client.',
    short:
      'Since July 2024 I’ve taught weekly English, maths and business lessons to underserved students in Lahore with Door of Awareness, and I adapt them by [FILL IN: how you adapt your lessons].',
  }),
  story({
    id: 'st-door-fundraising',
    resumeItemId: 'lead-door-of-awareness',
    title: 'Financial models for fundraising campaigns',
    angle: 'analytical',
    competencies: ['analytical', 'client-focus', 'persuasion'],
    situation: 'Door of Awareness, the organization in Lahore where I volunteer, funds its work through fundraising campaigns.',
    task: 'I was asked to [FILL IN: what you were asked to do for the campaigns].',
    action:
      'I built financial models and budgets for the fundraising campaigns, covering [FILL IN: what the models covered, e.g. costs per student and fundraising targets]. Then I used them to advise leadership on donor-engagement strategy: I recommended [FILL IN: one recommendation you made] because the numbers showed [FILL IN: the analysis behind it]. [FILL IN: How did you make the models usable for leadership, and how did you present them?] [FILL IN: Was there any disagreement with leadership about the plan, and how did you handle it?]',
    result:
      '[FILL IN: The outcome, e.g. funds raised or a change leadership made.] It showed me how much a clear model helps people who aren’t finance specialists make better decisions. Advising decision makers with a model is the core of what bankers do.',
    short:
      'For Door of Awareness I built financial models and budgets for fundraising campaigns and used them to advise leadership on donor-engagement strategy. It showed me how a clear model helps people who aren’t finance specialists decide.',
  }),
  story({
    id: 'st-mun-trainer',
    resumeItemId: 'lead-mun',
    title: 'Training junior delegates',
    angle: 'leadership',
    competencies: ['leadership', 'teamwork'],
    situation:
      'From 2019 to 2025 I competed in Model United Nations conferences across the region and trained junior delegates, and I was awarded Best Researcher in the UN Security Council.',
    task: 'As a trainer, I had to prepare junior delegates for conferences in [FILL IN: what you trained them in].',
    action:
      'I trained them by [FILL IN: how, e.g. mock debates, research templates or feedback sessions]. One delegate [FILL IN: a delegate you helped improve, and what they struggled with], so I [FILL IN: what you did to help]. [FILL IN: What did you teach them about research and preparation?] [FILL IN: How many delegates did you train, and over how many conferences?] [FILL IN: Did training others change how you prepared yourself?]',
    result:
      '[FILL IN: The result, e.g. awards or how they performed.] I learned that the best way to lead is to make others better, which is how strong associates develop their analysts.',
    short:
      'In Model United Nations, from 2019 to 2025, I competed across regional conferences and trained junior delegates in [FILL IN: what you trained them in]. I learned that leading means making others better.',
  }),

  // ── Achievements ──
  story({
    id: 'st-mun-researcher',
    resumeItemId: 'ach-mun-award',
    title: 'Best Researcher in the UN Security Council',
    angle: 'working under pressure',
    competencies: ['analytical', 'pressure', 'detail'],
    situation: 'At a Model United Nations conference, [FILL IN: which conference, and when], I represented [FILL IN: which country] in the UN Security Council committee.',
    task: 'The council had to respond to [FILL IN: the crisis or topic], with new developments and very little time.',
    action:
      'Before the conference I prepared by [FILL IN: your research method]. During the session, I [FILL IN: how you used your research under time pressure, e.g. drafting clauses or rebutting a claim], and [FILL IN: how you made sure your points were backed by research]. [FILL IN: How did you organize your research so you could find a fact in seconds during debate?] [FILL IN: One moment where your research changed the direction of the debate.]',
    result:
      'I was awarded Best Researcher in the Security Council. I learned that thorough preparation is what lets you think clearly under pressure, the same as in a Superday or on a live deal.',
    short:
      'At a Model United Nations conference I was named Best Researcher in the Security Council by preparing thoroughly and using that research under time pressure in session.',
  }),
  story({
    id: 'st-academics-balance',
    resumeItemId: 'ach-academics',
    title: 'Balancing A-Levels with a business and a society',
    angle: 'time management',
    competencies: ['time-management', 'pressure', 'initiative'],
    situation:
      'In my last two years at Dubai College, I was studying for A-Levels while running Ayah Apparel, which I founded in December 2023, and serving as vice president of Modelcore, the school’s business society.',
    task: 'I had to keep my grades up while running a business and leading a team.',
    action:
      'I managed it by [FILL IN: how you managed your time, e.g. a weekly schedule, fixed hours for the business, or what you said no to]. The hardest point was [FILL IN: a week when everything collided], and I handled it by [FILL IN: how you prioritized], making sure nothing important was dropped. [FILL IN: What did you give up or say no to during that period?]',
    result:
      'I finished with A*s in English Literature and my Extended Project, As in Physics and Economics and a B in Mathematics, plus a 1510 on the SAT. I learned to prioritize ruthlessly, which is exactly what juggling several live deals requires.',
    short:
      'At Dubai College I ran my own business and served as vice president of the business society while taking A-Levels, finishing with A*s in English Literature and my EPQ and a 1510 SAT. I learned to prioritize ruthlessly.',
  }),
];

const FILL_IN = /\[FILL IN: ([^\]]+)\]/g;

/** The "[FILL IN: …]" questions in a piece of text, in order. */
export function fillInsOf(...texts: string[]): string[] {
  const out: string[] = [];
  for (const t of texts) for (const m of t.matchAll(FILL_IN)) if (!out.includes(m[1]!)) out.push(m[1]!);
  return out;
}

/** Full Story rows for first-run seeding. The spoken version is the STAR text read aloud. */
export function seedStories(nowIso: string): Story[] {
  return SEED_STORY_DRAFTS.map((d) => {
    const spoken = [d.situation, d.task, d.action, d.result].join(' ');
    return {
      ...d,
      spoken,
      fillIns: fillInsOf(spoken, d.short),
      unverifiedDetails: [],
      practiceScore: null,
      needsRewrite: false,
      userEdited: false,
      createdAt: nowIso,
      updatedAt: nowIso,
    };
  });
}

