import { useEffect } from 'react';
import { useUIStore } from '../stores/uiStore';
import { playClickSound } from '../utils/audio';

export const useInteractionSounds = () => {
  useEffect(() => {
    const handleGlobalClick = (event: MouseEvent) => {
      // Check if interaction sounds are enabled
      const { interactionSoundsEnabled } = useUIStore.getState();
      if (!interactionSoundsEnabled) return;

      // Find the closest interactive element to the click target
      const target = event.target as HTMLElement;
      
      const isInteractive = target.closest('button') || 
                            target.closest('a') || 
                            target.closest('[role="button"]') ||
                            target.closest('[role="tab"]') ||
                            target.closest('[role="switch"]') ||
                            target.closest('[role="slider"]') ||
                            target.closest('input[type="range"]') ||
                            target.closest('input[type="checkbox"]') ||
                            window.getComputedStyle(target).cursor === 'pointer';

      if (isInteractive) {
        playClickSound();
      }
    };

    // Run in the bubble phase so that UI state changes (like the toggle itself) 
    // are applied before we check if sounds are enabled.
    document.addEventListener('click', handleGlobalClick);

    return () => {
      document.removeEventListener('click', handleGlobalClick);
    };
  }, []);
};
