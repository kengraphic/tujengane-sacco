import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '@/assets/logo.png';

interface GoldenGateEntranceProps {
  onComplete: () => void;
}

const GoldenGateEntrance = ({ onComplete }: GoldenGateEntranceProps) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 500);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 2500);

    return () => {
      clearTimeout(timer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isOpen && (
        <>
          {/* Left Door */}
          <motion.div
            initial={{ x: 0 }}
            animate={isOpen ? { x: '-100%' } : { x: 0 }}
            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
            className="fixed top-0 left-0 w-1/2 h-screen z-50 forest-panel"
          >
            <div className="absolute inset-0 flex items-center justify-end pr-8">
              <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: isOpen ? 0 : 1 }}
                transition={{ duration: 0.5 }}
                className="border-r-4 border-gold h-[80%]"
              />
            </div>
            <div className="absolute inset-y-0 right-0 w-4 bg-gradient-to-l from-gold to-transparent" />
          </motion.div>

          {/* Right Door */}
          <motion.div
            initial={{ x: 0 }}
            animate={isOpen ? { x: '100%' } : { x: 0 }}
            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
            className="fixed top-0 right-0 w-1/2 h-screen z-50 forest-panel"
          >
            <div className="absolute inset-0 flex items-center justify-start pl-8">
              <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: isOpen ? 0 : 1 }}
                transition={{ duration: 0.5 }}
                className="border-l-4 border-gold h-[80%]"
              />
            </div>
            <div className="absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-gold to-transparent" />
          </motion.div>

          {/* Center Logo */}
          <motion.div
            initial={{ opacity: 1, scale: 1 }}
            animate={isOpen ? { opacity: 0, scale: 1.2 } : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center"
            >
              <img 
                src={logo} 
                alt="TUJENGANE" 
                className="w-32 h-32 mx-auto mb-4 animate-pulse-glow rounded-full"
              />
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-primary-foreground text-2xl font-serif tracking-wider"
              >
                TUJENGANE
              </motion.p>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-gold text-sm tracking-[0.3em] mt-2"
              >
                GROWING TOGETHER
              </motion.p>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default GoldenGateEntrance;
