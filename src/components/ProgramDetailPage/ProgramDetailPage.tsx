import { useState, useEffect } from 'react';
import { ProgramDetailPageMobile } from './ProgramDetailPageMobile';
import { ProgramDetailPageDesktop } from './ProgramDetailPageDesktop';
import loadExplodeImage from 'figma:asset/480ec9e6e2172f7ebeb1956caa797be738b9fd72.png';
import defaultHeroImage from 'figma:asset/e7463f53907ff11b31d5f786913d5c0104281a57.png';

interface Session {
  id: string;
  week: number;
  session: string;
  tempo: string;
  tempoDetail: string;
  exerciseCount: number;
  exerciseDetails: string;
  isComplete: boolean;
  image?: string;
}

interface ProgramDetailPageProps {
  programId: string;
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  onNavigate: (page: 'home' | 'programs' | 'account' | 'trainingPrograms', programId?: string) => void;
  onSessionAction: (sessionId: string) => void;
}

// Mock program data - this would come from a backend/database
const PROGRAM_DATA: Record<string, {
  title: string;
  subtitle: string;
  progressPercentage: number;
  sessions: Session[];
}> = {
  'load-explode': {
    title: 'Load-Explode',
    subtitle: 'Enhance Power. Get Strong.',
    progressPercentage: 32,
    sessions: [
      {
        id: 'w1-sa',
        week: 1,
        session: 'A',
        tempo: 'Slow Tempo.',
        tempoDetail: 'Full Range. Ominous.',
        exerciseCount: 5,
        exerciseDetails: 'dumbbells, barbell, weight plates, bench',
        isComplete: true
      },
      {
        id: 'w1-sb',
        week: 1,
        session: 'B',
        tempo: 'Slow Tempo.',
        tempoDetail: 'For Range. Strength.',
        exerciseCount: 6,
        exerciseDetails: 'dumbbells, barbell, weight plates, bench',
        isComplete: false
      },
      {
        id: 'w1-sc',
        week: 1,
        session: 'C',
        tempo: 'Slow Tempo.',
        tempoDetail: 'Full Range. Strength.',
        exerciseCount: 5,
        exerciseDetails: 'dumbbells, barbell, weight plates, bench',
        isComplete: false
      },
      {
        id: 'w2-sa',
        week: 2,
        session: 'A',
        tempo: 'Slow Tempo.',
        tempoDetail: 'For Range. Strength.',
        exerciseCount: 6,
        exerciseDetails: 'dumbbells, barbell, weight plates, bench',
        isComplete: false
      }
    ]
  },
  'isolate-integrate': {
    title: 'Isolate–Integrate',
    subtitle: 'Build Muscle. Improve Strength.',
    progressPercentage: 0,
    sessions: [
      {
        id: 'w1-sa',
        week: 1,
        session: 'A',
        tempo: 'Controlled Tempo.',
        tempoDetail: 'Full Range. Focused.',
        exerciseCount: 6,
        exerciseDetails: 'dumbbells, cables, machines, bench',
        isComplete: false
      },
      {
        id: 'w1-sb',
        week: 1,
        session: 'B',
        tempo: 'Controlled Tempo.',
        tempoDetail: 'Full Range. Focused.',
        exerciseCount: 6,
        exerciseDetails: 'dumbbells, cables, machines, bench',
        isComplete: false
      },
      {
        id: 'w1-sc',
        week: 1,
        session: 'C',
        tempo: 'Controlled Tempo.',
        tempoDetail: 'Full Range. Focused.',
        exerciseCount: 5,
        exerciseDetails: 'dumbbells, cables, machines, bench',
        isComplete: false
      },
      {
        id: 'w2-sa',
        week: 2,
        session: 'A',
        tempo: 'Controlled Tempo.',
        tempoDetail: 'Full Range. Focused.',
        exerciseCount: 6,
        exerciseDetails: 'dumbbells, cables, machines, bench',
        isComplete: false
      }
    ]
  },
  'accel-decel': {
    title: 'Accel–Decel',
    subtitle: 'Sprint. Change Direction.',
    progressPercentage: 0,
    sessions: [
      {
        id: 'w1-sa',
        week: 1,
        session: 'A',
        tempo: 'Fast Tempo.',
        tempoDetail: 'Explosive. Dynamic.',
        exerciseCount: 8,
        exerciseDetails: 'track work, plyometrics, sprint drills',
        isComplete: false
      },
      {
        id: 'w1-sb',
        week: 1,
        session: 'B',
        tempo: 'Fast Tempo.',
        tempoDetail: 'Explosive. Dynamic.',
        exerciseCount: 8,
        exerciseDetails: 'track work, plyometrics, sprint drills',
        isComplete: false
      },
      {
        id: 'w1-sc',
        week: 1,
        session: 'C',
        tempo: 'Fast Tempo.',
        tempoDetail: 'Explosive. Dynamic.',
        exerciseCount: 7,
        exerciseDetails: 'track work, plyometrics, sprint drills',
        isComplete: false
      },
      {
        id: 'w2-sa',
        week: 2,
        session: 'A',
        tempo: 'Fast Tempo.',
        tempoDetail: 'Explosive. Dynamic.',
        exerciseCount: 8,
        exerciseDetails: 'track work, plyometrics, sprint drills',
        isComplete: false
      }
    ]
  },
  'anaerobic-capacity': {
    title: 'Anaerobic Capacity',
    subtitle: 'Build Muscle Endurance.',
    progressPercentage: 0,
    sessions: [
      {
        id: 'w1-sa',
        week: 1,
        session: 'A',
        tempo: 'Medium Tempo.',
        tempoDetail: 'High Volume. Sustained.',
        exerciseCount: 7,
        exerciseDetails: 'dumbbells, barbell, bodyweight, machines',
        isComplete: false
      },
      {
        id: 'w1-sb',
        week: 1,
        session: 'B',
        tempo: 'Medium Tempo.',
        tempoDetail: 'High Volume. Sustained.',
        exerciseCount: 7,
        exerciseDetails: 'dumbbells, barbell, bodyweight, machines',
        isComplete: false
      },
      {
        id: 'w1-sc',
        week: 1,
        session: 'C',
        tempo: 'Medium Tempo.',
        tempoDetail: 'High Volume. Sustained.',
        exerciseCount: 6,
        exerciseDetails: 'dumbbells, barbell, bodyweight, machines',
        isComplete: false
      },
      {
        id: 'w2-sa',
        week: 2,
        session: 'A',
        tempo: 'Medium Tempo.',
        tempoDetail: 'High Volume. Sustained.',
        exerciseCount: 7,
        exerciseDetails: 'dumbbells, barbell, bodyweight, machines',
        isComplete: false
      }
    ]
  }
};

