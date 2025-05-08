
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, Gift, CircleDollarSign, Star, Trophy, Gem, Medal, Diamond, Wallet, Coins } from 'lucide-react';
import { Reward } from '@/types';

interface PendingRewardCardProps {
  reward: Reward;
  onApprove: (rewardId: string) => void;
  onReject: (rewardId: string) => void;
}

export const PendingRewardCard = ({ reward, onApprove, onReject }: PendingRewardCardProps) => {
  const getRewardIcon = (iconName: string) => {
    switch (iconName) {
      case 'gift':
        return <Gift className="w-10 h-10 text-purple-500" />;
      case 'award':
        return <Award className="w-10 h-10 text-yellow-500" />;
      case 'star':
        return <Star className="w-10 h-10 text-blue-500" />;
      case 'circle-dollar-sign':
        return <CircleDollarSign className="w-10 h-10 text-green-500" />;
      case 'trophy':
        return <Trophy className="w-10 h-10 text-amber-500" />;
      case 'gem':
        return <Gem className="w-10 h-10 text-pink-500" />;
      case 'medal':
        return <Medal className="w-10 h-10 text-red-500" />;
      case 'diamond':
        return <Diamond className="w-10 h-10 text-cyan-500" />;
      case 'wallet':
        return <Wallet className="w-10 h-10 text-indigo-500" />;
      case 'coins':
        return <Coins className="w-10 h-10 text-orange-500" />;
      default:
        return <Gift className="w-10 h-10 text-purple-500" />;
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow border-amber-200 bg-amber-50">
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-4">
          {getRewardIcon(reward.imageIcon)}
          <div>
            <h2 className="text-xl font-semibold">{reward.title}</h2>
            <div className="flex items-center text-amber-600 font-medium">
              <Award size={16} className="mr-1" />
              {reward.pointsCost} {reward.pointsCost === 1 ? 'point' : 'points'}
            </div>
          </div>
        </div>
        <p className="text-gray-600 mb-6">{reward.description}</p>
        <div className="flex gap-2">
          <Button 
            className="w-1/2" 
            variant="outline"
            onClick={() => onReject(reward.id)}
          >
            Reject
          </Button>
          <Button 
            className="w-1/2" 
            onClick={() => onApprove(reward.id)}
          >
            Approve
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
