import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4 text-center font-sans">
          <div className="text-6xl mb-6">🍽️</div>
          <h1 className="text-3xl font-bold text-ink mb-4">Oops! Something went wrong in the kitchen.</h1>
          <p className="text-ink-secondary mb-8 max-w-md">
            We are having trouble serving this page. Please try reloading, or return safely to the homepage.
          </p>
          <div className="flex gap-4">
             <button
                onClick={() => window.location.reload()}
                className="btn-primary"
             >
                Reload Page
             </button>
             <button
                onClick={() => window.location.href = '/'}
                className="px-6 py-3 rounded-xl bg-surface-section text-ink font-semibold shadow-sm hover:bg-surface-muted transition-colors"
             >
                Go Home
             </button>
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
