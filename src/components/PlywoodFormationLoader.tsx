import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';

interface PlywoodFormationLoaderProps {
  onComplete: () => void;
}

interface WoodFiber {
  id: number;
  x: number;
  y: number;
  angle: number;
  length: number;
  color: string;
  speed: number;
}

const PlywoodFormationLoader: React.FC<PlywoodFormationLoaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<'fibers' | 'layering' | 'compression' | 'finishing' | 'complete'>('fibers');
  const [soundEnabled, setSoundEnabled] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressKnotRef = useRef<HTMLDivElement>(null);
  const dustParticlesRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const fibersRef = useRef<WoodFiber[]>([]);
  const layersRef = useRef<number>(0);

  // Device capability detection
  const getDeviceCapability = () => {
    const cores = navigator.hardwareConcurrency || 4;
    const memory = (navigator as any).deviceMemory || 4;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile || cores < 4 || memory < 4) return 'essential';
    if (cores >= 8 && memory >= 8) return 'premium';
    return 'standard';
  };

  const deviceCapability = getDeviceCapability();
  const fiberCount = deviceCapability === 'premium' ? 200 : deviceCapability === 'standard' ? 100 : 50;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize wood fibers
    const initializeFibers = () => {
      fibersRef.current = [];
      for (let i = 0; i < fiberCount; i++) {
        const side = Math.floor(Math.random() * 4);
        let x, y;
        
        switch (side) {
          case 0: // Top
            x = Math.random() * canvas.width;
            y = -50;
            break;
          case 1: // Right
            x = canvas.width + 50;
            y = Math.random() * canvas.height;
            break;
          case 2: // Bottom
            x = Math.random() * canvas.width;
            y = canvas.height + 50;
            break;
          default: // Left
            x = -50;
            y = Math.random() * canvas.height;
        }

        fibersRef.current.push({
          id: i,
          x,
          y,
          angle: Math.random() * Math.PI * 2,
          length: 20 + Math.random() * 40,
          color: `hsl(${30 + Math.random() * 30}, ${60 + Math.random() * 20}%, ${40 + Math.random() * 20}%)`,
          speed: 1 + Math.random() * 2
        });
      }
    };

    // Create floating dust particles
    const createDustParticles = () => {
      if (!dustParticlesRef.current || deviceCapability === 'essential') return;

      for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
          position: absolute;
          width: ${2 + Math.random() * 4}px;
          height: ${2 + Math.random() * 4}px;
          background: radial-gradient(circle, #DEB887, #CD853F);
          border-radius: 50%;
          left: ${Math.random() * 100}%;
          top: ${Math.random() * 100}%;
          opacity: ${0.3 + Math.random() * 0.4};
          animation: dustFloat ${10 + Math.random() * 20}s infinite linear;
          pointer-events: none;
        `;
        dustParticlesRef.current.appendChild(particle);
      }
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw background gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#2D1B69');
      gradient.addColorStop(0.5, '#1a0033');
      gradient.addColorStop(1, '#000000');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const targetRadius = 150;

      // Stage 1: Fibers flowing in
      if (stage === 'fibers') {
        fibersRef.current.forEach(fiber => {
          const dx = centerX - fiber.x;
          const dy = centerY - fiber.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance > 5) {
            fiber.x += (dx / distance) * fiber.speed;
            fiber.y += (dy / distance) * fiber.speed;
          }

          // Draw fiber
          ctx.save();
          ctx.translate(fiber.x, fiber.y);
          ctx.rotate(fiber.angle);
          ctx.strokeStyle = fiber.color;
          ctx.lineWidth = 2;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(-fiber.length / 2, 0);
          ctx.lineTo(fiber.length / 2, 0);
          ctx.stroke();
          ctx.restore();
        });

        // Check if fibers have gathered
        const gatheredFibers = fibersRef.current.filter(fiber => {
          const dx = centerX - fiber.x;
          const dy = centerY - fiber.y;
          return Math.sqrt(dx * dx + dy * dy) < targetRadius;
        });

        const gatherProgress = gatheredFibers.length / fibersRef.current.length;
        setProgress(gatherProgress * 25);

        if (gatherProgress > 0.8) {
          setStage('layering');
          layersRef.current = 0;
        }
      }

      // Stage 2: Layer formation
      if (stage === 'layering') {
        const layerProgress = Math.min(layersRef.current / 5, 1);
        
        // Draw layers
        for (let layer = 0; layer < Math.floor(layersRef.current); layer++) {
          const layerRadius = targetRadius - layer * 15;
          const layerAlpha = 0.8 - layer * 0.1;
          
          ctx.save();
          ctx.globalAlpha = layerAlpha;
          ctx.fillStyle = `hsl(${25 + layer * 5}, 70%, ${50 - layer * 5}%)`;
          ctx.beginPath();
          ctx.arc(centerX, centerY, layerRadius, 0, Math.PI * 2);
          ctx.fill();
          
          // Add wood grain texture
          ctx.strokeStyle = `hsl(${20 + layer * 5}, 60%, ${30 - layer * 3}%)`;
          ctx.lineWidth = 1;
          for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const x1 = centerX + Math.cos(angle) * (layerRadius - 10);
            const y1 = centerY + Math.sin(angle) * (layerRadius - 10);
            const x2 = centerX + Math.cos(angle) * (layerRadius + 10);
            const y2 = centerY + Math.sin(angle) * (layerRadius + 10);
            
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
          }
          ctx.restore();
        }

        layersRef.current += 0.02;
        setProgress(25 + layerProgress * 35);

        if (layerProgress >= 1) {
          setStage('compression');
        }
      }

      // Stage 3: Compression
      if (stage === 'compression') {
        const compressionTime = (Date.now() % 3000) / 3000;
        const compressionScale = 1 - Math.sin(compressionTime * Math.PI) * 0.1;
        
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.scale(compressionScale, compressionScale);
        ctx.translate(-centerX, -centerY);
        
        // Draw compressed plywood
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.arc(centerX, centerY, targetRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // Add pressure lines
        ctx.strokeStyle = '#654321';
        ctx.lineWidth = 2;
        for (let i = 0; i < 12; i++) {
          const angle = (i / 12) * Math.PI * 2;
          const x1 = centerX + Math.cos(angle) * (targetRadius - 20);
          const y1 = centerY + Math.sin(angle) * (targetRadius - 20);
          const x2 = centerX + Math.cos(angle) * (targetRadius + 20);
          const y2 = centerY + Math.sin(angle) * (targetRadius + 20);
          
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
        
        ctx.restore();
        
        setProgress(60 + compressionTime * 25);
        
        if (compressionTime > 0.9) {
          setStage('finishing');
        }
      }

      // Stage 4: Finishing with golden shimmer
      if (stage === 'finishing') {
        const shimmerTime = (Date.now() % 2000) / 2000;
        
        // Draw final plywood
        ctx.fillStyle = '#A0522D';
        ctx.beginPath();
        ctx.arc(centerX, centerY, targetRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // Golden shimmer effect
        const shimmerGradient = ctx.createLinearGradient(
          centerX - targetRadius, centerY - targetRadius,
          centerX + targetRadius, centerY + targetRadius
        );
        shimmerGradient.addColorStop(0, 'transparent');
        shimmerGradient.addColorStop(shimmerTime, 'rgba(255, 215, 0, 0.6)');
        shimmerGradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = shimmerGradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, targetRadius, 0, Math.PI * 2);
        ctx.fill();
        
        setProgress(85 + shimmerTime * 15);
        
        if (shimmerTime > 0.8) {
          setStage('complete');
          setProgress(100);
          setTimeout(onComplete, 1000);
        }
      }

      if (stage !== 'complete') {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    // Start animation
    initializeFibers();
    createDustParticles();
    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [stage, onComplete, fiberCount, deviceCapability]);

  // Progress knot animation
  useEffect(() => {
    if (progressKnotRef.current) {
      gsap.to(progressKnotRef.current, {
        rotation: progress * 3.6,
        duration: 0.5,
        ease: 'power2.out'
      });
    }
  }, [progress]);

  return (
    <AnimatePresence>
      <motion.div
        className="plywood-formation-loader"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 10000,
          overflow: 'hidden'
        }}
      >
        {/* Canvas for fiber animation */}
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1
          }}
        />

        {/* Floating dust particles */}
        <div 
          ref={dustParticlesRef}
          className="dust-particles"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 2,
            pointerEvents: 'none'
          }}
        />

        {/* Progress knot indicator */}
        <div style={{
          position: 'absolute',
          bottom: '15%',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 3,
          textAlign: 'center'
        }}>
          <div 
            ref={progressKnotRef}
            style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 1rem',
              borderRadius: '50%',
              background: `
                radial-gradient(circle at 30% 30%, #8B4513, #654321),
                conic-gradient(from 0deg, #8B4513 0%, #A0522D ${progress * 3.6}deg, #654321 ${progress * 3.6}deg, #654321 360deg)
              `,
              position: 'relative',
              boxShadow: '0 0 30px rgba(139, 69, 19, 0.5)'
            }}
          >
            {/* Wood knot rings */}
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  inset: `${10 + i * 8}px`,
                  borderRadius: '50%',
                  border: '1px solid rgba(101, 67, 33, 0.5)',
                  background: 'transparent'
                }}
              />
            ))}
            
            {/* Progress percentage */}
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFD700',
              fontSize: '14px',
              fontWeight: 'bold',
              fontFamily: 'monospace'
            }}>
              {Math.round(progress)}%
            </div>
          </div>

          {/* Stage description */}
          <motion.div
            key={stage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              color: '#DEB887',
              fontSize: '1.2rem',
              fontWeight: 600,
              marginBottom: '0.5rem'
            }}
          >
            {stage === 'fibers' && 'Gathering Wood Fibers'}
            {stage === 'layering' && 'Forming Veneer Layers'}
            {stage === 'compression' && 'Hydraulic Compression'}
            {stage === 'finishing' && 'Golden Finish Application'}
            {stage === 'complete' && 'Premium Plywood Ready'}
          </motion.div>

          {/* Sound toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            style={{
              background: 'rgba(139, 69, 19, 0.2)',
              border: '1px solid rgba(139, 69, 19, 0.5)',
              borderRadius: '20px',
              padding: '8px 16px',
              color: '#DEB887',
              fontSize: '12px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            🔊 Sound: {soundEnabled ? 'ON' : 'OFF'}
          </button>
        </div>

        {/* Brand signature */}
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 3,
          textAlign: 'center'
        }}>
          <motion.h1
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            style={{
              fontFamily: 'Orbitron, monospace',
              fontSize: 'clamp(2rem, 6vw, 4rem)',
              fontWeight: 900,
              background: 'linear-gradient(135deg, #FFD700 0%, #DEB887 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '0.5rem',
              textShadow: '0 0 30px rgba(255, 215, 0, 0.3)'
            }}
          >
            WoodCraft Premium
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            style={{
              color: '#A0522D',
              fontSize: '1rem',
              fontStyle: 'italic'
            }}
          >
            Crafting Excellence, Layer by Layer
          </motion.p>
        </div>

        <style jsx>{`
          @keyframes dustFloat {
            0% {
              transform: translateY(100vh) translateX(0) rotate(0deg);
              opacity: 0;
            }
            10% {
              opacity: 1;
            }
            90% {
              opacity: 1;
            }
            100% {
              transform: translateY(-100vh) translateX(50px) rotate(360deg);
              opacity: 0;
            }
          }
        `}</style>
      </motion.div>
    </AnimatePresence>
  );
};

export default PlywoodFormationLoader;