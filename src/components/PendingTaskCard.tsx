
import React, { useState } from 'react';
import { Task, TaskLevel } from '@/types';
import { format } from 'date-fns';
import { TypeBadge } from './LoadBadge';
import { useApp } from '@/contexts/AppContext';
import {
  Card,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThumbsUp, ThumbsDown, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface PendingTaskCardProps {
  task: Task;
  userName: string;
}

// Function to get the appropriate color for each level
const getLevelBadgeColor = (level: TaskLevel): string => {
  switch (level) {
    case 'easy': return 'bg-green-100 text-green-800 hover:bg-green-200';
    case 'normal': return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
    case 'hard': return 'bg-orange-100 text-orange-800 hover:bg-orange-200';
    case 'expert': return 'bg-red-100 text-red-800 hover:bg-red-200';
    case 'master': return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
    default: return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
  }
};

const PendingTaskCard = ({ task, userName }: PendingTaskCardProps) => {
  const { approveTask, rejectTask } = useApp();
  const [isProcessing, setIsProcessing] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [comment, setComment] = useState('');
  
  const handleApprove = async () => {
    setIsProcessing(true);
    await approveTask(task.id);
    setIsProcessing(false);
  };
  
  const handleReject = async () => {
    setIsProcessing(true);
    await rejectTask(task.id, comment);
    setRejectOpen(false);
    setIsProcessing(false);
  };

  const levelBadgeColor = getLevelBadgeColor(task.level);
  
  return (
    <Card className="w-full border-amber-300">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle size={16} className="text-amber-500" />
              <span className="text-sm text-amber-600 font-medium">Pending Approval</span>
            </div>
            <h3 className="font-medium text-lg text-gray-900">{task.title}</h3>
          </div>
          <div className="flex gap-2">
            <TypeBadge type={task.type} />
            <Badge variant="outline" className={`font-semibold ${levelBadgeColor}`}>
              {task.level.charAt(0).toUpperCase() + task.level.slice(1)}
            </Badge>
          </div>
        </div>
        <p className="text-sm text-gray-500">Added by {userName}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center border-t pt-3">
        <span className="text-xs text-gray-500">
          {format(new Date(task.timestamp), 'MMM d, yyyy • h:mm a')}
        </span>
        <div className="flex gap-2">
          <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                disabled={isProcessing}
              >
                <ThumbsDown size={14} className="mr-1" />
                Reject
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Reject Task</DialogTitle>
                <DialogDescription>
                  Please provide a reason for rejecting this task. Your partner will see this message.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Label htmlFor="comment">Reason for rejection</Label>
                <Textarea
                  id="comment"
                  placeholder="This task doesn't deserve that level..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="mt-2"
                />
              </div>
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setRejectOpen(false)}
                  disabled={isProcessing}
                >
                  Cancel
                </Button>
                <Button 
                  variant="destructive"
                  onClick={handleReject}
                  disabled={isProcessing || !comment.trim()}
                >
                  Reject Task
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Button
            size="sm"
            className="bg-green-600 hover:bg-green-700"
            onClick={handleApprove}
            disabled={isProcessing}
          >
            <ThumbsUp size={14} className="mr-1" />
            Approve
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PendingTaskCard;
