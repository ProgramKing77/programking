import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface MobileServiceCardProps {
  title: string;
  subtitle: string;
  image: string;
  expandedContent: string;
  onMoreInfo: () => void;
}

export function MobileServiceCard({
  title,
  subtitle,
  image,
  expandedContent,
  onMoreInfo
}: MobileServiceCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div 
      className={`relative overflow-hidden transition-all duration-500 ease-out bg-black rounded-[20px] ${
        isExpanded ? 'h-auto' : 'h-[400px]'
      }`}
      style={{
        border: '1px solid #D4AF37',
        boxShadow: '0 4px 20px rgba(212, 175, 55, 0.1)'
      }}
    >
      {/* Background Image - Shows when expanded */}
      <div className={`absolute inset-0 overflow-hidden transition-all duration-500 ${
        isExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}>
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black" />
      </div>

      {/* Main Content Container */}
      <div className={`relative flex flex-col ${isExpanded ? 'h-auto' : 'h-[400px]'}`}>
        {/* Top Section - Image (only visible when collapsed) */}
        <div className={`relative overflow-hidden transition-all duration-500 ${
          isExpanded ? 'h-0 opacity-0' : 'h-[50%] opacity-100'
        }`}>
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover"
            style={{ objectPosition: 'center 30%' }}
          />
        </div>

        {/* Bottom Section - Text Content */}
        <div className={`flex flex-col justify-between p-6 bg-black relative transition-all duration-500 ${
          isExpanded ? 'bg-transparent pt-8' : 'flex-1'
        }`}>
          <div className="text-left flex-1 overflow-hidden">
            <h3 
              className="mb-3 text-white relative z-10"
              style={{
                fontSize: '20px',
                letterSpacing: '0.02em',
                lineHeight: '1.2',
                textTransform: 'capitalize',
                textShadow: isExpanded ? '0 2px 8px rgba(0, 0, 0, 0.8)' : 'none',
                fontFamily: 'DM Sans',
                fontWeight: 300
              }}
            >
              {title.split(' ').map((word, i, arr) => (
                <span key={i}>
                  {word}
                  {i < arr.length - 1 && (
                    arr[i + 1] === '+' ? ' ' : <br />
                  )}
                </span>
              ))}
            </h3>
            <p 
              className={`whitespace-pre-line relative z-10 ${ !isExpanded ? 'line-clamp-3' : ''
              }`}
              style={{
                fontSize: '12px',
                letterSpacing: '0.01em',
                lineHeight: '1.6',
                textShadow: isExpanded ? '0 2px 8px rgba(0, 0, 0, 0.8)' : 'none',
                color: '#CCCCCC',
                display: '-webkit-box',
                WebkitLineClamp: isExpanded ? 'unset' : 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                fontFamily: 'DM Sans',
                fontWeight: 300
              }}
            >
              {title === 'Training Programs' 
                ? 'Engineered to develop specific athletic qualities – fortifying your physical capacity and movement skill.'
                : title === 'Private Coaching' 
                ? 'Combining research, data, field-based evidence and expertise to form an individual approach to developing athleticism, promoting recovery and improving performance.'
                : title === 'Athletic Profiling'
                ? 'Data informed performance screenings to analyse movement, establish strengths and identify key training opportunities.'
                : title === 'Events + Workshops'
                ? 'Informative and practical presentations with the aim of offering unique insights and actionable takeaways, in relation to performance and coaching.'
                : subtitle.replace(/\\n/g, '\n')}
            </p>
          </div>

          {/* Expand button - only visible when collapsed */}
          {!isExpanded && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2 transition-colors font-[DM_Sans] relative z-10 self-end mt-4"
              style={{
                fontSize: '10px',
                letterSpacing: '0.15em'
              }}
            >
              <span style={{ color: '#FFFFFF' }}>EXPAND</span>
              <ChevronDown 
                className="transition-transform duration-300 text-[#D4AF37] hover:text-[#E5C158]"
                size={16}
              />
            </button>
          )}
        </div>
      </div>

      {/* Expanded Content */}
      <div 
        className={`transition-all duration-500 ease-out overflow-hidden relative z-10 ${
          isExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-6 pt-0">
          <div 
            className="text-gray-300 mb-12 text-left mt-6"
            style={{
              fontSize: '14px',
              letterSpacing: '0.01em',
              lineHeight: '1.7',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)',
              fontFamily: 'DM Sans'
            }}
          >
            {title === 'Training Programs' ? (
              <p className="text-[12px] whitespace-pre-line" style={{ fontFamily: 'DM Sans', fontWeight: 300 }}>
                We believe that true high performance is the ability to express your physical capabilities, in the moment... any moment, when it matters most.{'\n\n'}Our programs are designed to not only increase your physical capacities, but also improve your ability to access, use and apply them effectively.{'\n\n'}Every plan is constructed with thoughtful, strategic and progressive exposure to both exercise intensities and complexities of movement – providing a truly comprehensive training approach to maximising your performance.
              </p>
            ) : title === 'Athletic Profiling' ? (
              <p className="text-[12px] whitespace-pre-line" style={{ fontFamily: 'DM Sans', fontWeight: 300 }}>
                Using state of the art technology, we are able to collect key information to quantify and analyse your athletic qualities, building a comprehensive profile of your physiology, performance capacities and movement strategies.{'\n\n'}Our screening process is formulated specifically for you, in context to your sport and specific performance goals, ensuring we collect meaningful data in order to provide impactful solutions. Profiling and testing assists in maximising training effectiveness, monitoring athlete readiness and fatigue, mitigating injury risk and measuring physical progress.
              </p>
            ) : title === 'Events + Workshops' ? (
              <p className="text-[12px] whitespace-pre-line" style={{ fontFamily: 'DM Sans', fontWeight: 300 }}>
                We deliver workshops and presentations on a number of topics for athletes, coaches, parents and within educational settings.  Our main objective is to provide you information, perspective, understanding, context and useful tools that will bolster your framework – in the pursuit of better performance.{'\n\n'}For further information or to discuss presentation opportunities, please complete the enquiry form.
              </p>
            ) : (
              <>
                <p className="mb-2 text-[14px] text-[rgb(207,179,84)]" style={{ fontFamily: 'DM Sans', fontWeight: 400 }}>1-1 Coaching Sessions</p>
                <p className="mb-4 text-[12px]" style={{ fontFamily: 'DM Sans', fontWeight: 300 }}>
                  Our appreciation for the uniqueness of each athlete, inspires our attention to detail and drives our relentlessness in supporting our athletes. Devised specifically and appropriately for you, our coach-led training sessions serve to expedite the developmental process and enhance the effectiveness of your training.
                </p>
                <p className="mb-2 text-[14px] text-[rgb(207,179,84)]" style={{ fontFamily: 'DM Sans', fontWeight: 400 }}>Remote Services</p>
                <p className="mb-4 text-[12px]" style={{ fontFamily: 'DM Sans', fontWeight: 300 }}>
                  We deploy the same individual approach when working with athletes nationally and internationally, to provide premier training solutions and contribute to their performance pursuits. From bespoke programming to training consultancy, we provide expert support to maximise your potential.
                </p>
              </>
            )}
          </div>
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 transition-colors font-[DM_Sans] relative z-10 mb-6"
            style={{
              fontSize: '10px',
              letterSpacing: '0.15em',
              marginLeft: 'auto'
            }}
          >
            <span style={{ color: '#FFFFFF' }}>COLLAPSE</span>
            <ChevronDown 
              className={`transition-transform duration-300 text-[#D4AF37] hover:text-[#E5C158] rotate-180`}
              size={16}
            />
          </button>

          <div className="flex justify-end">
            <button
              onClick={onMoreInfo}
              className={`px-5 py-2 transition-colors font-[DM_Sans] rounded-[10px] ${
                title === 'Training Programs' 
                  ? 'bg-[#D4AF37] hover:bg-[#E5C158]' 
                  : 'bg-transparent hover:bg-[#D4AF37]/10'
              }`}
              style={{
                fontSize: '10px',
                letterSpacing: '0.15em',
                fontWeight: 500,
                color: title === 'Training Programs' ? '#FFFFFF' : '#D4AF37',
                border: title === 'Training Programs' ? 'none' : '1px solid #D4AF37'
              }}
            >
              {title === 'Training Programs' ? 'VIEW PROGRAMS' : 'ENQUIRE'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}