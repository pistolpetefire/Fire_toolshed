import { createContext, useContext, type ReactNode } from 'react';
import type { UserProgress } from '../types';
import { useProgress } from '../hooks/useProgress';
import { useTheme } from '../hooks/useTheme';

interface ProgressContextValue {
  progress: UserProgress;
  setProgress: React.Dispatch<React.SetStateAction<UserProgress>>;
  updateProgress: (updater: (p: UserProgress) => UserProgress) => void;
  resetProgress: () => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const value = useProgress();
  useTheme(value.progress.theme);

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgressContext() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgressContext must be used within ProgressProvider');
  return ctx;
}
