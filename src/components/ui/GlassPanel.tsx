import React, { forwardRef } from 'react';

export interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  padding?: string;
  borderRadius?: string;
}

export const GlassPanel = forwardRef<HTMLDivElement, GlassPanelProps>(({
  className = '',
  padding,
  borderRadius,
  style,
  children,
  ...props
}, ref) => {
  const customStyle: React.CSSProperties = { ...style };
  if (padding) customStyle.padding = padding;
  if (borderRadius) customStyle.borderRadius = borderRadius;

  return (
    <div 
      ref={ref}
      className={`glass-panel ${className}`} 
      style={Object.keys(customStyle).length > 0 ? customStyle : undefined}
      {...props}
    >
      {children}
    </div>
  );
});

GlassPanel.displayName = 'GlassPanel';
