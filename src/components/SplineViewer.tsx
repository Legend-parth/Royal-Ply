import React, { Suspense, useState, useRef, useEffect } from 'react';
import Spline from '@splinetool/react-spline';
import { useBreakpoint } from './ResponsiveBreakpoints';
import { animationQueue } from '../utils/animationQueue';

interface SplineViewerProps {
  url?: string;
  sceneId?: string;
  className?: string;
  style?: React.CSSProperties;
}

// Removed the commented Spline component usage that was causing confusion

// Fixed the Spline component props:
<Spline
  scene={url || sceneId}
  onLoad={handleLoad}
  onError={handleError}
  style={{
    width: `${dimensions.width}px`,
    height: `${dimensions.height}px`,
    background: 'transparent',
    overflow: 'visible',
    transform: `scale(${dimensions.scale})`,
    transformOrigin: 'center'
  }}
/>

const SplineViewer: React.FC<SplineViewerProps> = ({ url, className = '', style = {} }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { isMobile, isTablet, width } = useBreakpoint();
  const maxRetries = 3;

  // Calculate responsive dimensions
  const getSplineDimensions = () => {
    if (isMobile) {
      return {
        width: Math.min(width * 0.9, 350),
        height: Math.min(width * 0.9, 350),
        scale: 0.8
      };
    } else if (isTablet) {
      return {
        width: Math.min(width * 0.45, 450),
        height: Math.min(width * 0.45, 450),
        scale: 0.9
      };
    } else {
      return {
        width: Math.min(width * 0.4, 500),
        height: Math.min(width * 0.4, 500),
        scale: 1
      };
    }
  };

  const dimensions = getSplineDimensions();

  const handleLoad = () => {
    setIsLoaded(true);
    setHasError(false);
    setRetryCount(0);
    
    // Add to animation queue for proper loading sequence
    // Update the animation queue call:
    animationQueue.add({
      id: 'spline-load-animation',
      element: containerRef.current || document.createElement('div'),
      priority: 'medium',
      maxRetries: 1,
      animation: async () => {
        return new Promise<void>((resolve) => {
          if (containerRef.current) {
            const splineElement = containerRef.current.querySelector('canvas');
            if (splineElement) {
              splineElement.style.opacity = '0';
              splineElement.style.transform = 'scale(0.8)';
              
              setTimeout(() => {
                splineElement.style.transition = 'all 0.8s ease-out';
                splineElement.style.opacity = '1';
                splineElement.style.transform = 'scale(1)';
                resolve();
              }, 100);
            } else {
              resolve();
            }
          } else {
            resolve();
          }
        });
      }
    });
  };

  const handleError = () => {
    if (retryCount < maxRetries) {
      setRetryCount(prev => prev + 1);
      // Retry after delay
      setTimeout(() => {
        setHasError(false);
        setIsLoaded(false);
      }, 1000 * retryCount);
    } else {
      setHasError(true);
      setIsLoaded(false);
    }
  };

  // Auto-retry mechanism
  useEffect(() => {
    if (!isLoaded && !hasError && retryCount > 0) {
      const timer = setTimeout(() => {
        handleLoad();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [retryCount, isLoaded, hasError]);

  // Enhanced fallback plywood stack
  const renderFallback = () => (
    <div className="spline-fallback">
      {retryCount > 0 && retryCount < maxRetries && (
        <div className="retry-indicator">
          <div className="retry-spinner"></div>
          <p>Retrying... ({retryCount}/{maxRetries})</p>
        </div>
      )}
      <div className="fallback-plywood-stack">
        <div className="plywood-stack-container">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="plywood-layer"
              style={{
                position: 'absolute',
                width: `${200 - i * 5}px`,
                height: `${140 - i * 3}px`,
                background: `
                  linear-gradient(45deg, 
                    ${['#8B4513', '#A0522D', '#CD853F', '#DEB887', '#D2691E', '#B8860B'][i]} 0%, 
                    ${['#A0522D', '#CD853F', '#DEB887', '#D2691E', '#B8860B', '#DAA520'][i]} 100%
                  ),
                  repeating-linear-gradient(90deg, 
                    transparent, 
                    transparent 2px, 
                    rgba(0,0,0,0.1) 2px, 
                    rgba(0,0,0,0.1) 4px
                  )
                `,
                borderRadius: '6px',
                border: '1px solid rgba(139, 69, 19, 0.3)',
                opacity: 0.9 - i * 0.1,
                transform: `
                  translateZ(${i * 6}px) 
                  rotateX(${i * 1.5}deg) 
                  rotateY(${i * 1}deg)
                `,
                boxShadow: '0 2px 15px rgba(139, 69, 19, 0.3)',
                animation: `floatLayer${i} ${4 + i * 0.5}s infinite ease-in-out`,
                left: '50%',
                top: '50%',
                marginLeft: `${-(200 - i * 5) / 2}px`,
                marginTop: `${-(140 - i * 3) / 2}px`
              }}
            >
              {/* Wood grain texture */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: `
                  repeating-linear-gradient(0deg, 
                    transparent, 
                    transparent 2px, 
                    rgba(0,0,0,0.05) 2px, 
                    rgba(0,0,0,0.05) 4px
                  )
                `,
                borderRadius: '5px'
              }} />
              
              {/* Brand stamp on top layer */}
              {i === 5 && (
                <div style={{
                  position: 'absolute',
                  bottom: '10px',
                  right: '10px',
                  background: 'rgba(139, 69, 19, 0.8)',
                  color: '#FFD700',
                  padding: '2px 6px',
                  borderRadius: '3px',
                  fontSize: '8px',
                  fontWeight: 'bold',
                  fontFamily: 'Orbitron, monospace',
                  border: '1px solid #FFD700',
                  boxShadow: '0 0 8px rgba(255, 215, 0, 0.3)'
                }}>
                  PREMIUM
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {hasError && retryCount >= maxRetries && (
        <div className="error-message">
          <h3>3D Model Unavailable</h3>
          <p>Showing premium plywood stack</p>
        </div>
      )}
    </div>
  );

  // Loading component with progress
  const renderLoading = () => (
    <div className="spline-loading">
      <div className="loading-content">
        <div className="loading-spinner">
          <div className="spinner-ring"></div>
          <div className="spinner-inner"></div>
        </div>
        <h3>Loading 3D Model...</h3>
        <p>Preparing interactive visualization</p>
        {retryCount > 0 && (
          <div className="retry-info">
            <small>Retry attempt {retryCount}/{maxRetries}</small>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div 
      ref={containerRef}
      className={`spline-container ${className}`}
      style={{
        width: `${dimensions.width}px`,
        height: `${dimensions.height}px`,
        maxWidth: '100%',
        maxHeight: '100%',
        position: 'relative',
        overflow: 'visible',
        background: 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto',
        ...style
      }}
    >
      {/* Loading State */}
      {!isLoaded && !hasError && renderLoading()}

      {/* Error State with Enhanced Fallback */}
      {hasError && renderFallback()}

      {/* Spline Component with Transparent Background */}
      <Suspense fallback={renderLoading()}>
        <div style={{ 
          width: `${dimensions.width}px`, 
          height: `${dimensions.height}px`,
          background: 'transparent',
          overflow: 'visible',
          display: isLoaded ? 'block' : 'none'
        }}>
          <Spline
            sceneId={url}
            onLoad={handleLoad}
            onError={handleError}
            style={{
              width: `${dimensions.width}px`,
              height: `${dimensions.height}px`,
              background: 'transparent',
              overflow: 'visible',
              transform: `scale(${dimensions.scale})`,
              transformOrigin: 'center'
            }}
          />
        </div>
      </Suspense>

      <style>{`
        .spline-container {
          background: transparent !important;
          min-height: 300px;
        }

        .spline-loading {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          backdrop-filter: blur(5px);
          z-index: 10;
        }

        .loading-content {
          text-align: center;
          color: white;
          background: rgba(0, 0, 0, 0.3);
          padding: 2rem;
          border-radius: 15px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .loading-spinner {
          margin: 0 auto 1rem;
          width: 60px;
          height: 60px;
          position: relative;
        }

        .spinner-ring {
          width: 100%;
          height: 100%;
          border: 4px solid rgba(147, 51, 234, 0.3);
          border-top: 4px solid #9333ea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .spinner-inner {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 30px;
          height: 30px;
          border: 2px solid rgba(147, 51, 234, 0.5);
          border-bottom: 2px solid transparent;
          border-radius: 50%;
          animation: spin 0.8s linear infinite reverse;
        }

        .retry-indicator {
          position: absolute;
          top: 10px;
          right: 10px;
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 165, 0, 0.1);
          padding: 8px 12px;
          border-radius: 8px;
          border: 1px solid rgba(255, 165, 0, 0.3);
          color: #FFA500;
          font-size: 12px;
        }

        .retry-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 165, 0, 0.3);
          border-top: 2px solid #FFA500;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .retry-info {
          margin-top: 8px;
          color: rgba(255, 255, 255, 0.7);
        }

        .error-message {
          margin-top: 1rem;
          padding: 1rem;
          background: rgba(220, 38, 38, 0.1);
          border: 1px solid rgba(220, 38, 38, 0.3);
          border-radius: 8px;
          color: #fca5a5;
          text-align: center;
        }

        .error-message h3 {
          margin: 0 0 0.5rem 0;
          font-size: 1rem;
        }

        .error-message p {
          margin: 0;
          font-size: 0.875rem;
          opacity: 0.8;
        }

        .spline-fallback {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: transparent;
          color: white;
          text-align: center;
        }

        .fallback-plywood-stack {
          position: relative;
          width: ${dimensions.width * 0.8}px;
          height: ${dimensions.height * 0.8}px;
          margin-bottom: 2rem;
          perspective: 1000px;
        }

        .plywood-stack-container {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          animation: rotateStack 20s infinite linear;
        }

        ${[...Array(6)].map((_, i) => `
          @keyframes floatLayer${i} {
            0%, 100% { 
              transform: translateZ(${i * 6}px) rotateX(${i * 1.5}deg) rotateY(${i * 1}deg) translateY(0px);
            }
            50% { 
              transform: translateZ(${i * 6}px) rotateX(${i * 1.5 + 3}deg) rotateY(${i * 1 + 2}deg) translateY(-${3 + i}px);
            }
          }
        `).join('')}

        @keyframes rotateStack {
          0% { transform: rotateY(0deg) rotateX(-10deg); }
          100% { transform: rotateY(360deg) rotateX(-10deg); }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Performance optimizations */
        .plywood-stack-container,
        .plywood-layer,
        .spinner-ring,
        .spinner-inner {
          will-change: transform;
          backface-visibility: hidden;
        }
      `}</style>
    </div>
  );
};

export default SplineViewer;