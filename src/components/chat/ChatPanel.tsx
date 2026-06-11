import { ExternalLink, X } from '../icons';
import { useChatStore } from '../../stores/chatStore';
import { useUIStore } from '../../stores/uiStore';
import { ChatStream } from './ChatStream';

import { useIsMobile } from '../../hooks/useIsMobile';

export const ChatPanel = () => {
  const { setWindowOpen, onlineCount } = useChatStore();
  const setPanel = useUIStore(state => state.setPanel);
  const closePanel = useUIStore(state => state.closePanel);
  const { isMobile } = useIsMobile();

  const handlePopOut = () => {
    setWindowOpen(true);
    setPanel(null); // Close the right panel
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div style={{ 
        padding: '1rem 1.25rem', 
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-text)' }}>
            Study Lounge
          </h2>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 6px rgba(74, 222, 128, 0.4)' }} />
            {onlineCount} Online
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          {!isMobile && (
            <button 
              onClick={handlePopOut}
              className="hover-pixel-pop"
              title="Pop out to window"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: 'var(--color-text-muted)',
                cursor: 'pointer',
                padding: '0.4rem',
                display: 'flex',
                alignItems: 'center',
                minHeight: '44px' // mobile touch target
              }}
            >
              <ExternalLink size={14} />
            </button>
          )}
          <button 
            onClick={closePanel}
            className="hover-pixel-pop"
            title="Close panel"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--color-text-muted)',
              cursor: 'pointer',
              padding: '0.4rem',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <X size={18} />
          </button>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'hidden' }}>
        <ChatStream />
      </div>
    </div>
  );
};
