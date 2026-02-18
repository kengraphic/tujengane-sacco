import { useState, useEffect } from 'react';

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
    <>
      {!isOpen && (
        <>
          {/* Left Door */}
          <div className="fixed top-0 left-0 w-1/2 h-screen z-50 forest-panel" style={{ transform: isOpen ? 'translateX(-100%)' : 'translateX(0)', transition: 'transform 1.2s cubic-bezier(0.76,0,0.24,1)' }}>
            <div className="absolute inset-0 flex items-center justify-end pr-8">
              <div className="border-r-4 border-gold h-[80%]" style={{ opacity: isOpen ? 0 : 1, transition: 'opacity 0.5s' }} />
            </div>
            <div className="absolute inset-y-0 right-0 w-4 bg-gradient-to-l from-gold to-transparent" />
          </div>

          {/* Right Door */}
          <div className="fixed top-0 right-0 w-1/2 h-screen z-50 forest-panel" style={{ transform: isOpen ? 'translateX(100%)' : 'translateX(0)', transition: 'transform 1.2s cubic-bezier(0.76,0,0.24,1)' }}>
            <div className="absolute inset-0 flex items-center justify-start pl-8">
              <div className="border-l-4 border-gold h-[80%]" style={{ opacity: isOpen ? 0 : 1, transition: 'opacity 0.5s' }} />
            </div>
            <div className="absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-gold to-transparent" />
          </div>

          {/* Center Logo */}
          <div className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none" style={{ opacity: isOpen ? 0 : 1, transform: isOpen ? 'scale(1.2)' : 'scale(1)', transition: 'opacity 0.8s, transform 0.8s' }}>
            <div className="text-center">
              <img 
                src={logo} 
                alt="TUJENGANE" 
                className="w-32 h-32 mx-auto mb-4 animate-pulse-glow rounded-full"
              />
              <p className="text-primary-foreground text-2xl font-serif tracking-wider">
                TUJENGANE
              </p>
              <p className="text-gold text-sm tracking-[0.3em] mt-2">
                GROWING TOGETHER
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default GoldenGateEntrance;
