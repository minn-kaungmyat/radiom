import { CHANNELS } from '../../domain/constants/channels';
import { usePlayerStore } from '../../stores/playerStore';
import { Cloud, Coffee, Moon, Music, BookOpen, Terminal } from '../icons';
import { useState } from 'react';

export const getChannelIcon = (name: string, size = 24, color = "currentColor") => {
  switch (name) {
    case 'CloudRain': return <Cloud size={size} color={color} />;
    case 'Coffee': return <Coffee size={size} color={color} />;
    case 'Moon': return <Moon size={size} color={color} />;
    case 'Music': return <Music size={size} color={color} />;
    case 'BookOpen': return <BookOpen size={size} color={color} />;
    case 'Guitar': return <Music size={size} color={color} />;
    case 'Terminal': return <Terminal size={size} color={color} />;
    default: return <Music size={size} color={color} />;
  }
};

export const ChannelList = () => {
  const currentChannel = usePlayerStore(state => state.currentChannel);
  const setChannel = usePlayerStore(state => state.setChannel);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div
      className="glass-panel"
      style={{
        padding: '1rem 0.5rem',
        borderRadius: '100px',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',

        border: '1px solid rgba(255, 255, 255, 0.05)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
      }}
    >
      {CHANNELS.map(channel => {
        const isSelected = currentChannel?.id === channel.id;
        const isHovered = hoveredId === channel.id;

        return (
          <div key={channel.id} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <button
              onMouseEnter={() => setHoveredId(channel.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => setChannel(channel)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: isSelected ? 'var(--color-text)' : isHovered ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: isSelected ? 'var(--color-bg)' : isHovered ? 'var(--color-text)' : 'var(--color-text-muted)',
                cursor: 'pointer',
                border: 'none',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: isHovered && !isSelected ? 'scale(1.1)' : 'scale(1)',
                boxShadow: isSelected ? '0 0 15px rgba(255, 255, 255, 0.3)' : 'none',
              }}
            >
              {getChannelIcon(channel.icon, 20)}
            </button>

            {/* Tooltip */}
            <div
              style={{
                position: 'absolute',
                left: 'calc(100% + 1rem)',
                background: 'rgba(20, 24, 28, 0.95)',
                color: 'var(--color-text)',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                pointerEvents: 'none',
                opacity: isHovered ? 1 : 0,
                transform: isHovered ? 'translateX(0)' : 'translateX(-10px)',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
                zIndex: 50,
                minWidth: '220px'
              }}
            >
              <div style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '4px' }}>{channel.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', whiteSpace: 'normal', lineHeight: 1.4 }}>
                {channel.description}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
