import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import heroBackground from '@/assets/hero-background.jpg';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroBackground}
          alt="TUJENGANE Community"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-forest-dark/80 via-forest-dark/60 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/20 border border-gold/40 mb-6"
          >
            <i className="fas fa-hands-helping text-gold" />
            <span className="text-cream text-sm font-medium">Empowering Communities Since 2025</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="text-5xl md:text-7xl font-serif font-bold text-cream mb-6"
          >
            Growing{' '}
            <span className="text-gradient-gold">Together</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="text-lg md:text-xl text-cream/80 mb-8 max-w-2xl mx-auto"
          >
            TUJENGANE Welfare Group - A Savings and Credit Cooperative built on 
            trust, transparency, and mutual support. Empowering members through 
            responsible saving and accessible credit.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              size="lg"
              className="bg-gradient-gold hover:opacity-90 text-primary font-semibold px-8 py-6 text-lg golden-glow"
              onClick={() => navigate('/auth?mode=signup')}
            >
              <i className="fas fa-user-plus mr-2" />
              Become a Member
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-cream/40 text-cream hover:bg-cream/10 px-8 py-6 text-lg"
              onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <i className="fas fa-info-circle mr-2" />
              Learn More
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="grid grid-cols-3 gap-8 mt-16 max-w-xl mx-auto"
          >
            {[
              { value: '8+', label: 'Members' },
              { value: 'KES 150', label: 'Weekly' },
              { value: '2025', label: 'Est.' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-serif font-bold text-gold">{stat.value}</div>
                <div className="text-cream/60 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-cream/40 flex items-start justify-center pt-2"
        >
          <div className="w-1.5 h-3 rounded-full bg-gold" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
