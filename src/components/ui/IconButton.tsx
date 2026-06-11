import React from 'react';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  isActive?: boolean;
  variant?: 'ghost' | 'solid';
  size?: number; // width and height in px
  className?: string;
  popOnHover?: boolean;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  isActive = false,
  variant = 'ghost',
  size = 46,
  className = '',
  popOnHover = true,
  style,
  ...props
}) => {
  const classes = [
    'icon-button',
    `variant-${variant}`,
    'transition-standard',
    isActive && popOnHover ? 'active active-pixel-pop' : isActive ? 'active' : '',
    popOnHover ? 'hover-pixel-pop' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      className={classes}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        ...style
      }}
      {...props}
    >
      {icon}
    </button>
  );
};
