import { useState, useRef, useEffect } from 'react';
import { NavigationMenu } from './NavigationMenu';
import { ExercisePage } from './ExercisePage';
import logo from 'figma:asset/e702c84c8fb5f6b4af748ca13cfa0b042a4e70cc.png';
import heroImage from 'figma:asset/ab792683d7a73d572a50f69a064f5237631548f2.png';
import exampleImage from 'figma:asset/f02c9c90e42dc3ad32f61374bd3d80a2fdac5768.png';

interface Session {
  id: string;
  title: string;
  focus: string;
  equipment: string[];
  isCompleted: boolean;
  image: string;
}

interface ProgramDashboardProps {
  programId: string;
  programTitle: string;
  onNavigate: (page: 'home' | 'programs' | 'account') => void;
  onBack: () => void;
}

// Mock session data - in a real app this would come from a backend
const PROGRAM_SESSIONS: Record<string, Session[]> = {
  'microdose-load-explode': [
    // Sessions 1-3, subsession 1
    {
      id: 'session-1-1',
      title: 'SESSION 1.1',
      focus: 'Eccentric Strength + Plyometrics',
      equipment: ['Dumbbells', 'Barbells', 'Resistance Bands'],
      isCompleted: true,
      image: 'https://images.unsplash.com/photo-1739295564766-af223cb3424d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxleHBsb3NpdmUlMjBhdGhsZXRpYyUyMG1vdmVtZW50fGVufDF8fHx8MTc2NDYxMDEyM3ww&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: 'session-2-1',
      title: 'SESSION 2.1',
      focus: 'Power Development + Coordination',
      equipment: ['Kettlebells', 'Medicine Ball', 'Plyo Box'],
      isCompleted: true,
      image: 'https://images.unsplash.com/photo-1739295564766-af223cb3424d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxleHBsb3NpdmUlMjBhdGhsZXRpYyUyMG1vdmVtZW50fGVufDF8fHx8MTc2NDYxMDEyM3ww&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: 'session-3-1',
      title: 'SESSION 3.1',
      focus: 'Reactive Strength + Eccentric Loading',
      equipment: ['Plyo Box', 'Dumbbells', 'Resistance Bands'],
      isCompleted: false,
      image: exampleImage
    },
    // Sessions 1-3, subsession 2
    {
      id: 'session-1-2',
      title: 'SESSION 1.2',
      focus: 'Eccentric Control + Power Transfer',
      equipment: ['Barbells', 'Dumbbells', 'Resistance Bands'],
      isCompleted: false,
      image: 'https://images.unsplash.com/photo-1739295564766-af223cb3424d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxleHBsb3NpdmUlMjBhdGhsZXRpYyUyMG1vdmVtZW50fGVufDF8fHx8MTc2NDYxMDEyM3ww&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: 'session-2-2',
      title: 'SESSION 2.2',
      focus: 'Explosive Power + Movement Quality',
      equipment: ['Medicine Ball', 'Kettlebells', 'Plyo Box'],
      isCompleted: false,
      image: 'https://images.unsplash.com/photo-1739295564766-af223cb3424d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxleHBsb3NpdmUlMjBhdGhsZXRpYyUyMG1vdmVtZW50fGVufDF8fHx8MTc2NDYxMDEyM3ww&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: 'session-3-2',
      title: 'SESSION 3.2',
      focus: 'Speed + Reactive Development',
      equipment: ['Hurdles', 'Resistance Bands', 'Plyo Box'],
      isCompleted: false,
      image: exampleImage
    },
    // Sessions 1-3, subsession 3
    {
      id: 'session-1-3',
      title: 'SESSION 1.3',
      focus: 'Maximum Eccentric + Plyometric Power',
      equipment: ['Dumbbells', 'Barbells', 'Plyo Box'],
      isCompleted: false,
      image: 'https://images.unsplash.com/photo-1739295564766-af223cb3424d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxleHBsb3NpdmUlMjBhdGhsZXRpYyUyMG1vdmVtZW50fGVufDF8fHx8MTc2NDYxMDEyM3ww&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: 'session-2-3',
      title: 'SESSION 2.3',
      focus: 'Coordination + Advanced Power',
      equipment: ['Kettlebells', 'Medicine Ball', 'Dumbbells'],
      isCompleted: false,
      image: 'https://images.unsplash.com/photo-1739295564766-af223cb3424d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxleHBsb3NpdmUlMjBhdGhsZXRpYyUyMG1vdmVtZW50fGVufDF8fHx8MTc2NDYxMDEyM3ww&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: 'session-3-3',
      title: 'SESSION 3.3',
      focus: 'Peak Reactive Strength + Eccentric Control',
      equipment: ['Plyo Box', 'Barbells', 'Hurdles'],
      isCompleted: false,
      image: exampleImage
    },
    // Sessions 4-6, subsession 1
    {
      id: 'session-4-1',
      title: 'SESSION 4.1',
      focus: 'Speed Development + Acceleration',
      equipment: ['Resistance Bands', 'Hurdles', 'Cones'],
      isCompleted: false,
      image: 'https://images.unsplash.com/photo-1739295564766-af223cb3424d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxleHBsb3NpdmUlMjBhdGhsZXRpYyUyMG1vdmVtZW50fGVufDF8fHx8MTc2NDYxMDEyM3ww&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: 'session-5-1',
      title: 'SESSION 5.1',
      focus: 'Maximum Strength + Power Transfer',
      equipment: ['Barbells', 'Dumbbells', 'Weight Plates'],
      isCompleted: false,
      image: 'https://images.unsplash.com/photo-1739295564766-af223cb3424d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxleHBsb3NpdmUlMjBhdGhsZXRpYyUyMG1vdmVtZW50fGVufDF8fHx8MTc2NDYxMDEyM3ww&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: 'session-6-1',
      title: 'SESSION 6.1',
      focus: 'Active Recovery + Mobility',
      equipment: ['Foam Roller', 'Resistance Bands', 'Yoga Mat'],
      isCompleted: false,
      image: 'https://images.unsplash.com/photo-1739295564766-af223cb3424d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxleHBsb3NpdmUlMjBhdGhsZXRpYyUyMG1vdmVtZW50fGVufDF8fHx8MTc2NDYxMDEyM3ww&ixlib=rb-4.1.0&q=80&w=1080'
    },
    // Sessions 4-6, subsession 2
    {
      id: 'session-4-2',
      title: 'SESSION 4.2',
      focus: 'Velocity Training + Sprint Mechanics',
      equipment: ['Hurdles', 'Cones', 'Resistance Bands'],
      isCompleted: false,
      image: 'https://images.unsplash.com/photo-1739295564766-af223cb3424d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxleHBsb3NpdmUlMjBhdGhsZXRpYyUyMG1vdmVtZW50fGVufDF8fHx8MTc2NDYxMDEyM3ww&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: 'session-5-2',
      title: 'SESSION 5.2',
      focus: 'Strength Endurance + Power',
      equipment: ['Barbells', 'Kettlebells', 'Weight Plates'],
      isCompleted: false,
      image: 'https://images.unsplash.com/photo-1739295564766-af223cb3424d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxleHBsb3NpdmUlMjBhdGhsZXRpYyUyMG1vdmVtZW50fGVufDF8fHx8MTc2NDYxMDEyM3ww&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: 'session-6-2',
      title: 'SESSION 6.2',
      focus: 'Regeneration + Flexibility',
      equipment: ['Yoga Mat', 'Foam Roller', 'Stretching Bands'],
      isCompleted: false,
      image: 'https://images.unsplash.com/photo-1739295564766-af223cb3424d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxleHBsb3NpdmUlMjBhdGhsZXRpYyUyMG1vdmVtZW50fGVufDF8fHx8MTc2NDYxMDEyM3ww&ixlib=rb-4.1.0&q=80&w=1080'
    },
    // Sessions 4-6, subsession 3
    {
      id: 'session-4-3',
      title: 'SESSION 4.3',
      focus: 'Peak Speed + Acceleration Power',
      equipment: ['Cones', 'Resistance Bands', 'Hurdles'],
      isCompleted: false,
      image: 'https://images.unsplash.com/photo-1739295564766-af223cb3424d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxleHBsb3NpdmUlMjBhdGhsZXRpYyUyMG1vdmVtZW50fGVufDF8fHx8MTc2NDYxMDEyM3ww&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: 'session-5-3',
      title: 'SESSION 5.3',
      focus: 'Maximum Power + Strength Integration',
      equipment: ['Barbells', 'Weight Plates', 'Dumbbells'],
      isCompleted: false,
      image: 'https://images.unsplash.com/photo-1739295564766-af223cb3424d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxleHBsb3NpdmUlMjBhdGhsZXRpYyUyMG1vdmVtZW50fGVufDF8fHx8MTc2NDYxMDEyM3ww&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: 'session-6-3',
      title: 'SESSION 6.3',
      focus: 'Deep Recovery + Movement Restoration',
      equipment: ['Foam Roller', 'Yoga Mat', 'Massage Ball'],
      isCompleted: false,
      image: 'https://images.unsplash.com/photo-1739295564766-af223cb3424d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxleHBsb3NpdmUlMjBhdGhsZXRpYyUyMG1vdmVtZW50fGVufDF8fHx8MTc2NDYxMDEyM3ww&ixlib=rb-4.1.0&q=80&w=1080'
    }
  ]
};

