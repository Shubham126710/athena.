import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id);
      } else {
        const guestData = localStorage.getItem('guest_user');
        if (guestData) {
          const guestProfile = JSON.parse(guestData);
          setUser({ id: 'guest' });
          setProfile(guestProfile);
        }
        setLoading(false);
      }
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        fetchProfile(session.user.id);
      } else {
        const guestData = localStorage.getItem('guest_user');
        if (guestData) {
          const guestProfile = JSON.parse(guestData);
          setUser({ id: 'guest' });
          setProfile(guestProfile);
        } else {
          setUser(null);
          setProfile(null);
        }
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function signInGuest(firstName, uid) {
    const guestProfile = {
      id: 'guest',
      first_name: firstName,
      uid: uid,
      role: 'guest',
      avatar_seed: firstName
    };
    localStorage.setItem('guest_user', JSON.stringify(guestProfile));
    setUser({ id: 'guest' });
    setProfile(guestProfile);
  }

  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  }

  async function signOut() {
    localStorage.removeItem('guest_user');
    if (user?.id !== 'guest') {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    }
    setUser(null);
    setProfile(null);
  }

  async function updateProfile(updates) {
    if (!user || user.id === 'guest') return;
    
    // Optimistic update
    const previousProfile = profile;
    setProfile(prev => ({ ...prev, ...updates }));

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) {
        console.error('Error updating profile in DB:', error);
        // Revert on error
        setProfile(previousProfile);
        throw error;
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setProfile(previousProfile);
      throw error;
    }
  }

  const value = {
    user,
    profile,
    signInGuest,
    signIn,
    signOut,
    updateProfile,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
