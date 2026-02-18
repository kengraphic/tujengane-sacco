
// framer-motion removed: using CSS transitions instead
import ScrollReveal from '@/components/ScrollReveal';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-gradient-forest relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <ScrollReveal>
          <div className="max-w-3xl mx-auto text-center">
            <div className="mb-8 transform transition-transform duration-500">
              <i className="fas fa-handshake text-6xl text-gold mb-6 block" />
            </div>

            <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary-foreground mb-6">
              Ready to Grow With Us?
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-xl mx-auto">
              Join TUJENGANE today and start your journey towards financial stability. 
              Together, we save. Together, we grow. Together, we thrive.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-gold hover:opacity-90 text-primary font-semibold px-8 py-6 text-lg golden-glow"
                onClick={() => navigate('/auth?mode=signup')}
              >
                <i className="fas fa-user-plus mr-2" />
                Join TUJENGANE
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10 px-8 py-6 text-lg"
                onClick={() => navigate('/auth')}
              >
                <i className="fas fa-sign-in-alt mr-2" />
                Member Login
              </Button>
            </div>

            <div className="mt-12 p-6 rounded-xl bg-primary-foreground/10 border border-primary-foreground/20 inline-block">
              <p className="text-primary-foreground/90">
                <i className="fas fa-phone-alt mr-2 text-gold" />
                Send contributions to: <strong className="text-gold">0700 464 272</strong>
                <span className="block text-sm mt-1 text-primary-foreground/70">
                  Doreen Wasera - Treasurer
                </span>
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default CTASection;
