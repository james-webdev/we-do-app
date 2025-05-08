
import React, { useEffect } from 'react';
import { RewardCard } from '@/components/reward/RewardCard';
import { Reward } from '@/types';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCw, Info } from 'lucide-react';

interface AvailableRewardsProps {
  rewards: Reward[];
  availablePoints: number;
  onRedeemClick: (reward: Reward) => void;
  onDeleteClick: (reward: Reward) => void;
}

export function AvailableRewards({ rewards, availablePoints, onRedeemClick, onDeleteClick }: AvailableRewardsProps) {
  // Make sure we're ONLY displaying approved rewards by explicitly filtering
  const approvedRewards = rewards.filter(reward => {
    // Log each reward being filtered
    console.log("Filtering reward:", reward, "Status:", reward.status);
    
    // Very strict check for approved status only
    return reward.status === 'approved';
  });
  
  // Log the filtered rewards to verify what's being displayed
  useEffect(() => {
    console.log("Approved rewards after filtering:", approvedRewards);
  }, [approvedRewards]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Available Rewards</h2>
      {approvedRewards.length === 0 ? (
        <div className="bg-gray-50 p-6 rounded-md text-center">
          <RefreshCw className="mx-auto h-8 w-8 text-gray-400 mb-2" />
          <p className="text-gray-500 italic">No rewards available. Propose a new reward!</p>
        </div>
      ) : (
        <>
          <Alert variant="info" className="mb-4">
            <Info className="h-4 w-4 mr-2" />
            <AlertDescription>
              Deleting a reward will permanently remove it from the database.
            </AlertDescription>
          </Alert>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {approvedRewards.map((reward) => (
              <RewardCard
                key={reward.id}
                reward={reward}
                availablePoints={availablePoints}
                onRedeemClick={onRedeemClick}
                onDeleteClick={onDeleteClick}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
