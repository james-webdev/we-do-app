
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Dashboard from './Dashboard';

// This component will now render Dashboard instead of just redirecting
const Index = () => {
  const navigate = useNavigate();
  
  return <Dashboard />;
};

export default Index;
