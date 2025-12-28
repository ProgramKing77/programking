import { useState, useEffect, useRef } from 'react';
import { AccountDashboardProgramCard } from './AccountDashboardProgramCard';
import { AccountDashboardRewardCard } from './AccountDashboardRewardCard';
import logo from 'figma:asset/e702c84c8fb5f6b4af748ca13cfa0b042a4e70cc.png';
import { toast } from 'sonner@2.0.3';

interface UserProgram {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  duration: string;
  sessions: string;
  time: string;
  progress: number;
  status: 'not-started' | 'in-progress' | 'complete';
}

interface AccountDashboardPageDesktopProps {
  userName: string;
  userEmail?: string;
  userImage?: string | null;
  programsComplete: number;
  sessionsComplete: number;
  userPrograms: UserProgram[];
  purchaseHistory?: Array<{
    programTitle: string;
    date: string;
    price: number;
  }>;
  rewardsData?: {
    completedPrograms: number;
    rewards: Record<string, { claimed: boolean; code?: string; used: boolean }>;
  };
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  onNavigate: (page: 'home' | 'programs' | 'account' | 'trainingPrograms') => void;
  onProgramAction: (programId: string) => void;
  onLogout?: () => void;
  onImageUpload?: (file: File) => void;
  onImageRemove?: () => void;
  onProfileUpdate?: (firstName: string, lastName: string, email: string) => void;
  onPasswordUpdate?: (currentPassword: string, newPassword: string) => void;
  onClaimReward?: (rewardId: string) => void;
}

