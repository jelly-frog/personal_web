import { create } from 'zustand';

interface UIState {
  isScrolled: boolean;
  setIsScrolled: (isScrolled: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isScrolled: false,
  setIsScrolled: (isScrolled) => set({ isScrolled }),
}));
