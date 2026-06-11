import { useRef, useState } from 'react';
import { Plus, Trash, Loader } from '../icons';
import { Card } from '../ui/Card';
import { useThemeStore, BACKGROUNDS } from '../../stores/themeStore';
import type { BackgroundTheme } from '../../stores/themeStore';
import { generateThumbnail } from '../../utils/thumbnail';
import { saveCustomBackgroundBlob, deleteCustomBackgroundBlob } from '../../utils/storage';

export const ThemesView = () => {
  const currentBackground = useThemeStore(state => state.currentBackground);
  const customBackgrounds = useThemeStore(state => state.customBackgrounds);
  const setBackground = useThemeStore(state => state.setBackground);
  const addCustomBackground = useThemeStore(state => state.addCustomBackground);
  const removeCustomBackground = useThemeStore(state => state.removeCustomBackground);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (30MB)
    if (file.size > 30 * 1024 * 1024) {
      alert('File is too large. Maximum size is 30MB.');
      return;
    }

    setIsUploading(true);
    try {
      const id = `custom-${Date.now()}`;
      const type = file.type.startsWith('image/') ? 'image' : 'video';
      
      // Generate thumbnail
      const thumbnailPath = await generateThumbnail(file);
      
      // Save original file to IDB
      await saveCustomBackgroundBlob(id, file);

      const newBg: BackgroundTheme = {
        id,
        name: file.name,
        videoPath: URL.createObjectURL(file),
        iconName: 'Sparkles',
        thumbnailPath,
        type,
        isCustom: true,
      };

      addCustomBackground(newBg);
      setBackground(id);
    } catch (error) {
      console.error('Failed to upload custom background:', error);
      alert('Failed to process the background file.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeleteCustom = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await deleteCustomBackgroundBlob(id);
    removeCustomBackground(id);
  };

  return (
    <div className="flex-col" style={{ gap: '1.25rem', flex: 1, overflowY: 'auto', paddingRight: '0.25rem' }}>
      <div className="flex-col" style={{ gap: '0.75rem', flexShrink: 0 }}>
        
        {/* Default Backgrounds */}
        <div className="flex-col" style={{ gap: '0.5rem' }}>
          {BACKGROUNDS.map((bg) => (
            <Card
              key={bg.id}
              onClick={() => setBackground(bg.id)}
              isActive={currentBackground.id === bg.id}
              image={
                <img 
                  src={bg.thumbnailPath} 
                  alt={bg.name} 
                  style={{ 
                    width: '60px', 
                    height: '40px', 
                    borderRadius: '6px', 
                    objectFit: 'cover',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }} 
                />
              }
              title={bg.name}
              actionButton={
                currentBackground.id === bg.id && (
                  <span style={{ fontSize: '0.65rem', background: 'var(--color-text)', color: 'var(--color-bg)', padding: '2px 6px', borderRadius: '8px', fontWeight: 600 }}>
                    active
                  </span>
                )
              }
            />
          ))}
        </div>

        <div style={{ height: '1px', background: 'var(--color-border)', margin: '0.5rem 0' }} />

        {/* Custom Backgrounds */}
        <div className="flex-col" style={{ gap: '0.5rem' }}>
          <h3 style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-dim)', marginBottom: '0.25rem' }}>Custom Backgrounds</h3>
          
          {customBackgrounds.map((bg) => (
            <Card
              key={bg.id}
              onClick={() => setBackground(bg.id)}
              isActive={currentBackground.id === bg.id}
              image={
                <img 
                  src={bg.thumbnailPath} 
                  alt={bg.name} 
                  style={{ 
                    width: '60px', 
                    height: '40px', 
                    borderRadius: '6px', 
                    objectFit: 'cover',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }} 
                />
              }
              title={bg.name}
              actionButton={
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  {currentBackground.id === bg.id && (
                    <span style={{ fontSize: '0.65rem', background: 'var(--color-text)', color: 'var(--color-bg)', padding: '2px 6px', borderRadius: '8px', fontWeight: 600 }}>
                      active
                    </span>
                  )}
                  <button
                    onClick={(e) => handleDeleteCustom(e, bg.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-dim)', padding: '4px' }}
                    title="Delete custom background"
                  >
                    <Trash size={14} />
                  </button>
                </div>
              }
            />
          ))}

          {customBackgrounds.length === 0 && (
            <div 
              onClick={isUploading ? undefined : handleUploadClick}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px dashed var(--color-border)',
                cursor: isUploading ? 'default' : 'pointer',
                color: 'var(--color-text-dim)',
                background: 'rgba(255,255,255,0.02)',
                fontSize: '0.85rem',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => { if (!isUploading) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
              onMouseLeave={(e) => { if (!isUploading) e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
            >
              {isUploading ? (
                <>
                  <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} />
                  Processing...
                </>
              ) : (
                <>
                  <Plus size={16} />
                  Add Custom Background (Max 30MB)
                </>
              )}
            </div>
          )}
        </div>

      </div>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        hidden
        accept="video/mp4, video/webm, image/jpeg, image/png, image/gif, image/webp"
        onChange={handleFileChange}
      />
    </div>
  );
};
