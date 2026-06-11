import React, { useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useNotesStore } from '../../stores/notesStore';
import { useUIStore } from '../../stores/uiStore';
import { X, Minus, Edit2, Check } from '../icons';

const PixelMaximize = ({ size = 14 }: { size?: number }) => (
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

export const DraggableNotepad = () => {
  const { 
    isOpen, isMinimized, position, size, content, isEditing,
    setOpen, setMinimized, setPosition, setSize, setContent, setIsEditing 
  } = useNotesStore();
  
  const isIdle = useUIStore(state => state.isIdle);
  
  const notepadRef = useRef<HTMLDivElement>(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const hasDragged = useRef(false);
  const resizeStart = useRef({ w: 0, h: 0, x: 0, y: 0 });

  // Handle Dragging
  const handleDragMouseDown = (e: React.MouseEvent) => {
    if (e.target instanceof HTMLElement && e.target.closest('button')) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    if (notepadRef.current) {
      const rect = notepadRef.current.getBoundingClientRect();
      dragOffset.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
    
    hasDragged.current = false;
    document.body.classList.add('is-dragging');

    const handleMouseMove = (e: MouseEvent) => {
      hasDragged.current = true;
      let newX = e.clientX - dragOffset.current.x;
      let newY = e.clientY - dragOffset.current.y;

      newX = Math.max(0, Math.min(newX, window.innerWidth - (isMinimized ? 150 : size.width)));
      newY = Math.max(0, Math.min(newY, window.innerHeight - (isMinimized ? 40 : size.height)));

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
      
      newW = Math.max(200, Math.min(newW, window.innerWidth - position.x));
      newH = Math.max(200, Math.min(newH, window.innerHeight - position.y));

      setSize({ width: newW, height: newH });
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  if (!isOpen) return null;

  return (
    <div
      ref={notepadRef}
      className="glass-panel"
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: isMinimized ? 'auto' : `${size.width}px`,
        height: isMinimized ? 'auto' : `${size.height}px`,
        zIndex: 30,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: isMinimized ? '100px' : '16px',
        opacity: isIdle ? 0.4 : 1,
        transition: 'opacity 0.5s, border-radius 0.3s',
      }}
    >
      {/* Header */}
      <div
        onMouseDown={handleDragMouseDown}
        style={{
          padding: isMinimized ? '0.5rem 1rem' : '0.75rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'grab',
          borderBottom: isMinimized ? 'none' : '1px solid rgba(255, 255, 255, 0.05)',
          gap: '1rem',
          userSelect: 'none'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }} onClick={(e) => { if (isMinimized && !hasDragged.current) setMinimized(false); }}>
          <Edit2 size={16} /> 
          <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-text)', fontFamily: 'var(--font-pixel)', whiteSpace: 'nowrap' }}>
            Scratchpad
          </span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          {isMinimized ? (
            <button 
              onClick={() => setMinimized(false)}
              className="hover-pixel-pop"
              style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', display: 'flex', padding: '4px' }}
            >
              <PixelMaximize size={12} />
            </button>
          ) : (
            <>
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="hover-pixel-pop"
                style={{ background: 'transparent', border: 'none', color: isEditing ? 'var(--color-accent)' : 'var(--color-text-muted)', cursor: 'pointer', display: 'flex', padding: '4px' }}
                title={isEditing ? "View" : "Edit"}
              >
                {isEditing ? <Check size={16} /> : <Edit2 size={16} />}
              </button>
              <button 
                onClick={() => setMinimized(true)}
                className="hover-pixel-pop"
                style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', display: 'flex', padding: '4px' }}
              >
                <Minus size={16} />
              </button>
              <button 
                onClick={() => setOpen(false)}
                className="hover-pixel-pop"
                style={{ background: 'transparent', border: 'none', color: '#ff6b6b', cursor: 'pointer', display: 'flex', padding: '4px' }}
              >
                <X size={16} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Body Area */}
      {!isMinimized && (
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {isEditing ? (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onDoubleClick={() => setIsEditing(false)}
              style={{
                flex: 1,
                width: '100%',
                background: 'transparent',
                border: 'none',
                color: 'var(--color-text)',
                padding: '1rem',
                fontSize: '0.85rem',
                resize: 'none',
                outline: 'none',
                lineHeight: 1.5,
              }}
              autoFocus
              placeholder="Type your notes here... (Supports Markdown like *italic*, **bold**, - [ ] list)"
            />
          ) : (
            <div 
              onDoubleClick={() => setIsEditing(true)}
              className="markdown-content"
              style={{
                flex: 1,
                padding: '1rem',
                overflowY: 'auto',
                fontSize: '0.85rem',
                lineHeight: 1.5,
                color: 'var(--color-text)',
                cursor: 'text'
              }}
            >
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  input: ({node, ...props}) => {
                    if (props.type === 'checkbox') {
                      return <input type="checkbox" checked={props.checked} readOnly style={{ accentColor: 'var(--color-accent)' }} />;
                    }
                    return <input {...props} />;
                  }
                }}
              >
                {content || '*Empty scratchpad. Double click to edit.*'}
              </ReactMarkdown>
            </div>
          )}

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
      )}
    </div>
  );
};
