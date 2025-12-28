import { useState, useRef, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import { DesktopSessionCard } from './DesktopSessionCard';
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

interface ProgramDetailPageDesktopProps {
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

export function ProgramDetailPageDesktop({
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
}: ProgramDetailPageDesktopProps) {
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

      {/* Back Button - positioned below header */}
      <div className="fixed top-0 left-0 z-50 px-12" style={{ paddingTop: 'calc(2rem + 14px + 3rem)' }}>
        <button
          onClick={() => {
            onNavigate(previousPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2 group/btn transition-opacity duration-500"
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
              fontSize: '12px',
              letterSpacing: '0.1em',
              fontWeight: 500,
              color: '#CCCCCC'
            }}
          >
            BACK
          </span>
        </button>
      </div>

      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden" style={{ marginTop: '-88px' }}>
        {/* Background Image */}
        <div 
          className="absolute inset-0"
          style={{ transform: `translateY(${scrollY * 0.5}px)` }}
        >
          <img
            src={heroImage}
            alt={programTitle}
            className="w-full h-full object-cover"
            style={{ objectPosition: 'center 20%' }}
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
            <p 
              className="mb-4 font-[DM_Sans] tracking-[0.3em] text-[rgb(204,204,204)]"
              style={{
                fontSize: '16.5px',
                letterSpacing: '0.35em',
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.6)'
              }}
            >
              TRAINING PROGRAM
            </p>
            
            <h1 
              className="mb-10 font-[DM_Sans] font-light text-white"
              style={{
                fontSize: '64px',
                letterSpacing: '-0.01em',
                lineHeight: '1.1',
                textShadow: '0 4px 12px rgba(0, 0, 0, 0.6)'
              }}
            >
              {programTitle}
            </h1>

            {/* Progress Bar */}
            <div className="w-full max-w-2xl">
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
                className="mt-3 font-[DM_Sans]"
                style={{
                  fontSize: '14px',
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
          SESSIONS
        </h2>

        {/* Session Cards Grid */}
        <div 
          className="grid grid-cols-2 gap-6 relative z-20 max-w-7xl mx-auto pb-20"
        >
          {sessions.map((session) => (
            <DesktopSessionCard
              key={session.id}
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
          ))}
        </div>
      </section>
    </div>
  );
}