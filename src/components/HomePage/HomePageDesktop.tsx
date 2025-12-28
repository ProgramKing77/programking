import { useState, useRef, useEffect } from 'react';
import { DesktopServiceCard } from './DesktopServiceCard';
import { AccountCreationDesktop } from './AccountCreationDesktop';
import { ArrowRight } from 'lucide-react';
import logo from 'figma:asset/e702c84c8fb5f6b4af748ca13cfa0b042a4e70cc.png';
import desktopHeroImage from 'figma:asset/12e991f3c574a84c621d028f55eb2a0b75c41b2e.png';

interface HomePageDesktopProps {
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

export function HomePageDesktop({ 
  services, 
  isMenuOpen, 
  setIsMenuOpen,
  onNavigate,
  isSignedIn = false,
  onAccountCreated
}: HomePageDesktopProps) {
  const [scrollY, setScrollY] = useState(0);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [logoOpacity, setLogoOpacity] = useState(1);
  const [buttonOpacity, setButtonOpacity] = useState(1);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showAccountCreation, setShowAccountCreation] = useState(false);
  const [servicesOpacity, setServicesOpacity] = useState(1);
  const [accountOpacity, setAccountOpacity] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      
      // Determine scroll direction and update logo opacity
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        // Scrolling down - fade out
        setLogoOpacity(0);
        setButtonOpacity(0);
      } else if (currentScrollY < lastScrollY && currentScrollY < 200) {
        // Scrolling up and near the top - fade in
        setLogoOpacity(1);
        setButtonOpacity(1);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleFreeProgramAccess = () => {
    if (isSignedIn) {
      onNavigate('account');
    } else {
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

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const currentRef = scrollRef.current;
    if (currentRef) {
      const slideWidth = currentRef.scrollWidth / services.length;
      const currentSlide = Math.round(currentRef.scrollLeft / slideWidth);
      setCurrentSlide(currentSlide);
    }
  };

  const scrollToSlide = (index: number) => {
    const currentRef = scrollRef.current;
    if (currentRef) {
      const slideWidth = currentRef.scrollWidth / services.length;
      currentRef.scrollLeft = index * slideWidth;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-12 py-8 flex items-center justify-between">
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
            className="h-3.5 transition-opacity duration-500"
            style={{ opacity: logoOpacity }}
          />
        </button>
        <button onClick={() => setIsMenuOpen(true)} className="text-[#D4AF37] p-2">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="6" y1="12" x2="26" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="6" y1="20" x2="26" y2="20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </header>

      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0"
          style={{ transform: `translateY(${scrollY * 0.5}px)` }}
        >
          <img
            src={desktopHeroImage}
            alt="Athlete training"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div 
          className="relative h-full flex flex-col justify-center px-16 max-w-7xl"
          style={{ transform: `translateY(${scrollY * 0.2}px)` }}
        >
          <div className="max-w-2xl">
            <h1 
              className="mb-4 leading-tight font-[DM_Sans] font-light"
              style={{ 
                fontSize: '64px',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)' 
              }}
            >
              Performance Based.<br />Results Driven.
            </h1>
            
            <p 
              className="text-gray-300 font-[DM_Sans] font-light"
              style={{ 
                fontSize: '16px',
                lineHeight: '1.6',
                textShadow: '0 1px 4px rgba(0, 0, 0, 0.5)',
                marginBottom: '107px'
              }}
            >
              We enhance athleticism, whilst promoting longevity,<br />through purposeful and strategic training systems.
            </p>

            <button
              className="group flex items-center justify-center gap-3 px-8 py-4 bg-[#D4AF37] text-black hover:bg-[#E5C158] transition-all duration-500 font-[DM_Sans] mb-3 rounded-[25px]"
              style={{
                fontSize: '13px',
                letterSpacing: '0.12em',
                fontWeight: 500,
                boxShadow: '0 4px 16px rgba(212, 175, 55, 0.3)',
                width: '330px',
                opacity: buttonOpacity
              }}
              onClick={handleFreeProgramAccess}
            >
              <span className="text-[rgb(255,255,255)]">FREE PROGRAM ACCESS</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform text-white" />
            </button>

            <p 
              className="font-[DM_Sans] transition-opacity duration-500"
              style={{
                fontSize: '12px',
                letterSpacing: '0.01em',
                width: '330px',
                textAlign: 'center',
                color: '#CCCCCC',
                opacity: buttonOpacity
              }}
            >
              Create an account and claim your free training plan
            </p>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
      </section>

      {/* Services Section or Account Creation */}
      <section className="relative py-[0px] px-[64px] bg-black pb-12" style={{ marginTop: '-95px' }}>
        {/* Gradient Blend Overlay */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/0 via-black/30 to-black pointer-events-none" style={{ transform: 'translateY(-128px)' }} />
        
        {!showAccountCreation ? (
          <div className="transition-opacity duration-700" style={{ opacity: servicesOpacity }}>
            <h2 
              className="text-left tracking-[0.3em] text-[rgb(204,204,204)] mb-5 font-[DM_Sans] relative z-20"
              style={{
                fontSize: '16.5px',
                letterSpacing: '0.35em'
              }}
            >
              OUR SERVICES
            </h2>

            {/* Service Cards Container */}
            <div 
              ref={scrollRef}
              onScroll={handleScroll}
              className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-8 relative z-20"
              style={{ 
                scrollbarWidth: 'none', 
                msOverflowStyle: 'none',
                width: '100vw',
                position: 'relative',
                left: '50%',
                right: '50%',
                marginLeft: '-50vw',
                marginRight: '-50vw',
                paddingLeft: '4rem',
                paddingRight: '4rem'
              }}
            >
              {services.map((service, index) => (
                <div 
                  key={index} 
                  className="flex-shrink-0 snap-center"
                  style={{ width: 'calc(100% - 8rem)' }}
                >
                  <DesktopServiceCard
                    title={service.title}
                    subtitle={service.subtitle}
                    image={service.image}
                    expandedContent={service.expandedContent}
                    onMoreInfo={service.onMoreInfo}
                  />
                </div>
              ))}
            </div>

            {/* Pagination Dots */}
            <div className="flex justify-center items-center gap-3 mt-12 relative z-20">
              {services.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollToSlide(index)}
                  className={`h-0.5 rounded-full transition-all duration-300 ${
                    index === currentSlide ? 'w-16 bg-[#D4AF37]' : 'w-16 bg-gray-700'
                  }`}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="transition-opacity duration-700" style={{ opacity: accountOpacity }}>
            <AccountCreationDesktop
              onClose={handleBackToServices}
              onNavigate={onNavigate}
              onAccountCreated={onAccountCreated}
            />
          </div>
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