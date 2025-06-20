import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Heart, Handshake, Settings } from 'lucide-react';

const SimpleHeader = () => {
  const { currentUser } = useApp();
  const { loading } = useAuth();

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto">
        <Link to="/" className="flex items-center space-x-2">
          <div className="flex items-center">
            <Heart className="w-6 h-6 text-primary" fill="currentColor" />
            <Handshake className="w-6 h-6 text-secondary ml-1" />
          </div>
          <span className="text-2xl font-bold text-primary">
            We-<span className="text-secondary">Do</span>
          </span>
        </Link>
        
        <div className="flex items-center space-x-4">
          {loading ? (
            <div className="flex items-center text-gray-500">
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              <span className="text-sm">Loading...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <div className="text-sm font-medium text-gray-700">
                Hi, {currentUser?.name || 'Guest'}
              </div>
              <Link 
                to="/settings" 
                className="text-gray-700 hover:text-primary transition-colors"
                aria-label="Settings"
              >
                <Settings className="w-5 h-5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default SimpleHeader;
