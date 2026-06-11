
import { usePomodoroStore } from '../../stores/pomodoroStore';
import { Play } from '../icons';

export const SessionCompleteModal = () => {
  const { isSessionCompleteModalOpen, closeSessionCompleteModal, mode, setMode, start } = usePomodoroStore();

  if (!isSessionCompleteModalOpen) return null;

  const isFocus = mode === 'focus';
  
  return (
    <div 
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'fadeIn 0.3s ease'
      }}
    >
      <div 
        className="glass-panel"
        style={{
          padding: '3rem',
          borderRadius: '24px',
          textAlign: 'center',
          maxWidth: '400px',
          width: '90%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem',
          animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <h2 style={{ margin: 0, fontSize: '2rem', color: 'var(--color-text)' }}>
          {isFocus ? 'Focus Complete!' : 'Break Over'}
        </h2>
        
        <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '1.1rem', lineHeight: 1.5 }}>
          {isFocus 
            ? "Great job! You've earned a break. Step away and recharge." 
            : "Hope you feel refreshed! Ready to dive back in?"}
        </p>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', width: '100%' }}>
          {isFocus ? (
            <>
              <button 
                className="btn btn-secondary hover-pixel-pop"
                style={{ flex: 1, minHeight: 'var(--touch-target)' }}
                onClick={() => {
                  setMode('shortBreak');
                  start();
                  closeSessionCompleteModal();
                }}
              >
                Short Break
              </button>
              <button 
                className="btn btn-secondary hover-pixel-pop"
                style={{ flex: 1, minHeight: 'var(--touch-target)' }}
                onClick={() => {
                  setMode('longBreak');
                  start();
                  closeSessionCompleteModal();
                }}
              >
                Long Break
              </button>
            </>
          ) : (
            <button 
              className="btn btn-primary hover-pixel-pop"
              style={{ flex: 1, padding: '14px', minHeight: 'var(--touch-target)' }}
              onClick={() => {
                setMode('focus');
                start();
                closeSessionCompleteModal();
              }}
            >
              <Play size={18} style={{ marginRight: '8px' }} />
              Start Focus
            </button>
          )}
        </div>

        <button 
          onClick={closeSessionCompleteModal}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--color-text-muted)',
            cursor: 'pointer',
            marginTop: '0.5rem',
            textDecoration: 'underline',
            fontSize: '0.9rem',
            minHeight: 'var(--touch-target)',
            padding: '8px'
          }}
        >
          Dismiss
        </button>

      </div>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
