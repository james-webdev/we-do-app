
import React, { useState } from 'react';
import { FC } from 'react';
import { useApp } from '@/contexts/AppContext';
import TaskCard from './TaskCard';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TaskFeedbackList from './TaskFeedbackList';

interface TaskListProps {
  limit?: number;
}

const TaskList: FC<TaskListProps> = ({ limit = 8 }) => {
  const { tasks, currentUser, isLoading, refreshData } = useApp();
  const [localRefreshing, setLocalRefreshing] = useState(false);
  
  // Filter tasks for the current user, sort by timestamp (newest first), and limit to specified number
  const userTasks = tasks
    .filter(task => task.userId === currentUser?.id && task.status === 'approved')
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);
  
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
            <div key={i} className="p-4 border border-gray-100 rounded-md">
              <div className="flex justify-between items-start mb-4">
                <Skeleton className="h-5 w-3/4" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-12" />
                </div>
              </div>
              <Skeleton className="h-4 w-1/4 mt-4" />
            </div>
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
            title="Refresh actions"
            disabled={localRefreshing}
          >
            <RefreshCcw className={`h-4 w-4 ${localRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        
        {userTasks.length === 0 ? (
          <div className="flex justify-between items-center p-4">
            <p className="text-center text-gray-500 w-full">No actions yet. Add an action to get started!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {userTasks.map(task => (
              <TaskCard 
                key={task.id} 
                task={task}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;
