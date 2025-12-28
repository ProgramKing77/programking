import { useState } from 'react';
import { X, Check } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface CheckoutPaymentModalProps {
  totalAmount: number;
  itemCount: number;
  onCompletePurchase: (discountCode?: string) => void;
  onCancel: () => void;
  userId?: string;
}

export function CheckoutPaymentModal({
  totalAmount,
  itemCount,
  onCompletePurchase,
  onCancel,
  userId
}: CheckoutPaymentModalProps) {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [discountError, setDiscountError] = useState('');
  const [isValidatingCode, setIsValidatingCode] = useState(false);
  const [codeApplied, setCodeApplied] = useState(false);

  const discountedAmount = totalAmount * (1 - discountPercent / 100);

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) {
      setDiscountError('Please enter a discount code');
      return;
    }

    setIsValidatingCode(true);
    setDiscountError('');

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-b0ab3817/rewards/validate`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({
            code: discountCode.toUpperCase(),
            userId
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setDiscountError(data.error || 'Invalid discount code');
        setIsValidatingCode(false);
        return;
      }

      setDiscountPercent(data.discountPercent);
      setCodeApplied(true);
      setIsValidatingCode(false);
    } catch (error) {
      console.error('Error validating discount code:', error);
      setDiscountError('Failed to validate code. Please try again.');
      setIsValidatingCode(false);
    }
  };

  const handleRemoveDiscount = () => {
    setDiscountCode('');
    setDiscountPercent(0);
    setCodeApplied(false);
    setDiscountError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setDiscountError('');
    
    try {
      // Convert amount to pence (smallest currency unit)
      const amountInPence = Math.round(discountedAmount * 100);

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
              userId: userId || 'guest',
              itemCount: itemCount.toString()
            },
            promotionCode: codeApplied ? discountCode.toUpperCase() : undefined
          })
        }
      );

      if (!intentResponse.ok) {
        const errorData = await intentResponse.json();
        throw new Error(errorData.error || 'Failed to create payment intent');
      }

      const { clientSecret, paymentIntentId } = await intentResponse.json();

      // Load Stripe
      const loadStripe = async () => {
        if ((window as any).Stripe) {
          return (window as any).Stripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_YOUR_KEY');
        }
        
        return new Promise<any>((resolve) => {
          const script = document.createElement('script');
          script.src = 'https://js.stripe.com/v3/';
          script.onload = () => {
            resolve((window as any).Stripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_YOUR_KEY'));
          };
          document.body.appendChild(script);
        });
      };

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
            name: name,
          },
        },
      });

      if (stripeError) {
        throw new Error(stripeError.message || 'Payment failed');
      }

      if (paymentIntent.status === 'succeeded') {
        // Mark discount code as used if applicable
        if (codeApplied && userId) {
          await fetch(
            `https://${projectId}.supabase.co/functions/v1/make-server-b0ab3817/payment/mark-code-used`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${publicAnonKey}`
              },
              body: JSON.stringify({
                userId,
                promotionCode: discountCode.toUpperCase()
              })
            }
          );
        }

        setIsProcessing(false);
        onCompletePurchase(codeApplied ? discountCode.toUpperCase() : undefined);
      } else {
        throw new Error('Payment was not successful');
      }

    } catch (err: any) {
      console.error('Payment error:', err);
      setDiscountError(err.message || 'Payment failed. Please try again.');
      setIsProcessing(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const numbers = value.replace(/\s/g, '').replace(/\D/g, '');
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative bg-zinc-900 rounded-lg border border-zinc-800 w-full max-w-md p-6 md:p-8 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <h2
          className="font-[DM_Sans] text-white mb-2"
          style={{
            fontSize: '24px',
            fontWeight: 200,
            letterSpacing: '0.02em'
          }}
        >
          Payment Details
        </h2>
        <p
          className="font-[DM_Sans] text-gray-400 mb-6"
          style={{
            fontSize: '12px',
            fontWeight: 200,
            letterSpacing: '0.01em'
          }}
        >
          {itemCount} {itemCount === 1 ? 'program' : 'programs'} • £{totalAmount.toFixed(2)}
        </p>

        {/* Payment Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Discount Code Section */}
          <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4 mb-4">
            <label
              className="block font-[DM_Sans] text-gray-300 mb-2"
              style={{
                fontSize: '11px',
                fontWeight: 200,
                letterSpacing: '0.05em'
              }}
            >
              DISCOUNT CODE
            </label>
            
            {!codeApplied ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={discountCode}
                  onChange={(e) => {
                    setDiscountCode(e.target.value.toUpperCase());
                    setDiscountError('');
                  }}
                  placeholder="Enter code"
                  disabled={isValidatingCode}
                  className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white font-[DM_Sans] focus:outline-none focus:border-[#D4AF37] transition-colors disabled:opacity-50"
                  style={{
                    fontSize: '14px',
                    fontWeight: 200
                  }}
                />
                <button
                  type="button"
                  onClick={handleApplyDiscount}
                  disabled={isValidatingCode || !discountCode.trim()}
                  className="px-4 py-2 bg-[#D4AF37] text-white rounded-lg font-[DM_Sans] hover:bg-[#E5C158] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    fontSize: '11px',
                    fontWeight: 500,
                    letterSpacing: '0.05em'
                  }}
                >
                  {isValidatingCode ? 'CHECKING...' : 'APPLY'}
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between bg-green-900/20 border border-green-700 rounded-lg px-4 py-2">
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-green-500" />
                  <span
                    className="font-[DM_Sans] text-green-400"
                    style={{
                      fontSize: '14px',
                      fontWeight: 200
                    }}
                  >
                    {discountCode} ({discountPercent}% off)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveDiscount}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            )}
            
            {discountError && (
              <p
                className="font-[DM_Sans] text-red-400 mt-2"
                style={{
                  fontSize: '11px',
                  fontWeight: 200
                }}
              >
                {discountError}
              </p>
            )}
          </div>

          {/* Card Number */}
          <div>
            <label
              className="block font-[DM_Sans] text-gray-300 mb-2"
              style={{
                fontSize: '11px',
                fontWeight: 200,
                letterSpacing: '0.05em'
              }}
            >
              CARD NUMBER
            </label>
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              placeholder="1234 5678 9012 3456"
              required
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white font-[DM_Sans] focus:outline-none focus:border-[#D4AF37] transition-colors"
              style={{
                fontSize: '14px',
                fontWeight: 200
              }}
            />
          </div>

          {/* Expiry and CVV */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                className="block font-[DM_Sans] text-gray-300 mb-2"
                style={{
                  fontSize: '11px',
                  fontWeight: 200,
                  letterSpacing: '0.05em'
                }}
              >
                EXPIRY DATE
              </label>
              <input
                type="text"
                value={expiryDate}
                onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                placeholder="MM/YY"
                required
                maxLength={5}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white font-[DM_Sans] focus:outline-none focus:border-[#D4AF37] transition-colors"
                style={{
                  fontSize: '14px',
                  fontWeight: 200
                }}
              />
            </div>
            <div>
              <label
                className="block font-[DM_Sans] text-gray-300 mb-2"
                style={{
                  fontSize: '11px',
                  fontWeight: 200,
                  letterSpacing: '0.05em'
                }}
              >
                CVV
              </label>
              <input
                type="text"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').substring(0, 3))}
                placeholder="123"
                required
                maxLength={3}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white font-[DM_Sans] focus:outline-none focus:border-[#D4AF37] transition-colors"
                style={{
                  fontSize: '14px',
                  fontWeight: 200
                }}
              />
            </div>
          </div>

          {/* Cardholder Name */}
          <div>
            <label
              className="block font-[DM_Sans] text-gray-300 mb-2"
              style={{
                fontSize: '11px',
                fontWeight: 200,
                letterSpacing: '0.05em'
              }}
            >
              CARDHOLDER NAME
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Smith"
              required
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white font-[DM_Sans] focus:outline-none focus:border-[#D4AF37] transition-colors"
              style={{
                fontSize: '14px',
                fontWeight: 200
              }}
            />
          </div>

          {/* Total */}
          <div className="border-t border-zinc-700 pt-4 mt-6">
            {codeApplied && (
              <div className="flex justify-between items-center mb-2">
                <span
                  className="font-[DM_Sans] text-gray-400"
                  style={{
                    fontSize: '14px',
                    fontWeight: 200
                  }}
                >
                  Subtotal
                </span>
                <span
                  className="font-[DM_Sans] text-gray-400 line-through"
                  style={{
                    fontSize: '14px',
                    fontWeight: 200
                  }}
                >
                  £{totalAmount.toFixed(2)}
                </span>
              </div>
            )}
            {codeApplied && (
              <div className="flex justify-between items-center mb-2">
                <span
                  className="font-[DM_Sans] text-green-400"
                  style={{
                    fontSize: '14px',
                    fontWeight: 200
                  }}
                >
                  Discount ({discountPercent}%)
                </span>
                <span
                  className="font-[DM_Sans] text-green-400"
                  style={{
                    fontSize: '14px',
                    fontWeight: 200
                  }}
                >
                  -£{(totalAmount - discountedAmount).toFixed(2)}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center mb-6">
              <span
                className="font-[DM_Sans] text-white"
                style={{
                  fontSize: '16px',
                  fontWeight: 200
                }}
              >
                Total Amount
              </span>
              <span
                className="font-[DM_Sans] text-[#D4AF37]"
                style={{
                  fontSize: '20px',
                  fontWeight: 200
                }}
              >
                £{discountedAmount.toFixed(2)}
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full px-6 py-3 bg-[#D4AF37] text-[#FFFFFF] rounded-full font-[DM_Sans] hover:bg-[#E5C158] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                fontSize: '12px',
                letterSpacing: '0.1em',
                fontWeight: 500,
                boxShadow: isProcessing ? 'none' : '0 4px 16px rgba(212, 175, 55, 0.3)'
              }}
            >
              {isProcessing ? 'PROCESSING...' : 'COMPLETE PAYMENT'}
            </button>

            {/* Security Note */}
            <p
              className="font-[DM_Sans] text-gray-500 text-center mt-4"
              style={{
                fontSize: '9px',
                fontWeight: 200,
                letterSpacing: '0.01em'
              }}
            >
              Your payment information is secure and encrypted
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}