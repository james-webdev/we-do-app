
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ProposeRewardForm, ProposedRewardFormValues } from '@/components/reward/ProposeRewardForm';
import { LoadingRewards } from '@/components/reward/LoadingRewards';
import { RewardsHeader } from '@/components/reward/RewardsHeader';
import { PendingRewardsList } from '@/components/reward/PendingRewardsList';
import { AvailableRewards } from '@/components/reward/AvailableRewards';
import { RedeemRewardDialog } from '@/components/reward/RedeemRewardDialog';
import { DeleteRewardDialog } from '@/components/reward/DeleteRewardDialog';
import { useRewards } from '@/hooks/useRewards';
import { useApp } from '@/contexts/AppContext';
import { toast } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const Rewards = () => {
  const [showProposeDialog, setShowProposeDialog] = useState(false);
  const [isManualRefreshing, setIsManualRefreshing] = useState(false);
  const { refreshData } = useApp();
  
  const {
    allRewards,
    pendingRewards,
    availablePoints,
    isLoading,
    selectedReward,
    setSelectedReward,
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

  // Force refresh on mount and periodically
  useEffect(() => {
    console.log("Rewards component mounted, forcing a data refresh");
    refreshData();
    
    // Set up periodic refresh every 30 seconds
    const intervalId = setInterval(() => {
      console.log("Performing automatic data refresh");
      refreshData();
    }, 30000);
    
    // Clean up on unmount
    return () => clearInterval(intervalId);
  }, []);
  
  const handleManualRefresh = async () => {
    setIsManualRefreshing(true);
    await refreshData();
    
    // Add a delay before setting isManualRefreshing back to false
    setTimeout(() => {
      setIsManualRefreshing(false);
      toast.success("Rewards refreshed");
    }, 800);
  };
  
  if (isLoading) {
    return <LoadingRewards />;
  }
  
  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <RewardsHeader 
          availablePoints={availablePoints} 
          onProposeReward={() => setShowProposeDialog(true)} 
        />
        
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={handleManualRefresh}
          disabled={isManualRefreshing}
        >
          <RefreshCw className={`h-4 w-4 ${isManualRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      {pendingRewards && pendingRewards.length > 0 && (
        <PendingRewardsList 
          pendingRewards={pendingRewards} 
          onApprove={handleApproveReward} 
          onReject={handleRejectReward} 
        />
      )}
      
      <AvailableRewards 
        rewards={allRewards} 
        availablePoints={availablePoints} 
        onRedeemClick={handleRedeemClick} 
        onDeleteClick={handleDeleteClick} 
      />
      
      {/* Redeem Reward Dialog */}
      <RedeemRewardDialog 
        selectedReward={selectedReward}
        isRedeeming={false}
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

  async function onSubmitProposal(data: ProposedRewardFormValues) {
    try {
      const success = await proposeReward({
        title: data.title,
        description: data.description,
        pointsCost: data.pointsCost,
        imageIcon: data.imageIcon
      });
      
      if (success) {
        setShowProposeDialog(false);
        
        // Make sure we refresh data after submitting
        setTimeout(() => {
          refreshData();
        }, 500);
      }
    } catch (error) {
      console.error(error);
    }
  }
};

export default Rewards;
