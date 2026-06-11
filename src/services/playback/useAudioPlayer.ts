import { useEffect, useRef } from 'react';
import { usePlayerStore } from '../../stores/playerStore';
import { useHistoryStore } from '../../stores/historyStore';

export const useAudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextInitialized = useRef(false);
  
  const currentStation = usePlayerStore((state) => state.currentStation);
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const volume = usePlayerStore((state) => state.volume);
  const play = usePlayerStore((state) => state.play);
  const pause = usePlayerStore((state) => state.pause);
  const setLoading = usePlayerStore((state) => state.setLoading);
  const setError = usePlayerStore((state) => state.setError);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.crossOrigin = 'anonymous';
      
      audioRef.current.addEventListener('waiting', () => setLoading(true));
      audioRef.current.addEventListener('playing', () => {
        setLoading(false);
        play();
        if (audioRef.current) {
          audioRef.current.volume = usePlayerStore.getState().volume;
          
          const playingStation = usePlayerStore.getState().currentStation;
          if (playingStation) {
            useHistoryStore.getState().addStation(playingStation);
          }

          // Initialize Web Audio API on first play
          if (!audioContextInitialized.current) {
            try {
              const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
              const audioCtx = new AudioContextClass();
              const analyser = audioCtx.createAnalyser();
              analyser.fftSize = 64; // Small size for pixel art (32 bins)
              analyser.smoothingTimeConstant = 0.85;

              const source = audioCtx.createMediaElementSource(audioRef.current);
              source.connect(analyser);
              analyser.connect(audioCtx.destination);
              
              usePlayerStore.getState().setAnalyser(analyser);
              audioContextInitialized.current = true;
            } catch (e) {
              console.warn("Could not initialize Web Audio API (likely CORS restriction or unsupported)", e);
            }
          }
        }
      });
      audioRef.current.addEventListener('pause', () => pause());
      audioRef.current.addEventListener('error', (e) => {
        setError('Stream error occurred');
        console.error('Audio playback error', e);
      });
      
      // Set initial volume
      audioRef.current.volume = usePlayerStore.getState().volume;
    }

    const audio = audioRef.current;

    if (currentStation) {
      if (audio.src !== currentStation.streamUrl) {
        audio.src = currentStation.streamUrl;
        audio.load();
        
        if (isPlaying) {
          audio.play().catch(err => {
            if (err.name !== 'AbortError') {
              console.error("Autoplay prevented:", err);
              pause();
              usePlayerStore.getState().setLoading(false);
            }
          });
        }
      }
    }
  }, [currentStation]); // Re-run mostly when station changes

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying && audioRef.current.paused && currentStation) {
        audioRef.current.play().catch(err => {
          if (err.name !== 'AbortError') {
            console.error("Play error:", err);
            pause();
            usePlayerStore.getState().setLoading(false);
          }
        });
      } else if (!isPlaying && !audioRef.current.paused) {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentStation, pause]);

  useEffect(() => {
    if (audioRef.current) {
      console.log('Setting audio element volume to:', volume);
      audioRef.current.volume = volume;
    }
  }, [volume]);

  return null;
};
