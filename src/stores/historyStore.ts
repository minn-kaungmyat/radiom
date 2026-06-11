import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Station } from '../domain/models/Station';

interface HistoryState {
  history: Station[];
  
  // Actions
  addStation: (station: Station) => void;
  clearHistory: () => void;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      history: [],

      addStation: (station) => set((state) => {
        // Don't add if it's the exact same station we just added (prevent consecutive duplicates)
        if (state.history.length > 0 && state.history[0].id === station.id) {
          return state;
        }

        // Add to front of array, keep max 50 items
        const newHistory = [station, ...state.history].slice(0, 50);
        return { history: newHistory };
      }),

      clearHistory: () => set({ history: [] }),
    }),
    {
      name: 'radiom-history-storage',
    }
  )
);
