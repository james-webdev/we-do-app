
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Dashboard from './Dashboard';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  // If user is not authenticated, redirect to sign in
  if (!user) {
    // Using setTimeout to avoid immediate redirect which can cause issues
    setTimeout(() => {
      navigate('/signin');
    }, 0);
    return <div className="flex items-center justify-center h-screen">Redirecting to login...</div>;
  }
  
  // User is authenticated, show Dashboard
  return <Dashboard />;
};

export default Index;
