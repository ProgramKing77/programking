import { Lock, LockOpen, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface AccountDashboardRewardCardProps {
  discount: string;
  status: 'received' | 'claim' | 'locked';
  requirementText: string;
  rewardId: string;
  discountCode?: string;
  onClaim?: (rewardId: string) => void;
}

export function AccountDashboardRewardCard({
  discount,
  status,
  requirementText,
  rewardId,
  discountCode,
  onClaim
}: AccountDashboardRewardCardProps) {
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
      className="relative rounded-[20px] overflow-hidden bg-black"
      style={{
        border: `1px solid ${statusConfig.borderColor}`,
        boxShadow: status === 'received' ? '0 4px 20px rgba(212, 175, 55, 0.1)' : status === 'claim' ? '0 4px 20px rgba(74, 222, 128, 0.1)' : '0 4px 20px rgba(107, 116, 128, 0.1)',
        minHeight: '280px',
        display: 'flex',
        flexDirection: 'column',
        padding: '32px',
        transition: 'all 0.3s ease',
        aspectRatio: '16 / 9'
      }}
    >
      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-between">
        {/* Top Section - Discount and Status */}
        <div className="flex items-start justify-between">
          <div>
            <h3 
              className="font-[DM_Sans]"
              style={{
                fontSize: '48px',
                fontWeight: 300,
                lineHeight: '1.1',
                color: '#FFFFFF'
              }}
            >
              {discount}
            </h3>
            <p 
              className="font-[DM_Sans] mt-2"
              style={{
                fontSize: '18px',
                fontWeight: 300,
                color: 'rgba(255, 255, 255, 0.7)'
              }}
            >
              any program
            </p>
          </div>
          
          {/* Status Badge - Now Clickable */}
          <button
            onClick={handleStatusClick}
            disabled={status === 'locked'}
            className="flex flex-col items-center gap-2 transition-transform hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed"
          >
            {status === 'received' || status === 'claim' ? (
              <LockOpen 
                size={24} 
                strokeWidth={1.5}
                style={{ color: statusConfig.iconColor }}
              />
            ) : (
              <Lock 
                size={24} 
                strokeWidth={1.5}
                style={{ color: statusConfig.iconColor }}
              />
            )}
            <p 
              className="font-[DM_Sans]"
              style={{
                fontSize: '9px',
                letterSpacing: '0.05em',
                fontWeight: 500,
                color: statusConfig.textColor
              }}
            >
              {statusConfig.text}
            </p>
          </button>
        </div>

        {/* Discount Code Display (when claimed and revealed) */}
        {showCode && discountCode && status === 'received' && (
          <div 
            className="mt-4 p-4 rounded-lg border"
            style={{
              backgroundColor: 'rgba(212, 175, 55, 0.1)',
              borderColor: 'rgba(212, 175, 55, 0.3)'
            }}
          >
            <p
              className="font-[DM_Sans] mb-2"
              style={{
                fontSize: '10px',
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
                  fontSize: '18px',
                  fontWeight: 500,
                  letterSpacing: '0.1em',
                  color: '#D4AF37'
                }}
              >
                {discountCode}
              </p>
              <button
                onClick={handleCopyCode}
                className="p-2 hover:bg-white/10 rounded transition-colors"
                title="Copy to clipboard"
              >
                {copied ? (
                  <Check size={18} className="text-green-400" />
                ) : (
                  <Copy size={18} style={{ color: '#D4AF37' }} />
                )}
              </button>
            </div>
          </div>
        )}

        {/* Bottom Section - Requirement Text */}
        <div className="mt-auto pt-8">
          <p 
            className="font-[DM_Sans]"
            style={{
              fontSize: '18px',
              fontWeight: 300,
              lineHeight: '1.5',
              color: 'rgba(255, 255, 255, 0.5)'
            }}
          >
            {requirementText}
          </p>
        </div>
      </div>
    </div>
  );
}