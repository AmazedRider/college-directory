import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Navigation } from './components/Navigation';
import { HomePage } from './pages/HomePage';
import { ConsultanciesPage } from './components/ConsultanciesPage';
import { AgencyPage } from './pages/AgencyPage';
import { ContactPage } from './pages/ContactPage';
import { AboutPage } from './pages/AboutPage';
import { BlogPage } from './pages/BlogPage';
import { ScholarshipFinderPage } from './pages/ScholarshipFinderPage';
import { TrackPage } from './pages/TrackPage';
import { CourseFinderPage } from './pages/CourseFinderPage';
import { KnowledgeHubPage } from './pages/KnowledgeHubPage';
import { GuidePage } from './pages/GuidePage';
import { SignInPage } from './pages/SignInPage';
import { CreateAccountPage } from './pages/CreateAccountPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { Auth } from '../components/Auth';
import { Toaster } from 'react-hot-toast';

export function App() {
  const [showDashboard, setShowDashboard] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authIsSignUp, setAuthIsSignUp] = useState(false);
  const location = useLocation();
  
  // Define a function to handle both showing auth and setting the signup/signin mode
  const handleSetShowAuth = (show: boolean, isSignUp?: boolean) => {
    console.log("handleSetShowAuth called with:", { show, isSignUp });
    setShowAuth(show);
    if (isSignUp !== undefined) {
      setAuthIsSignUp(isSignUp);
    }
    console.log("Auth state after update:", { showAuth: show, authIsSignUp: isSignUp !== undefined ? isSignUp : authIsSignUp });
  };
  
  // Set showAuth based on location state when navigating
  useEffect(() => {
    if (location.state && 'showAuth' in location.state) {
      setShowAuth(true);
      if ('isSignUp' in location.state) {
        setAuthIsSignUp(!!location.state.isSignUp);
      }
    }
  }, [location]);
  
  // Create a TrackPageElement that can be reused for both routes
  const TrackPageElement = <TrackPage />;
  
  return (
      <div className="min-h-screen bg-gray-50">
        <Navigation 
          isSuperAdmin={false}
          isAdmin={false}
          showDashboard={showDashboard}
          showProfile={showProfile}
          setShowDashboard={setShowDashboard}
          setShowProfile={setShowProfile}
        setShowAuth={handleSetShowAuth}
        />
        
      {showAuth && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Auth onClose={() => setShowAuth(false)} initialIsSignUp={authIsSignUp} />
        </div>
      )}
        
        <Routes>
        <Route path="/" element={<HomePage setShowAuth={handleSetShowAuth} />} />
          <Route path="/agencies" element={<ConsultanciesPage />} />
          <Route path="/agency/:slug" element={<AgencyPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/scholarships" element={<ScholarshipFinderPage />} />
          <Route path="/track" element={TrackPageElement} />
        <Route path="/application-tracker" element={<Navigate to="/track" replace />} />
          <Route path="/course-finder" element={<CourseFinderPage />} />
          <Route path="/knowledge-hub" element={<KnowledgeHubPage />} />
          <Route path="/knowledge-hub/:slug" element={<GuidePage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/create-account" element={<CreateAccountPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/signup" element={<Navigate to="/create-account" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      
      <Toaster position="top-center" />
      </div>
  );
} 

// Add default export for compatibility with import in main.tsx
export default App; 