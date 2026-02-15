import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ThemeSplash = ({ isVisible }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none"
          style={{ 
            background: 'var(--bg-dark)',
          }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center gap-3"
          >
            {/* Unique hexagonal loader with orbiting particles */}
            <div className="relative w-24 h-24 flex items-center justify-center">
              {/* Pulsing hexagon background */}
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ 
                  duration: 1.5, 
                  ease: "easeInOut", 
                  repeat: Infinity 
                }}
                className="absolute w-16 h-16"
                style={{
                  clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                  background: 'var(--color-primary)',
                }}
              />
              
              {/* Inner rotating hexagon */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ 
                  duration: 3, 
                  ease: "linear", 
                  repeat: Infinity 
                }}
                className="absolute w-12 h-12"
                style={{
                  clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                  border: '2px solid var(--color-primary)',
                }}
              />

              {/* Orbiting particles */}
              {[0, 120, 240].map((angle, i) => (
                <motion.div
                  key={i}
                  animate={{ rotate: 360 }}
                  transition={{ 
                    duration: 2, 
                    ease: "linear", 
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                  className="absolute w-full h-full"
                >
                  <div 
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                      background: 'var(--color-primary)',
                      boxShadow: '0 0 8px var(--color-primary)',
                      top: '0',
                      left: '50%',
                      transform: 'translateX(-50%)',
                    }}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ThemeSplash;
