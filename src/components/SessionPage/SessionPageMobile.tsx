import { useState, useRef, useEffect } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { MobileExerciseCard } from './MobileExerciseCard';
import { WorkoutCompletionModal } from '../WorkoutCompletionModal';
import logo from 'figma:asset/e702c84c8fb5f6b4af748ca13cfa0b042a4e70cc.png';

interface Exercise {
  id: string;
  exerciseName: string;
  sets: string;
  reps: string;
  image?: string;
  isComplete: boolean;
}

interface SessionPageMobileProps {
  programTitle: string;
  sessionTitle: string;
  blockNumber: number;
  totalBlocks: number;
  sectionTitle: string;
  exercises: Exercise[];
  heroImage: string;
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  onNavigate: (page: 'home' | 'programs' | 'account' | 'trainingPrograms' | 'programDetail', programId?: string) => void;
  onToggleComplete: (exerciseId: string) => void;
  onSkipSection: () => void;
  programId: string;
}

// Swipeable Exercise Cards Component
interface ExerciseCardsSwiperProps {
  exercises: Exercise[];
  onToggleComplete: (exerciseId: string) => void;
}

function ExerciseCardsSwiper({ exercises, onToggleComplete }: ExerciseCardsSwiperProps) {
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
        {exercises.map((exercise, index) => (
          <div key={exercise.id} className="flex-shrink-0 w-[calc(100%-32px)] snap-center">
            <MobileExerciseCard
              id={exercise.id}
              exerciseNumber={index + 1}
              totalExercises={exercises.length}
              exerciseName={exercise.exerciseName}
              sets={exercise.sets}
              reps={exercise.reps}
              image={exercise.image}
              isComplete={exercise.isComplete}
              onToggleComplete={onToggleComplete}
            />
          </div>
        ))}
      </div>

      {/* Pagination Lines */}
      <div className="flex justify-center items-center gap-2 mt-6">
        {exercises.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToSlide(index)}
            className={`h-px rounded-full transition-all duration-300 ${
              index === currentIndex ? 'w-12 bg-[#D4AF37]' : 'w-12 bg-gray-700'
            }`}
            aria-label={`Go to exercise ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export function SessionPageMobile({
  programTitle,
  sessionTitle,
  blockNumber,
  totalBlocks,
  sectionTitle,
  exercises,
  heroImage,
  isMenuOpen,
  setIsMenuOpen,
  onNavigate,
  onToggleComplete,
  onSkipSection,
  programId
}: SessionPageMobileProps) {
  const [scrollY, setScrollY] = useState(0);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [logoOpacity, setLogoOpacity] = useState(1);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

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
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 py-6 flex items-center justify-between bg-black/80 backdrop-blur-md">
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
        <button onClick={() => setIsMenuOpen(true)} className="text-[#D4AF37] p-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="4" y1="9" x2="20" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="4" y1="15" x2="20" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </header>

      {/* Back Button - positioned below header */}
      <div className="fixed top-0 left-0 z-50 px-6" style={{ paddingTop: 'calc(1.5rem + 10px + 2rem)' }}>
        <button 
          onClick={() => {
            onNavigate('programDetail', programId);
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
        {/* Background - Solid Black */}
        <div className="absolute inset-0 bg-black" />

        {/* Content */}
        <div 
          className="relative h-full flex flex-col justify-center px-6"
          style={{ marginTop: '-135px' }}
        >
          <div className="max-w-2xl">
            <p 
              className="mb-3 font-[DM_Sans] tracking-[0.3em] text-[rgb(204,204,204)]"
              style={{
                fontSize: '11px',
                letterSpacing: '0.35em',
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.6)',
                textTransform: 'uppercase'
              }}
            >
              {programTitle}
            </p>
            
            <h1 
              className="mb-8 font-[DM_Sans] font-light text-white"
              style={{
                fontSize: '24px',
                letterSpacing: '-0.01em',
                lineHeight: '1.1',
                textShadow: '0 4px 12px rgba(0, 0, 0, 0.6)'
              }}
            >
              {sessionTitle}
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
                    width: `${(exercises.filter(e => e.isComplete).length / exercises.length) * 100}%`,
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
                {Math.round((exercises.filter(e => e.isComplete).length / exercises.length) * 100)}% COMPLETE
              </p>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
      </section>

      {/* Exercises Section */}
      <section className="relative py-0 px-4 pb-12" style={{ marginTop: '-350px' }}>
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
        
        {/* Block and Section Header */}
        <div className="relative z-20 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 
              className="font-[DM_Sans] text-[#D4AF37]"
              style={{
                fontSize: '11px',
                letterSpacing: '0.35em'
              }}
            >
              EXERCISES
            </h2>
          </div>
        </div>

        {/* Swipeable Exercise Cards */}
        <ExerciseCardsSwiper 
          exercises={exercises}
          onToggleComplete={onToggleComplete}
        />

        {/* End Workout Button */}
        <div className="relative z-20 flex justify-end mt-6 pb-20">
          <button
            onClick={() => setShowCompletionModal(true)}
            className="flex items-center gap-1 font-[DM_Sans] transition-colors duration-300"
            style={{
              fontSize: '10px',
              letterSpacing: '0.15em',
              color: exercises.every(e => e.isComplete) ? '#22c55e' : '#AAAAAA',
              marginTop: '10px'
            }}
          >
            END WORKOUT
            <ChevronRight size={12} />
          </button>
        </div>
      </section>

      {/* Workout Completion Modal */}
      {showCompletionModal && (
        <WorkoutCompletionModal
          programTitle={programTitle}
          sessionTitle={sessionTitle}
          onReturnToDashboard={() => {
            setShowCompletionModal(false);
            onSkipSection(); // This will trigger the progress update in App.tsx
            onNavigate('account');
          }}
          isDesktop={false}
        />
      )}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}