import React, { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { useAdaptiveAnimation } from './AdaptiveAnimationProvider';

const WoodGrainScrollbar: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const scrollbarRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const sawBladeRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const sparksRef = useRef<HTMLDivElement>(null);
  const sawdustRef = useRef<HTMLDivElement>(null);
  
  const { shouldUseAnimation, config } = useAdaptiveAnimation();

  const createSawdust = useCallback(() => {
    if (!sawdustRef.current || !shouldUseAnimation('advanced')) return;

    const particle = document.createElement('div');
    particle.className = 'sawdust-particle';
    particle.style.cssText = `
      position: absolute;
      width: 2px;
      height: 2px;
      background: #DEB887;
      border-radius: 50%;
      pointer-events: none;
      left: ${Math.random() * 20 - 10}px;
      top: 0;
    `;

    sawdustRef.current.appendChild(particle);

    gsap.to(particle, {
      x: (Math.random() - 0.5) * 30,
      y: Math.random() * 50 + 20,
      opacity: 0,
      duration: 1 + Math.random(),
      ease: 'power2.out',
      onComplete: () => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      }
    });
  }, [shouldUseAnimation]);

  const createSparks = useCallback(() => {
    if (!sparksRef.current || !shouldUseAnimation('complex')) return;

    for (let i = 0; i < 3; i++) {
      const spark = document.createElement('div');
      spark.className = 'spark-particle';
      spark.style.cssText = `
        position: absolute;
        width: 1px;
        height: 4px;
        background: linear-gradient(to bottom, #FFD700, #FFA500);
        pointer-events: none;
        left: ${Math.random() * 10 - 5}px;
        top: 0;
      `;

      sparksRef.current.appendChild(spark);

      gsap.to(spark, {
        x: (Math.random() - 0.5) * 20,
        y: Math.random() * 30 + 10,
        rotation: Math.random() * 360,
        opacity: 0,
        duration: 0.5 + Math.random() * 0.5,
        ease: 'power2.out',
        onComplete: () => {
          if (spark.parentNode) {
            spark.parentNode.removeChild(spark);
          }
        }
      });
    }
  }, [shouldUseAnimation]);

  const updateScrollbar = useCallback(() => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    
    setScrollProgress(Math.min(Math.max(progress, 0), 100));
    setIsVisible(scrollTop > 50);

    if (sawBladeRef.current && shouldUseAnimation('basic')) {
      gsap.set(sawBladeRef.current, {
        top: `${progress}%`,
        rotation: scrollTop * 0.5, // Rotate saw blade based on scroll
        force3D: true
      });
    }

    if (progressRef.current) {
      gsap.set(progressRef.current, {
        height: `${progress}%`,
        force3D: true
      });
    }
  }, [shouldUseAnimation]);

  const smoothScrollTo = useCallback((targetProgress: number) => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const targetScrollTop = (targetProgress / 100) * scrollHeight;
    
    gsap.to(window, {
      scrollTo: { y: targetScrollTop },
      duration: config.animationDuration,
      ease: config.easing
    });
  }, [config]);

  const handleTrackClick = useCallback((e: MouseEvent) => {
    if (!trackRef.current || isDragging) return;
    
    const rect = trackRef.current.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const trackHeight = rect.height;
    const targetProgress = Math.max(0, Math.min(100, (clickY / trackHeight) * 100));
    
    smoothScrollTo(targetProgress);
    
    if (shouldUseAnimation('advanced')) {
      createSparks();
      createSawdust();
    }
  }, [isDragging, smoothScrollTo, shouldUseAnimation, createSparks, createSawdust]);

  const handleMouseDown = useCallback((e: MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    
    const startY = e.clientY;
    const startProgress = scrollProgress;
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!trackRef.current) return;
      
      const rect = trackRef.current.getBoundingClientRect();
      const deltaY = moveEvent.clientY - startY;
      const deltaProgress = (deltaY / rect.height) * 100;
      const newProgress = Math.max(0, Math.min(100, startProgress + deltaProgress));
      
      smoothScrollTo(newProgress);
      
      if (shouldUseAnimation('advanced') && Math.random() < 0.3) {
        createSawdust();
      }
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [scrollProgress, smoothScrollTo, shouldUseAnimation, createSawdust]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    
    if (scrollbarRef.current && shouldUseAnimation('basic')) {
      gsap.to(scrollbarRef.current, {
        width: 6,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  }, [shouldUseAnimation]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    
    if (!isDragging && scrollbarRef.current && shouldUseAnimation('basic')) {
      gsap.to(scrollbarRef.current, {
        width: 2,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  }, [isDragging, shouldUseAnimation]);

  useEffect(() => {
    window.addEventListener('scroll', updateScrollbar, { passive: true });
    window.addEventListener('resize', updateScrollbar);
    
    if (trackRef.current) {
      trackRef.current.addEventListener('click', handleTrackClick);
      trackRef.current.addEventListener('mouseenter', handleMouseEnter);
      trackRef.current.addEventListener('mouseleave', handleMouseLeave);
    }
    
    if (sawBladeRef.current) {
      sawBladeRef.current.addEventListener('mousedown', handleMouseDown);
    }

    updateScrollbar();
    
    return () => {
      window.removeEventListener('scroll', updateScrollbar);
      window.removeEventListener('resize', updateScrollbar);
      
      if (trackRef.current) {
        trackRef.current.removeEventListener('click', handleTrackClick);
        trackRef.current.removeEventListener('mouseenter', handleMouseEnter);
        trackRef.current.removeEventListener('mouseleave', handleMouseLeave);
      }
      
      if (sawBladeRef.current) {
        sawBladeRef.current.removeEventListener('mousedown', handleMouseDown);
      }
    };
  }, [updateScrollbar, handleTrackClick, handleMouseDown, handleMouseEnter, handleMouseLeave]);

  return (
    <div 
      ref={scrollbarRef}
      className={`wood-grain-scrollbar ${isVisible ? 'visible' : ''} ${isHovered ? 'hovered' : ''}`}
      style={{
        position: 'fixed',
        top: 0,
        right: '8px',
        width: '2px',
        height: '100vh',
        zIndex: 1000,
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.3s ease',
        cursor: 'pointer'
      }}
    >
      {/* Wood grain track */}
      <div 
        ref={trackRef}
        className="wood-grain-track"
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          background: `
            linear-gradient(180deg, 
              #8B4513 0%, 
              #A0522D 25%, 
              #CD853F 50%, 
              #DEB887 75%, 
              #8B4513 100%
            ),
            repeating-linear-gradient(0deg, 
              transparent, 
              transparent 2px, 
              rgba(0,0,0,0.1) 2px, 
              rgba(0,0,0,0.1) 4px
            )
          `,
          borderRadius: '1px',
          overflow: 'hidden'
        }}
      >
        {/* Progress fill - golden amber cutting through wood */}
        <div 
          ref={progressRef}
          className="progress-cut"
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            background: 'linear-gradient(0deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)',
            borderRadius: '1px',
            boxShadow: '0 0 4px rgba(255, 215, 0, 0.5)',
            transition: 'height 0.1s ease'
          }}
        />
        
        {/* Saw blade thumb */}
        <div 
          ref={sawBladeRef}
          className="saw-blade"
          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%) translateY(-50%)',
            width: '16px',
            height: '16px',
            background: `
              radial-gradient(circle, #C0C0C0 30%, #808080 70%),
              conic-gradient(from 0deg, #C0C0C0, #808080, #C0C0C0, #808080, #C0C0C0, #808080, #C0C0C0, #808080)
            `,
            borderRadius: '50%',
            cursor: isDragging ? 'grabbing' : 'grab',
            boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
            zIndex: 10,
            transition: 'transform 0.1s ease'
          }}
        >
          {/* Saw teeth */}
          <div style={{
            position: 'absolute',
            inset: '2px',
            borderRadius: '50%',
            background: 'conic-gradient(from 0deg, transparent 10%, #A0A0A0 15%, transparent 20%, transparent 30%, #A0A0A0 35%, transparent 40%, transparent 50%, #A0A0A0 55%, transparent 60%, transparent 70%, #A0A0A0 75%, transparent 80%, transparent 90%, #A0A0A0 95%, transparent 100%)'
          }} />
        </div>
        
        {/* Sparks container */}
        <div 
          ref={sparksRef}
          className="sparks-container"
          style={{
            position: 'absolute',
            left: '50%',
            top: `${scrollProgress}%`,
            transform: 'translateX(-50%) translateY(-50%)',
            pointerEvents: 'none',
            zIndex: 5
          }}
        />
        
        {/* Sawdust container */}
        <div 
          ref={sawdustRef}
          className="sawdust-container"
          style={{
            position: 'absolute',
            left: '50%',
            top: `${scrollProgress}%`,
            transform: 'translateX(-50%) translateY(-50%)',
            pointerEvents: 'none',
            zIndex: 5
          }}
        />
      </div>
    </div>
  );
};

export default WoodGrainScrollbar;