
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
  
  // TEMPORARY FIX: Always render Dashboard to bypass authentication checks during development
  // This helps us test functionality while fixing the RLS recursion issue
  // IMPORTANT: This should be removed and replaced with proper authentication checks before production
  return <Dashboard />;
};

export default Index;
