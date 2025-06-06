
import React from 'react';
import { useApp } from '@/contexts/AppContext';
import ConnectPartner from '@/components/ConnectPartner';
import TaskList from '@/components/TaskList';
import PointsDisplay from '@/components/PointsDisplay';
import PendingTasksList from '@/components/PendingTasksList';
import MyPendingTasksList from '@/components/MyPendingTasksList';
import DashboardCharts from '@/components/DashboardCharts';
import BrowniePointsList from '@/components/BrowniePointsList';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';

const Dashboard = () => {
  const { hasPartner, partner, refreshData, isLoading } = useApp();
  
  const handleRefresh = () => {
    refreshData();
  };
  
  // If user doesn't have a partner, show the connect partner flow
  if (!hasPartner) {
    return (
      <div className="container py-8 max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-12">Welcome to We-Do</h1>
        
        <div className="mb-8">
          <ConnectPartner />
        </div>
        
        <div className="text-center text-gray-600 mt-12">
          <p className="mb-4">To start using We-Do, connect with your partner first.</p>
          <p>Don't have a partner on We-Do yet? Ask them to sign up and then connect using their email address.</p>
        </div>
      </div>
    );
  }
  
  // If user has a partner, show the dashboard
  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh} 
          disabled={isLoading}
        >
          <RefreshCcw size={16} className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh Data
        </Button>
      </div>
      
      {/* Points Display centered at the top */}
      <div className="mb-8 max-w-md mx-auto">
        <PointsDisplay />
      </div>
      
      {/* Show my pending tasks first - limit to 5 most recent */}
      <MyPendingTasksList limit={5} />
      
      {/* Show partner's pending tasks that need my approval */}
      <PendingTasksList limit={5} />
      
      {/* Actions and Brownie Points in two columns on desktop, stacked on mobile */}
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="w-full md:w-1/2">
          <div className="flex items-center gap-2 mb-4">
            <img 
              src="/action-icon.png" 
              alt="Action Icon" 
              width={24} 
              height={24} 
              className="object-contain"
            />
            <h2 className="text-xl font-semibold"> Your Recent Actions</h2>
          </div>
          <TaskList limit={4} />
        </div>
        
        <div className="w-full md:w-1/2">
          <div className="flex items-center gap-2 mb-4">
            <img 
              src="/brownie-icon.png" 
              alt="Brownie Icon" 
              width={24} 
              height={24} 
              className="object-contain"
            />
            <h2 className="text-xl font-semibold">Brownie Points from {partner?.name || 'Partner'}</h2>
          </div>
          <BrowniePointsList limit={4} />
        </div>
      </div>
      
      {/* Add dashboard charts */}
      <DashboardCharts />
    </div>
  );
};

export default Dashboard;
