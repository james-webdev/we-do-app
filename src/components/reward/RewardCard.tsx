import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Reward } from '@/types';
import { useApp } from '@/contexts/AppContext';
import { 
  Gift, 
  Star, 
  CircleDollarSign, 
  Award, 
  Trash2, 
  Check
} from 'lucide-react';

interface RewardCardProps {
  reward: Reward;
  onRedeemClick: (reward: Reward) => void;
  onDeleteClick: (reward: Reward) => void;
}

const iconMap = {
  'gift': Gift,
  'star': Star,
  'circle-dollar-sign': CircleDollarSign,
  'award': Award,
  // Add more icon mappings as needed
};

export const RewardCard = ({ reward, onRedeemClick, onDeleteClick }: RewardCardProps) => {
  const { availablePoints } = useApp();
  const hasEnoughPoints = availablePoints >= reward.pointsCost;
  
  // Determine which icon to use
  const IconComponent = iconMap[reward.imageIcon as keyof typeof iconMap] || Gift;
  
  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-full">
              <IconComponent className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-lg">{reward.title}</CardTitle>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => onDeleteClick(reward)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription className="text-xs">
          Created by {reward.createdById === useApp().currentUser?.id ? 'you' : 'partner'}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-gray-600">{reward.description}</p>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between items-center">
        <div className="flex items-center gap-1">
          <CircleDollarSign className="h-4 w-4 text-amber-500" />
          <span className="text-sm font-semibold">{reward.pointsCost} points</span>
        </div>
        <Button
          variant={hasEnoughPoints ? "default" : "outline"}
          size="sm"
          disabled={!hasEnoughPoints}
          onClick={() => onRedeemClick(reward)}
          className={!hasEnoughPoints ? "opacity-50" : ""}
        >
          <Check className="h-4 w-4 mr-1" />
          Redeem
        </Button>
      </CardFooter>
    </Card>
  );
};
