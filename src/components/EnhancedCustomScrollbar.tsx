import React, { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';

const EnhancedCustomScrollbar: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const scrollbarRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const particlePool = useRef<HTMLDivElement[]>([]);

  const createParticle = useCallback(() => {
    const particle = document.createElement('div');
    particle.className = 'scrollbar-particle';
    particle.style.left = `${Math.random() * 20 - 10}px`;
    particle.style.animationDelay = `${Math.random() * 2}s`;
    return particle;
  }, []);

  const updateParticles = useCallback(() => {
    if (!particlesRef.current) return;
    
    // Create particle trail effect
    const particle = particlePool.current.pop() || createParticle();
    particle.style.bottom = `${scrollProgress}%`;
    particle.style.opacity = '1';
    
    particlesRef.current.appendChild(particle);
    
    // Remove particle after animation
    setTimeout(() => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
        particlePool.current.push(particle);
      }
    }, 2000);
  }, [scrollProgress, createParticle]);

  const handleScroll = useCallback(() => {
    const scrollTop = (window as any).getScrollY?.() || window.pageYOffset || document.documentElement.scrollTop;
    const progress = (window as any).getScrollProgress?.() || 0;
    
    setScrollProgress(progress * 100);
    setIsVisible(scrollTop > 50);
    
    // Update thumb position with smooth animation
    if (thumbRef.current) {
      gsap.to(thumbRef.current, {
        top: `${progress * 100}%`,
        duration: 0.1,
        ease: 'none'
      });
    }
    
    // Create particles during scroll
    if (Math.random() < 0.3) {
      updateParticles();
    }
  }, [updateParticles]);

  const handleClick = useCallback((e: MouseEvent) => {
    if (!scrollbarRef.current) return;
    
    const rect = scrollbarRef.current.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const scrollbarHeight = rect.height;
    const targetProgress = Math.max(0, Math.min(1, clickY / scrollbarHeight));
    
    // Use smooth scroll function if available
    if ((window as any).smoothScrollTo) {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      (window as any).smoothScrollTo(targetProgress * maxScroll);
    } else {
      window.scrollTo({
        top: targetProgress * (document.documentElement.scrollHeight - window.innerHeight),
        behavior: 'smooth'
      });
    }
    
    // Create click effect
    const clickEffect = document.createElement('div');
    clickEffect.style.position = 'absolute';
    clickEffect.style.top = `${clickY}px`;
    clickEffect.style.left = '50%';
    clickEffect.style.transform = 'translateX(-50%)';
    clickEffect.style.width = '20px';
    clickEffect.style.height = '20px';
    clickEffect.style.background = 'radial-gradient(circle, var(--electric-indigo), transparent)';
    clickEffect.style.borderRadius = '50%';
    clickEffect.style.pointerEvents = 'none';
    clickEffect.style.animation = 'click-ripple 0.6s ease-out forwards';
    
    scrollbarRef.current.appendChild(clickEffect);
    
    setTimeout(() => {
      if (clickEffect.parentNode) {
        clickEffect.parentNode.removeChild(clickEffect);
      }
    }, 600);
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    
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
    setIsHovered(false);
    
    if (scrollbarRef.current) {
      gsap.to(scrollbarRef.current, {
        width: 2,
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
  }, []);

  useEffect(() => {
    // Initialize particle pool
    for (let i = 0; i < 10; i++) {
      particlePool.current.push(createParticle());
    }
    
    // Add CSS for click ripple effect
    const style = document.createElement('style');
    style.textContent = `
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
    `;
    document.head.appendChild(style);
    
    window.addEventListener('scroll', handleScroll);
    
    if (scrollbarRef.current) {
      scrollbarRef.current.addEventListener('click', handleClick);
      scrollbarRef.current.addEventListener('mouseenter', handleMouseEnter);
      scrollbarRef.current.addEventListener('mouseleave', handleMouseLeave);
    }
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollbarRef.current) {
        scrollbarRef.current.removeEventListener('click', handleClick);
        scrollbarRef.current.removeEventListener('mouseenter', handleMouseEnter);
        scrollbarRef.current.removeEventListener('mouseleave', handleMouseLeave);
      }
      document.head.removeChild(style);
    };
  }, [handleScroll, handleClick, handleMouseEnter, handleMouseLeave, createParticle]);

  return (
    <div 
      ref={scrollbarRef}
      className={`custom-scrollbar ${isVisible ? 'visible' : ''}`}
    >
      <div 
        ref={progressRef}
        className="custom-scrollbar-progress"
        style={{ height: `${scrollProgress}%` }}
      />
      
      <div 
        ref={thumbRef}
        className="custom-scrollbar-thumb"
        style={{ 
          top: `${scrollProgress}%`,
          height: Math.max(20, (window.innerHeight / Math.max(document.documentElement.scrollHeight, window.innerHeight)) * 100) + '%',
          transform: 'translateY(-50%)'
        }}
      />
      
      <div 
        ref={particlesRef}
        className="custom-scrollbar-particles"
      />
    </div>
  );
};

export default EnhancedCustomScrollbar;