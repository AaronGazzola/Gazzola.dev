export interface ThemeState {
  isDarkMode: boolean;
  setIsDarkMode: (isDarkMode: boolean) => void;
  gradientEnabled: boolean;
  setGradientEnabled: (gradientEnabled: boolean) => void;
  starsEnabled: boolean;
  setStarsEnabled: (starsEnabled: boolean) => void;
  singleColor: string;
  setSingleColor: (singleColor: string) => void;
  gradientColors: string[];
  setGradientColors: (gradientColors: string[]) => void;
  starColors: string[];
  setStarColors: (starColors: string[]) => void;
  starSize: number;
  setStarSize: (starSize: number) => void;
  starNumber: number;
  setStarNumber: (starNumber: number) => void;
  reset: () => void;
}