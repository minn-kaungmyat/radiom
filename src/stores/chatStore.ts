import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { uniqueNamesGenerator, adjectives, animals } from 'unique-names-generator';
import Pusher from 'pusher-js';

export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: number;
  isStationShare?: boolean;
  stationId?: string;
  stationTitle?: string;
  station?: any;
  isSystem?: boolean;
}

interface ChatState {
  username: string;
  messages: ChatMessage[];
  onlineCount: number;
  
  // UI State
  isWindowOpen: boolean;
  windowPosition: { x: number; y: number };
  windowSize: { width: number; height: number };

  // Actions
  setUsername: (name: string) => void;
  addMessage: (msg: ChatMessage) => void;
  sendMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => Promise<void>;
  setWindowOpen: (open: boolean) => void;
  setWindowPosition: (pos: { x: number; y: number }) => void;
  setWindowSize: (size: { width: number; height: number }) => void;
  
  // Realtime Backend
  _initPusher: () => void;
}

// Generate a random name on first load
const generateName = () => uniqueNamesGenerator({
  dictionaries: [adjectives, animals],
  separator: ' ',
  style: 'capital'
});

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      username: generateName(),
      messages: [
        {
          id: 'welcome-msg',
          sender: 'System',
          text: 'Welcome to the Lazy Day Lounge. Say hi!',
          timestamp: Date.now(),
          isSystem: true
        }
      ],
      onlineCount: 1, // Start at 1 (yourself)

      isWindowOpen: false,
      windowPosition: { x: window.innerWidth - 380, y: 100 },
      windowSize: { width: 340, height: 500 },

      setUsername: (name) => set({ username: name }),
      
      addMessage: (msg) => set((state) => ({
        messages: [...state.messages, msg].slice(-150) // Keep last 150 to prevent DOM lag and storage bloat
      })),

      sendMessage: async (msg) => {
        try {
          await fetch('/api/message', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message: msg.text,
              username: msg.sender,
              stationTitle: msg.stationTitle,
              station: msg.station
            })
          });
        } catch (error) {
          console.error("Failed to send message", error);
        }
      },

      setWindowOpen: (open) => set({ isWindowOpen: open }),
      setWindowPosition: (pos) => set({ windowPosition: pos }),
      setWindowSize: (size) => set({ windowSize: size }),

      _initPusher: () => {
        // Clean up messages older than 3 hours on load to maintain the live vibe
        const threeHoursAgo = Date.now() - 3 * 60 * 60 * 1000;
        set((state) => ({
          messages: state.messages.filter(m => m.timestamp > threeHoursAgo)
        }));

        // Prevent multiple instances
        if ((window as any)._pusherInstance) return;
        
        const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
          cluster: import.meta.env.VITE_PUSHER_CLUSTER,
          channelAuthorization: {
            endpoint: '/api/pusher/auth',
            transport: 'ajax'
          }
        });
        (window as any)._pusherInstance = pusher;

        const channel = pusher.subscribe('presence-study-lounge');
        
        // Handle presence online count
        channel.bind('pusher:subscription_succeeded', (members: any) => {
          set({ onlineCount: members.count });
        });

        channel.bind('pusher:member_added', () => {
          set((state) => ({ onlineCount: state.onlineCount + 1 }));
        });

        channel.bind('pusher:member_removed', () => {
          set((state) => ({ onlineCount: Math.max(1, state.onlineCount - 1) }));
        });
        
        channel.bind('new-message', (data: any) => {
          get().addMessage({
            id: data.id,
            sender: data.sender,
            text: data.text,
            timestamp: data.timestamp,
            stationTitle: data.stationTitle,
            station: data.station,
            isStationShare: !!data.stationTitle,
            isSystem: false
          });
        });
      }
    }),
    {
      name: 'lazyday-chat-storage',
      partialize: (state) => ({ 
        username: state.username,
        isWindowOpen: state.isWindowOpen,
        windowPosition: state.windowPosition,
        windowSize: state.windowSize,
        messages: state.messages // Persist local history to survive page refreshes
      }),
    }
  )
);
