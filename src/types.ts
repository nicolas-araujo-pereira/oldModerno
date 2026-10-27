export interface ThemeColor {
  id: string;
  name: string;
  bgClass: string;
  hex: string;
  contrastText: string;
  cardBg: string;
  accentColor: string;
  description: string;
}

export interface AppProgress {
  unlockedStep: number; // 1 to 5
  completedSteps: number[]; // [1, 2, 3...]
  activeThemeId: string;
  totalBubblesPopped: number;
  totalBarsCharged: number;
}

export interface ChallengeInfo {
  id: number;
  title: string;
  subtitle: string;
  instruction: string;
  shortDesc: string;
  iconName: string;
}
