import React from 'react';
import type { SVGProps } from 'react';

import { Play as _Play } from 'pixelarticons/react/Play';
import { Volume2 as _Volume2 } from 'pixelarticons/react/Volume2';
import { Volume1 as _VolumeX } from 'pixelarticons/react/Volume1';
import { Loader as _Loader } from 'pixelarticons/react/Loader';
import { WarningDiamond as _AlertCircle } from 'pixelarticons/react/WarningDiamond';
import { Cloud as _Cloud } from 'pixelarticons/react/Cloud';
import { Coffee as _Coffee } from 'pixelarticons/react/Coffee';
import { Moon as _Moon } from 'pixelarticons/react/Moon';
import { Music as _Music } from 'pixelarticons/react/Music';
import { BookOpen as _BookOpen } from 'pixelarticons/react/BookOpen';
import { Terminal as _Terminal } from 'pixelarticons/react/Terminal';
import { Heart as _Heart } from 'pixelarticons/react/Heart';
import { Trash as _Trash } from 'pixelarticons/react/Trash';
import { Sparkles as _Sparkles } from 'pixelarticons/react/Sparkles';
import { Settings2 as _Sliders } from 'pixelarticons/react/Settings2';
import { Clock as _Clock } from 'pixelarticons/react/Clock';
import { Calendar as _Calendar } from 'pixelarticons/react/Calendar';
import { Close as _X } from 'pixelarticons/react/Close';
import { Search as _Search } from 'pixelarticons/react/Search';
import { Globe as _Globe } from 'pixelarticons/react/Globe';
import { Languages as _Languages } from 'pixelarticons/react/Languages';
import { ChevronDown as _ChevronDown } from 'pixelarticons/react/ChevronDown';
import { ChevronRight as _ChevronRight } from 'pixelarticons/react/ChevronRight';
import { Home as _Home } from 'pixelarticons/react/Home';
import { Radio as _Radio } from 'pixelarticons/react/Radio';
import { Reload as _Reload } from 'pixelarticons/react/Reload';
import { ChartBarBig as _BarChart2 } from 'pixelarticons/react/ChartBarBig';
import { SettingsCog2 as _Settings } from 'pixelarticons/react/SettingsCog2';
import { PenSquare as _Edit2 } from 'pixelarticons/react/PenSquare';
import { Minus as _Minus } from 'pixelarticons/react/Minus';
import { Check as _Check } from 'pixelarticons/react/Check';
import { MessageText as _MessageSquare } from 'pixelarticons/react/MessageText';
import { Share as _Share } from 'pixelarticons/react/Share';
import { ExternalLink as _ExternalLink } from 'pixelarticons/react/ExternalLink';
export interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}

function withLucideProps(IconComponent: React.ComponentType<any>) {
  return function LucideIcon({ size = 24, color = 'currentColor', style, ...props }: IconProps) {
    return (
      <IconComponent 
        width={size} 
        height={size} 
        style={{ color, ...style }} 
        {...props} 
      />
    );
  }
}

export const Play = withLucideProps(_Play);
export const Volume2 = withLucideProps(_Volume2);
export const VolumeX = withLucideProps(_VolumeX);
export const Loader = withLucideProps(_Loader);
export const AlertCircle = withLucideProps(_AlertCircle);
export const Cloud = withLucideProps(_Cloud);
export const Coffee = withLucideProps(_Coffee);
export const Moon = withLucideProps(_Moon);
export const Music = withLucideProps(_Music);
export const BookOpen = withLucideProps(_BookOpen);
export const Terminal = withLucideProps(_Terminal);
export const Heart = withLucideProps(_Heart);
export const Trash = withLucideProps(_Trash);
export const Sparkles = withLucideProps(_Sparkles);
export const Sliders = withLucideProps(_Sliders);
export const Clock = withLucideProps(_Clock);
export const Calendar = withLucideProps(_Calendar);
export const X = withLucideProps(_X);
export const Search = withLucideProps(_Search);
export const Globe = withLucideProps(_Globe);
export const Languages = withLucideProps(_Languages);
export const ChevronDown = withLucideProps(_ChevronDown);
export const ChevronRight = withLucideProps(_ChevronRight);
export const Home = withLucideProps(_Home);
export const Radio = withLucideProps(_Radio);
export const Reload = withLucideProps(_Reload);
export const BarChart2 = withLucideProps(_BarChart2);
export const Settings = withLucideProps(_Settings);
export const Edit2 = withLucideProps(_Edit2);
export const Minus = withLucideProps(_Minus);
export const Check = withLucideProps(_Check);
export const MessageSquare = withLucideProps(_MessageSquare);
export const Share = withLucideProps(_Share);
export const ExternalLink = withLucideProps(_ExternalLink);
export const Maximize = withLucideProps(function MaximizeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
    </svg>
  );
});

export const Minimize = withLucideProps(function MinimizeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
    </svg>
  );
});

export const Pause = withLucideProps(function PauseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M6 6h4v12H6zm8 0h4v12h-4z" />
    </svg>
  );
});

export const SkipForward = withLucideProps(function SkipForwardIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M8 20H6V4h2v2h2v2h2v2h2v4h-2v2h-2v2h-2v2zM16 4h2v16h-2z" />
    </svg>
  );
});

export const SkipBack = withLucideProps(function SkipBackIcon({ style, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" style={{ transform: 'rotate(180deg)', ...style }} {...props}>
      <path d="M8 20H6V4h2v2h2v2h2v2h2v4h-2v2h-2v2h-2v2zM16 4h2v16h-2z" />
    </svg>
  );
});

export const HeartFilled = withLucideProps(function HeartFilledIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M13 22h-2v-2h2v2Zm-2-2H9v-2h2v2Zm4 0h-2v-2h2v2Zm-6-2H7v-2h2v2Zm8 0h-2v-2h2v2ZM7 16H5v-2h2v2Zm12 0h-2v-2h2v2ZM5 14H3v-2h2v2Zm16 0h-2v-2h2v2ZM3 12H1V6h2v6Zm20 0h-2V6h2v6ZM13 8h-2V6h2v2ZM5 6H3V4h2v2Zm6 0H9V4h2v2Zm4 0h-2V4h2v2Zm6 0h-2V4h2v2ZM9 4H5V2h4v2Zm10 0h-4V2h4v2Z" />
      <rect x="5" y="4" width="4" height="2" />
      <rect x="15" y="4" width="4" height="2" />
      <rect x="3" y="6" width="18" height="6" />
      <rect x="5" y="12" width="14" height="2" />
      <rect x="7" y="14" width="10" height="2" />
      <rect x="9" y="16" width="6" height="2" />
      <rect x="11" y="18" width="2" height="2" />
    </svg>
  );
});

export const Plus = withLucideProps(function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2h6z" />
    </svg>
  );
});
