import { useState, useRef, useEffect } from 'react';
import { ServiceCard } from './ServiceCard';
import { NavigationMenu } from './NavigationMenu';
import { LoginPrompt } from './LoginPrompt';
import programsHeroImage from 'figma:asset/addc6ffc7118210dffecfb3db38aff839af1f193.png';
import logo from 'figma:asset/e702c84c8fb5f6b4af748ca13cfa0b042a4e70cc.png';
import fullProgramsImage from 'figma:asset/1d73387dfbf6c325d65ebb874c4e586a0231ff4f.png';
import microDoseImage from 'figma:asset/99abc444b9e49b44a4230183ad8d92e00428eb77.png';

interface ProgramsPageProps {
  onNavigate: (page: 'home' | 'programs' | 'account') => void;
  ownedPrograms: string[];
  onAddProgram: (programId: string) => void;
  onOpenProgram: (programId: string) => void;
  isSignedIn?: boolean;
}

export function ProgramsPage({ onNavigate, ownedPrograms, onAddProgram, onOpenProgram, isSignedIn }: ProgramsPageProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [showLogo, setShowLogo] = useState(true); // Track logo visibility based on scroll direction
  const [prevScrollY, setPrevScrollY] = useState(0); // Track previous scroll position
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleProgramAction = (programId: string) => {
    if (ownedPrograms.includes(programId)) {
      // User owns the program - open it
      console.log('Opening program:', programId);
      onOpenProgram(programId);
    } else {
      // User doesn't own the program - navigate to payment flow
      onAddProgram(programId);
    }
  };

  // MicroDose programs for nested cards
  const microDosePrograms = [
    {
      id: 'microdose-load-explode',
      title: 'LOAD-EXPLODE',
      subtitle: 'Eccentric Loading +\nExplosive Concentric',
      image: 'https://images.unsplash.com/photo-1739295564766-af223cb3424d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxleHBsb3NpdmUlMjBhdGhsZXRpYyUyMG1vdmVtZW50fGVufDF8fHx8MTc2NDYxMDEyM3ww&ixlib=rb-4.1.0&q=80&w=1080',
      buttonText: ownedPrograms.includes('microdose-load-explode') ? 'OPEN' : 'ADD',
      isOwned: ownedPrograms.includes('microdose-load-explode'),
      onAction: () => handleProgramAction('microdose-load-explode')
    },
    {
      id: 'microdose-accel-decel',
      title: 'ACCEL-DECEL',
      subtitle: 'Speed Development +\nBraking Mechanics',
      image: 'https://images.unsplash.com/photo-1762709753401-d0ff2c4936c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdGhsZXRlJTIwYWNjZWxlcmF0aW9uJTIwc3ByaW50fGVufDF8fHx8MTc2NDYxMDEyM3ww&ixlib=rb-4.1.0&q=80&w=1080',
      buttonText: ownedPrograms.includes('microdose-accel-decel') ? 'OPEN' : 'ADD',
      isOwned: ownedPrograms.includes('microdose-accel-decel'),
      onAction: () => handleProgramAction('microdose-accel-decel')
    },
    {
      id: 'microdose-drop-hop-pop',
      title: 'DROP-HOP-POP',
      subtitle: 'Plyometric Power +\nReactive Strength',
      image: 'https://images.unsplash.com/photo-1590148313504-47353056f37a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbHlvbWV0cmljJTIwanVtcCUyMHRyYWluaW5nfGVufDF8fHx8MTc2NDYxMDEyM3ww&ixlib=rb-4.1.0&q=80&w=1080',
      buttonText: ownedPrograms.includes('microdose-drop-hop-pop') ? 'OPEN' : 'ADD',
      isOwned: ownedPrograms.includes('microdose-drop-hop-pop'),
      onAction: () => handleProgramAction('microdose-drop-hop-pop')
    },
    {
      id: 'microdose-push-pull-rotate',
      title: 'PUSH-PULL-ROTATE',
      subtitle: 'Multi-Planar Strength +\nCore Integration',
      image: 'https://images.unsplash.com/photo-1602827114685-efbb2717da9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb3RhdGlvbmFsJTIwY29yZSUyMHRyYWluaW5nfGVufDF8fHx8MTc2NDYxMDEyM3ww&ixlib=rb-4.1.0&q=80&w=1080',
      buttonText: ownedPrograms.includes('microdose-push-pull-rotate') ? 'OPEN' : 'ADD',
      isOwned: ownedPrograms.includes('microdose-push-pull-rotate'),
      onAction: () => handleProgramAction('microdose-push-pull-rotate')
    },
    {
      id: 'microdose-pillar-power',
      title: 'PILLAR-POWER',
      subtitle: 'Core Stability +\nPower Transfer',
      image: 'https://images.unsplash.com/photo-1758599880557-e3a27500265e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdGhsZXRpYyUyMGNvcmUlMjBzdGFiaWxpdHl8ZW58MXx8fHwxNzY0NjEwMTI0fDA&ixlib=rb-4.1.0&q=80&w=1080',
      buttonText: ownedPrograms.includes('microdose-pillar-power') ? 'OPEN' : 'ADD',
      isOwned: ownedPrograms.includes('microdose-pillar-power'),
      onAction: () => handleProgramAction('microdose-pillar-power')
    },
    {
      id: 'microdose-isolate-integrate',
      title: 'ISOLATE-INTEGRATE',
      subtitle: 'Targeted Work +\nMovement Integration',
      image: 'https://images.unsplash.com/photo-1734668484998-c943d1fcb48a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpc29sYXRpb24lMjBzdHJlbmd0aCUyMHRyYWluaW5nfGVufDF8fHx8MTc2NDYxMDEyNHww&ixlib=rb-4.1.0&q=80&w=1080',
      buttonText: ownedPrograms.includes('microdose-isolate-integrate') ? 'OPEN' : 'ADD',
      isOwned: ownedPrograms.includes('microdose-isolate-integrate'),
      onAction: () => handleProgramAction('microdose-isolate-integrate')
    },
    {
      id: 'microdose-active-recovery',
      title: 'ACTIVE RECOVERY',
      subtitle: 'Mobility + Tissue\nRegeneration',
      image: 'https://images.unsplash.com/photo-1761839257789-20147513121a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWNvdmVyeSUyMHN0cmV0Y2hpbmclMjBhdGhsZXRlfGVufDF8fHx8MTc2NDU0ODk2NXww&ixlib=rb-4.1.0&q=80&w=1080',
      buttonText: ownedPrograms.includes('microdose-active-recovery') ? 'OPEN' : 'ADD',
      isOwned: ownedPrograms.includes('microdose-active-recovery'),
      onAction: () => handleProgramAction('microdose-active-recovery')
    }
  ];

  // Full Programs for nested cards
  const fullPrograms = [
    {
      id: 'fullprogram-strength',
      title: 'STRENGTH',
      subtitle: 'Maximal Force +\nStructural Development',
      image: 'https://images.unsplash.com/photo-1591291621164-2c6367723315?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlbmd0aCUyMHRyYWluaW5nJTIwd2VpZ2h0c3xlbnwxfHx8fDE3NjQ3NzM0NTl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      buttonText: ownedPrograms.includes('fullprogram-strength') ? 'OPEN' : 'ADD',
      isOwned: ownedPrograms.includes('fullprogram-strength'),
      onAction: () => handleProgramAction('fullprogram-strength')
    },
    {
      id: 'fullprogram-power',
      title: 'POWER',
      subtitle: 'Explosive Strength +\nRate of Force Development',
      image: 'https://images.unsplash.com/photo-1644085159448-1659fd88a217?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxleHBsb3NpdmUlMjBwb3dlciUyMGF0aGxldGV8ZW58MXx8fHwxNzY0ODY2NjkwfDA&ixlib=rb-4.1.0&q=80&w=1080',
      buttonText: ownedPrograms.includes('fullprogram-power') ? 'OPEN' : 'ADD',
      isOwned: ownedPrograms.includes('fullprogram-power'),
      onAction: () => handleProgramAction('fullprogram-power')
    },
    {
      id: 'fullprogram-speed',
      title: 'SPEED',
      subtitle: 'Linear Velocity +\nAcceleration Mechanics',
      image: 'https://images.unsplash.com/photo-1762709753339-7bd2fea1f346?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcHJpbnQlMjBzcGVlZCUyMHRyYWluaW5nfGVufDF8fHx8MTc2NDg2NjY5MHww&ixlib=rb-4.1.0&q=80&w=1080',
      buttonText: ownedPrograms.includes('fullprogram-speed') ? 'OPEN' : 'ADD',
      isOwned: ownedPrograms.includes('fullprogram-speed'),
      onAction: () => handleProgramAction('fullprogram-speed')
    },
    {
      id: 'fullprogram-agility',
      title: 'AGILITY',
      subtitle: 'Multi-Directional Speed +\nChange of Direction',
      image: 'https://images.unsplash.com/photo-1650042585837-00b3635a3d5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZ2lsaXR5JTIwY29uZSUyMGRyaWxsc3xlbnwxfHx8fDE3NjQ4NjY2OTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      buttonText: ownedPrograms.includes('fullprogram-agility') ? 'OPEN' : 'ADD',
      isOwned: ownedPrograms.includes('fullprogram-agility'),
      onAction: () => handleProgramAction('fullprogram-agility')
    },
    {
      id: 'fullprogram-hypertrophy',
      title: 'HYPERTROPHY',
      subtitle: 'Muscle Building +\nStructural Balance',
      image: 'https://images.unsplash.com/photo-1554344728-7560c38c1720?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib2R5YnVpbGRpbmclMjBtdXNjbGUlMjB0cmFpbmluZ3xlbnwxfHx8fDE3NjQ4NjY2OTJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      buttonText: ownedPrograms.includes('fullprogram-hypertrophy') ? 'OPEN' : 'ADD',
      isOwned: ownedPrograms.includes('fullprogram-hypertrophy'),
      onAction: () => handleProgramAction('fullprogram-hypertrophy')
    }
  ];

  const services = [
    {
      title: 'MICRO DOSE',
      subtitle: 'Short Duration +\nHigh Impact Sessions',
      image: microDoseImage,
      buttonText: 'EXPAND',
      expandedContent: 'Quick, targeted training sessions designed to fit into busy schedules while maintaining performance gains. Perfect for recovery periods or maintenance phases.',
      nestedPrograms: microDosePrograms
    },
    {
      title: 'FULL PROGRAMS',
      subtitle: 'Complete Periodisation +\nSeason Planning',
      image: fullProgramsImage,
      buttonText: 'EXPAND',
      expandedContent: 'Comprehensive training programmes spanning entire seasons or competition cycles. Includes progressive overload, deload weeks, and peak performance timing for competition dates.',
      nestedPrograms: fullPrograms
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
        // At the bottom, always hide logo
        setShowLogo(false);
      } else if (currentScrollY <= 10) {
        // At the top, always show logo
        setShowLogo(true);
      } else if (currentScrollY > prevScrollY) {
        // Scrolling down, hide logo
        setShowLogo(false);
      } else if (currentScrollY < prevScrollY) {
        // Scrolling up, show logo
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
            src={programsHeroImage}
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
          <h1 className="mb-4 leading-tight font-[DM_Sans] text-[40px] text-left font-light" style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)' }}>
            Evidence Backed, Results Driven.
          </h1>
          <p className="text-gray-300 tracking-wide text-sm font-[DM_Sans] no-underline text-[16.5px] font-light text-left pr-6" style={{ textShadow: '0 1px 4px rgba(0, 0, 0, 0.5)' }}>
            Performance focussed training programs engineered to develop performance capacity and athletic qualities.
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section className="relative pb-24 pt-2 bg-gradient-to-b from-black/0 via-black/50 to-black" style={{ marginTop: 'calc(-5.75vh + 11vh)' }}>
        <h2 className="text-left text-xs tracking-[0.3em] text-[rgb(204,204,204)] mb-4 px-6 text-[10px] font-[DM_Sans]">
          PROGRAM OPTIONS
        </h2>

        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-4 px-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {services.map((service, index) => (
            <div key={index} className="flex-shrink-0 w-[calc(100%-32px)] snap-center">
              <ServiceCard {...service} />
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
      </section>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}