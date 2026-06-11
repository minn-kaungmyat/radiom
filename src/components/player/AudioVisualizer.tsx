import { useEffect, useRef } from 'react';
import { usePlayerStore } from '../../stores/playerStore';

export const AudioVisualizer = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const analyser = usePlayerStore(state => state.analyser);
  const isPlaying = usePlayerStore(state => state.isPlaying);
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyser ? analyser.frequencyBinCount : 0;
    const dataArray = new Uint8Array(bufferLength || 32); // Fallback to 32

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);

      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      if (analyser && isPlaying) {
        // For security reasons, if the stream is CORS-blocked, getByteFrequencyData will just return all 0s.
        // It won't throw an error, so the visualizer will just gracefully stay flat.
        analyser.getByteFrequencyData(dataArray);
      } else {
        // Smoothly decay the bars to 0 when paused
        for (let i = 0; i < dataArray.length; i++) {
          dataArray[i] = Math.max(0, dataArray[i] - 10);
        }
      }

      // Pixel art style bars
      const barWidth = 2;
      const gap = 1;
      const totalBars = Math.floor(width / (barWidth + gap));
      
      // Skip the lowest bass frequency (index 0) which is often overpowering, and step through frequencies
      const step = Math.max(1, Math.floor((dataArray.length - 1) / totalBars));

      for (let i = 0; i < totalBars; i++) {
        const dataIndex = 1 + i * step; 
        const value = dataArray[dataIndex] || 0;
        
        // Normalize 0-255 to canvas height
        const barHeight = Math.max(2, (value / 255) * height);
        
        // Pixelate height (snap to 2px increments)
        const pixelatedHeight = Math.ceil(barHeight / 2) * 2;

        const x = i * (barWidth + gap);
        const y = height - pixelatedHeight;

        // Give it a subtle glowing white/gray look to match the glassmorphism
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fillRect(x, y, barWidth, pixelatedHeight);
      }
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [analyser, isPlaying]);

  return (
    <canvas 
      ref={canvasRef} 
      width={18} 
      height={12} 
      style={{ 
        width: '18px', 
        height: '12px', 
        imageRendering: 'pixelated',
        flexShrink: 0
      }} 
    />
  );
};
