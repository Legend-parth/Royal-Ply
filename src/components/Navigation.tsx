import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';

const Navigation: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 50;
      setIsScrolled(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Navigation entrance animation
    gsap.fromTo('.nav-container', 
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.2 }
    );

    gsap.fromTo('.nav-link', 
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out', stagger: 0.1, delay: 0.5 }
    );
  }, []);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Products', href: '/products' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Services', href: '/services' },
    { name: 'Contact', href: '/contact' },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className={`nav-container fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-out glass-nav ${
        isScrolled ? 'scrolled' : ''
      }`}>
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <div className="nav-link">
              <Link to="/" className="flex items-center space-x-3 interactive">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
                  </svg>
                </div>
                <span className="text-xl font-bold glow-text font-orbitron">WoodCraft</span>
              </Link>
            </div>
            
            {/* Desktop Navigation Items */}
            <div className="desktop-nav hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`nav-link interactive text-white hover:text-indigo-400 transition-all duration-300 font-medium ${
                    location.pathname === item.href ? 'text-indigo-400' : ''
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button 
                className={`mobile-nav-toggle interactive ${isMobileMenuOpen ? 'active' : ''}`}
                onClick={toggleMobileMenu}
              >
                <span></span>
                <span></span>
                <span></span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      <div className={`mobile-nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className="mobile-nav-link"
            onClick={closeMobileMenu}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </>
  );
};

export default Navigation;