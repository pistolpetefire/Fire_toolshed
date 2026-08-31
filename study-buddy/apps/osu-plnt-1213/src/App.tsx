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
import { Exam1Guide } from './pages/Exam1Guide';
import { StudyPlan } from './pages/StudyPlan';
import { Settings } from './pages/Settings';
import { NotFound } from './pages/NotFound';

/**
 * OSU PLNT 1213 Fall 2026 (Haggard) — Agronomy Hub
 * Mounted by Study Buddy at /classes/osu-plnt-1213/*
 */
export default function OsuPlnt1213App() {
  return (
    <ProgressProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="syllabus" element={<Syllabus />} />
          <Route path="plan" element={<StudyPlan />} />
          <Route path="units" element={<UnitsList />} />
          <Route path="units/:unitId" element={<UnitDetail />} />
          <Route path="flashcards" element={<Flashcards />} />
          <Route path="quizzes" element={<Quizzes />} />
          <Route path="quizzes/exam/1/guide" element={<Exam1Guide />} />
          <Route path="quizzes/exam/:blockId" element={<ExamPrep />} />
          <Route path="quizzes/:quizType" element={<QuizSession />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </ProgressProvider>
  );
}
