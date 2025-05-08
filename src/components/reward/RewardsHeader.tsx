
import React from 'react';
import { Button } from '@/components/ui/button';
import { Award, Plus } from 'lucide-react';

interface RewardsHeaderProps {
  availablePoints: number;
  onProposeReward: () => void;
}

export function RewardsHeader({ availablePoints, onProposeReward }: RewardsHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold">Rewards</h1>
      <div className="flex items-center gap-4">
        <Button 
          onClick={onProposeReward}
          className="flex items-center gap-1"
          variant="outline"
        >
          <Plus size={16} />
          Propose Reward
        </Button>
        <div className="bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-lg font-medium flex items-center">
          <Award className="mr-2" />
          {availablePoints} {availablePoints === 1 ? 'point' : 'points'} available
        </div>
      </div>
    </div>
  );
}
