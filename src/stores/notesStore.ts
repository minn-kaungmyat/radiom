import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface NotesState {
  isOpen: boolean;
  isMinimized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  content: string;
  isEditing: boolean;
  
  toggleOpen: () => void;
  setOpen: (open: boolean) => void;
  setMinimized: (minimized: boolean) => void;
  setPosition: (pos: { x: number; y: number }) => void;
  setSize: (size: { width: number; height: number }) => void;
  setContent: (content: string) => void;
  setIsEditing: (isEditing: boolean) => void;
}

export const useNotesStore = create<NotesState>()(
  persist(
    (set) => ({
      isOpen: false,
      isMinimized: false,
      position: { x: window.innerWidth / 2 - 150, y: window.innerHeight / 2 - 200 },
      size: { width: 300, height: 400 },
      content: '# My Scratchpad\n\n- [ ] Make a lo-fi playlist\n- [x] Drink water\n\n*Click the edit icon or double-click to edit!*',
      isEditing: false,

      toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
      setOpen: (open) => set({ isOpen: open }),
      setMinimized: (minimized) => set({ isMinimized: minimized }),
      setPosition: (pos) => set({ position: pos }),
      setSize: (size) => set({ size: size }),
      setContent: (content) => set({ content }),
      setIsEditing: (isEditing) => set({ isEditing }),
    }),
    {
      name: 'lazyday-notes-storage',
    }
  )
);
