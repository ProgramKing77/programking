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

interface CheckoutPageDesktopProps {
  cartItems: CartItem[];
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  onNavigate: (page: 'home' | 'programs' | 'account' | 'trainingPrograms') => void;
  onRemoveItem: (programId: string) => void;
  onShowPaymentModal: () => void;
}

export function CheckoutPageDesktop({
  cartItems,
  isMenuOpen,
  setIsMenuOpen,
  onNavigate,
  onRemoveItem,
  onShowPaymentModal
}: CheckoutPageDesktopProps) {
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
      <header className="fixed top-0 left-0 right-0 z-50 px-12 py-8 flex items-center justify-between">
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
            className="h-3.5 transition-opacity duration-500"
            style={{ opacity: logoOpacity }}
          />
        </button>
        <button onClick={() => setIsMenuOpen(true)} className="text-[#D4AF37] p-2">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="6" y1="12" x2="26" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="6" y1="20" x2="26" y2="20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </header>

      {/* Main Content */}
      <div className="pt-32 pb-20 px-16 max-w-7xl mx-auto">
        <h1 
          className="mb-12 font-[DM_Sans] text-white"
          style={{
            fontSize: '24px',
            fontWeight: 300,
            letterSpacing: '-0.01em',
            lineHeight: '1.1'
          }}
        >
          Shopping Cart
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-20">
            <p 
              className="font-[DM_Sans] text-gray-400 mb-8"
              style={{
                fontSize: '18px',
                letterSpacing: '0.01em'
              }}
            >
              Your cart is empty
            </p>
            <button
              onClick={() => onNavigate('trainingPrograms')}
              className="px-8 py-3 bg-[#D4AF37] text-black rounded-full font-[DM_Sans] hover:bg-[#E5C158] transition-all"
              style={{
                fontSize: '12px',
                letterSpacing: '0.1em',
                fontWeight: 500
              }}
            >
              BROWSE PROGRAMS
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="col-span-2 space-y-6">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-6 p-6 bg-zinc-900 rounded-lg border border-zinc-800"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3
                      className="font-[DM_Sans] text-white mb-2"
                      style={{
                        fontSize: '20px',
                        letterSpacing: '0.02em'
                      }}
                    >
                      {item.title}
                    </h3>
                    <p
                      className="font-[DM_Sans] text-gray-400 mb-4"
                      style={{
                        fontSize: '14px',
                        letterSpacing: '0.01em'
                      }}
                    >
                      {item.subtitle.replace(/\\n/g, ' ')}
                    </p>
                    <p
                      className="font-[DM_Sans] text-[#D4AF37]"
                      style={{
                        fontSize: '18px',
                        fontWeight: 500
                      }}
                    >
                      £{item.price.toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="text-gray-500 hover:text-red-500 transition-colors p-2"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="col-span-1">
              <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6 sticky top-32">
                <h2
                  className="font-[DM_Sans] text-white mb-6"
                  style={{
                    fontSize: '20px',
                    letterSpacing: '0.02em'
                  }}
                >
                  Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span
                      className="font-[DM_Sans] text-gray-400"
                      style={{ fontSize: '14px' }}
                    >
                      Subtotal
                    </span>
                    <span
                      className="font-[DM_Sans] text-white"
                      style={{ fontSize: '14px' }}
                    >
                      £{subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span
                      className="font-[DM_Sans] text-gray-400"
                      style={{ fontSize: '14px' }}
                    >
                      VAT (20%)
                    </span>
                    <span
                      className="font-[DM_Sans] text-white"
                      style={{ fontSize: '14px' }}
                    >
                      £{tax.toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t border-zinc-700 pt-4">
                    <div className="flex justify-between">
                      <span
                        className="font-[DM_Sans] text-white"
                        style={{
                          fontSize: '18px',
                          fontWeight: 500
                        }}
                      >
                        Total
                      </span>
                      <span
                        className="font-[DM_Sans] text-[#D4AF37]"
                        style={{
                          fontSize: '18px',
                          fontWeight: 500
                        }}
                      >
                        £{total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full px-6 py-3 bg-[#D4AF37] text-[#FFFFFF] rounded-full font-[DM_Sans] hover:bg-[#E5C158] transition-all"
                  style={{
                    fontSize: '12px',
                    letterSpacing: '0.1em',
                    fontWeight: 500,
                    boxShadow: '0 4px 16px rgba(212, 175, 55, 0.3)'
                  }}
                >
                  PROCEED TO CHECKOUT
                </button>

                <button
                  onClick={() => onNavigate('trainingPrograms')}
                  className="w-full mt-4 px-6 py-3 border border-zinc-700 text-white rounded-full font-[DM_Sans] hover:border-zinc-600 transition-all"
                  style={{
                    fontSize: '12px',
                    letterSpacing: '0.1em',
                    fontWeight: 500
                  }}
                >
                  CONTINUE SHOPPING
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}