import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { deviceCapabilityDetector } from '../utils/DeviceCapabilityDetector';
import { animate, stagger, createTimeline, onScroll } from 'animejs';
import videoSrc from '../media/PlyStrongLiveLong.mp4';

gsap.registerPlugin(ScrollTrigger);

const HeroSection: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const splineContainerRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  
  const settings = deviceCapabilityDetector.getSettings();

  useEffect(() => {
    const hero = heroRef.current;
    const quote = quoteRef.current;
    const splineContainer = splineContainerRef.current;
    const background = backgroundRef.current;

    if (!hero || !quote) return;

    const tl = gsap.timeline({ delay: 0.5 });

    if (quote) {
      const words = quote.querySelectorAll('.word');
      
      tl.fromTo(words, 
        { 
          opacity: 0, 
          y: 100, 
          rotationX: -90,
          scale: 0.8
        },
        { 
          opacity: 1, 
          y: 0, 
          rotationX: 0,
          scale: 1,
          duration: 1.2, 
          ease: 'back.out(1.7)',
          stagger: 0.15
        }
      );

      if (settings.animations.physics) {
        gsap.to(quote, {
          scale: 1.02,
          duration: 3,
          ease: 'power2.inOut',
          yoyo: true,
          repeat: -1
        });
      }
    }

    if (splineContainer && settings.animations.complex3D) {
      tl.fromTo(splineContainer,
        { 
          opacity: 0, 
          scale: 0.6, 
          rotationY: -45,
          z: -200
        },
        { 
          opacity: 1, 
          scale: 1, 
          rotationY: 0,
          z: 0,
          duration: 1.5, 
          ease: 'power3.out' 
        },
        '-=0.8'
      );
    }

    if (background && settings.animations.parallax) {
      ScrollTrigger.create({
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          gsap.set(background, {
            y: progress * 200,
            opacity: 1 - progress * 0.5,
            force3D: true
          });
        }
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [settings]);

  useEffect(() => {
    if (!settings.features.realTimeEffects) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (quoteRef.current) {
        const rect = quoteRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const deltaX = (e.clientX - centerX) * 0.02;
        const deltaY = (e.clientY - centerY) * 0.02;
        
        gsap.to(quoteRef.current, {
          x: deltaX,
          y: deltaY,
          duration: 0.8,
          ease: 'power2.out'
        });
      }

      if (splineContainerRef.current) {
        const rect = splineContainerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const deltaX = (e.clientX - centerX) * 0.01;
        const deltaY = (e.clientY - centerY) * 0.01;
        
        gsap.to(splineContainerRef.current, {
          rotationY: deltaX,
          rotationX: -deltaY,
          duration: 1,
          ease: 'power2.out'
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [settings.features.realTimeEffects]);

  // Anime.js animations - Beautiful effects for plywood theme
  useEffect(() => {
    // Add safety check to ensure DOM elements exist
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;

    // 1. Staggered word animation with wood-like organic timing
    const wordTimeline = createTimeline({ autoplay: false });
    wordTimeline.add('.hero-quote .word', {
      opacity: [0, 1],
      translateY: [60, 0],
      rotateX: [-90, 0],
      scale: [0.8, 1],
      easing: 'spring(1, 80, 10, 0)',
      duration: 1200,
      delay: stagger(150, { start: 500 })
    });

    // 2. Floating plywood sheets animation (background elements)
    animate('.plywood-sheet', {
      translateY: stagger([-10, 10]),
      translateX: stagger([-5, 5]),
      rotateZ: stagger([-2, 2]),
      scale: stagger([0.95, 1.05]),
      easing: 'easeInOutSine',
      duration: 4000,
      direction: 'alternate',
      loop: true,
      delay: stagger(300)
    });

    // 3. Particle system animation - wood dust effect
    animate('.particle', {
      translateX: () => Math.random() * 100 - 50,
      translateY: () => Math.random() * 100 - 50,
      scale: stagger([0.3, 1.2]),
      opacity: stagger([0.1, 0.8]),
      rotate: () => Math.random() * 360,
      easing: 'easeInOutQuad',
      duration: stagger([2000, 4000]),
      direction: 'alternate',
      loop: true,
      delay: stagger(200)
    });

    // 4. Subtitle entrance with elegant fade and slide
    animate('.hero-subtitle', {
      opacity: [0, 1],
      translateY: [30, 0],
      letterSpacing: ['0.2em', '0.1em'],
      easing: 'easeOutExpo',
      duration: 1500,
      delay: 800
    });

    // 5. CTA button morph animation
    animate('.hero-cta-button', {
      scale: [0.9, 1],
      opacity: [0, 1],
      translateY: [20, 0],
      easing: 'easeOutBack',
      duration: 1000,
      delay: 1200
    });

    // 6. Video container dramatic entrance
    animate('.video-showcase-container', {
      opacity: [0, 1],
      scale: [0.8, 1],
      rotateY: [-15, 0],
      translateZ: [-100, 0],
      easing: 'easeOutCubic',
      duration: 1800,
      delay: 600
    });

    // 7. Wood grain texture animation (background overlay)
    animate('.wood-grain', {
      opacity: stagger([0.1, 0.3]),
      scaleX: stagger([1, 1.1]),
      scaleY: stagger([1, 1.05]),
      easing: 'easeInOutSine',
      duration: 3000,
      direction: 'alternate',
      loop: true,
      delay: stagger(500)
    });

    // 8. Glowing text effect animation
    animate('.hero-quote', {
      textShadow: [
        '0 0 30px rgba(255,255,255,0.8), 0 0 60px rgba(147,51,234,0.6)',
        '0 0 40px rgba(255,255,255,1), 0 0 80px rgba(147,51,234,0.8)',
        '0 0 30px rgba(255,255,255,0.8), 0 0 60px rgba(147,51,234,0.6)'
      ],
      easing: 'easeInOutSine',
      duration: 2000,
      loop: true,
      delay: 2000
    });

    // Trigger word animation
    setTimeout(() => wordTimeline.play(), 100);

    // 9. Advanced ScrollObserver - Parallax wood texture on scroll (Fixed)
    const scrollContainer = document.documentElement || document.body;
    const parallaxElements = document.querySelectorAll('.wood-parallax');
    
    if (parallaxElements.length > 0) {
      animate('.wood-parallax', {
        translateY: ['0px', '-100px'],
        rotate: [0, 5],
        scale: [1, 1.1],
        opacity: [0.3, 0.7],
        easing: 'linear',
        duration: 1000,
        autoplay: onScroll({
          container: scrollContainer,
          debug: false
        })
      });
    }

    // 10. Morphing SVG wood grain patterns (with safety checks)
    const svgPaths = document.querySelectorAll('.wood-svg-path');
    const svgCircles = document.querySelectorAll('.wood-grain-circle');
    
    if (svgPaths.length > 0 && svgCircles.length > 0) {
      const morphTimeline = createTimeline({ loop: true, alternate: true });
      morphTimeline
        .add('.wood-svg-path', {
          d: [
            'M0,50 Q25,25 50,50 T100,50',
            'M0,50 Q25,75 50,50 T100,50',
            'M0,50 Q25,40 50,60 T100,40'
          ],
          easing: 'easeInOutSine',
          duration: 3000
        })
        .add('.wood-grain-circle', {
          r: stagger([3, 8]),
          cx: stagger([10, 90]),
          opacity: stagger([0.1, 0.4]),
          easing: 'easeInOutQuad',
          duration: 2000
        }, '-=1500');
    }

    // 11. Advanced staggered particle system with physics (with safety checks)
    const advancedParticles = document.querySelectorAll('.advanced-particle');
    
    if (advancedParticles.length > 0) {
      animate('.advanced-particle', {
        translateX: stagger([-100, 100]),
        translateY: stagger([-50, 50]),
        rotate: stagger([0, 360]),
        scale: stagger([0.2, 1.5]),
        opacity: stagger([0, 0.8]),
        easing: 'spring(1, 80, 10, 0)',
        duration: stagger([2000, 4000]),
        direction: 'alternate',
        loop: true,
        delay: stagger(100, { grid: [5, 4], from: 'center' })
      });
    }

    // 12. Text morphing animation - Company name reveal (with safety checks)
    const morphingText = document.querySelector('.morphing-text');
    
    if (morphingText) {
      const textMorphTimeline = createTimeline({ loop: true });
      textMorphTimeline
        .add('.morphing-text', {
          innerHTML: [
            'Premium Quality',
            'Ply Strong',
            'Live Long',
            'Build Dreams'
          ],
          easing: 'easeInOutExpo',
          duration: 2000,
          delay: 1000
        });
    }

    // 13. Interactive hover trail effect
    let mouseTrail: HTMLDivElement[] = [];
    const createMouseTrail = (e: MouseEvent) => {
      const trail = document.createElement('div');
      trail.className = 'mouse-trail';
      trail.style.cssText = `
        position: fixed;
        left: ${e.clientX}px;
        top: ${e.clientY}px;
        width: 4px;
        height: 4px;
        background: radial-gradient(circle, rgba(139,69,19,0.8) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
      `;
      document.body.appendChild(trail);
      mouseTrail.push(trail);

      animate(trail, {
        scale: [0, 1, 0],
        opacity: [0, 0.8, 0],
        rotate: [0, 180],
        easing: 'easeOutQuad',
        duration: 1000,
        complete: () => {
          if (document.body.contains(trail)) {
            document.body.removeChild(trail);
          }
          mouseTrail = mouseTrail.filter(t => t !== trail);
        }
      });
    };

    document.addEventListener('mousemove', createMouseTrail);

    // 14. Breathing/Pulsing animation for CTA button
    animate('.hero-cta-button', {
      scale: [1, 1.02, 1],
      boxShadow: [
        '0 10px 30px rgba(147, 51, 234, 0.4)',
        '0 15px 40px rgba(147, 51, 234, 0.6)',
        '0 10px 30px rgba(147, 51, 234, 0.4)'
      ],
      easing: 'easeInOutSine',
      duration: 2000,
      loop: true,
      delay: 2000
    });

    // 15. Advanced Timeline - Orchestrated sequence
    const masterTimeline = createTimeline({ loop: false });
    masterTimeline
      .add('.hero-left', {
        opacity: [0, 1],
        translateX: [-100, 0],
        easing: 'easeOutExpo',
        duration: 1000
      })
      .add('.hero-right', {
        opacity: [0, 1],
        translateX: [100, 0],
        rotateY: [15, 0],
        easing: 'easeOutExpo',
        duration: 1000
      }, '-=500')
      .add('.floating-elements', {
        opacity: [0, 1],
        scale: [0, 1],
        rotate: stagger([0, 360]),
        easing: 'easeOutBack',
        duration: 1500,
        delay: stagger(200)
      }, '-=800');

    // 16. Wood texture scanner effect
    animate('.scanner-line', {
      translateX: ['-100%', '100%'],
      opacity: [0, 1, 0],
      easing: 'easeInOutQuad',
      duration: 3000,
      loop: true,
      delay: 1000
    });

    // Cleanup function
    return () => {
      document.removeEventListener('mousemove', createMouseTrail);
      mouseTrail.forEach(trail => {
        if (document.body.contains(trail)) {
          document.body.removeChild(trail);
        }
      });
    };

  }, []);

  // Generate plywood sheet elements for animation
  const generatePlywoodSheets = () => {
    return Array.from({ length: 8 }, (_, i) => (
      <div 
        key={i} 
        className="plywood-sheet absolute pointer-events-none"
        style={{ 
          width: `${20 + Math.random() * 40}px`,
          height: `${8 + Math.random() * 16}px`,
          backgroundColor: 'rgba(139, 69, 19, 0.1)',
          border: '1px solid rgba(139, 69, 19, 0.2)',
          borderRadius: '2px',
          left: `${Math.random() * 100}%`, 
          top: `${Math.random() * 100}%`,
          transform: `rotate(${Math.random() * 45 - 22.5}deg)`
        }} 
      />
    ));
  };

  // Generate advanced particle system
  const generateAdvancedParticles = () => {
    return Array.from({ length: 20 }, (_, i) => (
      <div 
        key={i} 
        className="advanced-particle absolute pointer-events-none"
        style={{ 
          width: `${3 + Math.random() * 6}px`,
          height: `${3 + Math.random() * 6}px`,
          background: `radial-gradient(circle, rgba(139, 69, 19, ${0.2 + Math.random() * 0.3}), transparent)`,
          borderRadius: '50%',
          left: `${Math.random() * 100}%`, 
          top: `${Math.random() * 100}%`
        }} 
      />
    ));
  };

  // Generate wood parallax elements
  const generateWoodParallax = () => {
    return Array.from({ length: 6 }, (_, i) => (
      <div 
        key={i} 
        className="wood-parallax absolute pointer-events-none"
        style={{ 
          width: `${40 + Math.random() * 80}px`,
          height: `${20 + Math.random() * 40}px`,
          background: `linear-gradient(${Math.random() * 180}deg, 
            rgba(139, 69, 19, 0.1), 
            rgba(101, 67, 33, 0.2), 
            rgba(139, 69, 19, 0.1))`,
          borderRadius: '4px',
          left: `${Math.random() * 100}%`, 
          top: `${Math.random() * 100}%`,
          transform: `rotate(${Math.random() * 45 - 22.5}deg)`
        }} 
      />
    ));
  };

  // Generate floating elements for timeline
  const generateFloatingElements = () => {
    return Array.from({ length: 12 }, (_, i) => (
      <div 
        key={i} 
        className="floating-elements absolute pointer-events-none"
        style={{ 
          width: `${8 + Math.random() * 16}px`,
          height: `${8 + Math.random() * 16}px`,
          background: `rgba(147, 51, 234, ${0.1 + Math.random() * 0.2})`,
          borderRadius: Math.random() > 0.5 ? '50%' : '2px',
          left: `${Math.random() * 100}%`, 
          top: `${Math.random() * 100}%`,
          border: '1px solid rgba(147, 51, 234, 0.3)'
        }} 
      />
    ));
  };

  // Generate random positions for particles
  const generateParticles = () => {
    return Array.from({ length: 20 }, (_, i) => (
      <div 
        key={i} 
        className="particle absolute bg-purple-500/20 rounded-full" 
        style={{ 
          width: '4px', 
          height: '4px', 
          left: `${Math.random() * 100}%`, 
          top: `${Math.random() * 100}%` 
        }} 
      />
    ));
  };

  return (
    <section 
      ref={heroRef}
      className="hero-section relative min-h-screen flex items-center overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #331a00 0%, #1a0033 50%, #331a00 100%)' // Adjusted for wood tones camouflage
      }}
    >
      <div 
        ref={backgroundRef}
        className="absolute inset-0 opacity-30"
        style={{
          background: `
            radial-gradient(circle at 20% 80%, rgba(147, 51, 234, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(79, 70, 229, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(139, 69, 19, 0.3) 0%, transparent 50%)
          `
        }}
      />

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {generateParticles()}
            {generatePlywoodSheets()}
            {generateAdvancedParticles()}
            {generateWoodParallax()}
            {generateFloatingElements()}
            
            {/* SVG Wood Grain Morphing */}
            <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100">
              <path 
                className="wood-svg-path" 
                d="M0,50 Q25,25 50,50 T100,50" 
                stroke="rgba(139, 69, 19, 0.3)" 
                strokeWidth="0.5" 
                fill="none"
              />
              <circle className="wood-grain-circle" cx="20" cy="30" r="3" fill="rgba(139, 69, 19, 0.2)" />
              <circle className="wood-grain-circle" cx="70" cy="70" r="5" fill="rgba(139, 69, 19, 0.1)" />
              <circle className="wood-grain-circle" cx="50" cy="20" r="4" fill="rgba(139, 69, 19, 0.15)" />
            </svg>
            
            {/* Scanner Line Effect */}
            <div 
              className="scanner-line absolute top-0 h-full w-1 pointer-events-none"
              style={{
                background: 'linear-gradient(to bottom, transparent, rgba(147, 51, 234, 0.6), transparent)',
                filter: 'blur(1px)'
              }}
            />
          </div>
          
          <div className="hero-left text-center lg:text-left">
            {/* Morphing text element */}
            <div 
              className="morphing-text text-sm text-purple-300 mb-2 font-light tracking-widest"
              style={{ minHeight: '20px' }}
            >
              Premium Quality
            </div>
            <div 
              ref={quoteRef}
              className="hero-quote relative"
              style={{
                fontFamily: 'Orbitron, monospace',
                fontSize: 'clamp(3rem, 8vw, 8rem)',
                fontWeight: 900,
                lineHeight: 0.9,
                color: '#FFFFFF',
                textShadow: '0 0 30px rgba(255,255,255,0.8), 0 0 60px rgba(147,51,234,0.6), 2px 2px 4px rgba(0,0,0,0.8), 0 0 100px rgba(147,51,234,0.3)',
                marginBottom: '2rem',
                position: 'relative',
                zIndex: 100,
                filter: 'contrast(1.2) brightness(1.1)',
                WebkitFontSmoothing: 'antialiased'
              }}
            >
              <span className="word inline-block">Ply</span>{' '}
              <span className="word inline-block">Strong,</span>
              <br />
              <span className="word inline-block">Live</span>{' '}
              <span className="word inline-block">Long.</span>
              
              {settings.features.realTimeEffects && (
                <div 
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'radial-gradient(ellipse 120% 50% at 50% 50%, rgba(147, 51, 234, 0.1), transparent)',
                    filter: 'blur(20px)',
                    zIndex: -1
                  }}
                />
              )}
            </div>

            <div 
              className="hero-subtitle"
              style={{
                fontSize: 'clamp(1rem, 3vw, 1.5rem)',
                color: 'rgba(255, 255, 255, 0.8)',
                fontWeight: 300,
                letterSpacing: '0.1em',
                marginBottom: '3rem'
              }}
            >
              Building Dreams, One Sheet at a Time
            </div>

            <button 
              className="hero-cta-button interactive"
              style={{
                padding: '1rem 3rem',
                fontSize: '1.2rem',
                fontWeight: 600,
                background: 'linear-gradient(135deg, #9333ea, #6366f1)',
                border: 'none',
                borderRadius: '50px',
                color: '#ffffff',
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                boxShadow: '0 10px 30px rgba(147, 51, 234, 0.4)',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                if (settings.animations.morphing) {
                  gsap.to(e.currentTarget, {
                    scale: 1.05,
                    y: -3,
                    boxShadow: '0 20px 40px rgba(147, 51, 234, 0.6)',
                    duration: 0.3,
                    ease: 'power2.out'
                  });
                }
              }}
              onMouseLeave={(e) => {
                if (settings.animations.morphing) {
                  gsap.to(e.currentTarget, {
                    scale: 1,
                    y: 0,
                    boxShadow: '0 10px 30px rgba(147, 51, 234, 0.4)',
                    duration: 0.3,
                    ease: 'power2.out'
                  });
                }
              }}
            >
              Explore Premium Quality
            </button>
          </div>
          
          <div className="hero-right relative">
            <div 
              ref={splineContainerRef}
              className="video-showcase-container relative"
              style={{
                position: 'relative',
                width: '100%',
                height: 'auto',
                aspectRatio: '16/9',
                borderRadius: '12px',
                overflow: 'hidden',
                background: 'linear-gradient(135deg, rgba(51,26,0,0.8) 0%, rgba(26,0,51,0.6) 50%, rgba(51,26,0,0.8) 100%)',
                boxShadow: '0 0 40px rgba(147, 51, 234, 0.3), 0 0 80px rgba(79, 70, 229, 0.2), inset 0 0 60px rgba(139,69,19,0.3)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(139, 69, 19, 0.2)'
              }}
              >
              <video 
                src={videoSrc} 
                className="video-content"
                autoPlay 
                loop 
                muted 
                playsInline
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                  filter: 'brightness(1) contrast(1.1) saturate(1)'
                }}
              />
              <div 
                className="video-overlay"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(45deg, rgba(139,69,19,0.1) 0%, transparent 30%, transparent 70%, rgba(79,70,229,0.05) 100%)',
                  pointerEvents: 'none'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .hero-section {
          will-change: transform;
          backface-visibility: hidden;
        }
        
        .hero-quote .word {
          will-change: transform, opacity;
          backface-visibility: hidden;
          display: inline-block;
          transform-origin: 50% 100%;
        }
        
        .particle {
          will-change: transform, opacity;
          backface-visibility: hidden;
        }
        
        .plywood-sheet {
          will-change: transform;
          backface-visibility: hidden;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .wood-grain {
          will-change: transform, opacity;
          backface-visibility: hidden;
        }
        
        .advanced-particle {
          will-change: transform, opacity;
          backface-visibility: hidden;
        }
        
        .wood-parallax {
          will-change: transform, opacity;
          backface-visibility: hidden;
        }
        
        .floating-elements {
          will-change: transform, opacity;
          backface-visibility: hidden;
        }
        
        .morphing-text {
          will-change: transform;
          backface-visibility: hidden;
        }
        
        .scanner-line {
          will-change: transform, opacity;
          backface-visibility: hidden;
        }
        
        .wood-svg-path {
          will-change: d;
        }
        
        .wood-grain-circle {
          will-change: r, cx, opacity;
        }
        
        .hero-left, .hero-right {
          will-change: transform, opacity;
          backface-visibility: hidden;
        }
        
        .video-showcase-container {
          will-change: transform;
          backface-visibility: hidden;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .video-showcase-container:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 60px rgba(147, 51, 234, 0.4), 0 0 120px rgba(79, 70, 229, 0.3), inset 0 0 80px rgba(0,0,0,0.2);
        }
        
        .video-content {
          transition: filter 0.3s ease;
        }
        
        .video-showcase-container:hover .video-content {
          filter: brightness(1) contrast(1.15) saturate(1);
        }
        
        @media (max-width: 768px) {
          .video-showcase-container {
            aspect-ratio: 16/9;
            max-height: 50vh;
            border-radius: 8px;
          }
        }
        
        @media (min-width: 1024px) {
          .video-showcase-container {
            max-height: 60vh;
            border-radius: 16px;
          }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
