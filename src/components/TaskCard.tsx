
import { Task, TaskRating } from '@/types';
import { format } from 'date-fns';
import { TypeBadge } from './LoadBadge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useState } from 'react';
import ActionPointBadge from '@/components/ActionPointBadge';
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

interface TaskCardProps {
  task: Task;
  userName?: string;
}

// Using the getRatingBadgeColor function from taskUtils.ts for consistency

const TaskCard = ({ task, userName }: TaskCardProps) => {
  const { deleteTask, currentUser } = useApp();
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Only show delete button if the task belongs to the current user and is approved
  const canDelete = currentUser?.id === task.userId && task.status === 'approved';

  const handleDelete = async () => {
    setIsDeleting(true);
    await deleteTask(task.id);
    setIsDeleting(false);
  };

  // Using ActionPointBadge component instead of manual badge styling

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-lg text-gray-900">{task.title}</h3>
          <div className="flex gap-2">
            <TypeBadge type={task.type} />
            <ActionPointBadge points={task.rating} size="sm" />
          </div>
        </div>
        {userName && (
          <p className="text-sm text-gray-500">By {userName}</p>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center text-xs text-gray-500">
        <span>{format(new Date(task.timestamp), 'MMM d, yyyy • h:mm a')}</span>
        {canDelete && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-400 hover:text-red-500"
              >
                <Trash2 size={16} />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Action</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this action? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
