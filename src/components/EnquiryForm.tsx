import { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';

interface EnquiryFormProps {
  serviceTitle: string;
  onClose: () => void;
  onSubmit: (formData: { name: string; email: string; phone: string; message: string }) => void;
}

export function EnquiryForm({ serviceTitle, onClose, onSubmit }: EnquiryFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Call the parent onSubmit handler
    await onSubmit(formData);
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Auto-close after 3 seconds
    setTimeout(() => {
      onClose();
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-4"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(8px)'
      }}
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-[440px] md:max-w-[600px] bg-black rounded-[15px] md:rounded-[20px] p-5 md:p-12 max-h-[85vh] overflow-y-auto"
        style={{
          border: '1px solid #D4AF37',
          boxShadow: '0 8px 32px rgba(212, 175, 55, 0.2)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 md:top-6 md:right-6 text-white hover:text-[#D4AF37] transition-colors"
          aria-label="Close"
        >
          <X size={20} className="md:w-6 md:h-6" />
        </button>

        {/* Confirmation message */}
        {isSubmitted ? (
          <div className="flex flex-col items-center justify-center py-8 md:py-12">
            <CheckCircle size={60} className="text-[#D4AF37] mb-4 md:mb-6" />
            <h2 
              className="font-[DM_Sans] text-white mb-2 text-[22px] md:text-[28px] text-center"
              style={{
                letterSpacing: '0.02em',
                lineHeight: '1.2'
              }}
            >
              Enquiry Submitted
            </h2>
            <p 
              className="font-[DM_Sans_Thin] text-[#CCCCCC] text-[13px] md:text-[15px] text-center max-w-[350px]"
              style={{
                letterSpacing: '0.01em',
                lineHeight: '1.6'
              }}
            >
              Thank you for your enquiry. A member of the team will be in touch soon.
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="mb-5 md:mb-8">
              <h2 
                className="font-[DM_Sans] text-white mb-1 md:mb-2 text-[22px] md:text-[32px]"
                style={{
                  letterSpacing: '0.02em',
                  lineHeight: '1.2'
                }}
              >
                Enquire Now
              </h2>
              <p 
                className="font-[DM_Sans] text-[#CCCCCC]"
                style={{
                  fontSize: '17.5px',
                  fontWeight: 300,
                  letterSpacing: '0.01em',
                  lineHeight: '1.6'
                }}
              >
                {serviceTitle}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              {/* Name field */}
              <div>
                <label 
                  htmlFor="name"
                  className="block font-[DM_Sans] text-[#D4AF37] mb-1.5 md:mb-2 text-[10px] md:text-[12px]"
                  style={{
                    letterSpacing: '0.15em',
                    fontWeight: 500
                  }}
                >
                  FULL NAME
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 md:px-4 md:py-3 bg-transparent border rounded-[10px] font-[DM_Sans] text-white focus:outline-none focus:border-[#D4AF37] transition-colors text-[13px] md:text-[14px]"
                  style={{
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    letterSpacing: '0.01em'
                  }}
                  placeholder="Enter your full name"
                />
              </div>

              {/* Email field */}
              <div>
                <label 
                  htmlFor="email"
                  className="block font-[DM_Sans] text-[#D4AF37] mb-1.5 md:mb-2 text-[10px] md:text-[12px]"
                  style={{
                    letterSpacing: '0.15em',
                    fontWeight: 500
                  }}
                >
                  EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 md:px-4 md:py-3 bg-transparent border rounded-[10px] font-[DM_Sans] text-white focus:outline-none focus:border-[#D4AF37] transition-colors text-[13px] md:text-[14px]"
                  style={{
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    letterSpacing: '0.01em'
                  }}
                  placeholder="Enter your email address"
                />
              </div>

              {/* Phone field */}
              <div>
                <label 
                  htmlFor="phone"
                  className="block font-[DM_Sans] text-[#D4AF37] mb-1.5 md:mb-2 text-[10px] md:text-[12px]"
                  style={{
                    letterSpacing: '0.15em',
                    fontWeight: 500
                  }}
                >
                  PHONE NUMBER
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 md:px-4 md:py-3 bg-transparent border rounded-[10px] font-[DM_Sans] text-white focus:outline-none focus:border-[#D4AF37] transition-colors text-[13px] md:text-[14px]"
                  style={{
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    letterSpacing: '0.01em'
                  }}
                  placeholder="Enter your phone number"
                />
              </div>

              {/* Message field */}
              <div>
                <label 
                  htmlFor="message"
                  className="block font-[DM_Sans] text-[#D4AF37] mb-1.5 md:mb-2 text-[10px] md:text-[12px]"
                  style={{
                    letterSpacing: '0.15em',
                    fontWeight: 500
                  }}
                >
                  MESSAGE
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 md:px-4 md:py-3 bg-transparent border rounded-[10px] font-[DM_Sans] text-white focus:outline-none focus:border-[#D4AF37] transition-colors resize-none text-[13px] md:text-[14px]"
                  style={{
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    letterSpacing: '0.01em',
                    lineHeight: '1.6'
                  }}
                  placeholder="Tell us about your enquiry..."
                />
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-2.5 md:px-8 md:py-3 bg-[#D4AF37] hover:bg-[#E5C158] transition-colors font-[DM_Sans] rounded-[10px] disabled:opacity-50 disabled:cursor-not-allowed text-[11px] md:text-[12px]"
                style={{
                  letterSpacing: '0.15em',
                  fontWeight: 500,
                  color: '#FFFFFF'
                }}
              >
                {isSubmitting ? 'SUBMITTING...' : 'SUBMIT ENQUIRY'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}