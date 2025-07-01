
import React, { useEffect, useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCcw, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Task } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

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
            <CardTitle>Actions Feedback</CardTitle>
          </div>
        </div>
        <CardDescription>
          Review feedback on your rejected actions
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
  const { deleteTask } = useApp();
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDismiss = async () => {
    setIsDeleting(true);
    try {
      await deleteTask(task.id);
      toast.success('Feedback deleted');
    } catch (error) {
      console.error('Error deleting feedback:', error);
      toast.error('Failed to delete feedback');
    } finally {
      setIsDeleting(false);
    }
  };
  
  return (
    <Card className="w-full border-red-100">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-lg text-gray-900">{task.title}</h3>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
              Rejected
            </span>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-400 hover:text-red-500"
                  title="Dismiss feedback"
                >
                  <Trash2 size={16} />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Feedback</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this feedback? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDismiss}
                    disabled={isDeleting}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
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
