import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DitherHero from '../components/DitherHero';
import ConstellationBackground from '../components/ConstellationBackground';

export default function Login() {
  const nav = useNavigate();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
      nav('/hub');
    } catch (err) {
      setError('Failed to sign in: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans flex">
      {/* Left Side - Visual */}
      <div className="hidden lg:block w-1/2 relative overflow-hidden border-r border-neutral-800">
        <div className="absolute inset-0">
            <DitherHero color="#ffffff" backgroundColor="#0a0a0a" />
        </div>
        <div className="absolute inset-0 flex flex-col justify-between p-12 z-10 pointer-events-none">
            <div className="flex items-center gap-2 pointer-events-auto cursor-pointer hover:opacity-80 transition-opacity" onClick={() => nav('/')}>
                <img src="/logo.png" alt="Athena Logo" className="w-8 h-8 rounded-sm" />
                <span className="font-serif font-bold tracking-tight text-xl">athena.</span>
            </div>
            <div>
                <h2 className="text-4xl font-bold mb-4">Welcome back.</h2>
                <p className="text-neutral-400 max-w-md">
                    Access your academic repository, track your syllabus, and manage your notes all in one place.
                </p>
            </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative bg-neutral-950">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <ConstellationBackground />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

        <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 relative z-10">
            <div className="text-center lg:text-left">
                <h1 className="text-3xl font-bold tracking-tight">Sign in to your account</h1>
                <p className="mt-2 text-neutral-400">
                    Or <Link to="/register" className="text-white underline hover:text-neutral-300">create a new account</Link>
                </p>
            </div>

            {error && (
                <div className="bg-red-900/20 border border-red-900/50 text-red-200 p-4 rounded text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">Email address</label>
                    <input 
                        type="email" 
                        required 
                        className="w-full bg-neutral-900 border border-neutral-800 rounded p-3 text-white focus:outline-none focus:border-white transition-colors"
                        placeholder="student@university.edu"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">Password</label>
                    <input 
                        type="password" 
                        required 
                        className="w-full bg-neutral-900 border border-neutral-800 rounded p-3 text-white focus:outline-none focus:border-white transition-colors"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-white text-black font-bold py-3 rounded hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Signing in...' : 'Sign in'}
                </button>

                <p className="mt-6 text-center text-neutral-400 text-sm">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-white hover:underline">
                        Sign up
                    </Link>
                </p>
            </form>
        </div>
      </div>
    </div>
  );
}
