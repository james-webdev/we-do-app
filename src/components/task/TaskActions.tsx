
import React from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TaskActionsProps {
  isSubmitting: boolean;
  onApprove: () => void;
  onReject: () => void;
}

const TaskActions = ({ isSubmitting, onApprove, onReject }: TaskActionsProps) => {
  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onReject}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : 'Reject'}
      </Button>
      <Button 
        onClick={onApprove}
        size="sm"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Approving...
          </>
        ) : 'Approve'}
      </Button>
    </div>
  );
};

export default TaskActions;
