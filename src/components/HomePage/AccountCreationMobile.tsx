import { useState, useRef } from 'react';
import { ChevronDown, ArrowRight, Eye, EyeOff, X } from 'lucide-react';

interface AccountCreationMobileProps {
  opacity: number;
  onBack: () => void;
  onNavigate: (page: 'home' | 'programs' | 'account') => void;
  onAccountCreated?: (email: string, firstName: string, lastName: string) => void;
}

interface ProgramCard {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  category: string;
}

const FREE_PROGRAMS: ProgramCard[] = [
  {
    id: 'microdose-load-explode',
    title: 'Load–Explode',
    subtitle: 'Eccentric Loading +\nExplosive Concentric',
    image: 'https://images.unsplash.com/photo-1739295564766-af223cb3424d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxleHBsb3NpdmUlMjBhdGhsZXRpYyUyMG1vdmVtZW50fGVufDF8fHx8MTc2NDYxMDEyM3ww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Micro Dose'
  },
  {
    id: 'microdose-accel-decel',
    title: 'ACCEL-DECEL',
    subtitle: 'Speed Development +\nBraking Mechanics',
    image: 'https://images.unsplash.com/photo-1762709753401-d0ff2c4936c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdGhsZXRlJTIwYWNjZWxlcmF0aW9uJTIwc3ByaW50fGVufDF8fHx8MTc2NDYxMDEyM3ww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Micro Dose'
  },
  {
    id: 'microdose-drop-hop-pop',
    title: 'DROP-HOP-POP',
    subtitle: 'Plyometric Power +\nReactive Strength',
    image: 'https://images.unsplash.com/photo-1590148313504-47353056f37a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbHlvbWV0cmljJTIwanVtcCUyMHRyYWluaW5nfGVufDF8fHx8MTc2NDYxMDEyM3ww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Micro Dose'
  },
  {
    id: 'microdose-push-pull-rotate',
    title: 'PUSH-PULL-ROTATE',
    subtitle: 'Multi-Planar Strength +\nCore Integration',
    image: 'https://images.unsplash.com/photo-1602827114685-efbb2717da9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb3RhdGlvbmFsJTIwY29yZSUyMHRyYWluaW5nfGVufDF8fHx8MTc2NDYxMDEyM3ww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Micro Dose'
  },
  {
    id: 'microdose-pillar-power',
    title: 'PILLAR-POWER',
    subtitle: 'Core Stability +\nPower Transfer',
    image: 'https://images.unsplash.com/photo-1758599880557-e3a27500265e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdGhsZXRpYyUyMGNvcmUlMjBzdGFiaWxpdHl8ZW58MXx8fHwxNzY0NjEwMTI0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Micro Dose'
  },
  {
    id: 'microdose-isolate-integrate',
    title: 'ISOLATE-INTEGRATE',
    subtitle: 'Targeted Work +\nMovement Integration',
    image: 'https://images.unsplash.com/photo-1734668484998-c943d1fcb48a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpc29sYXRpb24lMjBzdHJlbmd0aCUyMHRyYWluaW5nfGVufDF8fHx8MTc2NDYxMDEyNHww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Micro Dose'
  },
  {
    id: 'microdose-active-recovery',
    title: 'ACTIVE RECOVERY',
    subtitle: 'Mobility + Tissue\nRegeneration',
    image: 'https://images.unsplash.com/photo-1761839257789-20147513121a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWNvdmVyeSUyMHN0cmV0Y2hpbmclMjBhdGhsZXRlfGVufDF8fHx8MTc2NDU0ODk2NXww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Micro Dose'
  }
];

