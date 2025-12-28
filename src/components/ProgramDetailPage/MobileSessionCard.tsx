import { ChevronRight, Check } from 'lucide-react';

interface MobileSessionCardProps {
  id: string;
  week: number;
  session: string;
  tempo: string;
  tempoDetail: string;
  exerciseCount: number;
  exerciseDetails: string;
  isComplete: boolean;
  image?: string;
  onAction: () => void;
}

export function MobileSessionCard({
  week,
  session,
  tempo,
  tempoDetail,
  exerciseCount,
  exerciseDetails,
  isComplete,
  image,
  onAction
}: MobileSessionCardProps) {
  const placeholderImage = "https://images.unsplash.com/photo-1676989121400-63ba765d7f55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxneW0lMjB0cmFpbmluZyUyMGVxdWlwbWVudHxlbnwxfHx8fDE3NjU3MzMwNjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
  const displayImage = image || placeholderImage;
  
  return (
    <div 
      className="relative overflow-hidden bg-black rounded-[20px] h-[400px]"
      style={{
        border: isComplete ? '1px solid rgba(34, 197, 94, 1)' : '1px solid #D4AF37',
        boxShadow: isComplete ? '0 4px 20px rgba(34, 197, 94, 0.1)' : '0 4px 20px rgba(212, 175, 55, 0.1)',
        transition: 'all 0.3s ease'
      }}
      onClick={onAction}
    >
      {/* Main Content Container */}
      <div className="relative flex flex-col h-[400px]">
        {/* Top Section - Image */}
        <div className="relative overflow-hidden h-[50%]">
          <img 
            src={displayImage} 
            alt={`Week ${week} Session ${session}`}
            className="w-full h-full object-cover"
            style={{ 
              objectPosition: 'center 30%',
              filter: isComplete ? 'none' : 'grayscale(100%)'
            }}
          />
        </div>

        {/* Bottom Section - Text Content */}
        <div className="flex flex-col justify-between p-6 bg-black flex-1">
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
                Week {week}
              </span>
            </h3>
            <h4
              className="font-[DM_Sans] text-white mb-3"
              style={{
                fontSize: '16px',
                letterSpacing: '0.01em',
                lineHeight: '1.2'
              }}
            >
              Session {session}
            </h4>
            <p 
              className="font-[DM_Sans_Thin] whitespace-pre-line"
              style={{
                fontSize: '12px',
                letterSpacing: '0.01em',
                lineHeight: '1.6',
                color: '#CCCCCC'
              }}
            >
              {tempo}
              {tempoDetail && <><br />{tempoDetail}</>}
            </p>

            {/* Exercise Details */}
            <div className="space-y-1 mt-3">
              <p
                className="font-[DM_Sans_Thin]"
                style={{
                  fontSize: '11px',
                  letterSpacing: '0.01em',
                  color: isComplete ? '#22c55e' : '#D4AF37'
                }}
              >
                {exerciseCount} exercises
              </p>
              <p
                className="font-[DM_Sans_Thin]"
                style={{
                  fontSize: '11px',
                  letterSpacing: '0.01em',
                  color: '#999999'
                }}
              >
                {exerciseDetails}
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex items-center justify-end mt-4">
            {isComplete ? (
              <button
                className="flex items-center gap-2 group/btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onAction();
                }}
              >
                <span
                  className="font-[DM_Sans]"
                  style={{
                    fontSize: '10px',
                    letterSpacing: '0.15em',
                    fontWeight: 500,
                    color: '#22c55e'
                  }}
                >
                  COMPLETE
                </span>
                <Check 
                  size={16} 
                  className="text-[#22c55e]" 
                />
              </button>
            ) : (
              <button
                className="flex items-center gap-2 group/btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onAction();
                }}
              >
                <span
                  className="font-[DM_Sans] text-[#D4AF37]"
                  style={{
                    fontSize: '10px',
                    letterSpacing: '0.15em',
                    fontWeight: 500
                  }}
                >
                  START
                </span>
                <ChevronRight 
                  size={16} 
                  className="text-[#D4AF37] transition-transform group-hover/btn:translate-x-1" 
                />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}