import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { usePlayerStore } from './playerStore';

export type PomodoroMode = 'focus' | 'shortBreak' | 'longBreak';

export interface PomodoroSession {
  id: string;
  timestamp: number;
  durationMinutes: number;
  mode: PomodoroMode;
  completed: boolean;
}

interface PomodoroState {
  timeLeft: number; // in seconds
  targetEndTime: number | null; // accurate timestamp for when the timer should end
  isRunning: boolean;
  mode: PomodoroMode;
  duration: number; // original duration in seconds
  isSessionCompleteModalOpen: boolean;
  history: PomodoroSession[];
  
  start: () => void;
  pause: () => void;
  reset: () => void;
  tick: () => void;
  setMode: (mode: PomodoroMode) => void;
  setCustomDuration: (minutes: number) => void;
  completeSession: () => void;
  closeSessionCompleteModal: () => void;
}

export const usePomodoroStore = create<PomodoroState>()(
  persist(
    (set, get) => ({
      timeLeft: 25 * 60,
      targetEndTime: null,
      isRunning: false,
      mode: 'focus',
      duration: 25 * 60,
      isSessionCompleteModalOpen: false,
      history: [],

      start: () => set((state) => ({ 
        isRunning: true,
        targetEndTime: Date.now() + state.timeLeft * 1000
      })),
      
      pause: () => set({ 
        isRunning: false,
        targetEndTime: null
      }),
      
      reset: () => set((state) => ({ 
        timeLeft: state.duration, 
        isRunning: false,
        targetEndTime: null
      })),
      
      setMode: (mode) => set(() => {
        const durationMinutes = mode === 'focus' ? 25 : mode === 'shortBreak' ? 5 : 15;
        return {
          mode,
          duration: durationMinutes * 60,
          timeLeft: durationMinutes * 60,
          isRunning: false,
          targetEndTime: null
        };
      }),

      setCustomDuration: (minutes) => set({
        duration: minutes * 60,
        timeLeft: minutes * 60,
        isRunning: false,
        targetEndTime: null
      }),

      tick: () => {
        const { isRunning, targetEndTime, completeSession } = get();
        if (!isRunning || !targetEndTime) return;

        const remaining = Math.ceil((targetEndTime - Date.now()) / 1000);

        if (remaining > 0) {
          set({ timeLeft: remaining });
        } else {
          completeSession();
        }
      },

      completeSession: () => {
        const { mode, duration, history } = get();
        
        const newSession: PomodoroSession = {
          id: Date.now().toString(),
          timestamp: Date.now(),
          durationMinutes: duration / 60,
          mode,
          completed: true
        };

        // 1. Pause the Radio (The sudden silence is a great indicator!)
        usePlayerStore.getState().pause();

        // 2. Play a lush, relaxing Lofi-style chord (Fmaj7) instead of a harsh beep
        try {
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          if (AudioContextClass) {
            const ctx = new AudioContextClass();
            // Fmaj7 chord: F4, A4, C5, E5
            const frequencies = [349.23, 440.00, 523.25, 659.25];
            
            frequencies.forEach((freq, i) => {
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              
              // Use a mix of sine and triangle for a warmer electric piano tone
              osc.type = i % 2 === 0 ? 'sine' : 'triangle';
              osc.frequency.value = freq;
              
              // Stagger the notes slightly like a piano roll/harp
              const startTime = ctx.currentTime + (i * 0.08);
              
              gain.gain.setValueAtTime(0, startTime);
              gain.gain.linearRampToValueAtTime(0.15, startTime + 0.1);
              gain.gain.exponentialRampToValueAtTime(0.001, startTime + 4);
              
              osc.connect(gain);
              gain.connect(ctx.destination);
              
              osc.start(startTime);
              osc.stop(startTime + 4);
            });
          }
        } catch (e) {
          console.log('Could not play ding sound');
        }

        set({
          history: [newSession, ...history],
          isRunning: false,
          targetEndTime: null,
          timeLeft: duration, // reset for next time
          isSessionCompleteModalOpen: true // 3. Open the visual modal
        });
      },

      closeSessionCompleteModal: () => set({ isSessionCompleteModalOpen: false })
    }),
    {
      name: 'radiom-pomodoro',
      partialize: (state) => ({
        history: state.history,
        timeLeft: state.timeLeft,
        targetEndTime: state.targetEndTime,
        isRunning: state.isRunning,
        mode: state.mode,
        duration: state.duration
      }), // persist all relevant state
    }
  )
);
