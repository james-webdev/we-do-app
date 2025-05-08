
import React from 'react';
import { RewardCard } from '@/components/reward/RewardCard';
import { Reward } from '@/types';

interface AvailableRewardsProps {
  rewards: Reward[];
  availablePoints: number;
  onRedeemClick: (reward: Reward) => void;
  onDeleteClick: (reward: Reward) => void;
}

export function AvailableRewards({ rewards, availablePoints, onRedeemClick, onDeleteClick }: AvailableRewardsProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Available Rewards</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rewards.map((reward) => (
          <RewardCard
            key={reward.id}
            reward={reward}
            availablePoints={availablePoints}
            onRedeemClick={onRedeemClick}
            onDeleteClick={onDeleteClick}
          />
        ))}
      </div>
    </div>
  );
}
