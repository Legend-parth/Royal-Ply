import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useInView } from 'react-intersection-observer';
import { useAdaptiveAnimation } from './AdaptiveAnimationProvider';
import { animationQueue } from '../utils/animationQueue';

gsap.registerPlugin(ScrollTrigger);

const EnhancedStressTest: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const weightRef = useRef<HTMLDivElement>(null);
  const plywoodRef = useRef<HTMLDivElement>(null);
  const gaugeRef = useRef<HTMLDivElement>(null);
  const gaugeNeedleRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  
  const [testPhase, setTestPhase] = useState<'idle' | 'dropping' | 'impact' | 'success'>('idle');
  const { ref, inView } = useInView({ threshold: 0.5, triggerOnce: true });
  const { shouldUseAnimation, config } = useAdaptiveAnimation();

  const createImpactParticles = () => {
    if (!particlesRef.current || !shouldUseAnimation('advanced')) return;

    // Create dust particles
    for (let i = 0; i < config.particleCount / 5; i++) {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: absolute;
        width: ${2 + Math.random() * 3}px;
        height: ${2 + Math.random() * 3}px;
        background: #8B4513;
        border-radius: 50%;
        left: 50%;
        top: 100%;
        pointer-events: none;
      `;

      particlesRef.current.appendChild(particle);

      gsap.to(particle, {
        x: (Math.random() - 0.5) * 100,
        y: -Math.random() * 50 - 20,
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

    // Create small debris
    if (shouldUseAnimation('complex')) {
      for (let i = 0; i < 3; i++) {
        const debris = document.createElement('div');
        debris.style.cssText = `
          position: absolute;
          width: ${1 + Math.random() * 2}px;
          height: ${3 + Math.random() * 4}px;
          background: #A0522D;
          left: 50%;
          top: 100%;
          pointer-events: none;
        `;

        particlesRef.current.appendChild(debris);

        gsap.to(debris, {
          x: (Math.random() - 0.5) * 80,
          y: -Math.random() * 40 - 15,
          rotation: Math.random() * 360,
          opacity: 0,
          duration: 1.5 + Math.random(),
          ease: 'power2.out',
          onComplete: () => {
            if (debris.parentNode) {
              debris.parentNode.removeChild(debris);
            }
          }
        });
      }
    }
  };

  const runStressTest = () => {
    if (!weightRef.current || !plywoodRef.current || !gaugeNeedleRef.current) return;

    // Add stress test animation to queue
    animationQueue.add({
      id: 'stress-test-sequence',
      element: containerRef.current!,
      priority: 'medium',
      maxRetries: 2,
      animation: async () => {
        return new Promise<void>((resolve) => {
          const tl = gsap.timeline({
            onComplete: resolve
          });

          // Phase 1: Weight dropping
          tl.add(() => setTestPhase('dropping'));
          tl.fromTo(weightRef.current, 
            { y: -150, rotation: 0 },
            { 
              y: 0, 
              rotation: 360,
              duration: config.animationDuration * 1.5,
              ease: 'power2.in'
            }
          );

          // Phase 2: Impact and plywood bending
          tl.add(() => setTestPhase('impact'));
          
          // Plywood bending animation with realistic physics
          tl.to(plywoodRef.current, {
            scaleY: 0.85,
            transformOrigin: 'center bottom',
            duration: config.animationDuration * 0.3,
            ease: 'power2.out'
          }, '-=0.1');

          // Gauge pressure increase with realistic physics
          tl.to(gaugeNeedleRef.current, {
            rotation: 120,
            duration: config.animationDuration * 0.5,
            ease: 'power2.out'
          }, '-=0.3');

          // Create impact particles
          tl.add(() => createImpactParticles(), '-=0.2');

          // Weight bounce with realistic physics
          tl.to(weightRef.current, {
            y: -20,
            duration: config.animationDuration * 0.4,
            ease: 'power2.out'
          });

          tl.to(weightRef.current, {
            y: 0,
            duration: config.animationDuration * 0.3,
            ease: 'bounce.out'
          });

          // Plywood recovery with elastic bounce
          tl.to(plywoodRef.current, {
            scaleY: 1,
            duration: config.animationDuration * 0.6,
            ease: 'elastic.out(1, 0.5)'
          }, '-=0.5');

          // Gauge reset
          tl.to(gaugeNeedleRef.current, {
            rotation: 0,
            duration: config.animationDuration * 0.8,
            ease: 'power2.out'
          }, '-=0.4');

          // Phase 3: Success indication
          tl.add(() => setTestPhase('success'));
          
          if (successRef.current && shouldUseAnimation('basic')) {
            tl.fromTo(successRef.current,
              { scale: 0, opacity: 0 },
              { 
                scale: 1, 
                opacity: 1,
                duration: config.animationDuration * 0.8,
                ease: 'back.out(1.7)'
              }
            );

            // Success text animation
            tl.to(successRef.current.querySelector('.success-text'), {
              scale: 1.1,
              duration: config.animationDuration * 0.3,
              ease: 'power2.out',
              yoyo: true,
              repeat: 1
            }, '-=0.3');
          }

          // Reset after delay
          tl.to({}, { duration: 2 });
          tl.add(() => {
            setTestPhase('idle');
            if (successRef.current) {
              gsap.set(successRef.current, { scale: 0, opacity: 0 });
            }
          });
        });
      }
    });
  };

  useEffect(() => {
    if (inView && shouldUseAnimation('basic')) {
      const timer = setTimeout(() => {
        // Check if animation queue is ready
        const checkQueue = () => {
          if (!animationQueue.isRunning('stress-test-sequence')) {
            runStressTest();
          } else {
            setTimeout(checkQueue, 100);
          }
        };
        checkQueue();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [inView, shouldUseAnimation, config]);

  return (
    <div ref={ref} className="stress-test-container">
      <div 
        ref={containerRef}
        className="stress-test-simulation"
        style={{
          position: 'relative',
          width: '300px',
          height: '250px',
          margin: '0 auto'
        }}
      >
        {/* Pressure Gauge */}
        <div 
          ref={gaugeRef}
          className="pressure-gauge"
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            width: '60px',
            height: '60px',
            border: '3px solid #666',
            borderRadius: '50%',
            background: 'radial-gradient(circle, #f0f0f0, #d0d0d0)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div 
            ref={gaugeNeedleRef}
            className="gauge-needle"
            style={{
              position: 'absolute',
              width: '2px',
              height: '20px',
              background: '#ff0000',
              transformOrigin: 'bottom center',
              borderRadius: '1px'
            }}
          />
          <div style={{
            position: 'absolute',
            bottom: '5px',
            fontSize: '8px',
            color: '#333',
            fontWeight: 'bold'
          }}>
            PSI
          </div>
        </div>

        {/* Weight */}
        <div 
          ref={weightRef}
          className="test-weight"
          style={{
            position: 'absolute',
            top: '50px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '60px',
            height: '60px',
            background: `
              linear-gradient(45deg, #666, #999),
              repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(0,0,0,0.1) 5px, rgba(0,0,0,0.1) 10px)
            `,
            borderRadius: '8px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '12px'
          }}
        >
          2000kg
        </div>

        {/* Plywood Board */}
        <div 
          ref={plywoodRef}
          className="plywood-test-board"
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '250px',
            height: '20px',
            background: `
              linear-gradient(45deg, #8B4513 0%, #A0522D 25%, #CD853F 50%, #DEB887 75%, #8B4513 100%),
              repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)
            `,
            borderRadius: '4px',
            boxShadow: '0 4px 20px rgba(139, 69, 19, 0.5)',
            transformOrigin: 'center bottom'
          }}
        >
          <div style={{
            position: 'absolute',
            bottom: '-25px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '12px',
            color: '#fff',
            fontWeight: 'bold',
            textAlign: 'center'
          }}>
            WoodCraft Premium Plywood
          </div>
        </div>

        {/* Support Beams */}
        <div style={{
          position: 'absolute',
          bottom: '0',
          left: '25px',
          width: '20px',
          height: '40px',
          background: '#444',
          borderRadius: '2px'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '0',
          right: '25px',
          width: '20px',
          height: '40px',
          background: '#444',
          borderRadius: '2px'
        }} />

        {/* Particles Container */}
        <div 
          ref={particlesRef}
          className="impact-particles"
          style={{
            position: 'absolute',
            left: '50%',
            bottom: '40px',
            transform: 'translateX(-50%)',
            pointerEvents: 'none'
          }}
        />

        {/* Success Indicator */}
        <div 
          ref={successRef}
          className="success-indicator"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            background: 'rgba(0, 255, 0, 0.1)',
            border: '2px solid #00ff00',
            borderRadius: '50%',
            width: '80px',
            height: '80px',
            scale: 0,
            opacity: 0
          }}
        >
          <div style={{
            fontSize: '24px',
            color: '#00ff00',
            marginBottom: '4px'
          }}>
            ✓
          </div>
          <div 
            className="success-text"
            style={{
              fontSize: '10px',
              color: '#00ff00',
              fontWeight: 'bold',
              textAlign: 'center'
            }}
          >
            PASSED
          </div>
        </div>

        {/* Test Status */}
        <div style={{
          position: 'absolute',
          top: '-30px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '14px',
          fontWeight: 'bold',
          color: '#fff',
          textAlign: 'center'
        }}>
          {testPhase === 'idle' && 'Stress Test Ready'}
          {testPhase === 'dropping' && 'Weight Dropping...'}
          {testPhase === 'impact' && 'Impact Testing...'}
          {testPhase === 'success' && 'Test Completed!'}
        </div>
      </div>
    </div>
  );
};

export default EnhancedStressTest;