import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-black"
    >
      <div className="text-center px-6">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'back.out(1.7)' }}
        >
          <h1 className="text-9xl font-bold text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text mb-8">
            404
          </h1>
        </motion.div>
        
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2 className="text-4xl font-bold text-white mb-6">
            Page Not Found
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-md mx-auto">
            Looks like this page got lost in the woodwork. Let's get you back on track.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="space-y-4"
        >
          <Link
            to="/"
            className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-full hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25"
          >
            Back to Home
          </Link>
          
          <div className="flex justify-center space-x-6 mt-8">
            <Link to="/about" className="text-gray-400 hover:text-purple-400 transition-colors">
              About
            </Link>
            <Link to="/products" className="text-gray-400 hover:text-purple-400 transition-colors">
              Products
            </Link>
            <Link to="/contact" className="text-gray-400 hover:text-purple-400 transition-colors">
              Contact
            </Link>
          </div>
        </motion.div>
        
        {/* Animated Wood Pieces */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-4 h-8 bg-gradient-to-b from-amber-600 to-amber-800 rounded-sm"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + i * 10}%`,
              }}
              animate={{
                rotate: [0, 360],
                y: [0, -20, 0],
              }}
              transition={{
                duration: 3,
                delay: i * 0.2,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
            />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default NotFound;