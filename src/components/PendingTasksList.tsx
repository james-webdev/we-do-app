
import React, { useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import PendingTaskCard from './PendingTaskCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

const PendingTasksList = () => {
  const { pendingTasks, partner, refreshData } = useApp();

  // Refresh data when component mounts to ensure we have the latest pending tasks
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  if (pendingTasks.length === 0) {
    return null;
  }

  return (
    <Card className="mb-8 border-amber-200 bg-amber-50">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-amber-500" />
          <CardTitle>Tasks Pending Your Approval</CardTitle>
        </div>
        <CardDescription>
          Review and approve tasks submitted by your partner
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {pendingTasks.map((task) => (
            <PendingTaskCard
              key={task.id}
              task={task}
              userName={partner?.name || 'Partner'}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PendingTasksList;
