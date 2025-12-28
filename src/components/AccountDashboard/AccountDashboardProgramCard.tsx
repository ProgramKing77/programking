import { ChevronRight, Check } from 'lucide-react';

interface AccountDashboardProgramCardProps {
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

export function AccountDashboardProgramCard({
  title,
  subtitle,
  image,
  duration,
  sessions,
  time,
  progress,
  status,
  onAction
}: AccountDashboardProgramCardProps) {
  const getButtonText = () => {
    if (status === 'complete') return 'COMPLETE';
    if (status === 'in-progress') return 'OPEN';
    return 'START';
  };

  return (
    <div
      className="relative bg-black overflow-hidden group cursor-pointer rounded-[20px]"
      style={{
        border: status === 'complete' ? '1px solid rgba(34, 197, 94, 1)' : '1px solid #D4AF37',
        boxShadow: status === 'complete' ? '0 4px 20px rgba(34, 197, 94, 0.1)' : '0 4px 20px rgba(212, 175, 55, 0.1)',
        transition: 'all 0.3s ease',
        aspectRatio: '16 / 9',
        minHeight: '280px'
      }}
      onClick={onAction}
    >
      {/* Progress Badge */}
      <div 
        className="absolute top-4 left-4 z-20 px-3 py-1.5 rounded-full text-[10px] font-[DM_Sans] tracking-wider"
        style={{
          background: status === 'complete' ? 'rgba(74, 222, 128, 0.15)' : 'rgba(212, 175, 55, 0.15)',
          border: `1px solid ${status === 'complete' ? 'rgba(74, 222, 128, 0.3)' : 'rgba(212, 175, 55, 0.3)'}`,
          color: status === 'complete' ? '#4ADE80' : '#D4AF37',
          backdropFilter: 'blur(10px)'
        }}
      >
        {progress}%
      </div>

      <div className="flex h-full">
        {/* Image Section */}
        <div className="w-[45%] relative overflow-hidden">
          <img
            src={image}
            alt={title}
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
            <h3
              className="font-[DM_Sans] text-white mb-2"
              style={{
                fontSize: '20px',
                letterSpacing: '0.02em',
                lineHeight: '1.2'
              }}
            >
              {title}
            </h3>
            <p
              className="font-[DM_Sans] text-gray-400 mb-4"
              style={{
                fontSize: '13px',
                letterSpacing: '0.01em',
                lineHeight: '1.4'
              }}
            >
              {subtitle.replace(/\\n/g, '\n')}
            </p>

            {/* Program Details */}
            <div className="space-y-1 mb-6">
              <p
                className="font-[DM_Sans] text-gray-500"
                style={{
                  fontSize: '11px',
                  letterSpacing: '0.01em'
                }}
              >
                {duration}
              </p>
              <p
                className="font-[DM_Sans] text-gray-500"
                style={{
                  fontSize: '11px',
                  letterSpacing: '0.01em'
                }}
              >
                {sessions}
              </p>
              <p
                className="font-[DM_Sans] text-gray-500"
                style={{
                  fontSize: '11px',
                  letterSpacing: '0.01em'
                }}
              >
                {time}
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex items-center justify-end">
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