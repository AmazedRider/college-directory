import React from 'react';
import { GraduationCap, Home, Search, Info, LayoutDashboard, Shield, User } from 'lucide-react';
import { NavLink } from './NavLink';
import { useAuth } from '../../components/AuthContext';
import { supabase } from '../../lib/supabase';

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

  return (
    <nav className="bg-indigo-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <GraduationCap className="h-8 w-8" />
            <span className="ml-2 text-xl font-bold">Admissions.app</span>
          </div>
          <div className="flex items-center space-x-8">
            <NavLink icon={<Home className="h-5 w-5" />} text="Home" onClick={() => {
              setShowDashboard(false);
              setShowProfile(false);
            }} />
            <NavLink icon={<Search className="h-5 w-5" />} text="Search" onClick={() => {
              setShowDashboard(false);
              setShowProfile(false);
            }} />
            <NavLink icon={<Info className="h-5 w-5" />} text="About" onClick={() => {
              setShowDashboard(false);
              setShowProfile(false);
            }} />
            {user && (
              <>
                {isSuperAdmin ? (
                  <NavLink
                    icon={<Shield className="h-5 w-5" />}
                    text="Super Admin"
                    onClick={() => {
                      setShowDashboard(true);
                      setShowProfile(false);
                    }}
                  />
                ) : isAdmin ? (
                  <NavLink
                    icon={<LayoutDashboard className="h-5 w-5" />}
                    text="Dashboard"
                    onClick={() => {
                      setShowDashboard(true);
                      setShowProfile(false);
                    }}
                  />
                ) : (
                  <NavLink
                    icon={<User className="h-5 w-5" />}
                    text="Profile"
                    onClick={() => {
                      setShowDashboard(false);
                      setShowProfile(true);
                    }}
                  />
                )}
                <button
                  onClick={() => supabase.auth.signOut()}
                  className="text-white hover:text-indigo-200 transition-colors duration-200"
                >
                  Sign Out
                </button>
              </>
            )}
            {!user && (
              <button
                onClick={() => setShowAuth(true)}
                className="text-white hover:text-indigo-200 transition-colors duration-200"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}