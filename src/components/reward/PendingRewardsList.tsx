
import React, { useEffect } from 'react';
import { PendingRewardCard } from '@/components/reward/PendingRewardCard';
import { Reward } from '@/types';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface PendingRewardsListProps {
  pendingRewards: Reward[];
  onApprove: (rewardId: string) => void;
  onReject: (rewardId: string) => void;
}

export function PendingRewardsList({ pendingRewards, onApprove, onReject }: PendingRewardsListProps) {
  // Log the pending rewards to console for debugging
  useEffect(() => {
    console.log('PendingRewardsList rendering with:', pendingRewards);
  }, [pendingRewards]);
  
  if (!pendingRewards || pendingRewards.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Rewards Pending Your Approval</h2>
      {pendingRewards.length > 0 && (
        <Alert variant="destructive" className="mb-4 bg-amber-50 border-amber-200">
          <AlertCircle className="h-4 w-4 mr-2 text-amber-500" />
          <AlertDescription>
            Rejecting a reward will permanently delete it from the database.
          </AlertDescription>
        </Alert>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pendingRewards.map((reward) => (
          <PendingRewardCard
            key={reward.id}
            reward={reward}
            onApprove={onApprove}
            onReject={onReject}
          />
        ))}
      </div>
    </div>
  );
}
