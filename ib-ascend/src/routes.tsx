import { createHashRouter } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './features/dashboard/Dashboard';
import { SkillTree } from './features/skilltree/SkillTree';
import { ResumePage } from './features/profile/ResumePage';
import { Settings } from './features/settings/Settings';
import { Achievements } from './features/achievements/Achievements';
import { HireVuePage } from './features/hirevue/HireVue';
import { ComingSoon } from './components/ComingSoon';
import { SectionLayout } from './features/section/SectionLayout';
import { SectionPath } from './features/section/SectionPath';
import { Chapter, ReadingList } from './features/section/Reading';
import { Examples } from './features/section/Examples';
import { Flashcards } from './features/section/Flashcards';
import { MistakeLog } from './features/section/MistakeLog';
import { CheatSheet } from './features/section/CheatSheet';
import { QuizPage } from './features/section/QuizPage';

/** Hash router so the static build works from any path without server rewrites. */
export const router = createHashRouter([
  {
    element: <Layout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'tree', element: <SkillTree /> },
      {
        path: 'section/:sectionId',
        element: <SectionLayout />,
        children: [
          { index: true, element: <SectionPath /> },
          { path: 'read', element: <ReadingList /> },
          { path: 'read/:lessonId', element: <Chapter /> },
          { path: 'examples', element: <Examples /> },
          { path: 'flashcards', element: <Flashcards /> },
          { path: 'mistakes', element: <MistakeLog /> },
          { path: 'cheatsheet', element: <CheatSheet /> },
          { path: 'quiz/:mode', element: <QuizPage /> },
        ],
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
      { path: 'achievements', element: <Achievements /> },
      { path: 'hirevue', element: <HireVuePage /> },
      { path: 'resume', element: <ResumePage /> },
      { path: 'settings', element: <Settings /> },
      { path: '*', element: <ComingSoon title="Not found" what="That page doesn’t exist." /> },
    ],
  },
]);
