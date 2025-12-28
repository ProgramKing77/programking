import { ChevronRight, Check } from 'lucide-react';

interface MobileAccountProgramCardProps {
  title: string;
  subtitle: string;
  image: string;
  duration: string;
  sessions: string;
  time: string;
  progress: number;
  status: 'not-started' | 'in-progress' | 'complete';
  onAction: () => void;
}

export function MobileAccountProgramCard({
  title,
  subtitle,
  image,
  duration,
  sessions,
  time,
  progress,
  status,
  onAction
}: MobileAccountProgramCardProps) {
  const getButtonText = () => {
    if (status === 'complete') return 'COMPLETE';
    if (status === 'in-progress') return 'OPEN';
    return 'START';
  };

  return (
    <div 
      className="relative overflow-hidden bg-black rounded-[20px] h-[400px]"
      style={{
        border: status === 'complete' ? '1px solid rgba(34, 197, 94, 1)' : '1px solid #D4AF37',
        boxShadow: status === 'complete' ? '0 4px 20px rgba(34, 197, 94, 0.1)' : '0 4px 20px rgba(212, 175, 55, 0.1)',
        transition: 'all 0.3s ease'
      }}
      onClick={onAction}
    >
      {/* Progress Badge */}
      <div 
        className="absolute top-3 left-3 z-20 px-2.5 py-1 rounded-full text-[9px] font-[DM_Sans] tracking-wider"
        style={{
          background: status === 'complete' ? 'rgba(74, 222, 128, 0.15)' : 'rgba(212, 175, 55, 0.15)',
          border: `1px solid ${status === 'complete' ? 'rgba(74, 222, 128, 0.3)' : 'rgba(212, 175, 55, 0.3)'}`,
          color: status === 'complete' ? '#4ADE80' : '#D4AF37',
          backdropFilter: 'blur(10px)'
        }}
      >
        {progress}%
      </div>

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
              className="mb-3 font-[DM_Sans] text-white"
              style={{
                fontSize: '24px',
                letterSpacing: '0.02em',
                lineHeight: '1.2',
                textTransform: 'capitalize'
              }}
            >
              <span className="text-[20px] font-[DM_Sans_Light]">
                {title}
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
              {subtitle.replace(/\\n/g, '\n')}
            </p>

            {/* Program Details */}
            <div className="space-y-1 mt-3">
              <p
                className="font-[DM_Sans_Thin]"
                style={{
                  fontSize: '11px',
                  letterSpacing: '0.01em',
                  color: '#999999'
                }}
              >
                {duration}
              </p>
              <p
                className="font-[DM_Sans_Thin]"
                style={{
                  fontSize: '11px',
                  letterSpacing: '0.01em',
                  color: '#999999'
                }}
              >
                {sessions}
              </p>
              <p
                className="font-[DM_Sans_Thin]"
                style={{
                  fontSize: '11px',
                  letterSpacing: '0.01em',
                  color: '#999999'
                }}
              >
                {time}
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex items-center justify-end mt-4">
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
                  color: status === 'complete' ? 'rgba(34, 197, 94, 1)' : '#D4AF37'
                }}
              >
                {getButtonText()}
              </span>
              {status === 'complete' ? (
                <Check 
                  size={16} 
                  className="text-[rgba(34,197,94,1)]"
                />
              ) : (
                <ChevronRight 
                  size={16} 
                  className="text-[#D4AF37] transition-transform group-hover/btn:translate-x-1"
                />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}