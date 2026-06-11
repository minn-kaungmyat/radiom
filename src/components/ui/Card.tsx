import React from 'react';

export interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  isActive?: boolean;
  isCompact?: boolean;
  image?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actionButton?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  isActive = false,
  isCompact = false,
  image,
  title,
  subtitle,
  actionButton,
  className = '',
  onClick,
  ...props
}) => {
  const baseClass = `flex-between transition-standard hover-pixel-pop ${className}`;
  const activeClass = isActive ? 'active active-pixel-pop' : '';
  const compactClass = isCompact ? 'compact' : '';

  return (
    <div 
      className={`card ${baseClass} ${activeClass} ${compactClass}`} 
      onClick={onClick}
      {...props}
    >
      <div className="flex-center gap-2" style={{ flex: 1, minWidth: 0 }}>
        {image && (
          <div className="card-image-container flex-center">
            {image}
          </div>
        )}
        <div className="flex-col" style={{ flex: 1, minWidth: 0, justifyContent: 'center' }}>
          <div className={`card-title text-ellipsis ${isActive ? 'text-bold' : ''}`}>
            {title}
          </div>
          {subtitle && (
            <div className="card-subtitle text-ellipsis text-muted">
              {subtitle}
            </div>
          )}
        </div>
      </div>
      {actionButton && (
        <div onClick={(e) => e.stopPropagation()}>
          {actionButton}
        </div>
      )}
    </div>
  );
};
