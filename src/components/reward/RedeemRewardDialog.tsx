
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Reward } from '@/types';

interface RedeemRewardDialogProps {
  selectedReward: Reward | null;
  isRedeeming: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export function RedeemRewardDialog({ selectedReward, isRedeeming, onClose, onConfirm }: RedeemRewardDialogProps) {
  return (
    <Dialog open={!!selectedReward} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Redeem Reward</DialogTitle>
          <DialogDescription>
            Are you sure you want to redeem {selectedReward?.title} for {selectedReward?.pointsCost} points?
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-gray-600">{selectedReward?.description}</p>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isRedeeming}
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isRedeeming}
          >
            {isRedeeming ? 'Redeeming...' : 'Confirm Redemption'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
