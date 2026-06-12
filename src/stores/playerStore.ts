import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Station } from '../domain/models/Station';
import type { Channel } from '../domain/models/Channel';

interface PlayerState {
  currentChannel: Channel | null;
  currentStation: Station | null;
  isPlaying: boolean;
  volume: number; // 0.0 to 1.0
  isLoading: boolean;
  error: string | null;
  analyser: AnalyserNode | null;
  nowPlaying: string | null;

  // Actions
  setChannel: (channel: Channel | null) => void;
  setStation: (station: Station) => void;
  play: () => void;
  pause: () => void;
  setVolume: (volume: number) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setAnalyser: (analyser: AnalyserNode | null) => void;
  setNowPlaying: (track: string | null) => void;
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set) => ({
      currentChannel: null,
      currentStation: null,
      isPlaying: false,
      volume: 1.0,
      isLoading: false,
      error: null,
      analyser: null,
      nowPlaying: null,

      setChannel: (channel) => set({ 
        currentChannel: channel, 
        currentStation: channel && channel.stations.length > 0 ? channel.stations[0] : null, 
        error: null, 
        isLoading: true, 
        isPlaying: true,
        nowPlaying: null
      }),
      setStation: (station) => set({ currentStation: station, error: null, isLoading: true, isPlaying: true, nowPlaying: null }),
      play: () => set({ isPlaying: true }),
      pause: () => set({ isPlaying: false }),
      setVolume: (volume) => set({ volume }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error, isLoading: false, isPlaying: false }),
      setAnalyser: (analyser) => set({ analyser }),
      setNowPlaying: (track) => set({ nowPlaying: track }),
    }),
    {
      name: 'radiom-player-storage',
      // Only persist the channel, station, and volume. Don't persist playing state or errors.
      partialize: (state) => ({ 
        currentChannel: state.currentChannel,
        currentStation: state.currentStation,
        volume: state.volume
      }),
    }
  )
);
