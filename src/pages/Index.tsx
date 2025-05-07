
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
  
  // For development: temporarily bypass authentication redirect
  // Remove this conditional for production
  return <Dashboard />;
};

export default Index;
