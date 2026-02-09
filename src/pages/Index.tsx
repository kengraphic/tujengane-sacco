import { useState, useCallback } from 'react';
import GoldenGateEntrance from '@/components/GoldenGateEntrance';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import LeadershipSection from '@/components/sections/LeadershipSection';
import CTASection from '@/components/sections/CTASection';
import ContactSection from '@/components/sections/ContactSection';
import Footer from '@/components/Footer';

const Index = () => {
  const [showContent, setShowContent] = useState(false);

  const handleEntranceComplete = useCallback(() => {
    setShowContent(true);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {!showContent && <GoldenGateEntrance onComplete={handleEntranceComplete} />}
      
      {showContent && (
        <>
          <Navbar />
          <main>
            <HeroSection />
            <AboutSection />
            <LeadershipSection />
            <CTASection />
            <ContactSection />
          </main>
          <Footer />
        </>
      )}
    </div>
  );
};

export default Index;
