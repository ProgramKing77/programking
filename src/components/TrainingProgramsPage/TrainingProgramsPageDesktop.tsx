import { useState, useRef, useEffect } from 'react';
import { ProgramGridCard } from './ProgramGridCard';
import { ShoppingCart } from 'lucide-react';
import logo from 'figma:asset/e702c84c8fb5f6b4af748ca13cfa0b042a4e70cc.png';
import desktopHeroImage from 'figma:asset/2d58a6b96f7aae6db5e6d26ff7fa8170a29191c0.png';

interface Program {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  duration?: string;
  sessions?: string;
  time?: string;
}

interface TrainingProgramsPageDesktopProps {
  programs: Program[];
  ownedPrograms: string[];
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  onNavigate: (page: 'home' | 'programs' | 'account' | 'trainingPrograms' | 'checkout') => void;
  onProgramAction: (programId: string) => void;
  isSignedIn?: boolean;
  cartItemCount?: number;
}

export function TrainingProgramsPageDesktop({
  programs,
  ownedPrograms,
  isMenuOpen,
  setIsMenuOpen,
  onNavigate,
  onProgramAction,
  isSignedIn = false,
  cartItemCount = 0
}: TrainingProgramsPageDesktopProps) {
  const [scrollY, setScrollY] = useState(0);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [logoOpacity, setLogoOpacity] = useState(1);

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
      } else if (currentScrollY < lastScrollY && currentScrollY < 200) {
        // Scrolling up and near the top - fade in
        setLogoOpacity(1);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const scrollToSlide = (index: number) => {
    if (scrollRef.current) {
      const cards = scrollRef.current.children;
      if (cards[index]) {
        cards[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
        setCurrentSlide(index);
      }
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const cardWidth = scrollRef.current.offsetWidth;
      const newIndex = Math.round(scrollLeft / cardWidth);
      setCurrentSlide(newIndex);
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
        <div className="flex items-center gap-4">
          {/* Shopping Cart Button */}
          <button
            onClick={() => onNavigate('checkout')}
            className="relative text-[#D4AF37] p-2 hover:text-[#E5C158] transition-colors"
          >
            <ShoppingCart size={23} />
            {cartItemCount > 0 && (
              <span
                className="absolute -top-1 -right-1 bg-[#D4AF37] text-black rounded-full w-5 h-5 flex items-center justify-center font-[DM_Sans]"
                style={{
                  fontSize: '10px',
                  fontWeight: 600
                }}
              >
                {cartItemCount}
              </span>
            )}
          </button>
          
          {/* Menu Button */}
          <button onClick={() => setIsMenuOpen(true)} className="text-[#D4AF37] p-2">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="6" y1="12" x2="26" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="6" y1="20" x2="26" y2="20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden" style={{ marginTop: '-88px' }}>
        {/* Background Image */}
        <div 
          className="absolute inset-0"
          style={{ transform: `translateY(${scrollY * 0.5}px)` }}
        >
          <img
            src={desktopHeroImage}
            alt="Athlete training"
            className="w-full h-full object-cover"
            style={{ objectPosition: 'center calc(20% - 50px)' }}
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black opacity-20" />
        </div>

        {/* Content */}
        <div 
          className="relative h-full flex flex-col justify-center px-16 max-w-7xl"
          style={{ transform: `translateY(calc(50px + ${scrollY * 0.2}px))` }}
        >
          <div className="max-w-2xl" style={{ marginTop: '47.5px' }}>
            <h1 
              className="mb-6 font-[DM_Sans] font-light text-white"
              style={{
                fontSize: '64px',
                letterSpacing: '-0.01em',
                lineHeight: '1.1',
                textShadow: '0 4px 12px rgba(0, 0, 0, 0.6)'
              }}
            >
              Performance<br />
              Driven Training<br />
              Programs.
            </h1>
            
            <p 
              className="mb-24 font-[DM_Sans] font-light text-gray-200"
              style={{
                fontSize: '16px',
                letterSpacing: '0.01em',
                lineHeight: '1.6',
                textShadow: '0 1px 4px rgba(0, 0, 0, 0.5)'
              }}
            >
              Performance focussed training programs engineered to develop<br />performance capacity and athletic qualities.
            </p>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
      </section>

      {/* Programs Section */}
      <section className="relative py-[0px] px-[64px] pb-12" style={{ marginTop: '-100px' }}>
        {/* Gradient Blend Overlay */}
        <div 
          className="absolute top-0 left-0 right-0 pointer-events-none z-10"
          style={{
            height: '300px',
            background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.3) 30%, rgba(0, 0, 0, 0.7) 60%, rgba(0, 0, 0, 1) 100%)'
          }}
        />

        {/* Solid background behind content */}
        <div className="absolute top-[300px] left-0 right-0 bottom-0 bg-black" />
        
        <h2 
          className="text-left tracking-[0.3em] text-[rgb(204,204,204)] mb-5 font-[DM_Sans] relative z-20"
          style={{
            fontSize: '16.5px',
            letterSpacing: '0.35em'
          }}
        >
          TRAINING PROGRAMS
        </h2>

        {/* Program Cards Grid */}
        <div 
          className="grid grid-cols-2 gap-6 relative z-20 max-w-7xl mx-auto pb-20"
        >
          {programs.map((program) => (
            <ProgramGridCard
              key={program.id}
              id={program.id}
              title={program.title}
              subtitle={program.subtitle}
              image={program.image}
              duration={program.duration}
              sessions={program.sessions}
              time={program.time}
              isOwned={isSignedIn && ownedPrograms.includes(program.id)}
              onAction={() => onProgramAction(program.id)}
            />
          ))}
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