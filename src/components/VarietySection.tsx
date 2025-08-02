import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrollReveal from './ScrollReveal';

gsap.registerPlugin(ScrollTrigger);

const VarietySection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const [hoveredWood, setHoveredWood] = useState<string | null>(null);

  const woodTypes = [
    { 
      name: 'Oak', 
      color: '#8B4513',
      pattern: 'linear-gradient(45deg, #8B4513 0%, #A0522D 50%, #CD853F 100%)',
      description: 'Strong and durable with beautiful grain'
    },
    { 
      name: 'Pine', 
      color: '#DEB887',
      pattern: 'linear-gradient(45deg, #DEB887 0%, #F4A460 50%, #D2691E 100%)',
      description: 'Lightweight and versatile'
    },
    { 
      name: 'Birch', 
      color: '#F5DEB3',
      pattern: 'linear-gradient(45deg, #F5DEB3 0%, #DDD1A0 50%, #D2B48C 100%)',
      description: 'Smooth finish and excellent workability'
    },
    { 
      name: 'Maple', 
      color: '#FAEBD7',
      pattern: 'linear-gradient(45deg, #FAEBD7 0%, #F0E68C 50%, #DAA520 100%)',
      description: 'Premium quality with fine texture'
    },
    { 
      name: 'Walnut', 
      color: '#654321',
      pattern: 'linear-gradient(45deg, #654321 0%, #8B4513 50%, #A0522D 100%)',
      description: 'Rich color and exceptional strength'
    },
    { 
      name: 'Cherry', 
      color: '#8B0000',
      pattern: 'linear-gradient(45deg, #8B0000 0%, #CD5C5C 50%, #F08080 100%)',
      description: 'Elegant appearance and durability'
    }
  ];

  useEffect(() => {
    const section = sectionRef.current;
    const gallery = galleryRef.current;

    if (!section || !gallery) return;

    // Parallax scrolling effect
    const parallaxTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      }
    });

    // Stagger animation for wood samples
    const samples = gallery.querySelectorAll('.wood-sample');
    samples.forEach((sample, index) => {
      parallaxTl.fromTo(sample,
        {
          y: 100 + (index * 20),
          opacity: 0,
          scale: 0.8
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: 'power2.out'
        },
        index * 0.1
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const handleWoodHover = (woodName: string, color: string) => {
    setHoveredWood(woodName);
    
    // Animate background color change
    gsap.to(sectionRef.current, {
      backgroundColor: color + '20',
      duration: 0.5,
      ease: 'power2.out'
    });
  };

  const handleWoodLeave = () => {
    setHoveredWood(null);
    
    // Reset background
    gsap.to(sectionRef.current, {
      backgroundColor: 'transparent',
      duration: 0.5,
      ease: 'power2.out'
    });
  };

  return (
    <section 
      ref={sectionRef}
      className="section variety-section scroll-snap-section"
    >
      <div className="section-content">
        <div className="space-y-8">
          <ScrollReveal direction="left">
            <h2 className="text-5xl font-bold glow-text">
              Wood Variety
            </h2>
          </ScrollReveal>
          
          <ScrollReveal direction="left" delay={0.2}>
            <p className="text-xl text-gray-300">
              Choose from our extensive collection of premium wood types, 
              each offering unique characteristics and beauty.
            </p>
          </ScrollReveal>
          
          {hoveredWood && (
            <ScrollReveal direction="left" delay={0.4}>
              <div className="p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                <h3 className="text-lg font-semibold text-white mb-2">{hoveredWood}</h3>
                <p className="text-gray-300">
                  {woodTypes.find(w => w.name === hoveredWood)?.description}
                </p>
              </div>
            </ScrollReveal>
          )}
        </div>
        
        <div 
          ref={galleryRef}
          className="wood-gallery"
        >
          {woodTypes.map((wood, index) => (
            <div
              key={wood.name}
              className="wood-sample interactive magnetic"
              style={{ background: wood.pattern }}
              onMouseEnter={() => handleWoodHover(wood.name, wood.color)}
              onMouseLeave={handleWoodLeave}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-semibold text-lg drop-shadow-lg">
                  {wood.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VarietySection;