import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

interface BackToMainMenuProps {
  className?: string;
}

const BackToMainMenu: React.FC<BackToMainMenuProps> = ({ className = '' }) => {
  return (
    <Link
      to="/"
      className={`flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline ${className}`}
    >
      <Home className="h-4 w-4" />
      <span>Main Menu</span>
    </Link>
  );
};

export default BackToMainMenu;
