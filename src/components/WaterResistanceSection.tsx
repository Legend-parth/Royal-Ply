import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrollReveal from './ScrollReveal';

gsap.registerPlugin(ScrollTrigger);

const WaterResistanceSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const plywoodRef = useRef<HTMLDivElement>(null);
  const dropletsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const plywood = plywoodRef.current;
    const droplets = dropletsRef.current;

    if (!section || !plywood || !droplets) return;

    // Create water droplets
    const createDroplet = () => {
      const droplet = document.createElement('div');
      droplet.className = 'water-droplet';
      droplet.style.left = `${Math.random() * 100}%`;
      droplet.style.top = `${Math.random() * 50}%`;
      droplet.style.animationDelay = `${Math.random() * 2}s`;
      droplets.appendChild(droplet);

      setTimeout(() => {
        if (droplet.parentNode) {
          droplet.parentNode.removeChild(droplet);
        }
      }, 3000);
    };

    // Animation timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top center',
        end: 'bottom center',
        scrub: 1,
        onUpdate: (self) => {
          // Create droplets based on scroll progress
          if (Math.random() < self.progress * 0.1) {
            createDroplet();
          }
        }
      }
    });

    // Plywood animation
    tl.fromTo(plywood, 
      { 
        rotationY: -45,
        scale: 0.8,
        opacity: 0
      },
      { 
        rotationY: 0,
        scale: 1,
        opacity: 1,
        duration: 1,
        ease: 'power2.out'
      }
    );

    // Text reveal animation
    const textElements = section.querySelectorAll('.text-reveal');
    textElements.forEach((el, index) => {
      tl.fromTo(el,
        {
          y: 50,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out'
        },
        index * 0.2
      );
    });

    // Continuous droplet creation
    const dropletInterval = setInterval(createDroplet, 500);

    return () => {
      clearInterval(dropletInterval);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="section water-resistance-section scroll-snap-section"
    >
      <div className="section-content">
        <div className="space-y-8">
          <ScrollReveal direction="left">
            <h2 className="text-5xl font-bold glow-text text-reveal">
              Waterproof Excellence
            </h2>
          </ScrollReveal>
          
          <ScrollReveal direction="left" delay={0.2}>
            <p className="text-xl text-gray-300 text-reveal">
              Our premium plywood features advanced water-resistant technology, 
              ensuring durability in the most challenging environments.
            </p>
          </ScrollReveal>
          
          <ScrollReveal direction="left" delay={0.4}>
            <div className="space-y-4 text-reveal">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                <span>100% Waterproof Core</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                <span>Marine Grade Adhesives</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                <span>Weather Resistant Finish</span>
              </div>
            </div>
          </ScrollReveal>
        </div>
        
        <div className="relative">
          <div 
            ref={dropletsRef}
            className="absolute inset-0 pointer-events-none"
          />
          
          <div 
            ref={plywoodRef}
            className="relative w-full h-96 bg-gradient-to-br from-amber-600 to-amber-800 rounded-lg shadow-2xl transform-gpu"
            style={{
              background: `
                linear-gradient(45deg, #8B4513 0%, #A0522D 25%, #CD853F 50%, #DEB887 75%, #8B4513 100%),
                repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)
              `
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-blue-500/20 to-transparent rounded-lg"></div>
            <div className="absolute bottom-4 left-4 right-4 text-center">
              <div className="text-white font-semibold text-lg">Premium Waterproof Plywood</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WaterResistanceSection;