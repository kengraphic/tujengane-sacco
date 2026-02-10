import { motion } from 'framer-motion';
import ScrollReveal from '@/components/ScrollReveal';
import chairpersonImg from '@/assets/chairperson.png';
import secretaryImg from '@/assets/secretary.png';
import assistantSecretaryImg from '@/assets/assistant-secretary.png';

const LeadershipSection = () => {
  const leaders = [
    {
      name: 'Mr. Eliud Sifuna',
      role: 'Chairperson',
      image: chairpersonImg,
      description: 'Leading with vision and integrity'
    },
    {
      name: 'Miss. Doreen Wasera',
      role: 'Treasurer',
      icon: 'fa-coins',
      description: 'Managing our collective resources'
    },
    {
      name: 'Mr. Brian',
      role: 'Secretary',
      image: secretaryImg,
      description: 'Keeping records and communications'
    },
    {
      name: 'Miss. Janet Mbatha',
      role: 'Assistant Secretary',
      image: assistantSecretaryImg,
      description: 'Supporting administrative duties'
    }
  ];

  return (
    <section id="leadership" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <i className="fas fa-crown mr-2" />
              Leadership
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
              Our Leaders
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Dedicated individuals committed to serving our members with transparency and integrity.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {leaders.map((leader, index) => (
            <ScrollReveal key={index} delay={index * 0.1}>
              <motion.div
                whileHover={{ y: -10, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-gold rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
                <div className="relative p-8 rounded-2xl bg-card border border-border group-hover:border-gold/50 transition-all text-center">
                  {/* Avatar */}
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden bg-gradient-forest flex items-center justify-center">
                    {leader.image ? (
                      <img src={leader.image} alt={leader.name} className="w-full h-full object-cover" />
                    ) : (
                      <i className={`fas ${leader.icon} text-3xl text-primary-foreground`} />
                    )}
                  </div>
                  
                  {/* Info */}
                  <h4 className="text-lg font-serif font-bold text-foreground mb-1">
                    {leader.name}
                  </h4>
                  <p className="text-gold font-medium mb-3">{leader.role}</p>
                  <p className="text-sm text-muted-foreground">{leader.description}</p>

                  {/* Decorative border */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-gradient-gold rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LeadershipSection;
