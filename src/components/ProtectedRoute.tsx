import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !currentUser) {
      console.log('No user found, redirecting to login');
      navigate('/');
    }
  }, [currentUser, isLoading, navigate]);

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return currentUser ? <>{children}</> : null;
};
