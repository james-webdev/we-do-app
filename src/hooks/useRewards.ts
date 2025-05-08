
import { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Reward, RewardStatus } from '@/types';
import { toast } from '@/components/ui/sonner';
import { mockRewards } from '@/lib/mock-data';

export function useRewards() {
  const { 
    rewards: appRewards, 
    availablePoints, 
    isLoading, 
    redeemReward, 
    proposeReward, 
    pendingRewards, 
    approveReward, 
    rejectReward, 
    deleteReward,
    refreshData 
  } = useApp();
  
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<Reward | null>(null);
  const [localApprovedRewards, setLocalApprovedRewards] = useState<Reward[]>([]);
  const [localPendingRewards, setLocalPendingRewards] = useState<Reward[]>([]);
  
  // Keep track of recently processed reward IDs to prevent them from reappearing
  const [recentlyProcessedIds, setRecentlyProcessedIds] = useState<string[]>([]);
  
  // Force data refresh when component mounts
  useEffect(() => {
    console.log("useRewards hook mounted, triggering data refresh");
    refreshData();
    // Don't include refreshData in deps to avoid infinite loop
  }, []);
  
  // Update local pending rewards when app state changes
  useEffect(() => {
    if (pendingRewards) {
      console.log("Updating local pending rewards:", pendingRewards);
      // Filter out recently processed rewards from the pending rewards
      const filteredPendingRewards = pendingRewards.filter(
        reward => !recentlyProcessedIds.includes(reward.id)
      );
      setLocalPendingRewards(filteredPendingRewards);
    } else {
      setLocalPendingRewards([]);
    }
  }, [pendingRewards, recentlyProcessedIds]);
  
  // Update local approved rewards when app rewards change
  useEffect(() => {
    if (appRewards) {
      console.log("App rewards updated:", appRewards);
      // If appRewards has been updated with our locally approved rewards,
      // we don't need to keep them in localApprovedRewards anymore
      const filteredLocal = localApprovedRewards.filter(localReward => 
        !appRewards.some(appReward => appReward.id === localReward.id)
      );
      
      setLocalApprovedRewards(filteredLocal);
      
      // Remove any processed IDs that are now in appRewards
      if (recentlyProcessedIds.length > 0) {
        const stillRecentlyProcessed = recentlyProcessedIds.filter(id => 
          !appRewards.some(appReward => appReward.id === id)
        );
        
        if (stillRecentlyProcessed.length !== recentlyProcessedIds.length) {
          setRecentlyProcessedIds(stillRecentlyProcessed);
        }
      }
    }
  }, [appRewards, localApprovedRewards, recentlyProcessedIds]);
  
  // Combine app rewards with locally approved rewards
  const allRewards = [...(appRewards || []), ...localApprovedRewards];
  
  // Only add mock rewards if there are no other rewards available
  // This prevents mock rewards from appearing after real rewards are created
  const finalRewards = allRewards.length > 0 ? allRewards : mockRewards || [];

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
    
    console.log(`Confirming deletion of reward: ${showDeleteConfirm.id}`);
    const success = await deleteReward(showDeleteConfirm.id);
    
    if (success) {
      setShowDeleteConfirm(null);
      
      // Remove the reward locally immediately
      const updatedRewards = allRewards.filter(r => r.id !== showDeleteConfirm.id);
      setLocalApprovedRewards(prev => prev.filter(r => r.id !== showDeleteConfirm.id));
      
      // Add to recently processed IDs
      setRecentlyProcessedIds(prev => [...prev, showDeleteConfirm.id]);
      
      toast.success('Reward deleted successfully');
      
      // Force a refresh to ensure the database is in sync
      setTimeout(() => {
        refreshData();
      }, 500);
    }
  };

  // Handle approving a reward - immediately adds it to the rewards list
  const handleApproveReward = async (rewardId: string) => {
    // First find the reward in the pending rewards
    const reward = localPendingRewards.find(r => r.id === rewardId);
    if (!reward) return;

    console.log("Approving reward:", rewardId);
    
    // Add to recently processed IDs to prevent it from reappearing in pending
    setRecentlyProcessedIds(prev => [...prev, rewardId]);
    
    // Remove from pending rewards locally immediately
    setLocalPendingRewards(prev => prev.filter(r => r.id !== rewardId));
    
    // Add to local approved rewards immediately with the status changed to 'approved'
    const approvedReward: Reward = {
      ...reward,
      status: 'approved' as RewardStatus
    };
    
    // Update the local state first for immediate UI feedback
    setLocalApprovedRewards(prev => [...prev, approvedReward]);
    
    // Update in the backend to make it visible to both partners
    console.log("Approving reward in backend:", rewardId);
    const success = await approveReward(rewardId);
    
    if (success) {
      toast.success('Reward approved successfully');
      
      // Force a refresh to ensure the database is in sync
      setTimeout(() => {
        refreshData();
      }, 500);
    } else {
      // If backend update fails, revert local changes
      setRecentlyProcessedIds(prev => prev.filter(id => id !== rewardId));
      setLocalPendingRewards(prev => [...prev, reward]);
      setLocalApprovedRewards(prev => prev.filter(r => r.id !== rewardId));
      toast.error('Failed to approve reward');
    }
  };
  
  // Handle rejecting a reward - completely removes it from the database
  const handleRejectReward = async (rewardId: string) => {
    // Find the reward in the pending rewards
    const reward = localPendingRewards.find(r => r.id === rewardId);
    if (!reward) return;
    
    console.log("Rejecting reward:", rewardId);
    
    // Add to recently processed IDs to prevent it from reappearing in pending
    setRecentlyProcessedIds(prev => [...prev, rewardId]);
    
    // Update local state immediately for UI feedback
    setLocalPendingRewards(prev => prev.filter(r => r.id !== rewardId));
    
    // Delete the reward from the database completely
    console.log("Deleting rejected reward from database:", rewardId);
    const success = await rejectReward(rewardId);
    
    if (success) {
      toast.success('Reward rejected and removed');
      
      // Force a refresh to ensure the database is in sync
      setTimeout(() => {
        refreshData();
      }, 500);
    } else {
      // Revert local change if backend fails
      setRecentlyProcessedIds(prev => prev.filter(id => id !== rewardId));
      setLocalPendingRewards(prev => [...prev, reward]);
      toast.error('Failed to reject reward');
    }
  };

  return {
    allRewards: finalRewards,
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
    proposeReward,
    refreshData
  };
}
