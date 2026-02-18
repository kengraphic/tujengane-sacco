
// framer-motion removed: using CSS hover transforms instead
import ScrollReveal from '@/components/ScrollReveal';

const ContactSection = () => {
  return (
    <section id="contact" className="py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 rounded-full bg-gold/10 text-gold text-sm font-medium mb-4">
              <i className="fas fa-envelope mr-2" />
              Get in Touch
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
              Contact Us
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Have questions? We'd love to hear from you.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            {
              icon: 'fa-envelope',
              title: 'Email',
              value: 'tujenganesaccoke@gmail.com',
              link: 'mailto:tujenganesaccoke@gmail.com'
            },
            {
              icon: 'fa-phone',
              title: 'Treasurer',
              value: '0700 464 272',
              subtitle: 'Doreen Wasera',
              link: 'tel:+254700464272'
            },
            {
              icon: 'fa-map-marker-alt',
              title: 'Location',
              value: 'Kenya',
              subtitle: 'Est. 2025'
            }
          ].map((contact, index) => (
            <ScrollReveal key={index} delay={index * 0.1}>
              <div className="p-8 rounded-2xl bg-card border border-border hover:border-gold/30 transition-all text-center premium-card transform transition-transform duration-300 hover:-translate-y-1">
                <div className="w-14 h-14 mx-auto mb-6 rounded-xl bg-gradient-gold flex items-center justify-center">
                  <i className={`fas ${contact.icon} text-xl text-primary`} />
                </div>
                <h4 className="text-lg font-serif font-bold text-foreground mb-2">{contact.title}</h4>
                {contact.link ? (
                  <a 
                    href={contact.link}
                    className="text-muted-foreground hover:text-gold transition-colors break-all"
                  >
                    {contact.value}
                  </a>
                ) : (
                  <p className="text-muted-foreground">{contact.value}</p>
                )}
                {contact.subtitle && (
                  <p className="text-sm text-gold mt-1">{contact.subtitle}</p>
                )}
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
