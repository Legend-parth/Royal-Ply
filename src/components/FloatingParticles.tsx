import React, { useEffect, useRef } from 'react';

const FloatingParticles: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const createParticle = () => {
      if (!containerRef.current) return;

      const particle = document.createElement('div');
      particle.className = 'particle';
      
      // Random position
      particle.style.left = `${Math.random() * 100}%`;
      
      // Random size
      const size = Math.random() * 4 + 2;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      // Random animation duration
      const duration = Math.random() * 20 + 15;
      particle.style.animationDuration = `${duration}s`;
      
      // Random delay
      const delay = Math.random() * 5;
      particle.style.animationDelay = `${delay}s`;
      
      // Random opacity
      const opacity = Math.random() * 0.5 + 0.1;
      particle.style.background = `rgba(107, 70, 193, ${opacity})`;
      
      containerRef.current.appendChild(particle);
      
      // Remove particle after animation
      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      }, (duration + delay) * 1000);
    };

    // Create initial particles
    for (let i = 0; i < 20; i++) {
      setTimeout(() => createParticle(), i * 200);
    }

    // Create new particles periodically
    const interval = setInterval(() => {
      createParticle();
    }, 800);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return <div ref={containerRef} className="floating-particles" />;
};

export default FloatingParticles;