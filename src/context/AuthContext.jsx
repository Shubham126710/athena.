import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { signInWithEmailAndPassword, signOut as firebaseSignOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchProfile(currentUser.uid);
      } else {
        const guestData = localStorage.getItem('guest_user');
        if (guestData) {
          const guestProfile = JSON.parse(guestData);
          setUser({ uid: 'guest', id: 'guest' });
          setProfile(guestProfile);
        } else {
          setUser(null);
          setProfile(null);
        }
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  async function fetchProfile(userId) {
    try {
      const docRef = doc(db, 'profiles', userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setProfile({ id: docSnap.id, ...docSnap.data() });
      } else {
        // Auto-create profile if it doesn't exist (e.g. first time admin login)
        const newProfile = {
          first_name: 'Admin',
          role: 'admin',
          avatar_seed: userId
        };
        await setDoc(docRef, newProfile);
        setProfile({ id: userId, ...newProfile });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  }

  async function signInGuest(firstName, uid, avatarSeed) {
    const guestProfile = {
      id: 'guest',
      uid: uid || 'guest',
      first_name: firstName,
      role: 'guest',
      avatar_seed: avatarSeed || firstName
    };
    localStorage.setItem('guest_user', JSON.stringify(guestProfile));
    setUser({ uid: 'guest', id: 'guest' });
    setProfile(guestProfile);
  }

  async function signIn(email, password) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  }

  async function signOut() {
    localStorage.removeItem('guest_user');
    if (user && user.uid !== 'guest') {
      await firebaseSignOut(auth);
    }
    setUser(null);
    setProfile(null);
  }

  async function updateProfile(updates) {
    if (!user) return;
    
    // Optimistic update
    const previousProfile = profile;
    const newProfile = { ...previousProfile, ...updates };
    setProfile(newProfile);

    if (user.uid === 'guest' || user.id === 'guest') {
      localStorage.setItem('guest_user', JSON.stringify(newProfile));
      return;
    }

    try {
      const docRef = doc(db, 'profiles', user.uid);
      await updateDoc(docRef, updates);
    } catch (error) {
      console.error('Error updating profile in DB:', error);
      // Revert on error
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
