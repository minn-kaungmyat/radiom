import { useState, useEffect } from 'react';

interface ResponsiveState {
  isMobile: boolean;   // ≤ 768px
  isTablet: boolean;   // 769px – 1024px
  isDesktop: boolean;  // > 1024px
  screenWidth: number;
}

const MOBILE_BREAKPOINT = 768;
const TABLET_BREAKPOINT = 1024;

const getState = (width: number): ResponsiveState => ({
  isMobile: width <= MOBILE_BREAKPOINT,
  isTablet: width > MOBILE_BREAKPOINT && width <= TABLET_BREAKPOINT,
  isDesktop: width > TABLET_BREAKPOINT,
  screenWidth: width,
});

export const useIsMobile = (): ResponsiveState => {
  const [state, setState] = useState<ResponsiveState>(() =>
    getState(window.innerWidth)
  );

  useEffect(() => {
    const mobileQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
    const tabletQuery = window.matchMedia(`(max-width: ${TABLET_BREAKPOINT}px)`);

    const handleChange = () => {
      setState(getState(window.innerWidth));
    };

    mobileQuery.addEventListener('change', handleChange);
    tabletQuery.addEventListener('change', handleChange);

    return () => {
      mobileQuery.removeEventListener('change', handleChange);
      tabletQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return state;
};
