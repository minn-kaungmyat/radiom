import React from 'react';
import { Badge } from '../ui/Badge';
import { usePomodoroStore } from '../../stores/pomodoroStore';
import { Play, Pause, Reload, Clock, Calendar } from '../icons';

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

export const FocusView = () => {
  const { timeLeft, isRunning, mode, start, pause, reset, setMode, setCustomDuration, history } = usePomodoroStore();
  const [isEditingTime, setIsEditingTime] = React.useState(false);
  const [editMinutes, setEditMinutes] = React.useState('');

  const totalMinutes = history.reduce((acc, curr) => acc + curr.durationMinutes, 0);
  const todaySessions = history.filter(h => h.timestamp > Date.now() - 24 * 60 * 60 * 1000).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', flex: 1, overflowY: 'auto' }}>

      {/* Top: Timer Setup & Display */}
      <div className="flex-col" style={{ alignItems: 'center', gap: '1.5rem', marginTop: '1rem' }}>
        
        {/* Presets */}
        <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '6px', borderRadius: '100px' }}>
            <Badge
              interactive={true}
              isActive={mode === 'focus'}
              onClick={() => setMode('focus')}
              style={{ padding: '6px 16px', borderRadius: '100px', fontSize: '0.8rem' }}
            >
              Focus
            </Badge>
            <Badge
              interactive={true}
              isActive={mode === 'shortBreak'}
              onClick={() => setMode('shortBreak')}
              style={{ padding: '6px 16px', borderRadius: '100px', fontSize: '0.8rem' }}
            >
              Short Break
            </Badge>
            <Badge
              interactive={true}
              isActive={mode === 'longBreak'}
              onClick={() => setMode('longBreak')}
              style={{ padding: '6px 16px', borderRadius: '100px', fontSize: '0.8rem' }}
            >
              Long Break
            </Badge>
        </div>

        {/* Circular Timer Visual with Pixel Font */}
        <div
          className="flex-col"
          style={{
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            border: `6px solid ${isRunning ? 'var(--color-text)' : 'rgba(255, 255, 255, 0.05)'}`,
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: isRunning ? '0 0 30px rgba(255,255,255,0.1)' : 'inset 0 0 20px rgba(0,0,0,0.2)',
            background: 'rgba(0,0,0,0.2)',
            transition: 'all 0.3s ease'
          }}
        >
          {isEditingTime ? (
            <input
              type="number"
              autoFocus
              className="no-spin-button"
              value={editMinutes}
              onChange={(e) => setEditMinutes(e.target.value)}
              onBlur={() => {
                setIsEditingTime(false);
                const val = parseInt(editMinutes, 10);
                if (!isNaN(val) && val > 0) setCustomDuration(val);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') e.currentTarget.blur();
              }}
              style={{
                fontSize: '4.5rem',
                fontFamily: 'var(--font-pixel)',
                lineHeight: 1,
                color: 'var(--color-text)',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                width: '100%',
                textAlign: 'center',
                padding: 0,
                margin: 0
              }}
            />
          ) : (
            <span 
              style={{
                fontSize: '4.5rem',
                fontFamily: 'var(--font-pixel)',
                lineHeight: 1,
                color: isRunning ? 'var(--color-text)' : 'var(--color-text-muted)',
                textShadow: isRunning ? '0 0 10px rgba(255,255,255,0.5)' : 'none',
                cursor: !isRunning ? 'pointer' : 'default'
              }}
              onClick={() => {
                if (!isRunning) {
                  setEditMinutes(Math.ceil(timeLeft / 60).toString());
                  setIsEditingTime(true);
                }
              }}
              title={!isRunning ? "Click to set custom time" : ""}
            >
              {formatTime(timeLeft)}
            </span>
          )}
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '2px', marginTop: '4px' }}>
            {mode === 'focus' ? 'Focus Session' : mode === 'shortBreak' ? 'Short Break' : 'Long Break'}
          </span>
        </div>

        {/* Timer Controls */}
        <div style={{ display: 'flex', gap: '1rem', width: '100%', justifyContent: 'center' }}>
          <button
            className="btn btn-primary"
            onClick={isRunning ? pause : start}
            style={{ width: '140px', borderRadius: '100px' }}
          >
            {isRunning ? <><Pause size={16} /> Pause</> : <><Play size={16} /> Start</>}
          </button>
          <button
            className="btn btn-secondary icon-button hover-pixel-pop"
            onClick={reset}
            style={{ width: '44px', height: '44px', padding: 0 }}
            title="Reset"
          >
            <Reload size={18} />
          </button>
        </div>
      </div>

      <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '0.5rem 0' }} />

      {/* Bottom: Stats & History */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text)' }}>Your Progress</h4>

        {/* Stats Cards */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <div style={{
            flex: 1, padding: '14px', borderRadius: '16px', background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.03)', display: 'flex', flexDirection: 'column', gap: '6px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
              <Clock size={14} /> Total Focus
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700 }}>{totalMinutes}m</div>
          </div>
          <div style={{
            flex: 1, padding: '14px', borderRadius: '16px', background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.03)', display: 'flex', flexDirection: 'column', gap: '6px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
              <Calendar size={14} /> Today
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700 }}>{todaySessions}</div>
          </div>
        </div>

        {/* Recent Activity */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <h4 style={{ margin: 0, fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>Recent History</h4>
          {history.length === 0 && (
            <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', padding: '1rem 0' }}>
              No sessions completed yet.
            </div>
          )}
          {history.slice(0, 5).map((session) => (
            <div
              key={session.id}
              style={{
                padding: '12px 14px',
                borderRadius: '14px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255, 255, 255, 0.03)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 500, textTransform: 'capitalize' }}>{session.mode.replace(/([A-Z])/g, ' $1').trim()}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                  {new Date(session.timestamp).toLocaleDateString()}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{session.durationMinutes}m</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
