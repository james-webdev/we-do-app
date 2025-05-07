
import React from 'react';
import { Loader2 } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface RejectTaskDialogProps {
  isOpen: boolean;
  isSubmitting: boolean;
  comment: string;
  onCommentChange: (comment: string) => void;
  onClose: () => void;
  onReject: () => void;
}

const RejectTaskDialog = ({
  isOpen,
  isSubmitting,
  comment,
  onCommentChange,
  onClose,
  onReject
}: RejectTaskDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reject Task</DialogTitle>
          <DialogDescription>
            Please provide a reason for rejecting this task.
          </DialogDescription>
        </DialogHeader>
        
        <Textarea
          value={comment}
          onChange={(e) => onCommentChange(e.target.value)}
          placeholder="Reason for rejection..."
          className="min-h-[100px]"
        />
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onReject}
            disabled={isSubmitting || comment.trim() === ''}
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
  );
};

export default RejectTaskDialog;
