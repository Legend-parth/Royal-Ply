import React, { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';

interface SmoothScrollProps {
  children: React.ReactNode;
}

const SmoothScroll: React.FC<SmoothScrollProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const scrollSpeed = useRef(0);
  const targetScroll = useRef(0);
  const currentScroll = useRef(0);
  const isScrolling = useRef(false);
  const rafId = useRef<number>();

  const updateScrollBounds = useCallback(() => {
    if (contentRef.current && containerRef.current) {
      const contentHeight = contentRef.current.scrollHeight;
      const containerHeight = containerRef.current.clientHeight;
      setMaxScroll(Math.max(0, contentHeight - containerHeight));
    }
  }, []);

  const smoothScrollTo = useCallback((target: number) => {
    targetScroll.current = Math.max(0, Math.min(target, maxScroll));
  }, [maxScroll]);

  const animate = useCallback(() => {
    const diff = targetScroll.current - currentScroll.current;
    const delta = diff * 0.1; // Smooth easing factor
    
    if (Math.abs(diff) > 0.1) {
      currentScroll.current += delta;
      scrollSpeed.current = delta;
      
      if (contentRef.current) {
        gsap.set(contentRef.current, {
          y: -currentScroll.current,
          force3D: true
        });
      }
      
      setScrollY(currentScroll.current);
      isScrolling.current = true;
      rafId.current = requestAnimationFrame(animate);
    } else {
      currentScroll.current = targetScroll.current;
      scrollSpeed.current = 0;
      isScrolling.current = false;
      
      if (contentRef.current) {
        gsap.set(contentRef.current, {
          y: -currentScroll.current,
          force3D: true
        });
      }
      
      setScrollY(currentScroll.current);
    }
  }, []);

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    
    const delta = e.deltaY;
    const scrollAmount = delta * 1.5; // Adjust scroll sensitivity
    
    smoothScrollTo(targetScroll.current + scrollAmount);
    
    if (!isScrolling.current) {
      animate();
    }
  }, [smoothScrollTo, animate]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const scrollAmount = window.innerHeight * 0.8;
    
    switch (e.key) {
      case 'ArrowDown':
      case 'PageDown':
        e.preventDefault();
        smoothScrollTo(targetScroll.current + scrollAmount);
        break;
      case 'ArrowUp':
      case 'PageUp':
        e.preventDefault();
        smoothScrollTo(targetScroll.current - scrollAmount);
        break;
      case 'Home':
        e.preventDefault();
        smoothScrollTo(0);
        break;
      case 'End':
        e.preventDefault();
        smoothScrollTo(maxScroll);
        break;
    }
    
    if (!isScrolling.current && ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End'].includes(e.key)) {
      animate();
    }
  }, [smoothScrollTo, animate, maxScroll]);

  const handleTouchStart = useRef({ y: 0, time: 0 });
  const handleTouchMove = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    const deltaY = handleTouchStart.current.y - touch.clientY;
    const deltaTime = Date.now() - handleTouchStart.current.time;
    
    if (deltaTime > 0) {
      const velocity = deltaY / deltaTime;
      const scrollAmount = deltaY + (velocity * 100); // Add momentum
      
      smoothScrollTo(targetScroll.current + scrollAmount);
      
      if (!isScrolling.current) {
        animate();
      }
    }
    
    handleTouchStart.current = { y: touch.clientY, time: Date.now() };
  }, [smoothScrollTo, animate]);

  const handleTouchStartEvent = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    handleTouchStart.current = { y: touch.clientY, time: Date.now() };
  }, []);

  useEffect(() => {
    updateScrollBounds();
    
    const resizeObserver = new ResizeObserver(updateScrollBounds);
    if (contentRef.current) {
      resizeObserver.observe(contentRef.current);
    }
    
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleTouchStartEvent, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('resize', updateScrollBounds);
    
    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
      
      resizeObserver.disconnect();
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouchStartEvent);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', updateScrollBounds);
    };
  }, [handleWheel, handleKeyDown, handleTouchMove, handleTouchStartEvent, updateScrollBounds]);

  // Expose scroll methods globally
  useEffect(() => {
    (window as any).smoothScrollTo = smoothScrollTo;
    (window as any).getScrollY = () => currentScroll.current;
    (window as any).getScrollProgress = () => maxScroll > 0 ? currentScroll.current / maxScroll : 0;
  }, [smoothScrollTo, maxScroll]);

  return (
    <div 
      ref={containerRef}
      className="smooth-scroll-container"
      style={{ height: '100vh', overflow: 'hidden' }}
    >
      <div 
        ref={contentRef}
        className="smooth-scroll-content gpu-accelerated"
        style={{ willChange: 'transform' }}
      >
        {children}
      </div>
    </div>
  );
};

export default SmoothScroll;