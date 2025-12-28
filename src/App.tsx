import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { ProgramDashboard } from './components/ProgramDashboard';
import { ProgramsPage } from './components/ProgramsPage';
import { LoginPrompt } from './components/LoginPrompt';
import { PaymentModal } from './components/PaymentModal';
import { ProgramDetailPageDesktop } from './components/ProgramDetailPage/ProgramDetailPageDesktop';
import { ProgramDetailPageMobile } from './components/ProgramDetailPage/ProgramDetailPageMobile';
import { TrainingProgramsPageDesktop } from './components/TrainingProgramsPage/TrainingProgramsPageDesktop';
import { TrainingProgramsPageMobile } from './components/TrainingProgramsPage/TrainingProgramsPageMobile';
import { CheckoutPageDesktop } from './components/CheckoutPage/CheckoutPageDesktop';
import { CheckoutPageMobile } from './components/CheckoutPage/CheckoutPageMobile';
import { CheckoutAuthModal } from './components/CheckoutAuthModal';
import { CheckoutPaymentModal } from './components/CheckoutPaymentModal';
import { OrderConfirmationDesktop } from './components/OrderConfirmation/OrderConfirmationDesktop';
import { OrderConfirmationMobile } from './components/OrderConfirmation/OrderConfirmationMobile';
import { HomePageDesktop } from './components/HomePage/HomePageDesktop';
import { HomePageMobile } from './components/HomePage/HomePageMobile';
import { NavigationMenu } from './components/NavigationMenu';
import { AccountDashboardPageDesktop } from './components/AccountDashboard/AccountDashboardPageDesktop';
import { AccountDashboardPageMobile } from './components/AccountDashboard/AccountDashboardPageMobile';
import { SessionPageDesktop } from './components/SessionPage/SessionPageDesktop';
import { SessionPageMobile } from './components/SessionPage/SessionPageMobile';
import { AdminPortalPageDesktop } from './components/AdminPortal/AdminPortalPageDesktop';
import { AdminPortalPageMobile } from './components/AdminPortal/AdminPortalPageMobile';
import { ProgramEditorPageDesktop } from './components/AdminPortal/ProgramEditorPageDesktop';
import { ProgramEditorPageMobile } from './components/AdminPortal/ProgramEditorPageMobile';
import { EnquiryForm } from './components/EnquiryForm';
import { ErrorBoundary } from './components/ErrorBoundary';
import { projectId, publicAnonKey } from './utils/supabase/info';
import { Toaster, toast } from 'sonner@2.0.3';
import logo from 'figma:asset/e702c84c8fb5f6b4af748ca13cfa0b042a4e70cc.png';
import desktopHeroImage from 'figma:asset/12e991f3c574a84c621d028f55eb2a0b75c41b2e.png';
import trainingProgramsImage from 'figma:asset/bddc5e45c1273060035be78454c9ea7edd214233.png';
import privateCoachingImage from 'figma:asset/c68dc1b4a9357d4a5ed452b14a9eb48a6f79df8f.png';
import athleticProfilingImage from 'figma:asset/f1d76a1352a8a603d3bb47a23f13e1bccd550573.png';
import eventsWorkshopsImage from 'figma:asset/3dd5e802a8dd5b290ddd0d2f345e542398388f65.png';

// Custom hook for media queries
function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);
    
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}

// Program catalog with pricing
const PROGRAM_CATALOG: Record<string, { title: string; subtitle: string; price: number }> = {
  'microdose-load-explode': { title: 'Load–Explode', subtitle: 'Eccentric Loading +\\nExplosive Concentric', price: 29.99 },
  'microdose-accel-decel': { title: 'ACCEL-DECEL', subtitle: 'Speed Development +\\nBraking Mechanics', price: 29.99 },
  'microdose-drop-hop-pop': { title: 'DROP-HOP-POP', subtitle: 'Plyometric Power +\\nReactive Strength', price: 29.99 },
  'microdose-push-pull-rotate': { title: 'PUSH-PULL-ROTATE', subtitle: 'Multi-Planar Strength +\\nCore Integration', price: 29.99 },
  'microdose-pillar-power': { title: 'PILLAR-POWER', subtitle: 'Core Stability +\\nPower Transfer', price: 29.99 },
  'microdose-isolate-integrate': { title: 'ISOLATE-INTEGRATE', subtitle: 'Targeted Work +\\nMovement Integration', price: 29.99 },
  'microdose-active-recovery': { title: 'ACTIVE RECOVERY', subtitle: 'Mobility + Tissue\\nRegeneration', price: 29.99 },
  'fullprogram-strength': { title: 'STRENGTH', subtitle: 'Maximal Force +\\nStructural Development', price: 79.99 },
  'fullprogram-power': { title: 'POWER', subtitle: 'Explosive Strength +\\nRate of Force Development', price: 79.99 },
  'fullprogram-speed': { title: 'SPEED', subtitle: 'Linear Velocity +\\nAcceleration Mechanics', price: 79.99 },
  'fullprogram-agility': { title: 'AGILITY', subtitle: 'Multi-Directional Speed +\\nChange of Direction', price: 79.99 },
  'fullprogram-hypertrophy': { title: 'HYPERTROPHY', subtitle: 'Muscle Building +\\nStructural Balance', price: 79.99 },
};

// Helper functions to safely get program data
function getProgramInfo(programId: string): { title: string; subtitle: string; price: number } {
  // First check if it exists in the hardcoded catalog
  if (PROGRAM_CATALOG[programId]) {
    return PROGRAM_CATALOG[programId];
  }
  
  // If not in catalog, it's a database-created program
  // Return safe defaults - the actual data will be loaded from backend elsewhere
  return {
    title: 'Custom Program',
    subtitle: 'Training Program',
    price: 0
  };
}

