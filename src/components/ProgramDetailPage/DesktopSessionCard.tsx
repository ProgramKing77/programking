import { ChevronRight, Check } from 'lucide-react';

interface DesktopSessionCardProps {
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

export function DesktopSessionCard({
  week,
  session,
  tempo,
  tempoDetail,
  exerciseCount,
  exerciseDetails,
  isComplete,
  image,
  onAction
}: DesktopSessionCardProps) {
  const placeholderImage = "https://images.unsplash.com/photo-1676989121400-63ba765d7f55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxneW0lMjB0cmFpbmluZyUyMGVxdWlwbWVudHxlbnwxfHx8fDE3NjU3MzMwNjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
  const displayImage = image || placeholderImage;
  
  return (
    <div
      className="relative bg-black overflow-hidden group cursor-pointer rounded-[20px]"
      style={{
        border: isComplete ? '1px solid rgba(34, 197, 94, 1)' : '1px solid #D4AF37',
        boxShadow: isComplete ? '0 4px 20px rgba(34, 197, 94, 0.1)' : '0 4px 20px rgba(212, 175, 55, 0.1)',
        transition: 'all 0.3s ease',
        height: '280px'
      }}
      onClick={onAction}
    >
      <div className="flex h-full">
        {/* Image Section - 45% width */}
        <div className="w-[45%] relative overflow-hidden">
          <img
            src={displayImage}
            alt={`Week ${week} Session ${session}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            style={{
              filter: isComplete ? 'none' : 'grayscale(100%)'
            }}
          />
          <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%)'
            }}
          />
        </div>

        {/* Content Section - 55% width */}
        <div className="w-[55%] p-6 flex flex-col justify-between">
          <div>
            <h3
              className="font-[DM_Sans] text-white mb-2"
              style={{
                fontSize: '20px',
                letterSpacing: '0.02em',
                lineHeight: '1.2'
              }}
            >
              Week {week}
            </h3>
            <h4
              className="font-[DM_Sans] text-white mb-4"
              style={{
                fontSize: '16px',
                letterSpacing: '0.01em',
                lineHeight: '1.2'
              }}
            >
              Session {session}
            </h4>
            <p
              className="font-[DM_Sans] text-gray-400 mb-4"
              style={{
                fontSize: '13px',
                letterSpacing: '0.01em',
                lineHeight: '1.4'
              }}
            >
              {tempo}
              {tempoDetail && <><br />{tempoDetail}</>}
            </p>

            {/* Exercise Details */}
            <div className="space-y-1 mb-6">
              <p
                className="font-[DM_Sans]"
                style={{
                  fontSize: '11px',
                  letterSpacing: '0.01em',
                  color: isComplete ? '#22c55e' : '#D4AF37'
                }}
              >
                {exerciseCount} exercises
              </p>
              <p
                className="font-[DM_Sans] text-gray-500"
                style={{
                  fontSize: '11px',
                  letterSpacing: '0.01em'
                }}
              >
                {exerciseDetails}
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex items-center justify-end">
            {isComplete ? (
              <button
                className="flex items-center gap-2 group/btn ml-auto"
                onClick={(e) => {
                  e.stopPropagation();
                  onAction();
                }}
              >
                <span
                  className="font-[DM_Sans]"
                  style={{
                    fontSize: '12px',
                    letterSpacing: '0.1em',
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
                className="flex items-center gap-2 group/btn ml-auto"
                onClick={(e) => {
                  e.stopPropagation();
                  onAction();
                }}
              >
                <span
                  className="font-[DM_Sans] text-[#D4AF37]"
                  style={{
                    fontSize: '12px',
                    letterSpacing: '0.1em',
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