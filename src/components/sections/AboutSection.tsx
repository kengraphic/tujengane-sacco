
// framer-motion removed: using CSS hover transforms instead
import ScrollReveal from '@/components/ScrollReveal';
import logo from '@/assets/logo.png';

const AboutSection = () => {
  const values = [
    {
      icon: 'fa-piggy-bank',
      title: 'Saving',
      description: 'Build a secure financial future through consistent weekly contributions.'
    },
    {
      icon: 'fa-chart-line',
      title: 'Growing',
      description: 'Watch your savings grow and access loans to expand your opportunities.'
    },
    {
      icon: 'fa-users',
      title: 'Empowered',
      description: 'Join a community that supports each member\'s financial well-being.'
    }
  ];

  return (
    <section id="about" className="py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 rounded-full bg-gold/10 text-gold text-sm font-medium mb-4">
              <i className="fas fa-star mr-2" />
              About Us
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
              Who We Are
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Building financial stability through collective effort and mutual trust.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <ScrollReveal delay={0.2}>
            <div className="relative">
              <div className="golden-leaf-border rounded-2xl p-8 bg-card">
                <img 
                  src={logo} 
                  alt="TUJENGANE Logo" 
                  className="w-48 h-48 mx-auto mb-6"
                />
                <div className="text-center">
                  <h3 className="text-2xl font-serif font-bold text-primary mb-2">TUJENGANE</h3>
                  <p className="text-gold font-medium">Welfare Group</p>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-gold/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-primary/20 rounded-full blur-2xl" />
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.4}>
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-2xl font-serif font-bold text-foreground flex items-center gap-3">
                  <i className="fas fa-bullseye text-gold" />
                  Our Mission
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  To empower individuals to save, access credit, and improve their financial stability 
                  through a supportive community-driven approach.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-serif font-bold text-foreground flex items-center gap-3">
                  <i className="fas fa-eye text-gold" />
                  Our Vision
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  To improve the financial stability and livelihood of all our members, creating 
                  lasting prosperity for our community.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-primary/5 border border-primary/10">
                <p className="text-foreground leading-relaxed">
                  <i className="fas fa-quote-left text-gold mr-2" />
                  We are a small and growing Savings and Credit Cooperative formed by more than 8 
                  committed members with a shared goal. Each member contributes <strong>KES 150 weekly</strong>, 
                  creating a reliable pool of savings. After the first month, members become eligible 
                  to access loans from our collective fund.
                  <i className="fas fa-quote-right text-gold ml-2" />
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Core Values */}
        <ScrollReveal delay={0.6}>
          <div className="grid md:grid-cols-3 gap-8 mt-20">
            {values.map((value, index) => (
              <div
                key={index}
                className="p-8 rounded-2xl bg-card border border-border hover:border-gold/30 transition-all premium-card transform transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-gold flex items-center justify-center mb-6">
                  <i className={`fas ${value.icon} text-2xl text-primary`} />
                </div>
                <h4 className="text-xl font-serif font-bold text-foreground mb-3">{value.title}</h4>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default AboutSection;
