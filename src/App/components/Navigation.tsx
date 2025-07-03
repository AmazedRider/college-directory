import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { GraduationCap, Home, Book, LayoutDashboard, Shield, User, MessageSquare, Menu, X, BookOpen, ChevronDown, Search, Award, Map, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../../components/AuthContext';
import { supabase } from '../../lib/supabase';
import ReactDOM from 'react-dom';
import './Navigation.css';

interface NavigationProps {
  isSuperAdmin: boolean;
  isAdmin: boolean;
  showProfile: boolean;
  setShowProfile: (show: boolean) => void;
  setShowAuth: (show: boolean, isSignUp?: boolean) => void;
}

interface NavItem {
  icon: React.ReactNode;
  text: string;
  path: string;
  onClick: () => void;
  isDropdown?: boolean;
  dropdownName?: string;
  dropdownItems?: {
    text: string;
    description: string;
    path: string;
    onClick: () => void;
  }[];
}

export function Navigation({
  isSuperAdmin,
  isAdmin,
  showProfile,
  setShowProfile,
  setShowAuth
}: NavigationProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{ left: number; top: number; width: number } | null>(null);
  const dropdownRefs = {
    overseas: useRef<HTMLDivElement>(null),
    resources: useRef<HTMLDivElement>(null)
  };
  const navBarRef = useRef<HTMLDivElement>(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const profileBtnRef = useRef<HTMLButtonElement>(null);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeDropdown) {
        const activeRef = dropdownRefs[activeDropdown as keyof typeof dropdownRefs];
        if (activeRef?.current && !activeRef.current.contains(event.target as Node)) {
          // Check if the click is on a dropdown item
          const target = event.target as Element;
          if (target.closest('.dropdown-item')) {
            return; // Don't close if clicking on dropdown item
          }
          console.log("Click outside dropdown:", activeDropdown);
          setActiveDropdown(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeDropdown]);

  const handleNavClick = (action: () => void) => {
    action();
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  const handleDropdownOpen = (dropdownName: string, ref: React.RefObject<HTMLDivElement>) => {
    setActiveDropdown(dropdownName);
    if (ref.current) {
      const pillRect = ref.current.getBoundingClientRect();
      const dropdownWidth = 576;
      const viewportWidth = window.innerWidth;
      // Center dropdown to pill
      let left = pillRect.left + pillRect.width / 2 - dropdownWidth / 2;
      // Clamp to viewport
      if (left + dropdownWidth > viewportWidth - 8) left = viewportWidth - dropdownWidth - 8;
      if (left < 8) left = 8;
      setDropdownPosition({
        left,
        top: pillRect.bottom + window.scrollY + 8,
        width: Math.min(dropdownWidth, viewportWidth - 16),
      });
    }
  };

  const navItems: NavItem[] = [
    {
      icon: <Home className="h-5 w-5" />,
      text: "Home",
      path: "/",
      onClick: () => navigate('/')
    },
    {
      icon: <Map className="h-5 w-5" />,
      text: "Consultancies",
      path: "/agencies",
      onClick: () => navigate('/agencies')
    },
    {
      icon: <Award className="h-5 w-5" />,
      text: "Scholarships",
      path: "/scholarship-finder",
      onClick: () => navigate('/scholarship-finder')
    },
    {
      icon: <GraduationCap className="h-5 w-5" />,
      text: "Universities",
      path: "/course-finder",
      onClick: () => navigate('/course-finder')
    },
    {
      icon: <MessageSquare className="h-5 w-5" />,
      text: "AI Assistant",
      path: "/ai-assistant",
      onClick: () => navigate('/ai-assistant')
    }
  ];

  if (user) {
    if (isSuperAdmin) {
      navItems.push({
        icon: <Shield className="h-5 w-5" />,
        text: "Super Admin",
        path: "/dashboard",
        onClick: () => navigate('/dashboard')
      });
    } else if (isAdmin) {
      navItems.push({
        icon: <LayoutDashboard className="h-5 w-5" />,
        text: "Dashboard",
        path: "/dashboard",
        onClick: () => navigate('/dashboard')
      });
    }
  }

  // Add a function to generate a color from a string (for avatar background)
  function stringToColor(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff;
      color += ('00' + value.toString(16)).slice(-2);
    }
    return color;
  }

  return (
    <nav className="sticky top-0 z-50 w-full flex justify-center py-4 px-2 bg-transparent overflow-x-hidden">
      <div ref={navBarRef} className="w-full max-w-[1300px] flex items-center justify-between rounded-full glass-nav-animated shadow-2xl border border-white/30 px-6 py-2 transition-all duration-300 hover:scale-[1.025] hover:shadow-3xl group">
        {/* Logo left */}
        <div className="flex-shrink-0 flex items-center">
          <Link to="/">
            <span className="text-2xl font-bold text-primary cursor-pointer select-none">
              Admissions<span className="text-secondary">.app</span>
            </span>
          </Link>
        </div>
        {/* Nav pills center */}
        <div className="flex-1 flex items-center justify-center gap-2 flex-nowrap overflow-x-visible">
          {/* Home and Consultancy Directory */}
          {navItems.slice(0,2).map((item, index) => (
            <Link
              key={item.text}
              to={item.path}
              className={`inline-flex items-center justify-center min-w-[110px] max-w-[140px] px-3 py-1.5 text-sm font-bold transition-all rounded-full glass-nav-item shadow-sm border border-white/20 backdrop-blur-md h-10 ${
                location.pathname === item.path
                  ? 'text-primary bg-white/40'
                  : 'text-gray-700 hover:text-primary hover:bg-white/30'
              }`}
            >
              {item.icon}
              <span className="ml-1.5">{item.text}</span>
            </Link>
          ))}
          {/* Finder Group */}
          <div className="flex gap-1 px-1 py-1 rounded-full bg-white/30 border border-white/30">
            {navItems.slice(2, 4).map((item) => (
              <Link
                key={item.text}
                to={item.path}
                className={`inline-flex items-center justify-center min-w-[110px] max-w-[140px] px-3 py-1.5 text-sm font-bold transition-all rounded-full glass-nav-item shadow-sm border border-white/20 backdrop-blur-md h-10 ${
                  location.pathname === item.path
                    ? 'text-primary bg-white/40'
                    : 'text-gray-700 hover:text-primary hover:bg-white/30'
                }`}
              >
                {item.icon}
                <span className="ml-1.5">{item.text}</span>
              </Link>
            ))}
          </div>
          {/* AI Assistant */}
          <Link
            to="/ai-assistant"
            className={`inline-flex items-center px-5 py-2 text-sm font-bold rounded-full glass-nav-item shadow-sm border border-white/20 backdrop-blur-md h-11 whitespace-nowrap transition-all ${
              location.pathname === '/ai-assistant'
                ? 'text-primary bg-white/40'
                : 'text-gray-700 hover:text-primary hover:bg-white/30'
            }`}
          >
            <MessageSquare className="h-5 w-5 mr-1" />
            AI Assistant
          </Link>
        </div>
        {/* Auth buttons right */}
        <div className="flex items-center gap-2 ml-4 h-10">
          {user ? (
            <>
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 hover:bg-white shadow border border-gray-200 transition-all duration-200 profile-nav-btn focus:outline-none focus:ring-2 focus:ring-primary text-gray-700"
                style={{ minWidth: 0 }}
                title="Dashboard"
                tabIndex={0}
                onClick={() => navigate('/dashboard')}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="font-semibold whitespace-nowrap">
                  Dashboard
                </span>
              </button>
              <button
                ref={profileBtnRef}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 hover:bg-red-100 shadow border border-red-200 transition-all duration-200 profile-nav-btn focus:outline-none focus:ring-2 focus:ring-red-500 text-red-700"
                style={{ minWidth: 0 }}
                title="Logout"
                tabIndex={0}
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" />
                <span className="font-semibold whitespace-nowrap">
                  Logout
                </span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setShowAuth(true, false)}
                className="inline-flex items-center justify-center min-w-[110px] max-w-[140px] px-3 py-1.5 text-sm font-bold rounded-full glass-blue h-10 whitespace-nowrap nav-auth-cta transition-all"
              >
                Sign In
              </button>
              <button
                onClick={() => setShowAuth(true, true)}
                className="inline-flex items-center justify-center min-w-[110px] max-w-[140px] px-3 py-1.5 text-sm font-bold rounded-full glass-blue h-10 whitespace-nowrap nav-auth-cta transition-all"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}