import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrollReveal from './ScrollReveal';
import AnimatedCounter from './AnimatedCounter';

gsap.registerPlugin(ScrollTrigger);

const DurabilitySection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stressTestRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const stressTest = stressTestRef.current;
    const background = backgroundRef.current;

    if (!section || !stressTest || !background) return;

    // Background morphing animation
    const morphTl = gsap.timeline({ repeat: -1, yoyo: true });
    morphTl.to(background, {
      clipPath: 'polygon(0 0, 100% 0, 85% 100%, 15% 100%)',
      duration: 4,
      ease: 'power2.inOut'
    }).to(background, {
      clipPath: 'polygon(0 0, 85% 0, 100% 100%, 0 85%)',
      duration: 4,
      ease: 'power2.inOut'
    });

    // Stress test animation
    const stressTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top center',
        end: 'bottom center',
        scrub: 1
      }
    });

    // Plywood landing animation
    stressTl.fromTo('.plywood-board',
      {
        y: -200,
        rotation: 45,
        scale: 0.5,
        opacity: 0
      },
      {
        y: 0,
        rotation: 0,
        scale: 1,
        opacity: 1,
        duration: 1,
        ease: 'bounce.out'
      }
    );

    // Weight impact animation
    stressTl.to('.plywood-board',
      {
        scaleY: 0.95,
        duration: 0.3,
        ease: 'power2.out',
        yoyo: true,
        repeat: 1
      },
      '+=0.5'
    );

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      morphTl.kill();
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="section durability-section scroll-snap-section relative overflow-hidden"
    >
      <div 
        ref={backgroundRef}
        className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-indigo-900/20"
        style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
      />
      
      <div className="section-content relative z-10">
        <div className="space-y-8">
          <ScrollReveal direction="left">
            <h2 className="text-5xl font-bold glow-text">
              Unmatched Durability
            </h2>
          </ScrollReveal>
          
          <ScrollReveal direction="left" delay={0.2}>
            <p className="text-xl text-gray-300">
              Engineered to withstand extreme conditions and heavy loads, 
              our plywood delivers exceptional strength and longevity.
            </p>
          </ScrollReveal>
          
          <ScrollReveal direction="left" delay={0.4}>
            <div className="grid grid-cols-2 gap-6">
              <div className="stat-card interactive">
                <div className="stat-number">
                  <AnimatedCounter end={50} suffix="+" />
                </div>
                <div className="text-gray-300">Years Lifespan</div>
              </div>
              
              <div className="stat-card interactive">
                <div className="stat-number">
                  <AnimatedCounter end={2000} suffix=" kg" />
                </div>
                <div className="text-gray-300">Load Capacity</div>
              </div>
            </div>
          </ScrollReveal>
        </div>
        
        <div className="flex justify-center items-center">
          <div 
            ref={stressTestRef}
            className="stress-test-animation"
          >
            <div className="weight"></div>
            <div className="plywood-board"></div>
            
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center">
              <div className="text-sm text-gray-400">Stress Test Simulation</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DurabilitySection;