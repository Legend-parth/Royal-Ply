import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrollReveal from './ScrollReveal';
import AnimatedCounter from './AnimatedCounter';

gsap.registerPlugin(ScrollTrigger);

const StatsSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  const stats = [
    { 
      number: 25, 
      suffix: '+', 
      label: 'Years Experience',
      icon: '🏆',
      progress: 95
    },
    { 
      number: 10000, 
      suffix: '+', 
      label: 'Projects Completed',
      icon: '🏗️',
      progress: 88
    },
    { 
      number: 500, 
      suffix: '+', 
      label: 'Happy Clients',
      icon: '😊',
      progress: 92
    },
    { 
      number: 99, 
      suffix: '%', 
      label: 'Satisfaction Rate',
      icon: '⭐',
      progress: 99
    }
  ];

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Animate progress bars on scroll
    const progressBars = section.querySelectorAll('.progress-fill');
    progressBars.forEach((bar, index) => {
      ScrollTrigger.create({
        trigger: bar,
        start: 'top 80%',
        onEnter: () => {
          bar.classList.add('animate');
        }
      });
    });

    // Floating animation for stat cards
    const cards = section.querySelectorAll('.stat-card');
    cards.forEach((card, index) => {
      gsap.to(card, {
        y: -10,
        duration: 2 + (index * 0.5),
        ease: 'power2.inOut',
        yoyo: true,
        repeat: -1
      });
    });

    // Particle trail effect for numbers
    const createNumberParticle = (element: HTMLElement) => {
      const particle = document.createElement('div');
      particle.style.position = 'absolute';
      particle.style.width = '4px';
      particle.style.height = '4px';
      particle.style.background = 'var(--electric-indigo)';
      particle.style.borderRadius = '50%';
      particle.style.pointerEvents = 'none';
      particle.style.zIndex = '10';
      
      const rect = element.getBoundingClientRect();
      particle.style.left = `${rect.left + Math.random() * rect.width}px`;
      particle.style.top = `${rect.top + Math.random() * rect.height}px`;
      
      document.body.appendChild(particle);
      
      gsap.to(particle, {
        y: -50,
        opacity: 0,
        duration: 2,
        ease: 'power2.out',
        onComplete: () => {
          document.body.removeChild(particle);
        }
      });
    };

    // Create particles periodically
    const particleInterval = setInterval(() => {
      const numbers = section.querySelectorAll('.stat-number');
      numbers.forEach(number => {
        if (Math.random() < 0.3) {
          createNumberParticle(number as HTMLElement);
        }
      });
    }, 500);

    return () => {
      clearInterval(particleInterval);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="section stats-section scroll-snap-section"
    >
      <div className="container mx-auto px-6">
        <ScrollReveal>
          <h2 className="text-5xl font-bold text-center mb-16 glow-text">
            Our Achievements
          </h2>
        </ScrollReveal>
        
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <ScrollReveal key={index} delay={index * 0.1}>
              <div className="stat-card interactive">
                <div className="text-4xl mb-4">{stat.icon}</div>
                
                <div className="stat-number">
                  <AnimatedCounter 
                    end={stat.number} 
                    suffix={stat.suffix}
                  />
                </div>
                
                <div className="text-gray-300 mb-4">{stat.label}</div>
                
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ 
                      transform: `translateX(-${100 - stat.progress}%)`,
                      transitionDelay: `${index * 0.2}s`
                    }}
                  />
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;