export function ProgramDetailPage({
  programId,
  isMenuOpen,
  setIsMenuOpen,
  onNavigate,
  onSessionAction
}: ProgramDetailPageProps) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const programData = PROGRAM_DATA[programId] || PROGRAM_DATA['load-explode'];

  // Determine hero image based on program ID
  const heroImage = programId === 'load-explode' || programId === 'microdose-load-explode' 
    ? loadExplodeImage 
    : defaultHeroImage;

  return isMobile ? (
    <ProgramDetailPageMobile
      programId={programId}
      programTitle={programData.title}
      programSubtitle={programData.subtitle}
      progressPercentage={programData.progressPercentage}
      sessions={programData.sessions}
      heroImage={heroImage}
      isMenuOpen={isMenuOpen}
      setIsMenuOpen={setIsMenuOpen}
      onNavigate={onNavigate}
      onSessionAction={onSessionAction}
    />
  ) : (
    <ProgramDetailPageDesktop
      programId={programId}
      programTitle={programData.title}
      programSubtitle={programData.subtitle}
      progressPercentage={programData.progressPercentage}
      sessions={programData.sessions}
      heroImage={heroImage}
      isMenuOpen={isMenuOpen}
      setIsMenuOpen={setIsMenuOpen}
      onNavigate={onNavigate}
      onSessionAction={onSessionAction}
    />
  );
}