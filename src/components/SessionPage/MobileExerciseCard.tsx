import { ChevronRight, Check, Play } from 'lucide-react';

interface MobileExerciseCardProps {
  id: string;
  exerciseNumber: number;
  totalExercises: number;
  exerciseName: string;
  sets: string;
  reps: string;
  image?: string;
  isComplete: boolean;
  onToggleComplete: (id: string) => void;
}

export function MobileExerciseCard({
  exerciseNumber,
  totalExercises,
  exerciseName,
  sets,
  reps,
  image,
  isComplete,
  onToggleComplete,
  id
}: MobileExerciseCardProps) {
  const placeholderImage = "https://images.unsplash.com/photo-1553112761-4f7500432c01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwZXhlcmNpc2UlMjBkZW1vbnN0cmF0aW9ufGVufDF8fHx8MTc2NjgzMzI4N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
  const displayImage = image || placeholderImage;

  return (
    <div 
      className="relative overflow-hidden bg-black rounded-[20px] h-[400px]"
      style={{
        border: isComplete ? '1px solid rgba(34, 197, 94, 1)' : '1px solid #D4AF37',
        boxShadow: isComplete ? '0 4px 20px rgba(34, 197, 94, 0.1)' : '0 4px 20px rgba(212, 175, 55, 0.1)',
        transition: 'all 0.3s ease'
      }}
    >
      {/* Main Content Container */}
      <div className="relative flex flex-col h-[400px]">
        {/* Top Section - Image */}
        <div className="relative overflow-hidden h-[50%]">
          <img 
            src={displayImage} 
            alt={exerciseName}
            className="w-full h-full object-cover"
            style={{ objectPosition: 'center 30%' }}
          />
          
          {/* Video Placeholder Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div 
              className="bg-black/60 backdrop-blur-sm rounded-full p-3 transition-all duration-300"
              style={{
                boxShadow: '0 0 20px rgba(212, 175, 55, 0.3)'
              }}
            >
              <Play 
                size={28} 
                className="text-[#D4AF37]"
                fill="#D4AF37"
              />
            </div>
          </div>
        </div>

        {/* Bottom Section - Text Content */}
        <div className="flex flex-col justify-between p-6 bg-black flex-1">
          <div className="text-left flex-1 overflow-hidden">
            <h3 
              className="mb-3 font-[DM_Sans_Thin]"
              style={{
                fontSize: '11px',
                letterSpacing: '0.01em',
                lineHeight: '1.2',
                color: '#CCCCCC',
                textTransform: 'uppercase'
              }}
            >
              Exercise {exerciseNumber} / {totalExercises}
            </h3>
            <h4
              className="font-[DM_Sans] text-white mb-3"
              style={{
                fontSize: '16px',
                letterSpacing: '0.01em',
                lineHeight: '1.2'
              }}
            >
              {exerciseName}
            </h4>

            {/* Sets and Reps Details */}
            <div className="space-y-1 mt-3">
              <p
                className="font-[DM_Sans_Thin]"
                style={{
                  fontSize: '11px',
                  letterSpacing: '0.01em',
                  color: isComplete ? '#22c55e' : '#D4AF37'
                }}
              >
                {sets}
              </p>
              <p
                className="font-[DM_Sans_Thin]"
                style={{
                  fontSize: '11px',
                  letterSpacing: '0.01em',
                  color: '#999999'
                }}
              >
                {reps}
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
                  onToggleComplete(id);
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
                  onToggleComplete(id);
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
                  MARK COMPLETE
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