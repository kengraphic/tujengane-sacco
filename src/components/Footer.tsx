import logo from '@/assets/logo.png';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="py-12 bg-forest-dark">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Logo & Info */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src={logo} alt="TUJENGANE" className="w-12 h-12 rounded-full" />
              <div>
                <h3 className="font-serif text-xl font-bold text-primary-foreground">TUJENGANE</h3>
                <p className="text-gold text-sm">Welfare Group</p>
              </div>
            </div>
            <p className="text-primary-foreground/70 max-w-md">
              A Savings and Credit Cooperative built on trust, transparency, and mutual support. 
              Empowering members through responsible saving and accessible credit.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg font-bold text-primary-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {['Home', 'About', 'Leadership', 'Contact'].map((link) => (
                <li key={link}>
                  <a 
                    href={`/#${link.toLowerCase()}`}
                    className="text-primary-foreground/70 hover:text-gold transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-lg font-bold text-primary-foreground mb-4">Contact</h4>
            <ul className="space-y-2 text-primary-foreground/70">
              <li className="flex items-center gap-2">
                <i className="fas fa-envelope text-gold" />
                <a href="mailto:tujenganesaccoke@gmail.com" className="hover:text-gold transition-colors text-sm">
                  tujenganesaccoke@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <i className="fas fa-phone text-gold" />
                <a href="tel:+254700464272" className="hover:text-gold transition-colors">
                  0700 464 272
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-primary-foreground/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-primary-foreground/60 text-sm">
            © {new Date().getFullYear()} TUJENGANE Welfare Group. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/auth" className="text-primary-foreground/60 hover:text-gold transition-colors text-sm">
              Member Login
            </Link>
            <Link to="/auth?mode=signup" className="text-primary-foreground/60 hover:text-gold transition-colors text-sm">
              Join Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
