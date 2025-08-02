import React, { useEffect, useRef } from 'react';
import { useAdaptiveAnimation } from './AdaptiveAnimationProvider';

const BackgroundAnimations: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { shouldUseAnimation, config } = useAdaptiveAnimation();

  useEffect(() => {
    if (!shouldUseAnimation('basic')) return;

    const createParticle = (type: 'wood' | 'orb' | 'wave' | 'smoke') => {
      if (!containerRef.current) return;

      const particle = document.createElement('div');
      
      switch (type) {
        case 'wood':
          particle.className = 'wood-particle';
          particle.style.left = `${Math.random() * 100}%`;
          particle.style.animationDuration = `${Math.random() * 10 + 15}s`;
          particle.style.animationDelay = `${Math.random() * 5}s`;
          break;
          
        case 'orb':
          particle.className = 'glowing-orb';
          particle.style.left = `${Math.random() * 100}%`;
          particle.style.animationDuration = `${Math.random() * 15 + 20}s`;
          particle.style.animationDelay = `${Math.random() * 8}s`;
          break;
          
        case 'wave':
          particle.className = 'wave-line';
          particle.style.top = `${Math.random() * 100}%`;
          particle.style.animationDuration = `${Math.random() * 10 + 25}s`;
          particle.style.animationDelay = `${Math.random() * 10}s`;
          break;
          
        case 'smoke':
          particle.className = 'smoke-effect';
          particle.style.left = `${Math.random() * 100}%`;
          particle.style.animationDuration = `${Math.random() * 20 + 30}s`;
          particle.style.animationDelay = `${Math.random() * 15}s`;
          break;
      }
      
      containerRef.current.appendChild(particle);
      
      // Remove particle after animation
      const duration = parseFloat(particle.style.animationDuration) * 1000;
      const delay = parseFloat(particle.style.animationDelay) * 1000;
      
      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      }, duration + delay);
    };

    // Create initial particles
    const particleTypes: ('wood' | 'orb' | 'wave' | 'smoke')[] = ['wood', 'orb', 'wave', 'smoke'];
    
    // Adjust particle count based on performance
    const particleCount = shouldUseAnimation('complex') ? 15 : shouldUseAnimation('advanced') ? 8 : 3;
    
    // Initial burst
    for (let i = 0; i < particleCount; i++) {
      setTimeout(() => {
        const randomType = particleTypes[Math.floor(Math.random() * particleTypes.length)];
        createParticle(randomType);
      }, i * 200);
    }

    // Continuous creation
    const intervals: NodeJS.Timeout[] = [];
    
    if (shouldUseAnimation('advanced')) {
      intervals.push(setInterval(() => createParticle('wood'), 2000));
      intervals.push(setInterval(() => createParticle('orb'), 3000));
    }
    
    if (shouldUseAnimation('complex')) {
      intervals.push(setInterval(() => createParticle('wave'), 4000));
      intervals.push(setInterval(() => createParticle('smoke'), 5000));
    }

    return () => {
      intervals.forEach(interval => clearInterval(interval));
    };
  }, [shouldUseAnimation, config]);

  return <div ref={containerRef} className="floating-particles" />;
};

export default BackgroundAnimations;