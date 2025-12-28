import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
          <div className="max-w-md text-center">
            <h1 className="text-[#D4AF37] mb-4" style={{ fontSize: '24px', fontWeight: 300 }}>
              Something went wrong
            </h1>
            <p className="text-gray-400 mb-6" style={{ fontSize: '14px' }}>
              We're sorry, but something went wrong. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90 transition-colors"
              style={{ fontSize: '12px', letterSpacing: '0.1em' }}
            >
              REFRESH PAGE
            </button>
            {this.state.error && (
              <pre className="mt-6 text-left text-red-400 text-xs overflow-auto p-4 bg-black/40 border border-gray-800">
                {this.state.error.toString()}
              </pre>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
