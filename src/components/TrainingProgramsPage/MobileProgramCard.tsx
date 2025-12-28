import { ChevronDown, ChevronRight } from 'lucide-react';

interface MobileProgramCardProps {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  duration?: string;
  sessions?: string;
  time?: string;
  isOwned: boolean;
  onAction: () => void;
}

export function MobileProgramCard({
  id,
  title,
  subtitle,
  image,
  duration = '6 week program',
  sessions = '5 sessions p/w',
  time = '20 mins',
  isOwned,
  onAction
}: MobileProgramCardProps) {
  return (
    <div 
      className="relative overflow-hidden bg-black rounded-[20px] h-[400px]"
      style={{
        border: isOwned ? '1px solid rgba(34, 197, 94, 1)' : '1px solid #D4AF37',
        boxShadow: isOwned ? '0 4px 20px rgba(34, 197, 94, 0.1)' : '0 4px 20px rgba(212, 175, 55, 0.1)',
        transition: 'all 0.3s ease'
      }}
    >
      {/* Main Content Container */}
      <div className="relative flex flex-col h-[400px]">
        {/* Top Section - Image */}
        <div className="relative overflow-hidden h-[50%]">
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover"
            style={{ objectPosition: 'center 30%' }}
          />
        </div>

        {/* Bottom Section - Text Content */}
        <div className="flex flex-col justify-between p-6 bg-black flex-1">
          <div className="text-left flex-1 overflow-hidden">
            <h3 
              className="mb-3 text-white"
              style={{
                fontSize: '20px',
                letterSpacing: '0.02em',
                lineHeight: '1.2',
                textTransform: 'capitalize',
                fontFamily: 'DM Sans',
                fontWeight: 300
              }}
            >
              {title}
            </h3>
            <p 
              className="whitespace-pre-line"
              style={{
                fontSize: '12px',
                letterSpacing: '0.01em',
                lineHeight: '1.6',
                color: '#CCCCCC',
                fontFamily: 'DM Sans',
                fontWeight: 300
              }}
            >
              {subtitle.replace(/\\n/g, '\n')}
            </p>

            {/* Program Details */}
            <div className="space-y-1 mt-3">
              <p
                style={{
                  fontSize: '11px',
                  letterSpacing: '0.01em',
                  color: '#999999',
                  fontFamily: 'DM Sans',
                  fontWeight: 300
                }}
              >
                {duration}
              </p>
              <p
                style={{
                  fontSize: '11px',
                  letterSpacing: '0.01em',
                  color: '#999999',
                  fontFamily: 'DM Sans',
                  fontWeight: 300
                }}
              >
                {sessions}
              </p>
              <p
                style={{
                  fontSize: '11px',
                  letterSpacing: '0.01em',
                  color: '#999999',
                  fontFamily: 'DM Sans',
                  fontWeight: 300
                }}
              >
                {time}
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex items-center justify-end mt-4">
            {isOwned ? (
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
                  OPEN
                </span>
                <ChevronRight 
                  size={16} 
                  className="text-[#D4AF37] transition-transform group-hover/btn:translate-x-1" 
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
                  className="font-[DM_Sans]"
                  style={{
                    fontSize: '10px',
                    letterSpacing: '0.15em',
                    fontWeight: 500,
                    color: '#FFFFFF'
                  }}
                >
                  ADD
                </span>
                <ChevronDown 
                  size={16}
                  className="text-[#D4AF37]"
                />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}