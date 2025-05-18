
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Settings, Heart, Handshake, Menu, X } from 'lucide-react';

const Header = () => {
  const { currentUser } = useApp();
  const { loading, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

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
        
        <nav className="hidden md:flex items-center space-x-3">
          <Link to="/" className="px-3 py-2 text-sm font-medium text-gray-800 bg-gradient-to-r from-purple-300 to-indigo-400 rounded-lg hover:from-purple-400 hover:to-indigo-500 shadow-[0_2px_4px_rgba(147,51,234,0.15)] transition-all duration-300 hover:shadow-[0_3px_6px_rgba(147,51,234,0.2)] hover:text-white">
            Dashboard
          </Link>
          <Link to="/add-task" className="px-3 py-2 text-sm font-medium text-gray-800 bg-gradient-to-r from-purple-300 to-indigo-400 rounded-lg hover:from-purple-400 hover:to-indigo-500 shadow-[0_2px_4px_rgba(147,51,234,0.15)] transition-all duration-300 hover:shadow-[0_3px_6px_rgba(147,51,234,0.2)] hover:text-white">
            Add Action
          </Link>
          <Link to="/give-brownie-point" className="px-3 py-2 text-sm font-medium text-gray-800 bg-gradient-to-r from-purple-300 to-indigo-400 rounded-lg hover:from-purple-400 hover:to-indigo-500 shadow-[0_2px_4px_rgba(147,51,234,0.15)] transition-all duration-300 hover:shadow-[0_3px_6px_rgba(147,51,234,0.2)] hover:text-white">
            Give Brownie Point
          </Link>
          <Link to="/history" className="px-3 py-2 text-sm font-medium text-gray-800 bg-gradient-to-r from-purple-300 to-indigo-400 rounded-lg hover:from-purple-400 hover:to-indigo-500 shadow-[0_2px_4px_rgba(147,51,234,0.15)] transition-all duration-300 hover:shadow-[0_3px_6px_rgba(147,51,234,0.2)] hover:text-white">
            History
          </Link>
          <Link to="/rewards" className="px-3 py-2 text-sm font-medium text-gray-800 bg-gradient-to-r from-purple-300 to-indigo-400 rounded-lg hover:from-purple-400 hover:to-indigo-500 shadow-[0_2px_4px_rgba(147,51,234,0.15)] transition-all duration-300 hover:shadow-[0_3px_6px_rgba(147,51,234,0.2)] hover:text-white">
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
              <div className="text-sm font-medium text-gray-700 md:block">
                {currentUser?.name || 'Guest'}
              </div>
              <Link 
                to="/settings" 
                className="text-gray-700 hover:text-primary transition-colors hidden md:block"
              >
                <Settings className="w-5 h-5" />
              </Link>
              {/* Mobile menu button - only visible on mobile */}
              <button
                onClick={toggleMobileMenu}
                className="md:hidden flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500 transition-colors"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile navigation */}
      <div className={`md:hidden border-t border-gray-200 py-3 ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="flex flex-col items-center w-full px-2 gap-2">
          <Link to="/" className="w-full max-w-xs flex justify-center px-3 py-2 text-sm font-medium text-gray-800 bg-gradient-to-r from-purple-300 to-indigo-400 rounded-lg hover:from-purple-400 hover:to-indigo-500 shadow-[0_2px_4px_rgba(147,51,234,0.15)] transition-all duration-300 hover:shadow-[0_3px_6px_rgba(147,51,234,0.2)] hover:text-white">
            <span>Dashboard</span>
          </Link>
          <Link to="/add-task" className="w-full max-w-xs flex justify-center px-3 py-2 text-sm font-medium text-gray-800 bg-gradient-to-r from-purple-300 to-indigo-400 rounded-lg hover:from-purple-400 hover:to-indigo-500 shadow-[0_2px_4px_rgba(147,51,234,0.15)] transition-all duration-300 hover:shadow-[0_3px_6px_rgba(147,51,234,0.2)] hover:text-white">
            <span>Add Action</span>
          </Link>
          <Link to="/give-brownie-point" className="w-full max-w-xs flex justify-center px-3 py-2 text-sm font-medium text-gray-800 bg-gradient-to-r from-purple-300 to-indigo-400 rounded-lg hover:from-purple-400 hover:to-indigo-500 shadow-[0_2px_4px_rgba(147,51,234,0.15)] transition-all duration-300 hover:shadow-[0_3px_6px_rgba(147,51,234,0.2)] hover:text-white">
            <span>Give Brownie Point</span>
          </Link>
          <Link to="/history" className="w-full max-w-xs flex justify-center px-3 py-2 text-sm font-medium text-gray-800 bg-gradient-to-r from-purple-300 to-indigo-400 rounded-lg hover:from-purple-400 hover:to-indigo-500 shadow-[0_2px_4px_rgba(147,51,234,0.15)] transition-all duration-300 hover:shadow-[0_3px_6px_rgba(147,51,234,0.2)] hover:text-white">
            <span>History</span>
          </Link>
          <Link to="/rewards" className="w-full max-w-xs flex justify-center px-3 py-2 text-sm font-medium text-gray-800 bg-gradient-to-r from-purple-300 to-indigo-400 rounded-lg hover:from-purple-400 hover:to-indigo-500 shadow-[0_2px_4px_rgba(147,51,234,0.15)] transition-all duration-300 hover:shadow-[0_3px_6px_rgba(147,51,234,0.2)] hover:text-white">
            <span>Rewards</span>
          </Link>
          <Link to="/settings" className="w-full max-w-xs flex justify-center px-3 py-2 text-sm font-medium text-gray-800 bg-gradient-to-r from-purple-300 to-indigo-400 rounded-lg hover:from-purple-400 hover:to-indigo-500 shadow-[0_2px_4px_rgba(147,51,234,0.15)] transition-all duration-300 hover:shadow-[0_3px_6px_rgba(147,51,234,0.2)] hover:text-white">
            <Settings className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
