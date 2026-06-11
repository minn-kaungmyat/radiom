import { create } from 'zustand';
import type { Station } from '../domain/models/Station';
import { radioBrowserService } from '../services/radio/radio-browser.service';

interface StationState {
  searchQuery: string;
  selectedGenre: string;
  selectedCountry: string;
  selectedLanguage: string;
  searchResults: Station[];
  isLoadingSearch: boolean;
  searchError: string | null;

  browseTab: 'curated' | 'public';

  availableGenres: string[];
  availableCountries: { name: string; code?: string }[];
  availableLanguages: string[];

  // Actions
  setSearchQuery: (query: string) => void;
  setFilter: (type: 'genre' | 'country' | 'language', value: string) => void;
  clearFilters: () => void;
  setBrowseTab: (tab: 'curated' | 'public') => void;
  executeSearch: () => Promise<void>;
  fetchFilters: () => Promise<void>;
}

export const useStationStore = create<StationState>((set, get) => ({
  searchQuery: '',
  selectedGenre: 'All',
  selectedCountry: 'All',
  selectedLanguage: 'All',
  searchResults: [],
  isLoadingSearch: false,
  searchError: null,
  browseTab: 'curated',
  availableGenres: [],
  availableCountries: [],
  availableLanguages: [],

  setSearchQuery: (query) => set({ searchQuery: query }),
  
  setFilter: (type, value) => {
    if (type === 'genre') set({ selectedGenre: value });
    if (type === 'country') set({ selectedCountry: value });
    if (type === 'language') set({ selectedLanguage: value });
  },

  clearFilters: () => set({ selectedGenre: 'All', selectedCountry: 'All', selectedLanguage: 'All' }),

  setBrowseTab: (tab) => set({ browseTab: tab }),

  executeSearch: async () => {
    const { searchQuery, selectedGenre, selectedCountry, selectedLanguage } = get();
    
    set({ isLoadingSearch: true, searchError: null });
    try {
      const results = await radioBrowserService.searchStations({
        name: searchQuery,
        tag: selectedGenre === 'All' ? 'All' : (selectedGenre === 'Lo-Fi' ? 'lofi' : selectedGenre.toLowerCase()),
        country: selectedCountry,
        language: selectedLanguage,
        limit: 50
      });
      set({ searchResults: results, isLoadingSearch: false });
    } catch (e) {
      set({ searchError: 'Failed to search stations. Please try again.', isLoadingSearch: false });
    }
  },

  fetchFilters: async () => {
    const { availableGenres, availableCountries, availableLanguages } = get();
    if (availableGenres.length > 0 && availableCountries.length > 0 && availableLanguages.length > 0) {
      return;
    }
    
    try {
      const [genres, countries, languages] = await Promise.all([
        radioBrowserService.getTopTags(40),
        radioBrowserService.getTopCountries(250),
        radioBrowserService.getTopLanguages(150)
      ]);
      
      set({
        availableGenres: genres,
        availableCountries: countries,
        availableLanguages: languages
      });
    } catch (e) {
      console.error("Failed to load search filters", e);
    }
  }
}));
