import { Check } from 'lucide-react';

interface WorkoutCompletionModalProps {
  programTitle: string;
  sessionTitle: string;
  onReturnToDashboard: () => void;
  isDesktop?: boolean;
}

export function WorkoutCompletionModal({
  programTitle,
  sessionTitle,
  onReturnToDashboard,
  isDesktop = true
}: WorkoutCompletionModalProps) {
  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.95)' }}
    >
      <div 
        className={`relative ${isDesktop ? 'max-w-2xl px-16' : 'max-w-md px-8'} w-full`}
      >
        {/* Success Icon */}
        <div className="flex justify-center mb-8">
          <div 
            className={`${isDesktop ? 'w-24 h-24' : 'w-20 h-20'} rounded-full flex items-center justify-center`}
            style={{
              background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(212, 175, 55, 0.05) 100%)',
              border: '2px solid #D4AF37'
            }}
          >
            <Check 
              size={isDesktop ? 48 : 40} 
              style={{ color: '#D4AF37', strokeWidth: 3 }}
            />
          </div>
        </div>

        {/* Congratulations Text */}
        <h1 
          className="text-center font-[DM_Sans] mb-4"
          style={{
            fontSize: isDesktop ? '32px' : '24px',
            letterSpacing: '0.02em',
            fontWeight: 700,
            color: '#FFFFFF',
            lineHeight: 1.2
          }}
        >
          CONGRATULATIONS!
        </h1>

        {/* Completion Message */}
        <p 
          className="text-center font-[DM_Sans] mb-3"
          style={{
            fontSize: isDesktop ? '16px' : '14px',
            letterSpacing: '0.01em',
            fontWeight: 400,
            color: '#CCCCCC',
            lineHeight: 1.6
          }}
        >
          You've successfully completed
        </p>

        {/* Program & Session Info */}
        <div className="text-center mb-8">
          <p 
            className="font-[DM_Sans] mb-1"
            style={{
              fontSize: isDesktop ? '18px' : '16px',
              letterSpacing: '0.05em',
              fontWeight: 600,
              color: '#D4AF37'
            }}
          >
            {programTitle}
          </p>
          <p 
            className="font-[DM_Sans]"
            style={{
              fontSize: isDesktop ? '14px' : '12px',
              letterSpacing: '0.1em',
              fontWeight: 500,
              color: '#AAAAAA'
            }}
          >
            {sessionTitle}
          </p>
        </div>

        {/* Progress Update Message */}
        <div 
          className={`${isDesktop ? 'py-4 px-6' : 'py-3 px-4'} rounded-lg mb-8`}
          style={{
            background: 'rgba(212, 175, 55, 0.08)',
            border: '1px solid rgba(212, 175, 55, 0.2)'
          }}
        >
          <p 
            className="text-center font-[DM_Sans]"
            style={{
              fontSize: isDesktop ? '13px' : '11px',
              letterSpacing: '0.05em',
              fontWeight: 400,
              color: '#D4AF37',
              lineHeight: 1.5
            }}
          >
            Your progress has been updated
          </p>
        </div>

        {/* Return Button */}
        <button
          onClick={onReturnToDashboard}
          className={`w-full ${isDesktop ? 'py-4' : 'py-3'} rounded-lg font-[DM_Sans] transition-all duration-200 hover:opacity-90`}
          style={{
            fontSize: isDesktop ? '14px' : '12px',
            letterSpacing: '0.1em',
            fontWeight: 600,
            border: '2px solid #D4AF37',
            color: '#000000',
            background: '#D4AF37'
          }}
        >
          RETURN TO DASHBOARD
        </button>
      </div>
    </div>
  );
}
