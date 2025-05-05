import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Keeping this as a simple redirect to the Dashboard
const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    navigate('/');
  }, [navigate]);
  
  return null;
};

export default Index;
