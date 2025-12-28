import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import logo from 'figma:asset/e702c84c8fb5f6b4af748ca13cfa0b042a4e70cc.png';

interface OrderItem {
  id: string;
  title: string;
  subtitle: string;
  price: number;
}

interface OrderConfirmationMobileProps {
  orderNumber: string;
  orderItems: OrderItem[];
  userFirstName: string;
  userLastName: string;
  userEmail: string;
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  onNavigate: (page: 'home' | 'programs' | 'account' | 'trainingPrograms') => void;
}

export function OrderConfirmationMobile({
  orderNumber,
  orderItems,
  userFirstName,
  userLastName,
  userEmail,
  isMenuOpen,
  setIsMenuOpen,
  onNavigate
}: OrderConfirmationMobileProps) {
  const [logoOpacity, setLogoOpacity] = useState(1);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
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

  const subtotal = orderItems.reduce((sum, item) => sum + item.price, 0);
  const tax = subtotal * 0.2; // 20% VAT
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 py-6 flex items-center justify-between bg-black">
        <button 
          onClick={() => {
            onNavigate('home');
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
        <button onClick={() => setIsMenuOpen(true)} className="text-[#D4AF37] p-2 ml-auto">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="4" y1="9" x2="20" y2="9" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
            <line x1="4" y1="15" x2="20" y2="15" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
          </svg>
        </button>
      </header>

      {/* Main Content */}
      <div className="pt-24 pb-32 px-5">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div 
            className="w-16 h-16 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center"
            style={{ boxShadow: '0 0 30px rgba(34, 197, 94, 0.3)' }}
          >
            <Check size={32} className="text-green-500" />
          </div>
        </div>

        {/* Title */}
        <h1 
          className="text-center mb-3 font-[DM_Sans] text-white"
          style={{
            fontSize: '32px',
            fontWeight: 200,
            letterSpacing: '-0.01em',
            lineHeight: '1.1'
          }}
        >
          Order Confirmed
        </h1>

        <p
          className="text-center font-[DM_Sans] text-gray-400 mb-8"
          style={{
            fontSize: '14px',
            letterSpacing: '0.01em'
          }}
        >
          Thank you for your purchase! Your programs are now available in your account.
        </p>

        {/* Order Details Card */}
        <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-5 mb-6">
          {/* Order Number */}
          <div className="mb-5 pb-5 border-b border-zinc-700">
            <p
              className="font-[DM_Sans] text-gray-400 mb-1"
              style={{ fontSize: '10px', letterSpacing: '0.05em' }}
            >
              ORDER NUMBER
            </p>
            <p
              className="font-[DM_Sans] text-[#D4AF37]"
              style={{ fontSize: '18px', letterSpacing: '0.1em', fontWeight: 500 }}
            >
              {orderNumber}
            </p>
          </div>

          {/* Customer Information */}
          <div className="mb-5 pb-5 border-b border-zinc-700">
            <p
              className="font-[DM_Sans] text-gray-400 mb-3"
              style={{ fontSize: '10px', letterSpacing: '0.05em' }}
            >
              CUSTOMER DETAILS
            </p>
            <div className="space-y-1">
              <p
                className="font-[DM_Sans] text-white"
                style={{ fontSize: '14px' }}
              >
                {userFirstName} {userLastName}
              </p>
              <p
                className="font-[DM_Sans] text-gray-400"
                style={{ fontSize: '12px' }}
              >
                {userEmail}
              </p>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-5">
            <p
              className="font-[DM_Sans] text-gray-400 mb-3"
              style={{ fontSize: '10px', letterSpacing: '0.05em' }}
            >
              ORDER SUMMARY
            </p>
            <div className="space-y-3">
              {orderItems.map((item) => (
                <div key={item.id} className="flex justify-between items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <p
                      className="font-[DM_Sans] text-white mb-1"
                      style={{ fontSize: '14px' }}
                    >
                      {item.title}
                    </p>
                    <p
                      className="font-[DM_Sans] text-gray-500 line-clamp-1"
                      style={{ fontSize: '10px' }}
                    >
                      {item.subtitle.replace(/\\n/g, ' ')}
                    </p>
                  </div>
                  <p
                    className="font-[DM_Sans] text-white flex-shrink-0"
                    style={{ fontSize: '14px' }}
                  >
                    £{item.price.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="border-t border-zinc-700 pt-3 space-y-2">
            <div className="flex justify-between">
              <span
                className="font-[DM_Sans] text-gray-400"
                style={{ fontSize: '12px' }}
              >
                Subtotal
              </span>
              <span
                className="font-[DM_Sans] text-white"
                style={{ fontSize: '12px' }}
              >
                £{subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span
                className="font-[DM_Sans] text-gray-400"
                style={{ fontSize: '12px' }}
              >
                VAT (20%)
              </span>
              <span
                className="font-[DM_Sans] text-white"
                style={{ fontSize: '12px' }}
              >
                £{tax.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-zinc-700">
              <span
                className="font-[DM_Sans] text-white"
                style={{ fontSize: '16px', fontWeight: 500 }}
              >
                Total
              </span>
              <span
                className="font-[DM_Sans] text-[#D4AF37]"
                style={{ fontSize: '16px', fontWeight: 500 }}
              >
                £{total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => onNavigate('account')}
            className="w-full px-6 py-3 bg-[#D4AF37] text-[#FFFFFF] rounded-full font-[DM_Sans] hover:bg-[#E5C158] transition-all"
            style={{
              fontSize: '11px',
              letterSpacing: '0.1em',
              fontWeight: 500,
              boxShadow: '0 4px 16px rgba(212, 175, 55, 0.3)'
            }}
          >
            VIEW MY PROGRAMS
          </button>
          <button
            onClick={() => onNavigate('trainingPrograms')}
            className="w-full px-6 py-3 border border-zinc-700 text-white rounded-full font-[DM_Sans] hover:border-zinc-600 transition-all"
            style={{
              fontSize: '11px',
              letterSpacing: '0.1em',
              fontWeight: 500
            }}
          >
            CONTINUE SHOPPING
          </button>
        </div>
      </div>
    </div>
  );
}
