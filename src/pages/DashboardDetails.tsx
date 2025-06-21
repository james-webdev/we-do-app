import React from 'react';
import { useApp } from '@/contexts/AppContext';
import TaskList from '@/components/TaskList';
import PointsDisplay from '@/components/PointsDisplay';
import PendingTasksList from '@/components/PendingTasksList';
import MyPendingTasksList from '@/components/MyPendingTasksList';
import TaskFeedbackList from '@/components/TaskFeedbackList';
import DashboardCharts from '@/components/DashboardCharts';
import BrowniePointsList from '@/components/BrowniePointsList';
import BackToMainMenu from '@/components/BackToMainMenu';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCcw } from 'lucide-react';

const ActivitySummary = () => {
  const { partner, refreshData, isLoading } = useApp();
  
  const handleRefresh = () => {
    refreshData();
  };
  
  return (
    <div className="container py-8">
      <div className="mb-4">
        <BackToMainMenu />
      </div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Activity</h1>
      </div>
      


      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="w-full md:w-1/2">
          <Card className="border-purple-100 bg-purple-50/20">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img 
                    src="/brownie-icon.png" 
                    alt="Brownie Icon" 
                    width={24} 
                    height={24} 
                    className="object-contain"
                    style={{ mixBlendMode: 'multiply' }}
                  />
                  <CardTitle>Brownie Points from {partner?.name || 'Partner'}</CardTitle>
                </div>
              </div>
              <CardDescription>
                Brownie points you've received from your partner
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BrowniePointsList limit={4} />
            </CardContent>
          </Card>
        </div>
        <div className="w-full md:w-1/2">
          <Card className="border-blue-100 bg-blue-50/20">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img 
                    src="/action-icon.png" 
                    alt="Action Icon" 
                    width={24} 
                    height={24} 
                    className="object-contain"
                    style={{ mixBlendMode: 'multiply' }}
                  />
                  <CardTitle>Your Recent Actions</CardTitle>
                </div>
              </div>
              <CardDescription>
                Your recently completed and approved actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TaskList limit={4} />
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Show partner's pending tasks that need my approval */}
      <PendingTasksList limit={5} />
      
      {/* Show my pending tasks first - limit to 5 most recent */}
      <MyPendingTasksList limit={5} />
      
      {/* Show rejected tasks with feedback */}
      <TaskFeedbackList />
      

    </div>
  );
};

export default ActivitySummary;
