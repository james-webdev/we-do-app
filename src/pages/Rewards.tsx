
import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Award, Gift, CircleDollarSign, Star } from 'lucide-react';
import { Reward } from '@/types';

const Rewards = () => {
  const { rewards, availablePoints, isLoading, redeemReward } = useApp();
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [isRedeeming, setIsRedeeming] = useState(false);
  
  const handleRedeemClick = (reward: Reward) => {
    setSelectedReward(reward);
  };
  
  const handleRedeemConfirm = async () => {
    if (!selectedReward) return;
    
    setIsRedeeming(true);
    const success = await redeemReward(selectedReward.id);
    setIsRedeeming(false);
    
    if (success) {
      setSelectedReward(null);
    }
  };
  
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
      default:
        return <Gift className="w-10 h-10 text-purple-500" />;
    }
  };
  
  // Updated rewards with higher point costs
  const updatedRewards = [
    {
      id: '1',
      title: 'Dinner Out',
      description: 'Partner cooks dinner of your choice',
      pointsCost: 20,
      imageIcon: 'gift'
    },
    {
      id: '2',
      title: 'Movie Night',
      description: 'Your choice of movie plus snacks',
      pointsCost: 10,
      imageIcon: 'star'
    },
    {
      id: '3',
      title: 'Sleep In',
      description: 'Partner takes morning duties',
      pointsCost: 15,
      imageIcon: 'circle-dollar-sign'
    },
    {
      id: '4',
      title: 'Day Off',
      description: 'Partner handles all tasks for a full day',
      pointsCost: 30,
      imageIcon: 'award'
    }
  ];
  
  if (isLoading) {
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Rewards</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-[200px] w-full" />
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Rewards</h1>
        <div className="bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-lg font-medium flex items-center">
          <Award className="mr-2" />
          {availablePoints} {availablePoints === 1 ? 'point' : 'points'} available
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {updatedRewards.map((reward) => (
          <Card key={reward.id} className="overflow-hidden hover:shadow-md transition-shadow">
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
              <Button 
                className="w-full" 
                onClick={() => handleRedeemClick(reward)}
                disabled={availablePoints < reward.pointsCost}
              >
                {availablePoints < reward.pointsCost 
                  ? `Need ${reward.pointsCost - availablePoints} more points` 
                  : 'Redeem Reward'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Dialog open={!!selectedReward} onOpenChange={(open) => !open && setSelectedReward(null)}>
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
              onClick={() => setSelectedReward(null)}
              disabled={isRedeeming}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRedeemConfirm}
              disabled={isRedeeming}
            >
              {isRedeeming ? 'Redeeming...' : 'Confirm Redemption'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Rewards;
