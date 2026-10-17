/**
 * Facts about the candidate that are not printed on the resume, used to fill
 * the resume-generated answers (Story Bank walkthrough and why-IB, Superday
 * resume probes). The generators take this as an optional input and fall back
 * to [FILL IN] / [your detail] prompts without it, so they still work for any
 * re-imported resume. Keep it consistent with the seed stories and the fit and
 * HireVue model answers.
 */

/** What to say about one resume bullet when it is probed. */
export interface ProbeDetail {
  /** The steps you took yourself and the tools you used (full sentences). */
  how: string;
  /** Completes “The result was …” (ends with a full stop). Omit to use the item’s confirmed notes. */
  result?: string;
  /** Completes “What I learned is …” (no full stop). */
  learned: string;
  /** Completes “it matters in banking because …” (no full stop). */
  whyBanking: string;
}

export interface CandidateBackstory {
  /** One or two sentences: where the interest in finance started. */
  origin?: string;
  /** Completes “…, and ___.” after the first experience: what it showed about finance (no full stop). */
  sparkLesson?: string;
  /** Resume-probe details keyed `${itemId}-${bulletNumber}` (1-based), e.g. `exp-ayah-1`. */
  probes?: Record<string, ProbeDetail>;
}

export const CANDIDATE_BACKSTORY: CandidateBackstory = {
  origin:
    'My interest in finance started with a Lumiere research project in the summer of 2023, the first time I had to ask whether a business was worth backing.',
  sparkLesson: 'it was where I first saw numbers drive real decisions',
  probes: {
    'exp-180dc-1': {
      how: 'On my first engagement, in spring 2026, for a small after-school tutoring nonprofit whose volunteer tutors were dropping out mid-semester, I owned the benchmarking of volunteer programs at eight peer organizations and the analysis of two years of the client’s sign-up and attendance data. I tested the draft recommendation by walking the director through it mid-engagement, and when she pushed back on cost we cut it to low-cost steps.',
      result:
        'that the client adopted our structured four-week onboarding with a buddy system for fall 2026; a second engagement, on a social enterprise’s outreach strategy, is in progress.',
      learned: 'that a recommendation only counts if the client can afford to act on it',
      whyBanking: 'advice to a client has to survive their constraints, not just the analysis',
    },
    'exp-clarus-1': {
      how: 'For a spring 2026 pitch on Nike I built a reverse DCF: the share price implied roughly 8–9% annual revenue growth for ten years at stable margins, against the 5–6% I thought was realistic given competition and wholesale pressure. I tested it with sensitivity tables on growth and margin and cross-checked it against peer EV/EBITDA, using a Python script I wrote to pull the peer set’s financials.',
      result: 'a hold recommendation that I presented to the club’s investment committee, and the fund held off adding to the position.',
      learned: 'to ask what the price assumes before arguing about a target',
      whyBanking: 'every valuation a bank puts in front of a client rests on a few assumptions that have to be defensible',
    },
    'exp-clarus-2': {
      how: 'I backtested a 12-month momentum strategy across the 11 S&P 500 sector ETFs, rebalancing monthly on 2010–2024 data. The first version showed a Sharpe ratio of about 1.1, but I found look-ahead bias: I was ranking on month-end prices and trading at the same close. I fixed it by trading at the next day’s open and adding transaction costs, which brought the Sharpe ratio down to about 0.6, and I reported the corrected result to the group with the bug explained.',
      result: 'that the fund uses momentum as one input to its sector tilts rather than as a rule.',
      learned: 'to be most suspicious of the results that look best',
      whyBanking: 'a number that goes to a client has to be right, not exciting',
    },
    'exp-stratus-1': {
      how: 'I had about three weeks before the investor meetings in November, so I did the revenue build and the use of funds first, then the deck, then the investor list. When investors’ questions focused on customer acquisition cost, I added a CAC and payback sensitivity to the model.',
      learned: 'how quickly investors go to the one assumption that drives the whole model',
      whyBanking: 'a banker’s model has to hold up under exactly that kind of questioning',
    },
    'exp-stratus-2': {
      how: 'I helped decide which investors to target and tailored the pitch to each: angel investors heard mostly about traction, and AI-focused funds about the technical roadmap. Alongside the raise, I supported business development conversations with Fortune 500 prospects and frontier AI labs, including xAI.',
      learned: 'that the same story has to be told differently to each audience',
      whyBanking: 'bankers position one company for buyers or investors who each care about different things',
    },
    'exp-ayah-1': {
      how: 'After the first few months of sales I built the three-statement model from our order records, and it showed which products actually made money after shipping and returns, so I cut two low-margin lines and set prices to protect margin. After over-ordering a winter hoodie run in autumn 2024, I now size every order from the model’s sell-through data and use pre-orders for new designs.',
      result: 'roughly AED 60,000 in revenue, about $16,000, in our first full year, 2024, at around a 45% gross margin.',
      learned: 'that a model is only worth building if it changes a decision',
      whyBanking: 'that is the whole point of the analysis behind a transaction',
    },
    'exp-ayah-2': {
      how: 'I write the TikTok content and the copy myself, and every month I put together a report on sales and margin by product. Since I moved to Swarthmore in August 2025, that report is how I run the business remotely, with my cousin in Dubai handling fulfillment and a shared inbox with response templates for customers.',
      result: 'that about 60% of our orders came through TikTok, and the business has kept running from Swarthmore.',
      learned: 'that regular, simple reporting is what lets you manage something you can’t see day to day',
      whyBanking: 'deal teams depend on the same kind of clear, regular updates for clients and senior bankers',
    },
    'exp-improveme-1': {
      how: 'I compared six submarkets on gross rental yield, price growth and demand. The obvious choice was Dubai Marina, for its prestige and footfall, but the numbers pointed to Dubai Silicon Oasis: gross yields of around 7% against about 5% in the Marina, faster price growth and a large family population near schools.',
      result: 'that the founders added Silicon Oasis to their shortlist for their next center.',
      learned: 'that a contrarian recommendation only works if the numbers are clear enough for people to check',
      whyBanking: 'clients need to see the evidence behind a recommendation before they act on it',
    },
    'exp-improveme-2': {
      how: 'For the quarterly reports, I compiled the course sales and enrollment figures into a two-page summary for leadership.',
      result: 'that leadership got each quarter’s sales and enrollment on two pages.',
      learned: 'how to cut a lot of figures down to what leadership actually needs',
      whyBanking: 'pitch books and client updates are the same exercise',
    },
    'exp-fitness-1': {
      how: 'I found my first clients through Instagram posts and referrals from friends, and I keep them with tailored plans, a weekly check-in form and monthly progress photos. When one client plateaued after about three months and wanted to quit, I asked what was really bothering her, switched her to weekly weight averages and adjusted her calories.',
      result: 'five recurring clients over two years, and that client stayed for another year.',
      learned: 'that retention comes from listening to what the client actually worries about',
      whyBanking: 'banking is a client business, and the same listening keeps clients coming back',
    },
    'proj-tcs-1': {
      how: 'I found missing income values and duplicate records: I removed the duplicates, filled the missing incomes with the median and flagged which values were filled. I chose the decision tree because the collections team had to explain decisions to borrowers and regulators, and it had higher recall on defaulters. For bias, I checked approval rates across age groups and flagged a feature that acted as a proxy.',
      result: 'an AUC-ROC of about 0.80 for the decision tree against 0.77 for logistic regression.',
      learned: 'that the best model is one that is both accurate and explainable',
      whyBanking: 'a banker’s analysis has to stand up to a client’s and a regulator’s questions',
    },
    'proj-tcs-2': {
      how: 'I turned the model’s findings into a collections strategy with specific, measurable targets, and mapped the governance framework to what ECOA, FCRA and GDPR require, recommending human review for borderline cases.',
      result: 'a SMART collections recommendation with a governance framework that keeps a person in the loop on borderline decisions.',
      learned: 'that governance has to be designed in from the start, not added at the end',
      whyBanking: 'regulation shapes what is possible on almost every deal',
    },
    'proj-lumiere-1': {
      how: 'My topic was sensor-based soil-moisture monitoring for smallholder farms. My mentor, a PhD researcher, said my first draft read like a literature review, not a decision, so I restructured it as a diligence memo: market size, unit economics, risks and a recommendation, with each section ending on what it meant for commercial viability.',
      result: 'a 30-page paper that made a clear call on commercial viability, and the first time I thought about how an investor decides whether a business is worth backing.',
      learned: 'to lead with the answer and make every section serve the decision',
      whyBanking: 'that is how bankers write for clients',
    },
    'lead-cs-society-1': {
      how: 'After the workshops I wrote a Python script, using pandas and yfinance, that pulls financials for a peer set and calculates trading multiples.',
      result: 'that I could build comps at Clarus Capital much faster.',
      learned: 'that a little code removes a lot of manual, error-prone work',
      whyBanking: 'analysts spend a lot of time on comps, and accuracy matters',
    },
    'lead-modelcore-1': {
      how: 'When the speaker program stalled in autumn 2023, I rebuilt it: I split our team of six into outreach, logistics and promotion, built a target list of about 40 executives prioritized by alumni and parent connections, wrote a one-page pitch tailored to each company, went to warm introductions first and ran a shared tracker with weekly check-ins.',
      result: 'about eight speaker events over two years, with audiences of 80 to 120 students, including executives from Careem and Property Finder.',
      learned: 'that clear ownership and one shared tracker beat trying to do everything myself',
      whyBanking: 'a deal team runs the same way, with each person owning a clear piece',
    },
    'lead-door-of-awareness-1': {
      how: 'I teach about 12 students aged 12 to 15 at very different levels, so I group them by level and use short practical exercises, like budgeting a market stall. When I’m not in Lahore I teach the class online each week.',
      result: 'that I’ve kept the weekly class running since July 2024, in person or online.',
      learned: 'how to explain the same idea at very different levels',
      whyBanking: 'analysts explain numbers to everyone from associates to clients',
    },
    'lead-door-of-awareness-2': {
      how: 'For a winter campaign with a target of about $5,000, I built the budget and a donor model, and I advised leadership to focus on recurring small donors over one-off appeals.',
      result: 'that the campaign reached about 90% of its target.',
      learned: 'that a simple model can change where an organization spends its effort',
      whyBanking: 'that is what a banker’s analysis does for a client',
    },
    'lead-mun-1': {
      how: 'Before each conference I ran research workshops for about ten junior delegates, teaching them to build a one-page country brief with sources, and I prepared the same way myself.',
      result: 'Best Researcher in the UN Security Council at a regional conference in Dubai in 2024.',
      learned: 'that good preparation is a system you can teach, not a talent',
      whyBanking: 'a deal team depends on research that is sourced, concise and ready on time',
    },
  },
};
