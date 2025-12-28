import { useState, useEffect } from 'react';
import { Trash2, Plus, Upload, X } from 'lucide-react';
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

interface ProgramEditorPageMobileProps {
  programId?: string;
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

export function ProgramEditorPageMobile({
  programId,
  initialData,
  isMenuOpen,
  setIsMenuOpen,
  onNavigate,
  onSave
}: ProgramEditorPageMobileProps) {
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleScrollEffect = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setLogoOpacity(0);
      } else if (currentScrollY < lastScrollY && currentScrollY < 200) {
        setLogoOpacity(1);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScrollEffect, { passive: true });
    return () => window.removeEventListener('scroll', handleScrollEffect);
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
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 py-6 flex items-center justify-between">
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
            className="h-2.5 transition-opacity duration-300"
            style={{ opacity: logoOpacity }}
          />
        </button>
        <div className="flex items-center gap-2">
          <button onClick={() => setIsMenuOpen(true)} className="text-[#D4AF37] p-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="4" y1="9" x2="20" y2="9" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
              <line x1="4" y1="15" x2="20" y2="15" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden" style={{ height: 'calc(65vh + 10px)', marginTop: '-38px' }}>
        <div 
          className="absolute inset-0 bg-black"
          style={{ transform: `translateY(${scrollY * 0.5 + 75}px)` }}
        >
          <div className="absolute inset-0 bg-black opacity-20" />
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black pointer-events-none" />

