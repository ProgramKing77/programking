import { Lock, LockOpen, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface MobileAccountRewardCardProps {
  discount: string;
  status: 'received' | 'claim' | 'locked';
  requirementText: string;
  rewardId: string;
  discountCode?: string;
  onClaim?: (rewardId: string) => void;
}

export function MobileAccountRewardCard({
  discount,
  status,
  requirementText,
  rewardId,
  discountCode,
  onClaim
}: MobileAccountRewardCardProps) {
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);

  const getStatusConfig = () => {
    switch (status) {
      case 'received':
        return {
          text: 'RECEIVED',
          textColor: '#D4AF37',
          iconColor: '#D4AF37',
          borderColor: '#D4AF37'
        };
      case 'claim':
        return {
          text: 'CLAIM',
          textColor: '#4ADE80',
          iconColor: '#4ADE80',
          borderColor: '#4ADE80'
        };
      case 'locked':
        return {
          text: 'LOCKED',
          textColor: '#6B7280',
          iconColor: '#6B7280',
          borderColor: '#6B7280'
        };
    }
  };

  const statusConfig = getStatusConfig();

  const handleClaim = () => {
    if (status === 'claim' && onClaim) {
      onClaim(rewardId);
    }
  };

  const handleCopyCode = () => {
    if (discountCode) {
      navigator.clipboard.writeText(discountCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleStatusClick = () => {
    if (status === 'claim') {
      handleClaim();
    } else if (status === 'received' && discountCode) {
      setShowCode(!showCode);
    }
  };

  return (
    <div 
      className="relative overflow-hidden bg-black rounded-[20px] h-[400px]"
      style={{
        border: `1px solid ${statusConfig.borderColor}`,
        boxShadow: status === 'received' ? '0 4px 20px rgba(212, 175, 55, 0.1)' : status === 'claim' ? '0 4px 20px rgba(74, 222, 128, 0.1)' : '0 4px 20px rgba(107, 116, 128, 0.1)',
        transition: 'all 0.3s ease'
      }}
    >
      {/* Status Badge - positioned like progress badge, now clickable */}
      <button
        onClick={handleStatusClick}
        disabled={status === 'locked'}
        className="absolute top-3 right-3 z-20 px-2.5 py-1 rounded-full text-[9px] font-[DM_Sans] tracking-wider transition-transform hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed"
        style={{
          background: status === 'received' ? 'rgba(212, 175, 55, 0.15)' : status === 'claim' ? 'rgba(74, 222, 128, 0.15)' : 'rgba(107, 116, 128, 0.15)',
          border: `1px solid ${status === 'received' ? 'rgba(212, 175, 55, 0.3)' : status === 'claim' ? 'rgba(74, 222, 128, 0.3)' : 'rgba(107, 116, 128, 0.3)'}`,
          color: statusConfig.textColor,
          backdropFilter: 'blur(10px)'
        }}
      >
        {statusConfig.text}
      </button>

      {/* Main Content Container */}
      <div className="relative flex flex-col h-[400px]">
        {/* Top Section - Icon/Visual Area (matching image section height) */}
        <div className="relative overflow-hidden h-[50%] flex items-center justify-center bg-gradient-to-br from-black via-black to-gray-900">
          {status === 'received' || status === 'claim' ? (
            <LockOpen 
              size={64} 
              strokeWidth={1}
              style={{ color: statusConfig.iconColor, opacity: 0.3 }}
            />
          ) : (
            <Lock 
              size={64} 
              strokeWidth={1}
              style={{ color: statusConfig.iconColor, opacity: 0.3 }}
            />
          )}
        </div>

        {/* Bottom Section - Text Content (matching program card layout) */}
        <div className="flex flex-col justify-between p-6 bg-black flex-1">
          <div className="text-left flex-1 overflow-hidden">
            <h3 
              className="mb-3 font-[DM_Sans] text-white"
              style={{
                fontSize: '40px',
                letterSpacing: '0.02em',
                lineHeight: '1.1',
                fontWeight: 300
              }}
            >
              {discount}
            </h3>
            <p 
              className="font-[DM_Sans]"
              style={{
                fontSize: '14px',
                fontWeight: 300,
                letterSpacing: '0.01em',
                lineHeight: '1.6',
                color: '#CCCCCC',
                marginBottom: '16px'
              }}
            >
              any program
            </p>

            {/* Discount Code Display (when claimed and revealed) */}
            {showCode && discountCode && status === 'received' && (
              <div 
                className="mb-3 p-3 rounded-lg border"
                style={{
                  backgroundColor: 'rgba(212, 175, 55, 0.1)',
                  borderColor: 'rgba(212, 175, 55, 0.3)'
                }}
              >
                <p
                  className="font-[DM_Sans] mb-1"
                  style={{
                    fontSize: '8px',
                    letterSpacing: '0.05em',
                    color: 'rgba(255, 255, 255, 0.5)'
                  }}
                >
                  YOUR DISCOUNT CODE
                </p>
                <div className="flex items-center justify-between">
                  <p
                    className="font-[DM_Sans]"
                    style={{
                      fontSize: '14px',
                      fontWeight: 500,
                      letterSpacing: '0.08em',
                      color: '#D4AF37'
                    }}
                  >
                    {discountCode}
                  </p>
                  <button
                    onClick={handleCopyCode}
                    className="p-1.5 hover:bg-white/10 rounded transition-colors"
                    title="Copy to clipboard"
                  >
                    {copied ? (
                      <Check size={14} className="text-green-400" />
                    ) : (
                      <Copy size={14} style={{ color: '#D4AF37' }} />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Requirement Text (matching program details position) */}
            <div className="mt-3">
              <p
                className="font-[DM_Sans]"
                style={{
                  fontSize: '11px',
                  fontWeight: 300,
                  letterSpacing: '0.01em',
                  lineHeight: '1.5',
                  color: '#999999'
                }}
              >
                {requirementText}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}