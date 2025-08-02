import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrollReveal from './ScrollReveal';
import AnimatedCounter from './AnimatedCounter';
import EnhancedStressTest from './EnhancedStressTest';
import { useAdaptiveAnimation } from './AdaptiveAnimationProvider';

gsap.registerPlugin(ScrollTrigger);

const EnhancedDurabilitySection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const { shouldUseAnimation, config } = useAdaptiveAnimation();

  useEffect(() => {
    const section = sectionRef.current;
    const background = backgroundRef.current;

    if (!section || !background || !shouldUseAnimation('advanced')) return;

    // Enhanced background morphing animation
    const morphTl = gsap.timeline({ repeat: -1, yoyo: true });
    
    morphTl.to(background, {
      clipPath: 'polygon(0 0, 100% 0, 85% 100%, 15% 100%)',
      duration: 4,
      ease: 'power2.inOut'
    }).to(background, {
      clipPath: 'polygon(0 0, 85% 0, 100% 100%, 0 85%)',
      duration: 4,
      ease: 'power2.inOut'
    }).to(background, {
      clipPath: 'polygon(15% 0, 100% 15%, 85% 100%, 0 85%)',
      duration: 4,
      ease: 'power2.inOut'
    });

    // Parallax scrolling effect
    ScrollTrigger.create({
      trigger: section,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        gsap.set(background, {
          y: progress * 100,
          force3D: true
        });
      }
    });

    return () => {
      morphTl.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [shouldUseAnimation]);

  return (
    <section 
      ref={sectionRef}
      className="section durability-section scroll-snap-section relative overflow-hidden min-h-screen"
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
              <div className="stat-card interactive p-6 rounded-2xl bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 text-center">
                <div className="stat-number text-4xl font-bold text-purple-400 mb-2">
                  <AnimatedCounter end={50} suffix="+" />
                </div>
                <div className="text-gray-300">Years Lifespan</div>
              </div>
              
              <div className="stat-card interactive p-6 rounded-2xl bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 text-center">
                <div className="stat-number text-4xl font-bold text-purple-400 mb-2">
                  <AnimatedCounter end={2000} suffix=" kg" />
                </div>
                <div className="text-gray-300">Load Capacity</div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="left" delay={0.6}>
            <div className="durability-features space-y-4">
              <h3 className="text-2xl font-semibold text-white mb-4">Key Features:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { icon: '🛡️', title: 'Impact Resistant', desc: 'Withstands heavy impacts without damage' },
                  { icon: '🌡️', title: 'Temperature Stable', desc: 'Performs in extreme temperatures' },
                  { icon: '💧', title: 'Moisture Proof', desc: 'Complete protection against water damage' },
                  { icon: '🔧', title: 'Easy Maintenance', desc: 'Simple care for long-lasting performance' }
                ].map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-white/5 backdrop-blur-sm">
                    <span className="text-2xl">{feature.icon}</span>
                    <div>
                      <h4 className="font-semibold text-white">{feature.title}</h4>
                      <p className="text-sm text-gray-300">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
        
        <div className="flex justify-center items-center">
          <ScrollReveal direction="right" delay={0.3}>
            <EnhancedStressTest />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default EnhancedDurabilitySection;