        <div 
          className="relative h-full flex flex-col justify-end px-5 items-center"
          style={{ 
            transform: `translateY(${scrollY * 0.2 + 65}px)`,
            paddingBottom: '32px',
            paddingTop: '100px'
          }}
        >
          <h1 
            className="mb-3 leading-tight font-[DM_Sans] font-light text-center"
            style={{ 
              fontSize: '35px',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)' 
            }}
          >
            PROGRAM EDITOR
          </h1>
          
          <p 
            className="text-gray-300 font-[DM_Sans] font-light text-center mb-18"
            style={{ 
              fontSize: '15px',
              lineHeight: '1.6',
              textShadow: '0 1px 4px rgba(0, 0, 0, 0.5)' 
            }}
          >
            {mode === 'create' ? 'Create a new training program' : 'Edit program details and content'}
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="relative pb-24 pt-2" style={{ marginTop: 'calc(3.84vh)' }}>
        <div 
          className="absolute top-0 left-0 right-0 pointer-events-none z-10"
          style={{
            height: '200px',
            background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.4) 40%, rgba(0, 0, 0, 1) 100%)',
            transform: 'translateY(-200px)'
          }}
        />
        
        <div className="relative bg-gradient-to-b from-black/0 via-black/50 to-black">
          <h2 className="text-left text-xs tracking-[0.3em] text-[rgb(204,204,204)] mb-4 px-6 text-[10px] font-[DM_Sans]">
            PROGRAM DETAILS
          </h2>

          <div className="px-4 space-y-4">
            {/* Image Upload Card */}
            <div
              className="bg-black overflow-hidden rounded-[16px] p-5"
              style={{
                border: '1px solid #D4AF37',
                boxShadow: '0 4px 20px rgba(212, 175, 55, 0.1)',
              }}
            >
              <h3 className="font-[DM_Sans] text-white mb-3" style={{ fontSize: '14px', letterSpacing: '0.05em' }}>
                Program Image
              </h3>
              
              {imagePreview ? (
                <div className="relative w-full h-40 rounded-lg overflow-hidden mb-3">
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
                  className="w-full h-40 rounded-lg flex flex-col items-center justify-center cursor-pointer mb-3"
                  style={{
                    border: '2px dashed rgba(212, 175, 55, 0.5)',
                    background: 'rgba(212, 175, 55, 0.05)'
                  }}
                >
                  <Upload className="w-8 h-8 text-[#D4AF37] mb-2" />
                  <span className="font-[DM_Sans] text-gray-400" style={{ fontSize: '12px' }}>
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
              
              <p className="font-[DM_Sans] text-gray-400 text-center" style={{ fontSize: '11px', lineHeight: '1.4' }}>
                16:9 aspect ratio recommended
              </p>
            </div>

            {/* Program Information */}
            <div
              className="bg-black overflow-hidden rounded-[16px] p-5"
              style={{
                border: '1px solid #D4AF37',
                boxShadow: '0 4px 20px rgba(212, 175, 55, 0.1)',
              }}
            >
              <h3 className="font-[DM_Sans] text-white mb-4" style={{ fontSize: '14px', letterSpacing: '0.05em' }}>
                Information
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="font-[DM_Sans] text-gray-400 mb-1 block" style={{ fontSize: '11px' }}>
                    Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Strength Foundation"
                    className="w-full bg-black/40 border border-gray-700 rounded-lg px-3 py-2 text-white font-[DM_Sans] focus:border-[#D4AF37] focus:outline-none transition-colors"
                    style={{ fontSize: '13px' }}
                  />
                </div>
                
                <div>
                  <label className="font-[DM_Sans] text-gray-400 mb-1 block" style={{ fontSize: '11px' }}>
                    Subtitle
                  </label>
                  <textarea
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="Brief description"
                    rows={3}
                    className="w-full bg-black/40 border border-gray-700 rounded-lg px-3 py-2 text-white font-[DM_Sans] focus:border-[#D4AF37] focus:outline-none transition-colors resize-none"
                    style={{ fontSize: '13px' }}
                  />
                </div>
                
                <div>
                  <label className="font-[DM_Sans] text-gray-400 mb-1 block" style={{ fontSize: '11px' }}>
                    Duration
                  </label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g., 12 weeks"
                    className="w-full bg-black/40 border border-gray-700 rounded-lg px-3 py-2 text-white font-[DM_Sans] focus:border-[#D4AF37] focus:outline-none transition-colors"
                    style={{ fontSize: '13px' }}
                  />
                </div>
                
                <div>
                  <label className="font-[DM_Sans] text-gray-400 mb-1 block" style={{ fontSize: '11px' }}>
                    Sessions
                  </label>
                  <input
                    type="text"
                    value={sessions}
                    onChange={(e) => setSessions(e.target.value)}
                    placeholder="e.g., 4 sessions/week"
                    className="w-full bg-black/40 border border-gray-700 rounded-lg px-3 py-2 text-white font-[DM_Sans] focus:border-[#D4AF37] focus:outline-none transition-colors"
                    style={{ fontSize: '13px' }}
                  />
                </div>
                
                <div>
                  <label className="font-[DM_Sans] text-gray-400 mb-1 block" style={{ fontSize: '11px' }}>
                    Time per Session
                  </label>
                  <input
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="e.g., 60-90 minutes"
                    className="w-full bg-black/40 border border-gray-700 rounded-lg px-3 py-2 text-white font-[DM_Sans] focus:border-[#D4AF37] focus:outline-none transition-colors"
                    style={{ fontSize: '13px' }}
                  />
                </div>
                
                <div>
                  <label className="font-[DM_Sans] text-gray-400 mb-1 block" style={{ fontSize: '11px' }}>
                    Price (£)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g., 49.99"
                    className="w-full bg-black/40 border border-gray-700 rounded-lg px-3 py-2 text-white font-[DM_Sans] focus:border-[#D4AF37] focus:outline-none transition-colors"
                    style={{ fontSize: '13px' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Exercises Section */}
          <h2 className="text-left text-xs tracking-[0.3em] text-[rgb(204,204,204)] mb-4 px-6 mt-8 text-[10px] font-[DM_Sans]">
            EXERCISES
          </h2>

          <div className="px-4 space-y-4">
            {/* Add New Exercise Card */}
            <div
              onClick={handleAddExercise}
              className="bg-black overflow-hidden cursor-pointer rounded-[16px]"
              style={{
                border: '2px dashed rgba(212, 175, 55, 0.5)',
                boxShadow: '0 4px 20px rgba(212, 175, 55, 0.05)',
                minHeight: '120px'
              }}
            >
              <div className="flex h-full items-center justify-center p-6">
                <div className="flex flex-col items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{
                      background: 'rgba(212, 175, 55, 0.1)',
                      border: '2px solid #D4AF37'
                    }}
                  >
                    <Plus className="w-6 h-6 text-[#D4AF37]" />
                  </div>
                  <div className="text-center">
                    <div 
                      className="font-[DM_Sans]"
                      style={{
                        fontSize: '13px',
                        letterSpacing: '0.1em',
                        fontWeight: 500,
                        color: '#FFFFFF'
                      }}
                    >
                      ADD EXERCISE
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Exercise Cards */}
            {exercises.map((exercise) => (
              <div
                key={exercise.id}
                className="bg-black overflow-hidden rounded-[16px] p-5"
                style={{
                  border: '1px solid #D4AF37',
                  boxShadow: '0 4px 20px rgba(212, 175, 55, 0.1)',
                }}
              >
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-[DM_Sans] text-white" style={{ fontSize: '14px', letterSpacing: '0.05em' }}>
                    Exercise
                  </h4>
                  <button
                    onClick={() => handleDeleteExercise(exercise.id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{
                      background: 'rgba(0, 0, 0, 0.4)',
                      border: '1px solid rgba(220, 38, 38, 0.3)',
                    }}
                  >
                    <Trash2 className="w-4 h-4" style={{ color: '#DC2626' }} />
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="font-[DM_Sans] text-gray-400 mb-1 block" style={{ fontSize: '11px' }}>
                      Name
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
                      <label className="font-[DM_Sans] text-gray-400 mb-1 block" style={{ fontSize: '11px' }}>
                        Sets
                      </label>
                      <input
                        type="text"
                        value={exercise.sets}
                        onChange={(e) => handleUpdateExercise(exercise.id, 'sets', e.target.value)}
                        placeholder="3"
                        className="w-full bg-black/40 border border-gray-700 rounded-lg px-3 py-2 text-white font-[DM_Sans] focus:border-[#D4AF37] focus:outline-none transition-colors"
                        style={{ fontSize: '13px' }}
                      />
                    </div>
                    
                    <div>
                      <label className="font-[DM_Sans] text-gray-400 mb-1 block" style={{ fontSize: '11px' }}>
                        Reps
                      </label>
                      <input
                        type="text"
                        value={exercise.reps}
                        onChange={(e) => handleUpdateExercise(exercise.id, 'reps', e.target.value)}
                        placeholder="8-10"
                        className="w-full bg-black/40 border border-gray-700 rounded-lg px-3 py-2 text-white font-[DM_Sans] focus:border-[#D4AF37] focus:outline-none transition-colors"
                        style={{ fontSize: '13px' }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-[DM_Sans] text-gray-400 mb-1 block" style={{ fontSize: '11px' }}>
                        Tempo
                      </label>
                      <input
                        type="text"
                        value={exercise.tempo}
                        onChange={(e) => handleUpdateExercise(exercise.id, 'tempo', e.target.value)}
                        placeholder="3-1-1-0"
                        className="w-full bg-black/40 border border-gray-700 rounded-lg px-3 py-2 text-white font-[DM_Sans] focus:border-[#D4AF37] focus:outline-none transition-colors"
                        style={{ fontSize: '13px' }}
                      />
                    </div>
                    
                    <div>
                      <label className="font-[DM_Sans] text-gray-400 mb-1 block" style={{ fontSize: '11px' }}>
                        Rest
                      </label>
                      <input
                        type="text"
                        value={exercise.rest}
                        onChange={(e) => handleUpdateExercise(exercise.id, 'rest', e.target.value)}
                        placeholder="90s"
                        className="w-full bg-black/40 border border-gray-700 rounded-lg px-3 py-2 text-white font-[DM_Sans] focus:border-[#D4AF37] focus:outline-none transition-colors"
                        style={{ fontSize: '13px' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-[DM_Sans] text-gray-400 mb-1 block" style={{ fontSize: '11px' }}>
                      Notes
                    </label>
                    <textarea
                      value={exercise.notes}
                      onChange={(e) => handleUpdateExercise(exercise.id, 'notes', e.target.value)}
                      placeholder="Additional instructions"
                      rows={2}
                      className="w-full bg-black/40 border border-gray-700 rounded-lg px-3 py-2 text-white font-[DM_Sans] focus:border-[#D4AF37] focus:outline-none transition-colors resize-none"
                      style={{ fontSize: '13px' }}
                    />
                  </div>

                  <div>
                    <label className="font-[DM_Sans] text-gray-400 mb-1 block" style={{ fontSize: '11px' }}>
                      Demonstration Video
                    </label>
                    {exercise.videoUrl ? (
                      <div className="relative w-full rounded-lg overflow-hidden bg-black/40 border border-gray-700">
                        <video 
                          src={exercise.videoUrl} 
                          controls 
                          className="w-full h-40 object-cover"
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
                        className="w-full h-32 rounded-lg flex flex-col items-center justify-center cursor-pointer"
                        style={{
                          border: '2px dashed rgba(212, 175, 55, 0.3)',
                          background: 'rgba(212, 175, 55, 0.03)'
                        }}
                      >
                        <Upload className="w-6 h-6 text-[#D4AF37] mb-1" />
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
          <div className="px-4 mt-8 flex flex-col gap-3 pb-8">
            <button
              onClick={handleSave}
              className="w-full py-3 rounded-lg font-[DM_Sans] transition-all duration-200"
              style={{
                fontSize: '14px',
                letterSpacing: '0.05em',
                fontWeight: 500,
                border: '1px solid #D4AF37',
                color: '#000000',
                background: '#D4AF37'
              }}
            >
              Save Program
            </button>
            <button
              onClick={() => onNavigate('admin')}
              className="w-full py-3 rounded-lg font-[DM_Sans] transition-all duration-200"
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
          </div>
        </div>
      </section>
    </div>
  );
}