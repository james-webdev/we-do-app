
import React, { useEffect, useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Task } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

const TaskFeedbackList = () => {
  const { tasks, refreshData, isLoading, currentUser } = useApp();
  const [localRefreshing, setLocalRefreshing] = useState(false);
  
  // Filter for rejected tasks that belong to the current user
  const rejectedTasks = tasks.filter(
    task => task.status === 'rejected' && 
    task.userId === currentUser?.id && 
    task.comment // Only show tasks with feedback
  );
  
  const handleManualRefresh = async () => {
    setLocalRefreshing(true);
    await refreshData();
    // Short timeout to ensure UI shows the refresh animation
    setTimeout(() => setLocalRefreshing(false), 500);
  };
  
  // If there are no rejected tasks and we're not still loading, don't render anything
  if (rejectedTasks.length === 0 && !isLoading) {
    return null;
  }
  
  return (
    <Card className="mb-8 border-red-200 bg-red-50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <CardTitle>Tasks Feedback</CardTitle>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleManualRefresh}
            disabled={isLoading || localRefreshing}
            className="h-8 px-2"
          >
            <RefreshCcw className={`h-4 w-4 ${(isLoading || localRefreshing) ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        <CardDescription>
          Review feedback on your rejected tasks
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {isLoading ? (
            // Show skeleton loaders while data is loading
            Array(1).fill(0).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <Skeleton className="h-5 w-3/4" />
                  </div>
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))
          ) : rejectedTasks.map((task) => (
            <RejectedTaskCard key={task.id} task={task} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Component to display a single rejected task with feedback
const RejectedTaskCard = ({ task }: { task: Task }) => {
  return (
    <Card className="w-full border-red-100">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-lg text-gray-900">{task.title}</h3>
          <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
            Rejected
          </span>
        </div>
        
        <div className="mt-3 bg-white p-3 rounded-md border">
          <p className="text-sm font-medium text-gray-700 mb-1">Feedback:</p>
          <p className="text-sm text-gray-600">{task.comment}</p>
        </div>
        
        <p className="text-xs text-gray-500 mt-3">
          {format(new Date(task.timestamp), 'MMM d, yyyy • h:mm a')}
        </p>
      </CardContent>
    </Card>
  );
};

export default TaskFeedbackList;
