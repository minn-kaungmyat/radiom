import { usePlayerStore } from '../../stores/playerStore';
import { useStationStore } from '../../stores/stationStore';
import { useUIStore } from '../../stores/uiStore';
import { Play, Pause, Volume2, VolumeX, Loader, AlertCircle, SkipForward, SkipBack } from '../icons';
import { useChannelStations } from '../../services/radio/useChannelStations';
import { useEffect, useState, useRef } from 'react';
import { getChannelIcon } from '../station/ChannelList';
import { IconButton } from '../ui/IconButton';
import { CHANNELS } from '../../domain/constants/channels';
import { cleanAndPrioritizeTags } from '../../utils/tagUtils';
import { AudioVisualizer } from './AudioVisualizer';

export const FloatingPlayer = () => {
  const currentChannel = usePlayerStore(state => state.currentChannel);
  const setChannel = usePlayerStore(state => state.setChannel);
  const currentStation = usePlayerStore(state => state.currentStation);
  const setStation = usePlayerStore(state => state.setStation);

  const isPlaying = usePlayerStore(state => state.isPlaying);
  const volume = usePlayerStore(state => state.volume);
  const isLoading = usePlayerStore(state => state.isLoading);
  const error = usePlayerStore(state => state.error);
  const play = usePlayerStore(state => state.play);
  const pause = usePlayerStore(state => state.pause);
  const setVolume = usePlayerStore(state => state.setVolume);

  const isIdle = useUIStore((state) => state.isIdle);
  const activePanel = useUIStore((state) => state.activePanel);
  const playerPosition = useUIStore((state) => state.playerPosition);
  const isCollapsed = isIdle && activePanel === null;

  const [isChannelListOpen, setIsChannelListOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [hoveredChannelId, setHoveredChannelId] = useState<string | null>(null);
  const playerRef = useRef<HTMLDivElement>(null);

  const titleRef = useRef<HTMLSpanElement>(null);
  const subtitleRef = useRef<HTMLSpanElement>(null);
  const [shouldAnimateTitle, setShouldAnimateTitle] = useState(false);
  const [shouldAnimateSubtitle, setShouldAnimateSubtitle] = useState(false);



  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (playerRef.current && !playerRef.current.contains(event.target as Node)) {
        setIsChannelListOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch stations for the selected channel
  const { stations, fetchMore, isFetchingMore } = useChannelStations(currentChannel);

  const prevChannelRef = useRef(currentChannel?.id);

  // Auto-select the first station when a new channel is clicked
  useEffect(() => {
    if (stations && stations.length > 0 && currentChannel) {
      if (prevChannelRef.current !== currentChannel.id) {
        prevChannelRef.current = currentChannel.id;
        setStation(stations[0]);
      } else if (!currentStation) {
        setStation(stations[0]);
      }
    }
  }, [stations, currentChannel, currentStation, setStation]);

  // Reset logo error when station changes
  useEffect(() => {
    setLogoError(false);
  }, [currentStation]);

  const handleSkip = async () => {
    if (!stations || stations.length === 0 || !currentStation) return;

    let currentList = stations;
    const currentIndex = stations.findIndex(s => s.id === currentStation.id);

    // If we are at the end of the current list, fetch more from API
    if (currentIndex === currentList.length - 1) {
      currentList = await fetchMore();
    }

    const nextIndex = (currentIndex + 1) % currentList.length;
    setStation(currentList[nextIndex]);
  };

  const handlePrevious = () => {
    if (!stations || stations.length === 0 || !currentStation) return;
    const currentIndex = stations.findIndex(s => s.id === currentStation.id);
    const prevIndex = currentIndex === 0 ? stations.length - 1 : currentIndex - 1;
    setStation(stations[prevIndex]);
  };

  // Auto-skip to next station if a stream fails
  useEffect(() => {
    // Need to exclude isFetchingMore to avoid triggering auto-skip while fetching
    if (error && stations && stations.length > 1 && currentStation) {
      console.log(`Stream error for ${currentStation.name}. Auto-skipping...`);
      const timer = setTimeout(() => {
        handleSkip();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [error, stations, currentStation]); // Add dependencies needed but handleSkip uses latest via ref or we just re-run
  const [preMuteVolume, setPreMuteVolume] = useState(0.5);

  const toggleMute = () => {
    if (volume > 0) {
      setPreMuteVolume(volume);
      setVolume(0);
    } else {
      setVolume(preMuteVolume || 0.5);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore shortcuts if user is typing in a text field
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          activeEl.getAttribute('contenteditable') === 'true')
      ) {
        return;
      }

      switch (event.code) {
        case 'Space':
          event.preventDefault();
          if (isPlaying) {
            pause();
          } else {
            play();
          }
          break;
        case 'ArrowRight':
          event.preventDefault();
          handleSkip();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          handlePrevious();
          break;
        case 'KeyM':
          event.preventDefault();
          toggleMute();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPlaying, volume, preMuteVolume, stations, currentStation]);

  useEffect(() => {
    let active = true;

    const checkOverflow = () => {
      if (!active) return;

      // Check title
      if (titleRef.current) {
        const el = titleRef.current;
        const parent = el.parentElement;
        if (parent) {
          const singleWidth = el.firstElementChild
            ? (el.firstElementChild as HTMLElement).scrollWidth
            : el.scrollWidth;
          const parentWidth = parent.clientWidth;

          if (singleWidth > parentWidth) {
            const speed = 25; // constant speed in pixels per second
            const duration = (singleWidth + 48) / speed; // 3rem spacer = 48px
            el.style.setProperty('--marquee-duration', `${duration}s`);
            setShouldAnimateTitle(true);
          } else {
            setShouldAnimateTitle(false);
          }
        }
      }

      // Check subtitle
      if (subtitleRef.current) {
        const el = subtitleRef.current;
        const parent = el.parentElement;
        if (parent) {
          const singleWidth = el.firstElementChild
            ? (el.firstElementChild as HTMLElement).scrollWidth
            : el.scrollWidth;
          const parentWidth = parent.clientWidth;

          if (singleWidth > parentWidth) {
            const speed = 25; // constant speed in pixels per second
            const duration = (singleWidth + 48) / speed;
            el.style.setProperty('--marquee-duration', `${duration}s`);
            setShouldAnimateSubtitle(true);
          } else {
            setShouldAnimateSubtitle(false);
          }
        }
      }
    };

    // Run check immediately after render
    checkOverflow();

    // Schedule subsequent checks to guarantee layout computation is complete
    const timer = setTimeout(checkOverflow, 50);
    const timer2 = setTimeout(checkOverflow, 300);

    window.addEventListener('resize', checkOverflow);

    return () => {
      active = false;
      clearTimeout(timer);
      clearTimeout(timer2);
      window.removeEventListener('resize', checkOverflow);
    };
  }, [currentStation, currentChannel, isChannelListOpen, isFetchingMore, error, isPlaying, isLoading, isCollapsed]);

  const selectedGenre = useStationStore(state => state.selectedGenre);

  const subtitleText = currentChannel
    ? currentChannel.name
    : (cleanAndPrioritizeTags(currentStation?.tags, 3, selectedGenre).join(' • ') || 'Live Radio');

  if (!currentChannel && !currentStation) {
    return null; // Don't show player until a channel or station is selected
  }

  return (
    <div ref={playerRef} style={{
      position: 'absolute',
      bottom: playerPosition === 'bottom' ? '2.5rem' : 'auto',
      top: playerPosition === 'top' ? '2.5rem' : 'auto',
      left: '50%',
      transform: 'translateX(-50%)',
      width: isCollapsed ? '260px' : '540px',
      maxWidth: 'calc(100vw - 2rem)',
      zIndex: 20,
      transition: 'width 0.6s cubic-bezier(0.22, 1, 0.36, 1)'
    }}>
      {/* Channel Popover */}
      {isChannelListOpen && !isCollapsed && (
        <div
          className="glass-panel"
          style={{
            position: 'absolute',
            bottom: playerPosition === 'bottom' ? 'calc(100% + 1rem)' : 'auto',
            top: playerPosition === 'top' ? 'calc(100% + 1rem)' : 'auto',
            left: '0',
            borderRadius: '100px',
            padding: '0.5rem 1rem',
            display: 'flex',
            gap: '0.5rem',
            animation: playerPosition === 'top'
              ? 'fadeInDown 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
              : 'fadeInUp 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            zIndex: 30
          }}
        >
          {CHANNELS.map(channel => {
            const isSelected = currentChannel?.id === channel.id;
            const isHovered = hoveredChannelId === channel.id;
            return (
              <div key={channel.id} style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
                <IconButton
                  icon={getChannelIcon(channel.icon, 20)}
                  size={40}
                  variant="solid"
                  isActive={isSelected}
                  onClick={(e) => {
                    e.stopPropagation();
                    setChannel(channel);
                    setIsChannelListOpen(false);
                    setHoveredChannelId(null);
                  }}
                  onMouseEnter={() => setHoveredChannelId(channel.id)}
                  onMouseLeave={() => setHoveredChannelId(null)}
                />

                {/* Tooltip */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: playerPosition === 'bottom' ? 'calc(100% + 0.75rem)' : 'auto',
                    top: playerPosition === 'top' ? 'calc(100% + 0.75rem)' : 'auto',
                    background: 'rgba(20, 24, 28, 0.85)',
                    backdropFilter: 'blur(12px)',
                    color: 'var(--color-text)',
                    padding: '0.75rem 1rem',
                    borderRadius: '12px',
                    pointerEvents: 'none',
                    opacity: isHovered ? 1 : 0,
                    transform: isHovered
                      ? 'translateY(0) scale(1)'
                      : (playerPosition === 'top' ? 'translateY(-8px) scale(0.95)' : 'translateY(8px) scale(0.95)'),
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5)',
                    zIndex: 50,
                    width: '200px',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                >
                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{channel.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', lineHeight: 1.3 }}>
                    {channel.description}
                  </div>
                  <div style={{
                    position: 'absolute',
                    top: playerPosition === 'bottom' ? '100%' : 'auto',
                    bottom: playerPosition === 'top' ? '100%' : 'auto',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 0,
                    height: 0,
                    borderLeft: '6px solid transparent',
                    borderRight: '6px solid transparent',
                    borderTop: playerPosition === 'bottom' ? '6px solid rgba(20, 24, 28, 0.95)' : 'none',
                    borderBottom: playerPosition === 'top' ? '6px solid rgba(20, 24, 28, 0.95)' : 'none',
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Main Player Bar */}
      <div id="floating-player" className="glass-panel" style={{
        padding: '0.75rem 1.25rem',
        borderRadius: '50px',
        display: 'flex',
        alignItems: 'center',
        gap: isCollapsed ? '0.5rem' : '1.5rem',
        width: '100%',
        justifyContent: 'space-between',
        transition: 'all 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
      }}>

        {/* Left Area: Channel & Station Info */}
        <div
          className="cursor-pointer"
          onClick={() => setIsChannelListOpen(!isChannelListOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            flex: 1,
            minWidth: 0,
            cursor: 'pointer',
            padding: '0.5rem',
            margin: '-0.5rem',
            borderRadius: '16px',
            transition: 'background 0.2s',
            background: isChannelListOpen ? 'rgba(255,255,255,0.05)' : 'transparent'
          }}
          onMouseEnter={(e) => { if (!isChannelListOpen && !isCollapsed) e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
          onMouseLeave={(e) => { if (!isChannelListOpen) e.currentTarget.style.background = 'transparent' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', color: 'var(--color-text)', overflow: 'hidden', flexShrink: 0 }}>
            {currentStation?.faviconUrl && !logoError ? (
              <img
                src={currentStation.faviconUrl}
                alt=""
                style={{ width: '28px', height: '28px', borderRadius: '6px', objectFit: 'cover', imageRendering: 'pixelated' }}
                onError={() => setLogoError(true)}
              />
            ) : (
              getChannelIcon(currentChannel?.icon || 'Music', 24)
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0, overflow: 'hidden' }}>
            <h3
              className={shouldAnimateTitle ? 'marquee-container-mask' : ''}
              style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-text)', overflow: 'hidden', display: 'block', position: 'relative' }}
            >
              <span
                ref={titleRef}
                className={shouldAnimateTitle ? 'marquee-text' : ''}
                style={{
                  display: shouldAnimateTitle ? 'inline-flex' : 'inline-block',
                  whiteSpace: 'nowrap',
                  willChange: 'transform'
                }}
              >
                {shouldAnimateTitle ? (
                  <>
                    <span>{currentStation ? currentStation.name : (currentChannel ? currentChannel.name : 'Select a station')}</span>
                    <span style={{ display: 'inline-block', width: '3rem', flexShrink: 0 }} />
                    <span>{currentStation ? currentStation.name : (currentChannel ? currentChannel.name : 'Select a station')}</span>
                    <span style={{ display: 'inline-block', width: '3rem', flexShrink: 0 }} />
                  </>
                ) : (
                  currentStation ? currentStation.name : (currentChannel ? currentChannel.name : 'Select a station')
                )}
              </span>
            </h3>

            <div style={{ display: 'flex', alignItems: 'center', height: '20px', width: '100%', overflow: 'hidden' }}>
              {isFetchingMore ? (
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
                  Discovering more stations...
                </span>
              ) : error ? (
                <span style={{ fontSize: '0.85rem', color: '#ff6b6b', display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
                  <AlertCircle size={14} /> {error}
                </span>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '100%', overflow: 'hidden' }}>
                  {(!isLoading && !error && currentStation) && <AudioVisualizer />}
                  <div
                    className={shouldAnimateSubtitle ? 'marquee-container-mask' : ''}
                    style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}
                  >
                    <span
                      ref={subtitleRef}
                      className={shouldAnimateSubtitle ? 'marquee-text' : ''}
                      style={{
                        display: shouldAnimateSubtitle ? 'inline-flex' : 'inline-block',
                        whiteSpace: 'nowrap',
                        fontSize: '0.85rem',
                        color: 'var(--color-text-muted)',
                        willChange: 'transform'
                      }}
                    >
                      {shouldAnimateSubtitle ? (
                        <>
                          <span>{subtitleText}</span>
                          <span style={{ display: 'inline-block', width: '3rem', flexShrink: 0 }} />
                          <span>{subtitleText}</span>
                          <span style={{ display: 'inline-block', width: '3rem', flexShrink: 0 }} />
                        </>
                      ) : (
                        subtitleText
                      )}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Area: Controls */}
        <div style={{
          width: isCollapsed ? 0 : '280px',
          opacity: isCollapsed ? 0 : 1,
          pointerEvents: isCollapsed ? 'none' : 'auto',
          overflow: 'hidden',
          transition: 'all 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
          display: 'flex',
          justifyContent: 'flex-end',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', width: '280px', flexShrink: 0 }}>

            {/* Playback Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                onClick={handlePrevious}
                title="Previous Station"
                style={{
                  background: 'transparent',
                  color: 'var(--color-text-muted)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  padding: '8px',
                  transition: 'color 0.2s'
                }}
                disabled={isFetchingMore || !stations || stations.length <= 1}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-text)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}
              >
                <SkipBack size={20} />
              </button>

              <button
                onClick={isPlaying ? pause : play}
                style={{
                  background: 'var(--color-text)',
                  color: 'var(--color-bg)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '44px',
                  height: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'transform 0.1s'
                }}
                disabled={isLoading || isFetchingMore || !currentStation}
                onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                {(isLoading || isFetchingMore) ? <Loader size={20} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} /> : isPlaying ? <Pause size={20} /> : <Play size={20} style={{ marginLeft: '2px' }} />}
              </button>

              <button
                onClick={handleSkip}
                title="Next Station"
                style={{
                  background: 'transparent',
                  color: 'var(--color-text-muted)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  padding: '8px',
                  transition: 'color 0.2s'
                }}
                disabled={isFetchingMore || !stations || stations.length <= 1}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-text)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}
              >
                <SkipForward size={20} />
              </button>
            </div>

            {/* Volume Control */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,0,0,0.2)', padding: '6px 12px', borderRadius: '100px' }}>
              <button
                onClick={toggleMute}
                title={volume > 0 ? "Mute" : "Unmute"}
                style={{
                  background: 'transparent',
                  border: 'none',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  color: 'var(--color-text-muted)',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-text)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}
              >
                {volume > 0 ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setVolume(val);
                }}
                className="pixel-slider"
                style={{ width: '60px', '--value': `${volume * 100}%` } as React.CSSProperties}
              />
            </div>
          </div>
        </div>
        <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-10px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes marquee-loop {
          0%, 20% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        @keyframes mask-loop {
          0%, 20% {
            -webkit-mask-image: linear-gradient(to right, black 0%, black calc(100% - 16px), transparent 100%);
            mask-image: linear-gradient(to right, black 0%, black calc(100% - 16px), transparent 100%);
          }
          25%, 95% {
            -webkit-mask-image: linear-gradient(to right, transparent 0%, black 16px, black calc(100% - 16px), transparent 100%);
            mask-image: linear-gradient(to right, transparent 0%, black 16px, black calc(100% - 16px), transparent 100%);
          }
          100% {
            -webkit-mask-image: linear-gradient(to right, black 0%, black calc(100% - 16px), transparent 100%);
            mask-image: linear-gradient(to right, black 0%, black calc(100% - 16px), transparent 100%);
          }
        }
        .marquee-text {
          animation: marquee-loop var(--marquee-duration, 12s) linear infinite;
        }
        .marquee-container-mask {
          animation: mask-loop var(--marquee-duration, 12s) linear infinite;
        }
      `}</style>
      </div>
    </div>
  );
};
