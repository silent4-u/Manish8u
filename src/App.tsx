import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { LanguageProvider } from './i18n/LanguageContext';
import { ProgressProvider, useProgress } from './hooks/useProgress';
import { Layout } from './components/Layout';
import { LevelSelect } from './pages/LevelSelect';
import { Home } from './pages/Home';
import { Syllabus } from './pages/Syllabus';
import { SubjectList, LessonList, LessonView } from './pages/Study';
import { FirstPaperQuiz, PracticePicker, PracticeQuiz } from './pages/Practice';
import { FirstPaper } from './pages/FirstPaper';
import { Mock } from './pages/Mock';
import { ProgressPage } from './pages/ProgressPage';
import { Saved } from './pages/Saved';
import { Affairs } from './pages/Affairs';
import './styles/app.css';

/** Everything except the level chooser needs a chosen exam level. */
function RequireLevel({ children }: { children: ReactNode }) {
  const { levelId } = useProgress();
  const location = useLocation();
  if (!levelId) return <Navigate to="/levels" replace state={{ from: location.pathname }} />;
  return <>{children}</>;
}

export default function App() {
  return (
    <LanguageProvider>
      <ProgressProvider>
        <HashRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/levels" element={<LevelSelect />} />
              <Route path="/" element={<RequireLevel><Home /></RequireLevel>} />
              <Route path="/syllabus" element={<RequireLevel><Syllabus /></RequireLevel>} />
              <Route path="/first-paper" element={<RequireLevel><FirstPaper /></RequireLevel>} />
              <Route path="/first-paper/practice/:subjectId" element={<RequireLevel><FirstPaperQuiz /></RequireLevel>} />
              <Route path="/study" element={<RequireLevel><SubjectList /></RequireLevel>} />
              <Route path="/study/:subjectId" element={<RequireLevel><LessonList /></RequireLevel>} />
              <Route path="/lesson/:lessonId" element={<RequireLevel><LessonView /></RequireLevel>} />
              <Route path="/practice" element={<RequireLevel><PracticePicker /></RequireLevel>} />
              <Route path="/practice/:subjectId" element={<RequireLevel><PracticeQuiz /></RequireLevel>} />
              <Route path="/mock" element={<RequireLevel><Mock /></RequireLevel>} />
              <Route path="/progress" element={<RequireLevel><ProgressPage /></RequireLevel>} />
              <Route path="/saved" element={<RequireLevel><Saved /></RequireLevel>} />
              <Route path="/affairs" element={<RequireLevel><Affairs /></RequireLevel>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </HashRouter>
      </ProgressProvider>
    </LanguageProvider>
  );
}
