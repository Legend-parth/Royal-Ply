import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PageLoader: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="page-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="loader-content">
            <div className="wood-stack-loader">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="wood-piece-loader"
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: i * 0.2, duration: 0.6 }}
                />
              ))}
            </div>
            <motion.div
              className="loader-text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              WoodCraft Premium
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PageLoader;