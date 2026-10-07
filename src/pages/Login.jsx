import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GrainGradient } from "@paper-design/shaders-react";
import ConstellationBackground from '../components/ConstellationBackground';
import Avatar from '../components/Avatar';

export default function Login() {
  const nav = useNavigate();
  const { signIn, signInGuest } = useAuth();
  
  const [activeTab, setActiveTab] = useState('guest'); // 'guest' or 'admin'
  
  // Guest State
  const [firstName, setFirstName] = useState('');
  const [uid, setUid] = useState('');
  const [avatarSeed, setAvatarSeed] = useState('Jack&top=shortFlat&accessories=prescription02&accessoriesProbability=100&clothing=blazerAndSweater&mouth=smile&eyes=happy&eyebrows=defaultNatural');
  
  // Admin State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false);

  const guestAvatars = [
    'Jack&top=shortFlat&accessories=prescription02&accessoriesProbability=100&clothing=blazerAndSweater&mouth=smile&eyes=happy&eyebrows=defaultNatural',
    'Leo&top=shortCurly&clothing=hoodie&mouth=smile&eyes=happy&eyebrows=defaultNatural',
    'Sophia&top=longHairStraight&clothing=blazerAndShirt&mouth=smile&eyes=happy&eyebrows=defaultNatural&facialHairProbability=0',
    'Max&top=shaggyMullet&clothing=graphicShirt&mouth=smile&eyes=happy&eyebrows=defaultNatural',
    'Jane&top=longHairCurly&clothing=overall&mouth=smile&eyes=happy&eyebrows=defaultNatural&facialHairProbability=0'
  ];

  async function handleGuestSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (!firstName || !uid) throw new Error("Please fill in all fields.");
      
      const userData = {
        first_name: firstName,
        uid: uid,
        role: 'student',
        avatar_seed: avatarSeed
      };
      await signInGuest(userData);
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
    <section className="min-h-screen bg-[#050505] p-3 text-white antialiased">
      <div className="grid min-h-[calc(100vh-1.5rem)] gap-6 lg:grid-cols-[1.06fr_0.94fr]">
        
        {/* Left Box - Gradient visual */}
        <div className="relative flex min-h-[720px] overflow-hidden rounded-2xl bg-black p-8 text-white sm:p-12 lg:min-h-0 border border-neutral-800 shadow-2xl">
          <GrainGradient
            speed={1}
            scale={1}
            rotation={0}
            offsetX={0}
            offsetY={0}
            softness={0.5}
            intensity={0.5}
            noise={0.25}
            shape="corners"
            frame={2854.5}
            colors={["#ffffff", "#525252", "#262626", "#000000"]}
            colorBack="#000000"
            className="absolute inset-0 bg-black opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute inset-0 opacity-[0.03]" style={{
                backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
                backgroundSize: '100px 100px',
            }}></div>
          </div>

          <div className="relative z-10 flex h-full w-full flex-col justify-between">
            <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity w-fit" onClick={() => nav('/')}>
                <img src="/logo.png" alt="Athena Logo" className="w-8 h-8 rounded-sm grayscale" />
                <span className="font-serif font-bold tracking-tight text-xl">athena.</span>
            </div>

            <div className="mb-8">
              <h2 className="max-w-[620px] pt-0 text-5xl font-bold tracking-[-0.05em] text-white sm:text-6xl lg:pt-16 lg:text-[64px] lg:leading-[0.98] xl:text-[70px]">
                Welcome back<span className="font-serif italic font-normal text-neutral-300">.</span>
              </h2>
              <p className="mt-4 max-w-md text-lg text-neutral-400 font-light leading-relaxed">
                  Access your academic repository, track your syllabus, and manage your notes all in one place.
              </p>
            </div>
          </div>
        </div>

        {/* Right Box - Form */}
        <div className="flex min-h-[760px] items-center rounded-2xl border border-neutral-800 bg-[#0a0a0a] px-6 py-12 sm:px-10 lg:min-h-0 lg:px-14 xl:px-20 relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
              <ConstellationBackground />
          </div>

          <div className="mx-auto w-full max-w-[460px] relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div>
              <h1 className="whitespace-nowrap text-3xl font-bold tracking-[-0.04em] sm:text-4xl lg:text-[42px] lg:leading-[1.05] xl:text-[50px]">
                Sign in to <span className="font-serif italic font-normal text-neutral-300">Athena.</span>
              </h1>
              <p className="mt-3 whitespace-nowrap text-lg leading-snug text-neutral-400 font-light sm:text-xl">
                Choose your login method below.
              </p>
            </div>

            <div className="mt-12 flex gap-4 border-b border-neutral-800/80 pb-2">
              <button
                className={`pb-2 text-sm font-medium transition-colors ${activeTab === 'guest' ? 'text-white border-b-2 border-white' : 'text-neutral-500 hover:text-neutral-300'}`}
                onClick={() => setActiveTab('guest')}
              >
                Guest Login
              </button>
              <button
                className={`pb-2 text-sm font-medium transition-colors ${activeTab === 'admin' ? 'text-white border-b-2 border-white' : 'text-neutral-500 hover:text-neutral-300'}`}
                onClick={() => setActiveTab('admin')}
              >
                Admin Login
              </button>
            </div>

            {error && (
                <div className="mt-6 bg-red-900/20 border border-red-900/50 text-red-200 p-4 rounded-xl text-sm">
                    {error}
                </div>
            )}

            <div className="mt-8">
            {activeTab === 'guest' ? (
              <form onSubmit={handleGuestSubmit} className="space-y-5">
                  <div>
                      <label className="block text-[10px] font-bold tracking-widest uppercase mb-4 text-neutral-500">Choose Your Avatar</label>
                      <div className="flex gap-4 overflow-x-auto pb-2 mb-2 scrollbar-hide">
                          {guestAvatars.map(seed => (
                              <div 
                                  key={seed}
                                  onClick={() => setAvatarSeed(seed)}
                                  className={`w-14 h-14 flex-shrink-0 cursor-pointer rounded-full transition-all ${avatarSeed === seed ? 'ring-2 ring-white scale-110 shadow-[0_0_15px_rgba(255,255,255,0.3)]' : 'opacity-50 hover:opacity-100 ring-2 ring-transparent'}`}
                              >
                                  <Avatar seed={seed.split('&')[0]} className="w-full h-full rounded-full" />
                              </div>
                          ))}
                      </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                      <label className="flex h-14 items-center justify-between gap-4 rounded-xl border border-neutral-800 bg-neutral-900/50 px-5 text-sm leading-none transition-colors focus-within:border-neutral-600">
                          <input 
                              type="text" 
                              required 
                              placeholder="First Name"
                              className="min-w-0 flex-1 truncate bg-transparent text-white outline-none placeholder:text-neutral-600"
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                          />
                      </label>
                      <label className="flex h-14 items-center justify-between gap-4 rounded-xl border border-neutral-800 bg-neutral-900/50 px-5 text-sm leading-none transition-colors focus-within:border-neutral-600">
                          <input 
                              type="text" 
                              required 
                              placeholder="UID (e.g. 21BCS123)"
                              className="min-w-0 flex-1 truncate bg-transparent text-white outline-none placeholder:text-neutral-600"
                              value={uid}
                              onChange={(e) => setUid(e.target.value)}
                          />
                      </label>
                  </div>

                  <button 
                      type="submit" 
                      disabled={loading}
                      className="mt-6 flex h-14 w-full items-center justify-center rounded-xl bg-white text-black text-[15px] font-bold transition-colors hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  >
                      {loading ? 'Signing in...' : 'Sign in as Guest'}
                  </button>
              </form>
            ) : (
              <form onSubmit={handleAdminSubmit} className="space-y-5">
                  <label className="flex h-14 items-center justify-between gap-4 rounded-xl border border-neutral-800 bg-neutral-900/50 px-5 text-sm leading-none transition-colors focus-within:border-neutral-600">
                      <input 
                          type="email" 
                          required 
                          placeholder="Admin Email"
                          className="min-w-0 flex-1 truncate bg-transparent text-white outline-none placeholder:text-neutral-600"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                      />
                  </label>

                  <label className="flex h-14 items-center justify-between gap-4 rounded-xl border border-neutral-800 bg-neutral-900/50 px-5 text-sm leading-none transition-colors focus-within:border-neutral-600">
                      <input 
                          type="password" 
                          required 
                          placeholder="Password"
                          className="min-w-0 flex-1 truncate bg-transparent text-white outline-none placeholder:text-neutral-600"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                      />
                  </label>

                  <button 
                      type="submit" 
                      disabled={loading}
                      className="mt-6 flex h-14 w-full items-center justify-center rounded-xl bg-white text-black text-[15px] font-bold transition-colors hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  >
                      {loading ? 'Signing in...' : 'Sign in as Admin'}
                  </button>
              </form>
            )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
