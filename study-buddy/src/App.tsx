import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HubLayout } from './components/HubLayout';
import { ScrollToTop } from './components/ScrollToTop';
import { HubHome } from './pages/HubHome';
import { HubNotFound } from './pages/HubNotFound';
import { ComingSoon } from './pages/ComingSoon';
import OcccBioApApp from '../apps/occc-bio-ap/src/App';

/**
 * Study Buddy — multi-class study hub
 *
 * Hub shell: /
 * Class apps: /classes/<slug>/*
 * Placeholders: /coming-soon/<slug>
 *
 * Adding a class:
 * 1. apps/<slug>/meta.ts + src/App.tsx
 * 2. catalog.ts entry
 * 3. <Route path="/classes/<slug>/*" element={<YourApp />} />
 */
export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Hub */}
        <Route element={<HubLayout />}>
          <Route index element={<HubHome />} />
          <Route path="coming-soon/:slug" element={<ComingSoon />} />
        </Route>

        {/* Class apps (isolated folders under apps/) */}
        <Route path="/classes/occc-bio-ap/*" element={<OcccBioApApp />} />

        {/* Hub 404 */}
        <Route element={<HubLayout />}>
          <Route path="*" element={<HubNotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
