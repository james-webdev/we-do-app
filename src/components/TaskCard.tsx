
import { Task, TaskRating } from '@/types';
import { format } from 'date-fns';
import { TypeBadge } from './LoadBadge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useApp } from '@/contexts/AppContext';
import ActionPointBadge from '@/components/ActionPointBadge';

interface TaskCardProps {
  task: Task;
  userName?: string;
}

// Using the getRatingBadgeColor function from taskUtils.ts for consistency

const TaskCard = ({ task, userName }: TaskCardProps) => {
  const { currentUser } = useApp();

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
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
