import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HubLayout } from './components/HubLayout';
import { ScrollToTop } from './components/ScrollToTop';
import { HubHome } from './pages/HubHome';
import { HubNotFound } from './pages/HubNotFound';
import { ComingSoon } from './pages/ComingSoon';
import OcccBioApApp from '../apps/occc-bio-ap/src/App';
import OsuPlnt1213App from '../apps/osu-plnt-1213/src/App';
import OsuEngl1213App from '../apps/osu-engl-1213/src/App';
import OsuFpst1213App from '../apps/osu-fpst-1213/src/App';
import { getRouterBasename } from './routerBase';

/**
 * Study Buddy — multi-class study hub
 *
 * Hub shell: /
 * Class apps: /classes/<slug>/*
 * Placeholders: /coming-soon/<slug>
 *
 * On GitHub Pages, BrowserRouter basename is /Fire_toolshed
 * (from Vite base). In-app paths stay root-relative ("/classes/...").
 */
export default function App() {
  return (
    <BrowserRouter basename={getRouterBasename()}>
      <ScrollToTop />
      <Routes>
        <Route element={<HubLayout />}>
          <Route index element={<HubHome />} />
          <Route path="coming-soon/:slug" element={<ComingSoon />} />
        </Route>

        <Route path="/classes/occc-bio-ap/*" element={<OcccBioApApp />} />
        <Route path="/classes/osu-plnt-1213/*" element={<OsuPlnt1213App />} />
        <Route path="/classes/osu-engl-1213/*" element={<OsuEngl1213App />} />
        <Route path="/classes/osu-fpst-1213/*" element={<OsuFpst1213App />} />

        <Route element={<HubLayout />}>
          <Route path="*" element={<HubNotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
