import { useEffect } from 'react';
import logo from 'figma:asset/e702c84c8fb5f6b4af748ca13cfa0b042a4e70cc.png';

interface NavigationMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: 'home' | 'programs' | 'trainingPrograms' | 'account' | 'admin') => void;
  isSignedIn?: boolean;
  isAdmin?: boolean;
}

export function NavigationMenu({ isOpen, onClose, onNavigate, isSignedIn = false, isAdmin = false }: NavigationMenuProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const menuItems = [
    { label: 'Home', page: 'home' as const },
    { label: 'Training Programs', page: 'trainingPrograms' as const },
    { label: isSignedIn ? 'Account' : 'Login', page: 'account' as const },
    { label: isAdmin ? 'Admin' : '', page: 'admin' as const },
  ];

  const handleNavigation = (page: typeof menuItems[number]['page']) => {
    onNavigate(page);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[60] animate-fadeIn"
        onClick={onClose}
      />
      
      {/* Menu Panel */}
      <div className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-[#0A0A0A] z-[70] animate-slideInRight shadow-2xl border-l border-[#D4AF37]/20">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-white/10">
          <img
            src={logo}
            alt="Program King Logo"
            className="h-2.5"
          />
          <button 
            onClick={onClose}
            className="text-[#D4AF37] p-2 hover:bg-white/5 rounded transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col p-6 gap-1">
          {menuItems
            .filter(item => item.label !== '') // Filter out empty labels (admin when not admin)
            .map((item, index) => (
            <button
              key={item.page}
              onClick={() => handleNavigation(item.page)}
              className="text-left py-4 px-4 text-white hover:text-[#D4AF37] transition-all duration-300 border-b border-white/5 hover:bg-white/5 rounded font-[DM_Sans] group"
              style={{
                animationDelay: `${index * 50}ms`,
              }}
            >
              <span className="flex items-center justify-between">
                <span className="text-sm tracking-wider font-extralight text-[12px] font-normal">{item.label}</span>
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 16 16" 
                  fill="none" 
                  className="opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-300"
                >
                  <path 
                    d="M6 3L11 8L6 13" 
                    stroke="currentColor" 
                    strokeWidth="1.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/10">
          <p className="text-[10px] tracking-[0.2em] text-white/40 font-[DM_Sans]">
            PROGRAMKING
          </p>
          <p className="text-[9px] text-white/30 font-[DM_Sans] mt-1">
            Performance Driven Training Systems
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideInRight {
          from { 
            transform: translateX(100%);
            opacity: 0;
          }
          to { 
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-slideInRight {
          animation: slideInRight 0.3s ease-out;
        }
      `}</style>
    </>
  );
}