function processSubtitle(subtitle: string | undefined): string {
  if (!subtitle) return '';
  return subtitle.replace(/\\\\n/g, '\n');
}

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'programs' | 'account' | 'trainingPrograms' | 'checkout' | 'admin'>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  
  // Initialize state from localStorage
  const [isSignedIn, setIsSignedIn] = useState(() => {
    try {
      const saved = localStorage.getItem('isSignedIn');
      return saved ? JSON.parse(saved) : false;
    } catch (error) {
      console.error('Error parsing isSignedIn from localStorage:', error);
      return false;
    }
  });
  const [isAdmin, setIsAdmin] = useState(() => {
    try {
      const saved = localStorage.getItem('isAdmin');
      return saved ? JSON.parse(saved) : false;
    } catch (error) {
      console.error('Error parsing isAdmin from localStorage:', error);
      return false;
    }
  });
  const [ownedPrograms, setOwnedPrograms] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ownedPrograms');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error parsing ownedPrograms from localStorage:', error);
      return [];
    }
  });
  const [cartItems, setCartItems] = useState<string[]>([]); // Shopping cart - stores program IDs
  const [showCheckoutAuth, setShowCheckoutAuth] = useState(false); // Show auth modal for checkout
  const [showCheckoutPayment, setShowCheckoutPayment] = useState(false); // Show payment modal for checkout
  const [userInfo, setUserInfo] = useState<{ firstName: string; lastName: string; email: string } | null>(() => {
    try {
      const saved = localStorage.getItem('userInfo');
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error('Error parsing userInfo from localStorage:', error);
      return null;
    }
  });
  const [userImage, setUserImage] = useState<string | null>(() => {
    try {
      const saved = localStorage.getItem('userImage');
      return saved || null;
    } catch (error) {
      console.error('Error parsing userImage from localStorage:', error);
      return null;
    }
  });
  const [purchaseHistory, setPurchaseHistory] = useState<Array<{ programTitle: string; date: string; price: number }>>(() => {
    try {
      const saved = localStorage.getItem('purchaseHistory');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error parsing purchaseHistory from localStorage:', error);
      return [];
    }
  });
  const [orderConfirmation, setOrderConfirmation] = useState<{ orderNumber: string; items: any[] } | null>(null); // Order confirmation data
  const [pendingPurchase, setPendingPurchase] = useState<string | null>(null); // ID of program being purchased
  const [showLoginPrompt, setShowLoginPrompt] = useState(false); // Show login prompt before purchase
  const [showLogo, setShowLogo] = useState(true); // Track logo visibility based on scroll direction
  const [prevScrollY, setPrevScrollY] = useState(0); // Track previous scroll position
  const [activeProgramId, setActiveProgramId] = useState<string | null>(null); // Currently opened program
  const [viewingProgramDetail, setViewingProgramDetail] = useState<string | null>(null); // Program detail view from TrainingPrograms page
  const [viewingSession, setViewingSession] = useState<{ programId: string; sessionId: string } | null>(null); // Session view
  const [editingProgram, setEditingProgram] = useState<string | null>(null); // Program being edited/created in admin portal
  const [showEnquiryForm, setShowEnquiryForm] = useState<string | null>(null); // Service title for enquiry form
  const [previousPage, setPreviousPage] = useState<'trainingPrograms' | 'account'>('trainingPrograms'); // Track previous page for back navigation
  const [showAccountLogin, setShowAccountLogin] = useState(false); // Show login modal when accessing account page
  
  // Rewards state
  const [rewardsData, setRewardsData] = useState<{
    completedPrograms: number;
    rewards: Record<string, { claimed: boolean; code?: string; used: boolean }>;
  }>({ completedPrograms: 0, rewards: {} });
  const [isLoadingRewards, setIsLoadingRewards] = useState(false);
  
  // Session exercises state (for database-loaded exercises)
  const [sessionExercises, setSessionExercises] = useState<any[]>([]);
  const [isLoadingExercises, setIsLoadingExercises] = useState(false);
  
  // Database programs state (programs loaded from database with uploaded images)
  const [databasePrograms, setDatabasePrograms] = useState<Record<string, any>>({});
  const [isLoadingPrograms, setIsLoadingPrograms] = useState(true);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const isLoadingProfileRef = useRef(false);
  const hasLoadedAccountDataRef = useRef(false);
  
  // Use media query at the top level (must not be conditional)
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  // Generate a consistent user ID (in production, this would come from authentication)
  // Memoize to prevent unnecessary recalculations
  const userId = useMemo(() => {
    return userInfo?.email ? btoa(userInfo.email).substring(0, 8) : 'demo-user';
  }, [userInfo?.email]);

  // Helper functions to manage user profiles in localStorage
  const saveUserProfile = useCallback((email: string, profileData: {
    firstName: string;
    lastName: string;
    email: string;
    image?: string | null;
    ownedPrograms?: string[];
    purchaseHistory?: Array<{ programTitle: string; date: string; price: number }>;
  }) => {
    try {
      const profiles = JSON.parse(localStorage.getItem('userProfiles') || '{}');
      profiles[email] = profileData;
      localStorage.setItem('userProfiles', JSON.stringify(profiles));
    } catch (error) {
      console.error('Error saving user profile to localStorage:', error);
    }
  }, []);

  const loadUserProfile = useCallback((email: string) => {
    try {
      const profiles = JSON.parse(localStorage.getItem('userProfiles') || '{}');
      return profiles[email] || null;
    } catch (error) {
      console.error('Error loading user profile from localStorage:', error);
      return null;
    }
  }, []);

  // Save user profile whenever userInfo, userImage, ownedPrograms, or purchaseHistory changes
  useEffect(() => {
    if (userInfo?.email) {
      saveUserProfile(userInfo.email, {
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        email: userInfo.email,
        image: userImage,
        ownedPrograms: ownedPrograms,
        purchaseHistory: purchaseHistory
      });
    }
  }, [userInfo, userImage, ownedPrograms, purchaseHistory, saveUserProfile]);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('isSignedIn', JSON.stringify(isSignedIn));
  }, [isSignedIn]);

  useEffect(() => {
    localStorage.setItem('isAdmin', JSON.stringify(isAdmin));
  }, [isAdmin]);

  useEffect(() => {
    localStorage.setItem('ownedPrograms', JSON.stringify(ownedPrograms));
  }, [ownedPrograms]);

  useEffect(() => {
    if (userInfo) {
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
    } else {
      localStorage.removeItem('userInfo');
    }
  }, [userInfo]);

  useEffect(() => {
    if (userImage) {
      localStorage.setItem('userImage', userImage);
    } else {
      localStorage.removeItem('userImage');
    }
  }, [userImage]);

  useEffect(() => {
    localStorage.setItem('purchaseHistory', JSON.stringify(purchaseHistory));
  }, [purchaseHistory]);

  const loadRewardsData = useCallback(async () => {
    if (!userId) return;
    
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-b0ab3817/rewards/${userId}`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log('Loaded rewards data:', data);
        // Ensure rewards has the correct structure
        setRewardsData({
          completedPrograms: data.completedPrograms || 0,
          rewards: data.rewards || {}
        });
      }
    } catch (error) {
      console.error('Error loading rewards data:', error);
    }
  }, [userId]);

  const saveProfileData = useCallback(async (firstName: string, lastName: string, email: string, image?: string | null) => {
    const currentUserImage = image !== undefined ? image : userImage;
    
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-b0ab3817/profile/update`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId: userId,
            firstName,
            lastName,
            email,
            userImage: currentUserImage
          })
        }
      );

      if (response.ok) {
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error saving profile data:', error);
      return false;
    }
  }, [userId, userImage]);

  const loadProfileData = useCallback(async () => {
    if (isLoadingProfileRef.current || !userId) return;
    
    try {
      isLoadingProfileRef.current = true;
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-b0ab3817/profile/${userId}`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Only update if data is different to prevent loops
        setUserInfo(prev => {
          if (prev?.firstName === data.firstName && 
              prev?.lastName === data.lastName && 
              prev?.email === data.email) {
            return prev;
          }
          return {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email
          };
        });
        if (data.userImage) {
          setUserImage(prev => prev === data.userImage ? prev : data.userImage);
        }
      }
    } catch (error) {
      console.error('Error loading profile data:', error);
    } finally {
      isLoadingProfileRef.current = false;
    }
  }, [userId]);

  // Load rewards data when user is signed in and navigates to account page
  useEffect(() => {
    if (isSignedIn && currentPage === 'account' && !hasLoadedAccountDataRef.current) {
      hasLoadedAccountDataRef.current = true;
      loadRewardsData();
      loadProfileData();
    }
    
    // Reset the flag when leaving the account page
    if (currentPage !== 'account') {
      hasLoadedAccountDataRef.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn, currentPage]);

  // Load exercises from database when viewing a session
  useEffect(() => {
    if (!viewingSession) {
      setSessionExercises([]);
      setIsLoadingExercises(false);
      return;
    }

    const { programId, sessionId } = viewingSession;

    const fetchExercises = async () => {
      try {
        setIsLoadingExercises(true);
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-b0ab3817/programs/${programId}`,
          {
            headers: {
              Authorization: `Bearer ${publicAnonKey}`,
            },
          }
        );
        
        if (response.ok) {
          const programData = await response.json();
          if (programData?.exercises && programData.exercises.length > 0) {
            // Map exercises to the format expected by SessionPage
            const exercises = programData.exercises.map((ex: any, index: number) => ({
              id: `${sessionId}-ex${index + 1}`,
              exerciseName: ex.name,
              sets: ex.sets || '',
              reps: ex.reps || '',
              image: ex.videoUrl, // Use videoUrl for the video element
              isComplete: false
            }));
            setSessionExercises(exercises);
          } else {
            // Fallback to mock data if no exercises in database
            const mockExercises = [
              { id: `${sessionId}-ex1`, exerciseName: 'DB Goblet Lateral Lunge w/ contra. rotation', sets: '2 SETS PER SIDE', reps: '12 REPS', isComplete: false },
              { id: `${sessionId}-ex2`, exerciseName: 'DB Goblet Lateral Lunge w/ contra. rotation', sets: '2 SETS PER SIDE', reps: '12 REPS', isComplete: false },
              { id: `${sessionId}-ex3`, exerciseName: 'DB Goblet Lateral Lunge w/ contra. rotation', sets: '2 SETS PER SIDE', reps: '12 REPS', isComplete: false },
              { id: `${sessionId}-ex4`, exerciseName: 'DB Goblet Lateral Lunge w/ contra. rotation', sets: '2 SETS PER SIDE', reps: '12 REPS', isComplete: false },
              { id: `${sessionId}-ex5`, exerciseName: 'DB Goblet Lateral Lunge w/ contra. rotation', sets: '2 SETS PER SIDE', reps: '12 REPS', isComplete: false },
              { id: `${sessionId}-ex6`, exerciseName: 'DB Goblet Lateral Lunge w/ contra. rotation', sets: '2 SETS PER SIDE', reps: '12 REPS', isComplete: false }
            ];
            setSessionExercises(mockExercises);
          }
        } else {
          // Fallback to mock data if program not found
          const mockExercises = [
            { id: `${sessionId}-ex1`, exerciseName: 'DB Goblet Lateral Lunge w/ contra. rotation', sets: '2 SETS PER SIDE', reps: '12 REPS', isComplete: false },
            { id: `${sessionId}-ex2`, exerciseName: 'DB Goblet Lateral Lunge w/ contra. rotation', sets: '2 SETS PER SIDE', reps: '12 REPS', isComplete: false },
            { id: `${sessionId}-ex3`, exerciseName: 'DB Goblet Lateral Lunge w/ contra. rotation', sets: '2 SETS PER SIDE', reps: '12 REPS', isComplete: false },
            { id: `${sessionId}-ex4`, exerciseName: 'DB Goblet Lateral Lunge w/ contra. rotation', sets: '2 SETS PER SIDE', reps: '12 REPS', isComplete: false },
            { id: `${sessionId}-ex5`, exerciseName: 'DB Goblet Lateral Lunge w/ contra. rotation', sets: '2 SETS PER SIDE', reps: '12 REPS', isComplete: false },
            { id: `${sessionId}-ex6`, exerciseName: 'DB Goblet Lateral Lunge w/ contra. rotation', sets: '2 SETS PER SIDE', reps: '12 REPS', isComplete: false }
          ];
          setSessionExercises(mockExercises);
        }
      } catch (error) {
        console.error('Error fetching exercises:', error);
        // Fallback to mock data on error
        const mockExercises = [
          { id: `${sessionId}-ex1`, exerciseName: 'DB Goblet Lateral Lunge w/ contra. rotation', sets: '2 SETS PER SIDE', reps: '12 REPS', isComplete: false },
          { id: `${sessionId}-ex2`, exerciseName: 'DB Goblet Lateral Lunge w/ contra. rotation', sets: '2 SETS PER SIDE', reps: '12 REPS', isComplete: false },
          { id: `${sessionId}-ex3`, exerciseName: 'DB Goblet Lateral Lunge w/ contra. rotation', sets: '2 SETS PER SIDE', reps: '12 REPS', isComplete: false },
          { id: `${sessionId}-ex4`, exerciseName: 'DB Goblet Lateral Lunge w/ contra. rotation', sets: '2 SETS PER SIDE', reps: '12 REPS', isComplete: false },
          { id: `${sessionId}-ex5`, exerciseName: 'DB Goblet Lateral Lunge w/ contra. rotation', sets: '2 SETS PER SIDE', reps: '12 REPS', isComplete: false },
          { id: `${sessionId}-ex6`, exerciseName: 'DB Goblet Lateral Lunge w/ contra. rotation', sets: '2 SETS PER SIDE', reps: '12 REPS', isComplete: false }
        ];
        setSessionExercises(mockExercises);
      } finally {
        setIsLoadingExercises(false);
      }
    };
    
    fetchExercises();
  }, [viewingSession]);

  // Load all programs from database on mount
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setIsLoadingPrograms(true);
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-b0ab3817/programs`,
          {
            headers: {
              Authorization: `Bearer ${publicAnonKey}`,
            },
          }
        );
        
        if (response.ok) {
          const data = await response.json();
          // Convert array to Record keyed by program ID
          const programsById: Record<string, any> = {};
          if (data.programs && Array.isArray(data.programs)) {
            data.programs.forEach((program: any) => {
              if (program.id) {
                programsById[program.id] = program;
              }
            });
          }
          setDatabasePrograms(programsById);
        }
      } catch (error) {
        console.error('Error loading programs:', error);
      } finally {
        setIsLoadingPrograms(false);
      }
    };
    
    fetchPrograms();
  }, []);

  // Function to reload programs from database (called after creating/updating programs)
  const reloadPrograms = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-b0ab3817/programs`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        const programsById: Record<string, any> = {};
        if (data.programs && Array.isArray(data.programs)) {
          data.programs.forEach((program: any) => {
            if (program.id) {
              programsById[program.id] = program;
            }
          });
        }
        setDatabasePrograms(programsById);
      }
    } catch (error) {
      console.error('Error reloading programs:', error);
    }
  };

  // Test Supabase connection
  const testSupabaseConnection = useCallback(async () => {
    console.log('=== TESTING SUPABASE CONNECTION ===');
    console.log('Project ID:', projectId);
    console.log('Public Anon Key:', publicAnonKey ? `${publicAnonKey.substring(0, 20)}...` : 'MISSING');
    
    try {
      const healthUrl = `https://${projectId}.supabase.co/functions/v1/make-server-b0ab3817/health`;
      console.log('Testing health endpoint:', healthUrl);
      
      const response = await fetch(healthUrl, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });
      
      console.log('Health check status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Health check response:', data);
        toast.success('✅ Supabase connection is working!');
      } else {
        const errorText = await response.text();
        console.error('Health check failed:', errorText);
        toast.error('❌ Supabase connection failed');
      }
    } catch (error) {
      console.error('Connection test error:', error);
      toast.error('❌ Cannot reach Supabase');
    }
    
    console.log('=== END CONNECTION TEST ===');
  }, []);

  // Expose test function to window for easy access
  useEffect(() => {
    (window as any).testSupabaseConnection = testSupabaseConnection;
    console.log('💡 Test Supabase connection by running: window.testSupabaseConnection()');
  }, [testSupabaseConnection]);

  const handleClaimReward = async (rewardId: string) => {
    setIsLoadingRewards(true);
    
    // Map reward IDs to discount percentages
    const discountMap: Record<string, number> = {
      'reward-2-programs': 10,
      'reward-5-programs': 25,
      'reward-9-programs': 50,
      'reward-10-programs': 100
    };

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-b0ab3817/rewards/claim`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({
            userId,
            rewardId,
            discountPercent: discountMap[rewardId]
          })
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success(`Reward claimed! Your code is: ${data.code}`);
        await loadRewardsData(); // Reload rewards to get updated state
      } else {
        toast.error(data.error || 'Failed to claim reward');
      }
    } catch (error) {
      console.error('Error claiming reward:', error);
      toast.error('Failed to claim reward. Please try again.');
    } finally {
      setIsLoadingRewards(false);
    }
  };

  // Helper function to get program image - prefers database image over fallback
  const getProgramImage = (programId: string): string => {
    // First check if program exists in database with an image
    if (databasePrograms[programId]?.image) {
      return databasePrograms[programId].image;
    }
    
    // Final fallback
    return 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080';
  };

  const handleProgramAction = (programId: string) => {
    if (isSignedIn && ownedPrograms.includes(programId)) {
      // User owns the program - open program detail page
      setCurrentPage('trainingPrograms');
      setViewingProgramDetail(programId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // User doesn't own the program - add to cart
      if (!cartItems.includes(programId)) {
        setCartItems([...cartItems, programId]);
      }
    }
  };

  const handleSessionAction = (sessionId: string) => {
    // Navigate to session page when user clicks START on a session
    if (viewingProgramDetail) {
      setViewingSession({
        programId: viewingProgramDetail,
        sessionId: sessionId
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleToggleExerciseComplete = (exerciseId: string) => {
    setSessionExercises(prev => 
      prev.map(ex => 
        ex.id === exerciseId ? { ...ex, isComplete: !ex.isComplete } : ex
      )
    );
  };

  const handleSkipSection = async () => {
    // When workout is completed, save session completion to localStorage
    if (viewingSession?.programId && viewingSession?.sessionId) {
      const programId = viewingSession.programId;
      const sessionId = viewingSession.sessionId;
      
      try {
        // Save session completion to localStorage
        const key = `sessionProgress:${userId}:${programId}`;
        const savedProgress = localStorage.getItem(key);
        const sessionProgress = savedProgress ? JSON.parse(savedProgress) : {};
        
        // Mark this session as complete
        sessionProgress[sessionId] = true;
        localStorage.setItem(key, JSON.stringify(sessionProgress));
        
        // Track session date for streak calculation
        const dateKey = `sessionDates:${userId}`;
        const savedDates = localStorage.getItem(dateKey);
        const dates = savedDates ? JSON.parse(savedDates) : [];
        const today = new Date().toISOString().split('T')[0];
        
        if (!dates.includes(today)) {
          dates.push(today);
          localStorage.setItem(dateKey, JSON.stringify(dates));
        }
        
        console.log('Session marked as complete:', { programId, sessionId });
        
        // Also try to update progress in backend (for program completion tracking)
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-b0ab3817/progress/complete`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${publicAnonKey}`
            },
            body: JSON.stringify({
              userId,
              programId
            })
          }
        );
        
        if (response.ok) {
          console.log('Progress updated in backend successfully');
        }
      } catch (error) {
        console.error('Error updating progress:', error);
      }
    }
  };

  const services = useMemo(() => [
    {
      title: 'Training Programs',
      subtitle: 'Performance Focussed\\nTraining Programs',
      image: trainingProgramsImage,
      buttonText: 'EXPAND',
      expandedContent: 'Performance focussed training programs engineered to develop performance capacity and athletic qualities. Browse our complete catalogue of training programs designed by experts.',
      onMoreInfo: () => setCurrentPage('trainingPrograms')
    },
    {
      title: 'Private Coaching',
      subtitle: 'Private Sessions +\\nRemote Services',
      image: privateCoachingImage,
      buttonText: 'EXPAND',
      expandedContent: 'One-on-one coaching tailored to your specific needs. Available both in-person and remotely, our expert coaches provide personalised guidance and accountability to help you reach peak performance.',
      onMoreInfo: () => setShowEnquiryForm('Private Coaching')
    },
    {
      title: 'Athletic Profiling',
      subtitle: 'Movement Assessment +\\nPerformance Analysis',
      image: athleticProfilingImage,
      buttonText: 'EXPAND',
      expandedContent: 'Using state of the art technology, we are able to collect key information to quantify and analyse your athletic qualities, building a comprehensive profile of your performance capacities and movement strategies.\n\nScreenings are formulated in context to your sport and specific performance goals, ensuring meaningful data is collected and impactful solutions are introduced to maximise training effectiveness. Profiling also unlocks a greater ability to monitor readiness, mitigate injury risk and measure physical progress.',
      onMoreInfo: () => setShowEnquiryForm('Athletic Profiling')
    },
    {
      title: 'Events + Workshops',
      subtitle: 'Informative + Practical\\nPresentations',
      image: eventsWorkshopsImage,
      buttonText: 'EXPAND',
      expandedContent: 'Educational sessions combining theory and practical application. Learn evidence-based strategies for nutrition, recovery, performance optimisation, and injury prevention from industry experts.',
      onMoreInfo: () => setShowEnquiryForm('Events + Workshops')
    }
  ], []);

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const cardWidth = scrollRef.current.offsetWidth - 32;
      const newIndex = Math.round(scrollLeft / cardWidth);
      setCurrentSlide(newIndex);
    }
  };

  const scrollToSlide = (index: number) => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.offsetWidth - 32;
      scrollRef.current.scrollTo({
        left: index * cardWidth,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const handlePageScroll = () => {
      const currentScrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const isAtBottom = currentScrollY + windowHeight >= documentHeight - 10;
      
      setPrevScrollY((prev) => {
        if (isAtBottom) {
          // At the bottom, always hide logo
          setShowLogo(false);
        } else if (currentScrollY <= 10) {
          // At the top, always show logo
          setShowLogo(true);
        } else if (currentScrollY > prev) {
          // Scrolling down, hide logo
          setShowLogo(false);
        } else if (currentScrollY < prev) {
          // Scrolling up, show logo
          setShowLogo(true);
        }
        
        setScrollY(currentScrollY);
        return currentScrollY;
      });
    };

    window.addEventListener('scroll', handlePageScroll);
    return () => window.removeEventListener('scroll', handlePageScroll);
  }, []);

  const handleNavigate = (page: 'home' | 'programs' | 'account' | 'trainingPrograms' | 'checkout' | 'admin') => {
    setCurrentPage(page);
    setActiveProgramId(null); // Clear active program when navigating
    window.scrollTo(0, 0);
  };

  const handleStartPurchase = (programId: string) => {
    if (isSignedIn) {
      setPendingPurchase(programId);
    } else {
      setPendingPurchase(programId);
      setShowLoginPrompt(true);
    }
  };

  const handleCompletePurchase = (programId: string) => {
    setOwnedPrograms([...ownedPrograms, programId]);
    setPendingPurchase(null);
  };

  const handleCancelPurchase = () => {
    setPendingPurchase(null);
  };

  // Show Program Dashboard if a program is active
  if (activeProgramId) {
    const programData = getProgramInfo(activeProgramId);
    return (
      <ProgramDashboard
        programId={activeProgramId}
        programTitle={programData.title}
        onNavigate={handleNavigate}
        onBack={() => setActiveProgramId(null)}
      />
    );
  }

  if (currentPage === 'programs') {
    return (
      <>
        <ProgramsPage 
          onNavigate={handleNavigate} 
          ownedPrograms={ownedPrograms} 
          onAddProgram={handleStartPurchase}
          onOpenProgram={(programId) => setActiveProgramId(programId)}
          isSignedIn={isSignedIn}
        />
        {showLoginPrompt && pendingPurchase && (() => {
          const programData = getProgramInfo(pendingPurchase);
          return (
            <LoginPrompt
              programName={programData.title}
              onClose={() => {
                setShowLoginPrompt(false);
                setPendingPurchase(null);
              }}
              onLogin={(email: string) => {
                setIsSignedIn(true);
                // Check if admin email
                if (email === 'info@programking.com') {
                  setIsAdmin(true);
                }
                setShowLoginPrompt(false);
              }}
              onCreateAccount={(email: string) => {
                setIsSignedIn(true);
                // Check if admin email
                if (email === 'info@programking.com') {
                  setIsAdmin(true);
                }
                setShowLoginPrompt(false);
              }}
            />
          );
        })()}
        {pendingPurchase && !showLoginPrompt && (() => {
          const programData = getProgramInfo(pendingPurchase);
          return (
            <PaymentModal
              programId={pendingPurchase}
              programTitle={programData.title}
              programSubtitle={programData.subtitle}
              programPrice={programData.price}
              onCompletePurchase={handleCompletePurchase}
              onCancel={handleCancelPurchase}
            />
          );
        })()}
      </>
    );
  }

  if (currentPage === 'account') {
    // Check if user is signed in, if not show login modal
    if (!isSignedIn) {
      return (
        <>
          <NavigationMenu 
            isOpen={isMenuOpen} 
            onClose={() => setIsMenuOpen(false)} 
            onNavigate={handleNavigate}
            isSignedIn={isSignedIn}
            isAdmin={isAdmin}
          />
          
          <LoginPrompt
            programName="Account Access"
            onClose={() => {
              handleNavigate('home');
            }}
            onLogin={async (email: string) => {
              setIsSignedIn(true);
              setUserInfo({ 
                email, 
                firstName: email.split('@')[0], 
                lastName: 'User' 
              });
              // Check if admin email
              if (email === 'info@programking.com') {
                setIsAdmin(true);
              }
              // Load profile from backend
              await loadProfileData();
            }}
            onCreateAccount={async (email: string) => {
              const firstName = email.split('@')[0];
              const lastName = 'User';
              setIsSignedIn(true);
              setUserInfo({ 
                email, 
                firstName, 
                lastName 
              });
              // Check if admin email
              if (email === 'info@programking.com') {
                setIsAdmin(true);
              }
              // Save new profile to backend
              await saveProfileData(firstName, lastName, email);
            }}
          />
        </>
      );
    }
    
    // Use original account dashboard components
    return (
      <>
        {/* Desktop Account Dashboard */}
        {isDesktop && (
          <AccountDashboardPageDesktop
            userName={userInfo ? `${userInfo.firstName} ${userInfo.lastName}` : 'User'}
            userEmail={userInfo?.email}
            userImage={userImage || undefined}
            programsComplete={rewardsData.completedPrograms}
            sessionsComplete={0}
            userPrograms={ownedPrograms.map(prog => ({
              id: prog.id,
              title: prog.title,
              subtitle: prog.subtitle || '',
              image: prog.image,
              duration: prog.duration || '',
              sessions: prog.sessions || '',
              time: prog.time || '',
              progress: 0,
              status: 'not-started' as const
            }))}
            purchaseHistory={purchaseHistory}
            rewardsData={rewardsData}
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
            onNavigate={handleNavigate}
            onProgramAction={(programId) => {
              setPreviousPage('account');
              handleProgramAction(programId);
            }}
            onLogout={() => {
              setIsSignedIn(false);
              setIsAdmin(false);
              setOwnedPrograms([]);
              setUserInfo(null);
              setUserImage(null);
              setPurchaseHistory([]);
              // Clear localStorage
              localStorage.removeItem('isSignedIn');
              localStorage.removeItem('isAdmin');
              localStorage.removeItem('ownedPrograms');
              localStorage.removeItem('userInfo');
              localStorage.removeItem('userImage');
              localStorage.removeItem('purchaseHistory');
              handleNavigate('home');
              toast.success('Successfully logged out');
            }}
            onClaimReward={handleClaimReward}
          />
        )}
        
        {/* Mobile Account Dashboard */}
        {!isDesktop && (
          <AccountDashboardPageMobile
            userName={userInfo ? `${userInfo.firstName} ${userInfo.lastName}` : 'User'}
            userEmail={userInfo?.email}
            userImage={userImage || undefined}
            programsComplete={rewardsData.completedPrograms}
            sessionsComplete={0}
            userPrograms={ownedPrograms.map(prog => ({
              id: prog.id,
              title: prog.title,
              subtitle: prog.subtitle || '',
              image: prog.image,
              duration: prog.duration || '',
              sessions: prog.sessions || '',
              time: prog.time || '',
              progress: 0,
              status: 'not-started' as const
            }))}
            purchaseHistory={purchaseHistory}
            rewardsData={rewardsData}
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
            onNavigate={handleNavigate}
            onProgramAction={(programId) => {
              setPreviousPage('account');
              handleProgramAction(programId);
            }}
            onLogout={() => {
              setIsSignedIn(false);
              setIsAdmin(false);
              setOwnedPrograms([]);
              setUserInfo(null);
              setUserImage(null);
              setPurchaseHistory([]);
              // Clear localStorage
              localStorage.removeItem('isSignedIn');
              localStorage.removeItem('isAdmin');
              localStorage.removeItem('ownedPrograms');
              localStorage.removeItem('userInfo');
              localStorage.removeItem('userImage');
              localStorage.removeItem('purchaseHistory');
              handleNavigate('home');
              toast.success('Successfully logged out');
            }}
            onClaimReward={handleClaimReward}
          />
        )}
      </>
    );
  }



  if (currentPage === 'trainingPrograms') {
    // Show session page if viewing a specific session
    if (viewingSession) {
      const { programId, sessionId } = viewingSession;
      const programInfo = getProgramInfo(programId);

      const heroImage = getProgramImage(programId);

      // Show loading state while fetching exercises
      if (isLoadingExercises) {
        return (
          <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="text-[#D4AF37] font-[DM_Sans]" style={{ fontSize: '14px', letterSpacing: '0.1em' }}>
              LOADING EXERCISES...
            </div>
          </div>
        );
      }

      return (
        <>
          <NavigationMenu 
            isOpen={isMenuOpen} 
            onClose={() => setIsMenuOpen(false)} 
            onNavigate={(page) => {
              setViewingSession(null);
              setViewingProgramDetail(null);
              handleNavigate(page);
            }}
            isSignedIn={isSignedIn}
          />
          
          {isDesktop ? (
            <SessionPageDesktop
              programTitle={programInfo.title}
              sessionTitle="Week 1 session A"
              blockNumber={2}
              totalBlocks={3}
              sectionTitle="KEY EXERCISES"
              exercises={sessionExercises}
              heroImage={heroImage}
              isMenuOpen={isMenuOpen}
              setIsMenuOpen={setIsMenuOpen}
              onNavigate={(page) => {
                if (page === 'programDetail') {
                  setViewingSession(null);
                } else {
                  setViewingSession(null);
                  setViewingProgramDetail(null);
                  handleNavigate(page as 'home' | 'programs' | 'account' | 'trainingPrograms');
                }
              }}
              onToggleComplete={handleToggleExerciseComplete}
              onSkipSection={handleSkipSection}
              programId={programId}
            />
          ) : (
            <SessionPageMobile
              programTitle={programInfo.title}
              sessionTitle="Week 1 session A"
              blockNumber={2}
              totalBlocks={3}
              sectionTitle="KEY EXERCISES"
              exercises={sessionExercises}
              heroImage={heroImage}
              isMenuOpen={isMenuOpen}
              setIsMenuOpen={setIsMenuOpen}
              onNavigate={(page) => {
                if (page === 'programDetail') {
                  setViewingSession(null);
                } else {
                  setViewingSession(null);
                  setViewingProgramDetail(null);
                  handleNavigate(page as 'home' | 'programs' | 'account' | 'trainingPrograms');
                }
              }}
              onToggleComplete={handleToggleExerciseComplete}
              onSkipSection={handleSkipSection}
              programId={programId}
            />
          )}
        </>
      );
    }
    
    // Show program detail if viewing a specific program
    if (viewingProgramDetail) {
      const programData = getProgramInfo(viewingProgramDetail);
      const programImage = getProgramImage(viewingProgramDetail);
      
      // Mock session data
      const mockSessions = [
        {
          id: 'week1-sessionA',
          week: 1,
          session: 'A',
          tempo: '30:10',
          tempoDetail: 'Work : Rest',
          exerciseCount: 6,
          exerciseDetails: 'Squats, Lunges, Rows, Push-ups, Planks, Burpees',
          isComplete: false
        },
        {
          id: 'week1-sessionB',
          week: 1,
          session: 'B',
          tempo: '30:10',
          tempoDetail: 'Work : Rest',
          exerciseCount: 6,
          exerciseDetails: 'Deadlifts, Step-ups, Pull-ups, Dips, Crunches, Mountain Climbers',
          isComplete: false
        },
        {
          id: 'week2-sessionA',
          week: 2,
          session: 'A',
          tempo: '40:20',
          tempoDetail: 'Work : Rest',
          exerciseCount: 6,
          exerciseDetails: 'Squats, Lunges, Rows, Push-ups, Planks, Burpees',
          isComplete: false
        }
      ];
      
      return (
        <>
          <NavigationMenu 
            isOpen={isMenuOpen} 
            onClose={() => setIsMenuOpen(false)} 
            onNavigate={(page) => {
              setViewingProgramDetail(null);
              handleNavigate(page);
            }}
            isSignedIn={isSignedIn}
          />
          
          {isDesktop ? (
            <ProgramDetailPageDesktop
              programId={viewingProgramDetail}
              programTitle={programData.title}
              programSubtitle={programData.subtitle}
              progressPercentage={0}
              sessions={mockSessions}
              heroImage={programImage}
              isMenuOpen={isMenuOpen}
              setIsMenuOpen={setIsMenuOpen}
              previousPage={previousPage}
              onNavigate={(page) => {
                if (page === 'trainingPrograms') {
                  // Going back to training programs page
                  setViewingProgramDetail(null);
                } else {
                  setViewingProgramDetail(null);
                  handleNavigate(page);
                }
              }}
              onSessionAction={handleSessionAction}
            />
          ) : (
            <ProgramDetailPageMobile
              programId={viewingProgramDetail}
              programTitle={programData.title}
              programSubtitle={programData.subtitle}
              progressPercentage={0}
              sessions={mockSessions}
              heroImage={programImage}
              isMenuOpen={isMenuOpen}
              setIsMenuOpen={setIsMenuOpen}
              previousPage={previousPage}
              onNavigate={(page) => {
                if (page === 'trainingPrograms') {
                  // Going back to training programs page
                  setViewingProgramDetail(null);
                } else {
                  setViewingProgramDetail(null);
                  handleNavigate(page);
                }
              }}
              onSessionAction={handleSessionAction}
            />
          )}
        </>
      );
    }
    
    // Create programs array from PROGRAM_CATALOG with proper structure
    const allPrograms = Object.entries(PROGRAM_CATALOG).map(([id, data]) => ({
      id,
      title: data.title,
      subtitle: data.subtitle,
      image: getProgramImage(id),
      duration: '6 week program',
      sessions: '5 sessions p/w',
      time: '20 mins'
    }));
    
    return (
      <>
        <NavigationMenu 
          isOpen={isMenuOpen} 
          onClose={() => setIsMenuOpen(false)} 
          onNavigate={handleNavigate}
          isSignedIn={isSignedIn}
        />

        {isDesktop ? (
          <TrainingProgramsPageDesktop
            programs={allPrograms}
            ownedPrograms={ownedPrograms}
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
            onNavigate={handleNavigate}
            onProgramAction={(programId) => {
              setPreviousPage('trainingPrograms');
              handleProgramAction(programId);
            }}
            isSignedIn={isSignedIn}
            cartItemCount={cartItems.length}
          />
        ) : (
          <TrainingProgramsPageMobile
            programs={allPrograms}
            ownedPrograms={ownedPrograms}
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
            onNavigate={handleNavigate}
            onProgramAction={(programId) => {
              setPreviousPage('trainingPrograms');
              handleProgramAction(programId);
            }}
            isSignedIn={isSignedIn}
            cartItemCount={cartItems.length}
          />
        )}

        {showLoginPrompt && pendingPurchase && (() => {
          const programData = getProgramInfo(pendingPurchase);
          return (
            <LoginPrompt
              programName={programData.title}
              onClose={() => {
                setShowLoginPrompt(false);
                setPendingPurchase(null);
              }}
              onLogin={(email: string) => {
                setIsSignedIn(true);
                // Check if admin email
                if (email === 'info@programking.com') {
                  setIsAdmin(true);
                }
                setShowLoginPrompt(false);
              }}
              onCreateAccount={(email: string) => {
                setIsSignedIn(true);
                // Check if admin email
                if (email === 'info@programking.com') {
                  setIsAdmin(true);
                }
                setShowLoginPrompt(false);
              }}
            />
          );
        })()}
        {pendingPurchase && !showLoginPrompt && (() => {
          const programData = getProgramInfo(pendingPurchase);
          return (
            <PaymentModal
              programId={pendingPurchase}
              programTitle={programData.title}
              programSubtitle={programData.subtitle}
              programPrice={programData.price}
              onCompletePurchase={handleCompletePurchase}
              onCancel={handleCancelPurchase}
            />
          );
        })()}
      </>
    );
  }

  if (currentPage === 'checkout') {
    // Show order confirmation if we have a completed order
    if (orderConfirmation && userInfo) {
      return (
        <>
          <NavigationMenu 
            isOpen={isMenuOpen} 
            onClose={() => setIsMenuOpen(false)} 
            onNavigate={(page) => {
              setOrderConfirmation(null);
              handleNavigate(page);
            }}
            isSignedIn={isSignedIn}
          />
          
          {isDesktop ? (
            <OrderConfirmationDesktop
              orderNumber={orderConfirmation.orderNumber}
              orderItems={orderConfirmation.items}
              userFirstName={userInfo.firstName}
              userLastName={userInfo.lastName}
              userEmail={userInfo.email}
              isMenuOpen={isMenuOpen}
              setIsMenuOpen={setIsMenuOpen}
              onNavigate={(page) => {
                setOrderConfirmation(null);
                handleNavigate(page);
              }}
            />
          ) : (
            <OrderConfirmationMobile
              orderNumber={orderConfirmation.orderNumber}
              orderItems={orderConfirmation.items}
              userFirstName={userInfo.firstName}
              userLastName={userInfo.lastName}
              userEmail={userInfo.email}
              isMenuOpen={isMenuOpen}
              setIsMenuOpen={setIsMenuOpen}
              onNavigate={(page) => {
                setOrderConfirmation(null);
                handleNavigate(page);
              }}
            />
          )}
        </>
      );
    }
    
    // Create cart item objects with full program details
    const cartItemsWithDetails = cartItems.map(programId => {
      const programData = getProgramInfo(programId);
      return {
        id: programId,
        title: programData.title,
        subtitle: programData.subtitle,
        price: programData.price,
        image: getProgramImage(programId)
      };
    });
    
    const subtotal = cartItemsWithDetails.reduce((sum, item) => sum + item.price, 0);
    const total = subtotal + (subtotal * 0.2); // Include VAT
    
    // Helper to show payment modal
    const handleShowPayment = () => {
      if (!isSignedIn || !userInfo) {
        // Need to authenticate first
        setShowCheckoutAuth(true);
      } else {
        // Already authenticated, show payment
        setShowCheckoutPayment(true);
      }
    };
    
    // Helper to complete auth and proceed to payment
    const handleAuthComplete = async (email: string, firstName: string, lastName: string) => {
      // Set user info
      setUserInfo({ firstName, lastName, email });
      setIsSignedIn(true);
      
      // Load profile data from backend
      await loadProfileData();
      
      setShowCheckoutAuth(false);
      setShowCheckoutPayment(true);
    };
    
    // Helper to complete payment
    const handlePaymentComplete = async (discountCode?: string) => {
      // If discount code was used, mark it as redeemed
      if (discountCode && userId) {
        try {
          await fetch(
            `https://${projectId}.supabase.co/functions/v1/make-server-b0ab3817/rewards/redeem`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${publicAnonKey}`
              },
              body: JSON.stringify({
                userId,
                code: discountCode
              })
            }
          );
          
          // Reload rewards data to update status
          await loadRewardsData();
        } catch (error) {
          console.error('Error redeeming discount code:', error);
        }
      }
      
      // Generate order number
      const orderNum = `PK${Date.now().toString().slice(-8)}`;
      
      // Create order confirmation
      setOrderConfirmation({
        orderNumber: orderNum,
        items: cartItemsWithDetails
      });
      
      // Add to purchase history
      const currentDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
      const newPurchases = cartItemsWithDetails.map(item => ({
        programTitle: item.title,
        date: currentDate,
        price: item.price
      }));
      setPurchaseHistory([...purchaseHistory, ...newPurchases]);
      
      // Add programs to owned programs
      setOwnedPrograms([...ownedPrograms, ...cartItems]);
      
      // Clear cart
      setCartItems([]);
      
      // Close payment modal
      setShowCheckoutPayment(false);
    };
    
    return (
      <>
        <NavigationMenu 
          isOpen={isMenuOpen} 
          onClose={() => setIsMenuOpen(false)} 
          onNavigate={handleNavigate}
          isSignedIn={isSignedIn}
        />
        
        {isDesktop ? (
          <CheckoutPageDesktop
            cartItems={cartItemsWithDetails}
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
            onNavigate={handleNavigate}
            onRemoveItem={(programId) => setCartItems(cartItems.filter(id => id !== programId))}
            onShowPaymentModal={handleShowPayment}
          />
        ) : (
          <CheckoutPageMobile
            cartItems={cartItemsWithDetails}
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
            onNavigate={handleNavigate}
            onRemoveItem={(programId) => setCartItems(cartItems.filter(id => id !== programId))}
            onShowPaymentModal={handleShowPayment}
          />
        )}
        
        {/* Checkout Auth Modal */}
        {showCheckoutAuth && (
          <CheckoutAuthModal
            onLogin={handleAuthComplete}
            onCancel={() => setShowCheckoutAuth(false)}
          />
        )}
        
        {/* Checkout Payment Modal */}
        {showCheckoutPayment && cartItems.length > 0 && (
          <CheckoutPaymentModal
            totalAmount={total}
            itemCount={cartItems.length}
            userId={userId}
            onCompletePurchase={handlePaymentComplete}
            onCancel={() => setShowCheckoutPayment(false)}
          />
        )}
      </>
    );
  }

  if (currentPage === 'admin') {
    // Check if user is admin
    if (!isAdmin) {
      // Redirect to home if not admin
      setCurrentPage('home');
      return null;
    }
    
    // Show program editor if creating/editing a program
    if (editingProgram !== null) {
      const isNewProgram = editingProgram === 'new';
      const programData = isNewProgram ? undefined : {
        title: PROGRAM_CATALOG[editingProgram]?.title || '',
        subtitle: PROGRAM_CATALOG[editingProgram]?.subtitle || '',
        duration: '6 week program',
        sessions: '5 sessions p/w',
        time: '20 mins',
        price: PROGRAM_CATALOG[editingProgram]?.price || 0,
        image: getProgramImage(editingProgram),
        exercises: [] // In production, this would come from the database
      };
      
      return (
        <>
          <NavigationMenu 
            isOpen={isMenuOpen} 
            onClose={() => setIsMenuOpen(false)} 
            onNavigate={(page) => {
              setEditingProgram(null);
              handleNavigate(page);
            }}
            isSignedIn={isSignedIn}
            isAdmin={isAdmin}
          />
          
          {isDesktop ? (
            <ProgramEditorPageDesktop
              programId={isNewProgram ? undefined : editingProgram}
              initialData={programData}
              isMenuOpen={isMenuOpen}
              setIsMenuOpen={setIsMenuOpen}
              onNavigate={() => {
                setEditingProgram(null);
              }}
              onSave={async (programData) => {
                try {
                  const response = await fetch(
                    `https://${projectId}.supabase.co/functions/v1/make-server-b0ab3817/programs`,
                    {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${publicAnonKey}`
                      },
                      body: JSON.stringify(programData)
                    }
                  );
                  
                  if (response.ok) {
                    toast.success(isNewProgram ? 'Program created successfully!' : 'Program updated successfully!');
                    await reloadPrograms(); // Reload programs to update images
                    setEditingProgram(null);
                  } else {
                    const error = await response.json();
                    toast.error(error.error || 'Failed to save program');
                  }
                } catch (error) {
                  console.error('Error saving program:', error);
                  toast.error('Failed to save program. Please try again.');
                }
              }}
            />
          ) : (
            <ProgramEditorPageMobile
              programId={isNewProgram ? undefined : editingProgram}
              initialData={programData}
              isMenuOpen={isMenuOpen}
              setIsMenuOpen={setIsMenuOpen}
              onNavigate={() => {
                setEditingProgram(null);
              }}
              onSave={async (programData) => {
                try {
                  const response = await fetch(
                    `https://${projectId}.supabase.co/functions/v1/make-server-b0ab3817/programs`,
                    {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${publicAnonKey}`
                      },
                      body: JSON.stringify(programData)
                    }
                  );
                  
                  if (response.ok) {
                    toast.success(isNewProgram ? 'Program created successfully!' : 'Program updated successfully!');
                    await reloadPrograms(); // Reload programs to update images
                    setEditingProgram(null);
                  } else {
                    const error = await response.json();
                    toast.error(error.error || 'Failed to save program');
                  }
                } catch (error) {
                  console.error('Error saving program:', error);
                  toast.error('Failed to save program. Please try again.');
                }
              }}
            />
          )}
        </>
      );
    }
    
    // Create programs array from PROGRAM_CATALOG with proper structure for admin
    const allPrograms = Object.entries(PROGRAM_CATALOG).map(([id, data]) => ({
      id,
      title: data.title,
      subtitle: data.subtitle,
      price: data.price,
      image: getProgramImage(id),
      duration: '6 week program',
      sessions: '5 sessions p/w',
      time: '20 mins'
    }));
    
    return (
      <>
        <NavigationMenu 
          isOpen={isMenuOpen} 
          onClose={() => setIsMenuOpen(false)} 
          onNavigate={handleNavigate}
          isSignedIn={isSignedIn}
          isAdmin={isAdmin}
        />
        
        {isDesktop ? (
          <AdminPortalPageDesktop
            programs={allPrograms}
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
            onNavigate={handleNavigate}
            onCreateProgram={() => {
              setEditingProgram('new');
            }}
            onEditProgram={(programId) => {
              setEditingProgram(programId);
            }}
            onDeleteProgram={async (programId) => {
              const programData = getProgramInfo(programId);
              if (window.confirm(`Are you sure you want to delete ${programData.title}?`)) {
                console.log(`[DELETE-DESKTOP] Starting deletion of program: ${programId}`);
                try {
                  const url = `https://${projectId}.supabase.co/functions/v1/make-server-b0ab3817/programs/${programId}`;
                  console.log(`[DELETE-DESKTOP] Calling URL: ${url}`);
                  
                  const response = await fetch(url, {
                    method: 'DELETE',
                    headers: {
                      'Authorization': `Bearer ${publicAnonKey}`,
                      'Content-Type': 'application/json',
                    },
                  });
                  
                  console.log(`[DELETE-DESKTOP] Response status: ${response.status}`);
                  
                  if (response.ok) {
                    console.log(`[DELETE-DESKTOP] Program deleted successfully, reloading programs...`);
                    toast.success('Program deleted successfully');
                    await reloadPrograms();
                    console.log(`[DELETE-DESKTOP] Programs reloaded`);
                  } else {
                    const error = await response.json();
                    console.error('[DELETE-DESKTOP] Error deleting program:', error);
                    toast.error(`Failed to delete program: ${error.error || 'Unknown error'}`);
                  }
                } catch (error) {
                  console.error('[DELETE-DESKTOP] Exception during deletion:', error);
                  toast.error('Failed to delete program. Please try again.');
                }
              } else {
                console.log(`[DELETE-DESKTOP] User cancelled deletion of program: ${programId}`);
              }
            }}
          />
        ) : (
          <AdminPortalPageMobile
            programs={allPrograms}
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
            onNavigate={handleNavigate}
            onCreateProgram={() => {
              setEditingProgram('new');
            }}
            onEditProgram={(programId) => {
              setEditingProgram(programId);
            }}
            onDeleteProgram={async (programId) => {
              const programData = getProgramInfo(programId);
              if (window.confirm(`Are you sure you want to delete ${programData.title}?`)) {
                console.log(`[DELETE-MOBILE] Starting deletion of program: ${programId}`);
                try {
                  const url = `https://${projectId}.supabase.co/functions/v1/make-server-b0ab3817/programs/${programId}`;
                  console.log(`[DELETE-MOBILE] Calling URL: ${url}`);
                  
                  const response = await fetch(url, {
                    method: 'DELETE',
                    headers: {
                      'Authorization': `Bearer ${publicAnonKey}`,
                      'Content-Type': 'application/json',
                    },
                  });
                  
                  console.log(`[DELETE-MOBILE] Response status: ${response.status}`);
                  
                  if (response.ok) {
                    console.log(`[DELETE-MOBILE] Program deleted successfully, reloading programs...`);
                    toast.success('Program deleted successfully');
                    await reloadPrograms();
                    console.log(`[DELETE-MOBILE] Programs reloaded`);
                  } else {
                    const error = await response.json();
                    console.error('[DELETE-MOBILE] Error deleting program:', error);
                    toast.error(`Failed to delete program: ${error.error || 'Unknown error'}`);
                  }
                } catch (error) {
                  console.error('[DELETE-MOBILE] Exception during deletion:', error);
                  toast.error('Failed to delete program. Please try again.');
                }
              } else {
                console.log(`[DELETE-MOBILE] User cancelled deletion of program: ${programId}`);
              }
            }}
          />
        )}
      </>
    );
  }

  // HomePage rendering
  return (
    <>
      {/* Toast Notifications */}
      <Toaster position="top-center" richColors />
      
      {/* Navigation Menu */}
      <NavigationMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
        onNavigate={handleNavigate}
        isSignedIn={isSignedIn}
        isAdmin={isAdmin}
      />

      {/* Render Desktop or Mobile Layout */}
      {isDesktop ? (
        <HomePageDesktop
          services={services}
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          onNavigate={handleNavigate}
          isSignedIn={isSignedIn}
          onAccountCreated={async (email, firstName, lastName, selectedProgram) => {
            setIsSignedIn(true);
            // Check if admin email
            if (email === 'info@programking.com') {
              setIsAdmin(true);
            }
            
            // Check if we have an existing profile for this email
            const existingProfile = loadUserProfile(email);
            if (existingProfile) {
              // Load existing profile data
              setUserInfo({ 
                email: existingProfile.email, 
                firstName: existingProfile.firstName, 
                lastName: existingProfile.lastName 
              });
              setUserImage(existingProfile.image || null);
              setOwnedPrograms(existingProfile.ownedPrograms || []);
              setPurchaseHistory(existingProfile.purchaseHistory || []);
            } else {
              // New user - use provided data
              setUserInfo({ email, firstName, lastName });
              // Add the selected free program to owned programs
              if (selectedProgram) {
                setOwnedPrograms([selectedProgram]);
              }
              // Save new profile to database
              await saveProfileData(firstName, lastName, email);
            }
          }}
        />
      ) : (
        <HomePageMobile
          services={services}
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          onNavigate={handleNavigate}
          onAccountCreated={async (email, firstName, lastName, selectedProgram) => {
            setIsSignedIn(true);
            // Check if admin email
            if (email === 'info@programking.com') {
              setIsAdmin(true);
            }
            
            // Check if we have an existing profile for this email
            const existingProfile = loadUserProfile(email);
            if (existingProfile) {
              // Load existing profile data
              setUserInfo({ 
                email: existingProfile.email, 
                firstName: existingProfile.firstName, 
                lastName: existingProfile.lastName 
              });
              setUserImage(existingProfile.image || null);
              setOwnedPrograms(existingProfile.ownedPrograms || []);
              setPurchaseHistory(existingProfile.purchaseHistory || []);
            } else {
              // New user - use provided data
              setUserInfo({ email, firstName, lastName });
              // Add the selected free program to owned programs
              if (selectedProgram) {
                setOwnedPrograms([selectedProgram]);
              }
              // Save new profile to database
              await saveProfileData(firstName, lastName, email);
            }
          }}
        />
      )}

      {/* Login Prompt */}
      {showLoginPrompt && pendingPurchase && (() => {
        const programData = getProgramInfo(pendingPurchase);
        return (
          <LoginPrompt
            programName={programData.title}
            onClose={() => {
              setShowLoginPrompt(false);
              setPendingPurchase(null);
            }}
            onLogin={(email: string) => {
              setIsSignedIn(true);
              // Check if admin email
              if (email === 'info@programking.com') {
                setIsAdmin(true);
              }
              setShowLoginPrompt(false);
            }}
            onCreateAccount={(email: string) => {
              setIsSignedIn(true);
              // Check if admin email
              if (email === 'info@programking.com') {
                setIsAdmin(true);
              }
              setShowLoginPrompt(false);
            }}
          />
        );
      })()}

      {/* Payment Modal */}
      {pendingPurchase && !showLoginPrompt && (() => {
        const programData = getProgramInfo(pendingPurchase);
        return (
          <PaymentModal
            programId={pendingPurchase}
            programTitle={programData.title}
            programSubtitle={programData.subtitle}
            programPrice={programData.price}
            onCompletePurchase={handleCompletePurchase}
            onCancel={handleCancelPurchase}
          />
        );
      })()}

      {/* Enquiry Form */}
      {showEnquiryForm && (
        <EnquiryForm
          serviceTitle={showEnquiryForm}
          onClose={() => setShowEnquiryForm(null)}
          onSubmit={async (formData) => {
            try {
              // Send enquiry to backend
              const response = await fetch(
                `https://${projectId}.supabase.co/functions/v1/make-server-b0ab3817/enquiries`,
                {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${publicAnonKey}`
                  },
                  body: JSON.stringify({
                    ...formData,
                    serviceTitle: showEnquiryForm
                  })
                }
              );
              
              if (!response.ok) {
                const error = await response.json();
                console.error('Error submitting enquiry:', error);
                
                // Show specific error message
                if (error.hint) {
                  toast.error(error.hint);
                } else if (error.statusCode === 401) {
                  toast.error('Email configuration error. Please check your Resend API key.');
                } else {
                  toast.error('Failed to submit enquiry. Please try again.');
                }
                throw new Error(error.error || 'Failed to submit enquiry');
              }
              
              const result = await response.json();
              console.log('Enquiry submitted successfully:', result);
              
              // Success is handled by the EnquiryForm component showing confirmation
            } catch (error) {
              console.error('Error submitting enquiry:', error);
              // Error toast already shown above
              throw error;
            }
          }}
        />
      )}
    </>
  );
}

// Wrap App with ErrorBoundary
export default function AppWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}