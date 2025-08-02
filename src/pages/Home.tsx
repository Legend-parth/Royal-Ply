import React from 'react';
import { motion } from 'framer-motion';
import HeroSection from '../components/HeroSection';
import WaterResistanceSection from '../components/WaterResistanceSection';
import EnhancedDurabilitySection from '../components/EnhancedDurabilitySection';
import VarietySection from '../components/VarietySection';
import TestimonialsSection from '../components/TestimonialsSection';
import StatsSection from '../components/StatsSection';

const Home: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="home-container"
    >
      <HeroSection />
      <WaterResistanceSection />
      <EnhancedDurabilitySection />
      <VarietySection />
      <TestimonialsSection />
      <StatsSection />
    </motion.div>
  );
};

export default Home;