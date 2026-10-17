import { createHashRouter } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './features/dashboard/Dashboard';
import { SkillTree } from './features/skilltree/SkillTree';
import { ResumePage } from './features/profile/ResumePage';
import { Settings } from './features/settings/Settings';
import { Achievements } from './features/achievements/Achievements';
import { HireVuePage } from './features/hirevue/HireVue';
import { ComingSoon } from './components/ComingSoon';
import { ErrorScreen } from './components/ErrorScreen';
import { SectionLayout } from './features/section/SectionLayout';
import { SectionPath } from './features/section/SectionPath';
import { Chapter, ReadingList } from './features/section/Reading';
import { Examples } from './features/section/Examples';
import { Flashcards } from './features/section/Flashcards';
import { MistakeLog } from './features/section/MistakeLog';
import { CheatSheet } from './features/section/CheatSheet';
import { QuizPage } from './features/section/QuizPage';
import { ReviewPage } from './features/review/ReviewPage';
import { ToolsHub } from './features/tools/ToolsHub';
import { Superday } from './features/superday/Superday';
import { StoryBank } from './features/stories/StoryBank';
import { FirmTracker } from './features/tracker/FirmTracker';
import { Journal } from './features/tracker/Journal';
import { RecruitingCalendar } from './features/tracker/Calendar';
import { PaperLbo } from './features/tools/PaperLbo';
import { Arcade } from './features/tools/Arcade';
import { ModelBuilders } from './features/tools/ModelBuilders';

/** Hash router so the static build works from any path without server rewrites. */
export const router = createHashRouter([
  {
    element: <Layout />,
    errorElement: <ErrorScreen />,
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
      { path: 'review', element: <ReviewPage /> },
      { path: 'stories', element: <StoryBank /> },
      { path: 'tools/firms', element: <FirmTracker /> },
      { path: 'tools/firms/:firmId', element: <FirmTracker /> },
      { path: 'tools/journal', element: <Journal /> },
      { path: 'tools/calendar', element: <RecruitingCalendar /> },
      { path: 'superday', element: <Superday /> },
      { path: 'tools', element: <ToolsHub /> },
      { path: 'tools/paper-lbo', element: <PaperLbo /> },
      { path: 'tools/arcade', element: <Arcade /> },
      { path: 'tools/models', element: <ModelBuilders /> },
      { path: 'tools/models/:model', element: <ModelBuilders /> },
      { path: 'achievements', element: <Achievements /> },
      { path: 'hirevue', element: <HireVuePage /> },
      { path: 'resume', element: <ResumePage /> },
      { path: 'settings', element: <Settings /> },
      { path: '*', element: <ComingSoon title="Not found" what="That page doesn’t exist." /> },
    ],
  },
]);
