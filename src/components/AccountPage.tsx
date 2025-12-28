import { useState, useRef } from 'react';
import { NavigationMenu } from './NavigationMenu';
import logo from 'figma:asset/e702c84c8fb5f6b4af748ca13cfa0b042a4e70cc.png';
import defaultProfileImage from 'figma:asset/8d899da9cceb67411df28fa63354c0a839ad957b.png'; // This will be editable for each user

interface AccountPageProps {
  onNavigate: (page: 'home' | 'programs' | 'microdose' | 'fullprograms' | 'profiling' | 'coaching' | 'workshops' | 'contact' | 'account') => void;
  isSignedIn?: boolean;
}

interface PurchasedProgram {
  id: string;
  name: string;
  completion: number;
  status: 'not-started' | 'in-progress' | 'completed';
}

interface ProgressStat {
  id: string;
  label: string;
  value: number | string;
}

interface SettingOption {
  id: string;
  label: string;
  action: string;
}

export function AccountPage({ onNavigate, isSignedIn = true }: AccountPageProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentProgramsSlide, setCurrentProgramsSlide] = useState(0);
  const [currentProgressSlide, setCurrentProgressSlide] = useState(0);
  const [currentSettingsSlide, setCurrentSettingsSlide] = useState(0);
  
  const programsScrollRef = useRef<HTMLDivElement>(null);
  const progressScrollRef = useRef<HTMLDivElement>(null);
  const settingsScrollRef = useRef<HTMLDivElement>(null);

  // Mock data - will be replaced with real data later
  const purchasedPrograms: PurchasedProgram[] = [
    { id: '1', name: 'Drop-Hop-Pop', completion: 64, status: 'in-progress' },
    { id: '2', name: 'Load-Explode', completion: 0, status: 'not-started' },
    { id: '3', name: 'Speed', completion: 100, status: 'completed' },
    { id: '4', name: 'Power', completion: 38, status: 'in-progress' },
    { id: '5', name: 'Accel-Decel', completion: 22, status: 'in-progress' },
    { id: '6', name: 'Agility', completion: 0, status: 'not-started' },
  ];

  const progressStats: ProgressStat[] = [
    { id: '1', label: 'Total Sessions', value: 32 },
    { id: '2', label: 'Session Streak', value: 7 },
    { id: '3', label: 'Hours Trained', value: '24.5' },
    { id: '4', label: 'Current Week', value: 4 },
  ];

  const settingOptions: SettingOption[] = [
    { id: '1', label: 'Profile', action: 'EDIT' },
    { id: '2', label: 'Payments', action: 'MANAGE' },
    { id: '3', label: 'Password', action: 'CHANGE' },
    { id: '4', label: 'Notifications', action: 'EDIT' },
  ];

  const getButtonText = (status: PurchasedProgram['status'], completion: number) => {
    if (status === 'completed') return 'COMPLETE - RESTART';
    if (status === 'not-started' || completion === 0) return 'START';
    return 'CONTINUE';
  };

  const getButtonColor = (status: PurchasedProgram['status'], completion: number) => {
    if (status === 'completed') return '#349934';
    if (status === 'not-started' || completion === 0) return '#FFFFFF';
    return '#CFB354';
  };

  const handleProgramsScroll = () => {
    if (programsScrollRef.current) {
      const scrollLeft = programsScrollRef.current.scrollLeft;
      const cardWidth = programsScrollRef.current.offsetWidth - 32;
      const newIndex = Math.round(scrollLeft / cardWidth);
      setCurrentProgramsSlide(newIndex);
    }
  };

  const handleProgressScroll = () => {
    if (progressScrollRef.current) {
      const scrollLeft = progressScrollRef.current.scrollLeft;
      const cardWidth = progressScrollRef.current.offsetWidth - 32;
      const newIndex = Math.round(scrollLeft / cardWidth);
      setCurrentProgressSlide(newIndex);
    }
  };

  const handleSettingsScroll = () => {
    if (settingsScrollRef.current) {
      const scrollLeft = settingsScrollRef.current.scrollLeft;
      const cardWidth = settingsScrollRef.current.offsetWidth - 32;
      const newIndex = Math.round(scrollLeft / cardWidth);
      setCurrentSettingsSlide(newIndex);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Navigation Menu */}
      <NavigationMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
        onNavigate={onNavigate}
        isSignedIn={isSignedIn}
      />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-6 flex items-center justify-between">
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
          />
        </button>
        <button onClick={() => setIsMenuOpen(true)} className="text-[#D4AF37] p-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="4" y1="9" x2="20" y2="9" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
            <line x1="4" y1="15" x2="20" y2="15" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
          </svg>
        </button>
      </header>

      {/* Hero Section - Profile Picture */}
      <section className="relative h-[50vh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={defaultProfileImage}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black pointer-events-none" />
      </section>

      {/* Your Programs Section */}
      <section className="relative pb-6 pt-4 bg-black">
        <h2 className="text-left text-xs tracking-[0.3em] text-white mb-3 px-6 text-[10px] font-[DM_Sans]">
          YOUR PROGRAMS
        </h2>

        <div 
          ref={programsScrollRef}
          onScroll={handleProgramsScroll}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-4 px-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {purchasedPrograms.map((program) => (
            <div 
              key={program.id} 
              className="flex-shrink-0 w-[calc(100%-32px)] snap-center"
            >
              <div className="border border-[#D4AF37] rounded-3xl pl-8 pr-4 pt-6 pb-3 h-32 flex flex-col justify-between bg-black/40 backdrop-blur-sm" style={{ borderWidth: '0.5px' }}>
                <div className="mb-3">
                  <h3 className="text-[#D4AF37] font-[DM_Sans] text-xl text-[16px] mb-1">
                    {program.name}
                  </h3>
                  <p className="text-white/70 font-[DM_Sans] text-sm">
                    {program.completion}% complete
                  </p>
                </div>
                
                <button className="flex items-center justify-end w-full font-[DM_Sans] tracking-[0.2em] text-[10px] gap-3">
                  <span style={{ color: getButtonColor(program.status, program.completion) }}>{getButtonText(program.status, program.completion)}</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 3L11 8L6 13" stroke="#D4AF37" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center items-center gap-2 mt-4 px-6">
          {purchasedPrograms.map((_, index) => (
            <button
              key={index}
              className={`h-px rounded-full transition-all duration-300 ${
                index === currentProgramsSlide ? 'w-12 bg-[#D4AF37]' : 'w-12 bg-gray-700'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Your Progress Section */}
      <section className="relative pb-6 pt-2 bg-black">
        <h2 className="text-left text-xs tracking-[0.3em] text-white mb-3 px-6 text-[10px] font-[DM_Sans]">
          YOUR PROGRESS
        </h2>

        <div 
          ref={progressScrollRef}
          onScroll={handleProgressScroll}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-4 px-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {progressStats.map((stat) => (
            <div 
              key={stat.id} 
              className="flex-shrink-0 w-[calc(100%-32px)] snap-center"
            >
              <div className="border border-[#D4AF37] rounded-3xl px-8 h-20 flex flex-col justify-center bg-black/40 backdrop-blur-sm" style={{ borderWidth: '0.5px' }}>
                <h3 className="text-[#D4AF37] font-[DM_Sans] text-base text-[16px] mb-1">
                  {stat.label}
                </h3>
                
                <p className="text-white font-[DM_Sans] text-5xl text-[32px] text-right">
                  {stat.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center items-center gap-2 mt-4 px-6">
          {progressStats.map((_, index) => (
            <button
              key={index}
              className={`h-px rounded-full transition-all duration-300 ${
                index === currentProgressSlide ? 'w-12 bg-[#D4AF37]' : 'w-12 bg-gray-700'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Account Settings Section */}
      <section className="relative pb-24 pt-2 bg-black">
        <h2 className="text-left text-xs tracking-[0.3em] text-white mb-3 px-6 text-[10px] font-[DM_Sans]">
          ACCOUNT SETTINGS
        </h2>

        <div 
          ref={settingsScrollRef}
          onScroll={handleSettingsScroll}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-4 px-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {settingOptions.map((setting) => (
            <div 
              key={setting.id} 
              className="flex-shrink-0 w-[calc(100%-32px)] snap-center"
            >
              <div className="border border-[#D4AF37] rounded-3xl pl-8 pr-4 pt-4 pb-3 h-20 flex flex-col justify-between bg-black/40 backdrop-blur-sm" style={{ borderWidth: '0.5px' }}>
                <h3 className="text-[#D4AF37] font-[DM_Sans] text-xl">
                  {setting.label}
                </h3>
                
                <button className="flex items-center justify-end w-full text-[#D4AF37] font-[DM_Sans] tracking-[0.2em] text-[10px] gap-3">
                  <span>{setting.action}</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center items-center gap-2 mt-4 px-6">
          {settingOptions.map((_, index) => (
            <button
              key={index}
              className={`h-px rounded-full transition-all duration-300 ${
                index === currentSettingsSlide ? 'w-12 bg-[#D4AF37]' : 'w-12 bg-gray-700'
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