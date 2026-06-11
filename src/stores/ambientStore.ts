import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AmbientTrack {
  id: string;
  name: string;
  url: string;
  volume: number; // 0.0 to 1.0
  isActive: boolean;
}

interface AmbientState {
  tracks: AmbientTrack[];
  
  // Actions
  toggleTrack: (id: string) => void;
  setVolume: (id: string, volume: number) => void;
  stopAll: () => void;
}

const DEFAULT_TRACKS: AmbientTrack[] = [
  {
    id: 'light_rain',
    name: 'Light Rain',
    url: '/ambience/light-rain.mp3',
    volume: 0.5,
    isActive: false
  },
  {
    id: 'heavy_rain',
    name: 'Heavy Rain',
    url: '/ambience/heavy-rain.mp3',
    volume: 0.5,
    isActive: false
  },
  {
    id: 'thunderstorm',
    name: 'Thunderstorm',
    url: '/ambience/thunderstorm.mp3',
    volume: 0.4,
    isActive: false
  },
  {
    id: 'cafe',
    name: 'Cafe',
    url: '/ambience/cafe.mp3',
    volume: 0.4,
    isActive: false
  },
  {
    id: 'library',
    name: 'Library',
    url: '/ambience/library.mp3',
    volume: 0.4,
    isActive: false
  },
  {
    id: 'night_train',
    name: 'Night Train',
    url: '/ambience/night-train.mp3',
    volume: 0.3,
    isActive: false
  },
  {
    id: 'fireplace',
    name: 'Fireplace',
    url: '/ambience/fireplace.mp3',
    volume: 0.6,
    isActive: false
  },
  {
    id: 'night_city',
    name: 'Night City',
    url: '/ambience/night-city.mp3',
    volume: 0.3,
    isActive: false
  },
  {
    id: 'keyboard',
    name: 'Keyboard',
    url: '/ambience/keyboard.mp3',
    volume: 0.3,
    isActive: false
  },
  {
    id: 'windy_night',
    name: 'Windy Night',
    url: '/ambience/windy-night.mp3',
    volume: 0.4,
    isActive: false
  }
];

export const useAmbientStore = create<AmbientState>()(
  persist(
    (set) => ({
      tracks: DEFAULT_TRACKS,

      toggleTrack: (id) => set((state) => ({
        tracks: state.tracks.map(track => 
          track.id === id ? { ...track, isActive: !track.isActive } : track
        )
      })),

      setVolume: (id, volume) => set((state) => ({
        tracks: state.tracks.map(track => 
          track.id === id ? { ...track, volume } : track
        )
      })),

      stopAll: () => set((state) => ({
        tracks: state.tracks.map(track => ({ ...track, isActive: false }))
      }))
    }),
    {
      name: 'radiom-ambient-storage-v3',
    }
  )
);
