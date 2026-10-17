import type { Difficulty, SectionId } from '../../types/models';
import type { RubricPoint } from '../../types/questions';
import type { HireVueCategory, HireVueQuestion } from './types';

type Rubric = [id: string, point: string, keywords: string[][], weight?: number][];

function hv(q: {
  id: string;
  category: HireVueCategory;
  prompt: string;
  answerSec: number;
  rubric: Rubric;
  outline: string;
  tips: string[];
  explanation: string;
  sectionId?: SectionId;
  subtopic?: string;
  difficulty?: Difficulty;
  resumeItems?: string[];
}): HireVueQuestion {
  const rubric: RubricPoint[] = q.rubric.map(([id, point, keywords, weight]) => ({ id, point, keywords, weight: weight ?? 1 }));
  return {
    id: q.id,
    sectionId: q.sectionId ?? 'fit',
    subtopic: q.subtopic ?? (q.category === 'motivation' ? 'why-ib' : q.category === 'resume' ? 'resume-walkthrough' : 'behavioral-stories'),
    difficulty: q.difficulty ?? 'intermediate',
    pools: ['mock'],
    type: 'freeText',
    prompt: q.prompt,
    explanation: q.explanation,
    rubric,
    modelAnswer: q.outline,
    targetSeconds: q.answerSec,
    category: q.category,
    prepSec: 30,
    answerSec: q.answerSec,
    tips: q.tips,
    ...(q.resumeItems ? { resumeItems: q.resumeItems } : {}),
  };
}

/** Shared STAR rubric for behavioral prompts. */
const STAR: Rubric = [
  ['context', 'Brief context: where, when and what was at stake', [['when|while|during|at the time'], ['in 20*']]],
  [
    'action',
    'Focuses on what you did (“I”, not “we”), step by step',
    [['i built|i led|i created|i decided|i organized|i organised|i proposed|i set up|i reached out|i spoke|i made|i focused|i designed|i wrote|i started|i took|i asked|i suggested|i changed|i ran|i pitched|i analyzed|i analysed|i launched|i rebuilt|i split|i owned|i prioritized|i prioritised|i coordinated|i negotiated|i managed|i contacted|i tested|i listened|i explained|i presented|i delegated|i worked|i broke|i structured|i modeled|i modelled']],
    2,
  ],
  ['result', 'A concrete result, ideally with a number', [['result*|outcome|led to|ended up|which meant']]],
  ['lesson', 'What you learned', [['learn*|taught me|takeaway|lesson']]],
  ['banking', 'Why it matters for an analyst role', [['bank*|analyst*|deal*|client*|transaction*']]],
];

const STAR_TIPS = [
  'Spend ~10 seconds on the situation, most of your time on what YOU did, and finish with a result and what you learned.',
  'Say “I”, not “we”: the reviewer is scoring your contribution.',
  'Land a number in the result if you have one.',
];

const DELIVERY_TIP = 'Look at the camera lens, not your own face on screen.';

