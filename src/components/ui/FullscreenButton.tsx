import { useState, useEffect } from 'react';
import { useUIStore } from '../../stores/uiStore';
import { useIsMobile } from '../../hooks/useIsMobile';

const PixelMaximize = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" shapeRendering="crispEdges">
    {/* Top Left */}
    <rect x="1" y="1" width="5" height="1" />
    <rect x="1" y="2" width="1" height="4" />
    <rect x="2" y="2" width="1" height="1" />
    <rect x="3" y="3" width="1" height="1" />
    <rect x="4" y="4" width="1" height="1" />
    <rect x="5" y="5" width="1" height="1" />

    {/* Top Right */}
    <rect x="10" y="1" width="5" height="1" />
    <rect x="14" y="2" width="1" height="4" />
    <rect x="13" y="2" width="1" height="1" />
    <rect x="12" y="3" width="1" height="1" />
    <rect x="11" y="4" width="1" height="1" />
    <rect x="10" y="5" width="1" height="1" />

    {/* Bottom Left */}
    <rect x="1" y="14" width="5" height="1" />
    <rect x="1" y="10" width="1" height="4" />
    <rect x="2" y="13" width="1" height="1" />
    <rect x="3" y="12" width="1" height="1" />
    <rect x="4" y="11" width="1" height="1" />
    <rect x="5" y="10" width="1" height="1" />

    {/* Bottom Right */}
    <rect x="10" y="14" width="5" height="1" />
    <rect x="14" y="10" width="1" height="4" />
    <rect x="13" y="13" width="1" height="1" />
    <rect x="12" y="12" width="1" height="1" />
    <rect x="11" y="11" width="1" height="1" />
    <rect x="10" y="10" width="1" height="1" />
  </svg>
);

const PixelMinimize = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" shapeRendering="crispEdges">
    {/* Top Left */}
    <rect x="2" y="6" width="5" height="1" />
    <rect x="6" y="2" width="1" height="4" />
    <rect x="5" y="5" width="1" height="1" />
    <rect x="4" y="4" width="1" height="1" />
    <rect x="3" y="3" width="1" height="1" />
    <rect x="2" y="2" width="1" height="1" />

    {/* Top Right */}
    <rect x="9" y="6" width="5" height="1" />
    <rect x="9" y="2" width="1" height="4" />
    <rect x="10" y="5" width="1" height="1" />
    <rect x="11" y="4" width="1" height="1" />
    <rect x="12" y="3" width="1" height="1" />
    <rect x="13" y="2" width="1" height="1" />

    {/* Bottom Left */}
    <rect x="2" y="9" width="5" height="1" />
    <rect x="6" y="10" width="1" height="4" />
    <rect x="5" y="10" width="1" height="1" />
    <rect x="4" y="11" width="1" height="1" />
    <rect x="3" y="12" width="1" height="1" />
    <rect x="2" y="13" width="1" height="1" />

    {/* Bottom Right */}
    <rect x="9" y="9" width="5" height="1" />
    <rect x="9" y="10" width="1" height="4" />
    <rect x="10" y="10" width="1" height="1" />
    <rect x="11" y="11" width="1" height="1" />
    <rect x="12" y="12" width="1" height="1" />
    <rect x="13" y="13" width="1" height="1" />
  </svg>
);

export const FullscreenButton = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const isIdle = useUIStore(state => state.isIdle);
  const { isMobile } = useIsMobile();

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Hide on mobile — Fullscreen API doesn't work on mobile browsers
  if (isMobile) return null;

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      }
    } catch (err) {
      console.error(`Error attempting to enable fullscreen: ${err}`);
    }
  };

  return (
    <button
      onClick={toggleFullscreen}
      style={{
        position: 'absolute',
        top: '2rem',
        right: '2rem',
        zIndex: 10,
        background: 'transparent',
        border: 'none',
        color: 'var(--color-text)',
        opacity: isIdle ? 0 : 0.5,
        pointerEvents: isIdle ? 'none' : 'auto',
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      onMouseEnter={(e) => {
        if (!isIdle) {
          e.currentTarget.style.opacity = '1';
          e.currentTarget.style.transform = 'scale(1.1)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isIdle) {
          e.currentTarget.style.opacity = '0.5';
          e.currentTarget.style.transform = 'scale(1)';
        }
      }}
      aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
    >
      {isFullscreen ? <PixelMinimize size={20} /> : <PixelMaximize size={20} />}
    </button>
  );
};
