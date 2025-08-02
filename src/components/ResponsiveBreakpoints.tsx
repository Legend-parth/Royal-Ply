import React, { useEffect, useState } from 'react';

interface BreakpointContextType {
  breakpoint: 'mobile' | 'mobile-large' | 'tablet' | 'desktop' | 'desktop-large' | 'ultra-wide';
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  orientation: 'portrait' | 'landscape';
}

const ResponsiveBreakpoints = React.createContext<BreakpointContextType | null>(null);

export const useBreakpoint = () => {
  const context = React.useContext(ResponsiveBreakpoints);
  if (!context) {
    throw new Error('useBreakpoint must be used within ResponsiveProvider');
  }
  return context;
};

interface ResponsiveProviderProps {
  children: React.ReactNode;
}

export const ResponsiveProvider: React.FC<ResponsiveProviderProps> = ({ children }) => {
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768
  });

  const getBreakpoint = (width: number): BreakpointContextType['breakpoint'] => {
    if (width < 480) return 'mobile';
    if (width < 768) return 'mobile-large';
    if (width < 1024) return 'tablet';
    if (width < 1440) return 'desktop';
    if (width < 2560) return 'desktop-large';
    return 'ultra-wide';
  };

  const breakpoint = getBreakpoint(dimensions.width);
  const isMobile = breakpoint === 'mobile' || breakpoint === 'mobile-large';
  const isTablet = breakpoint === 'tablet';
  const isDesktop = !isMobile && !isTablet;
  const orientation = dimensions.height > dimensions.width ? 'portrait' : 'landscape';

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const value: BreakpointContextType = {
    breakpoint,
    width: dimensions.width,
    height: dimensions.height,
    isMobile,
    isTablet,
    isDesktop,
    orientation
  };

  return (
    <ResponsiveBreakpoints.Provider value={value}>
      {children}
    </ResponsiveBreakpoints.Provider>
  );
};