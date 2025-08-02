import React, { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { useAdaptiveAnimation } from './AdaptiveAnimationProvider';
import { useBreakpoint } from './ResponsiveBreakpoints';
import { globalAnimationQueue } from '../utils/AnimationQueue';

const PrecisionWoodScrollbar: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const scrollbarRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const sawBladeRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const rulerMarksRef = useRef<HTMLDivElement>(null);
  
  const { shouldUseAnimation, config } = useAdaptiveAnimation();
  const { isMobile, isTablet } = useBreakpoint();
  
  const sawRotation = useRef(0);
  const animationFrame = useRef<number>();
  const particlePool = useRef<HTMLDivElement[]>([]);

  // Dimensions based on device
  const dimensions = {
    trackWidth: isMobile ? 1.5 : 2,
    trackWidthHover: isMobile ? 3 : 4,
    sawSize: isMobile ? 10 : 14,
    rightOffset: isMobile ? 8 : 12
  };

  const createWoodParticle = useCallback(() => {
    if (!particlesRef.current || !shouldUseAnimation('advanced')) return;

    const particle = document.createElement('div');
    particle.className = 'wood-particle';
    particle.style.cssText = `
      position: absolute;
      width: ${1 + Math.random() * 2}px;
      height: ${1 + Math.random() * 2}px;
      background: #DEB887;
      border-radius: 50%;
      pointer-events: none;
      left: ${Math.random() * 20 - 10}px;
      top: 0;
    `;

    particlesRef.current.appendChild(particle);

    gsap.to(particle, {
      x: (Math.random() - 0.5) * 30,
      y: Math.random() * 40 + 20,
      rotation: Math.random() * 360,
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

  const updateScrollbar = useCallback(() => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    
    setScrollProgress(Math.min(Math.max(progress, 0), 100));
    setIsVisible(scrollTop > 50);

    // Update saw blade position and rotation
    if (sawBladeRef.current && shouldUseAnimation('basic')) {
      sawRotation.current += isDragging ? 8 : 1;
      
      gsap.set(sawBladeRef.current, {
        top: `${progress}%`,
        rotation: sawRotation.current,
        force3D: true
      });
    }

    // Update progress fill
    if (progressRef.current) {
      gsap.set(progressRef.current, {
        height: `${progress}%`,
        force3D: true
      });
    }
  }, [isDragging, shouldUseAnimation]);

  const smoothScrollTo = useCallback((targetProgress: number) => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const targetScrollTop = (targetProgress / 100) * scrollHeight;
    
    gsap.to(window, {
      scrollTo: { y: targetScrollTop },
      duration: config.animationDuration,
      ease: 'power2.out'
    });
  }, [config]);

  const handleTrackClick = useCallback((e: MouseEvent) => {
    if (!trackRef.current || isDragging) return;
    
    const rect = trackRef.current.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const trackHeight = rect.height;
    const targetProgress = Math.max(0, Math.min(100, (clickY / trackHeight) * 100));
    
    smoothScrollTo(targetProgress);
    
    // Create click effect
    if (shouldUseAnimation('advanced')) {
      createWoodParticle();
      
      const clickRipple = document.createElement('div');
      clickRipple.style.cssText = `
        position: absolute;
        top: ${clickY}px;
        left: 50%;
        transform: translateX(-50%);
        width: 20px;
        height: 20px;
        background: radial-gradient(circle, #FFD700, transparent);
        border-radius: 50%;
        pointer-events: none;
        animation: click-ripple 0.6s ease-out forwards;
      `;
      
      trackRef.current.appendChild(clickRipple);
      
      setTimeout(() => {
        if (clickRipple.parentNode) {
          clickRipple.parentNode.removeChild(clickRipple);
        }
      }, 600);
    }
  }, [isDragging, smoothScrollTo, shouldUseAnimation, createWoodParticle]);

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
      
      // Create particles while dragging
      if (shouldUseAnimation('advanced') && Math.random() < 0.3) {
        createWoodParticle();
      }
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [scrollProgress, smoothScrollTo, shouldUseAnimation, createWoodParticle]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    
    if (scrollbarRef.current && shouldUseAnimation('basic')) {
      gsap.to(scrollbarRef.current, {
        width: dimensions.trackWidthHover,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
    
    if (sawBladeRef.current && shouldUseAnimation('advanced')) {
      gsap.to(sawBladeRef.current, {
        boxShadow: '0 0 15px rgba(255, 165, 0, 0.8), 0 0 30px rgba(255, 140, 0, 0.4)',
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  }, [shouldUseAnimation, dimensions]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    
    if (!isDragging && scrollbarRef.current && shouldUseAnimation('basic')) {
      gsap.to(scrollbarRef.current, {
        width: dimensions.trackWidth,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
    
    if (sawBladeRef.current && shouldUseAnimation('advanced')) {
      gsap.to(sawBladeRef.current, {
        boxShadow: '0 2px 6px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.3)',
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  }, [isDragging, shouldUseAnimation, dimensions]);

  // Continuous saw blade rotation
  useEffect(() => {
    if (!shouldUseAnimation('basic')) return;
    
    const rotateSaw = () => {
      if (sawBladeRef.current) {
        sawRotation.current += isDragging ? 4 : 0.5;
        gsap.set(sawBladeRef.current, {
          rotation: sawRotation.current,
          force3D: true
        });
      }
      animationFrame.current = requestAnimationFrame(rotateSaw);
    };
    
    rotateSaw();
    
    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [isDragging, shouldUseAnimation]);

  useEffect(() => {
    // Add scrollbar to animation queue
    globalAnimationQueue.add({
      id: 'precision-scrollbar-init',
      element: scrollbarRef.current,
      priority: 'high',
      maxRetries: 2,
      timeout: 3000,
      animation: async () => {
        return new Promise<void>((resolve) => {
          if (scrollbarRef.current) {
            gsap.fromTo(scrollbarRef.current, 
              { opacity: 0, x: 20 },
              { 
                opacity: 1, 
                x: 0, 
                duration: 0.8, 
                ease: 'power2.out',
                onComplete: resolve
              }
            );
          } else {
            resolve();
          }
        });
      }
    });

    // Event listeners
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

    // Initial update
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
    <>
      <div 
        ref={scrollbarRef}
        className={`precision-wood-scrollbar ${isVisible ? 'visible' : ''} ${isHovered ? 'hovered' : ''}`}
        style={{
          position: 'fixed',
          top: '2.5vh',
          right: `${dimensions.rightOffset}px`,
          width: `${dimensions.trackWidth}px`,
          height: '95vh',
          zIndex: 1000,
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.3s ease',
          cursor: 'pointer'
        }}
      >
        {/* Wood grain track */}
        <div 
          ref={trackRef}
          className="wood-ruler-track"
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            background: `
              linear-gradient(180deg, 
                #3C2415 0%, 
                #5D4037 25%, 
                #6D4C41 50%, 
                #5D4037 75%, 
                #3C2415 100%
              )
            `,
            borderRadius: '1px',
            overflow: 'hidden',
            boxShadow: 'inset 0 0 2px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.3)'
          }}
        >
          {/* Ruler marks */}
          <div 
            ref={rulerMarksRef}
            className="ruler-marks"
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: '100%',
              height: '100%',
              background: `
                repeating-linear-gradient(0deg,
                  transparent 0px,
                  transparent 8px,
                  rgba(255, 215, 0, 0.3) 8px,
                  rgba(255, 215, 0, 0.3) 9px,
                  transparent 9px,
                  transparent 40px,
                  rgba(255, 215, 0, 0.6) 40px,
                  rgba(255, 215, 0, 0.6) 11px
                )
              `
            }}
          />
          
          {/* Cutting progress */}
          <div 
            ref={progressRef}
            className="cutting-progress"
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              background: 'linear-gradient(0deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)',
              borderRadius: '1px',
              boxShadow: '0 0 4px rgba(255, 215, 0, 0.8), inset 0 0 2px rgba(255, 255, 255, 0.3)',
              transition: 'height 0.1s ease'
            }}
          />
          
          {/* Precision saw blade */}
          <div 
            ref={sawBladeRef}
            className="precision-saw-blade"
            style={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%) translateY(-50%)',
              width: `${dimensions.sawSize}px`,
              height: `${dimensions.sawSize}px`,
              background: `
                radial-gradient(circle, #E8E8E8 20%, #C0C0C0 40%, #A0A0A0 60%, #808080 80%),
                conic-gradient(from 0deg, 
                  #E8E8E8 0deg, #C0C0C0 30deg, #A0A0A0 60deg, #808080 90deg,
                  #E8E8E8 120deg, #C0C0C0 150deg, #A0A0A0 180deg, #808080 210deg,
                  #E8E8E8 240deg, #C0C0C0 270deg, #A0A0A0 300deg, #808080 330deg
                )
              `,
              borderRadius: '50%',
              cursor: isDragging ? 'grabbing' : 'grab',
              boxShadow: '0 2px 6px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.3)',
              zIndex: 10,
              transition: 'transform 0.1s ease'
            }}
          >
            {/* Saw teeth detail */}
            <div style={{
              position: 'absolute',
              inset: '2px',
              borderRadius: '50%',
              background: `
                conic-gradient(from 0deg, 
                  transparent 5%, #A0A0A0 10%, transparent 15%,
                  transparent 20%, #A0A0A0 25%, transparent 30%,
                  transparent 35%, #A0A0A0 40%, transparent 45%,
                  transparent 50%, #A0A0A0 55%, transparent 60%,
                  transparent 65%, #A0A0A0 70%, transparent 75%,
                  transparent 80%, #A0A0A0 85%, transparent 90%,
                  transparent 95%, #A0A0A0 100%
                )
              `
            }} />
          </div>
          
          {/* Wood particles container */}
          <div 
            ref={particlesRef}
            className="wood-particles-container"
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

      <style jsx>{`
        @keyframes click-ripple {
          0% {
            transform: translateX(-50%) scale(0);
            opacity: 1;
          }
          100% {
            transform: translateX(-50%) scale(3);
            opacity: 0;
          }
        }
        
        .precision-wood-scrollbar {
          will-change: transform, opacity;
          backface-visibility: hidden;
        }
        
        .wood-ruler-track {
          will-change: transform;
          backface-visibility: hidden;
        }
        
        .precision-saw-blade {
          will-change: transform;
          backface-visibility: hidden;
        }
        
        .cutting-progress {
          will-change: height;
          backface-visibility: hidden;
        }
      `}</style>
    </>
  );
};

export default PrecisionWoodScrollbar;