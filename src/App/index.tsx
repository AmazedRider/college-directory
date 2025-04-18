import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import { supabase } from '../lib/supabase';
import { Auth } from '../components/Auth';
import { AdminDashboard } from '../components/AdminDashboard';
import { SuperAdminDashboard } from '../components/SuperAdminDashboard';
import { UserProfile } from '../components/UserProfile';
import { Navigation } from './components/Navigation';
import { HomePage } from './pages/HomePage';
import { AgencyPage } from './pages/AgencyPage';
import { AboutPage } from './pages/AboutPage';
import { BlogPage } from './pages/BlogPage';
import { ContactPage } from './pages/ContactPage';
import { Footer } from './components/Footer';
import toast from 'react-hot-toast';
import { BlogPost } from './pages/BlogPost';
import { useGoogleAnalytics } from '../lib/hooks/useGoogleAnalytics';

function App() {
  const { user, loading, error } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);

  // Initialize Google Analytics
  useGoogleAnalytics();

  useEffect(() => {
    if (user) {
      checkAdminStatus();
    } else {
      setIsSuperAdmin(false);
      setIsAdmin(false);
      setIsCheckingAdmin(false);
    }
  }, [user]);

  const checkAdminStatus = async () => {
    try {
      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('is_admin, is_super_admin')
        .eq('id', user?.id)
        .single();

      if (profileError) {
        if (profileError.code === 'PGRST116') {
          setIsSuperAdmin(false);
          setIsAdmin(false);
        } else {
          throw profileError;
        }
      } else {
        setIsSuperAdmin(data?.is_super_admin || false);
        setIsAdmin(data?.is_admin || false);
      }
    } catch (err) {
      console.error('Error checking admin status:', err);
      if (!(err instanceof Error && err.message === 'Failed to fetch')) {
        toast.error('Unable to verify admin status. Please try again later.');
      }
      setIsSuperAdmin(false);
      setIsAdmin(false);
    } finally {
      setIsCheckingAdmin(false);
    }
  };

  if (loading || isCheckingAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">Unable to connect to the service</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // If trying to access dashboard but not authorized
  if (showDashboard && !user?.email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">Access Denied</p>
          <p className="text-gray-600 mb-4">
            Please sign in to access the dashboard.
          </p>
          <button
            onClick={() => {
              setShowDashboard(false);
              setShowAuth(true);
            }}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  // If trying to access super admin dashboard but not a super admin
  if (
    showDashboard &&
    !isSuperAdmin &&
    user?.email === 'superadmin@superadmin.com'
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">Access Denied</p>
          <p className="text-gray-600 mb-4">
            You do not have permission to access the Super Admin Dashboard.
          </p>
          <button
            onClick={() => setShowDashboard(false)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation
        isSuperAdmin={isSuperAdmin}
        isAdmin={isAdmin}
        showDashboard={showDashboard}
        showProfile={showProfile}
        setShowDashboard={setShowDashboard}
        setShowProfile={setShowProfile}
        setShowAuth={setShowAuth}
      />

      {showAuth && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Auth onClose={() => setShowAuth(false)} />
        </div>
      )}

      {showProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <UserProfile onClose={() => setShowProfile(false)} />
        </div>
      )}

      {showDashboard ? (
        isSuperAdmin ? (
          <SuperAdminDashboard />
        ) : isAdmin ? (
          <AdminDashboard />
        ) : (
          <HomePage />
        )
      ) : (
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/post/:id" element={<BlogPost />} />
          <Route path="/agency/:slug" element={<AgencyPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      )}

      <Footer />
    </div>
  );
}

export default App;
