import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { deviceCapabilityDetector } from '../utils/DeviceCapabilityDetector';

gsap.registerPlugin(ScrollTrigger);

const HeroSection: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const splineContainerRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  
  const settings = deviceCapabilityDetector.getSettings();
  const capabilities = deviceCapabilityDetector.getCapabilities();

  useEffect(() => {
    const hero = heroRef.current;
    const quote = quoteRef.current;
    const splineContainer = splineContainerRef.current;
    const background = backgroundRef.current;

    if (!hero || !quote) return;

    // Enhanced entrance animations
    const tl = gsap.timeline({ delay: 0.5 });

    // Quote animation with breathing effect
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

      // Breathing effect for the quote
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

    // Video container animation
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

    // Background parallax effect
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

  // Mouse parallax effect
  useEffect(() => {
    if (!settings.features.realTimeEffects) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });

      // Parallax effect for quote
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

      // Parallax effect for video container
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
    return () => window.removeEventListener('mousemove', handleMouseLeave);
  }, [settings.features.realTimeEffects]);

  return (
    <section 
      ref={heroRef}
      className="hero-section relative min-h-screen flex items-center overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #000000 0%, #1a0033 50%, #000000 100%)'
      }}
    >
      {/* Animated background */}
      <div 
        ref={backgroundRef}
        className="absolute inset-0 opacity-30"
        style={{
          background: `
            radial-gradient(circle at 20% 80%, rgba(147, 51, 234, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(79, 70, 229, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(139, 69, 19, 0.1) 0%, transparent 50%)
          `
        }}
      />

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen">
          
          {/* Left Side - Quote */}
          <div className="hero-left text-center lg:text-left">
            <div 
              ref={quoteRef}
              className="hero-quote relative"
              style={{
                fontFamily: 'Orbitron, monospace',
                fontSize: 'clamp(3rem, 8vw, 8rem)',
                fontWeight: 900,
                lineHeight: 0.9,
                color: '#FFFFFF',
                textShadow: `
                  0 0 30px rgba(255,255,255,0.8), 
                  0 0 60px rgba(147,51,234,0.6),
                  2px 2px 4px rgba(0,0,0,0.8),
                  0 0 100px rgba(147,51,234,0.3)
                `,
                marginBottom: '2rem',
                position: 'relative',
                zIndex: 100,
                filter: 'contrast(1.2) brightness(1.1)',
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale'
              }}
            >
              <span className="word inline-block">Ply</span>{' '}
              <span className="word inline-block">Strong,</span>
              <br />
              <span className="word inline-block">Live</span>{' '}
              <span className="word inline-block">Long.</span>
              
              {/* Subtle glow effect */}
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

            {/* Subtitle */}
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

            {/* CTA Button */}
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
          
          // Right Side - Video Container (Updated)
          <div className="hero-right relative">
            <div 
              ref={splineContainerRef}
              className="video-showcase-container relative"
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '100%',
                aspectRatio: '16/9',
                borderRadius: '12px',
                overflow: 'hidden',
                background: 'linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(26,0,51,0.6) 50%, rgba(0,0,0,0.8) 100%)',
                boxShadow: `
                  0 0 40px rgba(147, 51, 234, 0.3),
                  0 0 80px rgba(79, 70, 229, 0.2),
                  inset 0 0 60px rgba(0,0,0,0.3)
                `,
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(147, 51, 234, 0.2)'
              }}
            >
              {/* Video Element with Theme Integration */}
              <video 
                src="/src/media/PlyStrongLiveLong.mp4" 
                className="video-content"
                autoPlay 
                loop 
                muted 
                playsInline
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                  filter: 'brightness(0.9) contrast(1.1) saturate(0.9)',
                  mixBlendMode: 'normal'
                }}
                aria-label="Plywood manufacturing process showcase"
              />
              
              {/* Subtle overlay for theme blending */}
              <div 
                className="video-overlay"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(45deg, rgba(147,51,234,0.05) 0%, transparent 30%, transparent 70%, rgba(79,70,229,0.05) 100%)',
                  pointerEvents: 'none'
                }}
              />
            </div>
          </div>
          
          // Updated responsive sizing
          const videoContainerStyle = {
            height: capabilities.isMobile ? 'auto' : 'auto',
            maxHeight: capabilities.isMobile ? '50vh' : '60vh',
            width: '100%',
            maxWidth: capabilities.isMobile ? '100%' : '100%'
          };
        </div>
      </div>

      <style jsx>{`
        .hero-section {
          will-change: transform;
          backface-visibility: hidden;
        }
        
        .hero-quote .word {
          will-change: transform, opacity;
          backface-visibility: hidden;
        }
        
        .spline-container {
          will-change: transform;
          backface-visibility: hidden;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;