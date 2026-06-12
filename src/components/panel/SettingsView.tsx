import { Volume2, Sliders } from '../icons';
import { useUIStore } from '../../stores/uiStore';
import { useIsMobile } from '../../hooks/useIsMobile';

export const SettingsView = () => {
  const interactionSoundsEnabled = useUIStore(state => state.interactionSoundsEnabled);
  const toggleInteractionSounds = useUIStore(state => state.toggleInteractionSounds);
  const playerPosition = useUIStore(state => state.playerPosition);
  const setPlayerPosition = useUIStore(state => state.setPlayerPosition);
  const { isMobile } = useIsMobile();

  return (
    <div className="flex-col" style={{ gap: '1.25rem', flex: 1, overflowY: 'auto' }}>


      {/* General Settings */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flexShrink: 0 }}>
        <h4 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Volume2 size={14} /> General
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.03)', cursor: 'pointer' }} onClick={toggleInteractionSounds}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text)' }}>UI Sounds</span>
              <span style={{ fontSize: '0.65rem', color: 'var(--color-text-dim)' }}>Tap/click feedback sounds</span>
            </div>

            {/* Simple toggle switch */}
            <div style={{
              width: '32px',
              height: '18px',
              borderRadius: '9px',
              background: interactionSoundsEnabled ? 'var(--color-text)' : 'rgba(255,255,255,0.2)',
              position: 'relative',
              transition: 'background 0.2s',
            }}>
              <div style={{
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                background: interactionSoundsEnabled ? 'var(--color-bg)' : '#fff',
                position: 'absolute',
                top: '2px',
                left: interactionSoundsEnabled ? '16px' : '2px',
                transition: 'left 0.2s',
              }} />
            </div>
          </div>
        </div>
      </div>

      {/* Desktop-Only Settings */}
      {!isMobile && (
        <>
          {/* Layout Preferences */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flexShrink: 0 }}>
            <h4 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sliders size={14} /> Layout Preferences
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.03)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text)' }}>Player Position</span>
                <select
                  value={playerPosition}
                  onChange={(e) => setPlayerPosition(e.target.value as 'top' | 'bottom')}
                  style={{
                    background: 'rgba(20, 24, 28, 0.9)',
                    color: 'var(--color-text)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    padding: '4px 8px',
                    fontSize: '0.8rem',
                    outline: 'none'
                  }}
                >
                  <option value="bottom">Bottom</option>
                  <option value="top">Top</option>
                </select>
              </div>
            </div>
          </div>

          {/* Keyboard Shortcuts */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flexShrink: 0 }}>
            <h4 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sliders size={14} /> Hotkeys
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.75rem', padding: '4px' }}>
              {[
                { key: 'Space', desc: 'Play / Pause stream' },
                { key: 'Right / Left Arrow', desc: 'Next / Previous station' },
                { key: 'M', desc: 'Mute / Unmute audio' },
              ].map((hk, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)' }}>
                  <span>{hk.desc}</span>
                  <kbd style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '2px 6px', borderRadius: '4px', fontFamily: 'monospace', color: 'var(--color-text)' }}>{hk.key}</kbd>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
