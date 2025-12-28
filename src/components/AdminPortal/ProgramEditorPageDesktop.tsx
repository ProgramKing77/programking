import { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus, Upload, X } from 'lucide-react';
import logo from 'figma:asset/e702c84c8fb5f6b4af748ca13cfa0b042a4e70cc.png';

interface Exercise {
  id: string;
  name: string;
  sets?: string;
  reps?: string;
  tempo?: string;
  rest?: string;
  notes?: string;
  videoUrl?: string;
}

interface ProgramEditorPageDesktopProps {
  programId?: string; // undefined for new programs
  initialData?: {
    title: string;
    subtitle: string;
    duration: string;
    sessions: string;
    time: string;
    price: number;
    image: string;
    exercises: Exercise[];
  };
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  onNavigate: (page: 'admin') => void;
  onSave: (programData: any) => void;
}

export function ProgramEditorPageDesktop({
  programId,
  initialData,
  isMenuOpen,
  setIsMenuOpen,
  onNavigate,
  onSave
}: ProgramEditorPageDesktopProps) {
  const [scrollY, setScrollY] = useState(0);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [logoOpacity, setLogoOpacity] = useState(1);
  
  // Form state
  const [title, setTitle] = useState(initialData?.title || '');
  const [subtitle, setSubtitle] = useState(initialData?.subtitle || '');
  const [duration, setDuration] = useState(initialData?.duration || '');
  const [sessions, setSessions] = useState(initialData?.sessions || '');
  const [time, setTime] = useState(initialData?.time || '');
  const [price, setPrice] = useState(initialData?.price?.toString() || '');
  const [imageUrl, setImageUrl] = useState(initialData?.image || '');
  const [exercises, setExercises] = useState<Exercise[]>(initialData?.exercises || []);
  
  // Image upload state
  const [imagePreview, setImagePreview] = useState(initialData?.image || '');

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setLogoOpacity(0);
      } else if (currentScrollY < lastScrollY && currentScrollY < 200) {
        setLogoOpacity(1);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddExercise = () => {
    const newExercise: Exercise = {
      id: `exercise-${Date.now()}`,
      name: '',
      sets: '',
      reps: '',
      tempo: '',
      rest: '',
      notes: '',
      videoUrl: ''
    };
    setExercises([...exercises, newExercise]);
  };

  const handleDeleteExercise = (id: string) => {
    setExercises(exercises.filter(ex => ex.id !== id));
  };

  const handleUpdateExercise = (id: string, field: keyof Exercise, value: string) => {
    setExercises(exercises.map(ex => 
      ex.id === id ? { ...ex, [field]: value } : ex
    ));
  };

  const handleVideoUpload = (exerciseId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleUpdateExercise(exerciseId, 'videoUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const programData = {
      id: programId || `program-${Date.now()}`,
      title,
      subtitle,
      duration,
      sessions,
      time,
      price: parseFloat(price),
      image: imageUrl,
      exercises
    };
    onSave(programData);
  };

  const mode = programId ? 'edit' : 'create';

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-16 py-11 flex items-center justify-between">
        <button 
          onClick={() => {
            onNavigate('admin');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="cursor-pointer"
        >
          <img
            src={logo}
            alt="Program King Logo"
            className="h-3.5 transition-opacity duration-500"
            style={{ opacity: logoOpacity }}
          />
        </button>
        <div className="flex items-center gap-4">
          <button onClick={() => setIsMenuOpen(true)} className="text-[#D4AF37] p-2">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="6" y1="12" x2="26" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="6" y1="20" x2="26" y2="20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden" style={{ marginTop: '-88px' }}>
        <div 
          className="absolute inset-0 bg-black"
          style={{ transform: `translateY(${scrollY * 0.5}px)` }}
        >
          <div className="absolute inset-0 bg-black opacity-20" />
        </div>

        <div 
          className="relative h-full flex flex-col justify-center px-16 max-w-7xl"
          style={{ transform: `translateY(calc(50px + ${scrollY * 0.2}px))` }}
        >
          <div className="max-w-2xl" style={{ marginTop: '47.5px' }}>
            <h1 
              className="mb-6 font-[DM_Sans] font-light text-white"
              style={{
                fontSize: '64px',
                letterSpacing: '-0.01em',
                lineHeight: '1.1',
                textShadow: '0 4px 12px rgba(0, 0, 0, 0.6)'
              }}
            >
              {programId ? 'Edit' : 'Create'}<br />
              Program.
            </h1>
            
            <p 
              className="mb-24 font-[DM_Sans] font-light text-gray-200"
              style={{
                fontSize: '16px',
                letterSpacing: '0.01em',
                lineHeight: '1.6',
                textShadow: '0 1px 4px rgba(0, 0, 0, 0.5)'
              }}
            >
              {mode === 'create' ? 'Create a new training program' : 'Edit program details and content'}
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
      </section>

      {/* Content Section */}
      <section className="relative py-[0px] px-[64px] pb-12" style={{ marginTop: '-100px' }}>
        <div 
          className="absolute top-0 left-0 right-0 pointer-events-none z-10"
          style={{
            height: '300px',
            background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.3) 30%, rgba(0, 0, 0, 0.7) 60%, rgba(0, 0, 0, 1) 100%)'
          }}
        />

        <div className="absolute top-[300px] left-0 right-0 bottom-0 bg-black" />
        
        <h2 
          className="text-left tracking-[0.3em] text-[rgb(204,204,204)] mb-5 font-[DM_Sans] relative z-20"
          style={{
            fontSize: '16.5px',
            letterSpacing: '0.35em'
          }}
        >
          PROGRAM DETAILS
        </h2>

        <div className="relative z-20 max-w-7xl mx-auto space-y-6 pb-8">
          {/* Image Upload Card */}
          <div
            className="relative bg-black overflow-hidden rounded-[20px] p-8"
            style={{
              border: '1px solid #D4AF37',
              boxShadow: '0 4px 20px rgba(212, 175, 55, 0.1)',
            }}
          >
            <h3 className="font-[DM_Sans] text-white mb-4" style={{ fontSize: '18px', letterSpacing: '0.05em' }}>
              Program Image
            </h3>
            
            <div className="flex gap-6 items-center">
              {imagePreview ? (
                <div className="relative w-64 h-36 rounded-lg overflow-hidden">
                  <img src={imagePreview} alt="Program preview" className="w-full h-full object-cover" />
                  <button
                    onClick={() => {
                      setImagePreview('');
                      setImageUrl('');
                    }}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center bg-black/60 backdrop-blur-sm hover:bg-red-600/80 transition-colors"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              ) : (
                <label 
                  className="w-64 h-36 rounded-lg flex flex-col items-center justify-center cursor-pointer"
                  style={{
                    border: '2px dashed rgba(212, 175, 55, 0.5)',
                    background: 'rgba(212, 175, 55, 0.05)'
                  }}
                >
                  <Upload className="w-8 h-8 text-[#D4AF37] mb-2" />
                  <span className="font-[DM_Sans] text-gray-400" style={{ fontSize: '14px' }}>
                    Click to upload
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
              
              <div className="flex-1">
                <p className="font-[DM_Sans] text-gray-400" style={{ fontSize: '13px', lineHeight: '1.5' }}>
                  Upload a high-quality image for your training program. Recommended size: 1920x1080px or 16:9 aspect ratio.
                </p>
              </div>
            </div>
          </div>

          {/* Program Information Form */}
          <div
            className="relative bg-black overflow-hidden rounded-[20px] p-8"
            style={{
              border: '1px solid #D4AF37',
              boxShadow: '0 4px 20px rgba(212, 175, 55, 0.1)',
            }}
          >
            <h3 className="font-[DM_Sans] text-white mb-6" style={{ fontSize: '18px', letterSpacing: '0.05em' }}>
              Program Information
            </h3>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="font-[DM_Sans] text-gray-400 mb-2 block" style={{ fontSize: '13px' }}>
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Strength Foundation"
                  className="w-full bg-black/40 border border-gray-700 rounded-lg px-4 py-3 text-white font-[DM_Sans] focus:border-[#D4AF37] focus:outline-none transition-colors"
                  style={{ fontSize: '14px' }}
                />
              </div>
              
              <div className="col-span-2">
                <label className="font-[DM_Sans] text-gray-400 mb-2 block" style={{ fontSize: '13px' }}>
                  Subtitle / Description
                </label>
                <textarea
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Brief description of the program"
                  rows={3}
                  className="w-full bg-black/40 border border-gray-700 rounded-lg px-4 py-3 text-white font-[DM_Sans] focus:border-[#D4AF37] focus:outline-none transition-colors resize-none"
                  style={{ fontSize: '14px' }}
                />
              </div>
              
              <div>
                <label className="font-[DM_Sans] text-gray-400 mb-2 block" style={{ fontSize: '13px' }}>
                  Duration
                </label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="e.g., 12 weeks"
                  className="w-full bg-black/40 border border-gray-700 rounded-lg px-4 py-3 text-white font-[DM_Sans] focus:border-[#D4AF37] focus:outline-none transition-colors"
                  style={{ fontSize: '14px' }}
                />
              </div>
              
              <div>
                <label className="font-[DM_Sans] text-gray-400 mb-2 block" style={{ fontSize: '13px' }}>
                  Sessions
                </label>
                <input
                  type="text"
                  value={sessions}
                  onChange={(e) => setSessions(e.target.value)}
                  placeholder="e.g., 4 sessions/week"
                  className="w-full bg-black/40 border border-gray-700 rounded-lg px-4 py-3 text-white font-[DM_Sans] focus:border-[#D4AF37] focus:outline-none transition-colors"
                  style={{ fontSize: '14px' }}
                />
              </div>
              
              <div>
                <label className="font-[DM_Sans] text-gray-400 mb-2 block" style={{ fontSize: '13px' }}>
                  Time per Session
                </label>
                <input
                  type="text"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="e.g., 60-90 minutes"
                  className="w-full bg-black/40 border border-gray-700 rounded-lg px-4 py-3 text-white font-[DM_Sans] focus:border-[#D4AF37] focus:outline-none transition-colors"
                  style={{ fontSize: '14px' }}
                />
              </div>
              
              <div>
                <label className="font-[DM_Sans] text-gray-400 mb-2 block" style={{ fontSize: '13px' }}>
                  Price (£)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g., 49.99"
                  className="w-full bg-black/40 border border-gray-700 rounded-lg px-4 py-3 text-white font-[DM_Sans] focus:border-[#D4AF37] focus:outline-none transition-colors"
                  style={{ fontSize: '14px' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Exercises Section */}
        <h2 
          className="text-left tracking-[0.3em] text-[rgb(204,204,204)] mb-5 mt-12 font-[DM_Sans] relative z-20"
          style={{
            fontSize: '16.5px',
            letterSpacing: '0.35em'
          }}
        >
          EXERCISES
        </h2>

        <div className="relative z-20 max-w-7xl mx-auto pb-20">
          <div className="grid grid-cols-2 gap-6">
            {/* Add New Exercise Card */}
            <div
              onClick={handleAddExercise}
              className="relative bg-black overflow-hidden group cursor-pointer rounded-[20px]"
              style={{
                border: '2px dashed rgba(212, 175, 55, 0.5)',
                boxShadow: '0 4px 20px rgba(212, 175, 55, 0.05)',
                transition: 'all 0.3s ease',
                minHeight: '200px'
              }}
            >
              <div className="flex h-full items-center justify-center p-8">
                <div className="flex flex-col items-center gap-4">
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{
                      background: 'rgba(212, 175, 55, 0.1)',
                      border: '2px solid #D4AF37'
                    }}
                  >
                    <Plus className="w-8 h-8 text-[#D4AF37]" />
                  </div>
                  <div className="text-center">
                    <div 
                      className="font-[DM_Sans] mb-1"
                      style={{
                        fontSize: '16px',
                        letterSpacing: '0.1em',
                        fontWeight: 500,
                        color: '#FFFFFF'
                      }}
                    >
                      ADD NEW
                    </div>
                    <div 
                      className="font-[DM_Sans]"
                      style={{
                        fontSize: '12px',
                        letterSpacing: '0.05em',
                        color: '#FFFFFF'
                      }}
                    >
                      Exercise
                    </div>
                  </div>
                </div>
              </div>
              
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: 'radial-gradient(circle at center, rgba(212, 175, 55, 0.1) 0%, transparent 70%)',
                  pointerEvents: 'none'
                }}
              />
            </div>

            {/* Exercise Cards */}
            {exercises.map((exercise) => (
              <div
                key={exercise.id}
                className="relative bg-black overflow-hidden rounded-[20px] p-6"
                style={{
                  border: '1px solid #D4AF37',
                  boxShadow: '0 4px 20px rgba(212, 175, 55, 0.1)',
                  minHeight: '200px'
                }}
              >
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-[DM_Sans] text-white" style={{ fontSize: '16px', letterSpacing: '0.05em' }}>
                    Exercise Details
                  </h4>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDeleteExercise(exercise.id)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
                      style={{
                        background: 'rgba(0, 0, 0, 0.4)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(220, 38, 38, 0.3)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(220, 38, 38, 0.2)';
                        e.currentTarget.style.borderColor = '#DC2626';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(0, 0, 0, 0.4)';
                        e.currentTarget.style.borderColor = 'rgba(220, 38, 38, 0.3)';
                      }}
                    >
                      <Trash2 className="w-4 h-4" style={{ color: '#DC2626' }} />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="font-[DM_Sans] text-gray-400 mb-1 block" style={{ fontSize: '12px' }}>
                      Exercise Name
                    </label>
                    <input
                      type="text"
                      value={exercise.name}
                      onChange={(e) => handleUpdateExercise(exercise.id, 'name', e.target.value)}
                      placeholder="e.g., Barbell Squat"
                      className="w-full bg-black/40 border border-gray-700 rounded-lg px-3 py-2 text-white font-[DM_Sans] focus:border-[#D4AF37] focus:outline-none transition-colors"
                      style={{ fontSize: '13px' }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-[DM_Sans] text-gray-400 mb-1 block" style={{ fontSize: '12px' }}>
                        Sets
                      </label>
                      <input
                        type="text"
                        value={exercise.sets}
                        onChange={(e) => handleUpdateExercise(exercise.id, 'sets', e.target.value)}
                        placeholder="e.g., 3"
                        className="w-full bg-black/40 border border-gray-700 rounded-lg px-3 py-2 text-white font-[DM_Sans] focus:border-[#D4AF37] focus:outline-none transition-colors"
                        style={{ fontSize: '13px' }}
                      />
                    </div>
                    
                    <div>
                      <label className="font-[DM_Sans] text-gray-400 mb-1 block" style={{ fontSize: '12px' }}>
                        Reps
                      </label>
                      <input
                        type="text"
                        value={exercise.reps}
                        onChange={(e) => handleUpdateExercise(exercise.id, 'reps', e.target.value)}
                        placeholder="e.g., 8-10"
                        className="w-full bg-black/40 border border-gray-700 rounded-lg px-3 py-2 text-white font-[DM_Sans] focus:border-[#D4AF37] focus:outline-none transition-colors"
                        style={{ fontSize: '13px' }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-[DM_Sans] text-gray-400 mb-1 block" style={{ fontSize: '12px' }}>
                        Tempo
                      </label>
                      <input
                        type="text"
                        value={exercise.tempo}
                        onChange={(e) => handleUpdateExercise(exercise.id, 'tempo', e.target.value)}
                        placeholder="e.g., 3-1-1-0"
                        className="w-full bg-black/40 border border-gray-700 rounded-lg px-3 py-2 text-white font-[DM_Sans] focus:border-[#D4AF37] focus:outline-none transition-colors"
                        style={{ fontSize: '13px' }}
                      />
                    </div>
                    
                    <div>
                      <label className="font-[DM_Sans] text-gray-400 mb-1 block" style={{ fontSize: '12px' }}>
                        Rest
                      </label>
                      <input
                        type="text"
                        value={exercise.rest}
                        onChange={(e) => handleUpdateExercise(exercise.id, 'rest', e.target.value)}
                        placeholder="e.g., 90s"
                        className="w-full bg-black/40 border border-gray-700 rounded-lg px-3 py-2 text-white font-[DM_Sans] focus:border-[#D4AF37] focus:outline-none transition-colors"
                        style={{ fontSize: '13px' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-[DM_Sans] text-gray-400 mb-1 block" style={{ fontSize: '12px' }}>
                      Notes
                    </label>
                    <textarea
                      value={exercise.notes}
                      onChange={(e) => handleUpdateExercise(exercise.id, 'notes', e.target.value)}
                      placeholder="Additional instructions or notes"
                      rows={2}
                      className="w-full bg-black/40 border border-gray-700 rounded-lg px-3 py-2 text-white font-[DM_Sans] focus:border-[#D4AF37] focus:outline-none transition-colors resize-none"
                      style={{ fontSize: '13px' }}
                    />
                  </div>

                  <div>
                    <label className="font-[DM_Sans] text-gray-400 mb-1 block" style={{ fontSize: '12px' }}>
                      Demonstration Video
                    </label>
                    {exercise.videoUrl ? (
                      <div className="relative w-full rounded-lg overflow-hidden bg-black/40 border border-gray-700">
                        <video 
                          src={exercise.videoUrl} 
                          controls 
                          className="w-full h-32 object-cover"
                        />
                        <button
                          onClick={() => handleUpdateExercise(exercise.id, 'videoUrl', '')}
                          className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center bg-black/60 backdrop-blur-sm hover:bg-red-600/80 transition-colors"
                        >
                          <X className="w-3 h-3 text-white" />
                        </button>
                      </div>
                    ) : (
                      <label 
                        className="w-full h-20 rounded-lg flex flex-col items-center justify-center cursor-pointer"
                        style={{
                          border: '2px dashed rgba(212, 175, 55, 0.3)',
                          background: 'rgba(212, 175, 55, 0.03)'
                        }}
                      >
                        <Upload className="w-5 h-5 text-[#D4AF37] mb-1" />
                        <span className="font-[DM_Sans] text-gray-500" style={{ fontSize: '11px' }}>
                          Upload video
                        </span>
                        <input
                          type="file"
                          accept="video/*"
                          onChange={(e) => handleVideoUpload(exercise.id, e)}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-8">
            <button
              onClick={() => onNavigate('admin')}
              className="px-8 py-3 rounded-lg font-[DM_Sans] transition-all duration-200"
              style={{
                fontSize: '14px',
                letterSpacing: '0.05em',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#FFFFFF',
                background: 'rgba(0, 0, 0, 0.4)'
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-8 py-3 rounded-lg font-[DM_Sans] transition-all duration-200"
              style={{
                fontSize: '14px',
                letterSpacing: '0.05em',
                fontWeight: 500,
                border: '1px solid #D4AF37',
                color: '#000000',
                background: '#D4AF37'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#E5C158';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#D4AF37';
              }}
            >
              Save Program
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}