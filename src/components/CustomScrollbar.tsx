import React, { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';

const CustomScrollbar: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const scrollbarRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const getScrollData = useCallback(() => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    return { scrollTop, scrollHeight, progress: Math.min(Math.max(progress, 0), 100) };
  }, []);

  const updateScrollbar = useCallback(() => {
    const { scrollTop, progress } = getScrollData();
    setScrollProgress(progress);
    setIsVisible(scrollTop > 50);

    // Update thumb position
    if (thumbRef.current) {
      gsap.set(thumbRef.current, {
        top: `${progress}%`,
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
  }, [getScrollData]);

  const smoothScrollTo = useCallback((targetProgress: number) => {
    const { scrollHeight } = getScrollData();
    const targetScrollTop = (targetProgress / 100) * scrollHeight;
    
    gsap.to(window, {
      scrollTo: { y: targetScrollTop },
      duration: 1,
      ease: 'power2.out'
    });
  }, [getScrollData]);

  const handleTrackClick = useCallback((e: MouseEvent) => {
    if (!trackRef.current || isDragging) return;
    
    const rect = trackRef.current.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const trackHeight = rect.height;
    const targetProgress = Math.max(0, Math.min(100, (clickY / trackHeight) * 100));
    
    smoothScrollTo(targetProgress);

    // Create click ripple effect
    const ripple = document.createElement('div');
    ripple.className = 'scrollbar-ripple';
    ripple.style.position = 'absolute';
    ripple.style.top = `${clickY}px`;
    ripple.style.left = '50%';
    ripple.style.transform = 'translateX(-50%)';
    ripple.style.width = '20px';
    ripple.style.height = '20px';
    ripple.style.background = 'radial-gradient(circle, var(--electric-indigo), transparent)';
    ripple.style.borderRadius = '50%';
    ripple.style.pointerEvents = 'none';
    ripple.style.animation = 'scrollbar-ripple 0.6s ease-out forwards';
    
    trackRef.current.appendChild(ripple);
    
    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    }, 600);
  }, [isDragging, smoothScrollTo]);

  const handleThumbMouseDown = useCallback((e: MouseEvent) => {
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
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [scrollProgress, smoothScrollTo]);

  const handleMouseEnter = useCallback(() => {
    if (scrollbarRef.current) {
      gsap.to(scrollbarRef.current, {
        width: 6,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
    
    if (thumbRef.current) {
      gsap.to(thumbRef.current, {
        width: 12,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!isDragging) {
      if (scrollbarRef.current) {
        gsap.to(scrollbarRef.current, {
          width: 4,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
      
      if (thumbRef.current) {
        gsap.to(thumbRef.current, {
          width: 8,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    }
  }, [isDragging]);

  useEffect(() => {
    // Add CSS for ripple effect
    const style = document.createElement('style');
    style.textContent = `
      @keyframes scrollbar-ripple {
        0% {
          transform: translateX(-50%) scale(0);
          opacity: 1;
        }
        100% {
          transform: translateX(-50%) scale(3);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);

    // Event listeners
    window.addEventListener('scroll', updateScrollbar, { passive: true });
    window.addEventListener('resize', updateScrollbar);
    
    if (trackRef.current) {
      trackRef.current.addEventListener('click', handleTrackClick);
      trackRef.current.addEventListener('mouseenter', handleMouseEnter);
      trackRef.current.addEventListener('mouseleave', handleMouseLeave);
    }
    
    if (thumbRef.current) {
      thumbRef.current.addEventListener('mousedown', handleThumbMouseDown);
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
      
      if (thumbRef.current) {
        thumbRef.current.removeEventListener('mousedown', handleThumbMouseDown);
      }
      
      document.head.removeChild(style);
    };
  }, [updateScrollbar, handleTrackClick, handleThumbMouseDown, handleMouseEnter, handleMouseLeave]);

  return (
    <div 
      ref={scrollbarRef}
      className={`custom-scrollbar ${isVisible ? 'visible' : ''}`}
    >
      <div 
        ref={trackRef}
        className="custom-scrollbar-track"
      >
        <div 
          ref={progressRef}
          className="custom-scrollbar-progress"
        />
        
        <div 
          ref={thumbRef}
          className={`custom-scrollbar-thumb ${isDragging ? 'dragging' : ''}`}
          style={{ 
            top: `${scrollProgress}%`,
            height: Math.max(20, (window.innerHeight / Math.max(document.documentElement.scrollHeight, window.innerHeight)) * 100) + '%',
            transform: 'translateY(-50%)'
          }}
        />
      </div>
    </div>
  );
};

export default CustomScrollbar;