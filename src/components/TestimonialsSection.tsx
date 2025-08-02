import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrollReveal from './ScrollReveal';

gsap.registerPlugin(ScrollTrigger);

const TestimonialsSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const animationRef = useRef<gsap.core.Tween | null>(null);

  const testimonials = [
    {
      name: 'John Smith',
      role: 'Architect',
      content: 'WoodCraft Premium delivers exceptional quality plywood that exceeds our expectations every time. The attention to detail is remarkable.',
      rating: 5,
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      name: 'Sarah Johnson',
      role: 'Interior Designer',
      content: 'The variety and quality of wood types available is outstanding. Perfect for high-end residential projects.',
      rating: 5,
      avatar: 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      name: 'Mike Chen',
      role: 'Contractor',
      content: 'Reliable, durable, and beautiful. WoodCraft is our go-to supplier for all plywood needs. Never disappoints.',
      rating: 5,
      avatar: 'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Furniture Maker',
      content: 'The craftsmanship and finish quality is unmatched. Every piece tells a story of excellence.',
      rating: 5,
      avatar: 'https://images.pexels.com/photos/3756681/pexels-photo-3756681.jpeg?auto=compress&cs=tinysrgb&w=150'
    }
  ];

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    // Create continuous scroll animation
    const totalWidth = carousel.scrollWidth;
    const viewWidth = carousel.clientWidth;
    const scrollDistance = totalWidth - viewWidth;

    // Set up infinite scroll animation
    animationRef.current = gsap.to(carousel, {
      scrollLeft: scrollDistance,
      duration: 20,
      ease: 'none',
      repeat: -1,
      yoyo: true,
      paused: isPaused
    });

    // 3D tilt effect on scroll
    const cards = carousel.querySelectorAll('.testimonial-card');
    cards.forEach((card) => {
      ScrollTrigger.create({
        trigger: card,
        start: 'left right',
        end: 'right left',
        horizontal: true,
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          const rotation = (progress - 0.5) * 15; // -7.5 to 7.5 degrees
          
          gsap.set(card, {
            rotationY: rotation,
            z: Math.abs(rotation) * 2,
            force3D: true
          });
        }
      });
    });

    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [isPaused]);

  const handleCardHover = (isHovering: boolean) => {
    setIsPaused(isHovering);
    
    if (animationRef.current) {
      if (isHovering) {
        animationRef.current.pause();
      } else {
        animationRef.current.resume();
      }
    }
  };

  const typewriterEffect = (text: string, element: HTMLElement) => {
    element.textContent = '';
    let i = 0;
    
    const type = () => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(type, 30);
      }
    };
    
    type();
  };

  return (
    <section 
      ref={sectionRef}
      className="section testimonials-section scroll-snap-section"
    >
      <div className="container mx-auto px-6">
        <ScrollReveal>
          <h2 className="text-5xl font-bold text-center mb-16 glow-text">
            What Our Clients Say
          </h2>
        </ScrollReveal>
        
        <div 
          ref={carouselRef}
          className="testimonial-carousel"
        >
          {[...testimonials, ...testimonials].map((testimonial, index) => (
            <div
              key={`${testimonial.name}-${index}`}
              className="testimonial-card interactive"
              onMouseEnter={(e) => {
                handleCardHover(true);
                
                // Scale effect
                gsap.to(e.currentTarget, {
                  scale: 1.05,
                  duration: 0.3,
                  ease: 'power2.out'
                });
                
                // Typewriter effect
                const quoteElement = e.currentTarget.querySelector('.quote-text') as HTMLElement;
                if (quoteElement) {
                  typewriterEffect(testimonial.content, quoteElement);
                }
              }}
              onMouseLeave={(e) => {
                handleCardHover(false);
                
                // Reset scale
                gsap.to(e.currentTarget, {
                  scale: 1,
                  duration: 0.3,
                  ease: 'power2.out'
                });
              }}
            >
              <div className="testimonial-avatar">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              
              <div className="flex mb-4 justify-center">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-xl">★</span>
                ))}
              </div>
              
              <p className="text-gray-300 mb-6 italic quote-text">
                "{testimonial.content}"
              </p>
              
              <div className="text-center">
                <div className="font-semibold text-white">{testimonial.name}</div>
                <div className="text-purple-400">{testimonial.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;