export function AccountDashboardPageDesktop({
  userName,
  userEmail,
  userImage,
  programsComplete,
  sessionsComplete,
  userPrograms,
  purchaseHistory = [],
  rewardsData,
  isMenuOpen,
  setIsMenuOpen,
  onNavigate,
  onProgramAction,
  onLogout,
  onImageUpload,
  onImageRemove,
  onProfileUpdate,
  onPasswordUpdate,
  onClaimReward
}: AccountDashboardPageDesktopProps) {
  // Add console logging for debugging
  console.log('AccountDashboardPageDesktop render:', { 
    userName, 
    userEmail, 
    userProgramsLength: userPrograms?.length,
    rewardsData: rewardsData ? 'exists' : 'undefined'
  });

  // Safety checks with extra validation
  const safeUserName = (userName && typeof userName === 'string') ? userName : 'User';
  const safeUserEmail = (userEmail && typeof userEmail === 'string') ? userEmail : '';
  const safeUserPrograms = Array.isArray(userPrograms) ? userPrograms : [];
  const safePurchaseHistory = Array.isArray(purchaseHistory) ? purchaseHistory : [];
  const safeRewardsData = (rewardsData && typeof rewardsData === 'object') 
    ? { 
        completedPrograms: rewardsData.completedPrograms || 0, 
        rewards: rewardsData.rewards || {} 
      }
    : { completedPrograms: 0, rewards: {} };
  
  const [scrollY, setScrollY] = useState(0);
  const [logoOpacity, setLogoOpacity] = useState(1);
  const [activeTab, setActiveTab] = useState<'programs' | 'rewards' | 'settings'>('programs');
  
  // Extract first and last names from userName with safety
  const nameParts = safeUserName.split(' ');
  const initialFirstName = nameParts[0] || '';
  const initialLastName = nameParts.slice(1).join(' ') || '';
  
  // Settings form state
  const [formData, setFormData] = useState({
    firstName: initialFirstName,
    lastName: initialLastName,
    email: safeUserEmail,
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  
  // File input ref for image upload
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync form data when props change - with dependency tracking
  useEffect(() => {
    console.log('Syncing form data, userName:', userName, 'userEmail:', userEmail);
    const parts = safeUserName.split(' ');
    setFormData(prev => {
      const newData = {
        ...prev,
        firstName: parts[0] || '',
        lastName: parts.slice(1).join(' ') || '',
        email: safeUserEmail
      };
      // Only update if actually changed
      if (prev.firstName === newData.firstName && 
          prev.lastName === newData.lastName && 
          prev.email === newData.email) {
        return prev;
      }
      return newData;
    });
  }, [userName, userEmail]); // Use original props, not derived values

  // Reward tiers
  const rewardTiers = [
    { id: 'reward-2-programs', discount: '10% off', requiredPrograms: 2, discountPercentage: 10 },
    { id: 'reward-5-programs', discount: '25% off', requiredPrograms: 5, discountPercentage: 25 },
    { id: 'reward-9-programs', discount: '50% off', requiredPrograms: 9, discountPercentage: 50 },
    { id: 'reward-10-programs', discount: '100% off', requiredPrograms: 10, discountPercentage: 100 }
  ];

  // Calculate rewards status
  const rewards = rewardTiers.map(tier => {
    const completedPrograms = safeRewardsData.completedPrograms || 0;
    const rewardInfo = safeRewardsData.rewards[tier.id];
    
    let status: 'received' | 'claim' | 'locked';
    let requirementText: string;
    
    if (rewardInfo?.claimed) {
      status = 'received';
      requirementText = `You've unlocked this ${tier.discount} discount!`;
    } else if (completedPrograms >= tier.requiredPrograms) {
      status = 'claim';
      requirementText = `You've completed ${tier.requiredPrograms}+ programs. Click to claim!`;
    } else {
      status = 'locked';
      const remaining = tier.requiredPrograms - completedPrograms;
      requirementText = `Complete ${remaining} more ${remaining === 1 ? 'program' : 'programs'} to unlock this reward`;
    }
    
    return {
      ...tier,
      status,
      requirementText,
      discountCode: rewardInfo?.code
    };
  });

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Handle scroll for logo opacity
  useEffect(() => {
    let lastScrollY = 0;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setLogoOpacity(0);
      } else if (currentScrollY < lastScrollY && currentScrollY < 200) {
        setLogoOpacity(1);
      }
      
      setScrollY(currentScrollY);
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleImageChange = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onImageUpload) {
      try {
        onImageUpload(file);
      } catch (error) {
        console.error('Error uploading image:', error);
        toast.error('Failed to upload image');
      }
    }
  };

  const handleImageRemove = () => {
    if (onImageRemove) {
      try {
        onImageRemove();
      } catch (error) {
        console.error('Error removing image:', error);
        toast.error('Failed to remove image');
      }
    }
  };

  const handleProfileSave = async () => {
    if (!onProfileUpdate) return;
    
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    try {
      await onProfileUpdate(formData.firstName, formData.lastName, formData.email);
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile');
    }
  };

  const handlePasswordUpdate = async () => {
    if (!onPasswordUpdate) return;
    
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmNewPassword) {
      toast.error('Please fill in all password fields');
      return;
    }

    if (formData.newPassword !== formData.confirmNewPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (formData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    try {
      await onPasswordUpdate(formData.currentPassword, formData.newPassword);
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      }));
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error('Failed to update password');
    }
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-12 py-8 flex items-center justify-between">
        <button 
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            onNavigate('home');
          }}
          className="cursor-pointer"
        >
          <img
            src={logo}
            alt="Program King Logo"
            className="h-3.5 transition-opacity duration-300"
            style={{ opacity: logoOpacity }}
          />
        </button>
        <button onClick={() => setIsMenuOpen(true)} className="text-[#D4AF37] p-2 ml-auto">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="4" y1="9" x2="20" y2="9" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
            <line x1="4" y1="15" x2="20" y2="15" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
          </svg>
        </button>
      </header>

      {/* Account Dashboard Title */}
      <div className="fixed top-0 left-0 z-50 px-12 pointer-events-none" style={{ paddingTop: 'calc(2rem + 14px + 3rem)' }}>
        <p 
          className="text-left tracking-[0.3em] text-[rgb(204,204,204)] font-[DM_Sans] transition-opacity duration-300"
          style={{ 
            fontSize: '11px',
            textShadow: '0 1px 4px rgba(0, 0, 0, 0.5)',
            opacity: logoOpacity
          }}
        >
          ACCOUNT DASHBOARD
        </p>
        {onLogout && (
          <button
            onClick={onLogout}
            className="text-left tracking-[0.3em] text-[rgb(204,204,204)] font-[DM_Sans] transition-opacity duration-300 hover:text-[#D4AF37] transition-colors mt-1 pointer-events-auto"
            style={{ 
              fontSize: '8px',
              textShadow: '0 1px 4px rgba(0, 0, 0, 0.5)',
              opacity: logoOpacity
            }}
          >
            LOG OUT
          </button>
        )}
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden" style={{ height: '75vh', minHeight: '600px' }}>
        {userImage && (
          <div 
            className="absolute inset-0"
            style={{ transform: `translateY(${scrollY * 0.5}px)` }}
          >
            <img 
              src={userImage} 
              alt="User profile" 
              className="w-full h-full object-cover"
              style={{ objectPosition: 'center center' }}
            />
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black pointer-events-none" />

        <div 
          className="relative h-full flex flex-col justify-end px-12 items-start"
          style={{ 
            transform: `translateY(${scrollY * 0.2}px)`,
            paddingBottom: '80px'
          }}
        >
          <h1 
            className="mb-6 leading-tight font-[DM_Sans] font-light"
            style={{ 
              fontSize: '48px',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)' 
            }}
          >
            {safeUserName}
          </h1>
          
          <div className="flex gap-12">
            <div>
              <p 
                className="text-gray-400 font-[DM_Sans] font-extralight mb-1"
                style={{ 
                  fontSize: '11px',
                  textShadow: '0 1px 4px rgba(0, 0, 0, 0.5)',
                  letterSpacing: '0.05em'
                }}
              >
                PROGRAMS COMPLETE
              </p>
              <p 
                className="text-[#D4AF37] font-[DM_Sans]"
                style={{ 
                  fontSize: '28px',
                  fontWeight: 300,
                  textShadow: '0 1px 4px rgba(0, 0, 0, 0.5)'
                }}
              >
                {programsComplete}
              </p>
            </div>
            <div>
              <p 
                className="text-gray-400 font-[DM_Sans] font-extralight mb-1"
                style={{ 
                  fontSize: '11px',
                  textShadow: '0 1px 4px rgba(0, 0, 0, 0.5)',
                  letterSpacing: '0.05em'
                }}
              >
                SESSIONS COMPLETE
              </p>
              <p 
                className="text-[#D4AF37] font-[DM_Sans]"
                style={{ 
                  fontSize: '28px',
                  fontWeight: 300,
                  textShadow: '0 1px 4px rgba(0, 0, 0, 0.5)'
                }}
              >
                {sessionsComplete}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="px-[64px] py-16">
        {/* Tab Navigation */}
        <div className="flex gap-8 mb-12">
          <button
            onClick={() => setActiveTab('programs')}
            className={`font-[DM_Sans] transition-colors duration-300 ${
              activeTab === 'programs' ? 'text-[#D4AF37]' : 'text-gray-500'
            }`}
            style={{
              fontSize: '11px',
              letterSpacing: '0.1em',
              fontWeight: 500
            }}
          >
            PROGRAMS
          </button>
          <button
            onClick={() => setActiveTab('rewards')}
            className={`font-[DM_Sans] transition-colors duration-300 ${
              activeTab === 'rewards' ? 'text-[#D4AF37]' : 'text-gray-500'
            }`}
            style={{
              fontSize: '11px',
              letterSpacing: '0.1em',
              fontWeight: 500
            }}
          >
            REWARDS
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`font-[DM_Sans] transition-colors duration-300 ${
              activeTab === 'settings' ? 'text-[#D4AF37]' : 'text-gray-500'
            }`}
            style={{
              fontSize: '11px',
              letterSpacing: '0.1em',
              fontWeight: 500
            }}
          >
            SETTINGS
          </button>
        </div>

        {/* Programs Tab */}
        {activeTab === 'programs' && (
          <div className="grid grid-cols-2 gap-6 max-w-7xl mx-auto pb-20">
            {safeUserPrograms.map((program) => (
              <AccountDashboardProgramCard
                key={program.id}
                {...program}
                onAction={() => onProgramAction(program.id)}
              />
            ))}
          </div>
        )}

        {/* Rewards Tab */}
        {activeTab === 'rewards' && (
          <div className="grid grid-cols-2 gap-6 max-w-7xl mx-auto pb-20">
            {rewards.map((reward) => (
              <AccountDashboardRewardCard
                key={reward.id}
                rewardId={reward.id}
                discount={reward.discount}
                status={reward.status}
                requirementText={reward.requirementText}
                discountCode={reward.discountCode}
                onClaim={onClaimReward}
              />
            ))}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="max-w-4xl mx-auto pb-20">
            {/* Profile Information Section */}
            <div className="mb-12">
              <h2 className="text-[#D4AF37] font-[DM_Sans] tracking-[0.2em] mb-6" style={{ fontSize: '12px', fontWeight: 500 }}>
                PROFILE INFORMATION
              </h2>
              
              {/* Profile Image */}
              <div className="mb-8">
                <label className="block text-gray-400 font-[DM_Sans] mb-3" style={{ fontSize: '11px', letterSpacing: '0.05em' }}>
                  PROFILE IMAGE
                </label>
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#D4AF37]/20 to-black border border-[#D4AF37]/30 flex items-center justify-center overflow-hidden">
                    {userImage ? (
                      <img 
                        src={userImage} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full" />
                    )}
                  </div>
                  <div className="flex gap-3">
                    <input 
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      accept="image/*"
                      className="hidden"
                    />
                    <button 
                      onClick={handleImageChange} 
                      className="px-6 py-2.5 bg-[#D4AF37]/10 border border-[#D4AF37] text-[#D4AF37] font-[DM_Sans] hover:bg-[#D4AF37]/20 transition-colors rounded-[10px]" 
                      style={{ fontSize: '10px', letterSpacing: '0.1em' }}
                    >
                      CHANGE IMAGE
                    </button>
                    <button 
                      onClick={handleImageRemove} 
                      className="px-6 py-2.5 bg-transparent border border-gray-600 text-gray-400 font-[DM_Sans] hover:border-gray-500 hover:text-gray-300 transition-colors rounded-[10px]" 
                      style={{ fontSize: '10px', letterSpacing: '0.1em' }}
                    >
                      REMOVE
                    </button>
                  </div>
                </div>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-gray-400 font-[DM_Sans] mb-3" style={{ fontSize: '11px', letterSpacing: '0.05em' }}>
                    FIRST NAME
                  </label>
                  <input 
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleFormChange('firstName', e.target.value)}
                    className="w-full bg-black/40 border border-gray-700 px-4 py-3 text-white font-[DM_Sans] focus:border-[#D4AF37] focus:outline-none transition-colors rounded-[10px]"
                    style={{ fontSize: '14px' }}
                  />
                </div>
                <div>
                  <label className="block text-gray-400 font-[DM_Sans] mb-3" style={{ fontSize: '11px', letterSpacing: '0.05em' }}>
                    LAST NAME
                  </label>
                  <input 
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleFormChange('lastName', e.target.value)}
                    className="w-full bg-black/40 border border-gray-700 px-4 py-3 text-white font-[DM_Sans] focus:border-[#D4AF37] focus:outline-none transition-colors rounded-[10px]"
                    style={{ fontSize: '14px' }}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="mb-6">
                <label className="block text-gray-400 font-[DM_Sans] mb-3" style={{ fontSize: '11px', letterSpacing: '0.05em' }}>
                  EMAIL ADDRESS
                </label>
                <input 
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleFormChange('email', e.target.value)}
                  className="w-full bg-black/40 border border-gray-700 px-4 py-3 text-white font-[DM_Sans] focus:border-[#D4AF37] focus:outline-none transition-colors rounded-[10px]"
                  style={{ fontSize: '14px' }}
                />
              </div>

              <button 
                onClick={handleProfileSave} 
                className="px-8 py-3 bg-[#D4AF37] text-black font-[DM_Sans] hover:bg-[#D4AF37]/90 transition-colors rounded-[10px]" 
                style={{ fontSize: '11px', letterSpacing: '0.1em', fontWeight: 600 }}
              >
                SAVE CHANGES
              </button>
            </div>

            {/* Security Section */}
            <div className="mb-12 pt-12 border-t border-gray-800">
              <h2 className="text-[#D4AF37] font-[DM_Sans] tracking-[0.2em] mb-6" style={{ fontSize: '12px', fontWeight: 500 }}>
                SECURITY
              </h2>
              
              <div className="mb-6">
                <label className="block text-gray-400 font-[DM_Sans] mb-3" style={{ fontSize: '11px', letterSpacing: '0.05em' }}>
                  CURRENT PASSWORD
                </label>
                <input 
                  type="password"
                  value={formData.currentPassword}
                  onChange={(e) => handleFormChange('currentPassword', e.target.value)}
                  className="w-full bg-black/40 border border-gray-700 px-4 py-3 text-white font-[DM_Sans] focus:border-[#D4AF37] focus:outline-none transition-colors placeholder:text-gray-600 rounded-[10px]"
                  style={{ fontSize: '14px' }}
                />
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-gray-400 font-[DM_Sans] mb-3" style={{ fontSize: '11px', letterSpacing: '0.05em' }}>
                    NEW PASSWORD
                  </label>
                  <input 
                    type="password"
                    value={formData.newPassword}
                    onChange={(e) => handleFormChange('newPassword', e.target.value)}
                    className="w-full bg-black/40 border border-gray-700 px-4 py-3 text-white font-[DM_Sans] focus:border-[#D4AF37] focus:outline-none transition-colors placeholder:text-gray-600 rounded-[10px]"
                    style={{ fontSize: '14px' }}
                  />
                </div>
                <div>
                  <label className="block text-gray-400 font-[DM_Sans] mb-3" style={{ fontSize: '11px', letterSpacing: '0.05em' }}>
                    CONFIRM NEW PASSWORD
                  </label>
                  <input 
                    type="password"
                    value={formData.confirmNewPassword}
                    onChange={(e) => handleFormChange('confirmNewPassword', e.target.value)}
                    className="w-full bg-black/40 border border-gray-700 px-4 py-3 text-white font-[DM_Sans] focus:border-[#D4AF37] focus:outline-none transition-colors placeholder:text-gray-600 rounded-[10px]"
                    style={{ fontSize: '14px' }}
                  />
                </div>
              </div>

              <button 
                onClick={handlePasswordUpdate} 
                className="px-8 py-3 bg-[#D4AF37] text-black font-[DM_Sans] hover:bg-[#D4AF37]/90 transition-colors rounded-[10px]" 
                style={{ fontSize: '11px', letterSpacing: '0.1em', fontWeight: 600 }}
              >
                UPDATE PASSWORD
              </button>
            </div>

            {/* Purchase History Section */}
            <div className="mb-12 pt-12 border-t border-gray-800">
              <h2 className="text-[#D4AF37] font-[DM_Sans] tracking-[0.2em] mb-6" style={{ fontSize: '12px', fontWeight: 500 }}>
                PURCHASE HISTORY
              </h2>
              
              <div className="space-y-4">
                {safePurchaseHistory && safePurchaseHistory.length > 0 ? (
                  safePurchaseHistory.map((purchase, index) => (
                    <div key={index} className="bg-black/40 border border-gray-800 p-6 flex items-center justify-between hover:border-gray-700 transition-colors rounded-[10px]">
                      <div className="flex-1">
                        <p className="text-white font-[DM_Sans] mb-1" style={{ fontSize: '14px', fontWeight: 500 }}>
                          {purchase.programTitle}
                        </p>
                        <p className="text-gray-500 font-[DM_Sans]" style={{ fontSize: '11px' }}>
                          Purchased on {purchase.date}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <p className="text-[#D4AF37] font-[DM_Sans]" style={{ fontSize: '16px', fontWeight: 500 }}>
                          £{purchase.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 font-[DM_Sans] text-center py-8" style={{ fontSize: '14px' }}>
                    No purchase history available
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}