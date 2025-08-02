import React from 'react';

interface FixedHeroSectionProps {
  className?: string;
}

const FixedHeroSection: React.FC<FixedHeroSectionProps> = ({ className = '' }) => {
  return (
    <section className={`fixed-hero-section ${className}`}>
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center">
          Hero Section
        </h1>
        <p className="text-lg text-center mt-4">
          Welcome to our amazing website
        </p>
      </div>
    </section>
  );
};

export default FixedHeroSection;