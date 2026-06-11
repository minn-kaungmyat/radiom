import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface BackgroundTheme {
  id: string;
  name: string;
  videoPath: string; // Used for both video and image URLs
  iconName: string; // To be mapped to icons in the UI
  thumbnailPath: string;
  type?: 'video' | 'image';
  isCustom?: boolean;
}

export const BACKGROUNDS: BackgroundTheme[] = [
  // Pixel Art
  { id: 'pixel-room-rainy-night', name: 'Rainy Night Room Pixel', videoPath: '/backgrounds/pixel-room-rainy-night.webm', iconName: 'CloudRain', thumbnailPath: '/thumbnails/pixel-room-rainy-night.jpg' },
  { id: 'a-quiet-night-in-a-rainy-pixel-city', name: 'Rainy City Pixel', videoPath: '/backgrounds/a-quiet-night-in-a-rainy-pixel-city.webm', iconName: 'CloudRain', thumbnailPath: '/thumbnails/a-quiet-night-in-a-rainy-pixel-city.jpg' },
  { id: 'lofi-girl-reading-book', name: 'Lofi Reading Pixel', videoPath: '/backgrounds/lofi-girl-reading-book-while-its-raining-outside-pixel.webm', iconName: 'BookOpen', thumbnailPath: '/thumbnails/lofi-girl-reading-book-while-its-raining-outside-pixel.jpg' },
  { id: '90s-sunset-retro-room', name: '90s Retro Room Pixel', videoPath: '/backgrounds/90s-sunset-retro-room-pixel.webm', iconName: 'Terminal', thumbnailPath: '/thumbnails/90s-sunset-retro-room-pixel.jpg' },
  { id: 'lonely-homer-starry-night', name: 'Starry Night Pixel', videoPath: '/backgrounds/lonely-homer-starry-night-sky-pixel.webm', iconName: 'Moon', thumbnailPath: '/thumbnails/lonely-homer-starry-night-sky-pixelr.jpg' },
  { id: 'sunset-city-street', name: 'Sunset City Street Pixel', videoPath: '/backgrounds/sunset-city-street-pixel.webm', iconName: 'Moon', thumbnailPath: '/thumbnails/sunset-city-street-pixel.jpg' },
  { id: 'midnight-drive-city', name: 'Midnight Drive Pixel', videoPath: '/backgrounds/midnight-drive-city-lights-pixel.webm', iconName: 'Moon', thumbnailPath: '/thumbnails/midnight-drive-city-lights-pixel.jpg' },
  { id: 'retrowave-biker-city', name: 'Retrowave Biker Pixel', videoPath: '/backgrounds/retrowave-biker-city-pixel.webm', iconName: 'Terminal', thumbnailPath: '/thumbnails/retrowave-biker-city-pixel.jpg' },
  { id: 'pixel-city-calm', name: 'City Calm Pixel', videoPath: '/backgrounds/pixel-city-calm.webm', iconName: 'Moon', thumbnailPath: '/thumbnails/pixel-city-calm.png' },
  { id: 'pixel-night-room', name: 'Night Room Pixel', videoPath: '/backgrounds/pixel-night-room.webm', iconName: 'Moon', thumbnailPath: '/thumbnails/pixel-night-room.jpg' },
  { id: 'room-in-rainy-day-pixel', name: 'Rainy Day Room Pixel', videoPath: '/backgrounds/room-in-rainy-day-pixel.webm', iconName: 'CloudRain', thumbnailPath: '/thumbnails/room-in-rainy-day-pixel.jpg' },

  // Non-Pixel Art
  { id: 'aesthetic-car-ride', name: 'Aesthetic Car Ride', videoPath: '/backgrounds/aesthetic-car-ride-into-sunset.webm', iconName: 'Moon', thumbnailPath: '/thumbnails/aesthetic-car-ride-into-sunset.jpg' },
  { id: 'morning-tea', name: 'Morning Tea', videoPath: '/backgrounds/morning-tea.webm', iconName: 'Coffee', thumbnailPath: '/thumbnails/morning-tea.jpg' },
  { id: 'lofi-vending-machines', name: 'Vending Machines', videoPath: '/backgrounds/lofi-vending-machines.webm', iconName: 'Coffee', thumbnailPath: '/thumbnails/lofi-vending-machines.jpg' },

  // Synthwave
  { id: 'highway-synthwave', name: 'Highway Synthwave', videoPath: '/backgrounds/highway-synthwave.webm', iconName: 'Terminal', thumbnailPath: '/thumbnails/highway-synthwave.jpg' },
  { id: 'synthwave-city', name: 'Synthwave City', videoPath: '/backgrounds/synthwave-city.webm', iconName: 'Terminal', thumbnailPath: '/thumbnails/synthwave-city.jpg' },
];

interface ThemeState {
  currentBackground: BackgroundTheme;
  customBackgrounds: BackgroundTheme[];
  setBackground: (id: string) => void;
  addCustomBackground: (bg: BackgroundTheme) => void;
  removeCustomBackground: (id: string) => void;
  setCustomBackgrounds: (bgs: BackgroundTheme[]) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      currentBackground: BACKGROUNDS[0], // default to pixel-room-rainy-night
      customBackgrounds: [],
      setBackground: (id) => {
        const bg = [...BACKGROUNDS, ...get().customBackgrounds].find((b) => b.id === id);
        if (bg) {
          set({ currentBackground: bg });
        }
      },
      addCustomBackground: (bg) => {
        set((state) => ({ customBackgrounds: [...state.customBackgrounds, bg] }));
      },
      removeCustomBackground: (id) => {
        set((state) => {
          const newCustoms = state.customBackgrounds.filter(b => b.id !== id);
          // If the removed background was the current one, fallback to default
          let nextCurrent = state.currentBackground;
          if (nextCurrent.id === id) {
            nextCurrent = BACKGROUNDS[0];
          }
          return { customBackgrounds: newCustoms, currentBackground: nextCurrent };
        });
      },
      setCustomBackgrounds: (bgs) => {
        set({ customBackgrounds: bgs });
      }
    }),
    {
      name: 'radiom-theme-storage',
      partialize: (state) => ({
        currentBackground: state.currentBackground,
        customBackgrounds: state.customBackgrounds
      }),
    }
  )
);
