import { createHashRouter } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './features/dashboard/Dashboard';
import { SkillTree } from './features/skilltree/SkillTree';
import { ResumePage } from './features/profile/ResumePage';
import { Settings } from './features/settings/Settings';
import { ComingSoon } from './components/ComingSoon';

/** Hash router so the static build works from any path without server rewrites. */
export const router = createHashRouter([
  {
    element: <Layout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'tree', element: <SkillTree /> },
      {
        path: 'section/:sectionId',
        element: <ComingSoon title="Section flow" phase={3} what="Pre-quiz → reading → worked examples → post-quiz → Boss Fight, plus flashcards, mistake log and cheat sheet." />,
      },
      {
        path: 'review',
        element: <ComingSoon title="Review queue" phase={7} what="SM-2 spaced repetition across flashcards, missed questions and weak stories." />,
      },
      {
        path: 'stories',
        element: <ComingSoon title="Story Bank" phase={9} what="STAR stories for every resume item, the 75+ question behavioral bank, coverage matrix and practice mode." />,
      },
      {
        path: 'superday',
        element: <ComingSoon title="Superday Simulator" phase={8} what="Back-to-back technical, behavioral and mixed rounds with firm-style interviewer personas." />,
      },
      {
        path: 'tools',
        element: <ComingSoon title="Tools" phase={8} what="Paper LBO Trainer, DCF / accretion-dilution / LBO builders and the Mental Math Arcade. Firm Tracker, Deal Journal and Recruiting Calendar follow in Phase 9." />,
      },
      { path: 'resume', element: <ResumePage /> },
      { path: 'settings', element: <Settings /> },
      { path: '*', element: <ComingSoon title="Not found" what="That page doesn’t exist." /> },
    ],
  },
]);
