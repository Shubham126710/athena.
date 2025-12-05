import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DitherHero from '../components/DitherHero';

export default function Register() {
  const nav = useNavigate();
  const { signUp } = useAuth();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    uid: '',
    email: '',
    gender: 'male',
    role: 'admin', // Default as per request
    section: '23AML-5',
    avatarSeed: 'Felix',
    adminCode: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const avatarOptions = [
    { id: 'Felix', label: 'Felix' },
    { id: 'Aneka', label: 'Aneka' },
    { id: 'Zoe', label: 'Zoe' },
    { id: 'Jack', label: 'Jack' },
    { id: 'Sam', label: 'Sam' }
  ];

  function handleChange(e) {
    setFormData(prev => ({
        ...prev,
        [e.target.name]: e.target.value
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
        return setError('Passwords do not match');
    }

    if (formData.role === 'admin' && formData.adminCode !== 'SHERLOCKED') {
        return setError('Invalid Admin Code. You are not authorized to be an admin.');
    }

    setError('');
    setLoading(true);

    try {
      await signUp(formData.email, formData.password, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        uid: formData.uid,
        gender: formData.gender,
        role: formData.role,
        section: formData.section,
        avatarSeed: formData.avatarSeed
      });
      nav('/hub');
    } catch (err) {
      setError('Failed to create account: ' + err.message);
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
                <h2 className="text-4xl font-bold mb-4">Join Athena.</h2>
                <p className="text-neutral-400 max-w-md">
                    Create your account to start organizing your academic life.
                </p>
            </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 overflow-y-auto bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
        <div className="w-full max-w-md space-y-8 my-auto animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="text-center lg:text-left">
                <h1 className="text-3xl font-bold tracking-tight">Create an account</h1>
                <p className="mt-2 text-neutral-400">
                    Already have an account? <Link to="/login" className="text-white underline hover:text-neutral-300">Sign in</Link>
                </p>
            </div>

            {error && (
                <div className="bg-red-900/20 border border-red-900/50 text-red-200 p-4 rounded text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-neutral-300 mb-2">First Name</label>
                        <input 
                            type="text"
                            name="firstName"
                            required 
                            className="w-full bg-neutral-900 border border-neutral-800 rounded p-3 text-white focus:outline-none focus:border-white transition-colors"
                            placeholder="John"
                            value={formData.firstName}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-300 mb-2">Last Name</label>
                        <input 
                            type="text"
                            name="lastName"
                            required 
                            className="w-full bg-neutral-900 border border-neutral-800 rounded p-3 text-white focus:outline-none focus:border-white transition-colors"
                            placeholder="Doe"
                            value={formData.lastName}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">University ID (UID)</label>
                    <input 
                        type="text"
                        name="uid"
                        required 
                        className="w-full bg-neutral-900 border border-neutral-800 rounded p-3 text-white focus:outline-none focus:border-white transition-colors"
                        placeholder="23BAI70540"
                        value={formData.uid}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">Section</label>
                    <select 
                        name="section"
                        className="w-full bg-neutral-900 border border-neutral-800 rounded p-3 text-white focus:outline-none focus:border-white transition-colors appearance-none"
                        value={formData.section}
                        onChange={handleChange}
                    >
                        <option value="23AML-1">23AML-1</option>
                        <option value="23AML-2">23AML-2</option>
                        <option value="23AML-3">23AML-3</option>
                        <option value="23AML-4">23AML-4</option>
                        <option value="23AML-5">23AML-5 (Default)</option>
                        <option value="23AML-6">23AML-6</option>
                        <option value="23AML-7">23AML-7</option>
                        <option value="23AML-8">23AML-8</option>
                        <option value="23AML-9">23AML-9</option>
                        <option value="23AML-10">23AML-10</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">Choose Avatar</label>
                    <div className="flex gap-4 overflow-x-auto pb-2">
                        {avatarOptions.map((avatar) => (
                            <div 
                                key={avatar.id}
                                onClick={() => setFormData(prev => ({ ...prev, avatarSeed: avatar.id }))}
                                className={`flex-shrink-0 cursor-pointer rounded-full p-1 border-2 transition-all ${formData.avatarSeed === avatar.id ? 'border-white scale-110' : 'border-transparent opacity-50 hover:opacity-100'}`}
                            >
                                <img 
                                    src={`https://api.dicebear.com/7.x/notionists/svg?seed=${avatar.id}`} 
                                    alt={avatar.label} 
                                    className="w-12 h-12 rounded-full bg-neutral-800"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">Email address</label>
                    <input 
                        type="email"
                        name="email"
                        required 
                        className="w-full bg-neutral-900 border border-neutral-800 rounded p-3 text-white focus:outline-none focus:border-white transition-colors"
                        placeholder="student@university.edu"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-neutral-300 mb-2">Gender</label>
                        <select 
                            name="gender"
                            className="w-full bg-neutral-900 border border-neutral-800 rounded p-3 text-white focus:outline-none focus:border-white transition-colors appearance-none"
                            value={formData.gender}
                            onChange={handleChange}
                        >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-300 mb-2">Role</label>
                        <select 
                            name="role"
                            className="w-full bg-neutral-900 border border-neutral-800 rounded p-3 text-white focus:outline-none focus:border-white transition-colors appearance-none"
                            value={formData.role}
                            onChange={handleChange}
                        >
                            <option value="admin">Admin (Uploader)</option>
                            <option value="student">Student (Read Only)</option>
                        </select>
                    </div>
                </div>

                {formData.role === 'admin' && (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                        <label className="block text-sm font-medium text-amber-500 mb-2">Admin Access Code</label>
                        <input 
                            type="password"
                            name="adminCode"
                            required 
                            className="w-full bg-neutral-900 border border-amber-500/50 rounded p-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                            placeholder="Enter admin code"
                            value={formData.adminCode}
                            onChange={handleChange}
                        />
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">Password</label>
                    <input 
                        type="password"
                        name="password"
                        required 
                        className="w-full bg-neutral-900 border border-neutral-800 rounded p-3 text-white focus:outline-none focus:border-white transition-colors"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">Confirm Password</label>
                    <input 
                        type="password"
                        name="confirmPassword"
                        required 
                        className="w-full bg-neutral-900 border border-neutral-800 rounded p-3 text-white focus:outline-none focus:border-white transition-colors"
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-white text-black font-bold py-3 rounded hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Creating account...' : 'Create Account'}
                </button>

                <p className="mt-6 text-center text-neutral-400 text-sm">
                    Already have an account?{' '}
                    <Link to="/login" className="text-white hover:underline">
                        Sign in
                    </Link>
                </p>
            </form>
        </div>
      </div>
    </div>
  );
}
