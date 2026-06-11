import { useState } from 'react';
import { Radio, Heart, Clock as Timer, Settings, Sparkles, Sliders, Edit2, MessageSquare } from '../icons';
import { useUIStore } from '../../stores/uiStore';
import type { PanelType } from '../../stores/uiStore';
import { IconButton } from '../ui/IconButton';
import { GlassPanel } from '../ui/GlassPanel';
import { useNotesStore } from '../../stores/notesStore';
import { useChatStore } from '../../stores/chatStore';

interface DockItem {
  id: string;
  icon: React.ReactNode;
  label: string;
}

export const LeftDock = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const activePanel = useUIStore((state) => state.activePanel);
  const togglePanel = useUIStore((state) => state.togglePanel);
  const isIdle = useUIStore((state) => state.isIdle);

  const activeId = activePanel;
  const isHidden = isIdle && activePanel === null;
  const toggleNotes = useNotesStore((state) => state.toggleOpen);
  const isNotesOpen = useNotesStore((state) => state.isOpen);
  
  const isChatOpen = useChatStore((state) => state.isWindowOpen);
  const setChatWindowOpen = useChatStore((state) => state.setWindowOpen);
  const onlineCount = useChatStore((state) => state.onlineCount);

  const items: DockItem[] = [
    { id: 'stations', icon: <Radio size={20} />, label: 'Browse Stations' },
    { id: 'favorites', icon: <Heart size={20} />, label: 'Favorites' },
    { id: 'focus', icon: <Timer size={20} />, label: 'Pomodoro Focus' },
    { id: 'chat', icon: <MessageSquare size={20} />, label: `Study Lounge (${onlineCount})` },
    { id: 'ambient', icon: <Sliders size={20} />, label: 'Ambient Mixer' },
    { id: 'environments', icon: <Sparkles size={20} />, label: 'Environments' },
    { id: 'notes', icon: <Edit2 size={20} />, label: 'Scratchpad' },
    { id: 'settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  const handleItemClick = (id: string) => {
    if (id === 'notes') {
      toggleNotes();
    } else if (id === 'chat') {
      if (isChatOpen) {
        setChatWindowOpen(false);
      } else {
        togglePanel('chat');
      }
    } else {
      togglePanel(id as Exclude<PanelType, null>);
    }
  };

  return (
    <GlassPanel
      id="left-dock"
      className="flex-col"
      padding="1.25rem 0.75rem"
      borderRadius="30px"
      style={{
        gap: '1rem',

        alignItems: 'center',
        zIndex: 10,
        transform: isHidden ? 'translateX(-150%)' : 'translateX(0)',
        opacity: isHidden ? 0 : 1,
        transition: 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
        pointerEvents: isHidden ? 'none' : 'auto'
      }}
    >
      {items.map((item) => {
        const isHovered = hoveredId === item.id;
        const isActive = activeId === item.id || (item.id === 'notes' && isNotesOpen) || (item.id === 'chat' && isChatOpen);

        return (
          <div
            key={item.id}
            style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
          >
            <IconButton
              icon={item.icon}
              variant="ghost"
              isActive={isActive}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => handleItemClick(item.id)}
            />

            {/* Tooltip */}
            <div
              style={{
                position: 'absolute',
                left: 'calc(100% + 1rem)',
                background: 'rgba(20, 24, 28, 0.85)',
                backdropFilter: 'blur(12px)',
                color: 'var(--color-text)',
                padding: '0.5rem 0.75rem',
                borderRadius: '8px',
                pointerEvents: 'none',
                opacity: isHovered ? 1 : 0,
                transform: isHovered ? 'translateX(0) scale(1)' : 'translateX(-8px) scale(0.95)',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
                zIndex: 50,
                whiteSpace: 'nowrap',
                fontSize: '0.8rem',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {/* Arrow */}
              <div style={{
                position: 'absolute',
                right: '100%',
                top: '50%',
                transform: 'translateY(-50%)',
                width: 0,
                height: 0,
                borderTop: '5px solid transparent',
                borderBottom: '5px solid transparent',
                borderRight: '5px solid rgba(20, 24, 28, 0.95)',
              }} />
              {item.label}
            </div>
          </div>
        );
      })}
    </GlassPanel>
  );
};
