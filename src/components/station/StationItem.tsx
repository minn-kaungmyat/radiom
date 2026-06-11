import React from 'react';
import { Heart, HeartFilled, Play, Music } from '../icons';
import { usePlayerStore } from '../../stores/playerStore';
import { useFavoritesStore } from '../../stores/favoritesStore';
import { CHANNELS } from '../../domain/constants/channels';
import { cleanAndPrioritizeTags } from '../../utils/tagUtils';
import { Card } from '../ui/Card';

interface StationItemProps {
  station: any;
  isCurated: boolean;
  selectedGenre?: string;
}

export const StationItem: React.FC<StationItemProps> = ({ station, isCurated, selectedGenre }) => {
  const currentStation = usePlayerStore((state) => state.currentStation);
  const setStation = usePlayerStore((state) => state.setStation);
  const setChannel = usePlayerStore((state) => state.setChannel);
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const play = usePlayerStore((state) => state.play);
  const pause = usePlayerStore((state) => state.pause);

  const addFavorite = useFavoritesStore((state) => state.addFavorite);
  const removeFavorite = useFavoritesStore((state) => state.removeFavorite);
  const favorites = useFavoritesStore((state) => state.favorites);

  const isPlayingStation = currentStation?.id === station.id;
  const isFav = favorites.some((f) => f.id === station.id);

  const handlePlayClick = () => {
    if (isCurated) {
      const ownerChannel = CHANNELS.find(c => c.stations.some(s => s.id === station.id));
      if (ownerChannel) {
        setChannel(ownerChannel);
      } else {
        setChannel(null);
      }
    } else {
      setChannel(null);
    }
    setStation(station);

    if (isPlayingStation) {
      if (isPlaying) pause(); else play();
    }
  };

  return (
    <Card
      isActive={isPlayingStation}
      isCompact={isCurated}
      onClick={handlePlayClick}
      image={
        station.faviconUrl ? (
          <img
            src={station.faviconUrl}
            alt=""
            style={{ width: isCurated ? '16px' : '20px', height: isCurated ? '16px' : '20px', borderRadius: '4px', objectFit: 'cover', imageRendering: 'pixelated' }}
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        ) : (
          <Music size={isCurated ? 12 : 14} color="var(--color-text-muted)" />
        )
      }
      title={station.name}
      subtitle={
        !isCurated ? (cleanAndPrioritizeTags(station.tags, 3, selectedGenre).join(' • ') || 'Live Stream') : undefined
      }
      actionButton={
        <div className="flex-center" style={{ gap: '4px', marginLeft: '6px' }}>
          <button
            onClick={(e) => { e.stopPropagation(); isFav ? removeFavorite(station.id) : addFavorite(station); }}
            style={{
              background: 'transparent',
              border: 'none',
              color: isFav ? '#ff4b4b' : 'var(--color-text-muted)',
              cursor: 'pointer',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'color 0.2s',
              minHeight: 'var(--touch-target)' // Good touch target for mobile
            }}
            onMouseEnter={(e) => { if (!isFav) e.currentTarget.style.color = 'var(--color-text)'; }}
            onMouseLeave={(e) => { if (!isFav) e.currentTarget.style.color = 'var(--color-text-muted)'; }}
          >
            {isFav ? <HeartFilled size={isCurated ? 12 : 14} color="#ff4b4b" /> : <Heart size={isCurated ? 12 : 14} color="var(--color-text-muted)" />}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handlePlayClick(); }}
            style={{
              background: isPlayingStation ? 'var(--color-text)' : 'rgba(255,255,255,0.06)',
              border: 'none',
              borderRadius: '50%',
              width: isCurated ? '28px' : '32px', // Slightly larger for touch
              height: isCurated ? '28px' : '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isPlayingStation ? 'var(--color-bg)' : 'var(--color-text)',
              cursor: 'pointer',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            {isPlayingStation && isPlaying ? (
              <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
                <span style={{ width: '2px', height: isCurated ? '6px' : '8px', background: 'currentColor', borderRadius: '1px' }} />
                <span style={{ width: '2px', height: isCurated ? '6px' : '8px', background: 'currentColor', borderRadius: '1px' }} />
              </div>
            ) : (
              <Play size={isCurated ? 10 : 12} fill="currentColor" style={{ marginLeft: isPlayingStation ? '0' : '1px' }} />
            )}
          </button>
        </div>
      }
    />
  );
};
