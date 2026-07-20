import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MapStyleMode } from '../types/train';

export type ActiveTab = 'landing' | 'track' | 'live-map' | 'stations' | 'history' | 'api-status' | 'train-info';

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
}

interface TrainStore {
  activeTrainNumber: string;
  favorites: string[];
  searchHistory: string[];
  mapStyleMode: MapStyleMode;
  isCommandPaletteOpen: boolean;
  isVoiceSearchOpen: boolean;
  isAuthModalOpen: boolean;
  user: UserProfile | null;
  activeTab: ActiveTab;
  
  // Actions
  setActiveTrainNumber: (number: string) => void;
  toggleFavorite: (number: string) => void;
  addSearchHistory: (query: string) => void;
  clearSearchHistory: () => void;
  setMapStyleMode: (mode: MapStyleMode) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setVoiceSearchOpen: (open: boolean) => void;
  setAuthModalOpen: (open: boolean) => void;
  setUser: (user: UserProfile | null) => void;
  logout: () => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export const useTrainStore = create<TrainStore>()(
  persist(
    (set, get) => ({
      activeTrainNumber: '20901',
      favorites: ['20901', '12951'],
      searchHistory: ['20901', 'Vande Bharat', '12951', 'Rajdhani Express'],
      mapStyleMode: 'DARK_CYBER',
      isCommandPaletteOpen: false,
      isVoiceSearchOpen: false,
      isAuthModalOpen: false,
      user: null,
      activeTab: 'landing',

      setActiveTrainNumber: (number: string) => {
        set({ activeTrainNumber: number, activeTab: 'track' });
      },

      toggleFavorite: (number: string) => {
        const { favorites } = get();
        const exists = favorites.includes(number);
        if (exists) {
          set({ favorites: favorites.filter((f) => f !== number) });
        } else {
          set({ favorites: [...favorites, number] });
        }
      },

      addSearchHistory: (query: string) => {
        const clean = query.trim();
        if (!clean) return;
        const { searchHistory } = get();
        const filtered = searchHistory.filter((item) => item.toLowerCase() !== clean.toLowerCase());
        set({ searchHistory: [clean, ...filtered].slice(0, 8) });
      },

      clearSearchHistory: () => {
        set({ searchHistory: [] });
      },

      setMapStyleMode: (mode: MapStyleMode) => {
        set({ mapStyleMode: mode });
      },

      setCommandPaletteOpen: (open: boolean) => {
        set({ isCommandPaletteOpen: open });
      },

      setVoiceSearchOpen: (open: boolean) => {
        set({ isVoiceSearchOpen: open });
      },

      setAuthModalOpen: (open: boolean) => {
        set({ isAuthModalOpen: open });
      },

      setUser: (user: UserProfile | null) => {
        set({ user });
      },

      logout: () => {
        set({ user: null });
      },

      setActiveTab: (tab: ActiveTab) => {
        set({ activeTab: tab });
      },
    }),
    {
      name: 'railwayvision-storage',
      partialize: (state) => ({
        activeTrainNumber: state.activeTrainNumber,
        favorites: state.favorites,
        searchHistory: state.searchHistory,
        mapStyleMode: state.mapStyleMode,
        user: state.user,
      }),
    }
  )
);
