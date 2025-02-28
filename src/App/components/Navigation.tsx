import React, { useState } from 'react';
import { GraduationCap, Home, Info, LayoutDashboard, Shield, User, MessageSquare, Menu, X } from 'lucide-react';
import { NavLink } from './NavLink';
import { useAuth } from '../../components/AuthContext';
import { supabase } from '../../lib/supabase';
import { useNavigate, useLocation } from 'react-router-dom';

interface NavigationProps {
  isSuperAdmin: boolean;
  isAdmin: boolean;
  showDashboard: boolean;
  showProfile: boolean;
  setShowDashboard: (show: boolean) => void;
  setShowProfile: (show: boolean) => void;
  setShowAuth: (show: boolean) => void;
}

export function Navigation({
  isSuperAdmin,
  isAdmin,
  showDashboard,
  showProfile,
  setShowDashboard,
  setShowProfile,
  setShowAuth
}: NavigationProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleContactClick = async () => {
    setShowDashboard(false);
    setShowProfile(false);
    
    // If already on about page, just scroll
    if (location.pathname === '/about') {
      const contactSection = document.getElementById('connect-with-us');
      if (contactSection) {
        contactSection.scrollIntoView({ block: 'start' });
      }
    } else {
      // Navigate to about page and then scroll
      await navigate('/about');
      // Wait for navigation to complete
      setTimeout(() => {
        const contactSection = document.getElementById('connect-with-us');
        if (contactSection) {
          contactSection.scrollIntoView({ block: 'start' });
        }
      }, 100); // Reduced timeout since we don't need to wait for smooth scrolling
    }
  };

  const handleNavClick = (action: () => void) => {
    action();
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    {
      icon: <Home className="h-5 w-5" />,
      text: "Home",
      onClick: () => {
        setShowDashboard(false);
        setShowProfile(false);
        navigate('/');
      }
    },
    {
      icon: <Info className="h-5 w-5" />,
      text: "About",
      onClick: () => {
        setShowDashboard(false);
        setShowProfile(false);
        navigate('/about');
      }
    },
    {
      icon: <MessageSquare className="h-5 w-5" />,
      text: "Contact Us",
      onClick: handleContactClick
    }
  ];

  if (user) {
    if (isSuperAdmin) {
      navItems.push({
        icon: <Shield className="h-5 w-5" />,
        text: "Super Admin",
        onClick: () => {
          setShowDashboard(true);
          setShowProfile(false);
        }
      });
    } else if (isAdmin) {
      navItems.push({
        icon: <LayoutDashboard className="h-5 w-5" />,
        text: "Dashboard",
        onClick: () => {
          setShowDashboard(true);
          setShowProfile(false);
        }
      });
    } else {
      navItems.push({
        icon: <User className="h-5 w-5" />,
        text: "Profile",
        onClick: () => {
          setShowDashboard(false);
          setShowProfile(true);
        }
      });
    }
  }

  return (
    <nav className="bg-indigo-600 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <GraduationCap className="h-8 w-8" />
            <span className="ml-2 text-xl font-bold">Admissions.app</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <NavLink
                key={index}
                icon={item.icon}
                text={item.text}
                onClick={() => handleNavClick(item.onClick)}
              />
            ))}
            {user ? (
              <button
                onClick={() => supabase.auth.signOut()}
                className="text-white hover:text-indigo-200 transition-colors duration-200"
              >
                Sign Out
              </button>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                className="text-white hover:text-indigo-200 transition-colors duration-200"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-white"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-indigo-500">
            {navItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleNavClick(item.onClick)}
                className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-indigo-700 rounded-md transition-colors"
              >
                {item.icon}
                <span>{item.text}</span>
              </button>
            ))}
            {user ? (
              <button
                onClick={() => {
                  supabase.auth.signOut();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-indigo-700 rounded-md transition-colors"
              >
                Sign Out
              </button>
            ) : (
              <button
                onClick={() => {
                  setShowAuth(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-indigo-700 rounded-md transition-colors"
              >
                Sign In
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}