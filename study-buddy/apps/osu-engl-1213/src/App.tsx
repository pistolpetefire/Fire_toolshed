import { Routes, Route } from 'react-router-dom';
import { ProgressProvider } from './context/ProgressContext';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Syllabus } from './pages/Syllabus';
import { UnitsList } from './pages/UnitsList';
import { UnitDetail } from './pages/UnitDetail';
import { Flashcards } from './pages/Flashcards';
import { Quizzes } from './pages/Quizzes';
import { QuizSession, ExamPrep } from './pages/QuizSession';
import { Planner } from './pages/Planner';
import { Forgotten } from './pages/Forgotten';
import { Settings } from './pages/Settings';
import { NotFound } from './pages/NotFound';

/**
 * OSU ENGL 1213 Fall 2026 (Hughes) — Comp II Hub
 * Mounted by Study Buddy at /classes/osu-engl-1213/*
 */
export default function OsuEngl1213App() {
  return (
    <ProgressProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="planner" element={<Planner />} />
          <Route path="forgotten" element={<Forgotten />} />
          <Route path="syllabus" element={<Syllabus />} />
          <Route path="units" element={<UnitsList />} />
          <Route path="units/:unitId" element={<UnitDetail />} />
          <Route path="flashcards" element={<Flashcards />} />
          <Route path="quizzes" element={<Quizzes />} />
          <Route path="quizzes/exam/:blockId" element={<ExamPrep />} />
          <Route path="quizzes/:quizType" element={<QuizSession />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </ProgressProvider>
  );
}
