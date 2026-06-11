import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  isActive?: boolean;
  interactive?: boolean;
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  isActive = false,
  interactive = false,
  className = '',
  children,
  ...props
}) => {
  const classes = [
    'badge',
    isActive && interactive ? 'active active-pixel-pop' : isActive ? 'active' : '',
    interactive ? 'interactive hover-pixel-pop' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
};
