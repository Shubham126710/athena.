import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    // If it's a chunk load error (common on Vercel deployments), reload the page
    if (error.name === 'ChunkLoadError' || (error.message && error.message.includes('fetch'))) {
      window.location.reload();
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-950 text-white p-6">
            <h1 className="text-3xl font-serif italic mb-4">Oops! Something went wrong.</h1>
            <p className="text-neutral-400 mb-6 text-center max-w-md">We encountered an unexpected error. This usually happens when the app is updated while you're using it.</p>
            <button 
                onClick={() => window.location.reload()} 
                className="px-6 py-2 bg-white text-black font-medium rounded-lg hover:bg-neutral-200 transition-colors"
            >
                Refresh Page
            </button>
        </div>
      );
    }
    return this.props.children;
  }
}
