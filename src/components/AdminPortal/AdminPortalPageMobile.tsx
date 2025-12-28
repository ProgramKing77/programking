import { useState, useEffect, useRef } from 'react';
import { Pencil, Trash2, Plus, ShoppingCart } from 'lucide-react';
import logo from 'figma:asset/e702c84c8fb5f6b4af748ca13cfa0b042a4e70cc.png';
import heroImage from 'figma:asset/ba710e6eef44675800b7d14e71acc4c2aba76b54.png';

interface Program {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  duration?: string;
  sessions?: string;
  time?: string;
  price?: number;
}

interface AdminPortalPageMobileProps {
  programs: Program[];
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  onNavigate: (page: 'home' | 'programs' | 'account' | 'trainingPrograms' | 'checkout' | 'admin') => void;
  onCreateProgram: () => void;
  onEditProgram: (programId: string) => void;
  onDeleteProgram: (programId: string) => void;
}

export function AdminPortalPageMobile({
  programs,
  isMenuOpen,
  setIsMenuOpen,
  onNavigate,
  onCreateProgram,
  onEditProgram,
  onDeleteProgram
}: AdminPortalPageMobileProps) {
  const [scrollY, setScrollY] = useState(0);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [logoOpacity, setLogoOpacity] = useState(1);
  const [currentSlide, setCurrentSlide] = useState(0);
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
      } else if (currentScrollY < lastScrollY && currentScrollY < 200) {
        // Scrolling up and near the top - fade in
        setLogoOpacity(1);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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

  // Add create card to the beginning of programs array
  const allItems = [{ id: 'create-new', isCreateCard: true }, ...programs.map(p => ({ ...p, isCreateCard: false }))];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-5 py-6 flex items-center justify-between">
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
            className="h-2.5 transition-opacity duration-500"
            style={{ opacity: logoOpacity }}
          />
        </button>
        <div className="flex items-center gap-1">
          {/* Menu Button */}
          <button onClick={() => setIsMenuOpen(true)} className="text-[#D4AF37] p-1.5">
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
          className="absolute inset-0 bg-black"
          style={{ transform: `translateY(${scrollY * 0.5 + 75}px)` }}
        >
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black pointer-events-none" />

        <div 
          className="relative h-full flex flex-col justify-end px-5 items-center"
          style={{ 
            transform: `translateY(${scrollY * 0.2 - 10}px)`,
            paddingBottom: '32px',
            paddingTop: '100px'
          }}
        >
          <h1 
            className="mb-3 leading-tight font-[DM_Sans] font-light text-center"
            style={{ 
              fontSize: '40px',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)' 
            }}
          >
            ADMIN PORTAL
          </h1>
          
          <p 
            className="text-gray-300 font-[DM_Sans] font-light text-center mb-18"
            style={{ 
              fontSize: '16.5px',
              lineHeight: '1.6',
              textShadow: '0 1px 4px rgba(0, 0, 0, 0.5)' 
            }}
          >
            Manage training programs and content
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
            MANAGE PROGRAMS
          </h2>

          <div 
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-4 px-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {allItems.map((item, index) => (
              <div key={item.id} className="flex-shrink-0 w-[calc(100%-32px)] snap-center">
                {item.isCreateCard ? (
                  // Create New Card
                  <div 
                    onClick={onCreateProgram}
                    className="relative overflow-hidden bg-black rounded-[20px] h-[400px]"
                    style={{
                      border: '2px dashed rgba(212, 175, 55, 0.5)',
                      boxShadow: '0 4px 20px rgba(212, 175, 55, 0.05)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <div className="flex h-full items-center justify-center">
                      <div className="flex flex-col items-center gap-3">
                        <div 
                          className="w-14 h-14 rounded-full flex items-center justify-center"
                          style={{
                            background: 'rgba(212, 175, 55, 0.1)',
                            border: '2px solid #D4AF37'
                          }}
                        >
                          <Plus className="w-7 h-7 text-[#D4AF37]" />
                        </div>
                        <div className="text-center">
                          <div 
                            className="font-[DM_Sans] mb-1"
                            style={{
                              fontSize: '14px',
                              letterSpacing: '0.1em',
                              fontWeight: 500,
                              color: '#D4AF37'
                            }}
                          >
                            CREATE NEW
                          </div>
                          <div 
                            className="font-[DM_Sans]"
                            style={{
                              fontSize: '11px',
                              letterSpacing: '0.05em',
                              color: 'rgba(212, 175, 55, 0.6)'
                            }}
                          >
                            Training Programme
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Program Card
                  <div 
                    className="relative overflow-hidden bg-black rounded-[20px] h-[400px]"
                    style={{
                      border: '1px solid #D4AF37',
                      boxShadow: '0 4px 20px rgba(212, 175, 55, 0.1)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {/* Main Content Container */}
                    <div className="relative flex flex-col h-[400px]">
                      {/* Top Section - Image */}
                      <div className="relative overflow-hidden h-[50%]">
                        <img 
                          src={item.image} 
                          alt={item.title}
                          className="w-full h-full object-cover"
                          style={{ objectPosition: 'center 30%' }}
                        />
                      </div>

                      {/* Bottom Section - Text Content */}
                      <div className="flex flex-col justify-between p-6 bg-black flex-1">
                        {/* Edit/Delete Buttons */}
                        <div className="flex gap-2 justify-end mb-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditProgram(item.id);
                            }}
                            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200"
                            style={{
                              background: 'rgba(0, 0, 0, 0.4)',
                              backdropFilter: 'blur(10px)',
                              border: '1px solid rgba(212, 175, 55, 0.3)',
                            }}
                          >
                            <Pencil className="w-3.5 h-3.5" style={{ color: '#D4AF37' }} />
                          </button>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteProgram(item.id);
                            }}
                            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200"
                            style={{
                              background: 'rgba(0, 0, 0, 0.4)',
                              backdropFilter: 'blur(10px)',
                              border: '1px solid rgba(220, 38, 38, 0.3)',
                            }}
                          >
                            <Trash2 className="w-3.5 h-3.5" style={{ color: '#DC2626' }} />
                          </button>
                        </div>

                        <div className="text-left flex-1 overflow-hidden">
                          <h3 
                            className="mb-3 font-[DM_Sans] text-white"
                            style={{
                              fontSize: '24px',
                              letterSpacing: '0.02em',
                              lineHeight: '1.2',
                              textTransform: 'capitalize'
                            }}
                          >
                            <span className="text-[20px] font-[DM_Sans_Light]">
                              {item.title}
                            </span>
                          </h3>
                          <p 
                            className="font-[DM_Sans_Thin] whitespace-pre-line"
                            style={{
                              fontSize: '12px',
                              letterSpacing: '0.01em',
                              lineHeight: '1.6',
                              color: '#CCCCCC'
                            }}
                          >
                            {item.subtitle.replace(/\\n/g, '\n')}
                          </p>

                          {/* Program Details */}
                          <div className="space-y-1 mt-3">
                            {item.duration && (
                              <p
                                className="font-[DM_Sans_Thin]"
                                style={{
                                  fontSize: '11px',
                                  letterSpacing: '0.01em',
                                  color: '#999999'
                                }}
                              >
                                {item.duration}
                              </p>
                            )}
                            {item.sessions && (
                              <p
                                className="font-[DM_Sans_Thin]"
                                style={{
                                  fontSize: '11px',
                                  letterSpacing: '0.01em',
                                  color: '#999999'
                                }}
                              >
                                {item.sessions}
                              </p>
                            )}
                            {item.time && (
                              <p
                                className="font-[DM_Sans_Thin]"
                                style={{
                                  fontSize: '11px',
                                  letterSpacing: '0.01em',
                                  color: '#999999'
                                }}
                              >
                                {item.time}
                              </p>
                            )}
                            {item.price && (
                              <p
                                className="font-[DM_Sans] text-[#D4AF37] mt-1"
                                style={{
                                  fontSize: '13px',
                                  letterSpacing: '0.02em',
                                  fontWeight: 500
                                }}
                              >
                                £{item.price.toFixed(2)}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center items-center gap-2 mt-8 px-6">
            {allItems.map((_, index) => (
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