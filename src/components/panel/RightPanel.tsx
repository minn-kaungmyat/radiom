import { useRef, useEffect } from 'react';
import { X } from '../icons';
import { useUIStore } from '../../stores/uiStore';
import { StationsView } from './StationsView';
import { FavoritesView } from './FavoritesView';
import { FocusView } from './FocusView';
import { SettingsView } from './SettingsView';
import { ThemesView } from './ThemesView';
import { AmbientMixerView } from './AmbientMixerView';
import { ChatPanel } from '../chat/ChatPanel';
import { GlassPanel } from '../ui/GlassPanel';
import { IconButton } from '../ui/IconButton';
import { useIsMobile } from '../../hooks/useIsMobile';

export const RightPanel = () => {
  const activePanel = useUIStore((state) => state.activePanel);
  const closePanel = useUIStore((state) => state.closePanel);
  const { isMobile } = useIsMobile();

  const isOpen = activePanel !== null;
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activePanel && panelRef.current && !panelRef.current.contains(event.target as Node)) {
        // Prevent closing if we are clicking on the left dock or the player
        const leftDock = document.getElementById('left-dock');
        if (leftDock && leftDock.contains(event.target as Node)) {
          return;
        }

        const floatingPlayer = document.getElementById('floating-player');
        if (floatingPlayer && floatingPlayer.contains(event.target as Node)) {
          return;
        }

        closePanel();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activePanel, closePanel]);

  // Helper to render current panel content
  const renderContent = () => {
    switch (activePanel) {
      case 'stations':
        return <StationsView />;
      case 'favorites':
        return <FavoritesView />;
      case 'focus':
        return <FocusView />;
      case 'settings':
        return <SettingsView />;
      case 'environments':
        return <ThemesView />;
      case 'ambient':
        return <AmbientMixerView />;
      case 'chat':
        return <ChatPanel />;
      default:
        return null;
    }
  };

  const getPanelTitle = () => {
    switch (activePanel) {
      case 'stations': return 'Browse Stations';
      case 'favorites': return 'Your Library';
      case 'focus': return 'Pomodoro Focus';
      case 'settings': return 'Settings';
      case 'environments': return 'Visual Environments';
      case 'ambient': return 'Ambient Mixer';
      default: return '';
    }
  };

  // ===== MOBILE: Fullscreen slide-up panel =====
  if (isMobile) {
    return (
      <GlassPanel
        ref={panelRef}
        className={`flex-col mobile-fullscreen-panel ${!isOpen ? 'panel-closed' : ''}`}
        style={{
          position: 'fixed',
          pointerEvents: isOpen ? 'auto' : 'none',
          background: 'rgba(12, 14, 18, 0.95)',
          zIndex: 15,
          transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          overflow: 'hidden',
          paddingBottom: 'calc(145px + var(--safe-area-bottom, 0px))',
        }}
      >
        {/* Header */}
        {activePanel !== 'chat' && (
          <div
            className="flex-between"
            style={{
              padding: '1rem 1.25rem',
              paddingTop: 'calc(1rem + var(--safe-area-top, 0px))',
              borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
            }}
          >
            <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-text)' }}>
              {getPanelTitle()}
            </h2>
            <IconButton
              icon={<X size={18} />}
              onClick={closePanel}
              size={32}
              popOnHover={false}
            />
          </div>
        )}

        {/* Content Area */}
        <div className="flex-col" style={{ flex: 1, padding: activePanel === 'chat' ? 0 : '1rem 1.25rem', overflow: 'hidden', minHeight: 0 }}>
          {renderContent()}
        </div>
      </GlassPanel>
    );
  }

  // ===== DESKTOP: Original slide-from-right panel (unchanged) =====
  return (
    <GlassPanel
      ref={panelRef}
      className="flex-col"
      borderRadius="24px 0 0 24px"
      style={{
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        pointerEvents: isOpen ? 'auto' : 'none',
        width: '380px',
        height: '100vh',
        background: 'rgba(20, 24, 28, 0.55)',
        borderRight: 'none',
        boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.4)',
        zIndex: 15,
        transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        overflow: 'hidden'
      }}
    >
      {/* Header */}
      {activePanel !== 'chat' && (
        <div
          className="flex-between"
          style={{
            padding: '1rem 1.25rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          }}
        >
          <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-text)' }}>
            {getPanelTitle()}
          </h2>
          <IconButton
            icon={<X size={18} />}
            onClick={closePanel}
            size={32}
            popOnHover={false}
          />
        </div>
      )}

      {/* Content Area */}
      <div className="flex-col" style={{ flex: 1, padding: activePanel === 'chat' ? 0 : '1rem 1.25rem', overflow: 'hidden', minHeight: 0 }}>
        {renderContent()}
      </div>
    </GlassPanel>
  );
};
