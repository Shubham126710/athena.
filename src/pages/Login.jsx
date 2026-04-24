import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DitherHero from '../components/DitherHero';
import ConstellationBackground from '../components/ConstellationBackground';

export default function Login() {
  const nav = useNavigate();
  const { signIn, signInGuest } = useAuth();
  
  const [activeTab, setActiveTab] = useState('guest'); // 'guest' or 'admin'
  
  // Guest State
  const [firstName, setFirstName] = useState('');
  const [uid, setUid] = useState('');
  const [avatarSeed, setAvatarSeed] = useState('Jack&top=shortHairShortFlat&accessories=prescription02&clothing=blazerSweater');
  
  // Admin State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const guestAvatars = [
    'Jack&top=shortHairShortFlat&accessories=prescription02&clothing=blazerSweater',
    'Leo&top=shortHairShortCurly&facialHair=beardLight&clothing=hoodie',
    'Max&top=shortHairShaggyMullet&facialHair=blank&clothing=graphicShirt',
    'Mia&top=longHairStraight&accessories=blank&clothing=overall',
    'Zoe&top=longHairCurly&accessories=round&clothing=shirtScoopNeck',
    'Ava&top=longHairBob&accessories=blank&clothing=blazerShirt'
  ];

  async function handleGuestSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInGuest(firstName, uid, avatarSeed);
      nav('/hub');
    } catch (err) {
      setError('Failed to sign in as guest: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleAdminSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
      nav('/hub');
    } catch (err) {
      setError('Failed to sign in as admin: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans flex">
      {/* Left Side - Visual */}
      <div className="hidden lg:block w-1/2 relative overflow-hidden border-r border-neutral-800">
        <div className="absolute inset-0">
            <DitherHero color="#ffffff" backgroundColor="#0a0a0a" position={[0, -4, 0]} />
        </div>
        <div className="absolute inset-0 flex flex-col p-12 z-10 pointer-events-none">
            <div className="flex items-center gap-2 pointer-events-auto cursor-pointer hover:opacity-80 transition-opacity mb-20" onClick={() => nav('/')}>
                <img src="/logo.png" alt="Athena Logo" className="w-8 h-8 rounded-sm" />
                <span className="font-serif font-bold tracking-tight text-xl">athena.</span>
            </div>
            <div>
                <h2 className="text-4xl font-bold mb-4">Welcome back.</h2>
                <p className="text-neutral-400 max-w-md text-lg">
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
                    Choose your login method below.
                </p>
            </div>

            <div className="flex gap-4 border-b border-neutral-800 pb-2">
              <button
                className={`pb-2 font-bold ${activeTab === 'guest' ? 'text-white border-b-2 border-white' : 'text-neutral-500 hover:text-neutral-300'}`}
                onClick={() => setActiveTab('guest')}
              >
                Guest Login
              </button>
              <button
                className={`pb-2 font-bold ${activeTab === 'admin' ? 'text-white border-b-2 border-white' : 'text-neutral-500 hover:text-neutral-300'}`}
                onClick={() => setActiveTab('admin')}
              >
                Admin Login
              </button>
            </div>

            {error && (
                <div className="bg-red-900/20 border border-red-900/50 text-red-200 p-4 rounded text-sm">
                    {error}
                </div>
            )}

            {activeTab === 'guest' ? (
              <form onSubmit={handleGuestSubmit} className="space-y-6">
                  {/* Select Avatar UI */}
                  <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-4">Choose Your Avatar</label>
                      <div className="flex gap-4 overflow-x-auto pb-2 mb-2 scrollbar-hide">
                          {guestAvatars.map(seed => (
                              <div 
                                  key={seed}
                                  onClick={() => setAvatarSeed(seed)}
                                  className={`w-16 h-16 rounded-full overflow-hidden flex-shrink-0 cursor-pointer border-2 transition-all ${avatarSeed === seed ? 'border-white scale-110 shadow-[0_0_15px_rgba(255,255,255,0.3)]' : 'border-transparent opacity-50 hover:opacity-100'}`}
                              >
                                  <img 
                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=transparent`} 
                                    alt={seed.split('&')[0]} 
                                    className="w-full h-full bg-neutral-800 grayscale hover:grayscale-0 transition-all duration-300" 
                                  />
                              </div>
                          ))}
                      </div>
                  </div>

                  <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-2">First Name</label>
                      <input 
                          type="text" 
                          required 
                          className="w-full bg-neutral-900 border border-neutral-800 rounded p-3 text-white focus:outline-none focus:border-white transition-colors"
                          placeholder="John"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                      />
                  </div>

                  <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-2">UID</label>
                      <input 
                          type="text" 
                          required 
                          className="w-full bg-neutral-900 border border-neutral-800 rounded p-3 text-white focus:outline-none focus:border-white transition-colors"
                          placeholder="e.g. 21BCS123"
                          value={uid}
                          onChange={(e) => setUid(e.target.value)}
                      />
                  </div>

                  <button 
                      type="submit" 
                      disabled={loading}
                      className="w-full bg-white text-black font-bold py-3 rounded hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                      {loading ? 'Signing in...' : 'Sign in as Guest'}
                  </button>
              </form>
            ) : (
              <form onSubmit={handleAdminSubmit} className="space-y-6">
                  <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-2">Admin Email</label>
                      <input 
                          type="email" 
                          required 
                          className="w-full bg-neutral-900 border border-neutral-800 rounded p-3 text-white focus:outline-none focus:border-white transition-colors"
                          placeholder="admin@athena.edu"
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
                      {loading ? 'Signing in...' : 'Sign in as Admin'}
                  </button>
              </form>
            )}
        </div>
      </div>
    </div>
  );
}
