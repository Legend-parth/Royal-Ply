import React, { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { smoothScrollManager } from '../utils/SmoothScrollManager';
import { deviceOptimization } from '../utils/DeviceOptimization';

const MasterCraftsmanScrollbar: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const scrollbarRef = useRef<HTMLDivElement>(null);
  const rulerRef = useRef<HTMLDivElement>(null);
  const caliperRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const measurementRef = useRef<HTMLDivElement>(null);
  const dustRef = useRef<HTMLDivElement>(null);
  
  const settings = deviceOptimization.getSettings();
  const isMobile = deviceOptimization.getCapabilities().isMobile;

  // Dimensions based on device
  const dimensions = {
    width: isMobile ? 3 : 4,
    widthHover: isMobile ? 5 : 6,
    caliperSize: isMobile ? 16 : 20,
    rightOffset: isMobile ? 8 : 12
  };

  const createMeasurementDust = useCallback(() => {
    if (!dustRef.current || !settings.animations.particles) return;

    const particle = document.createElement('div');
    particle.className = 'measurement-dust';
    particle.style.cssText = `
      position: absolute;
      width: ${1 + Math.random() * 2}px;
      height: ${1 + Math.random() * 2}px;
      background: #DAA520;
      border-radius: 50%;
      pointer-events: none;
      left: ${Math.random() * 20 - 10}px;
      top: 0;
      opacity: 0.8;
    `;

    dustRef.current.appendChild(particle);

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
  }, [settings.animations.particles]);

  const updateScrollbar = useCallback(() => {
    const state = smoothScrollManager.getState();
    const progress = state.progress * 100;
    
    setScrollProgress(progress);
    setIsVisible(state.position > 50);

    // Update caliper position
    if (caliperRef.current) {
      gsap.set(caliperRef.current, {
        top: `${progress}%`,
        force3D: true
      });
    }

    // Update progress measurement line
    if (progressRef.current) {
      gsap.set(progressRef.current, {
        height: `${progress}%`,
        force3D: true
      });
    }

    // Update measurement numbers
    if (measurementRef.current && isHovered) {
      measurementRef.current.textContent = `${Math.round(progress)}%`;
    }
  }, [isHovered]);

  const handleTrackClick = useCallback((e: MouseEvent) => {
    if (!rulerRef.current || isDragging) return;
    
    const rect = rulerRef.current.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const trackHeight = rect.height;
    const targetProgress = Math.max(0, Math.min(1, clickY / trackHeight));
    
    smoothScrollManager.smoothScrollToProgress(targetProgress, {
      duration: 0.8,
      ease: 'power2.out'
    });
    
    // Create measurement dust and brass gleam effect
    if (settings.animations.particles) {
      createMeasurementDust();
      
      // Brass gleam animation
      if (caliperRef.current) {
        gsap.to(caliperRef.current, {
          boxShadow: '0 0 20px rgba(218, 165, 32, 0.8), 0 0 40px rgba(255, 215, 0, 0.4)',
          duration: 0.3,
          yoyo: true,
          repeat: 1,
          ease: 'power2.out'
        });
      }
    }
  }, [isDragging, settings.animations.particles, createMeasurementDust]);

  const handleMouseDown = useCallback((e: MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    
    const startY = e.clientY;
    const startProgress = scrollProgress;
    
    // Caliper opens animation
    if (caliperRef.current && settings.animations.complex3D) {
      gsap.to(caliperRef.current.querySelector('.caliper-arm'), {
        rotation: 15,
        duration: 0.2,
        ease: 'power2.out'
      });
    }
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!rulerRef.current) return;
      
      const rect = rulerRef.current.getBoundingClientRect();
      const deltaY = moveEvent.clientY - startY;
      const deltaProgress = (deltaY / rect.height) * 100;
      const newProgress = Math.max(0, Math.min(100, startProgress + deltaProgress));
      
      smoothScrollManager.smoothScrollToProgress(newProgress / 100, {
        duration: 0.1,
        ease: 'none'
      });
      
      // Create particles while dragging
      if (settings.animations.particles && Math.random() < 0.3) {
        createMeasurementDust();
      }
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      
      // Caliper closes animation
      if (caliperRef.current && settings.animations.complex3D) {
        gsap.to(caliperRef.current.querySelector('.caliper-arm'), {
          rotation: 0,
          duration: 0.3,
          ease: 'back.out(1.7)'
        });
      }
      
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [scrollProgress, settings.animations.complex3D, settings.animations.particles, createMeasurementDust]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    
    if (scrollbarRef.current && settings.features.smoothScrolling) {
      gsap.to(scrollbarRef.current, {
        width: dimensions.widthHover,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
    
    // Brass shine effect
    if (caliperRef.current && settings.animations.complex3D) {
      gsap.to(caliperRef.current, {
        boxShadow: '0 0 15px rgba(218, 165, 32, 0.6), inset 0 2px 4px rgba(255, 255, 255, 0.3)',
        duration: 0.3,
        ease: 'power2.out'
      });
    }
    
    // Show measurement numbers
    if (measurementRef.current) {
      gsap.to(measurementRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.3,
        ease: 'back.out(1.7)'
      });
    }
  }, [settings.features.smoothScrolling, settings.animations.complex3D, dimensions]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    
    if (!isDragging && scrollbarRef.current && settings.features.smoothScrolling) {
      gsap.to(scrollbarRef.current, {
        width: dimensions.width,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
    
    // Reset brass shine
    if (caliperRef.current && settings.animations.complex3D) {
      gsap.to(caliperRef.current, {
        boxShadow: '0 2px 8px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255, 255, 255, 0.2)',
        duration: 0.3,
        ease: 'power2.out'
      });
    }
    
    // Hide measurement numbers
    if (measurementRef.current) {
      gsap.to(measurementRef.current, {
        opacity: 0,
        scale: 0.8,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  }, [isDragging, settings.features.smoothScrolling, settings.animations.complex3D, dimensions]);

  useEffect(() => {
    // Subscribe to scroll updates
    const unsubscribe = smoothScrollManager.subscribe(updateScrollbar);
    
    // Event listeners
    if (rulerRef.current) {
      rulerRef.current.addEventListener('click', handleTrackClick);
      rulerRef.current.addEventListener('mouseenter', handleMouseEnter);
      rulerRef.current.addEventListener('mouseleave', handleMouseLeave);
    }
    
    if (caliperRef.current) {
      caliperRef.current.addEventListener('mousedown', handleMouseDown);
    }

    // Initial update
    updateScrollbar();
    
    return () => {
      unsubscribe();
      
      if (rulerRef.current) {
        rulerRef.current.removeEventListener('click', handleTrackClick);
        rulerRef.current.removeEventListener('mouseenter', handleMouseEnter);
        rulerRef.current.removeEventListener('mouseleave', handleMouseLeave);
      }
      
      if (caliperRef.current) {
        caliperRef.current.removeEventListener('mousedown', handleMouseDown);
      }
    };
  }, [updateScrollbar, handleTrackClick, handleMouseDown, handleMouseEnter, handleMouseLeave]);

  if (!settings.features.customCursor && isMobile) {
    return null;
  }

  return (
    <>
      <div 
        ref={scrollbarRef}
        className={`master-craftsman-scrollbar ${isVisible ? 'visible' : ''} ${isHovered ? 'hovered' : ''}`}
        style={{
          position: 'fixed',
          top: '5vh',
          right: `${dimensions.rightOffset}px`,
          width: `${dimensions.width}px`,
          height: '90vh',
          zIndex: 1000,
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.3s ease',
          cursor: 'pointer'
        }}
      >
        {/* SCROLL Label - Top */}
        <div style={{
          position: 'absolute',
          top: '-25px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '8px',
          fontWeight: 'bold',
          color: '#DAA520',
          fontFamily: 'monospace',
          letterSpacing: '1px',
          opacity: isHovered ? 1 : 0.6,
          transition: 'opacity 0.3s ease'
        }}>
          SCROLL
        </div>

        {/* Mahogany Ruler Track */}
        <div 
          ref={rulerRef}
          className="mahogany-ruler"
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            background: `
              linear-gradient(180deg, 
                #4A2C2A 0%, 
                #6B4423 25%, 
                #8B4513 50%, 
                #6B4423 75%, 
                #4A2C2A 100%
              )
            `,
            borderRadius: '2px',
            overflow: 'hidden',
            boxShadow: `
              inset 0 0 3px rgba(0,0,0,0.5), 
              0 2px 8px rgba(0,0,0,0.3),
              inset 2px 0 1px rgba(255,255,255,0.1),
              inset -2px 0 1px rgba(0,0,0,0.2)
            `,
            border: '1px solid rgba(218, 165, 32, 0.3)'
          }}
        >
          {/* Wood grain texture */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: `
              repeating-linear-gradient(0deg,
                transparent 0px,
                transparent 2px,
                rgba(0,0,0,0.1) 2px,
                rgba(0,0,0,0.1) 3px
              ),
              repeating-linear-gradient(90deg,
                transparent 0px,
                transparent 1px,
                rgba(139,69,19,0.2) 1px,
                rgba(139,69,19,0.2) 2px
              )
            `,
            borderRadius: '2px'
          }} />
          
          {/* Golden measurement markings */}
          <div style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            background: `
              repeating-linear-gradient(0deg,
                transparent 0px,
                transparent 18px,
                rgba(218, 165, 32, 0.6) 18px,
                rgba(218, 165, 32, 0.6) 19px,
                transparent 19px,
                transparent 38px,
                rgba(218, 165, 32, 0.8) 38px,
                rgba(218, 165, 32, 0.8) 20px
              )
            `
          }} />
          
          {/* Brass fittings */}
          <div style={{
            position: 'absolute',
            top: '5px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '6px',
            height: '3px',
            background: 'linear-gradient(180deg, #DAA520, #B8860B)',
            borderRadius: '1px',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3)'
          }} />
          
          <div style={{
            position: 'absolute',
            bottom: '5px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '6px',
            height: '3px',
            background: 'linear-gradient(180deg, #DAA520, #B8860B)',
            borderRadius: '1px',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3)'
          }} />
          
          {/* Golden measurement line progress */}
          <div 
            ref={progressRef}
            className="measurement-progress"
            style={{
              position: 'absolute',
              bottom: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '2px',
              background: 'linear-gradient(0deg, #FFD700 0%, #DAA520 100%)',
              borderRadius: '1px',
              boxShadow: '0 0 4px rgba(255, 215, 0, 0.8)',
              transition: 'height 0.1s ease'
            }}
          />
          
          {/* Brass sliding caliper */}
          <div 
            ref={caliperRef}
            className="brass-caliper"
            style={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%) translateY(-50%)',
              width: `${dimensions.caliperSize}px`,
              height: `${dimensions.caliperSize}px`,
              background: `
                radial-gradient(circle, #DAA520 20%, #B8860B 40%, #CD853F 60%, #DAA520 80%),
                linear-gradient(45deg, #FFD700 0%, #DAA520 50%, #B8860B 100%)
              `,
              borderRadius: '50%',
              cursor: isDragging ? 'grabbing' : 'grab',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255, 255, 255, 0.2)',
              zIndex: 10,
              border: '1px solid rgba(184, 134, 11, 0.8)',
              position: 'relative'
            }}
          >
            {/* Caliper arms */}
            <div 
              className="caliper-arm"
              style={{
                position: 'absolute',
                top: '2px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '1px',
                height: `${dimensions.caliperSize - 4}px`,
                background: 'linear-gradient(180deg, #B8860B, #DAA520)',
                borderRadius: '0.5px',
                transformOrigin: 'bottom center'
              }}
            />
            
            <div style={{
              position: 'absolute',
              top: '2px',
              right: '2px',
              width: '1px',
              height: `${dimensions.caliperSize - 4}px`,
              background: 'linear-gradient(180deg, #B8860B, #DAA520)',
              borderRadius: '0.5px'
            }} />
            
            {/* Center measurement point */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '3px',
              height: '3px',
              background: '#B8860B',
              borderRadius: '50%',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3)'
            }} />
            
            {/* Brass engravings */}
            <div style={{
              position: 'absolute',
              inset: '3px',
              borderRadius: '50%',
              background: `
                conic-gradient(from 0deg, 
                  transparent 10%, rgba(184, 134, 11, 0.3) 15%, transparent 20%,
                  transparent 35%, rgba(184, 134, 11, 0.3) 40%, transparent 45%,
                  transparent 60%, rgba(184, 134, 11, 0.3) 65%, transparent 70%,
                  transparent 85%, rgba(184, 134, 11, 0.3) 90%, transparent 95%
                )
              `
            }} />
          </div>
          
          {/* Measurement numbers */}
          <div 
            ref={measurementRef}
            className="measurement-display"
            style={{
              position: 'absolute',
              left: '120%',
              top: `${scrollProgress}%`,
              transform: 'translateY(-50%)',
              background: 'rgba(0, 0, 0, 0.8)',
              color: '#DAA520',
              padding: '2px 6px',
              borderRadius: '3px',
              fontSize: '10px',
              fontFamily: 'monospace',
              fontWeight: 'bold',
              opacity: 0,
              scale: 0.8,
              whiteSpace: 'nowrap',
              border: '1px solid rgba(218, 165, 32, 0.3)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
            }}
          >
            {Math.round(scrollProgress)}%
          </div>
          
          {/* Measurement dust particles container */}
          <div 
            ref={dustRef}
            className="measurement-dust-container"
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

        {/* SCROLL Label - Bottom */}
        <div style={{
          position: 'absolute',
          bottom: '-25px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '8px',
          fontWeight: 'bold',
          color: '#DAA520',
          fontFamily: 'monospace',
          letterSpacing: '1px',
          opacity: isHovered ? 1 : 0.6,
          transition: 'opacity 0.3s ease'
        }}>
          SCROLL
        </div>
      </div>

      <style jsx>{`
        .master-craftsman-scrollbar {
          will-change: transform, opacity;
          backface-visibility: hidden;
        }
        
        .mahogany-ruler {
          will-change: transform;
          backface-visibility: hidden;
        }
        
        .brass-caliper {
          will-change: transform;
          backface-visibility: hidden;
        }
        
        .measurement-progress {
          will-change: height;
          backface-visibility: hidden;
        }
        
        .measurement-dust {
          will-change: transform, opacity;
          backface-visibility: hidden;
        }
      `}</style>
    </>
  );
};

export default MasterCraftsmanScrollbar;