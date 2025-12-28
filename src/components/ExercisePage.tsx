import { useState, useRef, useEffect } from 'react';
import { ServiceCard } from './ServiceCard';
import { NavigationMenu } from './NavigationMenu';
import heroImage from 'figma:asset/7dd0402244a3ae14c68fdf6414c2b24024b7b12b.png';
import logo from 'figma:asset/e702c84c8fb5f6b4af748ca13cfa0b042a4e70cc.png';

interface ExercisePageProps {
  sessionId: string;
  sessionTitle: string;
  programTitle: string;
  onNavigate: (page: 'home' | 'programs' | 'account') => void;
  onBack: () => void;
}

export function ExercisePage({ sessionId, sessionTitle, programTitle, onNavigate, onBack }: ExercisePageProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [showLogo, setShowLogo] = useState(true);
  const [prevScrollY, setPrevScrollY] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const exercises = [
    {
      title: 'BARBELL BACK SQUAT',
      subtitle: 'Strength Development +\nLower Body Power',
      image: 'https://images.unsplash.com/photo-1739295564766-af223cb3424d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxleHBsb3NpdmUlMjBhdGhsZXRpYyUyMG1vdmVtZW50fGVufDF8fHx8MTc2NDYxMDEyM3ww&ixlib=rb-4.1.0&q=80&w=1080',
      buttonText: 'EXPAND',
      expandedContent: 'Primary compound movement for lower body strength development. Focus on maintaining neutral spine position throughout the entire range of motion while controlling eccentric and explosive concentric phases.',
      onMoreInfo: () => {},
      sets: 4,
      reps: 6
    },
    {
      title: 'DEPTH JUMP TO BOX JUMP',
      subtitle: 'Plyometric Power +\nReactive Strength',
      image: 'https://images.unsplash.com/photo-1762709753401-d0ff2c4936c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdGhsZXRlJTIwYWNjZWxlcmF0aW9uJTIwc3ByaW50fGVufDF8fHx8MTc2NDYxMDEyM3ww&ixlib=rb-4.1.0&q=80&w=1080',
      buttonText: 'EXPAND',
      expandedContent: 'Advanced plyometric exercise combining eccentric loading with explosive power output. Emphasise minimal ground contact time and maximal force production through the hips.',
      onMoreInfo: () => {},
      sets: 3,
      reps: 5
    },
    {
      title: 'DUMBBELL ROMANIAN DEADLIFT',
      subtitle: 'Posterior Chain +\nHamstring Development',
      image: 'https://images.unsplash.com/photo-1590148313504-47353056f37a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbHlvbWV0cmljJTIwanVtcCUyMHRyYWluaW5nfGVufDF8fHx8MTc2NDYxMDEyM3ww&ixlib=rb-4.1.0&q=80&w=1080',
      buttonText: 'EXPAND',
      expandedContent: 'Targeted hamstring and glute development exercise. Maintain hip hinge pattern whilst keeping dumbbells close to body. Feel deep stretch in hamstrings at bottom position.',
      onMoreInfo: () => {},
      sets: 3,
      reps: 10
    },
    {
      title: 'BARBELL BENCH PRESS',
      subtitle: 'Upper Body Strength +\nPower Development',
      image: 'https://images.unsplash.com/photo-1602827114685-efbb2717da9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb3RhdGlvbmFsJTIwY29yZSUyMHRyYWluaW5nfGVufDF8fHx8MTc2NDYxMDEyM3ww&ixlib=rb-4.1.0&q=80&w=1080',
      buttonText: 'EXPAND',
      expandedContent: 'Primary upper body pressing movement for strength and power development. Retract shoulder blades and maintain stable base throughout movement. Control descent and drive explosively.',
      onMoreInfo: () => {},
      sets: 4,
      reps: 8
    },
    {
      title: 'NORDIC HAMSTRING CURL',
      subtitle: 'Eccentric Strength +\nInjury Prevention',
      image: 'https://images.unsplash.com/photo-1758599880557-e3a27500265e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdGhsZXRpYyUyMGNvcmUlMjBzdGFiaWxpdHl8ZW58MXx8fHwxNzY0NjEwMTI0fDA&ixlib=rb-4.1.0&q=80&w=1080',
      buttonText: 'EXPAND',
      expandedContent: 'Advanced eccentric hamstring exercise for injury prevention and strength development. Control descent phase with hamstrings, keep hips extended throughout. Use hands to assist return.',
      onMoreInfo: () => {},
      sets: 3,
      reps: 8
    },
    {
      title: 'LOADED CARRY COMPLEX',
      subtitle: 'Core Stability +\nFunctional Strength',
      image: 'https://images.unsplash.com/photo-1734668484998-c943d1fcb48a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpc29sYXRpb24lMjBzdHJlbmd0aCUyMHRyYWluaW5nfGVufDF8fHx8MTc2NDYxMDEyNHww&ixlib=rb-4.1.0&q=80&w=1080',
      buttonText: 'EXPAND',
      expandedContent: 'Full body integration exercise combining core stability with loaded movement. Maintain upright posture, shoulders packed and stable. Focus on controlled breathing throughout distance.',
      onMoreInfo: () => {},
      sets: 3,
      reps: 12
    }
  ];

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
  }, []);

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
          onClick={() => {
            onNavigate('home');
          }}
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
            alt="Athlete training"
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
          <h1 className="mb-4 leading-tight font-[DM_Sans] text-[40px] text-left font-light normal-case text-[#D4AF37]" style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)' }}>
            {sessionTitle.charAt(0).toUpperCase() + sessionTitle.slice(1).toLowerCase()}
          </h1>
          <p className="text-gray-300 tracking-wide text-sm font-[DM_Sans] no-underline text-[16.5px] font-light text-left pr-6" style={{ textShadow: '0 1px 4px rgba(0, 0, 0, 0.5)' }}>
            {programTitle} • {exercises.length} Exercises
          </p>
        </div>
      </section>

      {/* Exercises Section */}
      <section className="relative pb-24 pt-2 bg-gradient-to-b from-black/0 via-black/50 to-black" style={{ marginTop: 'calc(-5.75vh + 11vh)' }}>
        <h2 className="text-left text-xs tracking-[0.3em] text-[rgb(204,204,204)] mb-4 px-6 text-[10px] font-[DM_Sans]">
          SESSION EXERCISES
        </h2>

        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-4 px-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {exercises.map((exercise, index) => (
            <div key={index} className="flex-shrink-0 w-[calc(100%-32px)] snap-center">
              <ServiceCard {...exercise} />
            </div>
          ))}
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center items-center gap-2 mt-8 px-6">
          {exercises.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToSlide(index)}
              className={`h-px rounded-full transition-all duration-300 ${
                index === currentSlide ? 'w-12 bg-[#D4AF37]' : 'w-12 bg-gray-700'
              }`}
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