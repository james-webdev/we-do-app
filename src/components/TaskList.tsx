
import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import TaskCard from './TaskCard';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TaskFeedbackList from './TaskFeedbackList';

const TaskList = () => {
  const { tasks, currentUser, isLoading, refreshData } = useApp();
  const [localRefreshing, setLocalRefreshing] = useState(false);
  
  // Filter tasks for the current user
  const userTasks = tasks.filter(task => task.userId === currentUser?.id && task.status === 'approved');
  
  const handleRefresh = async () => {
    setLocalRefreshing(true);
    await refreshData();
    // Add a short delay for UI feedback
    setTimeout(() => setLocalRefreshing(false), 500);
  };
  
  if (isLoading) {
    // Show skeleton loading state
    return (
      <div>
        <TaskFeedbackList />
        <div className="space-y-4">
          {Array(3).fill(0).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <Skeleton className="h-5 w-3/4" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-12" />
                  </div>
                </div>
                <Skeleton className="h-4 w-1/4 mt-4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <TaskFeedbackList />
      
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button 
            variant="ghost" 
            onClick={handleRefresh} 
            size="sm"
            title="Refresh tasks"
            disabled={localRefreshing}
          >
            <RefreshCcw className={`h-4 w-4 ${localRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        
        {userTasks.length === 0 ? (
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <p className="text-center text-gray-500 w-full">No tasks yet. Add a task to get started!</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          userTasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TaskList;
