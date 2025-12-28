import { useState, useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';
import logo from 'figma:asset/e702c84c8fb5f6b4af748ca13cfa0b042a4e70cc.png';

interface CartItem {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  image: string;
}

interface CheckoutPageMobileProps {
  cartItems: CartItem[];
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  onNavigate: (page: 'home' | 'programs' | 'account' | 'trainingPrograms') => void;
  onRemoveItem: (programId: string) => void;
  onShowPaymentModal: () => void;
}

export function CheckoutPageMobile({
  cartItems,
  isMenuOpen,
  setIsMenuOpen,
  onNavigate,
  onRemoveItem,
  onShowPaymentModal
}: CheckoutPageMobileProps) {
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

  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
  const tax = subtotal * 0.2; // 20% VAT
  const total = subtotal + tax;

  const handleCheckout = () => {
    if (cartItems.length > 0) {
      onShowPaymentModal();
    }
  };

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
        <h1 
          className="mb-8 font-[DM_Sans] text-white"
          style={{
            fontSize: '30px',
            fontWeight: 300,
            letterSpacing: '-0.01em',
            lineHeight: '1.1'
          }}
        >
          Shopping Cart
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <p 
              className="font-[DM_Sans] text-gray-400 mb-6"
              style={{
                fontSize: '14px',
                letterSpacing: '0.01em'
              }}
            >
              Your cart is empty
            </p>
            <button
              onClick={() => onNavigate('trainingPrograms')}
              className="px-6 py-3 bg-[#D4AF37] text-[#FFFFFF] rounded-full font-[DM_Sans] hover:bg-[#E5C158] transition-all"
              style={{
                fontSize: '11px',
                letterSpacing: '0.1em',
                fontWeight: 500
              }}
            >
              BROWSE PROGRAMS
            </button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 bg-zinc-900 rounded-lg border border-zinc-800"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3
                      className="font-[DM_Sans] text-white mb-1"
                      style={{
                        fontSize: '16px',
                        letterSpacing: '0.02em'
                      }}
                    >
                      {item.title}
                    </h3>
                    <p
                      className="font-[DM_Sans] text-gray-400 mb-2 line-clamp-1"
                      style={{
                        fontSize: '11px',
                        letterSpacing: '0.01em'
                      }}
                    >
                      {item.subtitle.replace(/\\n/g, ' ')}
                    </p>
                    <p
                      className="font-[DM_Sans] text-[#D4AF37]"
                      style={{
                        fontSize: '14px',
                        fontWeight: 500
                      }}
                    >
                      £{item.price.toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="text-gray-500 hover:text-red-500 transition-colors p-2 flex-shrink-0"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>

            {/* Summary Card */}
            <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-5 mb-6">
              <h2
                className="font-[DM_Sans] text-white mb-4"
                style={{
                  fontSize: '16px',
                  letterSpacing: '0.02em'
                }}
              >
                Summary
              </h2>

              <div className="space-y-3 mb-4">
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
                <div className="border-t border-zinc-700 pt-3">
                  <div className="flex justify-between">
                    <span
                      className="font-[DM_Sans] text-white"
                      style={{
                        fontSize: '16px',
                        fontWeight: 500
                      }}
                    >
                      Total
                    </span>
                    <span
                      className="font-[DM_Sans] text-[#D4AF37]"
                      style={{
                        fontSize: '16px',
                        fontWeight: 500
                      }}
                    >
                      £{total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleCheckout}
                className="w-full px-6 py-3 bg-[#D4AF37] text-[#FFFFFF] rounded-full font-[DM_Sans] hover:bg-[#E5C158] transition-all"
                style={{
                  fontSize: '11px',
                  letterSpacing: '0.1em',
                  fontWeight: 500,
                  boxShadow: '0 4px 16px rgba(212, 175, 55, 0.3)'
                }}
              >
                PROCEED TO CHECKOUT
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
          </>
        )}
      </div>
    </div>
  );
}