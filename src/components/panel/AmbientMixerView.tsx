import React from 'react';
import { useAmbientStore } from '../../stores/ambientStore';
import { Volume2, VolumeX } from '../icons';

export const AmbientMixerView = () => {
  const { tracks, toggleTrack, setVolume, stopAll } = useAmbientStore();
  const activeCount = tracks.filter(t => t.isActive).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, overflowY: 'auto' }}>
      <div className="flex-between" style={{ alignItems: 'center', marginBottom: '0.5rem' }}>
        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
          Layer ambient sounds to find your focus.
        </p>
        {activeCount > 0 && (
          <button 
            onClick={stopAll}
            style={{
              background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', 
              color: 'var(--color-text-muted)', fontSize: '0.75rem', padding: '4px 8px',
              borderRadius: '4px', cursor: 'pointer', transition: 'all 0.2s'
            }}
            onMouseOver={e => e.currentTarget.style.color = 'var(--color-text)'}
            onMouseOut={e => e.currentTarget.style.color = 'var(--color-text-muted)'}
          >
            Stop All
          </button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {tracks.map(track => (
          <div 
            key={track.id}
            style={{
              background: track.isActive ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)',
              border: `1px solid ${track.isActive ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.03)'}`,
              borderRadius: '12px',
              padding: '12px 16px',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              gap: track.isActive ? '1rem' : '0'
            }}
          >
            {/* Header: Clickable to toggle */}
            <div 
              className="flex-between interactive"
              onClick={() => toggleTrack(track.id)}
              style={{ alignItems: 'center' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ 
                  width: '8px', height: '8px', borderRadius: '50%',
                  background: track.isActive ? 'var(--color-text)' : 'transparent',
                  border: `1px solid ${track.isActive ? 'transparent' : 'rgba(255,255,255,0.2)'}`,
                  transition: 'all 0.2s'
                }} />
                <span style={{ 
                  fontWeight: track.isActive ? 600 : 500, 
                  color: track.isActive ? 'var(--color-text)' : 'var(--color-text-muted)',
                  transition: 'all 0.2s'
                }}>
                  {track.name}
                </span>
              </div>
              
              <div style={{ color: track.isActive ? 'var(--color-text)' : 'var(--color-text-muted)' }}>
                {track.isActive ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </div>
            </div>

            {/* Slider: only visible if active */}
            {track.isActive && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingLeft: '18px' }}>
                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-pixel)', color: 'var(--color-text-muted)', width: '3ch' }}>
                  {Math.round(track.volume * 100)}%
                </span>
                <input 
                  type="range" 
                  className="pixel-slider"
                  min="0" max="1" step="0.01"
                  value={track.volume}
                  onChange={(e) => setVolume(track.id, parseFloat(e.target.value))}
                  style={{ '--value': `${track.volume * 100}%` } as React.CSSProperties}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
