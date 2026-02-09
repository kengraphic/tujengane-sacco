import { motion } from 'framer-motion';
import welcomeCharacter from '@/assets/welcome-character.png';

const DancingCharacter = () => {
  return (
    <div className="relative w-32 h-32">
      <motion.img
        src={welcomeCharacter}
        alt="Welcome Character"
        className="w-full h-full object-contain"
        animate={{
          y: [0, -15, 0, -15, 0],
          rotate: [0, -5, 0, 5, 0],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      {/* Sparkle effects */}
      <motion.div
        className="absolute -top-2 -right-2 w-4 h-4 text-gold"
        animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
        transition={{ duration: 0.8, repeat: Infinity }}
      >
        <i className="fas fa-star" />
      </motion.div>
      <motion.div
        className="absolute -bottom-1 -left-1 w-3 h-3 text-gold"
        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
      >
        <i className="fas fa-star" />
      </motion.div>
    </div>
  );
};

export default DancingCharacter;
