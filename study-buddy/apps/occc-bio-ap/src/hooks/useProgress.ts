import { useCallback, useEffect, useState } from 'react';
import type { UserProgress } from '../types';
import { loadProgress, saveProgress } from '../lib/storage';

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(() => loadProgress());

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const updateProgress = useCallback((updater: (p: UserProgress) => UserProgress) => {
    setProgress((prev) => updater(prev));
  }, []);

  const resetProgress = useCallback(() => {
    const fresh = loadProgress();
    // Force reset via storage clear + default
    localStorage.removeItem('study-buddy:occc-bio-ap:progress-v1');
    localStorage.removeItem('study-budd:occc-bio-ap:progress-v1');
    localStorage.removeItem('occc-anatomy-hub-progress-v1');
    setProgress(loadProgress());
    return fresh;
  }, []);

  return { progress, setProgress, updateProgress, resetProgress };
}
