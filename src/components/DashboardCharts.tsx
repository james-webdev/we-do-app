
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/contexts/AppContext';
import TaskDistributionChart from './charts/TaskDistributionChart';
import TaskCompletionChart from './charts/TaskCompletionChart';
import { format } from 'date-fns';

const DashboardCharts = () => {
  const { summary, currentUser, tasks } = useApp();
  
  if (!summary || !currentUser) return null;
  
  const today = format(new Date(), 'MMMM dd, yyyy');
  
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Dashboard Analytics</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Data from the last 7 days as of {today}
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Task Distribution Chart (Now a Pie Chart) */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Action Distribution by Weight</CardTitle>
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
        
        {/* Weekly Tasks Completed Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Weekly Actions Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <TaskCompletionChart tasks={tasks} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardCharts;
