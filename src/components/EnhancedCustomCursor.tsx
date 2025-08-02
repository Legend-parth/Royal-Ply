import React, { useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { useAdaptiveAnimation } from './AdaptiveAnimationProvider';
import { useBreakpoint } from './ResponsiveBreakpoints';
import { animationQueue } from '../utils/animationQueue';

const EnhancedCustomCursor: React.FC = () => {
  const { isMobile } = useBreakpoint();
  
  // Disable custom cursor on mobile devices
  if (isMobile) {
    return null;
  }

  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mousePosition = useRef({ x: 0, y: 0 });
  const isHovering = useRef(false);
  const rafId = useRef<number>();
  const { shouldUseAnimation, config } = useAdaptiveAnimation();

  
  const updateCursor = useCallback(() => {
    if (cursorRef.current && ringRef.current && shouldUseAnimation('basic')) {
      // Update cursor position
      gsap.set(cursorRef.current, {
        x: mousePosition.current.x - 10,
        y: mousePosition.current.y - 10,
        force3D: true
      });
      
      // Update ring position - centered on cursor
      gsap.set(ringRef.current, {
        x: mousePosition.current.x - 10,
        y: mousePosition.current.y - 10,
        force3D: true
      });
    }
    
    rafId.current = requestAnimationFrame(updateCursor);
  }, [shouldUseAnimation]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mousePosition.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleMouseEnter = useCallback((e: MouseEvent) => {
    if (!shouldUseAnimation('advanced')) return;
    
    const target = e.target as HTMLElement;
    
    if (target.classList.contains('interactive')) {
      isHovering.current = true;
      
      if (ringRef.current) {
        // Show ring and animate scale
        gsap.set(ringRef.current, {
          opacity: 1,
          scale: 1
        });
        
        gsap.to(ringRef.current, {
          scale: 1.2,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
      
      if (cursorRef.current) {
        gsap.to(cursorRef.current, {
          scale: 0.5,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    }
  }, [shouldUseAnimation, config]);

  const handleMouseLeave = useCallback(() => {
    if (!shouldUseAnimation('advanced')) return;
    
    isHovering.current = false;
    
    if (ringRef.current) {
      gsap.to(ringRef.current, {
        scale: 1,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
    
    if (cursorRef.current) {
      gsap.to(cursorRef.current, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  }, [shouldUseAnimation, config]);

  const handleClick = useCallback(() => {
    if (!shouldUseAnimation('basic')) return;
    
    if (cursorRef.current && ringRef.current) {
      // Click ripple effect
      gsap.to(cursorRef.current, {
        scale: 1.5,
        duration: 0.1,
        ease: 'power2.out',
        yoyo: true,
        repeat: 1
      });
      
      if (isHovering.current) {
        gsap.to(ringRef.current, {
          scale: 1.8,
          duration: 0.2,
          ease: 'power2.out',
          yoyo: true,
          repeat: 1
        });
      }
    }
  }, [shouldUseAnimation]);

  useEffect(() => {
    if (!shouldUseAnimation('basic')) return;
    
    // Add cursor initialization to animation queue
    animationQueue.add({
      id: 'cursor-initialization',
      element: cursorRef.current as HTMLElement,
      priority: 'low',
      maxRetries: 1,
      animation: async () => {
        return new Promise<void>((resolve) => {
          if (cursorRef.current && ringRef.current) {
            gsap.fromTo([cursorRef.current, ringRef.current], 
              { opacity: 0, scale: 0 },
              { 
                opacity: 1, 
                scale: 1, 
                duration: 0.5, 
                ease: 'back.out(1.7)',
                onComplete: resolve
              }
            );
          } else {
            resolve();
          }
        });
      }
    });
    
    // Start cursor animation loop
    updateCursor();
    
    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);
    
    // Add hover listeners to interactive elements
    const addHoverListeners = () => {
      const interactiveElements = document.querySelectorAll('.interactive');
      interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', handleMouseEnter as EventListener);
        el.addEventListener('mouseleave', handleMouseLeave);
      });
    };
    
    // Initial setup
    addHoverListeners();
    
    // Re-add listeners when new elements are added
    const observer = new MutationObserver(addHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });
    
    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
      
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      
      const interactiveElements = document.querySelectorAll('.interactive');
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter as EventListener);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
      
      observer.disconnect();
    };
  }, [updateCursor, handleMouseMove, handleClick, handleMouseEnter, handleMouseLeave, shouldUseAnimation]);

  return (
    <>
      <div className="custom-cursor" ref={cursorRef} />
      <div className="custom-cursor-ring" ref={ringRef} />
    </>
  );
};

export default EnhancedCustomCursor;