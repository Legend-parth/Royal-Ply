import React, { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { smoothScrollSystem } from '../utils/SmoothScrollSystem';

const PrecisionWoodCutterScrollbar: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const scrollbarRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const sawBladeRef = useRef<HTMLDivElement>(null);
  const cuttingLineRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const heatGlowRef = useRef<HTMLDivElement>(null);
  
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const sawRotation = useRef(0);
  const animationFrame = useRef<number>();

  // Dimensions based on device
  const dimensions = {
    trackWidth: isMobile ? 2 : 3,
    trackWidthHover: isMobile ? 3 : 4,
    sawSize: isMobile ? 10 : 12,
    rightOffset: 12
  };

  const createWoodParticles = useCallback(() => {
    if (!particlesRef.current || isMobile) return;

    for (let i = 0; i < 3; i++) {
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
        opacity: 0.8;
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
    }
  }, [isMobile]);

  const updateScrollbar = useCallback(() => {
    const state = smoothScrollSystem.getState();
    const progress = state.progress * 100;
    
    setScrollProgress(progress);
    setIsVisible(state.position > 50);

    // Update saw blade position and rotation
    if (sawBladeRef.current) {
      const rotationSpeed = isDragging ? 8 : Math.abs(state.velocity) * 0.1 + 0.5;
      sawRotation.current += rotationSpeed;
      
      gsap.set(sawBladeRef.current, {
        top: `${progress}%`,
        rotation: sawRotation.current,
        force3D: true
      });
    }

    // Update cutting line
    if (cuttingLineRef.current) {
      gsap.set(cuttingLineRef.current, {
        height: `${progress}%`,
        force3D: true
      });
    }

    // Create particles during fast scrolling
    if (Math.abs(state.velocity) > 2 && Math.random() < 0.3) {
      createWoodParticles();
    }
  }, [isDragging, createWoodParticles]);

  const handleTrackClick = useCallback((e: MouseEvent) => {
    if (!trackRef.current || isDragging) return;
    
    const rect = trackRef.current.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const trackHeight = rect.height;
    const targetProgress = Math.max(0, Math.min(1, clickY / trackHeight));
    
    // Calculate target scroll position
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const targetScroll = targetProgress * maxScroll;
    
    smoothScrollSystem.scrollTo(targetScroll, {
      duration: 0.8,
      ease: 'power2.out'
    });
    
    // Create cutting effect
    createWoodParticles();
    
    // Heat glow effect
    if (heatGlowRef.current) {
      gsap.fromTo(heatGlowRef.current, 
        { opacity: 0, scale: 0.5 },
        { 
          opacity: 1, 
          scale: 1.2, 
          duration: 0.3,
          yoyo: true,
          repeat: 1,
          ease: 'power2.out'
        }
      );
    }
  }, [isDragging, createWoodParticles]);

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
      
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const targetScroll = (newProgress / 100) * maxScroll;
      
      smoothScrollSystem.scrollTo(targetScroll, { duration: 0.1 });
      
      // Create particles while dragging
      if (Math.random() < 0.4) {
        createWoodParticles();
      }
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [scrollProgress, createWoodParticles]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    
    if (scrollbarRef.current) {
      gsap.to(scrollbarRef.current, {
        width: dimensions.trackWidthHover,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
    
    // Heat glow effect
    if (heatGlowRef.current) {
      gsap.to(heatGlowRef.current, {
        opacity: 0.6,
        scale: 1.2,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  }, [dimensions]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    
    if (!isDragging && scrollbarRef.current) {
      gsap.to(scrollbarRef.current, {
        width: dimensions.trackWidth,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
    
    // Reset heat glow
    if (heatGlowRef.current) {
      gsap.to(heatGlowRef.current, {
        opacity: 0,
        scale: 1,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  }, [isDragging, dimensions]);

  // Continuous saw blade rotation
  useEffect(() => {
    const rotateSaw = () => {
      if (sawBladeRef.current) {
        const state = smoothScrollSystem.getState();
        const rotationSpeed = isDragging ? 4 : Math.abs(state.velocity) * 0.05 + 0.2;
        sawRotation.current += rotationSpeed;
        
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
  }, [isDragging]);

  useEffect(() => {
    // Subscribe to scroll updates
    const unsubscribe = smoothScrollSystem.subscribe('precision-scrollbar', updateScrollbar, 10);
    
    // Event listeners
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
      unsubscribe();
      
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
        className={`precision-wood-cutter-scrollbar ${isVisible ? 'visible' : ''} ${isHovered ? 'hovered' : ''}`}
        style={{
          position: 'fixed',
          top: '5vh',
          right: `${dimensions.rightOffset}px`,
          width: `${dimensions.trackWidth}px`,
          height: '90vh',
          zIndex: 1000,
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.3s ease',
          cursor: 'pointer'
        }}
      >
        {/* Dark walnut track */}
        <div 
          ref={trackRef}
          className="walnut-track"
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            background: `
              linear-gradient(180deg, 
                #3C2415 0%, 
                #5D4037 25%, 
                #4A2C2A 50%, 
                #5D4037 75%, 
                #3C2415 100%
              )
            `,
            borderRadius: '1.5px',
            overflow: 'hidden',
            boxShadow: `
              inset 0 0 3px rgba(0,0,0,0.6), 
              0 2px 8px rgba(0,0,0,0.4),
              inset 1px 0 1px rgba(255,255,255,0.1)
            `,
            border: '0.5px solid rgba(60, 36, 21, 0.8)'
          }}
        >
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
                rgba(255, 215, 0, 0.4) 18px,
                rgba(255, 215, 0, 0.4) 19px,
                transparent 19px,
                transparent 36px,
                rgba(255, 215, 0, 0.6) 36px,
                rgba(255, 215, 0, 0.6) 37px
              )
            `
          }} />
          
          {/* Golden cutting line progress */}
          <div 
            ref={cuttingLineRef}
            className="cutting-line"
            style={{
              position: 'absolute',
              bottom: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '1px',
              background: 'linear-gradient(0deg, #FFD700 0%, #FFA500 100%)',
              borderRadius: '0.5px',
              boxShadow: '0 0 4px rgba(255, 215, 0, 0.8), 0 0 8px rgba(255, 165, 0, 0.4)',
              transition: 'height 0.1s ease'
            }}
          />
          
          {/* Circular saw blade */}
          <div 
            ref={sawBladeRef}
            className="circular-saw-blade"
            style={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%) translateY(-50%)',
              width: `${dimensions.sawSize}px`,
              height: `${dimensions.sawSize}px`,
              background: `
                radial-gradient(circle, #E8E8E8 20%, #C0C0C0 40%, #A0A0A0 60%, #808080 80%),
                conic-gradient(from 0deg, 
                  #E8E8E8 0deg, #C0C0C0 45deg, #A0A0A0 90deg, #808080 135deg,
                  #E8E8E8 180deg, #C0C0C0 225deg, #A0A0A0 270deg, #808080 315deg
                )
              `,
              borderRadius: '50%',
              cursor: isDragging ? 'grabbing' : 'grab',
              boxShadow: '0 2px 6px rgba(0,0,0,0.4), inset 0 1px 2px rgba(255, 255, 255, 0.3)',
              zIndex: 10,
              border: '0.5px solid rgba(160, 160, 160, 0.8)'
            }}
          >
            {/* Saw teeth */}
            <div style={{
              position: 'absolute',
              inset: '1px',
              borderRadius: '50%',
              background: `
                conic-gradient(from 0deg, 
                  transparent 8%, #A0A0A0 12%, transparent 16%,
                  transparent 23%, #A0A0A0 27%, transparent 31%,
                  transparent 38%, #A0A0A0 42%, transparent 46%,
                  transparent 53%, #A0A0A0 57%, transparent 61%,
                  transparent 68%, #A0A0A0 72%, transparent 76%,
                  transparent 83%, #A0A0A0 87%, transparent 91%,
                  transparent 98%, #A0A0A0 2%, transparent 6%
                )
              `
            }} />
            
            {/* Center bolt */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '3px',
              height: '3px',
              background: '#808080',
              borderRadius: '50%',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3)'
            }} />
          </div>
          
          {/* Heat glow effect */}
          <div 
            ref={heatGlowRef}
            className="heat-glow"
            style={{
              position: 'absolute',
              left: '50%',
              top: `${scrollProgress}%`,
              transform: 'translateX(-50%) translateY(-50%)',
              width: `${dimensions.sawSize + 8}px`,
              height: `${dimensions.sawSize + 8}px`,
              background: 'radial-gradient(circle, rgba(255, 165, 0, 0.6), rgba(255, 69, 0, 0.3), transparent)',
              borderRadius: '50%',
              opacity: 0,
              pointerEvents: 'none',
              zIndex: 5
            }}
          />
          
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
              zIndex: 8
            }}
          />
        </div>
      </div>

      <style jsx>{`
        .precision-wood-cutter-scrollbar {
          will-change: transform, opacity;
          backface-visibility: hidden;
        }
        
        .walnut-track {
          will-change: transform;
          backface-visibility: hidden;
        }
        
        .circular-saw-blade {
          will-change: transform;
          backface-visibility: hidden;
        }
        
        .cutting-line {
          will-change: height;
          backface-visibility: hidden;
        }
        
        .wood-particle {
          will-change: transform, opacity;
          backface-visibility: hidden;
        }
      `}</style>
    </>
  );
};

export default PrecisionWoodCutterScrollbar;