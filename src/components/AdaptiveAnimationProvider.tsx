import React, { createContext, useContext, useEffect, useState } from 'react';
import { performanceDetector, PerformanceCapabilities } from '../utils/performanceDetector';

interface AnimationConfig {
  particleCount: number;
  animationDuration: number;
  easing: string;
  useWebGL: boolean;
  use3D: boolean;
  complexAnimations: boolean;
}

interface AdaptiveAnimationContextType {
  capabilities: PerformanceCapabilities;
  config: AnimationConfig;
  shouldUseAnimation: (type: 'basic' | 'advanced' | 'complex') => boolean;
}

const AdaptiveAnimationContext = createContext<AdaptiveAnimationContextType | null>(null);

export const useAdaptiveAnimation = () => {
  const context = useContext(AdaptiveAnimationContext);
  if (!context) {
    throw new Error('useAdaptiveAnimation must be used within AdaptiveAnimationProvider');
  }
  return context;
};

interface AdaptiveAnimationProviderProps {
  children: React.ReactNode;
}

export const AdaptiveAnimationProvider: React.FC<AdaptiveAnimationProviderProps> = ({ children }) => {
  const [capabilities, setCapabilities] = useState<PerformanceCapabilities>(
    performanceDetector.getCapabilities()
  );
  const [config, setConfig] = useState<AnimationConfig>(
    performanceDetector.getAnimationConfig()
  );

  useEffect(() => {
    const handlePerformanceChange = (event: CustomEvent<PerformanceCapabilities>) => {
      setCapabilities(event.detail);
      setConfig(performanceDetector.getAnimationConfig());
    };

    window.addEventListener('performanceChange', handlePerformanceChange as EventListener);

    return () => {
      window.removeEventListener('performanceChange', handlePerformanceChange as EventListener);
    };
  }, []);

  const shouldUseAnimation = (type: 'basic' | 'advanced' | 'complex') => {
    return performanceDetector.shouldUseAnimation(type);
  };

  return (
    <AdaptiveAnimationContext.Provider value={{ capabilities, config, shouldUseAnimation }}>
      {children}
    </AdaptiveAnimationContext.Provider>
  );
};