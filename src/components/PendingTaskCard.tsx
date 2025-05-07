
import React, { useState } from 'react';
import { Task } from '@/types';
import { format } from 'date-fns';
import { TypeBadge } from './LoadBadge';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useApp } from '@/contexts/AppContext';
import { toast } from '@/components/ui/sonner';
import { Loader2 } from 'lucide-react';

interface PendingTaskCardProps {
  task: Task;
  userName?: string;
}

const getRatingBadgeColor = (rating: number): string => {
  if (rating <= 2) return 'bg-green-100 text-green-800 hover:bg-green-200';
  if (rating <= 4) return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
  if (rating <= 6) return 'bg-orange-100 text-orange-800 hover:bg-orange-200';
  if (rating <= 8) return 'bg-red-100 text-red-800 hover:bg-red-200';
  return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
};

// Calculate the points that will be earned for a task based on its rating
const calculateTaskPointsDescription = (rating: number): string => {
  if (rating <= 3) return "Will earn 1 brownie point";
  if (rating <= 6) return "Will earn 2 brownie points";
  if (rating <= 8) return "Will earn 3 brownie points";
  return "Will earn 4 brownie points";
};

const PendingTaskCard = ({ task, userName }: PendingTaskCardProps) => {
  const { approveTask, rejectTask, refreshData } = useApp();
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectComment, setRejectComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  
  const handleApprove = async () => {
    if (isSubmitting || isApproved) return; // Prevent multiple clicks
    
    try {
      setIsSubmitting(true);
      // Show immediate feedback
      toast.loading(`Approving task: ${task.title}...`);
      
      // Approval process
      await approveTask(task.id);
      
      // Mark as approved to disable the button
      setIsApproved(true);
      setIsSubmitting(false);
      
      // Delay refresh to ensure database has updated
      setTimeout(() => {
        refreshData();
      }, 500);
    } catch (error) {
      console.error('Error during approval:', error);
      setIsSubmitting(false);
      toast.error('Approval failed. Please try again.');
    }
  };
  
  const handleOpenRejectDialog = () => {
    setIsRejecting(true);
  };
  
  const handleCloseRejectDialog = () => {
    setIsRejecting(false);
    setRejectComment('');
  };
  
  const handleReject = async () => {
    if (isSubmitting) return; // Prevent multiple clicks
    
    try {
      setIsSubmitting(true);
      toast.loading(`Rejecting task: ${task.title}...`);
      
      await rejectTask(task.id, rejectComment);
      
      setIsSubmitting(false);
      handleCloseRejectDialog();
      
      // Delay refresh to ensure database has updated
      setTimeout(() => {
        refreshData();
      }, 500);
    } catch (error) {
      console.error('Error during rejection:', error);
      setIsSubmitting(false);
      toast.error('Rejection failed. Please try again.');
    }
  };
  
  const ratingBadgeColor = getRatingBadgeColor(task.rating);
  const pointsDescription = calculateTaskPointsDescription(task.rating);

  // If task is approved, remove it from the UI completely
  if (isApproved) {
    return null;
  }

  return (
    <>
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
            <p className="text-sm text-gray-500 mb-2">By {userName}</p>
          )}
          <p className="text-xs text-blue-600 font-medium mt-1">
            {pointsDescription}
          </p>
        </CardContent>
        <CardFooter className="flex justify-between items-center border-t pt-4">
          <span className="text-xs text-gray-500">
            {format(new Date(task.timestamp), 'MMM d, yyyy • h:mm a')}
          </span>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleOpenRejectDialog}
              disabled={isSubmitting || isApproved}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : 'Reject'}
            </Button>
            <Button 
              onClick={handleApprove}
              size="sm"
              disabled={isSubmitting || isApproved}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Approving...
                </>
              ) : 'Approve'}
            </Button>
          </div>
        </CardFooter>
      </Card>
      
      <Dialog open={isRejecting} onOpenChange={handleCloseRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Task</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this task.
            </DialogDescription>
          </DialogHeader>
          
          <Textarea
            value={rejectComment}
            onChange={(e) => setRejectComment(e.target.value)}
            placeholder="Reason for rejection..."
            className="min-h-[100px]"
          />
          
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseRejectDialog} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={isSubmitting || rejectComment.trim() === ''}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : 'Reject Task'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PendingTaskCard;
