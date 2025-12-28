import { useState, useRef } from 'react';
import decorativePattern from 'figma:asset/49b75af680b771f0c0e187cb475cdbebf1beb5ed.png';

interface NestedProgram {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  buttonText: string;
  isOwned?: boolean;
  onAction?: () => void;
}

interface ServiceCardProps {
  title: string;
  subtitle: string;
  image: string;
  buttonText: string;
  expandedContent: string;
  onMoreInfo?: () => void;
  onView?: () => void;
  viewButtonText?: string;
  nestedPrograms?: NestedProgram[];
  sets?: number;
  reps?: number;
}

export function ServiceCard({ title, subtitle, image, buttonText, expandedContent, onMoreInfo, onView, viewButtonText = 'VIEW', nestedPrograms, sets, reps }: ServiceCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [nestedSlide, setNestedSlide] = useState(0);
  const nestedScrollRef = useRef<HTMLDivElement>(null);

  const handleNestedScroll = () => {
    if (nestedScrollRef.current) {
      const scrollLeft = nestedScrollRef.current.scrollLeft;
      const cardWidth = nestedScrollRef.current.offsetWidth;
      const newIndex = Math.round(scrollLeft / cardWidth);
      setNestedSlide(newIndex);
    }
  };

  return (
    <div className={`relative rounded-lg overflow-hidden border border-[#cfb354]/50 bg-black/40 backdrop-blur-sm shadow-2xl transition-all duration-500 ${isExpanded ? (nestedPrograms ? 'h-[650px]' : 'h-[450px]') : 'h-[255px]'}`}>
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/35 to-black/35" />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col p-6">
        <div className="flex-1">
          <h3 className="text-[#D4AF37] text-lg tracking-[0.15em] mb-2 font-[DM_Sans] text-[14px]">
            {title}
          </h3>
          <p className="text-[rgb(204,204,204)] text-sm whitespace-pre-line leading-tight font-[DM_Sans]" style={{ fontWeight: 170 }}>
            {sets !== undefined && reps !== undefined ? (
              <>
                Sets - {sets}
                {'\n'}
                Reps - {reps}
              </>
            ) : (
              subtitle
            )}
          </p>
          
          {/* Expanded Content */}
          <div className={`overflow-hidden transition-all duration-500 ${isExpanded ? 'max-h-[500px] opacity-100 mt-6' : 'max-h-0 opacity-0'}`}>
            <p className="text-[rgb(204,204,204)] text-xs leading-relaxed font-[DM_Sans] font-extralight mb-6 font-[DM_Sans_ExtraLight]">
              {expandedContent}
            </p>
            
            {/* Nested Programs Carousel */}
            {nestedPrograms && nestedPrograms.length > 0 && (
              <div className="mt-2">
                <div 
                  ref={nestedScrollRef}
                  onScroll={handleNestedScroll}
                  className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-3 px-8 py-2"
                >
                  {nestedPrograms.map((program) => (
                    <div 
                      key={program.id} 
                      className="flex-shrink-0 w-[190px] snap-center"
                    >
                      <div className="relative rounded-lg overflow-hidden bg-black/60 backdrop-blur-sm shadow-[0_4px_20px_rgba(0,0,0,0.5)] h-[280px]">
                        {/* Background Image */}
                        <div className="absolute inset-0">
                          <img
                            src={program.image}
                            alt={program.title}
                            className="w-full h-full object-cover opacity-50"
                          />
                          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/60" />
                        </div>

                        {/* Content */}
                        <div className="relative h-full flex flex-col p-4 justify-between">
                          <div>
                            <h5 className="text-[#D4AF37] tracking-[0.1em] mb-1.5 font-[DM_Sans]" style={{ fontSize: '11px' }}>
                              {program.title}
                            </h5>
                            <p className="text-[rgb(204,204,204)] whitespace-pre-line leading-tight font-[DM_Sans]" style={{ fontSize: '9px', fontWeight: 170 }}>
                              {program.subtitle}
                            </p>
                          </div>
                          
                          {/* Decorative Pattern */}
                          <div className="flex-1 flex items-center justify-center">
                            <img 
                              src={decorativePattern} 
                              alt="" 
                              className="w-full h-auto object-contain opacity-60 pointer-events-none"
                              style={{ maxHeight: '160px' }}
                            />
                          </div>
                          
                          {/* Action Button */}
                          {program.onAction && (
                            <button 
                              className="w-full py-1.5 rounded-md border border-[#D4AF37]/40 text-[#D4AF37] tracking-[0.2em] hover:bg-[#D4AF37]/10 transition-all duration-300 backdrop-blur-sm font-[DM_Sans] font-extralight"
                              style={{ fontSize: '9px' }}
                              onClick={program.onAction}
                            >
                              {program.isOwned ? 'OPEN' : 'ADD'}
                            </button>
                          )}
                        </div>

                        {/* Subtle glow effect */}
                        <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(212,175,55,0.02)] pointer-events-none rounded-lg" />
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Pagination Dots for Nested Cards */}
                {nestedPrograms.length > 1 && (
                  <div className="flex justify-center items-center gap-1.5 mt-3">
                    {nestedPrograms.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          if (nestedScrollRef.current) {
                            const cardWidth = 190 + 12; // card width + gap
                            nestedScrollRef.current.scrollTo({
                              left: index * cardWidth,
                              behavior: 'smooth'
                            });
                          }
                        }}
                        className={`h-px rounded-full transition-all duration-300 ${
                          index === nestedSlide ? 'w-8 bg-[#D4AF37]' : 'w-8 bg-gray-700'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {/* Original Buttons - only show if no nested programs */}
            {!nestedPrograms && (
              <>
                {onMoreInfo && (
                  <button 
                    className="mt-5 mb-8 px-6 py-1.5 rounded-md border border-[#D4AF37]/40 text-[#D4AF37] tracking-[0.2em] hover:bg-[#D4AF37]/10 transition-all duration-300 backdrop-blur-sm font-[DM_Sans] font-extralight"
                    style={{ fontSize: '10.2px' }}
                    onClick={onMoreInfo}
                  >
                    MORE INFO
                  </button>
                )}
                {onView && (
                  <button 
                    className="mt-5 mb-8 px-6 py-1.5 rounded-md border border-[#D4AF37]/40 text-[#D4AF37] tracking-[0.2em] hover:bg-[#D4AF37]/10 transition-all duration-300 backdrop-blur-sm font-[DM_Sans] font-extralight"
                    style={{ fontSize: '10.2px' }}
                    onClick={onView}
                  >
                    {viewButtonText}
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Expand Button */}
        <div className="flex flex-col items-center gap-1">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="-mt-2 text-[#CCCCCC] tracking-[0.2em] hover:text-[#CCCCCC]/80 transition-all duration-300 font-[DM_Sans] font-extralight"
            style={{ fontSize: '10.2px' }}
          >
            {buttonText}
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[#cfb354] transition-all duration-300 hover:text-[#cfb354]/80"
          >
            <svg 
              width="15" 
              height="8" 
              viewBox="0 0 15 8" 
              fill="none" 
              className={`transition-transform duration-500 ${isExpanded ? 'rotate-180' : ''}`}
            >
              <path d="M1 1L7.5 6L14 1" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Subtle glow effect */}
      <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(212,175,55,0.03)] pointer-events-none" />
      
      {/* Nested scrollbar hide */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}