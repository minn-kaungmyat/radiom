import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type PanelType = 'stations' | 'favorites' | 'focus' | 'ambient' | 'environments' | 'chat' | 'settings' | null;
export type ModalType = 'shortcuts' | 'about' | null;

interface UIState {
  activePanel: PanelType;
  activeModal: ModalType;
  isIdle: boolean;
  
  // Mobile-specific state
  isMobilePlayerExpanded: boolean;
  isMobileMoreOpen: boolean;
  
  // Actions
  setPanel: (panel: PanelType) => void;
  togglePanel: (panel: Exclude<PanelType, null>) => void;
  closePanel: () => void;
  setModal: (modal: ModalType) => void;
  closeModal: () => void;
  setIdle: (isIdle: boolean) => void;
  interactionSoundsEnabled: boolean;
  toggleInteractionSounds: () => void;

  playerPosition: 'top' | 'bottom';
  setPlayerPosition: (position: 'top' | 'bottom') => void;
  
  // Mobile actions
  setMobilePlayerExpanded: (expanded: boolean) => void;
  setMobileMoreOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      activePanel: null,
      activeModal: null,
      isIdle: false,
      interactionSoundsEnabled: true,
      playerPosition: 'bottom',
      isMobilePlayerExpanded: false,
      isMobileMoreOpen: false,

      setPanel: (panel) => set({ activePanel: panel, isIdle: false }),
      
      togglePanel: (panel) => set((state) => ({
        activePanel: state.activePanel === panel ? null : panel,
        isIdle: false
      })),
      
      closePanel: () => set({ activePanel: null, isIdle: false }),
      
      setModal: (modal) => set({ activeModal: modal, isIdle: false }),
      
      closeModal: () => set({ activeModal: null, isIdle: false }),

      setIdle: (isIdle) => set({ isIdle }),

      toggleInteractionSounds: () => set((state) => ({ interactionSoundsEnabled: !state.interactionSoundsEnabled })),
      
      setPlayerPosition: (position) => set({ playerPosition: position }),
      
      setMobilePlayerExpanded: (expanded) => set({ isMobilePlayerExpanded: expanded }),
      setMobileMoreOpen: (open) => set({ isMobileMoreOpen: open }),
    }),
    {
      name: 'radiom-ui-storage',
      partialize: (state) => ({
        interactionSoundsEnabled: state.interactionSoundsEnabled,
        playerPosition: state.playerPosition,
      }),
    }
  )
);
