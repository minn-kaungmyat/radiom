import React, { useEffect, useRef, useState } from 'react';
import { useAmbientStore } from '../../stores/ambientStore';

const TrackAudio = ({ track, userInteracted }: { track: { id: string, url: string, volume: number, isActive: boolean }, userInteracted: boolean }) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  // Handle Play/Pause
  useEffect(() => {
    if (audioRef.current) {
      if (track.isActive) {
        audioRef.current.play().catch(e => console.log('Audio autoplay prevented:', e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [track.isActive, userInteracted]);

  // Handle Volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = track.volume;
    }
  }, [track.volume]);

  return (
    <audio 
      ref={audioRef}
      src={track.url}
      loop
      preload="auto"
      style={{ display: 'none' }}
    />
  );
};

export const AmbientPlayer = () => {
  const tracks = useAmbientStore(state => state.tracks);
  const [userInteracted, setUserInteracted] = useState(false);

  useEffect(() => {
    const handleInteraction = () => {
      setUserInteracted(true);
      window.removeEventListener('pointerdown', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
    window.addEventListener('pointerdown', handleInteraction);
    window.addEventListener('keydown', handleInteraction);
    
    return () => {
      window.removeEventListener('pointerdown', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
  }, []);

  return (
    <>
      {tracks.map(track => (
        <TrackAudio key={track.id} track={track} userInteracted={userInteracted} />
      ))}
    </>
  );
};
