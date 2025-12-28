import { ChevronRight, Check, Play } from 'lucide-react';

interface DesktopExerciseCardProps {
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

export function DesktopExerciseCard({
  exerciseNumber,
  totalExercises,
  exerciseName,
  sets,
  reps,
  image,
  isComplete,
  onToggleComplete,
  id
}: DesktopExerciseCardProps) {
  const placeholderImage = "https://images.unsplash.com/photo-1553112761-4f7500432c01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwZXhlcmNpc2UlMjBkZW1vbnN0cmF0aW9ufGVufDF8fHx8MTc2NjgzMzI4N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
  const displayImage = image || placeholderImage;

  return (
    <div
      className="relative bg-black overflow-hidden group rounded-[20px]"
      style={{
        border: isComplete ? '1px solid rgba(34, 197, 94, 1)' : '1px solid #D4AF37',
        boxShadow: isComplete ? '0 4px 20px rgba(34, 197, 94, 0.1)' : '0 4px 20px rgba(212, 175, 55, 0.1)',
        transition: 'all 0.3s ease',
        height: '280px'
      }}
    >
      <div className="flex h-full">
        {/* Image Section - 45% width */}
        <div className="w-[45%] relative overflow-hidden">
          <img
            src={displayImage}
            alt={exerciseName}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Video Placeholder Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div 
              className="bg-black/60 backdrop-blur-sm rounded-full p-4 transition-all duration-300 group-hover:scale-110"
              style={{
                boxShadow: '0 0 20px rgba(212, 175, 55, 0.3)'
              }}
            >
              <Play 
                size={32} 
                className="text-[#D4AF37]"
                fill="#D4AF37"
              />
            </div>
          </div>
          
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
              className="font-[DM_Sans_Thin] mb-2"
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
              className="font-[DM_Sans] text-white mb-4"
              style={{
                fontSize: '16px',
                letterSpacing: '0.01em',
                lineHeight: '1.2'
              }}
            >
              {exerciseName}
            </h4>

            {/* Sets and Reps Details */}
            <div className="space-y-1 mb-6">
              <p
                className="font-[DM_Sans]"
                style={{
                  fontSize: '11px',
                  letterSpacing: '0.01em',
                  color: isComplete ? '#22c55e' : '#D4AF37'
                }}
              >
                {sets}
              </p>
              <p
                className="font-[DM_Sans] text-gray-500"
                style={{
                  fontSize: '11px',
                  letterSpacing: '0.01em'
                }}
              >
                {reps}
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
                  onToggleComplete(id);
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
                  onToggleComplete(id);
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