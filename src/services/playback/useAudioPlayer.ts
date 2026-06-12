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
  const setNowPlaying = usePlayerStore((state) => state.setNowPlaying);

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

  }, []); // Initialization runs once

  // Master playback controller for live streams
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying && currentStation) {
      // If we are supposed to be playing, ensure the correct stream is loaded
      if (audio.src !== currentStation.streamUrl) {
        audio.src = currentStation.streamUrl;
        audio.load();
        setNowPlaying(null); // Clear now playing on station change
      }
      
      if (audio.paused) {
        audio.play().catch(err => {
          if (err.name !== 'AbortError') {
            console.error("Play error:", err);
            pause();
            usePlayerStore.getState().setLoading(false);
          }
        });
      }
    } else {
      // If we are supposed to be paused/stopped
      if (!audio.paused) {
        audio.pause();
      }
      
      // Crucial for Live Radio: Unload the stream to prevent background buffering.
      // This saves bandwidth and guarantees the "live edge" when resuming.
      if (audio.hasAttribute('src')) {
        audio.removeAttribute('src');
        audio.load();
      }
    }
  }, [isPlaying, currentStation, pause, setNowPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      console.log('Setting audio element volume to:', volume);
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Polling for Now Playing metadata
  useEffect(() => {
    if (!isPlaying || !currentStation) {
      return;
    }

    let isMounted = true;

    const fetchMetadata = async () => {
      try {
        const response = await fetch(`/api/metadata?url=${encodeURIComponent(currentStation.streamUrl)}`);
        if (response.ok && isMounted) {
          const data = await response.json();
          if (data.title) {
             setNowPlaying(data.title);
          } else {
             setNowPlaying(null);
          }
        }
      } catch (err) {
        console.error("Failed to fetch metadata proxy:", err);
      }
    };

    // Fetch immediately on play
    fetchMetadata();

    // Then poll every 10 seconds
    const intervalId = setInterval(fetchMetadata, 10000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [isPlaying, currentStation]);

  return null;
};
