import React from 'react';

interface LoadingAnimationProps {
  isVisible: boolean;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ isVisible }) => {
  return (
    <div className={`loading-overlay ${!isVisible ? 'hidden' : ''}`}>
      <div className="text-center">
        <div className="wood-stack mb-8">
          <div className="wood-piece"></div>
          <div className="wood-piece"></div>
          <div className="wood-piece"></div>
          <div className="wood-piece"></div>
          <div className="wood-piece"></div>
        </div>
        <div className="text-purple-400 text-lg font-semibold">
          Building Excellence...
        </div>
      </div>
    </div>
  );
};

export default LoadingAnimation;