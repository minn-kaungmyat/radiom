import { useState } from 'react';
import { Heart, Trash, Play, Music, Clock } from '../icons';
import { useFavoritesStore } from '../../stores/favoritesStore';
import { useHistoryStore } from '../../stores/historyStore';
import { usePlayerStore } from '../../stores/playerStore';
import { cleanAndPrioritizeTags } from '../../utils/tagUtils';
import { Card } from '../ui/Card';

export const FavoritesView = () => {
  const [activeTab, setActiveTab] = useState<'favorites' | 'recents'>('favorites');
  const favorites = useFavoritesStore((state) => state.favorites);
  const removeFavorite = useFavoritesStore((state) => state.removeFavorite);
  const history = useHistoryStore((state) => state.history);
  const setStation = usePlayerStore((state) => state.setStation);
  const setChannel = usePlayerStore((state) => state.setChannel);
  const currentStation = usePlayerStore((state) => state.currentStation);
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const play = usePlayerStore((state) => state.play);
  const pause = usePlayerStore((state) => state.pause);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, marginTop: "-0.7rem" }}>
      {/* Sub Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', marginBottom: '1rem', paddingBottom: '2px' }}>
        <button
          onClick={() => setActiveTab('favorites')}
          type="button"
          style={{
            flex: 1,
            padding: '8px 0',
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'favorites' ? '2px solid var(--color-text)' : '2px solid transparent',
            color: activeTab === 'favorites' ? 'var(--color-text)' : 'var(--color-text-muted)',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}
        >
          <Heart size={14} /> Favorites
        </button>
        <button
          onClick={() => setActiveTab('recents')}
          type="button"
          style={{
            flex: 1,
            padding: '8px 0',
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'recents' ? '2px solid var(--color-text)' : '2px solid transparent',
            color: activeTab === 'recents' ? 'var(--color-text)' : 'var(--color-text-muted)',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}
        >
          <Clock size={14} /> Recents
        </button>
      </div>

      {activeTab === 'favorites' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, minHeight: 0 }}>
          {favorites.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '5rem 1rem', gap: '0.75rem', color: 'var(--color-text-muted)' }}>
              <Heart size={36} strokeWidth={1.5} style={{ color: 'var(--color-text-muted)', opacity: 0.5 }} />
              <p style={{ margin: 0, fontSize: '0.85rem' }}>No favorite stations yet</p>
              <p style={{ margin: 0, fontSize: '0.72rem', opacity: 0.7, textAlign: 'center', maxWidth: '200px' }}>
                Click the heart icon on any station while browsing to save it here.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', overflowY: 'auto', flex: 1 }}>
              {favorites.map((fav) => {
                const isPlayingStation = currentStation?.id === fav.id;
                return (
                  <Card
                    key={fav.id}
                    isActive={isPlayingStation}
                    onClick={() => {
                      setChannel(null);
                      setStation(fav);
                    }}
                    image={
                      fav.faviconUrl ? (
                        <img 
                          src={fav.faviconUrl} 
                          alt="" 
                          style={{ width: '20px', height: '20px', borderRadius: '4px', objectFit: 'cover', imageRendering: 'pixelated' }}
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      ) : (
                        <Music size={14} color="var(--color-text-muted)" />
                      )
                    }
                    title={fav.name}
                    subtitle={cleanAndPrioritizeTags(fav.tags, 3).join(' • ') || 'Live Stream'}
                    actionButton={
                      <div className="flex-center" style={{ gap: '6px', marginLeft: '8px' }}>
                        <button
                          onClick={() => removeFavorite(fav.id)}
                          title="Remove from favorites"
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--color-text-muted)',
                            cursor: 'pointer',
                            padding: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.color = '#ff4b4b'}
                          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}
                        >
                          <Trash size={14} />
                        </button>
                        <button
                          onClick={() => {
                            setChannel(null);
                            setStation(fav);
                            if (isPlayingStation) {
                              if (isPlaying) pause(); else play();
                            }
                          }}
                          style={{
                            background: isPlayingStation ? 'var(--color-text)' : 'rgba(255,255,255,0.06)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '26px',
                            height: '26px',
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
                              <span style={{ width: '2px', height: '8px', background: 'currentColor', borderRadius: '1px' }} />
                              <span style={{ width: '2px', height: '8px', background: 'currentColor', borderRadius: '1px' }} />
                            </div>
                          ) : (
                            <Play size={10} fill="currentColor" style={{ marginLeft: isPlayingStation ? '0' : '1px' }} />
                          )}
                        </button>
                      </div>
                    }
                  />
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, minHeight: 0 }}>
          {history.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '5rem 1rem', gap: '0.75rem', color: 'var(--color-text-muted)' }}>
              <Clock size={36} strokeWidth={1.5} style={{ color: 'var(--color-text-muted)', opacity: 0.5 }} />
              <p style={{ margin: 0, fontSize: '0.85rem' }}>No recent stations</p>
              <p style={{ margin: 0, fontSize: '0.72rem', opacity: 0.7, textAlign: 'center', maxWidth: '200px' }}>
                Listen to some stations and they will appear here.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', overflowY: 'auto', flex: 1 }}>
              {history.map((station, index) => {
                const isPlayingStation = currentStation?.id === station.id;
                return (
                  <Card
                    key={`${station.id}-${index}`}
                    isActive={isPlayingStation}
                    onClick={() => {
                      setChannel(null);
                      setStation(station);
                    }}
                    image={
                      station.faviconUrl ? (
                        <img 
                          src={station.faviconUrl} 
                          alt="" 
                          style={{ width: '20px', height: '20px', borderRadius: '4px', objectFit: 'cover', imageRendering: 'pixelated' }}
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      ) : (
                        <Music size={14} color="var(--color-text-muted)" />
                      )
                    }
                    title={station.name}
                    subtitle={cleanAndPrioritizeTags(station.tags, 3).join(' • ') || 'Live Stream'}
                    actionButton={
                      <div className="flex-center" style={{ gap: '6px', marginLeft: '8px' }}>
                        <button
                          onClick={() => {
                            setChannel(null);
                            setStation(station);
                            if (isPlayingStation) {
                              if (isPlaying) pause(); else play();
                            }
                          }}
                          style={{
                            background: isPlayingStation ? 'var(--color-text)' : 'rgba(255,255,255,0.06)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '26px',
                            height: '26px',
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
                              <span style={{ width: '2px', height: '8px', background: 'currentColor', borderRadius: '1px' }} />
                              <span style={{ width: '2px', height: '8px', background: 'currentColor', borderRadius: '1px' }} />
                            </div>
                          ) : (
                            <Play size={10} fill="currentColor" style={{ marginLeft: isPlayingStation ? '0' : '1px' }} />
                          )}
                        </button>
                      </div>
                    }
                  />
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
