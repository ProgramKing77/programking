import { useState, useEffect } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface PaymentModalProps {
  programId: string;
  programTitle: string;
  programSubtitle: string;
  programPrice: number;
  onCompletePurchase: (programId: string) => void;
  onCancel: () => void;
  userId?: string;
}

// Load Stripe.js
const loadStripe = async () => {
  if ((window as any).Stripe) {
    return (window as any).Stripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_YOUR_KEY');
  }
  
  // Load script if not already loaded
  return new Promise<any>((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/';
    script.onload = () => {
      resolve((window as any).Stripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_YOUR_KEY'));
    };
    document.body.appendChild(script);
  });
};

export function PaymentModal({ 
  programId, 
  programTitle, 
  programSubtitle, 
  programPrice, 
  onCompletePurchase, 
  onCancel,
  userId 
}: PaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [error, setError] = useState('');

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const formatCardNumber = (value: string) => {
    const numbers = value.replace(/\s/g, '');
    const formatted = numbers.match(/.{1,4}/g)?.join(' ') || numbers;
    return formatted.substring(0, 19); // Max 16 digits + 3 spaces
  };

  const formatExpiryDate = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length >= 2) {
      return numbers.substring(0, 2) + '/' + numbers.substring(2, 4);
    }
    return numbers;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError('');

    try {
      // Convert price to pence (smallest currency unit)
      const amountInPence = Math.round(programPrice * 100);

      // Create payment intent on backend
      const intentResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-b0ab3817/payment/create-intent`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({
            amount: amountInPence,
            currency: 'gbp',
            metadata: {
              programId,
              programTitle,
              userId: userId || 'guest'
            }
          })
        }
      );

      if (!intentResponse.ok) {
        const errorData = await intentResponse.json();
        throw new Error(errorData.error || 'Failed to create payment intent');
      }

      const { clientSecret, paymentIntentId } = await intentResponse.json();

      // Load Stripe
      const stripe = await loadStripe();

      // Parse expiry date
      const [expMonth, expYear] = expiryDate.split('/');

      // Create payment method and confirm payment
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: {
            number: cardNumber.replace(/\s/g, ''),
            exp_month: parseInt(expMonth),
            exp_year: parseInt(`20${expYear}`),
            cvc: cvv,
          },
          billing_details: {
            name: cardholderName,
          },
        },
      });

      if (stripeError) {
        throw new Error(stripeError.message || 'Payment failed');
      }

      if (paymentIntent.status === 'succeeded') {
        setIsProcessing(false);
        setShowSuccess(true);

        // Complete purchase after showing success message
        setTimeout(() => {
          onCompletePurchase(programId);
        }, 2000);
      } else {
        throw new Error('Payment was not successful');
      }

    } catch (err: any) {
      console.error('Payment error:', err);
      setError(err.message || 'Payment failed. Please try again.');
      setIsProcessing(false);
    }
  };

  const isFormValid = cardNumber.replace(/\s/g, '').length === 16 && 
                      expiryDate.length === 5 && 
                      cvv.length === 3 && 
                      cardholderName.trim().length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-5 py-8 font-['DM_Sans']">
      {/* Backdrop - Dark transparent with blur */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-md"
        onClick={!isProcessing ? onCancel : undefined}
      />

      {/* Success Overlay */}
      {showSuccess && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/90 backdrop-blur-sm">
          <div className="text-center px-6">
            <div className="w-16 h-16 mx-auto mb-5 rounded-full border-2 border-[#D4AF37] flex items-center justify-center">
              <svg className="w-8 h-8 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-[#D4AF37] tracking-[0.15em] mb-2" style={{ fontSize: '16px' }}>PAYMENT SUCCESSFUL</h2>
            <p className="text-[#CCCCCC] tracking-wide" style={{ fontSize: '11px' }}>Programme added to your library</p>
          </div>
        </div>
      )}

      {/* Modal Content - Scaled down 20% */}
      <div className="relative z-10 w-full max-w-[320px] max-h-[85vh] overflow-y-auto scrollbar-hide">
        {/* Close Button */}
        <button
          onClick={onCancel}
          disabled={isProcessing}
          className="absolute -top-1.5 -right-1.5 w-8 h-8 rounded-full bg-black/80 border border-[#D4AF37]/40 backdrop-blur-sm flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all duration-300 disabled:opacity-40"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="space-y-4">
          {/* Programme Details Card */}
          <div 
            className="bg-black/60 backdrop-blur-md border border-[#D4AF37]/30 rounded-lg p-5"
            style={{ boxShadow: '0 4px 20px rgba(212, 175, 55, 0.1)' }}
          >
            <p className="text-[#D4AF37] tracking-[0.15em] mb-1.5" style={{ fontSize: '9px' }}>PROGRAMME</p>
            <h3 className="text-white mb-1" style={{ fontSize: '13px', letterSpacing: '0.02em', lineHeight: '1.3' }}>{programTitle}</h3>
            <p className="text-[#AAAAAA] mb-3" style={{ fontSize: '9px', letterSpacing: '0.05em' }}>{programSubtitle}</p>
            <div className="flex justify-between items-center pt-3 border-t border-[#D4AF37]/20">
              <span className="text-[#CCCCCC] tracking-[0.1em]" style={{ fontSize: '9px' }}>TOTAL</span>
              <span className="text-[#D4AF37]" style={{ fontSize: '15px', letterSpacing: '0.05em' }}>£{programPrice.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div 
              className="bg-black/60 backdrop-blur-md border border-[#D4AF37]/30 rounded-lg p-5"
              style={{ boxShadow: '0 4px 20px rgba(212, 175, 55, 0.1)' }}
            >
              <p className="text-[#D4AF37] tracking-[0.15em] mb-4" style={{ fontSize: '9px' }}>PAYMENT DETAILS</p>
              
              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <p className="text-red-400 text-xs">{error}</p>
                </div>
              )}

              {/* Card Number */}
              <div className="mb-3">
                <label className="block text-[#CCCCCC] mb-1.5 tracking-[0.1em]" style={{ fontSize: '9px' }}>
                  CARD NUMBER
                </label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  placeholder="1234 5678 9012 3456"
                  className="w-full bg-black/40 border border-[#D4AF37]/20 rounded px-3 py-2 text-white placeholder-[#666666] focus:border-[#D4AF37] focus:outline-none transition-colors"
                  style={{ fontSize: '11px' }}
                  disabled={isProcessing}
                />
              </div>

              {/* Expiry and CVV */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-[#CCCCCC] mb-1.5 tracking-[0.1em]" style={{ fontSize: '9px' }}>
                    EXPIRY DATE
                  </label>
                  <input
                    type="text"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                    placeholder="MM/YY"
                    className="w-full bg-black/40 border border-[#D4AF37]/20 rounded px-3 py-2 text-white placeholder-[#666666] focus:border-[#D4AF37] focus:outline-none transition-colors"
                    style={{ fontSize: '11px' }}
                    maxLength={5}
                    disabled={isProcessing}
                  />
                </div>
                <div>
                  <label className="block text-[#CCCCCC] mb-1.5 tracking-[0.1em]" style={{ fontSize: '9px' }}>
                    CVV
                  </label>
                  <input
                    type="text"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').substring(0, 3))}
                    placeholder="123"
                    className="w-full bg-black/40 border border-[#D4AF37]/20 rounded px-3 py-2 text-white placeholder-[#666666] focus:border-[#D4AF37] focus:outline-none transition-colors"
                    style={{ fontSize: '11px' }}
                    maxLength={3}
                    disabled={isProcessing}
                  />
                </div>
              </div>

              {/* Cardholder Name */}
              <div>
                <label className="block text-[#CCCCCC] mb-1.5 tracking-[0.1em]" style={{ fontSize: '9px' }}>
                  CARDHOLDER NAME
                </label>
                <input
                  type="text"
                  value={cardholderName}
                  onChange={(e) => setCardholderName(e.target.value)}
                  placeholder="John Smith"
                  className="w-full bg-black/40 border border-[#D4AF37]/20 rounded px-3 py-2 text-white placeholder-[#666666] focus:border-[#D4AF37] focus:outline-none transition-colors"
                  style={{ fontSize: '11px' }}
                  disabled={isProcessing}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isFormValid || isProcessing}
              className="w-full bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-black font-medium py-3 rounded-lg tracking-[0.15em] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ fontSize: '11px' }}
            >
              {isProcessing ? 'PROCESSING...' : `PAY £${programPrice.toFixed(2)}`}
            </button>

            {/* Security Notice */}
            <div className="flex items-center justify-center gap-1.5 pt-2">
              <svg className="w-3 h-3 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <p className="text-[#CCCCCC] tracking-wide" style={{ fontSize: '8px' }}>
                Secured by Stripe
              </p>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
