import { Play, Pause, SkipForward, SkipBack, Loader } from '../icons';

interface PlayerControlsProps {
  isPlaying: boolean;
  isLoading: boolean;
  isFetchingMore: boolean;
  hasStation: boolean;
  canSkip: boolean;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  size?: 'compact' | 'full';
}

export const PlayerControls: React.FC<PlayerControlsProps> = ({
  isPlaying,
  isLoading,
  isFetchingMore,
  hasStation,
  canSkip,
  onPlay,
  onPause,
  onNext,
  onPrevious,
  size = 'full',
}) => {
  const isCompact = size === 'compact';
  const playButtonSize = isCompact ? 36 : 44;
  const iconSize = isCompact ? 16 : 20;
  const skipIconSize = isCompact ? 16 : 20;
  const gap = isCompact ? '0.25rem' : '0.5rem';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap }}>
      {/* Previous — hidden in compact mode */}
      {!isCompact && (
        <button
          onClick={onPrevious}
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
          disabled={isFetchingMore || !canSkip}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-text)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}
        >
          <SkipBack size={skipIconSize} />
        </button>
      )}

      {/* Play / Pause */}
      <button
        onClick={isPlaying ? onPause : onPlay}
        style={{
          background: 'var(--color-text)',
          color: 'var(--color-bg)',
          border: 'none',
          borderRadius: '50%',
          width: `${playButtonSize}px`,
          height: `${playButtonSize}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'transform 0.1s',
          flexShrink: 0,
        }}
        disabled={isLoading || isFetchingMore || !hasStation}
        onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
        onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        {(isLoading || isFetchingMore) ? (
          <Loader size={iconSize} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
        ) : isPlaying ? (
          <Pause size={iconSize} />
        ) : (
          <Play size={iconSize} style={{ marginLeft: '2px' }} />
        )}
      </button>

      {/* Next */}
      <button
        onClick={onNext}
        title="Next Station"
        style={{
          background: 'transparent',
          color: 'var(--color-text-muted)',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          padding: isCompact ? '6px' : '8px',
          transition: 'color 0.2s'
        }}
        disabled={isFetchingMore || !canSkip}
        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-text)'}
        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}
      >
        <SkipForward size={skipIconSize} />
      </button>
    </div>
  );
};
