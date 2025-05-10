
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/contexts/AppContext';
import TaskDistributionChart from './charts/TaskDistributionChart';
import LoadDistributionChart from './charts/LoadDistributionChart';
import BrowniePointTypeChart from './charts/BrowniePointTypeChart';
import WeeklyPointsChart from './charts/WeeklyPointsChart';
import { format } from 'date-fns';

const DashboardCharts = () => {
  const { summary, currentUser, browniePoints } = useApp();
  
  if (!summary || !currentUser) return null;
  
  const today = format(new Date(), 'MMMM dd, yyyy');
  
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Dashboard Analytics</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Data from the last 7 days as of {today}
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Task Distribution Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Task Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <TaskDistributionChart 
              userTaskCount={summary.userTaskCount} 
              partnerTaskCount={summary.partnerTaskCount}
              userPoints={summary.userPoints}
              partnerPoints={summary.partnerPoints} 
            />
          </CardContent>
        </Card>
        
        {/* Load Distribution Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Mental vs Physical Load</CardTitle>
          </CardHeader>
          <CardContent>
            <LoadDistributionChart 
              mentalTasks={summary.mentalTasks} 
              physicalTasks={summary.physicalTasks} 
            />
          </CardContent>
        </Card>
        
        {/* Brownie Points by Type Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Brownie Points by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <BrowniePointTypeChart 
              browniePoints={browniePoints}
            />
          </CardContent>
        </Card>
        
        {/* Weekly Points Received Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Weekly Points Received</CardTitle>
          </CardHeader>
          <CardContent>
            <WeeklyPointsChart 
              browniePoints={browniePoints}
              userId={currentUser.id}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardCharts;
