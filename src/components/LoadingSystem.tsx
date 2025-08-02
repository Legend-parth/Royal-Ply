import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { globalAnimationQueue } from '../utils/AnimationQueue';

interface LoadingSystemProps {
  onComplete: () => void;
}

interface LoadingStage {
  id: string;
  name: string;
  progress: number;
  status: 'pending' | 'loading' | 'complete' | 'error';
  error?: string;
  healthCheck?: () => boolean;
}

const LoadingSystem: React.FC<LoadingSystemProps> = ({ onComplete }) => {
  const [stages, setStages] = useState<LoadingStage[]>([
    { 
      id: 'assets', 
      name: 'Loading Assets', 
      progress: 0, 
      status: 'pending',
      healthCheck: () => document.readyState === 'complete'
    },
    { 
      id: 'animations', 
      name: 'Initializing Animations', 
      progress: 0, 
      status: 'pending',
      healthCheck: () => globalAnimationQueue.getPerformanceStats().successRate > 0
    },
    { 
      id: 'spline', 
      name: 'Loading 3D Models', 
      progress: 0, 
      status: 'pending',
      healthCheck: () => document.querySelector('canvas') !== null
    },
    { 
      id: 'components', 
      name: 'Preparing Components', 
      progress: 0, 
      status: 'pending',
      healthCheck: () => document.querySelectorAll('.interactive').length > 0
    },
    { 
      id: 'final', 
      name: 'Final Setup', 
      progress: 0, 
      status: 'pending',
      healthCheck: () => true
    }
  ]);
  
  const [currentStage, setCurrentStage] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [healthCheckResults, setHealthCheckResults] = useState<Record<string, boolean>>({});
  const progressBarRef = useRef<HTMLDivElement>(null);
  const woodStackRef = useRef<HTMLDivElement>(null);

  // Simulate loading stages
  useEffect(() => {
    const performHealthCheck = (stage: LoadingStage): boolean => {
      if (!stage.healthCheck) return true;
      
      try {
        const result = stage.healthCheck();
        setHealthCheckResults(prev => ({ ...prev, [stage.id]: result }));
        return result;
      } catch (error) {
        console.warn(`Health check failed for stage ${stage.id}:`, error);
        setHealthCheckResults(prev => ({ ...prev, [stage.id]: false }));
        return false;
      }
    };
    
    const loadStage = async (stageIndex: number) => {
      if (stageIndex >= stages.length) {
        // Final health check
        const allHealthy = stages.every(stage => performHealthCheck(stage));
        
        if (!allHealthy) {
          console.warn('Some components failed health checks, but proceeding...');
        }
        
        setIsComplete(true);
        setTimeout(onComplete, 500);
        return;
      }

      setCurrentStage(stageIndex);
      const currentStageData = stages[stageIndex];
      
      // Update stage status to loading
      setStages(prev => prev.map((stage, index) => 
        index === stageIndex 
          ? { ...stage, status: 'loading' }
          : stage
      ));

      // Simulate loading progress with health checks
      const baseDuration = 800;
      const randomVariation = Math.random() * 400;
      const duration = baseDuration + randomVariation;
      const steps = 20;
      const stepDuration = duration / steps;

      for (let step = 0; step <= steps; step++) {
        await new Promise(resolve => setTimeout(resolve, stepDuration));
        
        const progress = (step / steps) * 100;
        
        // Perform health check at 50% progress
        if (step === Math.floor(steps / 2)) {
          performHealthCheck(currentStageData);
        }
        
        setStages(prev => prev.map((stage, index) => 
          index === stageIndex 
            ? { ...stage, progress }
            : stage
        ));

        // Update overall progress
        const stageWeight = 100 / stages.length;
        const newOverallProgress = (stageIndex * stageWeight) + (progress * stageWeight / 100);
        setOverallProgress(newOverallProgress);
      }

      // Mark stage as complete
      setStages(prev => prev.map((stage, index) => 
        index === stageIndex 
          ? { 
              ...stage, 
              status: performHealthCheck(currentStageData) ? 'complete' : 'error', 
              progress: 100 
            }
          : stage
      ));

      // Load next stage
      setTimeout(() => loadStage(stageIndex + 1), 200);
    };

    const timer = setTimeout(() => loadStage(0), 500);
    return () => clearTimeout(timer);
  }, [stages.length, onComplete]);

  // Animate progress bar
  useEffect(() => {
    if (progressBarRef.current) {
      gsap.to(progressBarRef.current, {
        width: `${overallProgress}%`,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  }, [overallProgress]);

  // Animate wood stack
  useEffect(() => {
    if (woodStackRef.current) {
      const pieces = woodStackRef.current.querySelectorAll('.wood-piece');
      
      gsap.fromTo(pieces, 
        { 
          y: 50, 
          opacity: 0,
          rotationZ: (index) => (Math.random() - 0.5) * 20
        },
        { 
          y: 0, 
          opacity: 1,
          rotationZ: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'back.out(1.7)'
        }
      );
    }
  }, []);

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          className="loading-system"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'linear-gradient(135deg, #000000 0%, #1a0033 50%, #000000 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            color: 'white'
          }}
        >
          {/* Wood Stack Animation */}
          <div 
            ref={woodStackRef}
            className="wood-stack"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginBottom: '3rem'
            }}
          >
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="wood-piece"
                style={{
                  width: `${120 - i * 10}px`,
                  height: '20px',
                  background: `linear-gradient(45deg, 
                    ${i % 2 === 0 ? '#8B4513' : '#A0522D'} 0%, 
                    ${i % 2 === 0 ? '#A0522D' : '#CD853F'} 100%
                  )`,
                  borderRadius: '4px',
                  marginBottom: '4px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)',
                  borderRadius: '4px'
                }} />
              </div>
            ))}
          </div>

          {/* Brand */}
          <motion.h1
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            style={{
              fontFamily: 'Orbitron, monospace',
              fontSize: '2.5rem',
              fontWeight: 900,
              background: 'linear-gradient(135deg, #ffffff 0%, #a855f7 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '2rem',
              textAlign: 'center'
            }}
          >
            WoodCraft Premium
          </motion.h1>

          {/* Current Stage */}
          <motion.div
            key={currentStage}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              fontSize: '1.2rem',
              marginBottom: '2rem',
              textAlign: 'center',
              color: '#a855f7'
            }}
          >
            {stages[currentStage]?.name}
          </motion.div>

          {/* Progress Bar */}
          <div style={{
            width: '400px',
            maxWidth: '80vw',
            height: '8px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '4px',
            overflow: 'hidden',
            marginBottom: '2rem',
            position: 'relative'
          }}>
            <div
              ref={progressBarRef}
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, #a855f7, #6366f1)',
                borderRadius: '4px',
                width: '0%',
                boxShadow: '0 0 10px rgba(168, 85, 247, 0.5)'
              }}
            />
            
            {/* Progress percentage */}
            <div style={{
              position: 'absolute',
              top: '12px',
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '0.9rem',
              color: '#ffffff',
              fontWeight: 600
            }}>
              {Math.round(overallProgress)}%
            </div>
          </div>

          {/* Stage List */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            minWidth: '300px'
          }}>
            {stages.map((stage, index) => (
              <div
                key={stage.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  background: index === currentStage 
                    ? 'rgba(168, 85, 247, 0.1)' 
                    : 'transparent',
                  border: index === currentStage 
                    ? '1px solid rgba(168, 85, 247, 0.3)' 
                    : '1px solid transparent',
                  transition: 'all 0.3s ease'
                }}
              >
                {/* Status Icon */}
                <div style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  background: stage.status === 'complete' 
                    ? '#10b981' 
                    : stage.status === 'loading'
                    ? '#a855f7'
                    : stage.status === 'error'
                    ? '#ef4444'
                    : 'rgba(255,255,255,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px'
                }}>
                  {stage.status === 'complete' && '✓'}
                  {stage.status === 'loading' && (
                    <div style={{
                      width: '8px',
                      height: '8px',
                      border: '2px solid transparent',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                  )}
                  {stage.status === 'error' && '✗'}
                </div>

                {/* Stage Name */}
                <div style={{
                  flex: 1,
                  fontSize: '0.9rem',
                  color: stage.status === 'complete' 
                    ? '#10b981' 
                    : stage.status === 'loading'
                    ? '#ffffff'
                    : stage.status === 'error'
                    ? '#ef4444'
                    : 'rgba(255,255,255,0.7)'
                }}>
                  {stage.name}
                </div>

                {/* Progress */}
                {stage.status === 'loading' && (
                  <div style={{
                    fontSize: '0.8rem',
                    color: '#a855f7',
                    minWidth: '40px',
                    textAlign: 'right'
                  }}>
                    {Math.round(stage.progress)}%
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Loading Tips */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            style={{
              marginTop: '2rem',
              textAlign: 'center',
              fontSize: '0.9rem',
              color: 'rgba(255,255,255,0.6)',
              maxWidth: '400px'
            }}
          >
            Building dreams, one sheet at a time...
          </motion.div>

          {/* Health Check Status */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 0.5 }}
            style={{
              position: 'absolute',
              bottom: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '0.8rem',
              color: 'rgba(255,255,255,0.5)',
              textAlign: 'center'
            }}
          >
            System Health: {Object.values(healthCheckResults).filter(Boolean).length}/{Object.keys(healthCheckResults).length} OK
          </motion.div>

          <style jsx>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingSystem;