import React, { useEffect, useRef, useState } from 'react';
import { useChatStore } from '../../stores/chatStore';
import { usePlayerStore } from '../../stores/playerStore';
import { Play, Share, Edit2, Check } from '../icons';

export const ChatStream = () => {
  const { messages, username, setUsername, sendMessage } = useChatStore();
  const { currentStation, setStation } = usePlayerStore();
  const [inputText, setInputText] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(username);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom safely
  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    
    sendMessage({
      sender: username,
      text: inputText.trim()
    });
    setInputText('');
  };

  const handleShareStation = () => {
    if (!currentStation) return;
    sendMessage({
      sender: username,
      text: inputText.trim() ? inputText.trim() : `Shared a station: ${currentStation.name}`,
      isStationShare: true,
      stationId: currentStation.id,
      stationTitle: currentStation.name,
      station: currentStation
    });
    setInputText('');
  };

  const saveName = () => {
    if (tempName.trim()) {
      setUsername(tempName.trim());
    } else {
      setTempName(username);
    }
    setIsEditingName(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontFamily: 'var(--font-primary)' }}>
      {/* Messages */}
      <div 
        ref={scrollContainerRef}
        style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
      >
        {/* Spacer to push messages down if few */}
        <div style={{ marginTop: 'auto' }} />
        
        {messages.map((msg) => (
          <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
            {msg.isSystem ? (
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textAlign: 'center', margin: '0.5rem 0', fontFamily: 'var(--font-pixel)', opacity: 0.7 }}>
                {msg.text}
              </div>
            ) : (
              <>
                <div style={{ 
                  fontSize: '0.8rem', 
                  fontWeight: 600, 
                  color: msg.sender === username ? 'var(--color-accent)' : 'var(--color-text)', 
                  opacity: msg.sender === username ? 1 : 0.6 
                }}>
                  {msg.sender}
                </div>
                
                {msg.isStationShare ? (
                  <button 
                    onClick={() => { if (msg.station) setStation(msg.station); }}
                    className="hover-pixel-pop"
                    style={{ 
                      background: 'rgba(255, 255, 255, 0.05)', 
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      padding: '0.5rem 0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      color: 'var(--color-text)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      width: 'fit-content',
                      marginTop: '0.2rem'
                    }}
                  >
                    <Play size={14} style={{ color: 'var(--color-text)' }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', marginBottom: '0.1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Listen</div>
                      <div style={{ 
                        fontSize: '0.8rem', 
                        fontWeight: 500,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        lineHeight: 1.2
                      }}>
                        {msg.stationTitle}
                      </div>
                    </div>
                  </button>
                ) : (
                  <div style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.9)', lineHeight: 1.5, wordBreak: 'break-word', marginTop: '0.1rem' }}>
                    {msg.text}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div style={{ padding: '0.75rem 1.25rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)', background: 'rgba(0,0,0,0.1)' }}>
        
        {/* Name Editor */}
        <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
          {isEditingName ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <input 
                value={tempName}
                onChange={e => setTempName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && saveName()}
                onBlur={saveName}
                autoFocus
                style={{
                  background: 'transparent',
                  border: 'none',
                  borderBottom: '1px solid rgba(255,255,255,0.3)',
                  color: 'var(--color-text)',
                  padding: '0',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  outline: 'none',
                  width: '120px'
                }}
              />
              <button 
                onClick={saveName}
                style={{ background: 'transparent', border: 'none', color: 'var(--color-text)', cursor: 'pointer', padding: 0, display: 'flex' }}
              >
                <Check size={12} />
              </button>
            </div>
          ) : (
            <div 
              onClick={() => setIsEditingName(true)}
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', opacity: 0.7 }}
              className="hover-pixel-pop"
              title="Change your name"
            >
              <span style={{ fontWeight: 600 }}>{username}</span>
              <Edit2 size={10} />
            </div>
          )}
        </div>

        <form onSubmit={handleSend} style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={handleShareStation}
            className="hover-pixel-pop"
            title="Share current station"
            disabled={!currentStation}
            style={{ 
              background: 'rgba(255,255,255,0.05)', 
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: 'var(--color-text)',
              cursor: currentStation ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 0.5rem',
              opacity: currentStation ? 1 : 0.3,
              transition: 'all 0.2s'
            }}
          >
            <Share size={14} />
          </button>
          <input 
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder="Type a message..."
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              padding: '0.6rem 0.75rem',
              color: 'var(--color-text)',
              fontSize: '0.9rem',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.3)'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
          />
        </form>
      </div>
    </div>
  );
};