export const HIREVUE_QUESTIONS: HireVueQuestion[] = [
  // ── Motivation ──
  hv({
    id: 'hv-01',
    category: 'motivation',
    prompt: 'Why are you interested in investment banking?',
    answerSec: 90,
    rubric: [
      ['story', 'A genuine, specific origin: what first drew you to it', [['first|started|began|when i']]],
      ['evidence', 'Evidence you’ve tested the interest: what you’ve already done that’s close to the work', [['model*|dcf|valuation|comps|raise|investor*']]],
      ['job', 'Shows you understand the analyst job: modeling, deals, client work, steep learning', [['deal*|transaction*|client*|learning curve|learn*']]],
      ['fit', 'Why banking specifically, rather than consulting or investing', [['rather than|instead of|unlike|compared to|over consulting|consulting']]],
    ],
    outline:
      'I first got interested [your origin: when and how, e.g. while building the three-statement model for Ayah Apparel, if that is true]. Since then I’ve tested that interest: I built the model and investor deck behind Stratus Labs’ $250K pre-seed raise, which closed, and I build DCF and comps models for Clarus Capital. What draws me to banking rather than consulting is the combination of rigorous financial analysis with live transactions where the work directly decides an outcome for a client. And I want the steepest learning curve I can find early in my career: I want to learn how deals actually get done.',
    tips: ['Lead with a real story, not “I like finance”.', 'Prove it with two things you’ve already done.', 'End with what you want to learn as an analyst.', DELIVERY_TIP],
    explanation: 'Strong answers are personal, backed by evidence, and show you know what analysts actually do.',
    resumeItems: ['exp-ayah', 'exp-stratus', 'exp-clarus'],
  }),
  hv({
    id: 'hv-02',
    category: 'motivation',
    prompt: 'Why do you want to work at our firm?',
    answerSec: 60,
    subtopic: 'why-firm',
    rubric: [
      ['specific', 'Something specific to the firm: a recent deal, a sector strength or its model', [['deal*|transaction*|advised|sector|group|franchise']]],
      ['people', 'People you’ve spoken to and what you learned', [['spoke|spoken|met|conversation*|coffee chat*|talked']]],
      ['fit', 'Why that fits you specifically', [['fit*|match*|because i|my experience']]],
      ['culture', 'Culture or analyst experience (lean teams, exposure, training)', [['culture|lean|exposure|training|team*']]],
    ],
    outline:
      'Three reasons. First, [the firm]’s work in [sector or deal type]: I followed [recent deal you researched], and the way the firm advised on it is exactly the kind of transaction I want to work on. Second, the people: I spoke with [name] in [group], and what stood out was [specific thing they said about lean teams and early exposure]. Third, it fits my experience: I’ve built models for a pre-seed raise at Stratus Labs and valuation work at Clarus Capital, and I want a place where analysts get real exposure to clients and deals early, which is how the firm’s teams are set up.',
    tips: ['Name a real deal and a real person; generic praise scores poorly.', 'Use the Firm Tracker notes for each firm.', DELIVERY_TIP],
    explanation: 'Specificity is everything: deal, person, reason it fits you.',
  }),
  hv({
    id: 'hv-03',
    category: 'motivation',
    prompt: 'Where do you see yourself in five years?',
    answerSec: 60,
    rubric: [
      ['analyst', 'Committed to the analyst role and learning first', [['analyst|learn*|skills']]],
      ['growth', 'Growing responsibility (e.g. associate track, leading parts of deals)', [['associate|responsib*|lead*|promot*']]],
      ['realistic', 'Realistic and focused on the work, not the title', [['deal*|client*|sector|transaction*']]],
    ],
    outline:
      'In five years I want to have built a real technical foundation as an analyst: modeling, valuation and how transactions are run. I’d like to have taken on more responsibility, whether that’s on the associate track or leading pieces of deals and working directly with clients, and to have developed real depth in a sector. Right now my focus is on becoming an analyst my team can rely on.',
    tips: ['Don’t say “at a hedge fund” or “starting my own company”.', 'Keep it about skills and responsibility.', DELIVERY_TIP],
    explanation: 'Show commitment to the role and a growth mindset.',
  }),
  hv({
    id: 'hv-04',
    category: 'motivation',
    prompt: 'Why should we hire you over other candidates?',
    answerSec: 60,
    rubric: [
      ['strengths', 'Two or three specific strengths', [['strength*|skill*|able to|good at']]],
      ['proof', 'Proof for each from your experience', [['ayah|stratus|clarus|improve me|180|modelcore|tata|tcs|door of awareness|lumiere|fitness|coaching|model united nations|mun']]],
      ['value', 'Ties them to what an analyst needs to deliver', [['analyst|team|deal*|client*']]],
    ],
    outline:
      'I bring three things. First, technical skill I’ve already used for real: I built a three-statement model from Ayah Apparel’s own sales records, and the model and deck behind Stratus Labs’ $250K pre-seed raise. Second, ownership: I’ve run my own business end to end, so I’m used to being accountable for the result. Third, I communicate well across very different audiences, from founders and investors to the students I teach at Door of Awareness. As an analyst, that means I can be trusted with the model, take ownership of my part of a deal and explain the numbers clearly to my team and the client.',
    tips: ['Pick 2–3 strengths and prove each.', 'Avoid putting down other candidates.', DELIVERY_TIP],
    explanation: 'Claims need evidence; link each to the analyst job.',
    resumeItems: ['exp-ayah', 'exp-stratus', 'lead-door-of-awareness'],
  }),
  hv({
    id: 'hv-05',
    category: 'motivation',
    prompt: 'What do you think a summer analyst does day to day?',
    answerSec: 60,
    rubric: [
      ['work', 'Concrete tasks: models, comps, pitch books, research', [['model*|comps|pitch*|deck*|research']]],
      ['team', 'Works for associates and VPs on live deals and pitches', [['associate*|vp*|team*|live deal*']]],
      ['standards', 'Attention to detail, turnaround and long hours', [['detail|accura*|hours|turnaround|deadline*']]],
    ],
    outline:
      'A summer analyst works like a full-time analyst on a deal team. Day to day that means building and updating models and trading comps, pulling research, and turning analysis into pages for pitch books and client presentations, usually for an associate and VP on live deals and pitches. The bar is accuracy and attention to detail with fast turnaround, often across several projects at once, and the hours are long. It’s also the best chance to learn how a deal team actually works.',
    tips: ['Show you know the job is detail-heavy and team-based.', DELIVERY_TIP],
    explanation: 'Interviewers screen for realistic expectations.',
  }),
  hv({
    id: 'hv-06',
    category: 'motivation',
    prompt: 'You study economics and philosophy. Why finance?',
    answerSec: 60,
    rubric: [
      ['link', 'Connects the degree to the job (analysis, argument, decisions)', [['econom*'], ['philosoph*']]],
      ['skills', 'Specific transferable skills: structured reasoning, arguing a position, quantitative work', [['argu*|reason*|logic*|structur*|quantitative|statistics']]],
      ['evidence', 'Shows the finance interest is real through experience', [['model*|dcf|clarus|stratus|ayah']]],
    ],
    outline:
      'They fit together better than they look. Economics gives me the quantitative side, from statistics to how markets and incentives work. Philosophy trains me to build a structured argument, test it against objections and defend a position, which is exactly what you do when you recommend a valuation or a deal to a client. And I’ve confirmed the finance interest in practice: building DCF and comps models at Clarus Capital and the financial model behind Stratus Labs’ raise.',
    tips: ['Turn the “unusual” major into a strength.', DELIVERY_TIP],
    explanation: 'Reframe the degree as a source of relevant skills.',
    resumeItems: ['edu-swarthmore', 'exp-clarus', 'exp-stratus'],
  }),

  // ── Resume ──
  hv({
    id: 'hv-07',
    category: 'resume',
    prompt: 'Tell us about yourself.',
    answerSec: 90,
    rubric: [
      ['background', 'Background in one or two lines (where you grew up, school, major)', [['dubai|swarthmore|econom*']]],
      ['thread', 'A clear thread through your experiences, not a list', [['which led|that led|thats when|that is when|since then|that got me|led me']]],
      ['highlights', 'Two or three highlights with specifics', [['ayah|stratus|clarus|250']]],
      ['why', 'Ends with why you’re here: banking', [['bank*|analyst']]],
    ],
    outline:
      'I went to school in Dubai, at Dubai College, and I’m now at Swarthmore studying economics and philosophy. The thread through everything I’ve done is building things and using numbers to make decisions. In 2023 I started Ayah Apparel, a streetwear brand in the UAE, and built a three-statement model from our sales records to set prices and sourcing; [your detail: how that shaped your interest in finance]. Since then I built the financial model and investor deck behind Stratus Labs’ $250K pre-seed raise, which closed, and I build DCF and comps models for Clarus Capital at Swarthmore. That’s what led me to banking: I want to do that analysis on live transactions, at a much higher level.',
    tips: ['60–90 seconds, chronological with a thread.', 'End on why banking, so the next question flows.', DELIVERY_TIP],
    explanation: 'A story with a thread, two or three proof points, and a landing on banking.',
    resumeItems: ['edu-dubai-college', 'edu-swarthmore', 'exp-ayah', 'exp-stratus', 'exp-clarus'],
  }),
  hv({
    id: 'hv-08',
    category: 'resume',
    prompt: 'Tell us about founding Ayah Apparel.',
    answerSec: 90,
    rubric: [
      ['what', 'What the business is and your role', [['streetwear|brand|direct to consumer|dtc|founder']]],
      ['model', 'The three-statement model built from sales records and the decisions it drove', [['three statement|3 statement|model'], ['pricing|sourcing']]],
      ['growth', 'How you grew it: e-commerce platform, TikTok acquisition, reporting', [['tiktok|e commerce|ecommerce|website|platform']]],
      ['result', 'A result with a number', [['result*|grew|revenue|orders|customers|margin']]],
      ['lesson', 'What it taught you that applies to banking', [['learn*|taught me|bank*']]],
    ],
    outline:
      'I founded Ayah Apparel in December 2023 as a direct-to-consumer streetwear brand in the UAE, and I own almost everything: product, the e-commerce platform, the TikTok acquisition channel, creative and copywriting. The part I’m proudest of is the three-statement model I built from our primary sales records; I use it to set pricing and decide what and how much to source. As a result [your result: e.g. margin, revenue or order growth with a number]. It taught me that good decisions come from good numbers, which is a big part of why I want to be in banking.',
    tips: ['Have one hard number ready (revenue, units, margin change).', 'Show the model drove a decision.', DELIVERY_TIP],
    explanation: 'Interviewers will probe: what exactly did you build, and what changed because of it?',
    resumeItems: ['exp-ayah'],
  }),
  hv({
    id: 'hv-09',
    category: 'resume',
    prompt: 'Walk us through your work at Stratus Labs.',
    answerSec: 90,
    rubric: [
      ['role', 'What Stratus does and what you were brought in to do', [['stratus'], ['advisor|analyst']]],
      ['model', 'The financial model and investor deck you built', [['model', 'deck|pitch']]],
      ['raise', 'The $250K pre-seed raise, which closed', [['250|pre seed|raise']]],
      ['bd', 'Fundraising strategy, investor targeting and BD with Fortune 500 prospects and AI labs', [['investor*|targeting|fortune 500|xai']]],
      ['lesson', 'What it taught you about how deals get done', [['learn*|taught me|bank*|deal*']]],
    ],
    outline:
      'Stratus Labs is an early-stage startup based in San Francisco, and I worked remotely as an advisor and analyst from October to December 2025. My main job was to build the financial model and the investor pitch deck for the company’s pre-seed round, and to direct the outreach to prospective investors. I also helped shape the fundraising strategy and which investors to target, and supported business development discussions with Fortune 500 prospects and frontier AI labs, including xAI. The $250K pre-seed raise closed. It taught me how much of a deal depends on a credible model and a clear story for investors, which is very close to what a banker does.',
    tips: ['Be precise about what you personally built.', 'Expect a follow-up on the model’s key assumptions: know them.', DELIVERY_TIP],
    explanation: 'This is your most banking-like experience: be specific and confident.',
    resumeItems: ['exp-stratus'],
  }),
  hv({
    id: 'hv-10',
    category: 'resume',
    prompt: 'What have you learned from building valuation models at Clarus Capital?',
    answerSec: 60,
    rubric: [
      ['methods', 'The methods: DCF, reverse DCF, comparable companies', [['dcf'], ['comps|comparable']]],
      ['insight', 'A specific insight (e.g. sensitivity to WACC/terminal value, peer selection)', [['wacc|terminal|sensitiv*|peer*|assumption*']]],
      ['reverse', 'What a reverse DCF tells you (the growth the price implies)', [['reverse dcf|implied|price implies']]],
      ['banking', 'Why that matters in banking', [['bank*|client*|deal*']]],
    ],
    outline:
      'At Clarus I build DCF, reverse-DCF and comps models for the fund. The biggest lesson is how much the answer depends on a few assumptions: small changes in WACC or terminal growth move a DCF a lot, which is why sensitivity tables matter. The reverse DCF was the most useful tool for me, because it shows what growth the current share price implies, and then the debate becomes whether that’s realistic. And with comps, picking the right peers matters more than any formula. In banking, that judgment is what makes a valuation defensible to a client.',
    tips: ['Name one concrete insight; avoid generic “I learned Excel”.', DELIVERY_TIP],
    explanation: 'Show judgment, not just mechanics.',
    resumeItems: ['exp-clarus'],
  }),
  hv({
    id: 'hv-11',
    category: 'resume',
    prompt: 'Tell us about a time you used data or analysis to make a recommendation.',
    answerSec: 90,
    rubric: [
      ['problem', 'The question you were answering', [['question|problem|decide|whether|where to']]],
      ['method', 'How you structured and analyzed it (framework, data, metrics)', [['framework|mece|data|yield*|metric*|precision|recall|auc']]],
      ['rec', 'The recommendation you made', [['recommend*']]],
      ['result', 'What happened / why it was persuasive', [['result*|outcome|adopted|founders|leadership']]],
      ['banking', 'Link to banking', [['bank*|client*|analyst']]],
    ],
    outline:
      'At Improve ME Institute in Dubai, the founders wanted to know where to expand. I structured the question with a MECE framework across six Dubai submarkets and quantified rental yields and price growth in each, so we could compare them on the same basis. From that I recommended [which submarket], which was a variant view to what they had assumed, because [your reason]. The outcome was [what the founders did with it]. It’s the same thing an analyst does: structure the question, get the numbers right and make a clear recommendation to a client.',
    tips: ['Make the structure audible: “I broke it into…”.', 'The recommendation should be one sentence.', DELIVERY_TIP],
    explanation: 'Structure → data → recommendation → impact.',
    resumeItems: ['exp-improveme', 'proj-tcs'],
  }),

  // ── Behavioral ──
  hv({
    id: 'hv-12',
    category: 'behavioral',
    prompt: 'Tell us about a time you worked in a team to achieve a goal.',
    answerSec: 90,
    rubric: STAR,
    outline:
      'At Modelcore, Dubai College’s business society, [when], our goal was to bring senior executives in to speak. As vice president I led a cross-functional team, and I [how you organized the team, e.g. split the work by role]. I [the specific things you did yourself]. As a result we hosted C-suite speakers including from Careem and Property Finder, and built a speaker network [your number of events or attendees]. I learned [your lesson], which is how a deal team works with an analyst, associate and VP.',
    tips: STAR_TIPS,
    explanation: 'Teamwork questions still want YOUR role inside the team.',
    resumeItems: ['lead-modelcore', 'exp-180dc'],
  }),
  hv({
    id: 'hv-13',
    category: 'behavioral',
    prompt: 'Describe a time you showed leadership.',
    answerSec: 90,
    rubric: STAR,
    outline:
      'When I was vice president of Modelcore, Dubai College’s business society, [when, and the leadership challenge, e.g. what was stuck or at stake]. I took responsibility: I [your actions, step by step]. The result was a speaker network that included C-suite executives from Careem and Property Finder [your number of events]. I learned [your lesson], and on a deal team that is what keeps a process on schedule.',
    tips: STAR_TIPS,
    explanation: 'Show initiative and how you got others to follow.',
    resumeItems: ['lead-modelcore', 'lead-mun'],
  }),
  hv({
    id: 'hv-14',
    category: 'behavioral',
    prompt: 'Tell us about a time you failed or made a mistake.',
    answerSec: 90,
    rubric: [
      ...STAR.filter(([id]) => id !== 'result'),
      ['own', 'Owns the mistake without excuses', [['my mistake|i made a mistake|i was wrong|i got it wrong|my fault|i should have|i failed|i misjudged|i take responsibility|i took responsibility|my responsibility']], 2],
      ['fix', 'What you changed afterwards', [['since then|now i|changed|so now|ever since']]],
    ],
    outline:
      'At [where, e.g. Ayah Apparel] in [when], [your mistake]. That was my mistake: I should have [what you should have done]. I decided to fix it by [what you did, e.g. going back to the sales records]. Since then [what you do differently now]. I learned [your lesson], which is exactly the discipline an analyst needs.',
    tips: ['Pick a real mistake with real consequences (not a disguised strength).', 'Spend most of the time on what you changed.', DELIVERY_TIP],
    explanation: 'Ownership + fix + lesson. The mistake itself should be short.',
    resumeItems: ['exp-ayah'],
  }),
  hv({
    id: 'hv-15',
    category: 'behavioral',
    prompt: 'Tell us about a time you disagreed with a teammate. How did you handle it?',
    answerSec: 90,
    rubric: [
      ...STAR,
      ['listen', 'Listened to understand the other view before pushing yours', [['listen*|understand their|their view|their point|perspective']]],
    ],
    outline:
      'At 180 Degrees Consulting this year, while we were working on [the engagement], a teammate and I disagreed about [the issue]. I asked to understand their view first, and I listened: their concern was [their point]. I [how you resolved it, e.g. proposed we test both options against the data]. As a result [the outcome]. I learned [your lesson], which matters on a deal team under time pressure.',
    tips: ['Never make the teammate the villain.', 'Show you moved it to evidence and a shared goal.', DELIVERY_TIP],
    explanation: 'Interviewers want maturity: listen, use evidence, keep the relationship.',
    resumeItems: ['exp-180dc', 'lead-modelcore'],
  }),
  hv({
    id: 'hv-16',
    category: 'behavioral',
    prompt: 'Tell us about a time you had to deliver under a tight deadline.',
    answerSec: 90,
    rubric: STAR,
    outline:
      'At Stratus Labs in late 2025, while the company was preparing its pre-seed round, [the deadline: what had to be ready and by when]. I focused on [how you prioritized and sequenced the model and deck work]. As a result [what happened on the deadline], and the $250K raise closed. I learned [your lesson], which is how analysts survive live deals.',
    tips: STAR_TIPS,
    explanation: 'Show how you prioritized, not just that you worked hard.',
    resumeItems: ['exp-stratus', 'proj-tcs'],
  }),
  hv({
    id: 'hv-17',
    category: 'behavioral',
    prompt: 'Describe a time you persuaded someone to change their mind.',
    answerSec: 90,
    rubric: STAR,
    outline:
      'At Improve ME Institute in early 2025, the founders were leaning toward expanding into [their preferred area]. I analyzed six Dubai submarkets with a MECE framework, quantifying yields and price growth, and I made the case for [your recommendation] with the numbers side by side. I focused on the metric they cared about most, which was [metric]. The result was [their decision]. I learned that persuasion works best when you frame the evidence around what the other person already values, which is what bankers do with clients.',
    tips: STAR_TIPS,
    explanation: 'Persuasion = understanding their priorities + evidence.',
    resumeItems: ['exp-improveme', 'exp-stratus'],
  }),
  hv({
    id: 'hv-18',
    category: 'behavioral',
    prompt: 'Tell us about a time you went above and beyond what was expected.',
    answerSec: 90,
    rubric: STAR,
    outline:
      'Since July 2024 I’ve taught English, maths and business weekly at Door of Awareness in Lahore. While teaching there, [what you noticed, and why it went beyond what was expected of you], so I built financial models and budgets for them, and advised leadership on donor engagement. As a result [your outcome, e.g. a campaign target met]. I learned that the most valuable work is often spotting what nobody asked for, which is how analysts earn trust.',
    tips: STAR_TIPS,
    explanation: 'Initiative beyond the brief, with a result.',
    resumeItems: ['lead-door-of-awareness'],
  }),
  hv({
    id: 'hv-19',
    category: 'behavioral',
    prompt: 'Tell us about a time you received critical feedback.',
    answerSec: 90,
    rubric: [
      ...STAR,
      ['receive', 'Received it openly, without defensiveness', [['feedback'], ['fair|right|appreciated|took it on board']]],
    ],
    outline:
      'During my Lumiere research project in 2023, [who] gave me feedback that [the feedback]. It was fair, and I took it on board. I decided to [what you changed]. As a result [the result, e.g. how the final 30-page paper improved]. I learned [your lesson], which is how bankers write for clients.',
    tips: ['Show you acted on it, and the improvement.', DELIVERY_TIP],
    explanation: 'Coachability is a core analyst trait.',
    resumeItems: ['proj-lumiere'],
  }),
  hv({
    id: 'hv-20',
    category: 'behavioral',
    prompt: 'Tell us about a time you had to learn something new quickly.',
    answerSec: 90,
    rubric: STAR,
    outline:
      'In September 2026, during my Tata Consultancy Services externship, I had to run a credit-risk analysis on a 500-record, 19-variable dataset, and [what was new to you, e.g. credit-risk modeling or the regulatory side]. I started with the data-quality issues, I [how you got up to speed], and I compared a decision tree with logistic regression on precision, recall and AUC-ROC, including for bias. As a result I justified using a decision tree and turned it into a collections-strategy recommendation and a governance framework mapped to ECOA, FCRA and GDPR. I learned how to get up to speed fast by focusing on what the decision needs, which is the analyst job in a new sector.',
    tips: STAR_TIPS,
    explanation: 'Speed of learning matters more than prior knowledge for analysts.',
    resumeItems: ['proj-tcs'],
  }),
  hv({
    id: 'hv-21',
    category: 'behavioral',
    prompt: 'How do you manage competing priorities? Give an example.',
    answerSec: 90,
    rubric: STAR,
    outline:
      'In fall 2025 I was starting at Swarthmore while working for Stratus Labs, running Ayah Apparel and coaching fitness clients. I decided to [your system: how you ranked and scheduled the commitments, step by step]. As a result [your outcome, e.g. grades and the Stratus raise both on track]. I learned [your lesson, e.g. about prioritizing], which is how analysts handle several deals at once.',
    tips: STAR_TIPS,
    explanation: 'Show a system, not just effort.',
    resumeItems: ['exp-stratus', 'exp-ayah', 'exp-fitness'],
  }),
  hv({
    id: 'hv-22',
    category: 'behavioral',
    prompt: 'Describe a time you faced an ethical dilemma.',
    answerSec: 90,
    rubric: [
      ...STAR.filter(([id]) => id !== 'result'),
      ['principle', 'Names the principle at stake and chooses integrity even at a cost', [['honest*|integrity|right thing|transparen*|confidential*']], 2],
      ['outcome', 'What happened as a result', [['result*|outcome|ended up']]],
    ],
    outline:
      'At [where, e.g. Ayah Apparel], while [the situation, e.g. facing a shortcut that would have misled customers or investors]. The principle at stake was honesty with [whom]. I decided to [what you did, e.g. be transparent even though it cost us], and I explained why to [whom]. The outcome was [what happened]. I learned that trust is the whole business in banking: clients share confidential information because they trust you.',
    tips: ['Choose a real, modest dilemma; don’t invent drama.', 'Make the principle explicit.', DELIVERY_TIP],
    explanation: 'Banks screen hard for integrity and confidentiality.',
  }),
  hv({
    id: 'hv-23',
    category: 'behavioral',
    prompt: 'What is your greatest strength?',
    answerSec: 60,
    subtopic: 'strengths-weaknesses',
    rubric: [
      ['one', 'Names one clear strength', [['strength']]],
      ['proof', 'Backs it up with a specific example', [['ayah|stratus|clarus|improve me|modelcore|tata|tcs|door of awareness']]],
      ['link', 'Explains why it matters for an analyst', [['analyst|bank*|deal*|team']]],
    ],
    outline:
      'My greatest strength is ownership: when something is mine, I see it through. The clearest example is Ayah Apparel, where I run everything from the e-commerce platform to the three-statement model I built from our sales records. At Stratus Labs I owned the model and investor deck for the pre-seed round through to the $250K close. As an analyst, that means my team can hand me a piece of a deal and trust it’ll be done right.',
    tips: ['One strength, one or two proofs.', DELIVERY_TIP],
    explanation: 'Specific beats generic (“hard-working”).',
    resumeItems: ['exp-ayah', 'exp-stratus'],
  }),
  hv({
    id: 'hv-24',
    category: 'behavioral',
    prompt: 'What is your biggest weakness?',
    answerSec: 60,
    subtopic: 'strengths-weaknesses',
    rubric: [
      ['real', 'A real weakness (not a disguised strength)', [['weakness']]],
      ['example', 'Shows when it hurt you', [['example|when|for instance|for example']]],
      ['fix', 'What you’re actively doing about it, with evidence', [['working on|now i|i ve started|ive started|i started|improv*|so now']]],
    ],
    outline:
      'My weakness is [a real one, e.g. taking on too much myself instead of delegating]. For example, at [where] it meant [consequence]. I’ve started working on it by [concrete fix, e.g. agreeing roles and check-ins upfront], and I can see it improving: [evidence].',
    tips: ['Avoid “I’m a perfectionist” or “I work too hard”.', 'The fix must be concrete and already underway.', DELIVERY_TIP],
    explanation: 'Self-awareness plus a real improvement plan.',
  }),
  hv({
    id: 'hv-25',
    category: 'behavioral',
    prompt: 'Tell us about a time you had to adapt to a big change.',
    answerSec: 90,
    rubric: STAR,
    outline:
      'In 2025 I moved from Dubai to Swarthmore while keeping Ayah Apparel running in the UAE. [the challenge the move created for the business]. I decided to change how I worked: I [what you changed, e.g. how you used Ayah’s monthly reporting to manage remotely], and I rebuilt the routine around [your detail]. As a result [your outcome]. I learned to adapt by changing the system, not just working harder, which helps when deals change direction overnight.',
    tips: STAR_TIPS,
    explanation: 'Adaptability: change the approach, not just the effort.',
    resumeItems: ['exp-ayah', 'edu-swarthmore'],
  }),
  hv({
    id: 'hv-26',
    category: 'behavioral',
    prompt: 'Tell us about a time you dealt with a difficult client or customer.',
    answerSec: 90,
    rubric: STAR,
    outline:
      'In my online fitness coaching practice in [when], one client [the difficulty]. I [what you did to understand them], I changed the plan to [your change], and I [how you kept them informed]. As a result [outcome]; that kind of retention is how I kept five recurring clients over two years. I learned [your lesson], which is the same in banking.',
    tips: STAR_TIPS,
    explanation: 'Client focus: listen, adjust, communicate.',
    resumeItems: ['exp-fitness', 'exp-ayah'],
  }),

  // ── Technical ──
  hv({
    id: 'hv-27',
    category: 'technical',
    sectionId: 'accounting',
    subtopic: 'three-statements',
    difficulty: 'basic',
    prompt: 'Walk us through the three financial statements.',
    answerSec: 90,
    rubric: [
      ['is', 'Income statement: revenue less expenses to net income over a period', [['income statement', 'net income']]],
      ['bs', 'Balance sheet: assets = liabilities + equity at a point in time', [['balance sheet', 'assets', 'liabilities', 'equity']]],
      ['cfs', 'Cash flow statement: operating, investing, financing', [['operat*', 'invest*', 'financ*']]],
      ['link', 'How they link (net income, retained earnings, ending cash)', [['retained earnings'], ['ending cash']]],
    ],
    outline:
      'The income statement shows revenue and expenses over a period, ending in net income. The balance sheet is a snapshot at a point in time where assets equal liabilities plus shareholders’ equity. The cash flow statement starts with net income, adds back non-cash charges and adjusts for working capital to get cash from operations, then adds investing and financing cash flows to get the net change in cash. They link because net income flows into the cash flow statement and retained earnings, and ending cash becomes cash on the balance sheet.',
    tips: ['Same answer as in the Accounting section: practice it until it’s automatic.', DELIVERY_TIP],
    explanation: 'Some bank HireVues include one or two basic technicals.',
  }),
  hv({
    id: 'hv-28',
    category: 'technical',
    sectionId: 'valuation',
    subtopic: 'methodologies',
    difficulty: 'basic',
    prompt: 'How would you value a company?',
    answerSec: 90,
    rubric: [
      ['comps', 'Trading comps', [['comps|comparable*|trading']]],
      ['precedents', 'Precedent transactions', [['precedent*']]],
      ['dcf', 'DCF', [['dcf|discounted cash flow']]],
      ['range', 'Present as ranges / football field, and choose by situation', [['range*|football field|depends']]],
    ],
    outline:
      'There are two broad approaches. Relative valuation uses trading comps, which look at the multiples similar public companies trade at, and precedent transactions, which use multiples paid in past acquisitions and include a control premium. Intrinsic valuation is a DCF: projecting free cash flows and discounting them at the cost of capital. If a private equity buyer is likely, an LBO analysis shows what a sponsor could pay. Each gives a range, and you compare them on a football field; which ones you weight depends on the company.',
    tips: ['Name the methods, then show judgment (“it depends on…”).', DELIVERY_TIP],
    explanation: 'Structure: relative vs intrinsic, then presentation.',
  }),
  hv({
    id: 'hv-29',
    category: 'technical',
    sectionId: 'ev-equity',
    subtopic: 'definitions',
    difficulty: 'basic',
    prompt: 'What is enterprise value, and why is it useful?',
    answerSec: 60,
    rubric: [
      ['def', 'Value of the core operations to all investors', [['operations|operating|core business', 'all|debt and equity|investors']]],
      ['bridge', 'Equity value plus debt, preferred and NCI, minus cash', [['equity value', 'debt', 'cash']]],
      ['why', 'Independent of capital structure, so good for comparing companies', [['capital structure|compar*']]],
    ],
    outline:
      'Enterprise value is the value of a company’s core operations to all of its investors, both debt and equity. You get it from equity value by adding debt, preferred stock and noncontrolling interest and subtracting cash. It’s useful because it doesn’t depend on how a company is financed, so you can compare companies with different capital structures using multiples like EV/EBITDA.',
    tips: ['Definition → formula → why it matters.', DELIVERY_TIP],
    explanation: 'Covered in depth in section 3.',
  }),
  hv({
    id: 'hv-30',
    category: 'technical',
    sectionId: 'dcf',
    subtopic: 'ufcf',
    difficulty: 'intermediate',
    prompt: 'Walk us through a DCF.',
    answerSec: 90,
    rubric: [
      ['fcf', 'Project unlevered free cash flow (EBIT after tax + D&A − capex − change in WC)', [['free cash flow|fcf']]],
      ['wacc', 'Discount at WACC', [['wacc|discount rate|cost of capital']]],
      ['tv', 'Terminal value (perpetuity growth or exit multiple)', [['terminal value']]],
      ['bridge', 'Sum PVs to get EV, then bridge to equity value and per share', [['enterprise value', 'equity value|per share|share price']]],
    ],
    outline:
      'A DCF values a company based on the present value of its future cash flows. First you project unlevered free cash flow for five to ten years: EBIT after tax, plus D&A, minus capex and the change in working capital. Then you calculate a terminal value for the years after that, using either a perpetuity growth rate or an exit multiple. You discount the cash flows and the terminal value back at the WACC and add them up to get enterprise value. Finally, you subtract net debt to get equity value and divide by diluted shares to get a share price.',
    tips: ['Four steps: FCF, terminal value, discount, bridge.', DELIVERY_TIP],
    explanation: 'The DCF section covers each step in depth.',
  }),

  // ── Markets ──
  hv({
    id: 'hv-31',
    category: 'markets',
    sectionId: 'markets',
    subtopic: 'pitch-deal',
    prompt: 'Tell us about a deal you have followed recently.',
    answerSec: 90,
    rubric: [
      ['facts', 'The facts: who bought whom, for how much, and how it was paid for', [['acquir*|bought|buy*|merg*'], ['billion|million|per share|\\$']]],
      ['rationale', 'Strategic rationale', [['rationale|strategic|synerg*|because']]],
      ['valuation', 'Valuation: multiple or premium', [['multiple|premium|ebitda|valuation']]],
      ['view', 'Your view, including a risk', [['i think|my view|i believe|risk*']]],
    ],
    outline:
      'One deal I’ve followed is [acquirer]’s acquisition of [target], announced in [month], for about $[X] billion, paid in [cash / stock / mix]. The strategic rationale is [rationale, e.g. adding capabilities or scale and expected synergies of $X]. On valuation, it was roughly [X]x EBITDA, a [Y]% premium to the unaffected share price, which is [above / in line with] recent deals in the sector. My view is that it makes sense because [reason], but the main risk is [integration / regulatory / financing risk].',
    tips: ['Use a deal from your Deal Journal.', 'Facts → rationale → valuation → your view and a risk.', DELIVERY_TIP],
    explanation: 'Interviewers test genuine interest and structure. Never pick a deal you can’t discuss for 3 minutes.',
  }),
  hv({
    id: 'hv-32',
    category: 'markets',
    sectionId: 'markets',
    subtopic: 'current-markets',
    prompt: 'What is happening in the markets right now, and how does it affect M&A activity?',
    answerSec: 90,
    rubric: [
      ['rates', 'Interest rates and the cost of financing', [['interest rate*|rates|fed|central bank*']]],
      ['financing', 'Credit markets and sponsor activity', [['financing|credit|private equity|sponsor*|leverage']]],
      ['valuation', 'Equity valuations and confidence', [['valuation*|equity market*|stock market|confidence']]],
      ['link', 'Ties it explicitly to deal volume or deal types', [['m&a|deal*|activity|volume']]],
    ],
    outline:
      'The biggest driver right now is [interest rates: where they are and where they’re heading]. Rates matter for M&A because they set the cost of financing: when debt is expensive, private equity sponsors can pay less and leveraged deals slow down. Equity valuations matter too: [what equity markets are doing], and when boards feel confident about valuations, strategic deals pick up. Put together, I’d expect [your view on deal activity and which sectors or deal types are most active], and I’d watch [one indicator].',
    tips: ['Update this weekly from your Market Notes.', 'Have one or two specific numbers ready (e.g. the policy rate).', DELIVERY_TIP],
    explanation: 'A framework (rates → financing → valuations → activity) beats a list of headlines.',
  }),
  hv({
    id: 'hv-33',
    category: 'markets',
    sectionId: 'markets',
    subtopic: 'pitch-stock',
    prompt: 'Pitch us a stock.',
    answerSec: 120,
    rubric: [
      ['rec', 'Clear recommendation (buy / sell) and target', [['buy|sell|long|short']]],
      ['thesis', 'Two or three thesis points', [['first|second|thesis|reason*']]],
      ['valuation', 'Valuation: why it’s mispriced', [['valuation|multiple|dcf|trades at|undervalued|overvalued']]],
      ['risk', 'Key risks and what would change your mind', [['risk*|change my mind|wrong']]],
    ],
    outline:
      'I’d buy [company], which trades at $[price], with a target of $[target]. My thesis has two parts. First, [growth or margin driver the market underestimates]. Second, [catalyst in the next 12 months]. On valuation it trades at [X]x forward earnings versus peers at [Y]x, and my reverse DCF says the price implies only [Z]% growth, which I think is too low. The main risk is [risk], and I’d change my mind if [specific signal].',
    tips: ['Use your Clarus work: a reverse DCF is a great proof point.', 'Recommendation in the first sentence.', DELIVERY_TIP],
    explanation: 'Recommendation, thesis, valuation, risks.',
    resumeItems: ['exp-clarus'],
  }),

  // ── Curveballs ──
  hv({
    id: 'hv-34',
    category: 'curveball',
    prompt: 'If you weren’t pursuing banking, what would you be doing?',
    answerSec: 60,
    rubric: [
      ['honest', 'An honest, related alternative', [['consult*|start*|business|entrepreneur*|invest*']]],
      ['thread', 'Shows the common thread that makes banking first choice', [['same reason|common thread|because|which is why']]],
      ['commit', 'Re-commits to banking', [['bank*']]],
    ],
    outline:
      'Probably building a business again, since I started Ayah Apparel and enjoyed every part of it, or strategy consulting, which I’ve done pro bono at 180 Degrees. The common thread is using analysis to make real decisions, which is why banking is my first choice: it gives me that on live transactions with much higher stakes, and the best training I could get.',
    tips: ['Don’t say “nothing else”; don’t say “a hedge fund”.', DELIVERY_TIP],
    explanation: 'Show self-awareness and a consistent story.',
    resumeItems: ['exp-ayah', 'exp-180dc'],
  }),
  hv({
    id: 'hv-35',
    category: 'curveball',
    prompt: 'What is something not on your resume that we should know about you?',
    answerSec: 60,
    rubric: [
      ['new', 'Something genuinely new and personal', [['outside|not on my resume|something you won t|something you wont|personally']]],
      ['trait', 'Reveals a trait relevant to the job', [['discipline|curious|curiosity|resilien*|persist*|patien*|adapt*']]],
      ['link', 'Brief link back to who you’d be as an analyst', [['analyst|team|work']]],
    ],
    outline:
      'Something not on my resume is [a personal interest or experience that is NOT on the resume, e.g. a sport, how you approach training, or a family responsibility]. What it says about me is [trait: discipline, curiosity or resilience], and it shows up in how I work: [one-line link to how you’d be as an analyst or teammate].',
    tips: ['Pick something memorable and true.', DELIVERY_TIP],
    explanation: 'This is a likeability question: be human, keep it short.',
  }),
  hv({
    id: 'hv-36',
    category: 'curveball',
    prompt: 'Teach us something in 60 seconds.',
    answerSec: 60,
    rubric: [
      ['topic', 'Picks a clear, contained topic', [['today|ill explain|i will explain|let me explain|im going to|i am going to']]],
      ['structure', 'Explains it in simple steps', [['first', 'second|then|finally']]],
      ['example', 'Uses an example', [['example|for instance|imagine']]],
      ['close', 'Closes with the takeaway', [['so|takeaway|that s why|thats why|in short']]],
    ],
    outline:
      'I’m going to explain why a company can be profitable and still run out of cash. First, profit is an accounting measure: revenue is recorded when it’s earned, even if the customer hasn’t paid. Second, growing companies tie up cash in receivables and inventory. Then debt repayments and capex don’t even show up as expenses. For example, imagine a distributor growing 50% a year: it has to buy more inventory and wait longer to get paid. So the takeaway is: watch cash flow, not just profit.',
    tips: ['Choose something you can explain simply; finance topics are fine.', 'First / then / so: make the structure audible.', DELIVERY_TIP],
    explanation: 'Tests communication: clarity, structure, an example.',
  }),
];

export const HIREVUE_BY_ID: Record<string, HireVueQuestion> = Object.fromEntries(HIREVUE_QUESTIONS.map((q) => [q.id, q]));