export function AccountCreationMobile({ opacity, onBack, onNavigate, onAccountCreated }: AccountCreationMobileProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const [currentProgramSlide, setCurrentProgramSlide] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleContinueStep1 = () => {
    setCurrentStep(2);
  };

  const handleContinueStep2 = () => {
    setCurrentStep(3);
  };

  const handleProgramScroll = () => {
    if (scrollRef.current) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const cardWidth = scrollRef.current.offsetWidth - 32;
      const newIndex = Math.round(scrollLeft / cardWidth);
      setCurrentProgramSlide(newIndex);
    }
  };

  const scrollToProgramSlide = (index: number) => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.offsetWidth - 32;
      scrollRef.current.scrollTo({
        left: index * cardWidth,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div 
      className="transition-opacity duration-700 relative z-20 px-6 pb-24"
      style={{ opacity }}
    >
      {/* Gradient Blend Overlay */}
      <div 
        className="absolute top-0 left-0 right-0 pointer-events-none z-10"
        style={{
          height: '150px',
          background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.4) 40%, rgba(0, 0, 0, 1) 100%)'
        }}
      />

      {/* Step Indicator */}
      <div className="flex items-center justify-between mb-6 relative z-20">
        <button
          onClick={currentStep === 1 ? onBack : () => setCurrentStep(currentStep - 1)}
          className="flex items-center gap-3 font-[DM_Sans] text-white group"
          style={{
            fontSize: '10px',
            letterSpacing: '0.2em'
          }}
        >
          <span>STEP {currentStep}/3</span>
          <ChevronDown 
            size={14} 
            className="text-[#D4AF37] transition-transform duration-300"
          />
        </button>

        {/* Close Button */}
        <button
          onClick={onBack}
          className="text-white hover:text-[#D4AF37] transition-colors"
          aria-label="Close"
        >
          <X size={14} />
        </button>
      </div>

      {/* Step 1: Basic Information */}
      {currentStep === 1 && (
        <>
          <h2 
            className="mb-8 font-[DM_Sans] font-light text-white relative z-20"
            style={{
              fontSize: '22px',
              letterSpacing: '-0.01em',
              lineHeight: '1.1'
            }}
          >
            Create Your Account
          </h2>

          <div className="relative z-20">
            {/* Name Fields */}
            <div className="space-y-6 mb-6">
              <div>
                <label 
                  htmlFor="firstName" 
                  className="block mb-2 font-[DM_Sans]"
                  style={{
                    fontSize: '11px',
                    letterSpacing: '0.1em',
                    color: '#cccccc'
                  }}
                >
                  FIRST NAME
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-transparent border-b border-gray-700 focus:border-[#D4AF37] outline-none py-3 font-[DM_Sans] text-white transition-colors"
                  style={{
                    fontSize: '15px'
                  }}
                />
              </div>
              
              <div>
                <label 
                  htmlFor="lastName" 
                  className="block mb-2 font-[DM_Sans]"
                  style={{
                    fontSize: '11px',
                    letterSpacing: '0.1em',
                    color: '#cccccc'
                  }}
                >
                  LAST NAME
                </label>
                <input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-transparent border-b border-gray-700 focus:border-[#D4AF37] outline-none py-3 font-[DM_Sans] text-white transition-colors"
                  style={{
                    fontSize: '15px'
                  }}
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="mb-10">
              <label 
                htmlFor="email" 
                className="block mb-2 font-[DM_Sans]"
                style={{
                  fontSize: '11px',
                  letterSpacing: '0.1em',
                  color: '#cccccc'
                }}
              >
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-b border-gray-700 focus:border-[#D4AF37] outline-none py-3 font-[DM_Sans] text-white transition-colors"
                style={{
                  fontSize: '15px'
                }}
              />
            </div>

            {/* Continue Button */}
            <button
              onClick={handleContinueStep1}
              disabled={!firstName || !lastName || !email}
              className="group flex items-center justify-center gap-2 w-full px-6 py-3 bg-[#D4AF37] text-black hover:bg-[#E5C158] transition-all duration-500 font-[DM_Sans] rounded-[25px] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#D4AF37]"
              style={{
                fontSize: '11px',
                letterSpacing: '0.12em',
                fontWeight: 500,
                boxShadow: '0 4px 16px rgba(212, 175, 55, 0.3)'
              }}
            >
              <span className="text-[rgb(255,255,255)]">CONTINUE</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform text-white" />
            </button>

            {/* Terms Text */}
            <p 
              className="font-[DM_Sans] text-center"
              style={{
                fontSize: '10px',
                letterSpacing: '0.01em',
                lineHeight: '1.6',
                color: '#cccccc',
                marginTop: '1rem'
              }}
            >
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </>
      )}

      {/* Step 2: Password Creation */}
      {currentStep === 2 && (
        <>
          <h2 
            className="mb-8 font-[DM_Sans] font-light text-white relative z-20"
            style={{
              fontSize: '22px',
              letterSpacing: '-0.01em',
              lineHeight: '1.1'
            }}
          >
            Create Your Password
          </h2>

          <div className="relative z-20">
            {/* Password Field */}
            <div className="mb-6">
              <label 
                htmlFor="password" 
                className="block mb-2 font-[DM_Sans]"
                style={{
                  fontSize: '11px',
                  letterSpacing: '0.1em',
                  color: '#cccccc'
                }}
              >
                PASSWORD
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent border-b border-gray-700 focus:border-[#D4AF37] outline-none py-3 font-[DM_Sans] text-white transition-colors pr-12"
                  style={{
                    fontSize: '15px'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 hover:text-[#D4AF37] transition-colors"
                  style={{ color: '#cccccc' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="mb-10">
              <label 
                htmlFor="confirmPassword" 
                className="block mb-2 font-[DM_Sans]"
                style={{
                  fontSize: '11px',
                  letterSpacing: '0.1em',
                  color: '#cccccc'
                }}
              >
                CONFIRM PASSWORD
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-transparent border-b border-gray-700 focus:border-[#D4AF37] outline-none py-3 font-[DM_Sans] text-white transition-colors pr-12"
                  style={{
                    fontSize: '15px'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 hover:text-[#D4AF37] transition-colors"
                  style={{ color: '#cccccc' }}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Continue Button */}
            <button
              onClick={handleContinueStep2}
              disabled={!password || !confirmPassword}
              className="group flex items-center justify-center gap-2 w-full px-6 py-3 bg-[#D4AF37] text-black hover:bg-[#E5C158] transition-all duration-500 font-[DM_Sans] rounded-[25px] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#D4AF37]"
              style={{
                fontSize: '11px',
                letterSpacing: '0.12em',
                fontWeight: 500,
                boxShadow: '0 4px 16px rgba(212, 175, 55, 0.3)'
              }}
            >
              <span className="text-[rgb(255,255,255)]">CONTINUE</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform text-white" />
            </button>

            {/* Password Requirements */}
            <p 
              className="font-[DM_Sans] text-center"
              style={{
                fontSize: '10px',
                letterSpacing: '0.01em',
                lineHeight: '1.6',
                color: '#cccccc',
                marginTop: '1rem'
              }}
            >
              Password must be at least 8 characters with uppercase, lowercase, and numbers
            </p>
          </div>
        </>
      )}

      {/* Step 3: Select Free Program */}
      {currentStep === 3 && (
        <>
          <h2 
            className="mb-4 font-[DM_Sans] font-light text-white relative z-20"
            style={{
              fontSize: '22px',
              letterSpacing: '-0.01em',
              lineHeight: '1.1'
            }}
          >
            Choose Your Free Program
          </h2>

          <p 
            className="mb-8 font-[DM_Sans] relative z-20"
            style={{
              fontSize: '12px',
              letterSpacing: '0.01em',
              lineHeight: '1.6',
              color: '#cccccc'
            }}
          >
            Select one complimentary programme to get started on your training journey
          </p>

          {/* Program Cards Container */}
          <div 
            ref={scrollRef}
            onScroll={handleProgramScroll}
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-4 relative z-20 mb-8 -mx-6 px-4"
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none'
            }}
          >
            {FREE_PROGRAMS.map((program) => (
              <div 
                key={program.id} 
                className="flex-shrink-0 w-[calc(100%-32px)] snap-center"
              >
                <div
                  className={`relative rounded-[20px] overflow-hidden cursor-pointer transition-all duration-500 ring-1 ${
                    selectedProgram === program.id 
                      ? 'ring-[rgba(34,197,94,1)] shadow-[0_0_30px_rgba(34,197,94,0.5)]' 
                      : 'ring-[#D4AF37]'
                  }`}
                  onClick={() => setSelectedProgram(program.id)}
                  style={{
                    height: '400px',
                    backgroundColor: 'rgba(20, 20, 20, 0.8)',
                    backdropFilter: 'blur(20px)',
                    border: selectedProgram === program.id ? '1px solid rgba(34, 197, 94, 1)' : '1px solid #D4AF37',
                    boxShadow: selectedProgram === program.id ? '0 4px 20px rgba(34, 197, 94, 0.1)' : '0 4px 20px rgba(212, 175, 55, 0.1)'
                  }}
                >
                  {/* Background Image */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${program.image})`,
                      opacity: selectedProgram === program.id ? 0.5 : 0.3
                    }}
                  />

                  {/* Gradient Overlay */}
                  <div 
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 70%, rgba(0,0,0,0.95) 100%)'
                    }}
                  />

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    {/* Category Badge */}
                    <div 
                      className="mb-3 inline-flex items-center px-3 py-1.5 rounded-full font-[DM_Sans] self-start"
                      style={{
                        fontSize: '9px',
                        letterSpacing: '0.15em',
                        backgroundColor: 'rgba(212, 175, 55, 0.15)',
                        color: '#D4AF37',
                        border: '1px solid rgba(212, 175, 55, 0.3)'
                      }}
                    >
                      {program.category}
                    </div>

                    {/* Title */}
                    <h3 
                      className="font-[DM_Sans] text-white mb-2"
                      style={{
                        fontSize: '22px',
                        letterSpacing: '0.05em',
                        fontWeight: 600
                      }}
                    >
                      {program.title}
                    </h3>

                    {/* Subtitle */}
                    <p 
                      className="font-[DM_Sans] mb-4 whitespace-pre-line"
                      style={{
                        fontSize: '12px',
                        letterSpacing: '0.02em',
                        lineHeight: '1.6',
                        color: '#cccccc'
                      }}
                    >
                      {program.subtitle}
                    </p>

                    {/* Selection Indicator */}
                    {selectedProgram === program.id && (
                      <div 
                        className="flex items-center gap-2 font-[DM_Sans] text-[#D4AF37]"
                        style={{
                          fontSize: '11px',
                          letterSpacing: '0.1em'
                        }}
                      >
                        <div className="w-4 h-4 rounded-full bg-[#D4AF37] flex items-center justify-center">
                          <svg width="10" height="8" viewBox="0 0 12 9" fill="none">
                            <path d="M1 4.5L4.5 8L11 1" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        SELECTED
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center items-center gap-2 mb-8 relative z-20">
            {FREE_PROGRAMS.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToProgramSlide(index)}
                className={`h-px rounded-full transition-all duration-300 ${
                  index === currentProgramSlide ? 'w-12 bg-[#D4AF37]' : 'w-12 bg-gray-700'
                }`}
              />
            ))}
          </div>

          {/* Confirm Button */}
          <div className="relative z-20">
            <button
              disabled={!selectedProgram}
              onClick={() => {
                if (selectedProgram && onAccountCreated) {
                  onAccountCreated(email, firstName, lastName);
                }
                onNavigate('account');
              }}
              className="group flex items-center justify-center gap-2 w-full px-6 py-3 bg-[#D4AF37] text-black hover:bg-[#E5C158] transition-all duration-500 font-[DM_Sans] rounded-[25px] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#D4AF37]"
              style={{
                fontSize: '11px',
                letterSpacing: '0.12em',
                fontWeight: 500,
                boxShadow: '0 4px 16px rgba(212, 175, 55, 0.3)'
              }}
            >
              <span className="text-[rgb(255,255,255)]">CONFIRM & START</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform text-white" />
            </button>

            <p 
              className="mt-4 text-gray-400 font-[DM_Sans] text-center"
              style={{
                fontSize: '10px',
                letterSpacing: '0.01em',
                lineHeight: '1.6'
              }}
            >
              You can purchase additional programmes anytime from your account
            </p>
          </div>
        </>
      )}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}