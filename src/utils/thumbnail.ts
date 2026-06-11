export const generateThumbnail = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (file.type.startsWith('image/')) {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 160;
        canvas.height = 90; // 16:9 aspect ratio
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Calculate aspect ratio preserving dimensions
          const ratio = Math.max(canvas.width / img.width, canvas.height / img.height);
          const x = (canvas.width - img.width * ratio) / 2;
          const y = (canvas.height - img.height * ratio) / 2;
          ctx.drawImage(img, 0, 0, img.width, img.height, x, y, img.width * ratio, img.height * ratio);
          resolve(canvas.toDataURL('image/jpeg', 0.7));
        } else {
          reject(new Error('Failed to get canvas context'));
        }
        URL.revokeObjectURL(img.src);
      };
      img.onerror = () => {
        reject(new Error('Failed to load image'));
        URL.revokeObjectURL(img.src);
      };
      img.src = URL.createObjectURL(file);
    } else if (file.type.startsWith('video/')) {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.muted = true;
      video.playsInline = true;
      video.src = URL.createObjectURL(file);

      video.onloadeddata = () => {
        // Seek to 1 second or the middle of the video
        video.currentTime = Math.min(1, video.duration / 2);
      };

      video.onseeked = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 160;
        canvas.height = 90; // 16:9 aspect ratio
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', 0.7)); // compress to save space
        } else {
          reject(new Error('Failed to get canvas context'));
        }
        URL.revokeObjectURL(video.src);
      };

      video.onerror = () => {
        reject(new Error('Failed to load video'));
        URL.revokeObjectURL(video.src);
      };
    } else {
      reject(new Error('Unsupported file type'));
    }
  });
};
