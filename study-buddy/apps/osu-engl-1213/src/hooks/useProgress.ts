import { useCallback, useEffect, useState } from 'react';
import type { UserProgress } from '../types';
import { loadProgress, saveProgress, clearProgress } from '../lib/storage';
import { DEFAULT_PROGRESS } from '../types';

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(() => loadProgress());

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const updateProgress = useCallback((updater: (p: UserProgress) => UserProgress) => {
    setProgress((prev) => updater(prev));
  }, []);

  const resetProgress = useCallback(() => {
    clearProgress();
    setProgress(structuredClone(DEFAULT_PROGRESS));
  }, []);

  return { progress, setProgress, updateProgress, resetProgress };
}
