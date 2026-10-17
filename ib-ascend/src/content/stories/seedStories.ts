import type { Story } from '../../types/models';

/**
 * Seed STAR stories: at least one for every item on the resume, and two or
 * three, each from a different angle, for the richer items.
 *
 * Rules (enforced by src/content/__tests__/stories.test.ts):
 *  - Resume facts, confirmed notes, and plausible details the app drafted at
 *    the user's request. Every drafted detail that is not on the resume is
 *    listed in `unverified` so the user can confirm or rewrite it. No
 *    "[FILL IN: …]" placeholders remain in the seed text.
 *  - First person. Action is the longest part. The spoken version is
 *    150–225 words (60–90 seconds); the short version is ~20 seconds.
 *  - Result ends with what was learned and the link to banking.
 */
export type SeedStory = Omit<Story, 'spoken' | 'fillIns' | 'unverifiedDetails' | 'practiceScore' | 'needsRewrite' | 'userEdited' | 'createdAt' | 'updatedAt'> & {
  /** Details the app invented (not on the resume), as short phrases the user can check. */
  unverified?: string[];
};

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
    task: 'I wanted a combination that would train me to think rigorously about both numbers and arguments. Running Ayah Apparel had already pulled me towards finance.',
    action:
      'I chose an intended double major in economics and philosophy. On the economics side, I took Statistics, Intermediate Economics and Behavioral Economics to build the quantitative and decision-making foundation for financial modeling, and I took Physics because I had enjoyed it at A-Level and it keeps me practicing building models from first principles. On the philosophy side, an introductory course in logic and epistemology changed how I analyze problems: it gave me the habit of asking what would have to be true for a claim to hold. The two work together: economics gives me the model, and philosophy makes me test the assumptions inside it.',
    result:
      'The clearest example is my reverse DCF on Nike at Clarus Capital: instead of arguing about a price target, I asked what the share price assumed. That combination is what I want to bring to banking: questioning the assumptions in a model, not just building it, which is what a good analyst does before a number goes in front of a client.',
    short:
      'I study economics and philosophy at Swarthmore. Economics, including Statistics and Behavioral Economics, gives me the quantitative tools, and philosophy trains me to ask what would have to be true for an argument to hold. That combination is what I want to bring to banking: building the model and questioning what drives it.',
    unverified: [
      'Already leaning towards finance (from running Ayah Apparel) when choosing the major',
      'Took Physics because you enjoyed it at A-Level and it trains first-principles modeling',
      'Philosophy course: introduction to logic and epistemology; the “what would have to be true?” habit',
      'The Nike reverse DCF as the example of the combination at work',
    ],
  }),
  story({
    id: 'st-dc-epq',
    resumeItemId: 'edu-dubai-college',
    title: 'Researching vertical farming for my EPQ (A*)',
    angle: 'initiative',
    competencies: ['initiative', 'time-management', 'analytical'],
    situation:
      'At Dubai College, alongside my A-Levels, I took the Extended Project Qualification, an independent research project with no set syllabus.',
    task: 'I had to choose my own question, plan the research and write it up myself.',
    action:
      'My project asked whether vertical farming could make the UAE more food-secure at a viable cost. I planned the work by setting fixed hours each weekend and doing most of the research in the summer before my final year, so it didn’t collide with A-Level revision. I reviewed the literature, and I built a cost-per-kilogram comparison between vertically farmed and imported produce from published industry figures. The hardest problem was that those figures used inconsistent assumptions about energy prices and yields. I normalized everything to one energy price, stated my assumptions, and ran a best and a worst case. That kept my conclusion honest: vertical farming looked viable for leafy greens but not for staples, and I claimed only that.',
    result:
      'I was awarded an A* for the project. It taught me to manage a long, self-directed piece of work from a blank page to a finished product, which is how analysts own their part of a live deal.',
    short:
      'For my Extended Project at Dubai College I asked whether vertical farming could make the UAE more food-secure at a viable cost, built a cost-per-kilogram comparison and wrote it up alongside my A-Levels. It earned an A*, and it taught me to run a long, self-directed project, which is how analysts own their part of a deal.',
    unverified: [
      'EPQ question: can vertical farming make the UAE more food-secure at a viable cost?',
      'Method: cost-per-kg comparison vs imported produce from published figures, plus a literature review',
      'Hardest problem: inconsistent energy-price and yield assumptions; normalized to one energy price, best/worst case',
      'Conclusion: viable for leafy greens, not staples',
      'Schedule: fixed weekend hours, most research in the summer before your final year',
    ],
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
      'Looking back, the problem was exam technique more than understanding: on the pure papers I over-checked the early questions and ran out of time at the end. I didn’t treat the grade as the end of it. I worked through timed past papers to fix my pacing, and at Swarthmore I chose quantitative courses, including Statistics. I also built the skills through real work rather than just exams: a three-statement model for my own business, Ayah Apparel, DCF, reverse-DCF and comps models for Clarus Capital, and Python scripts for my analysis.',
    result:
      'I earned an A− in Statistics, on top of the 760 in SAT Math I already had. I learned that a weak result is information: find the cause, fix it with deliberate practice, and show the improvement in your work. That is how I would want to handle a mistake as an analyst too.',
    short:
      'My one weak A-Level grade was a B in Mathematics, mostly because I ran out of time on the pure papers. I fixed my pacing with timed past papers, earned an A− in Statistics at Swarthmore, and built real models for my business and for Clarus Capital. I learned to treat a weak result as information and fix it.',
    unverified: [
      'Maths B cause: exam technique, over-checking early questions and running out of time on the pure papers',
      'Fix: timed past papers',
      'Statistics grade at Swarthmore: A−',
    ],
  }),

  // ── Experience ──
  story({
    id: 'st-180dc-engagement',
    resumeItemId: 'exp-180dc',
    title: 'Helping a tutoring nonprofit keep its volunteers',
    angle: 'client focus',
    competencies: ['client-focus', 'teamwork', 'analytical'],
    situation:
      'At Swarthmore I was selected as a consultant for 180 Degrees Consulting, which does pro bono strategy work for nonprofits and social enterprises.',
    task: 'On my first engagement, in spring 2026, our team had to help a small after-school tutoring nonprofit near Philadelphia work out why its volunteer tutors kept dropping out mid-semester.',
    action:
      'I owned two pieces of the work: benchmarking the volunteer programs at eight peer organizations, and analyzing two years of the client’s sign-up and attendance data. I structured the problem MECE, into recruitment, onboarding and retention, so the team covered every driver without overlap. Halfway through, I walked the director through our draft rather than waiting for the final presentation. She pushed back on cost, because the organization has almost no budget, so we cut the plan to low-cost steps. When a teammate argued for paid tutors, I asked what worried them, which was reliability, and we compared both options on cost per retained tutor using the client’s data.',
    result:
      'We recommended a partnership pipeline with two local universities and a structured four-week onboarding with a buddy system, and the client adopted the onboarding changes for fall 2026. I’ve since started a second engagement. I learned to structure an ambiguous problem for a client who relies on the answer, which is what bankers do every day.',
    short:
      'At 180 Degrees Consulting I helped a tutoring nonprofit whose volunteer tutors kept dropping out. I benchmarked eight peer programs, analyzed two years of the client’s data and tested a draft with the director early. We recommended a university partnership pipeline and a four-week onboarding with buddies, and the client adopted the onboarding for fall 2026.',
    unverified: [
      'Client: small Philadelphia-area after-school tutoring nonprofit (unnamed); problem: volunteer tutors dropping out mid-semester',
      'Your workstream: benchmarking 8 peer programs + two years of sign-up/attendance data',
      'MECE split: recruitment, onboarding, retention',
      'Director pushed back on cost mid-engagement; plan cut to low-cost steps',
      'Teammate wanted paid tutors (reliability); compared on cost per retained tutor',
      'Recommendation: partnership pipeline with two universities + four-week onboarding with buddy system; onboarding adopted for fall 2026',
    ],
  }),
  story({
    id: 'st-clarus-reverse-dcf',
    resumeItemId: 'exp-clarus',
    title: 'A reverse DCF on Nike',
    angle: 'analytical',
    competencies: ['analytical', 'persuasion', 'detail'],
    situation:
      'At Clarus Capital, Swarthmore’s student investment club, I build DCF, reverse-DCF and comparable-company models to support equity research for the club’s fund.',
    task: 'For a pitch on Nike in spring 2026, I needed to decide whether the stock was mispriced and take a view to the club’s investment committee.',
    action:
      'I built a DCF and a comps analysis first. Then I built a reverse DCF to see what growth the current share price implied, so I could judge the market’s expectations rather than only a target price. The price implied roughly eight to nine percent annual revenue growth for ten years at stable margins. I thought five to six percent was more realistic, given the competition and the pressure in wholesale. I tested that view with sensitivity tables on growth and margin, and cross-checked it against peers’ EV/EBITDA multiples. My recommendation was to hold and not add at that price, and I presented it to the investment committee.',
    result:
      'The fund held off adding to the position. The reverse DCF taught me to ask what the price assumes before arguing about a target, which is the same lens a banker uses when a client’s stock reacts to a deal.',
    short:
      'At Clarus Capital I analyzed Nike with a DCF, comps and a reverse DCF. The price implied about eight to nine percent annual growth for a decade, and I thought five to six was realistic. I recommended holding rather than adding, presented it to the investment committee, and the fund held off.',
    unverified: [
      'Company: Nike, for a spring 2026 pitch to the investment committee',
      'Reverse DCF: price implied ~8–9% annual revenue growth for 10 years vs your 5–6%',
      'Tests: growth/margin sensitivity tables and a peer EV/EBITDA cross-check',
      'Recommendation: hold / don’t add; the fund held off adding',
    ],
  }),
  story({
    id: 'st-clarus-backtest',
    resumeItemId: 'exp-clarus',
    title: 'A backtest that looked too good',
    angle: 'failure',
    competencies: ['failure', 'detail', 'analytical'],
    situation:
      'At Clarus Capital, Swarthmore’s student investment club, I conduct stock market analysis and backtest systematic trading strategies to help decide how the club’s fund is positioned.',
    task: 'I was testing a 12-month momentum strategy across the 11 S&P 500 sector ETFs, rebalanced monthly, on data from 2010 to 2024, to see whether it would have worked historically.',
    action:
      'My first version showed a Sharpe ratio of about 1.1, which looked too good. I traced a few trades by hand and found look-ahead bias: I was ranking the sectors on month-end prices and then trading at that same close, which is impossible in practice. I re-ran the test trading at the next day’s open and added transaction costs, and the Sharpe ratio fell to about 0.6. I could have presented the exciting number, but I reported the corrected result to the group and explained the bug, so nobody would build a position on a result that couldn’t be traded.',
    result:
      'The fund decided to use momentum as one input to its sector tilts, not as a rule. I learned to be most suspicious of the results that look best, which matters when a client is relying on your numbers.',
    short:
      'At Clarus Capital I backtested a sector momentum strategy that first showed a Sharpe ratio of about 1.1. I found look-ahead bias, fixed it, and the Sharpe fell to about 0.6. I reported the corrected result anyway, and I learned to be most suspicious of the results that look best.',
    unverified: [
      'Strategy: 12-month momentum across the 11 S&P 500 sector ETFs, monthly rebalancing, 2010–2024 data',
      'Sharpe ~1.1 at first; ~0.6 after trading at the next day’s open and adding transaction costs',
      'Found the look-ahead bias by tracing a few trades by hand',
      'Reported the corrected result; the fund uses momentum as one input to sector tilts, not a rule',
    ],
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
      'I built the financial model bottom-up: the number of enterprise pilots, the rate at which they converted to paid contracts and the average contract value, against costs driven mainly by engineering hires and compute. With about three weeks before investor meetings in November, I prioritized the revenue build and use of funds, then the deck, then the investor list. I linked every figure in the deck to one output tab of the model and checked them all before each send. I pressure-tested the assumptions with base, downside and upside cases. When investors kept asking about customer acquisition cost, I added a CAC and payback sensitivity.',
    result:
      'The $250K pre-seed raise closed. It’s the work I’m proudest of, because it was the first time my analysis decided a real outcome for someone else. Building the model and deck behind a raise is the kind of work bankers do for clients.',
    short:
      'At Stratus Labs I built the financial model and investor deck for a pre-seed raise in about three weeks, added a CAC and payback sensitivity when investors asked, and directed outreach. The $250K round closed. It’s the work I’m proudest of, because my analysis decided a real outcome.',
    unverified: [
      'Model drivers: enterprise pilots → paid conversion → average contract value; costs mainly engineering hires and compute',
      'About three weeks before November investor meetings; priority: revenue build and use of funds, then deck, then investor list',
      'Deck figures linked to one output tab and checked before each send; base/downside/upside cases',
      'Investors focused on CAC; you added a CAC/payback sensitivity',
      'Proudest because it was the first time your analysis decided a real outcome',
    ],
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
      'I built the target list by screening for investors who write pre-seed checks, focus on AI or enterprise software, and have a typical check size that fit a $250K round. I prioritized those with a warm connection to the team and those who had recently backed similar companies. Then I tailored the pitch: with angels I led on traction, and with AI-focused funds I led on the technical roadmap. I directed the outreach to prospective investors, alongside building the financial model and pitch deck they would see. The most common pushback was on customer acquisition cost, so I added a CAC and payback sensitivity to the model and a slide that answered it directly.',
    result:
      'The $250K pre-seed round closed. I learned that persuasion starts before the pitch: picking the right audience and knowing what they care about matters as much as the deck, which is how bankers think about buyer lists in a sale process.',
    short:
      'At Stratus Labs I built the investor target list for a pre-seed round, tailored the pitch to angels and AI-focused funds, and answered pushback on customer acquisition cost with a new sensitivity. The $250K round closed. I learned that persuasion starts with choosing the right audience.',
    unverified: [
      'Investor screen: pre-seed, AI/enterprise software focus, check size fitting a $250K round',
      'Prioritized warm connections and investors who had recently backed similar companies',
      'Tailoring: angels heard traction, AI-focused funds the technical roadmap',
      'Main pushback: customer acquisition cost; answered with a CAC/payback sensitivity and a slide',
    ],
  }),
  story({
    id: 'st-stratus-bd',
    resumeItemId: 'exp-stratus',
    title: 'Business development with Fortune 500 prospects and AI labs',
    angle: 'adaptability',
    competencies: ['adaptability', 'client-focus', 'time-management'],
    situation:
      'Alongside the fundraise at Stratus Labs, I advanced business development discussions with Fortune 500 prospects and frontier AI labs, including xAI.',
    task: 'I needed to prepare the briefing materials and run the follow-ups for very different audiences at the same time as delivering the raise.',
    action:
      'For each conversation I tailored the materials to what that audience cared about. For a large company, that meant return on investment, integration and security; for an AI lab, it meant technical capability and how the product fit their roadmap. I kept the pipeline moving with a shared tracker that listed every open conversation, its next step and its date, and I reviewed it with the founders each week. All of this was remote, from Swarthmore to a team in San Francisco three hours behind, so I finished my deliverables in my morning, before their day began, and kept a fixed overlap slot for calls.',
    result:
      'When my engagement ended in December, the discussions were still at an early stage, so I handed over the tracker for the team to pick up. It taught me to switch quickly between audiences and keep several workstreams moving at once, which is what an analyst staffed on multiple deals has to do.',
    short:
      'At Stratus Labs I worked on business development with Fortune 500 prospects and AI labs including xAI, tailoring materials to each and running follow-ups from a shared tracker, while also building the model and deck for the raise, remotely from Swarthmore. It taught me to switch between audiences and keep several workstreams moving.',
    unverified: [
      'BD role: preparing briefing materials and running follow-ups',
      'Tailoring: ROI, integration and security for Fortune 500 vs technical capability and roadmap fit for AI labs',
      'Shared pipeline tracker reviewed weekly with the founders',
      'Time difference: deliverables done in your morning, fixed overlap slot for calls',
      'BD discussions still early-stage when you left in December; tracker handed over',
    ],
  }),
  story({
    id: 'st-ayah-model',
    resumeItemId: 'exp-ayah',
    title: 'A three-statement model from my own sales data',
    angle: 'analytical',
    competencies: ['analytical', 'initiative', 'detail'],
    situation: 'In December 2023 I founded Ayah Apparel, a direct-to-consumer streetwear brand selling hoodies and tees across the UAE.',
    task: 'I needed a reliable way to make pricing and sourcing decisions. For the first few months I had made them by gut feel and by looking at what competitors charged.',
    action:
      'Once I had a few months of sales, I built a three-statement model from our primary sales records. The order exports covered product, size, price, discounts, shipping costs and returns, and I cleaned them by removing test orders and matching refunds to the original sales. I linked the income statement, balance sheet and cash flow statement, so I could see how a pricing or sourcing decision flowed through to profit and, more importantly, to cash. The model showed that two of our product lines barely made money once shipping and returns were counted, so I cut them and reset prices on the rest to protect margin.',
    result:
      'In our first full year, 2024, we made about AED 60,000 in revenue at roughly a 45 percent gross margin. My interest in finance started with a research project the summer before, but this model was where I first saw numbers drive real decisions, which is the work I want to do in banking.',
    short:
      'At Ayah Apparel, my streetwear brand, I built a three-statement model from our sales records. It showed two product lines barely made money after shipping and returns, so I cut them and reset prices. My interest in finance started with research, but this model is where I saw numbers drive real decisions.',
    unverified: [
      'Products: mostly hoodies and tees',
      'Before the model: pricing by gut feel and competitor prices',
      'Sales data: order exports (product, size, price, discounts, shipping, returns); cleaned test orders, matched refunds',
      'Model showed two low-margin lines; you cut them and reset prices',
      'Ayah 2024 revenue ~AED 60k at ~45% gross margin',
      'Finance interest: sparked by the Lumiere project (summer 2023), made practical by this model',
    ],
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
      'I engineered the e-commerce platform myself and built our TikTok acquisition channel. I owned the creative and the copywriting, which meant teaching myself short-form video editing and how to write a hook that holds attention in the first two seconds. I also produced monthly reports so I could see what was working rather than guess. They showed that TikTok was driving most of our orders while Instagram posts drove very few, so I moved most of my content time to TikTok. The videos that worked best showed a design going from sketch to finished hoodie, because they felt authentic rather than like an ad.',
    result:
      'In our first full year, 2024, we made about AED 60,000 in revenue, with about 60 percent of orders coming through TikTok. I learned to teach myself new skills quickly and to measure everything, which is what I’ll need to do in my first months as an analyst.',
    short:
      'For Ayah Apparel I built the e-commerce site and a TikTok acquisition channel myself, owned the creative and tracked results in monthly reports. About 60 percent of our orders came through TikTok. It taught me to learn new skills fast and to measure what works.',
    unverified: [
      'Taught yourself short-form video editing and hook writing',
      'Monthly reports showed TikTok drove most orders and Instagram few; you shifted content time to TikTok',
      'Best content: sketch-to-finished-hoodie videos',
      '~60% of orders via TikTok; 2024 revenue ~AED 60k',
    ],
  }),
  story({
    id: 'st-ayah-mistake',
    resumeItemId: 'exp-ayah',
    title: 'Over-ordering a winter hoodie run',
    angle: 'failure',
    competencies: ['failure', 'criticism', 'adaptability'],
    situation: 'I founded Ayah Apparel in December 2023 and run it as founder and CEO, so its mistakes are mine to own.',
    task: 'The mistake I learned most from came in autumn 2024, when I over-ordered a winter hoodie run.',
    action:
      'I realized something was wrong when my monthly report showed sell-through running far behind plan a few weeks into the season. The root cause was that I had sized the order on early buzz from TikTok, without checking it against the sell-through data I already had. I cleared the stock with bundles, pairing hoodies with tees, and I told my supplier straight away that my next order would be smaller and later, so they could plan around it. Afterwards I changed the process: I now size every order from the model’s sell-through data, and I use pre-orders to test demand for new designs before committing cash.',
    result:
      'About 40 percent of the run went unsold at first, which tied up cash I needed for the next range until the bundles cleared it. The lesson was that excitement is not data. In banking, the cost of a mistake is higher, so catching it early matters even more.',
    short:
      'At Ayah Apparel I over-ordered a winter hoodie run on the back of early TikTok buzz, and about 40 percent went unsold at first. I cleared it with bundles, and now I size orders from the model’s sell-through data and use pre-orders for new designs. The lesson was that excitement is not data.',
    unverified: [
      'Autumn 2024 winter hoodie over-order on early TikTok buzz; ~40% of the run unsold, cash tied up',
      'Spotted it in the monthly report’s sell-through a few weeks into the season',
      'Cleared with bundles (hoodies with tees); told your supplier the next order would be smaller and later',
      'Now sizes orders from sell-through data and uses pre-orders for new designs',
    ],
  }),
  story({
    id: 'st-improveme-variant',
    resumeItemId: 'exp-improveme',
    title: 'Recommending Silicon Oasis over Dubai Marina',
    angle: 'persuasion',
    competencies: ['persuasion', 'analytical', 'initiative'],
    situation: 'In December 2024 and January 2025, I was a research and operations intern at the Improve ME Institute in Dubai.',
    task: 'The founders were deciding where to open the institute’s next center, and I was asked which Dubai submarket offered the best mix of value and demand.',
    action:
      'I structured a MECE framework across six Dubai submarkets and quantified rental yields and price growth for each one, so the comparison was complete and apples to apples. The analysis pointed to Dubai Silicon Oasis, which was not the obvious answer; most people would have picked Dubai Marina for its prestige and footfall. But Silicon Oasis had gross rental yields of around 7 percent against about 5 percent in the Marina, faster price growth, and a large family population living near schools, which is exactly who an education business serves. I delivered it to the founders as an independent, variant-view recommendation, backed by the numbers from the framework.',
    result:
      'The founders added Silicon Oasis to their shortlist for the next center. I learned that a contrarian view only persuades if the analysis is transparent and complete, which is exactly what a client needs from a banker’s recommendation.',
    short:
      'At the Improve ME Institute I compared six Dubai submarkets on yields and price growth and recommended Dubai Silicon Oasis over the obvious choice, Dubai Marina: yields of about 7 percent against 5, faster price growth and more families. The founders added it to their shortlist. I learned that a contrarian view persuades only when the analysis is transparent.',
    unverified: [
      'Question: which Dubai submarket for the institute’s next center',
      'Obvious choice: Dubai Marina (prestige, footfall); you recommended Dubai Silicon Oasis',
      'Silicon Oasis gross yields ~7% vs ~5% in the Marina, faster price growth, family population near schools',
      'The founders added Silicon Oasis to their shortlist',
    ],
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
      'The reports compiled course sales and enrollment figures from the institute’s spreadsheets into a two-page summary. Before anything went to leadership, I reconciled the totals against the finance records and reread the wording for anything unclear. For the course materials, I worked with the teaching staff: I drafted worked examples and practice questions, and wrote the social media posts and emails promoting the courses. The reports had fixed deadlines, so I put them first. I treated them like a client deliverable: once, I caught that students who had switched courses mid-quarter were being counted twice, and I fixed it before the report went out.',
    result:
      'Leadership used the summary in their quarterly review of which courses to run again. It was good practice in producing accurate, polished materials on a deadline for senior people, which is much of what an analyst does.',
    short:
      'At the Improve ME Institute I produced quarterly reports for leadership and co-authored course materials. Before anything went out I reconciled the totals against the finance records, and once caught students counted twice after switching courses. It was good practice in accurate, polished work for senior people on a deadline.',
    unverified: [
      'Reports: course sales and enrollment figures from the institute’s spreadsheets, as a two-page summary',
      'Checks: reconciled totals against finance records, reread the wording',
      'Co-authored with the teaching staff: worked examples, practice questions; wrote social posts and emails promoting courses',
      'Caught students who switched courses mid-quarter being counted twice',
      'Leadership used the summary to decide which courses to run again',
    ],
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
      'I found my first clients through Instagram posts and referrals from friends. For each client, I built a tailored plan and tracked progress with a weekly check-in form and monthly progress photos, and I answered every check-in with specific adjustments. I ran the practice alongside school, Ayah Apparel and Modelcore, so I kept all my check-ins to Sunday evenings. The client I’m proudest of had plateaued after about three months and wanted to quit; I switched her to weekly weight averages and adjusted her calories, and she stayed another year. I put retention ahead of finding new clients, because a happy client was also my best source of referrals.',
    result:
      'I built the practice to five recurring clients over two years. I learned that clients stay when they feel listened to and can see their progress, which is the same reason clients stay loyal to a bank.',
    short:
      'I founded an online fitness coaching practice in 2024 and grew it to five recurring clients over two years, owning acquisition and retention. I learned that clients stay when they feel listened to and can see their progress, which applies to banking clients too.',
    unverified: [
      'First clients via Instagram posts and referrals from friends',
      'Tailored plans with a weekly check-in form and monthly progress photos; check-ins on Sunday evenings',
      'A client who plateaued at ~3 months stayed another year after the switch to weekly averages',
      'Retention first because happy clients brought referrals',
    ],
  }),
  story({
    id: 'st-fitness-difficult',
    resumeItemId: 'exp-fitness',
    title: 'A client who was ready to quit',
    angle: 'conflict',
    competencies: ['conflict', 'client-focus', 'persuasion'],
    situation: 'I run an online fitness coaching practice, which I founded in 2024, and after about three months one of my clients hit a plateau and told me she wanted to quit.',
    task: 'I needed to keep the client, but without overpromising results I couldn’t deliver.',
    action:
      'I first asked what was really bothering her, rather than defending the plan, and she told me the day-to-day swings on the scale were wearing her down. I realized I had focused on the long-term target and missed how discouraging those daily numbers felt. I changed the plan to track weekly averages instead of daily weigh-ins, and I adjusted her calories. I also added a strength goal, so she had progress to see that didn’t depend on the scale. Over the following weeks I used her check-in forms to confirm that her weekly average was trending down and her lifts were going up, and I shared that with her every week.',
    result:
      'She stayed for another year. I’ve built the practice to five recurring clients over two years. I learned that a frustrated client usually needs to be heard before they need a new plan, which applies directly to banking clients.',
    short:
      'One of my online coaching clients plateaued after three months and wanted to quit. I asked what was really bothering her, the daily swings on the scale, switched her to weekly averages and adjusted her calories, and she stayed another year. I’ve built the practice to five recurring clients over two years.',
    unverified: [
      'Client plateaued after ~3 months and wanted to quit; daily scale swings were the real issue',
      'You had focused on the long-term target and missed how the daily numbers felt',
      'Changes: weekly averages, adjusted calories, an added strength goal',
      'She stayed another year',
    ],
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
      'Before modeling anything, I diagnosed the data-quality issues: some income values were missing and some records were duplicated. I removed the duplicates and filled missing income with the median, flagging those rows so I could check they didn’t drive the results. Then I compared a decision tree with logistic regression on precision, recall and AUC-ROC, and bias-tested both. I chose the decision tree because the collections team had to explain decisions to borrowers and regulators, and its recall on defaulters was higher, with an AUC-ROC of about 0.80 against 0.77. For a non-technical audience, I explained the tree as a set of if-then rules, like a loan officer’s checklist.',
    result:
      'I translated the findings into a SMART collections-strategy recommendation. I learned that choosing a model is a judgment call that has to be explained to the client, not just a score, the same way a banker has to explain why one valuation method deserves more weight.',
    short:
      'In a Tata Consultancy Services externship I cleaned a 500-record credit dataset, compared a decision tree with logistic regression on precision, recall and AUC-ROC with bias testing, and chose the decision tree because it was explainable and caught more defaulters. I turned it into a collections-strategy recommendation.',
    unverified: [
      'Data issues: missing income values and duplicate records; duplicates removed, median fill with a flag',
      'Decision tree chosen for explainability to borrowers/regulators and higher recall on defaulters',
      'AUC-ROC ~0.80 (tree) vs ~0.77 (logistic regression)',
      'Explained the tree as if-then rules, like a loan officer’s checklist',
    ],
  }),
  story({
    id: 'st-tcs-ethics',
    resumeItemId: 'proj-tcs',
    title: 'Building fairness into an AI recommendation',
    angle: 'ethics',
    competencies: ['ethics', 'detail', 'client-focus'],
    situation:
      'In my Tata Consultancy Services externship I was building a credit-risk model on a simulated, anonymized dataset, the kind of model that informs decisions about real borrowers.',
    task: 'I had to make sure the recommendation was fair and compliant, not just accurate.',
    action:
      'I bias-tested the models as part of the evaluation rather than as an afterthought, and I built an agentic-AI governance framework mapped to ECOA, FCRA and GDPR requirements. I compared approval rates across age groups to check for disparate impact, and I flagged one feature that closely tracked age, so it was acting as a proxy for a protected characteristic. I documented the trade-off of removing it, a small loss of accuracy, so the decision was transparent. The framework required human review of borderline cases and regular bias checks once the model was in use.',
    result:
      'The framework went into my final recommendation alongside the collections strategy. I learned that the right answer has to be defensible to regulators and customers as well as accurate, which is how banks have to think about every recommendation they put their name to.',
    short:
      'In my Tata Consultancy Services externship I bias-tested a credit-risk model, flagged a feature that acted as a proxy for age, and built a governance framework mapped to ECOA, FCRA and GDPR with human review of borderline cases, so the recommendation was fair and compliant as well as accurate.',
    unverified: [
      'Dataset was simulated and anonymized',
      'Checked approval rates across age groups; flagged a feature that closely tracked age (proxy)',
      'Documented the small accuracy cost of removing it',
      'Framework: human review of borderline cases plus regular bias checks',
    ],
  }),
  story({
    id: 'st-lumiere-memo',
    resumeItemId: 'proj-lumiere',
    title: 'A 30-page diligence memo on AgTech',
    angle: 'initiative',
    competencies: ['initiative', 'analytical', 'time-management'],
    situation: 'In the summer of 2023 I was an Individual Research Scholar with Lumiere Education, working with a PhD researcher as my mentor.',
    task: 'I chose to write an independent research paper on sensor-based soil-moisture monitoring for smallholder farms, an emerging growth area.',
    action:
      'I structured the 30-page paper as a commercial-viability diligence memo rather than a purely academic essay. I sized the total addressable market bottom-up, from the number of smallholder farms in the target regions, a realistic adoption rate and the price of a sensor kit, and cross-checked it against industry reports. The hardest judgment call was how much waste reduction to credit to the sensors, because trial results varied widely, so I used a conservative mid-range figure and showed the full range. When my mentor said my first draft read like a literature review, I restructured it so every section ended with what it meant for commercial viability.',
    result:
      'I concluded the technology was viable where water is scarce and expensive, but that price was the main barrier for the smallest farms. It was my first taste of the analysis banks do for clients evaluating an investment: size the opportunity, test the claims, and give a clear view.',
    short:
      'With Lumiere Education I wrote a 30-page paper on sensor-based soil-moisture monitoring, structured as a diligence memo: I sized the market bottom-up and quantified the waste-reduction impact. It was my first taste of investment-style analysis, and the moment I first asked whether a business was worth backing.',
    unverified: [
      'Mentor: a PhD researcher (unnamed)',
      'Topic: sensor-based soil-moisture monitoring for smallholder farms',
      'TAM bottom-up (farms × adoption × sensor-kit price), cross-checked against industry reports',
      'Hardest call: how much waste reduction to credit; conservative mid-range figure with the full range shown',
      'Mentor feedback: first draft read like a literature review; restructured as a memo',
      'Conclusion: viable where water is scarce and costly; price the main barrier for the smallest farms',
    ],
  }),

  // ── Leadership ──
  story({
    id: 'st-cs-python',
    resumeItemId: 'lead-cs-society',
    title: 'Learning Python for analysis',
    angle: 'learning quickly',
    competencies: ['adaptability', 'initiative'],
    situation: 'In my first year at Swarthmore I joined the Computer Science Society.',
    task: 'My goal was to stop doing repetitive data work by hand in Excel and to build a technical toolkit for financial analysis.',
    action:
      'I attended the society’s workshops on Python and data analysis, which covered pandas, data cleaning and plotting. Afterwards I applied them straight away: the first thing I built on my own was a script, using pandas and yfinance, that pulls financials for a peer set and calculates trading multiples. Building it taught me to check a script’s output against a few numbers by hand before trusting it. Today I use Python, R and SQL alongside Excel and VBA, and I use Python for comps and for backtesting strategies at Clarus Capital.',
    result:
      'The script cut the time to pull a peer set from about an hour to a few minutes, which sped up our comps at Clarus. I learned to pick up a new tool by applying it to a real problem, which is how analysts get up to speed on a firm’s models and templates.',
    short:
      'At Swarthmore I joined the Computer Science Society’s Python and data analysis workshops, and afterwards I wrote a script that pulls a peer set’s financials and calculates trading multiples, which sped up comps at Clarus Capital. I now use Python, R and SQL alongside Excel and VBA.',
    unverified: [
      'Joined to stop doing repetitive data work by hand in Excel',
      'Workshops covered pandas, data cleaning and plotting',
      'First build: a pandas + yfinance script that pulls peer financials and calculates trading multiples',
      'Use Python for comps and backtests at Clarus',
      'Script cut pulling a peer set from ~1 hour to a few minutes',
    ],
  }),
  story({
    id: 'st-modelcore-leadership',
    resumeItemId: 'lead-modelcore',
    title: 'Restarting a stalled speaker program',
    angle: 'leadership',
    competencies: ['leadership', 'teamwork', 'time-management'],
    situation: 'From September 2023 to June 2025 I was vice president of Modelcore, Dubai College’s business society, alongside my A-Levels and running Ayah Apparel.',
    task: 'Our goal was to bring C-suite executives in to speak and build a national speaker network.',
    action:
      'I led a cross-functional team of six, split into outreach, logistics and promotion. In autumn 2023 the program stalled: our cold emails got almost no replies, partly because I had tried to send all the outreach myself. I reset it. I gave each area an owner, set up a shared tracker and a weekly check-in, and rebuilt outreach around a target list of about 40 executives, prioritized by alumni and parent connections, with warm introductions first. My own part was contacting the executives where we had a personal link and hosting the Q&A at events. To keep the team motivated over almost two years, I rotated who hosted, so everyone got time with the speakers.',
    result:
      'We hosted about eight events, with executives from companies including Careem and Property Finder and typical audiences of 80 to 120 students. I learned that leading peers means giving clear ownership and following up, not doing everything yourself, which is how good deal teams run.',
    short:
      'As vice president of Modelcore, Dubai College’s business society, I restarted a stalled speaker program by giving my team of six clear owners and moving to warm introductions. We hosted about eight events, including executives from Careem and Property Finder. I learned to lead by giving clear ownership and following up.',
    unverified: [
      'Team of six split into outreach, logistics and promotion',
      'Autumn 2023 stall: cold emails got almost no replies, partly because you tried to send all the outreach yourself',
      'Fix: owners per area, shared tracker, weekly check-ins, ~40-executive target list prioritized by alumni/parent links',
      'Your part: contacting executives with a personal link, hosting the Q&A; rotated hosts to keep the team motivated',
      'About eight events, typical audiences of 80–120 students',
    ],
  }),
  story({
    id: 'st-modelcore-outreach',
    resumeItemId: 'lead-modelcore',
    title: 'Getting senior executives to say yes',
    angle: 'persuasion',
    competencies: ['persuasion', 'initiative', 'client-focus'],
    situation: 'As vice president of Modelcore, Dubai College’s business society, my team had to bring in senior speakers who had no obligation to give their time to a school society.',
    task: 'We needed C-suite executives to agree to speak to our students, and my role was rebuilding how we approached them after cold emails failed.',
    action:
      'We reached executives through warm introductions first, using a target list of about 40, prioritized by alumni and parent connections. I pitched each executive with a one-page note tailored to their company, framed around what they would get: time with ambitious students who could become future hires or customers. I made it easy to say yes by offering a fixed 45-minute slot, sending the questions in advance and handling all the logistics. When someone didn’t reply, I sent one polite follow-up after a week and then asked our contact to nudge. From about 40 executives on the list, we hosted around eight events.',
    result:
      'We hosted executives from companies including Careem and Property Finder, both through warm introductions. I learned that persuading senior people means respecting their time and showing them why it’s worth it, which is the same skill bankers use with clients.',
    short:
      'At Modelcore I rebuilt our speaker outreach after cold emails failed: a prioritized list of about 40 executives, warm introductions and a one-page pitch tailored to each company. We hosted around eight events, including executives from Careem and Property Finder.',
    unverified: [
      'Your role: rebuilding the approach after cold emails failed',
      '~40-executive target list, prioritized by alumni/parent links; warm introductions first',
      'Tailored one-page pitch: time with students who could be future hires or customers',
      'Fixed 45-minute slot, questions in advance, all logistics handled; one follow-up after a week',
      '~8 events from ~40 executives; Careem and Property Finder came through warm introductions',
    ],
  }),
  story({
    id: 'st-door-teaching',
    resumeItemId: 'lead-door-of-awareness',
    title: 'Weekly teaching in Lahore',
    angle: 'adaptability',
    competencies: ['adaptability', 'client-focus'],
    situation:
      'Since July 2024 I’ve volunteered with Door of Awareness in Lahore, Pakistan, delivering weekly English, mathematics and business lessons to underserved students.',
    task: 'I teach about 12 students aged 12 to 15 whose levels are very different, which makes it hard to pitch one lesson to the whole group.',
    action:
      'I teach in person when I’m in Lahore and online every week when I’m not, and I adapt the lessons by grouping students by level and using short, practical exercises. For example, I explained profit by having students budget a market stall: what to buy, what to charge and what is left at the end of the day. In the business lessons I focus on foundational financial literacy, so the material is useful in everyday life, not just in class. I end each lesson by asking a few students to explain the idea back in their own words. Teaching every week has taught me to start with an example before the rule.',
    result:
      'Most of my students can now put together a simple budget on their own. I learned that explaining an idea clearly to the person in front of you is what a good pitch book does for a client.',
    short:
      'Since July 2024 I’ve taught weekly English, maths and business lessons to about 12 underserved students in Lahore with Door of Awareness. I adapt them by grouping students by level and using practical exercises, like budgeting a market stall.',
    unverified: [
      'About 12 students aged 12–15 at very different levels',
      'In person when in Lahore, online weekly otherwise',
      'Grouping by level; market-stall budgeting exercise',
      'Students explain the idea back at the end of each lesson; “example before the rule”',
      'Most students can now build a simple budget on their own',
    ],
  }),
  story({
    id: 'st-door-fundraising',
    resumeItemId: 'lead-door-of-awareness',
    title: 'Financial models for fundraising campaigns',
    angle: 'analytical',
    competencies: ['analytical', 'client-focus', 'persuasion'],
    situation: 'Door of Awareness, the organization in Lahore where I volunteer, funds its work through fundraising campaigns.',
    task: 'I was asked to build the budget and donor model for a winter campaign, with a target of about $5,000.',
    action:
      'I built the financial model and budget for the campaign, covering the cost per student of winter supplies and how many donors we would need at different gift sizes. Then I used it to advise leadership on donor-engagement strategy: I recommended focusing on recurring small donors over one-off appeals, because the numbers showed small monthly pledges were far more predictable than large one-off gifts, which had varied a lot from year to year. To make the model usable, I summarized it on one page with a single target and a weekly progress tracker. Some of the leadership preferred one big appeal event, so we agreed to keep a single event but focus outreach on recurring donors.',
    result:
      'The campaign raised about 90 percent of its target. It showed me how much a clear model helps people who aren’t finance specialists make better decisions. Advising decision makers with a model is the core of what bankers do.',
    short:
      'For Door of Awareness I built the budget and donor model for a winter campaign with a target of about $5,000, and advised leadership to focus on recurring small donors over one-off appeals. The campaign raised about 90 percent of its target.',
    unverified: [
      'Winter campaign, target ~$5,000',
      'Model covered cost per student of winter supplies and donors needed at different gift sizes',
      'Recommended recurring small donors because one-off gifts varied a lot year to year',
      'One-page summary with a weekly progress tracker',
      'Some leaders wanted one big appeal event; kept one event, focused outreach on recurring donors',
      'Campaign raised ~90% of target',
    ],
  }),
  story({
    id: 'st-mun-trainer',
    resumeItemId: 'lead-mun',
    title: 'Training junior delegates',
    angle: 'leadership',
    competencies: ['leadership', 'teamwork'],
    situation:
      'From 2019 to 2025 I competed in Model United Nations conferences across the region and trained junior delegates, and I was awarded Best Researcher in the UN Security Council.',
    task: 'As a trainer, I had to prepare junior delegates for conferences, above all in how to research and prepare a position.',
    action:
      'Before each conference I ran research workshops for about ten junior delegates, and I taught them to build a one-page country brief with sources, so every claim they made in committee could be backed up. One delegate knew her material but froze whenever another delegate challenged her, so I ran practice rebuttals with her, using her brief to find an answer quickly. I trained delegates over my last two years at school, across several conferences. Training others also changed how I prepared myself: I started holding my own briefs to the same one-page standard.',
    result:
      'Most of the delegates I trained spoke in their first committee session, which was the goal. I learned that the best way to lead is to make others better, which is how strong associates develop their analysts.',
    short:
      'In Model United Nations, from 2019 to 2025, I competed across regional conferences and trained junior delegates in research, running workshops on building a one-page country brief with sources. I learned that leading means making others better.',
    unverified: [
      'Research workshops for ~10 junior delegates before each conference; one-page country brief with sources',
      'A delegate who froze when challenged; practice rebuttals using her brief',
      'Trained delegates over your last two years at school',
      'Most trainees spoke in their first committee session',
    ],
  }),

  // ── Achievements ──
  story({
    id: 'st-mun-researcher',
    resumeItemId: 'ach-mun-award',
    title: 'Best Researcher in the UN Security Council',
    angle: 'working under pressure',
    competencies: ['analytical', 'pressure', 'detail'],
    situation: 'At a regional Model United Nations conference in Dubai in 2024, I represented France in the UN Security Council committee.',
    task: 'The council had to respond to a crisis over maritime security in the Red Sea, with new developments and very little time.',
    action:
      'Before the conference I prepared a one-page country brief with sources, plus a file of supporting evidence indexed by subtopic, so I could find a fact in seconds during debate. During the session, when a crisis update arrived, I used that research to draft clauses quickly, and I made sure every point I made was tied to a source I could cite. The moment that mattered came when another delegation’s draft clause rested on a claim about shipping disruption that my sources contradicted; I raised it, cited the source, and the council amended the clause.',
    result:
      'I was awarded Best Researcher in the Security Council. I learned that thorough preparation is what lets you think clearly under pressure, the same as in a Superday or on a live deal.',
    short:
      'At a regional Model United Nations conference in Dubai in 2024 I was named Best Researcher in the Security Council by preparing a sourced, indexed country brief and using it under time pressure, including to correct a draft clause.',
    unverified: [
      'Regional conference in Dubai, 2024',
      'Country: France',
      'Topic: maritime security in the Red Sea',
      'Prep: one-page sourced country brief plus an evidence file indexed by subtopic',
      'You challenged a draft clause on shipping disruption with a source, and it was amended',
    ],
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
      'I managed it with a weekly schedule: school and revision came first, Ayah Apparel got fixed hours on weekday evenings, and Modelcore work went into weekends. The hardest point was the week of my final-year mock exams, when Ayah Apparel needed a restock and Modelcore had a speaker event. I handled it by putting the exams first, handing the event logistics to our team owners and placing the restock order early, making sure nothing important was dropped. During that period I paused new Ayah designs and cut back on competing at MUN conferences, keeping only my training role.',
    result:
      'I finished with A*s in English Literature and my Extended Project, As in Physics and Economics and a B in Mathematics, plus a 1510 on the SAT. I learned to prioritize ruthlessly, which is exactly what juggling several live deals requires.',
    short:
      'At Dubai College I ran my own business and served as vice president of the business society while taking A-Levels, finishing with A*s in English Literature and my EPQ and a 1510 SAT. I learned to prioritize ruthlessly.',
    unverified: [
      'Weekly schedule: school first, Ayah on weekday evenings, Modelcore on weekends',
      'Hardest week: final-year mocks + an Ayah restock + a Modelcore speaker event',
      'Handed event logistics to team owners and ordered the restock early',
      'Paused new Ayah designs and cut back on MUN competing during that period',
    ],
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
  return SEED_STORY_DRAFTS.map(({ unverified = [], ...d }) => {
    const spoken = [d.situation, d.task, d.action, d.result].join(' ');
    return {
      ...d,
      spoken,
      fillIns: fillInsOf(spoken, d.short),
      unverifiedDetails: [...unverified],
      practiceScore: null,
      needsRewrite: false,
      userEdited: false,
      createdAt: nowIso,
      updatedAt: nowIso,
    };
  });
}
