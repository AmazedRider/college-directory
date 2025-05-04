import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

export function CreateAccountPage() {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to homepage with auth modal open in signup mode
    navigate('/', { state: { showAuth: true, isSignUp: true } });
  }, [navigate]);
  
  // This acts as a fallback in case the navigation hook hasn't redirected yet
  return <Navigate to="/" state={{ showAuth: true, isSignUp: true }} replace />;
} 