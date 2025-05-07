
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  
  useEffect(() => {
    if (!loading) {
      if (user) {
        navigate('/');
      } else {
        navigate('/signin');
      }
    }
  }, [user, loading, navigate]);
  
  return (
    <div className="flex items-center justify-center h-screen">
      {loading ? "Loading..." : "Redirecting..."}
    </div>
  );
};

export default Index;
