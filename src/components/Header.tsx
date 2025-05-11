
import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Settings, Heart, Handshake } from 'lucide-react';

const Header = () => {
  const { currentUser } = useApp();
  const { loading, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto">
        <Link to="/" className="flex items-center space-x-2">
          <div className="flex items-center">
            <Heart className="w-6 h-6 text-primary" fill="currentColor" />
            <Handshake className="w-6 h-6 text-secondary ml-1" />
          </div>
          <span className="text-2xl font-bold text-primary">
            We<span className="text-secondary">Do</span>
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-700 hover:text-primary transition-colors">
            Dashboard
          </Link>
          <Link to="/add-task" className="text-gray-700 hover:text-primary transition-colors">
            Add Action
          </Link>
          <Link to="/give-brownie-point" className="text-gray-700 hover:text-primary transition-colors">
            Give Brownie Point
          </Link>
          <Link to="/history" className="text-gray-700 hover:text-primary transition-colors">
            History
          </Link>
          <Link to="/rewards" className="text-gray-700 hover:text-primary transition-colors">
            Rewards
          </Link>
        </nav>
        
        <div className="flex items-center space-x-4">
          {loading ? (
            <div className="flex items-center text-gray-500">
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              <span className="text-sm">Loading...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <div className="text-sm font-medium text-gray-700">
                {currentUser?.name || 'Guest'}
              </div>
              <Link 
                to="/settings" 
                className="text-gray-700 hover:text-primary transition-colors"
              >
                <Settings className="w-5 h-5" />
              </Link>
              <button 
                onClick={() => signOut()} 
                className="text-sm text-gray-500 hover:text-primary transition-colors"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile navigation */}
      <div className="md:hidden border-t border-gray-200">
        <div className="flex flex-col w-full">
          <Link to="/" className="flex flex-col items-center py-2 text-xs text-gray-500 hover:text-primary">
            <span>Dashboard</span>
          </Link>
          <Link to="/add-task" className="flex flex-col items-center py-2 text-xs text-gray-500 hover:text-primary">
            <span>Add Action</span>
          </Link>
          <Link to="/give-brownie-point" className="flex flex-col items-center py-2 text-xs text-gray-500 hover:text-primary">
            <span>Points</span>
          </Link>
          <Link to="/history" className="flex flex-col items-center py-2 text-xs text-gray-500 hover:text-primary">
            <span>History</span>
          </Link>
          <Link to="/settings" className="flex flex-col items-center py-2 text-xs text-gray-500 hover:text-primary">
            <span>Settings</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
