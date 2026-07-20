import { Routes, Route } from 'react-router-dom';
import { ProgressProvider } from './context/ProgressContext';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { SystemsList } from './pages/SystemsList';
import { SystemDetail } from './pages/SystemDetail';
import { Flashcards } from './pages/Flashcards';
import { Quizzes } from './pages/Quizzes';
import { QuizSession } from './pages/QuizSession';
import { Atlas } from './pages/Atlas';
import { AtlasDetail } from './pages/AtlasDetail';
import { Settings } from './pages/Settings';
import { NotFound } from './pages/NotFound';

/**
 * OCCC BIO 1314 / BIO 1414 — Anatomy Hub
 * Mounted by Study Buddy at /classes/occc-bio-ap/*
 * Hub owns the single top-level router; this file only exports Routes.
 */
export default function OcccBioApApp() {
  return (
    <ProgressProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="systems" element={<SystemsList />} />
          <Route path="systems/:systemId" element={<SystemDetail />} />
          <Route path="flashcards" element={<Flashcards />} />
          <Route path="quizzes" element={<Quizzes />} />
          <Route path="quizzes/:quizType" element={<QuizSession />} />
          <Route path="atlas" element={<Atlas />} />
          <Route path="atlas/:structureId" element={<AtlasDetail />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </ProgressProvider>
  );
}
