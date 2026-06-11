import React, { useRef } from 'react';
import { useChatStore } from '../../stores/chatStore';
import { useUIStore } from '../../stores/uiStore';
import { X, MessageSquare } from '../icons';
import { ChatStream } from './ChatStream';
import { useIsMobile } from '../../hooks/useIsMobile';

export const DraggableChat = () => {
  const { 
    isWindowOpen, windowPosition: position, windowSize: size, onlineCount,
    setWindowOpen, setWindowPosition: setPosition, setWindowSize: setSize 
  } = useChatStore();
  
  const isIdle = useUIStore(state => state.isIdle);
  const setPanel = useUIStore(state => state.setPanel);
  const { isMobile } = useIsMobile();
  
  const chatRef = useRef<HTMLDivElement>(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const resizeStart = useRef({ w: 0, h: 0, x: 0, y: 0 });

  // Handle Dragging
  const handleDragMouseDown = (e: React.MouseEvent) => {
    if (e.target instanceof HTMLElement && e.target.closest('button')) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    if (chatRef.current) {
      const rect = chatRef.current.getBoundingClientRect();
      dragOffset.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
    
    document.body.classList.add('is-dragging');

    const handleMouseMove = (e: MouseEvent) => {
      let newX = e.clientX - dragOffset.current.x;
      let newY = e.clientY - dragOffset.current.y;

      newX = Math.max(0, Math.min(newX, window.innerWidth - size.width));
      newY = Math.max(0, Math.min(newY, window.innerHeight - size.height));

      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      document.body.classList.remove('is-dragging');
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Handle Resizing
  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    resizeStart.current = {
      w: size.width,
      h: size.height,
      x: e.clientX,
      y: e.clientY
    };

    const handleMouseMove = (e: MouseEvent) => {
      let newW = resizeStart.current.w + (e.clientX - resizeStart.current.x);
      let newH = resizeStart.current.h + (e.clientY - resizeStart.current.y);
      
      newW = Math.max(280, Math.min(newW, window.innerWidth - position.x));
      newH = Math.max(300, Math.min(newH, window.innerHeight - position.y));

      setSize({ width: newW, height: newH });
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  if (!isWindowOpen) return null;

  // ===== MOBILE: Bottom Sheet =====
  if (isMobile) {
    return (
      <>
        <div className="mobile-sheet-backdrop" onClick={() => setWindowOpen(false)} />
        <div
          className="glass-panel mobile-sheet"
          style={{
            height: '80vh',
            display: 'flex',
            flexDirection: 'column',
            background: 'rgba(12, 14, 18, 0.95)',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '0.75rem 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
              userSelect: 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text)' }}>
              <MessageSquare size={16} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-text)', fontFamily: 'var(--font-pixel)' }}>
                  Study Lounge
                </span>
                <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>
                  {onlineCount} Online
                </span>
              </div>
            </div>
            <button
              onClick={() => setWindowOpen(false)}
              style={{ background: 'transparent', border: 'none', color: '#ff6b6b', cursor: 'pointer', display: 'flex', padding: '8px' }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <ChatStream />
          </div>
        </div>
      </>
    );
  }

  // ===== DESKTOP: Original Draggable Chat (unchanged) =====
  return (
    <div
      ref={chatRef}
      className="glass-panel"
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        zIndex: 25, // Just under Notepad (30) so notepad is usually on top
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '16px',
        opacity: isIdle ? 0.6 : 1,
        transition: 'opacity 0.5s',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
      }}
    >
      {/* Header */}
      <div
        onMouseDown={handleDragMouseDown}
        style={{
          padding: '0.75rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'grab',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          gap: '1rem',
          userSelect: 'none'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, color: 'var(--color-text)' }}>
          <MessageSquare size={16} /> 
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-text)', fontFamily: 'var(--font-pixel)', whiteSpace: 'nowrap' }}>
              Study Lounge
            </span>
            <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>
              {onlineCount} Online
            </span>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <button 
            onClick={() => {
              setWindowOpen(false);
              setPanel('chat' as any);
            }}
            className="hover-pixel-pop"
            title="Dock to side panel"
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: 'var(--color-text-muted)', 
              cursor: 'pointer', 
              display: 'flex', 
              padding: '4px',
              fontSize: '0.7rem',
              fontWeight: 'bold',
              marginRight: '0.5rem'
            }}
          >
            DOCK
          </button>
          <button 
            onClick={() => setWindowOpen(false)}
            className="hover-pixel-pop"
            style={{ background: 'transparent', border: 'none', color: '#ff6b6b', cursor: 'pointer', display: 'flex', padding: '4px' }}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Body Area */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <ChatStream />
        
        {/* Resize Handle */}
        <div
          onMouseDown={handleResizeMouseDown}
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: '16px',
            height: '16px',
            cursor: 'nwse-resize',
            zIndex: 10,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
            padding: '3px'
          }}
        >
          <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor" style={{ opacity: 0.3, color: 'var(--color-text)' }}>
            <path d="M 5,8 L 8,5 L 8,8 Z M 1,8 L 8,1 L 8,3 L 3,8 Z" />
          </svg>
        </div>
      </div>
    </div>
  );
};
