import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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
import { Chatbot } from '../components/Chatbot/Chatbot';
import { ChatbotProvider } from '../components/Chatbot/ChatbotContext';
import toast from 'react-hot-toast';
import { BlogPost } from './pages/BlogPost';
import { useGoogleAnalytics } from '../lib/hooks/useGoogleAnalytics';
import ConsultanciesPage from './pages/ConsultanciesPage';
import { ChatbotButton } from '../components/Chatbot/ChatbotButton';
import { CourseFinderPage } from './pages/CourseFinderPage';
import { KnowledgeHubPage } from './pages/KnowledgeHubPage';
import { GuidePage } from './pages/GuidePage';
import { ScholarshipFinderPage } from './pages/ScholarshipFinderPage';
import { VisaInfoPage } from './pages/VisaInfoPage';
import DashboardPage from './pages/DashboardPage';
import { ExamBlogsPage } from './pages/ExamBlogsPage';
import AIAssistantPage from './pages/AIAssistantPage';
import { Typewriter } from 'react-simple-typewriter';
// import { FindBuddyPage } from './pages/FindBuddyPage';

// Define page components directly to avoid import errors
// Commented out as we now have the proper component
// const FindBuddyPage = () => (
//   <div className="min-h-screen bg-gray-50">
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//       <div className="text-center mb-8">
//         <h1 className="text-3xl font-bold text-gray-900">Find a Buddy</h1>
//         <p className="mt-4 text-lg text-gray-600">
//           Connect with students heading to the same destination
//         </p>
//       </div>
//     </div>
//   </div>
// );

function App() {
  const { user, loading, error } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [authIsSignUp, setAuthIsSignUp] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize Google Analytics
  useGoogleAnalytics();
  
  // Set showAuth and handle signup state
  const handleSetShowAuth = (show: boolean, isSignUp?: boolean) => {
    setShowAuth(show);
    if (isSignUp !== undefined) {
      setAuthIsSignUp(isSignUp);
    }
  };

  useEffect(() => {
    if (user) {
      checkAdminStatus();
    } else {
      setIsSuperAdmin(false);
      setIsAdmin(false);
      setIsCheckingAdmin(false);
    }
  }, [user]);

  useEffect(() => {
    // Show loading screen for 2.5 seconds
    const timer = setTimeout(() => setIsLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

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

  // Modern animated loading screen
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black transition-opacity duration-700" style={{ opacity: isLoading ? 1 : 0 }}>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow-lg text-center animate-typewriter overflow-hidden whitespace-nowrap border-r-4 border-white pr-2" style={{ maxWidth: 'min(90vw, 700px)' }}>
          <Typewriter
            words={[`"if it's not here, it's not there!!!"`]}
            loop={0}
            cursor
            cursorStyle="|"
            typeSpeed={60}
            deleteSpeed={40}
            delaySpeed={1800}
          />
        </h1>
      </div>
    );
  }

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

  return (
    <ChatbotProvider>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navigation
          isSuperAdmin={isSuperAdmin}
          isAdmin={isAdmin}
          showProfile={showProfile}
          setShowProfile={setShowProfile}
          setShowAuth={handleSetShowAuth}
        />

        {showAuth && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Auth onClose={() => setShowAuth(false)} initialIsSignUp={authIsSignUp} />
          </div>
        )}

        {showProfile && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <UserProfile onClose={() => setShowProfile(false)} />
          </div>
        )}

        <Routes>
          <Route path="/" element={<HomePage setShowAuth={handleSetShowAuth} />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/post/:id" element={<BlogPost />} />
          <Route path="/agency/:slug" element={<AgencyPage />} />
          <Route path="/agencies" element={<ConsultanciesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/course-finder" element={<CourseFinderPage />} />
          <Route path="/knowledge-hub" element={<KnowledgeHubPage />} />
          <Route path="/language-prep" element={<Navigate to="/knowledge-hub?tab=exam" replace />} />
          <Route path="/knowledge-hub/:slug" element={<GuidePage />} />
          <Route path="/scholarship-finder" element={<ScholarshipFinderPage />} />
          <Route path="/visa-info" element={<VisaInfoPage />} />
          <Route 
            path="/dashboard" 
            element={
              user ? (
                isSuperAdmin ? (
                  <SuperAdminDashboard />
                ) : isAdmin ? (
                  <AdminDashboard />
                ) : (
                  <DashboardPage />
                )
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          <Route path="/exam-blog" element={<ExamBlogsPage />} />
          <Route path="/ai-assistant" element={<AIAssistantPage />} />
        </Routes>

        <Footer />
        <ChatbotButton />
        <Chatbot />
      </div>
    </ChatbotProvider>
  );
}

export default App;
