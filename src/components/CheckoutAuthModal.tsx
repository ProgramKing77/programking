import { useState } from 'react';
import { X } from 'lucide-react';

interface CheckoutAuthModalProps {
  onLogin: (email: string, firstName: string, lastName: string) => void;
  onCancel: () => void;
}

export function CheckoutAuthModal({ onLogin, onCancel }: CheckoutAuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate authentication
    setTimeout(() => {
      setIsProcessing(false);
      onLogin(email, firstName, lastName);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative bg-zinc-900 rounded-lg border border-zinc-800 w-full max-w-md p-6 md:p-8">
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
          {isSignUp ? 'Create Account' : 'Sign In'}
        </h2>
        <p
          className="font-[DM_Sans] text-gray-400 mb-6"
          style={{
            fontSize: '12px',
            fontWeight: 200,
            letterSpacing: '0.01em'
          }}
        >
          {isSignUp ? 'Create an account to complete your purchase' : 'Sign in to continue with checkout'}
        </p>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* First Name (Sign Up Only) */}
          {isSignUp && (
            <div>
              <label
                className="block font-[DM_Sans] text-gray-300 mb-2"
                style={{
                  fontSize: '11px',
                  fontWeight: 200,
                  letterSpacing: '0.05em'
                }}
              >
                FIRST NAME
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
                required
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white font-[DM_Sans] focus:outline-none focus:border-[#D4AF37] transition-colors"
                style={{
                  fontSize: '14px',
                  fontWeight: 200
                }}
              />
            </div>
          )}

          {/* Last Name (Sign Up Only) */}
          {isSignUp && (
            <div>
              <label
                className="block font-[DM_Sans] text-gray-300 mb-2"
                style={{
                  fontSize: '11px',
                  fontWeight: 200,
                  letterSpacing: '0.05em'
                }}
              >
                LAST NAME
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Smith"
                required
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white font-[DM_Sans] focus:outline-none focus:border-[#D4AF37] transition-colors"
                style={{
                  fontSize: '14px',
                  fontWeight: 200
                }}
              />
            </div>
          )}

          {/* Email */}
          <div>
            <label
              className="block font-[DM_Sans] text-gray-300 mb-2"
              style={{
                fontSize: '11px',
                fontWeight: 200,
                letterSpacing: '0.05em'
              }}
            >
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john.smith@example.com"
              required
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white font-[DM_Sans] focus:outline-none focus:border-[#D4AF37] transition-colors"
              style={{
                fontSize: '14px',
                fontWeight: 200
              }}
            />
          </div>

          {/* Password */}
          <div>
            <label
              className="block font-[DM_Sans] text-gray-300 mb-2"
              style={{
                fontSize: '11px',
                fontWeight: 200,
                letterSpacing: '0.05em'
              }}
            >
              PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white font-[DM_Sans] focus:outline-none focus:border-[#D4AF37] transition-colors"
              style={{
                fontSize: '14px',
                fontWeight: 200
              }}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full px-6 py-3 bg-[#D4AF37] text-[#FFFFFF] rounded-full font-[DM_Sans] hover:bg-[#E5C158] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            style={{
              fontSize: '12px',
              letterSpacing: '0.1em',
              fontWeight: 500,
              boxShadow: isProcessing ? 'none' : '0 4px 16px rgba(212, 175, 55, 0.3)'
            }}
          >
            {isProcessing ? 'PROCESSING...' : (isSignUp ? 'CREATE ACCOUNT' : 'SIGN IN')}
          </button>

          {/* Toggle Sign Up / Sign In */}
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="font-[DM_Sans] text-gray-400 hover:text-[#D4AF37] transition-colors"
              style={{
                fontSize: '12px',
                fontWeight: 200,
                letterSpacing: '0.01em'
              }}
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Create One"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
