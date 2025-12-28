import { X } from 'lucide-react';
import { useState } from 'react';

interface LoginPromptProps {
  onClose: () => void;
  onLogin: (email: string) => void;
  onCreateAccount: (email: string) => void;
  programName: string;
}

export function LoginPrompt({ onClose, onLogin, onCreateAccount, programName }: LoginPromptProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showLogin, setShowLogin] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // For now, accept any credentials to get the app working
      // TODO: Implement proper authentication
      localStorage.setItem('user_email', email.toLowerCase().trim());
      onLogin(email.toLowerCase().trim());
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // For now, accept any credentials to get the app working
      // TODO: Implement proper authentication
      localStorage.setItem('user_email', email.toLowerCase().trim());
      onCreateAccount(email.toLowerCase().trim());
    } catch (err) {
      console.error('Signup error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-[#1A1A1A] rounded-lg w-full max-w-md relative border border-[#D4AF37]/20 shadow-[0_0_30px_rgba(212,175,55,0.15)]">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        {/* Content */}
        <div className="p-8 pt-12">
          {/* Gold accent line */}
          <div className="w-16 h-px bg-[#D4AF37] mb-6" />
          
          <h2 className="text-xl mb-3 text-white">
            {showLogin ? 'Login' : 'Create Profile'}
          </h2>
          
          <p className="text-gray-400 text-sm mb-2 leading-relaxed">
            {showLogin ? 'Login to add this program to your account.' : 'Create a profile to add this program to your account.'}
          </p>
          
          <p className="text-[#D4AF37] text-xs mb-6">
            {programName}
          </p>

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-md">
              <p className="text-red-400 text-xs">{error}</p>
            </div>
          )}

          {/* Email Input */}
          <div className="mb-4">
            <label className="block text-gray-400 text-xs mb-2 tracking-wider">EMAIL</label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              onKeyDown={(e) => e.key === 'Enter' && (showLogin ? handleLogin() : handleCreateAccount())}
              placeholder="your@email.com"
              className="w-full bg-[#0A0A0A] border border-[#D4AF37]/30 text-white py-3 px-4 rounded-md focus:outline-none focus:border-[#D4AF37] transition-colors text-sm"
              disabled={loading}
            />
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <label className="block text-gray-400 text-xs mb-2 tracking-wider">PASSWORD</label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              onKeyDown={(e) => e.key === 'Enter' && (showLogin ? handleLogin() : handleCreateAccount())}
              placeholder="••••••••"
              className="w-full bg-[#0A0A0A] border border-[#D4AF37]/30 text-white py-3 px-4 rounded-md focus:outline-none focus:border-[#D4AF37] transition-colors text-sm"
              disabled={loading}
            />
          </div>

          {/* Action button */}
          <button
            onClick={showLogin ? handleLogin : handleCreateAccount}
            disabled={loading}
            className="w-full bg-[#D4AF37] text-black py-3.5 px-6 rounded-md hover:bg-[#C4A137] transition-all duration-300 tracking-wider text-sm font-medium shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'PLEASE WAIT...' : (showLogin ? 'LOGIN' : 'CREATE PROFILE')}
          </button>

          {/* Toggle between login and create */}
          <button
            onClick={() => {
              setShowLogin(!showLogin);
              setError('');
            }}
            disabled={loading}
            className="w-full text-gray-400 text-xs mt-4 hover:text-[#D4AF37] transition-colors disabled:opacity-50"
          >
            {showLogin ? 'Need an account? Create Profile' : 'Already have an account? Login'}
          </button>

          <p className="text-gray-500 text-xs text-center mt-6">
            Your programs will be securely stored in your account
          </p>
        </div>
      </div>
    </div>
  );
}
