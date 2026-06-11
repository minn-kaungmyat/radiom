import { useState } from 'react';
import { Radio, Heart, Clock as Timer, Settings, Sparkles, Sliders, Edit2, MessageSquare, MoreHorizontal } from '../icons';
import { useUIStore } from '../../stores/uiStore';
import type { PanelType } from '../../stores/uiStore';
import { IconButton } from '../ui/IconButton';
import { GlassPanel } from '../ui/GlassPanel';
import { useNotesStore } from '../../stores/notesStore';
import { useChatStore } from '../../stores/chatStore';
import { useIsMobile } from '../../hooks/useIsMobile';

interface DockItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  mobileLabel?: string; // shorter label for mobile tab bar
}

// ===== Mobile "More" Overlay Tray =====
const MobileMoreTray = ({
  items,
  onItemClick,
  onClose,
}: {
  items: DockItem[];
  onItemClick: (id: string) => void;
  onClose: () => void;
}) => {
  return (
    <div className="mobile-more-overlay" onClick={onClose}>
      <div
        className="glass-panel mobile-more-tray"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mobile-more-handle" />
        {items.map((item) => (
          <button
            key={item.id}
            className="mobile-more-item"
            onClick={() => {
              onItemClick(item.id);
              onClose();
            }}
          >
            <div className="icon-wrapper">{item.icon}</div>
            {item.label}
          </button>
        ))}
        <button
          className="mobile-more-item"
          onClick={onClose}
          style={{ justifyContent: 'center', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

// ===== Main LeftDock Component =====
export const LeftDock = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const { isMobile } = useIsMobile();

  const activePanel = useUIStore((state) => state.activePanel);
  const togglePanel = useUIStore((state) => state.togglePanel);
  const isIdle = useUIStore((state) => state.isIdle);
  const isMobileMoreOpen = useUIStore((state) => state.isMobileMoreOpen);
  const setMobileMoreOpen = useUIStore((state) => state.setMobileMoreOpen);

  const activeId = activePanel;
  const isHidden = isIdle && activePanel === null;
  const toggleNotes = useNotesStore((state) => state.toggleOpen);
  const isNotesOpen = useNotesStore((state) => state.isOpen);
  
  const isChatOpen = useChatStore((state) => state.isWindowOpen);
  const setChatWindowOpen = useChatStore((state) => state.setWindowOpen);
  const onlineCount = useChatStore((state) => state.onlineCount);

  const allItems: DockItem[] = [
    { id: 'stations', icon: <Radio size={20} />, label: 'Browse Stations', mobileLabel: 'Radio' },
    { id: 'favorites', icon: <Heart size={20} />, label: 'Favorites', mobileLabel: 'Favs' },
    { id: 'focus', icon: <Timer size={20} />, label: 'Pomodoro Focus', mobileLabel: 'Focus' },
    { id: 'chat', icon: <MessageSquare size={20} />, label: `Study Lounge (${onlineCount})`, mobileLabel: 'Chat' },
    { id: 'ambient', icon: <Sliders size={20} />, label: 'Ambient Mixer', mobileLabel: 'Ambient' },
    { id: 'environments', icon: <Sparkles size={20} />, label: 'Environments', mobileLabel: 'Themes' },
    { id: 'notes', icon: <Edit2 size={20} />, label: 'Scratchpad', mobileLabel: 'Notes' },
    { id: 'settings', icon: <Settings size={20} />, label: 'Settings', mobileLabel: 'Settings' },
  ];

  // Mobile: first 4 items in tab bar, rest in "More" overflow
  const mobilePrimaryItems = allItems.slice(0, 4);
  const mobileOverflowItems = allItems.slice(4);

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

  const getIsActive = (id: string) => {
    return activeId === id || (id === 'notes' && isNotesOpen) || (id === 'chat' && isChatOpen);
  };

  // ===== MOBILE LAYOUT: Bottom Tab Bar =====
  if (isMobile) {
    const isMoreActive = mobileOverflowItems.some((item) => getIsActive(item.id));

    return (
      <>
        <GlassPanel
          id="left-dock"
          className="mobile-dock"
          style={{
            transform: isHidden ? 'translateY(100%)' : 'translateY(0)',
            opacity: isHidden ? 0 : 1,
            transition: 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
            pointerEvents: isHidden ? 'none' : 'auto',
          }}
        >
          {mobilePrimaryItems.map((item) => {
            const isActive = getIsActive(item.id);
            return (
              <div key={item.id} className="mobile-dock-item">
                <IconButton
                  icon={item.icon}
                  variant="ghost"
                  isActive={isActive}
                  size={40}
                  popOnHover={false}
                  onClick={() => handleItemClick(item.id)}
                />
                <span className={`mobile-dock-label ${isActive ? 'active' : ''}`}>
                  {item.mobileLabel}
                </span>
              </div>
            );
          })}

          {/* "More" button */}
          <div className="mobile-dock-item">
            <IconButton
              icon={<MoreHorizontal size={20} />}
              variant="ghost"
              isActive={isMoreActive || isMobileMoreOpen}
              size={40}
              popOnHover={false}
              onClick={() => setMobileMoreOpen(!isMobileMoreOpen)}
            />
            <span className={`mobile-dock-label ${isMoreActive ? 'active' : ''}`}>
              More
            </span>
          </div>
        </GlassPanel>

        {/* "More" Overflow Tray */}
        {isMobileMoreOpen && (
          <MobileMoreTray
            items={mobileOverflowItems}
            onItemClick={handleItemClick}
            onClose={() => setMobileMoreOpen(false)}
          />
        )}
      </>
    );
  }

  // ===== DESKTOP LAYOUT: Vertical Sidebar (unchanged) =====
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
      {allItems.map((item) => {
        const isHovered = hoveredId === item.id;
        const isActive = getIsActive(item.id);

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
