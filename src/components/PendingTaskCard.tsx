
import React, { useState } from 'react';
import { Task } from '@/types';
import { format } from 'date-fns';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useApp } from '@/contexts/AppContext';
import { toast } from '@/components/ui/sonner';
import { calculateTaskPointsDescription } from '@/utils/taskUtils';
import TaskHeader from '@/components/task/TaskHeader';
import TaskActions from '@/components/task/TaskActions';
import RejectTaskDialog from '@/components/task/RejectTaskDialog';

interface PendingTaskCardProps {
  task: Task;
  userName?: string;
}

const PendingTaskCard = ({ task, userName }: PendingTaskCardProps) => {
  const { approveTask, rejectTask, refreshData } = useApp();
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectComment, setRejectComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [isRejected, setIsRejected] = useState(false);
  
  const handleApprove = async () => {
    if (isSubmitting || isApproved) return; // Prevent multiple clicks
    
    try {
      setIsSubmitting(true);
      // Show immediate feedback with a loading toast that we can dismiss later
      const loadingToast = toast.loading(`Approving task: ${task.title}...`);
      
      // Approval process
      await approveTask(task.id);
      
      // Mark as approved to disable the button
      setIsApproved(true);
      setIsSubmitting(false);
      
      // Dismiss the loading toast
      toast.dismiss(loadingToast);
      
      // Success notification
      toast.success('Task approved successfully!', {
        duration: 3000, // Auto-close after 3 seconds
      });
      
      // Delay refresh to ensure database has updated
      setTimeout(() => {
        refreshData();
      }, 500);
    } catch (error) {
      console.error('Error during approval:', error);
      setIsSubmitting(false);
      toast.error('Approval failed. Please try again.', {
        duration: 3000,
      });
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
    if (isSubmitting || rejectComment.trim() === '') return; // Validate input and prevent multiple submissions
    
    try {
      setIsSubmitting(true);
      const loadingToast = toast.loading(`Rejecting task: ${task.title}...`);
      
      // Call the rejection function with the comment
      const success = await rejectTask(task.id, rejectComment);
      
      // Dismiss the loading toast
      toast.dismiss(loadingToast);
      
      if (success) {
        // Mark as rejected to update UI
        setIsRejected(true);
        toast.success('Task rejected with feedback', {
          duration: 3000,
        });
      } else {
        toast.error('Failed to reject task. Please try again.', {
          duration: 3000,
        });
      }
      
      setIsSubmitting(false);
      handleCloseRejectDialog();
      
      // Delay refresh to ensure database has updated
      setTimeout(() => {
        refreshData();
      }, 500);
    } catch (error) {
      console.error('Error during rejection:', error);
      setIsSubmitting(false);
      toast.error('Rejection failed. Please try again.', {
        duration: 3000,
      });
      handleCloseRejectDialog();
    }
  };
  
  const pointsDescription = calculateTaskPointsDescription(task.rating);

  // If task is approved or rejected, remove it from the UI completely
  if (isApproved || isRejected) {
    return null;
  }

  return (
    <>
      <Card className="w-full">
        <CardContent className="pt-6">
          <TaskHeader 
            title={task.title} 
            type={task.type} 
            rating={task.rating}
            userName={userName}
          />
          <p className="text-xs text-blue-600 font-medium mt-1">
            {pointsDescription}
          </p>
        </CardContent>
        <CardFooter className="flex justify-between items-center border-t pt-4">
          <span className="text-xs text-gray-500">
            {format(new Date(task.timestamp), 'MMM d, yyyy • h:mm a')}
          </span>
          
          <TaskActions 
            isSubmitting={isSubmitting}
            onApprove={handleApprove}
            onReject={handleOpenRejectDialog}
          />
        </CardFooter>
      </Card>
      
      <RejectTaskDialog
        isOpen={isRejecting}
        isSubmitting={isSubmitting}
        comment={rejectComment}
        onCommentChange={setRejectComment}
        onClose={handleCloseRejectDialog}
        onReject={handleReject}
      />
    </>
  );
};

export default PendingTaskCard;
