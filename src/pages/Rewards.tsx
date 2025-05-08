
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

  // Force a data refresh when the component mounts to ensure we have the very latest data
  useEffect(() => {
    console.log("Rewards component mounted, forcing a data refresh");
    // This will ensure we get the absolute latest data from the database
    refreshData();
    
    // Don't include refreshData in dependencies to avoid infinite loop
  }, []); // Empty dependency array ensures this runs only once on mount
  
  // Log the rewards that we're passing to AvailableRewards
  useEffect(() => {
    console.log("All rewards about to be displayed:", allRewards);
    console.log("Pending rewards about to be displayed:", localPendingRewards);
  }, [allRewards, localPendingRewards]);
  
  const handleManualRefresh = async () => {
    setIsManualRefreshing(true);
    console.log("Manual refresh requested");
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
        
        // Force a refresh after submitting a proposal
        toast.success("Reward proposal submitted!");
        
        // Make sure we refresh data after submitting to get the latest state
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
