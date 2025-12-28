import { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus } from 'lucide-react';
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
  price?: number;
}

interface AdminPortalPageDesktopProps {
  programs: Program[];
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  onNavigate: (page: 'home' | 'programs' | 'account' | 'trainingPrograms' | 'checkout' | 'admin') => void;
  onCreateProgram: () => void;
  onEditProgram: (programId: string) => void;
  onDeleteProgram: (programId: string) => void;
}

export function AdminPortalPageDesktop({
  programs,
  isMenuOpen,
  setIsMenuOpen,
  onNavigate,
  onCreateProgram,
  onEditProgram,
  onDeleteProgram
}: AdminPortalPageDesktopProps) {
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
      <header className="fixed top-0 left-0 right-0 z-50 px-16 py-11 flex items-center justify-between">
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
        {/* Background */}
        <div 
          className="absolute inset-0 bg-black"
          style={{ transform: `translateY(${scrollY * 0.5}px)` }}
        >
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
              Admin<br />
              Portal.
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
              Manage training programs and content
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
          MANAGE PROGRAMS
        </h2>

        {/* Program Cards Grid */}
        <div 
          className="grid grid-cols-2 gap-6 relative z-20 max-w-7xl mx-auto pb-20"
        >
          {/* Create New Program Card */}
          <div
            onClick={onCreateProgram}
            className="relative bg-black overflow-hidden group cursor-pointer rounded-[20px]"
            style={{
              border: '2px dashed rgba(212, 175, 55, 0.5)',
              boxShadow: '0 4px 20px rgba(212, 175, 55, 0.05)',
              transition: 'all 0.3s ease',
              aspectRatio: '16 / 9',
              minHeight: '280px'
            }}
          >
            <div className="flex h-full items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{
                    background: 'rgba(212, 175, 55, 0.1)',
                    border: '2px solid #D4AF37'
                  }}
                >
                  <Plus className="w-8 h-8 text-[#D4AF37]" />
                </div>
                <div className="text-center">
                  <div 
                    className="font-[DM_Sans] mb-1"
                    style={{
                      fontSize: '16px',
                      letterSpacing: '0.1em',
                      fontWeight: 500,
                      color: '#FFFFFF'
                    }}
                  >
                    CREATE NEW
                  </div>
                  <div 
                    className="font-[DM_Sans]"
                    style={{
                      fontSize: '12px',
                      letterSpacing: '0.05em',
                      color: '#FFFFFF'
                    }}
                  >
                    Training Program
                  </div>
                </div>
              </div>
            </div>
            
            {/* Hover glow effect */}
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: 'radial-gradient(circle at center, rgba(212, 175, 55, 0.1) 0%, transparent 70%)',
                pointerEvents: 'none'
              }}
            />
          </div>

          {/* Existing Programs */}
          {programs.map((program) => (
            <div
              key={program.id}
              className="relative bg-black overflow-hidden group rounded-[20px]"
              style={{
                border: '1px solid #D4AF37',
                boxShadow: '0 4px 20px rgba(212, 175, 55, 0.1)',
                transition: 'all 0.3s ease',
                aspectRatio: '16 / 9',
                minHeight: '280px'
              }}
            >
              <div className="flex h-full">
                {/* Image Section */}
                <div className="w-[45%] relative overflow-hidden">
                  <img
                    src={program.image}
                    alt={program.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div 
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%)'
                    }}
                  />
                </div>

                {/* Content Section */}
                <div className="w-[55%] p-6 flex flex-col justify-between">
                  <div>
                    {/* Top: Edit/Delete Buttons */}
                    <div className="flex gap-2 justify-end mb-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditProgram(program.id);
                        }}
                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
                        style={{
                          background: 'rgba(0, 0, 0, 0.4)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(212, 175, 55, 0.3)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(212, 175, 55, 0.2)';
                          e.currentTarget.style.borderColor = '#D4AF37';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(0, 0, 0, 0.4)';
                          e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.3)';
                        }}
                      >
                        <Pencil className="w-4 h-4" style={{ color: '#D4AF37' }} />
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteProgram(program.id);
                        }}
                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
                        style={{
                          background: 'rgba(0, 0, 0, 0.4)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(220, 38, 38, 0.3)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(220, 38, 38, 0.2)';
                          e.currentTarget.style.borderColor = '#DC2626';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(0, 0, 0, 0.4)';
                          e.currentTarget.style.borderColor = 'rgba(220, 38, 38, 0.3)';
                        }}
                      >
                        <Trash2 className="w-4 h-4" style={{ color: '#DC2626' }} />
                      </button>
                    </div>

                    <h3
                      className="font-[DM_Sans] text-white mb-2"
                      style={{
                        fontSize: '20px',
                        letterSpacing: '0.02em',
                        lineHeight: '1.2'
                      }}
                    >
                      {program.title}
                    </h3>
                    <p
                      className="font-[DM_Sans] text-gray-400 mb-4"
                      style={{
                        fontSize: '13px',
                        letterSpacing: '0.01em',
                        lineHeight: '1.4'
                      }}
                    >
                      {program.subtitle.replace(/\\n/g, '\n')}
                    </p>

                    {/* Program Details */}
                    <div className="space-y-1">
                      {program.duration && (
                        <p
                          className="font-[DM_Sans] text-gray-500"
                          style={{
                            fontSize: '11px',
                            letterSpacing: '0.01em'
                          }}
                        >
                          {program.duration}
                        </p>
                      )}
                      {program.sessions && (
                        <p
                          className="font-[DM_Sans] text-gray-500"
                          style={{
                            fontSize: '11px',
                            letterSpacing: '0.01em'
                          }}
                        >
                          {program.sessions}
                        </p>
                      )}
                      {program.time && (
                        <p
                          className="font-[DM_Sans] text-gray-500"
                          style={{
                            fontSize: '11px',
                            letterSpacing: '0.01em'
                          }}
                        >
                          {program.time}
                        </p>
                      )}
                      {program.price && (
                        <p
                          className="font-[DM_Sans] text-[#D4AF37] mt-2"
                          style={{
                            fontSize: '14px',
                            letterSpacing: '0.02em',
                            fontWeight: 500
                          }}
                        >
                          £{program.price.toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
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