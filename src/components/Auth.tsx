import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Mail, Lock, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import './AuthModal.css';

interface AuthProps {
  onClose: () => void;
  initialIsSignUp?: boolean;
}

export function Auth({ onClose, initialIsSignUp }: AuthProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(initialIsSignUp || false);
  
  // Update isSignUp when initialIsSignUp prop changes
  useEffect(() => {
    if (initialIsSignUp !== undefined) {
      setIsSignUp(initialIsSignUp);
    }
  }, [initialIsSignUp]);
  
  const location = useLocation();

  useEffect(() => {
    // Check if we're coming from a redirect with a state
    if (location.state && 'isSignUp' in location.state) {
      setIsSignUp(!!location.state.isSignUp);
    }
    
    // Also check window.history.state for direct updates
    if (window.history.state && 'isSignUp' in window.history.state) {
      setIsSignUp(!!window.history.state.isSignUp);
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (signUpError) throw signUpError;
        toast.success('Account created successfully! You can now log in.');
        setIsSignUp(false);
      } else {
        // Sign in the user
        const { error: signInError, data: { user } } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;

        // Fetch the user's profile to check admin status
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('is_admin, is_super_admin')
          .eq('id', user?.id)
          .single();

        if (profileError) throw profileError;

        // Show appropriate success message based on role
        if (profile.is_super_admin) {
          toast.success('Welcome back, Super Admin!');
        } else if (profile.is_admin) {
          toast.success('Welcome back, Admin!');
        } else {
          toast.success('Logged in successfully!');
        }
        
        onClose();
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast.error(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin }
      });
      if (error) throw error;
      // The user will be redirected, so no need to close the modal here
    } catch (error) {
      console.error('Google sign-in error:', error);
      toast.error(error instanceof Error ? error.message : 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md animated-auth-modal">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 animate-fade-in">
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      {/* Google Sign In Button */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 py-2 mb-4 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 shadow transition-all duration-300 text-base font-semibold google-auth-btn animate-float"
      >
        <FcGoogle size={24} />
        {loading ? 'Please wait...' : 'Sign in with Google'}
      </button>
      <div className="relative flex items-center my-4">
        <span className="flex-grow border-t border-gray-200"></span>
        <span className="mx-2 text-gray-400 text-xs">or</span>
        <span className="flex-grow border-t border-gray-200"></span>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="••••••••"
              minLength={6}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
        </button>

        <div className="text-center">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
          >
            {isSignUp
              ? 'Already have an account? Sign in'
              : "Don't have an account? Sign up"}
          </button>
        </div>
      </form>
    </div>
  );
}