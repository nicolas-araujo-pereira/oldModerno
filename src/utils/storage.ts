import { AppProgress } from '../types';

const STORAGE_KEY = 'oldmodeno_user_progress_v1';

export const DEFAULT_PROGRESS: AppProgress = {
  unlockedStep: 1,
  completedSteps: [],
  activeThemeId: 'blue',
  totalBubblesPopped: 0,
  totalBarsCharged: 0,
};

export const storage = {
  getProgress: (): AppProgress => {
    if (typeof window === 'undefined') return DEFAULT_PROGRESS;
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return DEFAULT_PROGRESS;
      const parsed = JSON.parse(data) as Partial<AppProgress>;
      return {
        unlockedStep: Math.min(Math.max(parsed.unlockedStep ?? 1, 1), 5),
        completedSteps: Array.isArray(parsed.completedSteps) ? parsed.completedSteps : [],
        activeThemeId: parsed.activeThemeId || 'blue',
        totalBubblesPopped: parsed.totalBubblesPopped || 0,
        totalBarsCharged: parsed.totalBarsCharged || 0,
      };
    } catch {
      return DEFAULT_PROGRESS;
    }
  },

  saveProgress: (progress: AppProgress): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // localStorage quota or private mode protection
    }
  },

  resetProgress: (): AppProgress => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // noop
      }
    }
    return DEFAULT_PROGRESS;
  }
};
