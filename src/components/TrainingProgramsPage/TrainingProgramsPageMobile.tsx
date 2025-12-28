import { useRef, useState, useEffect } from 'react';
import { MobileProgramCard } from './MobileProgramCard';
import { ArrowRight, ShoppingCart } from 'lucide-react';
import logo from 'figma:asset/e702c84c8fb5f6b4af748ca13cfa0b042a4e70cc.png';
import heroImage from 'figma:asset/2d58a6b96f7aae6db5e6d26ff7fa8170a29191c0.png';

interface Program {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  duration?: string;
  sessions?: string;
  time?: string;
}

interface TrainingProgramsPageMobileProps {
  programs: Program[];
  ownedPrograms: string[];
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  onNavigate: (page: 'home' | 'programs' | 'account' | 'trainingPrograms' | 'checkout') => void;
  onProgramAction: (programId: string) => void;
  isSignedIn?: boolean;
  cartItemCount?: number;
}

export function TrainingProgramsPageMobile({
  programs,
  ownedPrograms,
  isMenuOpen,
  setIsMenuOpen,
  onNavigate,
  onProgramAction,
  isSignedIn = false,
  cartItemCount = 0
}: TrainingProgramsPageMobileProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [logoOpacity, setLogoOpacity] = useState(1);

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

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 py-6 flex items-center justify-between">
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
        <div className="flex items-center gap-2">
          {/* Shopping Cart Button */}
          <button
            onClick={() => onNavigate('checkout')}
            className="relative text-[#D4AF37] p-2 hover:text-[#E5C158] transition-colors"
          >
            <ShoppingCart size={18} />
            {cartItemCount > 0 && (
              <span
                className="absolute -top-1 -right-1 bg-[#D4AF37] text-black rounded-full w-4 h-4 flex items-center justify-center font-[DM_Sans]"
                style={{
                  fontSize: '9px',
                  fontWeight: 600
                }}
              >
                {cartItemCount}
              </span>
            )}
          </button>
          
          {/* Menu Button */}
          <button onClick={() => setIsMenuOpen(true)} className="text-[#D4AF37] p-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="4" y1="9" x2="20" y2="9" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
              <line x1="4" y1="15" x2="20" y2="15" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden" style={{ height: 'calc(65vh + 10px)', marginTop: '-38px' }}>
        <div 
          className="absolute inset-0"
          style={{ transform: `translateY(${scrollY * 0.5 + 75}px)` }}
        >
          <img 
            src={heroImage} 
            alt="Athlete training" 
            className="w-full h-full object-cover"
            style={{ objectPosition: 'calc(50% - 12px) calc(50% + 13px)', transform: 'scale(1.6)' }}
          />
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black pointer-events-none" />

        <div 
          className="relative h-full flex flex-col justify-end px-5 items-center"
          style={{ 
            transform: `translateY(${scrollY * 0.2 + 40}px)`,
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
            Performance Driven Training Programs.
          </h1>
          
          <p 
            className="text-gray-300 font-[DM_Sans] font-light text-center mb-18"
            style={{ 
              fontSize: '15px',
              lineHeight: '1.6',
              textShadow: '0 1px 4px rgba(0, 0, 0, 0.5)' 
            }}
          >
            Performance focussed training programs engineered to develop performance capacity and athletic qualities.
          </p>
        </div>
      </section>

      {/* Programs Section */}
      <section className="relative pb-24 pt-2" style={{ marginTop: 'calc(3.84vh)' }}>
        {/* Gradient Overlay for smooth blending */}
        <div 
          className="absolute top-0 left-0 right-0 pointer-events-none z-10"
          style={{
            height: '200px',
            background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.4) 40%, rgba(0, 0, 0, 1) 100%)',
            transform: 'translateY(-200px)'
          }}
        />
        
        <div className="relative bg-gradient-to-b from-black/0 via-black/50 to-black transition-opacity duration-700">
          <h2 className="text-left text-xs tracking-[0.3em] text-[rgb(204,204,204)] mb-4 px-6 text-[10px] font-[DM_Sans]">
            TRAINING PROGRAMS
          </h2>

          <div 
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-4 px-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {programs.map((program, index) => (
              <div key={index} className="flex-shrink-0 w-[calc(100%-32px)] snap-center">
                <MobileProgramCard 
                  {...program} 
                  isOwned={isSignedIn && ownedPrograms.includes(program.id)}
                  onAction={() => onProgramAction(program.id)}
                />
              </div>
            ))}
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center items-center gap-2 mt-8 px-6">
            {programs.map((_, index) => (
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
      </section>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}