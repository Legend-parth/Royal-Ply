import React from 'react';

const EmergencyHeroFix: React.FC = () => {
  return (
    <section 
      className="hero-emergency-fix"
      style={{
        display: 'block',
        width: '100%',
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        textAlign: 'center',
        position: 'relative',
        zIndex: 1
      }}
    >
      <div style={{ maxWidth: '800px', padding: '2rem' }}>
        <h1 style={{ 
          fontSize: 'clamp(2rem, 8vw, 4rem)', 
          fontWeight: 'bold', 
          marginBottom: '1rem',
          lineHeight: '1.2'
        }}>
          Welcome to Our Website
        </h1>
        <p style={{ 
          fontSize: 'clamp(1rem, 4vw, 1.5rem)', 
          marginBottom: '2rem',
          opacity: 0.9
        }}>
          Your hero section is temporarily restored. Please check your original hero component.
        </p>
        <button style={{
          padding: '1rem 2rem',
          fontSize: '1.1rem',
          background: 'rgba(255,255,255,0.2)',
          border: '2px solid white',
          borderRadius: '50px',
          color: 'white',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}>
          Get Started
        </button>
      </div>
    </section>
  );
};

export default EmergencyHeroFix;