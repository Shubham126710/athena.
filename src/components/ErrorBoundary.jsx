import { safeGetStorage, safeSetStorage, safeRemoveStorage } from '../utils/storage.js';
import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
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
            <div className="bg-red-900/20 border border-red-900/50 p-4 rounded-lg w-full max-w-2xl overflow-auto text-left mb-6 font-mono text-xs text-red-200">
                <p className="font-bold">{this.state.error && this.state.error.toString()}</p>
                <pre className="mt-2 whitespace-pre-wrap">{this.state.errorInfo && this.state.errorInfo.componentStack}</pre>
            </div>
            <button 
                onClick={() => {
                    ;
                    window.location.reload();
                }} 
                className="px-6 py-2 bg-white text-black font-medium rounded-lg hover:bg-neutral-200 transition-colors"
            >
                Clear Cache & Refresh Page
            </button>
        </div>
      );
    }
    return this.props.children;
  }
}
