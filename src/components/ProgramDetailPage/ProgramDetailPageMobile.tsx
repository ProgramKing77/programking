import { useState, useRef, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import { MobileSessionCard } from './MobileSessionCard';
import logo from 'figma:asset/e702c84c8fb5f6b4af748ca13cfa0b042a4e70cc.png';

interface Session {
  id: string;
  week: number;
  session: string;
  tempo: string;
  tempoDetail: string;
  exerciseCount: number;
  exerciseDetails: string;
  isComplete: boolean;
  image?: string;
}

interface ProgramDetailPageMobileProps {
  programId: string;
  programTitle: string;
  programSubtitle: string;
  progressPercentage: number;
  sessions: Session[];
  heroImage: string;
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  previousPage: 'trainingPrograms' | 'account';
  onNavigate: (page: 'home' | 'programs' | 'account' | 'trainingPrograms', programId?: string) => void;
  onSessionAction: (sessionId: string) => void;
}

export function ProgramDetailPageMobile({
  programTitle,
  programSubtitle,
  progressPercentage,
  sessions,
  heroImage,
  isMenuOpen,
  setIsMenuOpen,
  previousPage,
  onNavigate,
  onSessionAction
}: ProgramDetailPageMobileProps) {
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
            className="h-2.5"
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

      {/* Back Button - positioned below header */}
      <div className="fixed top-0 left-0 z-50 px-6" style={{ paddingTop: 'calc(1.5rem + 10px + 2rem)' }}>
        <button
          onClick={() => {
            onNavigate(previousPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2 group/btn"
          style={{ opacity: logoOpacity }}
        >
          <ChevronLeft 
            size={16} 
            className="transition-transform group-hover/btn:-translate-x-1" 
            style={{ color: '#D4AF37' }}
          />
          <span
            className="font-[DM_Sans]"
            style={{
              fontSize: '10px',
              letterSpacing: '0.15em',
              fontWeight: 500,
              color: '#CCCCCC'
            }}
          >
            BACK
          </span>
        </button>
      </div>

      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0"
          style={{ transform: `translateY(${scrollY * 0.5}px)` }}
        >
          <img
            src={heroImage}
            alt={programTitle}
            className="w-full h-full object-cover"
            style={{ objectPosition: 'center 30%' }}
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black opacity-30" />
        </div>

        {/* Content */}
        <div 
          className="relative h-full flex flex-col justify-center px-6"
          style={{ marginTop: '0px', transform: `translateY(${scrollY * 0.2}px)` }}
        >
          <div className="max-w-2xl">
            <p 
              className="mb-3 font-[DM_Sans] tracking-[0.3em] text-[rgb(204,204,204)]"
              style={{
                fontSize: '11px',
                letterSpacing: '0.35em',
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.6)'
              }}
            >
              TRAINING PROGRAM
            </p>
            
            <h1 
              className="mb-8 font-[DM_Sans] font-light text-white"
              style={{
                fontSize: '36px',
                letterSpacing: '-0.01em',
                lineHeight: '1.1',
                textShadow: '0 4px 12px rgba(0, 0, 0, 0.6)'
              }}
            >
              {programTitle}
            </h1>

            {/* Progress Bar */}
            <div className="w-full max-w-md">
              <div 
                className="relative w-full h-0.5 bg-white/20 overflow-hidden"
                style={{ borderRadius: '2px' }}
              >
                <div 
                  className="absolute top-0 left-0 h-full transition-all duration-500"
                  style={{ 
                    width: `${progressPercentage}%`,
                    backgroundColor: '#D4AF37'
                  }}
                />
              </div>
              <p 
                className="mt-2 font-[DM_Sans]"
                style={{
                  fontSize: '11px',
                  letterSpacing: '0.15em',
                  textShadow: '0 2px 8px rgba(0, 0, 0, 0.6)',
                  color: '#D4AF37'
                }}
              >
                {progressPercentage}% COMPLETE
              </p>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
      </section>

      {/* Sessions Section */}
      <section className="relative py-0 px-4 pb-12" style={{ marginTop: '-150px' }}>
        {/* Gradient Blend Overlay */}
        <div 
          className="absolute top-0 left-0 right-0 pointer-events-none z-10"
          style={{
            height: '200px',
            background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.3) 30%, rgba(0, 0, 0, 0.7) 60%, rgba(0, 0, 0, 1) 100%)'
          }}
        />

        {/* Solid background behind content */}
        <div className="absolute top-[200px] left-0 right-0 bottom-0 bg-black" />
        
        <h2 
          className="text-left tracking-[0.3em] text-[rgb(204,204,204)] mb-4 font-[DM_Sans] relative z-20"
          style={{
            fontSize: '11px',
            letterSpacing: '0.35em'
          }}
        >
          SESSIONS
        </h2>

        {/* Swipeable Session Cards */}
        <SessionCardsSwiper 
          sessions={sessions}
          heroImage={heroImage}
          onSessionAction={onSessionAction}
        />
      </section>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

// Swipeable Session Cards Component
interface SessionCardsSwiperProps {
  sessions: Session[];
  heroImage: string;
  onSessionAction: (sessionId: string) => void;
}

function SessionCardsSwiper({ sessions, heroImage, onSessionAction }: SessionCardsSwiperProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    
    const scrollLeft = scrollRef.current.scrollLeft;
    const cardWidth = scrollRef.current.offsetWidth;
    const newIndex = Math.round(scrollLeft / cardWidth);
    
    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
    }
  };

  const scrollToSlide = (index: number) => {
    if (!scrollRef.current) return;
    const cardWidth = scrollRef.current.offsetWidth;
    scrollRef.current.scrollTo({
      left: index * cardWidth,
      behavior: 'smooth'
    });
  };

  return (
    <div className="relative z-20">
      {/* Cards Container */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {sessions.map((session, index) => (
          <div key={session.id} className="flex-shrink-0 w-[calc(100%-32px)] snap-center">
            <MobileSessionCard
              id={session.id}
              week={session.week}
              session={session.session}
              tempo={session.tempo}
              tempoDetail={session.tempoDetail}
              exerciseCount={session.exerciseCount}
              exerciseDetails={session.exerciseDetails}
              isComplete={session.isComplete}
              image={session.image || heroImage}
              onAction={() => onSessionAction(session.id)}
            />
          </div>
        ))}
      </div>

      {/* Pagination Lines */}
      <div className="flex justify-center items-center gap-2 mt-6">
        {sessions.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToSlide(index)}
            className={`h-px rounded-full transition-all duration-300 ${
              index === currentIndex ? 'w-12 bg-[#D4AF37]' : 'w-12 bg-gray-700'
            }`}
            aria-label={`Go to session ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}