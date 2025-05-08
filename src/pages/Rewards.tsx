
import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Award, Plus } from 'lucide-react';
import { Reward } from '@/types';
import { toast } from '@/components/ui/sonner';
import { RewardCard } from '@/components/reward/RewardCard';
import { PendingRewardCard } from '@/components/reward/PendingRewardCard';
import { ProposeRewardForm, ProposedRewardFormValues } from '@/components/reward/ProposeRewardForm';
import { mockRewards } from '@/lib/mock-data';

const Rewards = () => {
  const { rewards: appRewards, availablePoints, isLoading, redeemReward, proposeReward, pendingRewards, approveReward, rejectReward, deleteReward } = useApp();
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [showProposeDialog, setShowProposeDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<Reward | null>(null);
  
  // Combine app rewards with mock rewards for display
  // This ensures we always have some default rewards available
  const allRewards = [...(appRewards || [])];
  
  // Add mock rewards if they don't already exist in the app rewards
  if (mockRewards) {
    mockRewards.forEach(mockReward => {
      if (!appRewards || !appRewards.some(appReward => appReward.title === mockReward.title)) {
        allRewards.push(mockReward);
      }
    });
  }

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

  const handleDeleteClick = (reward: Reward) => {
    setShowDeleteConfirm(reward);
  };
  
  const handleDeleteConfirm = async () => {
    if (!showDeleteConfirm) return;
    
    const success = await deleteReward(showDeleteConfirm.id);
    
    if (success) {
      setShowDeleteConfirm(null);
      toast.success('Reward deleted successfully');
    }
  };

  // Handle approving a reward - immediately adds it to the rewards list
  const handleApproveReward = async (rewardId: string) => {
    const success = await approveReward(rewardId);
    if (success) {
      toast.success('Reward approved successfully');
    }
  };
  
  // Handle rejecting a reward
  const handleRejectReward = async (rewardId: string) => {
    const success = await rejectReward(rewardId);
    if (success) {
      toast.success('Reward rejected');
    }
  };
  
  const onSubmitProposal = async (data: ProposedRewardFormValues) => {
    try {
      await proposeReward({
        title: data.title,
        description: data.description,
        pointsCost: data.pointsCost,
        imageIcon: data.imageIcon
      });
      setShowProposeDialog(false);
    } catch (error) {
      console.error(error);
    }
  };
  
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
        <div className="flex items-center gap-4">
          <Button 
            onClick={() => setShowProposeDialog(true)}
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
      
      {pendingRewards && pendingRewards.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Rewards Pending Your Approval</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingRewards.map((reward) => (
              <PendingRewardCard
                key={reward.id}
                reward={reward}
                onApprove={handleApproveReward}
                onReject={handleRejectReward}
              />
            ))}
          </div>
        </div>
      )}
      
      <h2 className="text-xl font-semibold mb-4">Available Rewards</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allRewards.map((reward) => (
          <RewardCard
            key={reward.id}
            reward={reward}
            availablePoints={availablePoints}
            onRedeemClick={handleRedeemClick}
            onDeleteClick={handleDeleteClick}
          />
        ))}
      </div>
      
      {/* Redeem Reward Dialog */}
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!showDeleteConfirm} onOpenChange={(open) => !open && setShowDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Reward</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the "{showDeleteConfirm?.title}" reward? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Propose Reward Dialog */}
      <Dialog open={showProposeDialog} onOpenChange={setShowProposeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Propose New Reward</DialogTitle>
            <DialogDescription>
              Create a custom reward that your partner needs to approve.
            </DialogDescription>
          </DialogHeader>
          
          <ProposeRewardForm 
            onSubmit={onSubmitProposal}
            onCancel={() => setShowProposeDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Rewards;
