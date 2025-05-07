
import React from 'react';
import { useApp } from '@/contexts/AppContext';
import TaskCard from './TaskCard';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const TaskList = () => {
  const { tasks, currentUser, isLoading } = useApp();
  
  // Filter tasks for the current user
  const userTasks = tasks.filter(task => task.userId === currentUser?.id);
  
  if (isLoading) {
    // Show skeleton loading state
    return (
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
    );
  }
  
  if (userTasks.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-gray-500">
          <p>No tasks yet. Add a task to get started!</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-4">
      {userTasks.map(task => (
        <TaskCard 
          key={task.id} 
          task={task}
        />
      ))}
    </div>
  );
};

export default TaskList;
