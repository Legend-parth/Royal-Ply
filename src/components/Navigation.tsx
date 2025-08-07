import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { motion } from 'framer-motion';
import logo from '../media/RoyalEnterprises.jpg';

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

  // Add logo import


  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'glass-nav scrolled rounded-3xl mx-8 my-4 shadow-xl' : 'glass-nav full-width'}`}
      >
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          {/* Added Logo with cool animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="logo-container"
            style={{
              mixBlendMode: 'screen',
              filter: 'drop-shadow(0 0 10px rgba(147, 51, 234, 0.5))'
            }}
          >
            <Link to="/">
              <img 
                src={logo} 
                alt="Royal Enterprises" 
                className="h-10 w-auto object-contain transition-transform hover:scale-110"
              />
            </Link>
          </motion.div>
          
          {/* Desktop Menu */}
          <div className="hidden lg:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`nav-link text-gray-300 hover:text-white transition-colors ${location.pathname === item.href ? 'text-white font-bold' : ''}`}
              >
                {item.name}
              </Link>
            ))}
          </div>
          
          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
        
        {/* Mobile Menu */}
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
      </nav>
    </>
  );
};

export default Navigation;