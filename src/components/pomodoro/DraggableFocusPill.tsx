import { useState, useEffect, useRef } from 'react';
import { usePomodoroStore } from '../../stores/pomodoroStore';
import { useUIStore } from '../../stores/uiStore';
import { Play, Pause } from '../icons';

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

export const DraggableFocusPill = () => {
  const { isRunning, timeLeft, duration, start, pause } = usePomodoroStore();
  const activePanel = useUIStore(state => state.activePanel);
  const setPanel = useUIStore(state => state.setPanel);
  const playerPosition = useUIStore(state => state.playerPosition);

  // Show if timer is running OR if it's paused but not at the starting duration
  const hasStarted = isRunning || timeLeft < duration;
  const shouldShow = hasStarted && activePanel !== 'focus';

  const pillRef = useRef<HTMLDivElement>(null);

  const [position, setPosition] = useState({ x: window.innerWidth / 2, y: 60 });
  const [fontSize, setFontSize] = useState(1.8);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const resizeStart = useRef({ y: 0, fontSize: 0, multiplier: 1 });
  const hasDragged = useRef(false);

  useEffect(() => {
    // Handle window resize gracefully
    const handleResize = () => {
      setPosition(prev => ({
        x: Math.min(prev.x, window.innerWidth - 120),
        y: Math.min(prev.y, window.innerHeight - 60)
      }));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!shouldShow) {
      setIsHovered(false);
      setIsDragging(false);
      setIsResizing(false);
    }
  }, [shouldShow]);

  // Auto-dodge the player if it's placed at the top and the pill is in the way
  useEffect(() => {
    if (playerPosition === 'top' && !isDragging) {
      // "Danger zone" at the top center
      const isClashing = position.y < 120 && position.x > window.innerWidth / 2 - 300 && position.x < window.innerWidth / 2 + 300;
      if (isClashing) {
        setPosition(prev => ({ ...prev, y: 150 }));
      }
    }
  }, [playerPosition, isDragging, position.x, position.y]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        hasDragged.current = true;

        let newX = e.clientX - dragOffset.current.x;
        let newY = e.clientY - dragOffset.current.y;

        const halfWidth = pillRef.current ? pillRef.current.offsetWidth / 2 : 60;
        const halfHeight = pillRef.current ? pillRef.current.offsetHeight / 2 : 20;

        const boundsX = window.innerWidth - halfWidth;
        const boundsY = window.innerHeight - halfHeight;

        newX = Math.max(halfWidth, Math.min(newX, boundsX));
        newY = Math.max(halfHeight, Math.min(newY, boundsY));

        setPosition({ x: newX, y: newY });
      } else if (isResizing) {
        // Calculate font size based on vertical drag distance
        const deltaY = (e.clientY - resizeStart.current.y) * resizeStart.current.multiplier;
        // 1 rem change per 50 pixels dragged
        const newSize = resizeStart.current.fontSize + (deltaY / 50);
        setFontSize(Math.min(Math.max(newSize, 1.0), 6.0));
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing]);

  const handleResizeMouseDown = (e: React.MouseEvent, multiplier: number) => {
    e.stopPropagation();
    setIsResizing(true);
    resizeStart.current = { y: e.clientY, fontSize, multiplier };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (pillRef.current) {
      hasDragged.current = false;
      const rect = pillRef.current.getBoundingClientRect();
      dragOffset.current = {
        x: e.clientX - (rect.left + rect.width / 2),
        y: e.clientY - (rect.top + rect.height / 2)
      };
      setIsDragging(true);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    // Prevent default scroll
    setFontSize(prev => {
      // smooth scaling based on delta
      const newSize = prev - (e.deltaY * 0.002);
      return Math.min(Math.max(newSize, 1.0), 6.0); // clamp between 1.0rem and 6.0rem
    });
  };

  if (!shouldShow) return null;

  return (
    <div
      ref={pillRef}
      className={`glass-panel ${isDragging ? 'grabbing' : 'grab'}`}
      onMouseDown={handleMouseDown}
      onWheel={handleWheel}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 100,
        borderRadius: '100px',
        padding: '0.4rem 0.75rem',
        display: 'flex',
        alignItems: 'center',
        gap: (isHovered || isDragging || isResizing || !isRunning) ? '0.75rem' : '0rem',
        userSelect: 'none',
        transform: `translate(-50%, -50%) ${isDragging ? 'scale(1.02)' : 'scale(1)'}`,
        transition: isDragging ? 'none' : 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s, gap 0.3s cubic-bezier(0.16, 1, 0.3, 1)',

        transformOrigin: 'center'
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-pixel)',
          fontSize: `${fontSize}rem`,
          fontWeight: 600,
          color: isRunning ? 'var(--color-text)' : 'var(--color-text-muted)',
          textShadow: isRunning ? '0 0 10px rgba(255,255,255,0.4)' : 'none',
          lineHeight: 1,
          marginTop: '2px' // optical alignment for pixel font
        }}
        onClick={() => {
          if (!hasDragged.current) setPanel('focus');
        }}
        title="Open Focus Panel"
      >
        {formatTime(timeLeft)}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          width: (isHovered || isDragging || isResizing || !isRunning) ? `${Math.min(fontSize * 20, 44) + 12}px` : '0px',
          opacity: (isHovered || isDragging || isResizing || !isRunning) ? 1 : 0,
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <div style={{ width: '1px', height: '18px', background: 'rgba(255,255,255,0.1)', marginRight: '8px' }} />

        <button
          onMouseDown={(e) => e.stopPropagation()}
          onClick={isRunning ? pause : start}
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.05)',
            color: 'var(--color-text)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '6px',
            borderRadius: '50%',
            cursor: 'pointer',
            transition: 'all 0.2s',
            flexShrink: 0
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          {isRunning ? <Pause size={Math.min(fontSize * 10, 22)} /> : <Play size={Math.min(fontSize * 10, 22)} style={{ marginLeft: '2px' }} />}
        </button>
      </div>

      {/* Resize Handles (Invisible) */}
      <div
        onMouseDown={(e) => handleResizeMouseDown(e, -1)}
        style={{
          position: 'absolute', top: 0, left: 0, width: '20px', height: '20px', cursor: 'nwse-resize', zIndex: 10
        }}
      />
      <div
        onMouseDown={(e) => handleResizeMouseDown(e, -1)}
        style={{
          position: 'absolute', top: 0, right: 0, width: '20px', height: '20px', cursor: 'nesw-resize', zIndex: 10
        }}
      />
      <div
        onMouseDown={(e) => handleResizeMouseDown(e, 1)}
        style={{
          position: 'absolute', bottom: 0, left: 0, width: '20px', height: '20px', cursor: 'nesw-resize', zIndex: 10
        }}
      />
      <div
        onMouseDown={(e) => handleResizeMouseDown(e, 1)}
        style={{
          position: 'absolute', bottom: 0, right: 0, width: '20px', height: '20px', cursor: 'nwse-resize', zIndex: 10
        }}
      />
    </div>
  );
};
