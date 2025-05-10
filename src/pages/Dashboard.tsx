
import React from 'react';
import { useApp } from '@/contexts/AppContext';
import ConnectPartner from '@/components/ConnectPartner';
import TaskList from '@/components/TaskList';
import PointsDisplay from '@/components/PointsDisplay';
import PendingTasksList from '@/components/PendingTasksList';
import DashboardCharts from '@/components/DashboardCharts';
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
        <h1 className="text-4xl font-bold mb-12">Welcome to WeDo</h1>
        
        <div className="mb-8">
          <ConnectPartner />
        </div>
        
        <div className="text-center text-gray-600 mt-12">
          <p className="mb-4">To start using WeDo, connect with your partner first.</p>
          <p>Don't have a partner on WeDo yet? Ask them to sign up and then connect using their email address.</p>
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
      
      {/* Show pending tasks first */}
      <PendingTasksList />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Actions</h2>
          <TaskList />
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Points</h2>
          <PointsDisplay />
        </div>
      </div>
      
      {/* Add dashboard charts */}
      <DashboardCharts />
    </div>
  );
};

export default Dashboard;
