
import React from 'react';
import { PendingRewardCard } from '@/components/reward/PendingRewardCard';
import { Reward } from '@/types';

interface PendingRewardsListProps {
  pendingRewards: Reward[];
  onApprove: (rewardId: string) => void;
  onReject: (rewardId: string) => void;
}

export function PendingRewardsList({ pendingRewards, onApprove, onReject }: PendingRewardsListProps) {
  if (!pendingRewards || pendingRewards.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Rewards Pending Your Approval</h2>
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
