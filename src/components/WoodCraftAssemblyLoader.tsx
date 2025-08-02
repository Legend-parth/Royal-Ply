import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';

interface WoodCraftAssemblyLoaderProps {
  onComplete: () => void;
}

const WoodCraftAssemblyLoader: React.FC<WoodCraftAssemblyLoaderProps> = ({ onComplete }) => {
  const [stage, setStage] = useState<'logs' | 'slicing' | 'stacking' | 'gluing' | 'pressing' | 'branding' | 'complete'>('logs');
  const [progress, setProgress] = useState(0);
  const [isSkippable, setIsSkippable] = useState(false);
  const workshopRef = useRef<HTMLDivElement>(null);
  const logsRef = useRef<HTMLDivElement>(null);
  const sawRef = useRef<HTMLDivElement>(null);
  const sheetsRef = useRef<HTMLDivElement>(null);
  const glueRef = useRef<HTMLDivElement>(null);
  const pressRef = useRef<HTMLDivElement>(null);
  const dustRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Make skippable after 1 second
    const skipTimer = setTimeout(() => setIsSkippable(true), 1000);
    
    const runAnimation = async () => {
      const tl = gsap.timeline();
      
      // Stage 1: Logs roll in (0-20%)
      setStage('logs');
      tl.fromTo('.log', 
        { x: -200, rotation: 0 },
        { 
          x: 0, 
          rotation: 720, 
          duration: 0.8, 
          stagger: 0.2,
          ease: 'power2.out',
          onUpdate: () => setProgress(Math.min(20, tl.progress() * 20))
        }
      );

      // Stage 2: Slicing animation (20-40%)
      setStage('slicing');
      tl.to('.saw-blade', {
        rotation: 1440,
        duration: 0.6,
        ease: 'power2.inOut'
      })
      .to('.log', {
        scaleX: 0.1,
        duration: 0.4,
        stagger: 0.1,
        onUpdate: () => setProgress(20 + (tl.progress() - 0.4) * 20)
      }, '-=0.3');

      // Stage 3: Sheets stacking (40-60%)
      setStage('stacking');
      tl.fromTo('.veneer-sheet',
        { y: 100, opacity: 0, scaleY: 0 },
        {
          y: 0,
          opacity: 1,
          scaleY: 1,
          duration: 0.3,
          stagger: 0.1,
          ease: 'back.out(1.7)',
          onUpdate: () => setProgress(40 + (tl.progress() - 0.8) * 20)
        }
      );

      // Stage 4: Glue application (60-75%)
      setStage('gluing');
      tl.to('.glue-drop', {
        scale: 1,
        opacity: 0.8,
        duration: 0.4,
        stagger: 0.05,
        ease: 'power2.out',
        onUpdate: () => setProgress(60 + (tl.progress() - 1.2) * 15)
      })
      .to('.glue-flow', {
        width: '100%',
        duration: 0.5,
        ease: 'power2.inOut'
      }, '-=0.2');

      // Stage 5: Hydraulic press (75-90%)
      setStage('pressing');
      tl.to('.press-top', {
        y: 50,
        duration: 0.6,
        ease: 'power2.inOut',
        onUpdate: () => setProgress(75 + (tl.progress() - 1.7) * 15)
      })
      .to('.veneer-sheet', {
        scaleY: 0.8,
        duration: 0.4,
        ease: 'power2.out'
      }, '-=0.4');

      // Stage 6: Branding and completion (90-100%)
      setStage('branding');
      tl.to('.brand-stamp', {
        scale: 1.2,
        opacity: 1,
        duration: 0.3,
        ease: 'back.out(1.7)',
        onUpdate: () => setProgress(90 + (tl.progress() - 2.3) * 10)
      })
      .to('.sawdust-particle', {
        y: 100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.02,
        ease: 'power2.out'
      }, '-=0.2');

      // Final stage
      setStage('complete');
      setProgress(100);
      
      setTimeout(() => {
        onComplete();
      }, 500);
    };

    runAnimation();
    
    return () => clearTimeout(skipTimer);
  }, [onComplete]);

  const handleSkip = () => {
    if (isSkippable) {
      onComplete();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="wood-craft-loader"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'linear-gradient(135deg, #2D1B1B 0%, #1A1A1A 50%, #0D0D0D 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          overflow: 'hidden'
        }}
      >
        {/* Workshop Background */}
        <div 
          ref={workshopRef}
          className="workshop-scene"
          style={{
            position: 'absolute',
            inset: 0,
            background: `
              radial-gradient(circle at 30% 20%, rgba(139, 69, 19, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 70% 80%, rgba(160, 82, 45, 0.1) 0%, transparent 50%),
              linear-gradient(180deg, #1A1A1A 0%, #0D0D0D 100%)
            `,
            overflow: 'hidden'
          }}
        >
          {/* Workshop Tools Background */}
          <div style={{
            position: 'absolute',
            top: '10%',
            left: '5%',
            width: '90%',
            height: '20%',
            background: 'linear-gradient(90deg, transparent 0%, rgba(139, 69, 19, 0.05) 50%, transparent 100%)',
            borderRadius: '10px'
          }} />
          
          {/* Workbench */}
          <div style={{
            position: 'absolute',
            bottom: '20%',
            left: '10%',
            right: '10%',
            height: '8px',
            background: 'linear-gradient(90deg, #8B4513 0%, #A0522D 50%, #8B4513 100%)',
            borderRadius: '4px',
            boxShadow: '0 4px 20px rgba(139, 69, 19, 0.3)'
          }} />
        </div>

        {/* Main Animation Area */}
        <div 
          className="animation-stage"
          style={{
            position: 'relative',
            width: '400px',
            height: '300px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '2rem'
          }}
        >
          {/* Logs */}
          <div ref={logsRef} className="logs-container" style={{ position: 'absolute', left: 0, top: '40%' }}>
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="log"
                style={{
                  position: 'absolute',
                  width: '80px',
                  height: '20px',
                  background: `linear-gradient(45deg, 
                    ${i % 2 === 0 ? '#8B4513' : '#A0522D'} 0%, 
                    ${i % 2 === 0 ? '#A0522D' : '#CD853F'} 100%
                  )`,
                  borderRadius: '10px',
                  top: `${i * 25}px`,
                  left: '-200px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
                  transform: 'rotate(0deg)'
                }}
              >
                {/* Wood grain lines */}
                <div style={{
                  position: 'absolute',
                  inset: '2px',
                  background: 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)',
                  borderRadius: '8px'
                }} />
              </div>
            ))}
          </div>

          {/* Circular Saw */}
          <div ref={sawRef} className="saw-container" style={{ position: 'absolute', left: '120px', top: '30%' }}>
            <div 
              className="saw-blade"
              style={{
                width: '60px',
                height: '60px',
                background: `
                  radial-gradient(circle, #E8E8E8 20%, #C0C0C0 40%, #A0A0A0 60%, #808080 80%),
                  conic-gradient(from 0deg, 
                    #E8E8E8 0deg, #C0C0C0 30deg, #A0A0A0 60deg, #808080 90deg,
                    #E8E8E8 120deg, #C0C0C0 150deg, #A0A0A0 180deg, #808080 210deg,
                    #E8E8E8 240deg, #C0C0C0 270deg, #A0A0A0 300deg, #808080 330deg
                  )
                `,
                borderRadius: '50%',
                boxShadow: '0 0 20px rgba(255, 165, 0, 0.5), 0 4px 15px rgba(0,0,0,0.3)',
                position: 'relative'
              }}
            >
              {/* Saw teeth */}
              <div style={{
                position: 'absolute',
                inset: '3px',
                borderRadius: '50%',
                background: `
                  conic-gradient(from 0deg, 
                    transparent 5%, #A0A0A0 10%, transparent 15%,
                    transparent 20%, #A0A0A0 25%, transparent 30%,
                    transparent 35%, #A0A0A0 40%, transparent 45%,
                    transparent 50%, #A0A0A0 55%, transparent 60%,
                    transparent 65%, #A0A0A0 70%, transparent 75%,
                    transparent 80%, #A0A0A0 85%, transparent 90%,
                    transparent 95%, #A0A0A0 100%
                  )
                `
              }} />
            </div>
          </div>

          {/* Veneer Sheets Stack */}
          <div ref={sheetsRef} className="sheets-container" style={{ position: 'absolute', left: '200px', top: '45%' }}>
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="veneer-sheet"
                style={{
                  position: 'absolute',
                  width: '120px',
                  height: '8px',
                  background: `linear-gradient(45deg, 
                    ${['#DEB887', '#F4A460', '#D2691E', '#CD853F', '#A0522D'][i]} 0%, 
                    ${['#F4A460', '#D2691E', '#CD853F', '#A0522D', '#8B4513'][i]} 100%
                  )`,
                  borderRadius: '2px',
                  bottom: `${i * 9}px`,
                  boxShadow: '0 1px 5px rgba(0,0,0,0.2)',
                  opacity: 0,
                  transform: 'scaleY(0)'
                }}
              >
                {/* Wood grain */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(0,0,0,0.1) 1px, rgba(0,0,0,0.1) 2px)',
                  borderRadius: '2px'
                }} />
              </div>
            ))}
          </div>

          {/* Glue Application */}
          <div ref={glueRef} className="glue-container" style={{ position: 'absolute', left: '180px', top: '35%' }}>
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="glue-drop"
                style={{
                  position: 'absolute',
                  width: '4px',
                  height: '6px',
                  background: 'linear-gradient(180deg, #FFD700 0%, #FFA500 100%)',
                  borderRadius: '50% 50% 50% 0',
                  left: `${i * 15}px`,
                  top: '20px',
                  transform: 'rotate(-45deg) scale(0)',
                  opacity: 0,
                  boxShadow: '0 0 5px rgba(255, 215, 0, 0.5)'
                }}
              />
            ))}
            
            {/* Glue flow lines */}
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="glue-flow"
                style={{
                  position: 'absolute',
                  height: '2px',
                  width: '0%',
                  background: 'linear-gradient(90deg, #FFD700, #FFA500)',
                  top: `${40 + i * 10}px`,
                  left: '0',
                  borderRadius: '1px',
                  boxShadow: '0 0 3px rgba(255, 215, 0, 0.3)'
                }}
              />
            ))}
          </div>

          {/* Hydraulic Press */}
          <div ref={pressRef} className="press-container" style={{ position: 'absolute', left: '190px', top: '20%' }}>
            <div 
              className="press-top"
              style={{
                width: '100px',
                height: '20px',
                background: 'linear-gradient(180deg, #666 0%, #999 50%, #666 100%)',
                borderRadius: '4px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
                position: 'relative'
              }}
            >
              {/* Hydraulic cylinders */}
              <div style={{
                position: 'absolute',
                left: '10px',
                top: '-15px',
                width: '8px',
                height: '15px',
                background: 'linear-gradient(180deg, #888 0%, #555 100%)',
                borderRadius: '4px 4px 0 0'
              }} />
              <div style={{
                position: 'absolute',
                right: '10px',
                top: '-15px',
                width: '8px',
                height: '15px',
                background: 'linear-gradient(180deg, #888 0%, #555 100%)',
                borderRadius: '4px 4px 0 0'
              }} />
            </div>
          </div>

          {/* Brand Stamp */}
          <div className="brand-stamp" style={{
            position: 'absolute',
            left: '220px',
            top: '50%',
            width: '80px',
            height: '30px',
            background: 'linear-gradient(45deg, #8B4513 0%, #A0522D 100%)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFD700',
            fontSize: '10px',
            fontWeight: 'bold',
            fontFamily: 'Orbitron, monospace',
            boxShadow: '0 4px 15px rgba(139, 69, 19, 0.5)',
            opacity: 0,
            transform: 'scale(0)'
          }}>
            WOODCRAFT
          </div>

          {/* Sawdust Particles */}
          <div ref={dustRef} className="dust-container" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="sawdust-particle"
                style={{
                  position: 'absolute',
                  width: `${2 + Math.random() * 3}px`,
                  height: `${2 + Math.random() * 3}px`,
                  background: '#DEB887',
                  borderRadius: '50%',
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  opacity: 0.6
                }}
              />
            ))}
          </div>
        </div>

        {/* Progress and Stage Info */}
        <div style={{ textAlign: 'center', color: 'white', marginBottom: '2rem' }}>
          <motion.h2
            key={stage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              fontFamily: 'Orbitron, monospace',
              fontSize: '1.5rem',
              fontWeight: 600,
              marginBottom: '1rem',
              color: '#FFD700'
            }}
          >
            {stage === 'logs' && 'Selecting Premium Wood Logs'}
            {stage === 'slicing' && 'Precision Cutting Veneer Sheets'}
            {stage === 'stacking' && 'Layering Wood Veneers'}
            {stage === 'gluing' && 'Applying Premium Adhesive'}
            {stage === 'pressing' && 'Hydraulic Press Bonding'}
            {stage === 'branding' && 'Quality Certification'}
            {stage === 'complete' && 'Craftsmanship Complete'}
          </motion.h2>

          {/* Wood Cutting Progress Bar */}
          <div style={{
            width: '300px',
            height: '12px',
            background: 'rgba(139, 69, 19, 0.3)',
            borderRadius: '6px',
            overflow: 'hidden',
            border: '1px solid rgba(255, 215, 0, 0.3)',
            position: 'relative'
          }}>
            <motion.div
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, #8B4513 0%, #FFD700 50%, #A0522D 100%)',
                borderRadius: '6px',
                width: `${progress}%`,
                boxShadow: '0 0 10px rgba(255, 215, 0, 0.5)'
              }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
            
            {/* Wood grain texture overlay */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)',
              borderRadius: '6px'
            }} />
          </div>

          <div style={{
            marginTop: '0.5rem',
            fontSize: '1rem',
            color: '#A0522D',
            fontWeight: 600
          }}>
            {Math.round(progress)}% Complete
          </div>
        </div>

        {/* Skip Button */}
        {isSkippable && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            onClick={handleSkip}
            style={{
              position: 'absolute',
              bottom: '30px',
              right: '30px',
              padding: '10px 20px',
              background: 'rgba(255, 215, 0, 0.1)',
              border: '1px solid rgba(255, 215, 0, 0.3)',
              borderRadius: '25px',
              color: '#FFD700',
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 215, 0, 0.2)';
              e.currentTarget.style.borderColor = 'rgba(255, 215, 0, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 215, 0, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(255, 215, 0, 0.3)';
            }}
          >
            Skip Animation
          </motion.button>
        )}

        {/* Sound Wave Visualization */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '30px',
          display: 'flex',
          alignItems: 'end',
          gap: '2px',
          opacity: 0.6
        }}>
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              style={{
                width: '3px',
                background: 'linear-gradient(180deg, #FFD700, #A0522D)',
                borderRadius: '1.5px'
              }}
              animate={{
                height: [5, 15 + Math.random() * 20, 5]
              }}
              transition={{
                duration: 0.5 + Math.random() * 0.5,
                repeat: Infinity,
                delay: i * 0.1
              }}
            />
          ))}
          <span style={{
            marginLeft: '10px',
            fontSize: '0.8rem',
            color: '#A0522D',
            fontFamily: 'monospace'
          }}>
            Workshop Sounds
          </span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WoodCraftAssemblyLoader;