
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ProposeRewardForm, ProposedRewardFormValues } from '@/components/reward/ProposeRewardForm';
import { LoadingRewards } from '@/components/reward/LoadingRewards';
import { RewardsHeader } from '@/components/reward/RewardsHeader';
import { PendingRewardsList } from '@/components/reward/PendingRewardsList';
import { AvailableRewards } from '@/components/reward/AvailableRewards';
import { RedeemRewardDialog } from '@/components/reward/RedeemRewardDialog';
import { DeleteRewardDialog } from '@/components/reward/DeleteRewardDialog';
import { useRewards } from '@/hooks/useRewards';

const Rewards = () => {
  const [showProposeDialog, setShowProposeDialog] = useState(false);
  
  const {
    allRewards,
    localPendingRewards,
    availablePoints,
    isLoading,
    selectedReward,
    setSelectedReward,
    isRedeeming,
    showDeleteConfirm,
    setShowDeleteConfirm,
    handleRedeemClick,
    handleRedeemConfirm,
    handleDeleteClick,
    handleDeleteConfirm,
    handleApproveReward,
    handleRejectReward,
    proposeReward
  } = useRewards();

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
    return <LoadingRewards />;
  }
  
  return (
    <div className="container py-8">
      <RewardsHeader 
        availablePoints={availablePoints} 
        onProposeReward={() => setShowProposeDialog(true)} 
      />
      
      <PendingRewardsList 
        pendingRewards={localPendingRewards} 
        onApprove={handleApproveReward} 
        onReject={handleRejectReward} 
      />
      
      <AvailableRewards 
        rewards={allRewards} 
        availablePoints={availablePoints} 
        onRedeemClick={handleRedeemClick} 
        onDeleteClick={handleDeleteClick} 
      />
      
      {/* Redeem Reward Dialog */}
      <RedeemRewardDialog 
        selectedReward={selectedReward}
        isRedeeming={isRedeeming}
        onClose={() => setSelectedReward(null)}
        onConfirm={handleRedeemConfirm}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteRewardDialog 
        rewardToDelete={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(null)}
        onConfirm={handleDeleteConfirm}
      />

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
