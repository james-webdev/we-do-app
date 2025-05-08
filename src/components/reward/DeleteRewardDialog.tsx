
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Reward } from '@/types';

interface DeleteRewardDialogProps {
  rewardToDelete: Reward | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export function DeleteRewardDialog({ rewardToDelete, onClose, onConfirm }: DeleteRewardDialogProps) {
  return (
    <Dialog open={!!rewardToDelete} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Reward</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the "{rewardToDelete?.title}" reward? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
