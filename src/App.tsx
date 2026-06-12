import { useEffect, useRef } from 'react';
import { useIsMobile } from './hooks/useIsMobile';
import { useAudioPlayer } from './services/playback/useAudioPlayer';
import { FloatingPlayer } from './components/player/FloatingPlayer';
import { LeftDock } from './components/dock/LeftDock';
import { RightPanel } from './components/panel/RightPanel';
import { usePlayerStore } from './stores/playerStore';
import { useThemeStore } from './stores/themeStore';
import { useUIStore } from './stores/uiStore';
import { CHANNELS } from './domain/constants/channels';
import { DraggableFocusPill } from './components/pomodoro/DraggableFocusPill';
import { usePomodoroStore } from './stores/pomodoroStore';
import { SessionCompleteModal } from './components/pomodoro/SessionCompleteModal';
import { AmbientPlayer } from './components/player/AmbientPlayer';
import { FullscreenButton } from './components/ui/FullscreenButton';
import { DraggableNotepad } from './components/notes/DraggableNotepad';
import { DraggableChat } from './components/chat/DraggableChat';
import { loadCustomBackgroundBlob } from './utils/storage';
import { useInteractionSounds } from './hooks/useInteractionSounds';
import { useChatStore } from './stores/chatStore';

function App() {
  // Initialize audio playback service
  useAudioPlayer();
  
  // Initialize interaction sounds
  useInteractionSounds();

  const { isMobile } = useIsMobile();
  const currentChannel = usePlayerStore(state => state.currentChannel);
  const currentStation = usePlayerStore(state => state.currentStation);
  const setChannel = usePlayerStore(state => state.setChannel);
  const currentBackground = useThemeStore(state => state.currentBackground);
  const setIdle = useUIStore(state => state.setIdle);
  const activePanel = useUIStore(state => state.activePanel);
  const _initPusher = useChatStore(state => state._initPusher);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Initialize Pusher connection
  useEffect(() => {
    _initPusher();
  }, [_initPusher]);

  useEffect(() => {
    const handleActivity = () => {
      setIdle(false);
      clearTimeout(timeoutRef.current);
      // Only become idle if no panel is actively open
      if (!activePanel) {
        timeoutRef.current = setTimeout(() => {
          setIdle(true);
        }, 10000);
      }
    };

    handleActivity(); // Initial setup

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('mousedown', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('touchstart', handleActivity);
    window.addEventListener('wheel', handleActivity);

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('mousedown', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
      window.removeEventListener('wheel', handleActivity);
      clearTimeout(timeoutRef.current);
    };
  }, [setIdle, activePanel]);

  // Pomodoro global tick
  useEffect(() => {
    const interval = setInterval(() => {
      usePomodoroStore.getState().tick();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Set default channel on mount
  useEffect(() => {
    if (!currentChannel && !currentStation) {
      setChannel(CHANNELS[0]); // Rainy Lo-Fi
    }
  }, [currentChannel, currentStation, setChannel]);

  // Restore custom background blob URLs from IndexedDB
  useEffect(() => {
    const restoreCustomBackgrounds = async () => {
      const { customBackgrounds, setCustomBackgrounds, currentBackground } = useThemeStore.getState();
      let needsUpdate = false;

      const updatedBackgrounds = await Promise.all(
        customBackgrounds.map(async (bg) => {
          if (bg.isCustom) {
            const file = await loadCustomBackgroundBlob(bg.id);
            if (file) {
              needsUpdate = true;
              return { ...bg, videoPath: URL.createObjectURL(file) };
            }
          }
          return bg;
        })
      );

      if (needsUpdate) {
        setCustomBackgrounds(updatedBackgrounds);
        // Also update currentBackground if it's a custom one
        if (currentBackground.isCustom) {
          const updatedCurrent = updatedBackgrounds.find((b) => b.id === currentBackground.id);
          if (updatedCurrent) {
            // Update the state directly or use setBackground
            // We need to bypass the persist since we just want to update the in-memory blob URL
            useThemeStore.setState({ currentBackground: updatedCurrent });
          }
        }
      }
    };
    restoreCustomBackgrounds();
  }, []);

  return (
    <div style={{ width: '100vw', height: '100dvh', display: 'flex', position: 'relative', overflow: 'hidden' }}>
      {/* Immersive Room Background Video or Image */}
      {currentBackground.type === 'image' ? (
        <img
          key={currentBackground.id}
          src={currentBackground.videoPath}
          alt={currentBackground.name}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: -1,
          }}
        />
      ) : (
        <video
          key={currentBackground.id}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          src={currentBackground.videoPath}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: -1,
          }}
        />
      )}
      {/* Left Dock Area — on mobile, LeftDock renders its own fixed-bottom bar */}
      {isMobile ? (
        <LeftDock />
      ) : (
        <div style={{ position: 'absolute', top: '50%', left: '2rem', transform: 'translateY(-50%)', zIndex: 10 }}>
          <LeftDock />
        </div>
      )}

      {/* Floating Player Layer */}
      <FloatingPlayer />

      {/* Right Context Panel */}
      <RightPanel />

      {/* Draggable widgets */}
      <DraggableFocusPill />

      {/* Global Overlays */}
      <SessionCompleteModal />

      {/* Fullscreen Toggle */}
      <FullscreenButton />

      {/* Global Audio Players */}
      <AmbientPlayer />

      {/* Notepad */}
      <DraggableNotepad />
      
      {/* Draggable Chat */}
      <DraggableChat />
    </div>
  );
}

export default App;
