
import { Task } from '@/types';
import { format } from 'date-fns';
import { LoadBadge, TypeBadge } from './LoadBadge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

interface TaskCardProps {
  task: Task;
  userName?: string;
}

const TaskCard = ({ task, userName }: TaskCardProps) => {
  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-lg text-gray-900">{task.title}</h3>
          <div className="flex gap-2">
            <TypeBadge type={task.type} />
            <LoadBadge load={task.load} />
          </div>
        </div>
        {userName && (
          <p className="text-sm text-gray-500">By {userName}</p>
        )}
      </CardContent>
      <CardFooter className="text-xs text-gray-500">
        {format(new Date(task.timestamp), 'MMM d, yyyy • h:mm a')}
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
