import React, { useEffect, useRef } from 'react';

const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animationId: number;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (cursorRef.current && trailRef.current) {
        cancelAnimationFrame(animationId);
        animationId = requestAnimationFrame(() => {
          if (cursorRef.current && trailRef.current) {
            cursorRef.current.style.transform = `translate3d(${e.clientX - 10}px, ${e.clientY - 10}px, 0)`;
            trailRef.current.style.transform = `translate3d(${e.clientX - 5}px, ${e.clientY - 5}px, 0)`;
          }
        });
      }
    };

    const handleMouseEnter = () => {
      if (cursorRef.current) {
        cursorRef.current.classList.add('hover');
      }
    };

    const handleMouseLeave = () => {
      if (cursorRef.current) {
        cursorRef.current.classList.remove('hover');
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    const interactiveElements = document.querySelectorAll('.interactive');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  return (
    <>
      <div className="custom-cursor-trail" ref={trailRef}></div>
      <div className="custom-cursor" ref={cursorRef}></div>
    </>
  );
};

export default CustomCursor;