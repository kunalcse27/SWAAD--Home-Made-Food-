import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { getFirebaseAuth } from '../services/firebase';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole]       = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    let unsubscribe = () => {};

    // Wait for Firebase to initialize (fetches config from backend), then subscribe to auth state
    getFirebaseAuth().then((firebaseAuth) => {
      unsubscribe = onAuthStateChanged(firebaseAuth, async (firebaseUser) => {
        if (firebaseUser) {
          try {
            // Force-refresh token to get latest custom claims (role set by backend on signup/login)
            const tokenResult = await firebaseUser.getIdTokenResult(true);
            const claimRole = tokenResult.claims.role || 'customer';

            // Fetch full profile from backend (for name, inviteCode, etc.)
            const res = await authAPI.me();
            const profile = res.data;

            setCurrentUser(firebaseUser);
            setUserRole(profile.role || claimRole);
            setUserProfile(profile);
          } catch (err) {
            console.error('AuthContext: failed to load user profile', err.message);
            // Fall back to Firebase claims only if backend is unreachable
            try {
              const tokenResult = await firebaseUser.getIdTokenResult(false);
              setCurrentUser(firebaseUser);
              setUserRole(tokenResult.claims.role || 'customer');
              setUserProfile(null);
            } catch {
              await firebaseAuth.signOut();
              setCurrentUser(null);
              setUserRole(null);
              setUserProfile(null);
            }
          }
        } else {
          setCurrentUser(null);
          setUserRole(null);
          setUserProfile(null);
        }
        setLoading(false);
      });
    }).catch((err) => {
      console.error('AuthContext: Firebase init failed', err.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    currentUser,
    userRole,
    userProfile,
    loading,
    isAuthenticated: !!currentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}
