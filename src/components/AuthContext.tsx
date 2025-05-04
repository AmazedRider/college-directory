import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: Error | null;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, error: null });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    // Get initial session
    const initializeAuth = async () => {
      try {
        // Add timeout protection to prevent hanging requests
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('Authentication request timed out')), 5000);
        });

        const authPromise = supabase.auth.getSession();
        
        // Race the auth request against a timeout
        const result = await Promise.race([authPromise, timeoutPromise]) as any;
        const { data: { session } = {}, error: sessionError } = result || {};
        
        if (sessionError) throw sessionError;
        
        if (mounted) {
          setUser(session?.user ?? null);
          setError(null);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to initialize authentication'));
          // Don't show toast on production to avoid distracting users
          if (import.meta.env.DEV) {
            toast.error('Unable to connect to authentication service. Using anonymous mode.');
          }
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes with error handling
    let subscription: { unsubscribe: () => void } | null = null;
    
    try {
      const { data } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (mounted) {
          setUser(session?.user ?? null);
          setError(null);
        }
      });
      
      subscription = data.subscription;
    } catch (err) {
      console.error('Error setting up auth listener:', err);
    }

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);