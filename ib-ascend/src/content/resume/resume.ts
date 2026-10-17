import type { Resume } from '../../types/models';
import { SEED_RESUME_TEXT } from './resumeText';

/**
 * Structured version of Ameen_Zaidi_Resume.pdf (confirmed Phase 0, Oct 2026).
 * Seeded into the database on first run, so later re-imports can be diffed
 * against it on re-import. `confirmedNotes` hold facts the user confirmed that
 * are not printed on the resume.
 */
export const SEED_RESUME: Resume = {
  id: 'resume-v1',
  version: 1,
  importedAt: '2026-10-16T00:00:00.000Z',
  name: 'Ameen Zaidi',
  contact: {
    location: 'Swarthmore, PA',
    phones: ['+1 (484) 326-4766 (USA)', '+971 585942690 (UAE)'],
    email: 'azaidi1@swarthmore.edu',
  },
  items: [
    {
      id: 'edu-swarthmore',
      category: 'education',
      role: 'B.A. in Economics and Philosophy (intended double major)',
      org: 'Swarthmore College',
      location: 'Swarthmore, PA, USA',
      start: '2025',
      end: 'May 2029 (expected)',
      bullets: [
        'Coursework: Statistics, Intermediate Economics, Behavioral Economics, Physics — quantitative and decision-analysis foundation for financial modeling',
      ],
    },
    {
      id: 'edu-dubai-college',
      category: 'education',
      role: 'A-Levels, GCSEs',
      org: 'Dubai College',
      location: 'Dubai, UAE',
      start: 'Sep 2017',
      end: 'Jun 2025',
      bullets: [
        'A-Levels: English Literature, Physics, Economics, Mathematics, Extended Project Qualification (A*, A*, A, A, B)',
        'SAT 1510 (R&W 750, Math 760); eight grade 9s/8 A**s at GCSE',
      ],
      confirmedNotes: [
        'A-Level grades by subject: English Literature A*, Physics A, Economics A, Mathematics B, EPQ A*.',
      ],
    },
    {
      id: 'exp-180dc',
      category: 'experience',
      role: 'Consultant',
      org: '180 Degrees Consulting, Swarthmore College',
      start: '2026',
      end: 'Present',
      bullets: [
        'Selected to deliver pro bono MECE-structured strategy engagements for nonprofit and social-enterprise clients across outreach and operations',
      ],
      confirmedNotes: ['Has completed at least one engagement and has another in progress.'],
    },
    {
      id: 'exp-clarus',
      category: 'experience',
      role: 'Member',
      org: 'Clarus Capital Investments, Swarthmore College',
      start: '2026',
      end: 'Present',
      bullets: [
        'Build DCF, reverse-DCF, and comparable-company models to support equity research and portfolio analysis for the club’s fund',
        'Conduct stock market analysis and backtest systematic trading strategies to inform fund positioning',
      ],
      confirmedNotes: ['Has completed at least one piece of work and has another in progress.'],
    },
    {
      id: 'exp-stratus',
      category: 'experience',
      role: 'Advisor & Analyst',
      org: 'Stratus Labs',
      location: 'San Francisco, CA (Remote)',
      start: 'Oct 2025',
      end: 'Dec 2025',
      bullets: [
        'Built the financial model and investor pitch deck behind a $250K pre-seed raise, directing outreach to prospective investors',
        'Shaped fundraising strategy and investor targeting while advancing BD discussions with Fortune 500 prospects and frontier AI labs including xAI',
      ],
      confirmedNotes: ['The $250K pre-seed raise closed.'],
    },
    {
      id: 'exp-ayah',
      category: 'experience',
      role: 'Founder & CEO',
      org: 'Ayah Apparel',
      location: 'Dubai, UAE',
      start: 'Dec 2023',
      end: 'Present',
      bullets: [
        'Launched a direct-to-consumer streetwear brand across the UAE, building a three-statement model from primary sales records to drive pricing and sourcing decisions',
        'Engineered the e-commerce platform and TikTok acquisition channel, owning creative, copywriting, and monthly reporting',
      ],
    },
    {
      id: 'exp-improveme',
      category: 'experience',
      role: 'Research & Operations Intern',
      org: 'Improve ME Institute',
      location: 'Dubai, UAE',
      start: 'Dec 2024',
      end: 'Jan 2025',
      bullets: [
        'Structured a MECE framework across six Dubai submarkets, quantifying yields and price growth to deliver an independent, variant-view expansion recommendation to the founders',
        'Co-authored and marketed course materials and textbooks, producing quarterly performance reports for leadership',
      ],
    },
    {
      id: 'exp-fitness',
      category: 'experience',
      role: 'Founder',
      org: 'Independent Online Fitness Coaching',
      start: '2024',
      end: 'Present',
      bullets: [
        'Founded and scaled a remote coaching practice to five recurring clients over two years, owning acquisition and retention',
      ],
    },
    {
      id: 'proj-tcs',
      category: 'project',
      role: 'AI Transformation Consulting Extern',
      org: 'Tata Consultancy Services — GenAI-Powered Data Analytics Externship',
      start: 'Sep 2026',
      end: 'Sep 2026',
      bullets: [
        'Conducted credit risk analysis on a 500-record, 19-variable dataset, diagnosing data-quality issues and justifying a decision-tree model over logistic regression using a bias-tested precision/recall/AUC-ROC framework',
        'Translated findings into a SMART collections-strategy recommendation and an agentic-AI governance framework mapped to ECOA/FCRA/GDPR requirements',
      ],
    },
    {
      id: 'proj-lumiere',
      category: 'project',
      role: 'Individual Research Scholar',
      org: 'Lumiere Education',
      start: 'Jun 2023',
      end: 'Sep 2023',
      bullets: [
        'Authored a 30-page independent research paper — structured as a commercial-viability diligence memo — sizing the total addressable market and quantifying the waste-reduction impact of sensor-based AgTech, an emerging growth sector',
      ],
    },
    {
      id: 'lead-cs-society',
      category: 'leadership',
      role: 'Member',
      org: 'Computer Science Society, Swarthmore College',
      start: '2025',
      end: '2026',
      bullets: [
        'Attended workshops on Python and data analysis, reinforcing the technical toolkit used in financial modeling and quantitative research',
      ],
    },
    {
      id: 'lead-modelcore',
      category: 'leadership',
      role: 'Vice President',
      org: 'Modelcore, Dubai College Business Society',
      start: 'Sep 2023',
      end: 'Jun 2025',
      bullets: [
        'Led a cross-functional team sourcing and hosting C-suite executives, including Careem and Property Finder, into a national speaker network',
      ],
    },
    {
      id: 'lead-door-of-awareness',
      category: 'leadership',
      role: 'Volunteer & Outreach Support',
      org: 'Door of Awareness',
      location: 'Lahore, Pakistan',
      start: 'Jul 2024',
      end: 'Present',
      bullets: [
        'Deliver weekly English, mathematics, and business instruction to underserved students, building foundational academic and financial-literacy skills',
        'Engineered financial models and budgets for fundraising campaigns, advising leadership on donor-engagement strategy',
      ],
    },
    {
      id: 'lead-mun',
      category: 'leadership',
      role: 'Delegate & Trainer',
      org: 'Model United Nations',
      start: '2019',
      end: '2025',
      bullets: [
        'Competed across regional conferences and trained junior delegates; awarded Best Researcher, UN Security Council',
      ],
    },
    {
      id: 'ach-academics',
      category: 'achievement',
      role: 'Academic record',
      org: 'Dubai College',
      start: '2017',
      end: '2025',
      bullets: ['SAT 1510 (Math 760); A*A*AA + B across A-Levels and EPQ; eight grade 9s at GCSE'],
    },
    {
      id: 'ach-mun-award',
      category: 'achievement',
      role: 'Best Researcher, UN Security Council',
      org: 'Model United Nations',
      start: '2019',
      end: '2025',
      bullets: ['Awarded Best Researcher in the UN Security Council committee'],
    },
  ],
  skills: {
    finance: [
      'Financial modeling',
      'Valuation',
      'Comparable company analysis',
      'Market research',
      'Capital IQ',
      'PitchBook',
      'Refinitiv',
    ],
    technical: ['Excel', 'PowerPoint', 'VBA', 'Python', 'R', 'SQL'],
  },
  languages: [
    { language: 'English', level: 'Native' },
    { language: 'Urdu/Hindi', level: 'Fluent' },
    { language: 'Spanish', level: 'Intermediate' },
    { language: 'Arabic', level: 'Conversational' },
    { language: 'Portuguese', level: 'Beginner' },
  ],
  certifications: [
    'Deep Learning Specialization (DeepLearning.AI)',
    'AI for Business (Wharton)',
    'Principles of Management (Johns Hopkins)',
  ],
  rawText: SEED_RESUME_TEXT,
};
