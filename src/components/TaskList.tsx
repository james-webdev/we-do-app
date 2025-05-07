
import React from 'react';
import { useApp } from '@/contexts/AppContext';
import TaskCard from './TaskCard';
import { Card, CardContent } from '@/components/ui/card';

const TaskList = () => {
  const { tasks, currentUser } = useApp();
  
  // Filter tasks for the current user
  const userTasks = tasks.filter(task => task.userId === currentUser?.id);
  
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
