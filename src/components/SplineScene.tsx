import React, { useEffect, useRef, useState } from 'react';

interface SplineSceneProps {
  mousePosition: { x: number; y: number };
}

const SplineScene: React.FC<SplineSceneProps> = ({ mousePosition }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Simulate loading state
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleSplineLoad = () => {
    setIsLoaded(true);
    setHasError(false);
  };

  const handleSplineError = () => {
    setHasError(true);
    setIsLoaded(false);
  };

  return (
    <div ref={containerRef} className="spline-container">
      {!isLoaded && !hasError && (
        <div className="spline-placeholder">
          <div className="loading-spinner">
            <div className="spinner-ring"></div>
          </div>
          <h3>Loading 3D Model...</h3>
          <p>Preparing interactive plywood visualization</p>
        </div>
      )}
      
      {hasError && (
        <div className="spline-placeholder">
          <h3>3D Model Placeholder</h3>
          <p>Interactive plywood stack model will be displayed here once Spline URL is configured.</p>
          <div className="placeholder-cube">
            <div className="cube-face front"></div>
            <div className="cube-face back"></div>
            <div className="cube-face right"></div>
            <div className="cube-face left"></div>
            <div className="cube-face top"></div>
            <div className="cube-face bottom"></div>
          </div>
        </div>
      )}
      
      {/* Spline Viewer - URL to be added */}
      {/* Spline Viewer will be added when URL is provided */}
      {/* 
      <spline-viewer 
        url="YOUR_SPLINE_URL_HERE"
        style={{ 
          display: isLoaded && !hasError ? 'block' : 'none',
          width: '100%',
          height: '100%'
        }}
        onLoad={handleSplineLoad}
        onError={handleSplineError}
      />
      */}
    </div>
  );
};

export default SplineScene;