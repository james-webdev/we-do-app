
import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';

const Header = () => {
  const { currentUser } = useApp();

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-primary">
            Balance<span className="text-secondary">Beam</span>
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-700 hover:text-primary transition-colors">
            Dashboard
          </Link>
          <Link to="/add-task" className="text-gray-700 hover:text-primary transition-colors">
            Add Task
          </Link>
          <Link to="/give-brownie-point" className="text-gray-700 hover:text-primary transition-colors">
            Give Brownie Point
          </Link>
          <Link to="/history" className="text-gray-700 hover:text-primary transition-colors">
            History
          </Link>
        </nav>
        
        <div className="flex items-center space-x-4">
          <div className="text-sm font-medium text-gray-700">
            {currentUser?.name || 'Loading...'}
          </div>
        </div>
      </div>
      
      {/* Mobile navigation */}
      <div className="md:hidden border-t border-gray-200">
        <div className="grid grid-cols-4 w-full">
          <Link to="/" className="flex flex-col items-center py-2 text-xs text-gray-500 hover:text-primary">
            <span className="material-icons text-lg">dashboard</span>
            <span>Dashboard</span>
          </Link>
          <Link to="/add-task" className="flex flex-col items-center py-2 text-xs text-gray-500 hover:text-primary">
            <span className="material-icons text-lg">add_task</span>
            <span>Add Task</span>
          </Link>
          <Link to="/give-brownie-point" className="flex flex-col items-center py-2 text-xs text-gray-500 hover:text-primary">
            <span className="material-icons text-lg">card_giftcard</span>
            <span>Give Points</span>
          </Link>
          <Link to="/history" className="flex flex-col items-center py-2 text-xs text-gray-500 hover:text-primary">
            <span className="material-icons text-lg">history</span>
            <span>History</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