export function ProgramDashboard({ programId, programTitle, onNavigate, onBack }: ProgramDashboardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogo, setShowLogo] = useState(true);
  const [prevScrollY, setPrevScrollY] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sessions, setSessions] = useState<Session[]>(PROGRAM_SESSIONS[programId] || []);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Calculate progress
  const completedSessions = sessions.filter(s => s.isCompleted).length;
  const totalSessions = sessions.length;
  const progressPercentage = Math.round((completedSessions / totalSessions) * 100);
  const isFullyCompleted = progressPercentage === 100;

  useEffect(() => {
    const handlePageScroll = () => {
      const currentScrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const isAtBottom = currentScrollY + windowHeight >= documentHeight - 10;
      
      if (isAtBottom) {
        setShowLogo(false);
      } else if (currentScrollY <= 10) {
        setShowLogo(true);
      } else if (currentScrollY > prevScrollY) {
        setShowLogo(false);
      } else if (currentScrollY < prevScrollY) {
        setShowLogo(true);
      }
      
      setScrollY(currentScrollY);
      setPrevScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handlePageScroll);
    return () => window.removeEventListener('scroll', handlePageScroll);
  }, [prevScrollY]);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Scroll to first incomplete session on load
    const firstIncompleteIndex = sessions.findIndex(s => !s.isCompleted);
    if (firstIncompleteIndex !== -1 && scrollRef.current) {
      setTimeout(() => {
        scrollToSlide(firstIncompleteIndex);
      }, 100);
    }
  }, []);

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const cardWidth = scrollRef.current.offsetWidth;
      const newIndex = Math.round(scrollLeft / cardWidth);
      setCurrentSlide(newIndex);
    }
  };

  const scrollToSlide = (index: number) => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.offsetWidth;
      scrollRef.current.scrollTo({
        left: index * cardWidth,
        behavior: 'smooth'
      });
    }
  };

  const handleSessionAction = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (!session) return;

    if (!session.isCompleted) {
      // Start the session
      setActiveSessionId(sessionId);
    }
  };

  const handleSessionComplete = () => {
    if (activeSessionId) {
      // Mark session as complete
      setSessions(prevSessions => 
        prevSessions.map(s => 
          s.id === activeSessionId ? { ...s, isCompleted: true } : s
        )
      );
      // Return to dashboard
      setActiveSessionId(null);
    }
  };

  const handleRestart = () => {
    // Reset all sessions to incomplete
    setSessions(sessions.map(s => ({ ...s, isCompleted: false })));
    console.log('Restarting program:', programId);
  };

  // If a session is active, show ExercisePage
  if (activeSessionId) {
    const activeSession = sessions.find(s => s.id === activeSessionId);
    if (activeSession) {
      return (
        <ExercisePage
          sessionId={activeSessionId}
          sessionTitle={activeSession.title}
          programTitle={programTitle}
          onNavigate={onNavigate}
          onBack={() => setActiveSessionId(null)}
        />
      );
    }
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Navigation Menu */}
      <NavigationMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
        onNavigate={onNavigate}
      />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-6 flex items-center justify-between">
        <button 
          onClick={() => onNavigate('home')}
          className="cursor-pointer"
        >
          <img
            src={logo}
            alt="Program King Logo"
            className={`h-2.5 transition-opacity duration-300 ${showLogo ? 'opacity-100' : 'opacity-0'}`}
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
      <section className="relative h-[65vh] overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{ transform: `translateY(${scrollY * 0.5}px)` }}
        >
          <img
            src={heroImage}
            alt={programTitle}
            className="w-full h-full object-cover scale-125"
          />
          {/* Darkening overlay */}
          <div className="absolute inset-0 bg-black/25" />
        </div>
        
        {/* Fixed gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black pointer-events-none" />

        <div 
          className="relative h-full flex flex-col justify-end pb-2 pl-6"
          style={{ transform: `translateY(${scrollY * 0.2}px)` }}
        >
          <h1 className="mb-4 leading-tight font-[DM_Sans] text-[32px] text-left font-light text-[#D4AF37]" style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)' }}>
            {programTitle}
          </h1>
          
          {/* Progress Bar */}
          <div className="pr-6 mb-2">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[11px] tracking-[0.15em] text-gray-300 font-[DM_Sans]" style={{ textShadow: '0 1px 4px rgba(0, 0, 0, 0.5)' }}>
                {progressPercentage}% COMPLETE
              </span>
            </div>
            <div className="relative h-0.5 bg-gray-800/50 rounded-full overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full bg-[#D4AF37] transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Sessions Section */}
      <section className="relative pb-8 pt-2 bg-gradient-to-b from-black/0 via-black/50 to-black" style={{ marginTop: 'calc(-5.75vh + 11vh)' }}>
        <h2 className="text-left text-xs tracking-[0.3em] text-[rgb(204,204,204)] mb-4 px-6 text-[10px] font-[DM_Sans]">
          {isFullyCompleted ? 'PROGRAM COMPLETED' : 'CONTINUE TRAINING'}
        </h2>

        {isFullyCompleted ? (
          // Completion Card
          <div className="px-4">
            <div className="relative rounded-lg overflow-hidden border border-[#D4AF37]/50">
              <div className="relative h-[280px]">
                <img
                  src={sessions[0]?.image || exampleImage}
                  alt="Program Complete"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <div className="text-center mb-8">
                    <h3 className="text-[24px] font-[DM_Sans] font-light mb-3 text-[#D4AF37]">
                      Congratulations!
                    </h3>
                    <p className="text-[13px] font-[DM_Sans] font-extralight text-gray-300 leading-relaxed">
                      You've completed all sessions in this program.
                      <br />
                      Ready to start again?
                    </p>
                  </div>
                  
                  <button
                    onClick={handleRestart}
                    className="w-full py-3.5 bg-[#D4AF37] text-black text-[11px] tracking-[0.2em] font-[DM_Sans] rounded-md transition-all duration-200 hover:bg-[#D4AF37]/90"
                  >
                    RESTART
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Session Cards
          <>
            <div 
              ref={scrollRef}
              onScroll={handleScroll}
              className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-4 px-4"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {sessions.map((session) => (
                <div key={session.id} className="flex-shrink-0 w-[calc(100%-32px)] snap-center">
                  <div className="relative rounded-lg overflow-hidden border border-[#D4AF37]/50">
                    <div className="relative h-[280px]">
                      <img
                        src={session.image}
                        alt={session.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
                      
                      <div className="absolute inset-0 flex flex-col justify-end p-[24px]">
                        <h3 className="text-[16px] font-[DM_Sans] font-light text-[#D4AF37] tracking-[0.15em] text-left mb-2">
                          {session.title}
                        </h3>
                        <p className="text-[13px] font-[DM_Sans] font-extralight text-[rgb(255,255,255)] mb-6 font-[DM_Sans_Light] text-left">
                          {session.focus}
                        </p>
                        
                        <div className="mb-6">
                          <p className="text-[10px] text-[rgb(204,204,204)] font-[DM_Sans] mb-3 font-[DM_Sans_ExtraLight]">
                            Equipment Required
                          </p>
                          <ul className="space-y-1.5 font-[DM_Sans_Thin] text-[12px]">
                            {session.equipment.map((item, idx) => (
                              <li key={idx} className="text-[12px] font-[DM_Sans] font-extralight text-gray-300 flex items-start font-[DM_Sans_Thin]">
                                <span className="mr-2 text-[#D4AF37]">-</span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="flex justify-center">
                          <button
                            onClick={() => handleSessionAction(session.id)}
                            className={`w-1/2 py-1.75 text-[11px] tracking-[0.2em] font-[DM_Sans] rounded-md transition-all duration-200 ${
                              session.isCompleted
                                ? 'text-[#349934] hover:bg-[#349934]/10'
                                : 'text-[#D4AF37] hover:bg-[#D4AF37]/10'
                            }`}
                          >
                            {session.isCompleted ? 'COMPLETE' : 'START'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Dots */}
            {sessions.length > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8 px-6">
                {sessions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => scrollToSlide(index)}
                    className={`h-px rounded-full transition-all duration-300 ${
                      index === currentSlide ? 'w-12 bg-[#D4AF37]' : 'w-12 bg-gray-700'
                    }`}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </section>

      {/* Back Button */}
      <div className="px-6 pb-12 flex justify-end">
        <button
          onClick={onBack}
          className="px-6 py-2.5 text-[#D4AF37] text-[8px] tracking-[0.2em] font-[DM_Sans] rounded-[4px] transition-all duration-200 hover:bg-[#D4AF37]/10"
        >
          B A C K
        </button>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}