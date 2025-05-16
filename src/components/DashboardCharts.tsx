
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/contexts/AppContext';
import TaskDistributionChart from './charts/TaskDistributionChart';
import TaskCompletionChart from './charts/TaskCompletionChart';
import PointsTimeComparisonChart from './charts/PointsTimeComparisonChart';
import { format } from 'date-fns';

const DashboardCharts = () => {
  const { summary, currentUser, tasks } = useApp();
  
  if (!summary || !currentUser) return null;
  
  const today = format(new Date(), 'MMMM dd, yyyy');
  
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Dashboard Analytics</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Data as of {today}
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Weekly Actions Completed Chart */}
        <Card className='flex flex-col justify-center'>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Weekly Actions Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <TaskCompletionChart tasks={tasks} />
          </CardContent>
        </Card>
        
        {/* Points Competition Pie Chart with Tabs */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Points Competition</CardTitle>
          </CardHeader>
          <CardContent>
            <PointsTimeComparisonChart />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardCharts;
