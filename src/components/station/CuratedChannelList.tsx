import { useEffect, useState } from 'react';
import { CHANNELS } from '../../domain/constants/channels';
import { usePlayerStore } from '../../stores/playerStore';
import { getChannelIcon } from '../station/ChannelList';
import { ChevronDown, ChevronRight } from '../icons';
import { StationItem } from './StationItem';

export const CuratedChannelList = () => {
  const currentStation = usePlayerStore((state) => state.currentStation);
  const currentChannel = usePlayerStore((state) => state.currentChannel);
  
  // Collapsible accordion state for channels (only one expanded at a time)
  const [expandedChannelId, setExpandedChannelId] = useState<string | null>(null);

  // Auto-expand playing station/channel folder
  useEffect(() => {
    if (currentChannel) {
      setExpandedChannelId(currentChannel.id);
    } else if (currentStation) {
      const ownerChannel = CHANNELS.find(c => c.stations.some(s => s.id === currentStation.id));
      if (ownerChannel) {
        setExpandedChannelId(ownerChannel.id);
      }
    }
  }, [currentStation, currentChannel]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1, overflowY: 'auto', paddingBottom: '2rem' }}>
      {CHANNELS.map(channel => {
        const isExpanded = expandedChannelId === channel.id;
        const isChannelPlaying = currentChannel?.id === channel.id;

        return (
          <div
            key={channel.id}
            style={{
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.02)',
              border: isChannelPlaying ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(255,255,255,0.03)',
              overflow: 'hidden',
              transition: 'border-color 0.2s',
              flexShrink: 0
            }}
          >
            <button
              onClick={() => {
                setExpandedChannelId(prevId => prevId === channel.id ? null : channel.id);
              }}
              type="button"
              style={{
                width: '100%',
                padding: '10px 12px',
                minHeight: '44px',
                background: 'transparent',
                border: 'none',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: 'var(--color-text)',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: isChannelPlaying ? 'var(--color-text)' : 'rgba(255,255,255,0.05)',
                  color: isChannelPlaying ? 'var(--color-bg)' : 'var(--color-text)',
                  flexShrink: 0
                }}>
                  {getChannelIcon(channel.icon, 16)}
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {channel.name}
                    {isChannelPlaying && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-text)' }} />}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {channel.description}
                  </div>
                </div>
              </div>
              <div style={{ color: 'var(--color-text-muted)', marginLeft: '8px', flexShrink: 0 }}>
                {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </div>
            </button>

            <div
              style={{
                display: 'grid',
                gridTemplateRows: isExpanded ? '1fr' : '0fr',
                transition: 'grid-template-rows 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                background: 'rgba(0,0,0,0.15)',
                borderTop: isExpanded ? '1px solid rgba(255, 255, 255, 0.04)' : '1px solid transparent',
                overflow: 'hidden'
              }}
            >
              <div style={{ minHeight: 0 }}>
                <div style={{
                  padding: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}>
                  {channel.stations.map(station => (
                    <StationItem key={station.id} station={station} isCurated={true} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
