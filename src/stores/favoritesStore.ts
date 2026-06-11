import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Station } from '../domain/models/Station';

interface FavoritesState {
  favorites: Station[];
  addFavorite: (station: Station) => void;
  removeFavorite: (stationId: string) => void;
  isFavorite: (stationId: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      
      addFavorite: (station) => {
        const { favorites } = get();
        if (!favorites.some((fav) => fav.id === station.id)) {
          set({ favorites: [...favorites, station] });
        }
      },
      
      removeFavorite: (stationId) => {
        const { favorites } = get();
        set({ favorites: favorites.filter((fav) => fav.id !== stationId) });
      },
      
      isFavorite: (stationId) => {
        const { favorites } = get();
        return favorites.some((fav) => fav.id === stationId);
      },
    }),
    {
      name: 'radiom-favorites', // Local storage key
    }
  )
);
