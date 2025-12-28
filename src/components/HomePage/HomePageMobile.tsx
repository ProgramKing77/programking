import { useRef, useState, useEffect } from 'react';
import { ServiceCard } from '../ServiceCard';
import { MobileServiceCard } from './MobileServiceCard';
import { AccountCreationMobile } from './AccountCreationMobile';
import { ArrowRight } from 'lucide-react';
import logo from 'figma:asset/e702c84c8fb5f6b4af748ca13cfa0b042a4e70cc.png';
import heroImage from 'figma:asset/7dd0402244a3ae14c68fdf6414c2b24024b7b12b.png';

interface HomePageMobileProps {
  services: Array<{
    title: string;
    subtitle: string;
    image: string;
    buttonText: string;
    expandedContent: string;
    onMoreInfo: () => void;
  }>;
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  onNavigate: (page: 'home' | 'programs' | 'account') => void;
  isSignedIn?: boolean;
  onAccountCreated?: (email: string, firstName: string, lastName: string, selectedProgram?: string) => void;
}

export function HomePageMobile({ 
  services, 
  isMenuOpen, 
  setIsMenuOpen,
  onNavigate,
  isSignedIn,
  onAccountCreated
}: HomePageMobileProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showAccountCreation, setShowAccountCreation] = useState(false);
  const [servicesOpacity, setServicesOpacity] = useState(1);
  const [accountOpacity, setAccountOpacity] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [logoOpacity, setLogoOpacity] = useState(1);
  const [buttonOpacity, setButtonOpacity] = useState(1);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleScrollEffect = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      
      // Determine scroll direction and update logo opacity
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        // Scrolling down - fade out
        setLogoOpacity(0);
      } else if (currentScrollY < lastScrollY && currentScrollY < 200) {
        // Scrolling up and near the top - fade in
        setLogoOpacity(1);
      }
      
      setLastScrollY(currentScrollY);
      
      // Adjust button opacity based on scroll
      if (currentScrollY > 100) {
        setButtonOpacity(0);
      } else {
        setButtonOpacity(1 - (currentScrollY / 100));
      }
    };

    window.addEventListener('scroll', handleScrollEffect, { passive: true });
    return () => window.removeEventListener('scroll', handleScrollEffect);
  }, [lastScrollY]);

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const cardWidth = scrollRef.current.offsetWidth - 32;
      const newIndex = Math.round(scrollLeft / cardWidth);
      setCurrentSlide(newIndex);
    }
  };

  const scrollToSlide = (index: number) => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.offsetWidth - 32;
      scrollRef.current.scrollTo({
        left: index * cardWidth,
        behavior: 'smooth'
      });
    }
  };

  const handleFreeProgramAccess = () => {
    if (!showAccountCreation) {
      // Fade out services
      setServicesOpacity(0);
      setTimeout(() => {
        setShowAccountCreation(true);
        // Fade in account creation
        setTimeout(() => {
          setAccountOpacity(1);
        }, 50);
      }, 700);
    }
  };

  const handleBackToServices = () => {
    // Fade out account creation
    setAccountOpacity(0);
    setTimeout(() => {
      setShowAccountCreation(false);
      // Fade in services
      setTimeout(() => {
        setServicesOpacity(1);
      }, 50);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-6 flex items-center justify-between bg-[rgba(0,0,0,0)]">
        <button 
          onClick={() => {
            onNavigate('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="cursor-pointer"
        >
          <img
            src={logo}
            alt="Program King Logo"
            className="h-2.5 transition-opacity duration-300"
            style={{ opacity: logoOpacity }}
          />
        </button>
        <button onClick={() => setIsMenuOpen(true)} className="text-[#D4AF37] p-2 ml-auto">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="4" y1="9" x2="20" y2="9" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
            <line x1="4" y1="15" x2="20" y2="15" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
          </svg>
        </button>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden" style={{ height: 'calc(65vh + 100px)' }}>
        <div 
          className="absolute inset-0"
          style={{ transform: `translateY(${scrollY * 0.5 - 25}px)` }}
        >
          <img
            src={heroImage}
            alt="Athlete training"
            className="w-full h-full object-cover scale-[1.375]"
          />
          <div className="absolute inset-0 bg-black/15" />
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black pointer-events-none" />

        <div 
          className="relative h-full flex flex-col justify-end px-5 items-center"
          style={{ 
            transform: `translateY(${scrollY * 0.2 - 25}px)`,
            paddingBottom: '32px',
            paddingTop: '100px'
          }}
        >
          <h1 
            className="mb-3 leading-tight font-[DM_Sans] font-light text-center"
            style={{ 
              fontSize: '35px',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)' 
            }}
          >
            Performance Based.<br />Results Driven.
          </h1>
          
          <p 
            className="text-gray-300 font-[DM_Sans] font-light text-center mb-18"
            style={{ 
              fontSize: '15px',
              lineHeight: '1.6',
              textShadow: '0 1px 4px rgba(0, 0, 0, 0.5)' 
            }}
          >
            We enhance athleticism, whilst promoting longevity, through purposeful and strategic training systems.
          </p>

          <button
            className="group flex items-center justify-center gap-2 px-6 py-3 bg-[#D4AF37] text-black hover:bg-[#E5C158] transition-all duration-500 font-[DM_Sans] rounded-[25px] mb-2"
            style={{
              fontSize: '11px',
              letterSpacing: '0.12em',
              fontWeight: 500,
              boxShadow: '0 4px 16px rgba(212, 175, 55, 0.3)',
              opacity: buttonOpacity,
              width: '250px',
              marginTop: '10px'
            }}
            onClick={handleFreeProgramAccess}
          >
            <span className="text-[rgb(255,255,255)]">FREE PROGRAM ACCESS</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform text-white" />
          </button>

          <p 
            className="font-[DM_Sans] text-center transition-opacity duration-500"
            style={{ 
              fontSize: '10px',
              letterSpacing: '0.01em',
              opacity: buttonOpacity,
              color: '#CCCCCC',
              marginBottom: '10px'
            }}
          >
            Create an account and claim your free training plan
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section className="relative pb-24 pt-2" style={{ marginTop: 'calc(6vh - 35px)' }}>
        {/* Gradient Overlay for smooth blending */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/0 via-black/30 to-black pointer-events-none" style={{ transform: 'translateY(-128px)' }} />
        
        {!showAccountCreation ? (
          <>
            <div 
              className="relative bg-gradient-to-b from-black/0 via-black/50 to-black transition-opacity duration-700"
              style={{ opacity: servicesOpacity }}
            >
              <h2 className="text-left text-xs tracking-[0.3em] text-[rgb(204,204,204)] mb-4 px-6 text-[10px] font-[DM_Sans]">
                OUR SERVICES
              </h2>

              <div 
                ref={scrollRef}
                onScroll={handleScroll}
                className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-4 px-4"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {services.map((service, index) => (
                  <div key={index} className="flex-shrink-0 w-[calc(100%-32px)] snap-center">
                    <MobileServiceCard {...service} />
                  </div>
                ))}
              </div>

              {/* Pagination Dots */}
              <div className="flex justify-center items-center gap-2 mt-8 px-6">
                {services.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => scrollToSlide(index)}
                    className={`h-px rounded-full transition-all duration-300 ${
                      index === currentSlide ? 'w-12 bg-[#D4AF37]' : 'w-12 bg-gray-700'
                    }`}
                  />
                ))}
              </div>
            </div>
          </>
        ) : (
          <AccountCreationMobile opacity={accountOpacity} onBack={handleBackToServices} onNavigate={onNavigate} onAccountCreated={onAccountCreated} />
        )}
      </section>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}