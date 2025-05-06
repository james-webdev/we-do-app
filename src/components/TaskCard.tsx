
import { Task, TaskRating } from '@/types';
import { format } from 'date-fns';
import { TypeBadge } from './LoadBadge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2 } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useState } from 'react';
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

// Function to get the appropriate color for each rating
const getRatingBadgeColor = (rating: TaskRating): string => {
  if (rating <= 2) return 'bg-green-100 text-green-800 hover:bg-green-200';
  if (rating <= 4) return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
  if (rating <= 6) return 'bg-orange-100 text-orange-800 hover:bg-orange-200';
  if (rating <= 8) return 'bg-red-100 text-red-800 hover:bg-red-200';
  return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
};

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

  const ratingBadgeColor = getRatingBadgeColor(task.rating);

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-lg text-gray-900">{task.title}</h3>
          <div className="flex gap-2">
            <TypeBadge type={task.type} />
            <Badge variant="outline" className={`font-semibold ${ratingBadgeColor}`}>
              {task.rating} ★
            </Badge>
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
                <AlertDialogTitle>Delete Task</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this task? This action cannot be undone.
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
