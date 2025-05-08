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
    deleteReward 
  } = useApp();
  
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<Reward | null>(null);
  const [localApprovedRewards, setLocalApprovedRewards] = useState<Reward[]>([]);
  const [localPendingRewards, setLocalPendingRewards] = useState<Reward[]>([]);
  
  // Keep track of recently approved/rejected reward IDs to prevent them from reappearing in pending
  const [recentlyProcessedIds, setRecentlyProcessedIds] = useState<string[]>([]);
  
  // Update local pending rewards when app state changes
  useEffect(() => {
    // Filter out any recently processed rewards from the pending rewards
    if (pendingRewards) {
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
      // If appRewards has been updated with our locally approved rewards,
      // we don't need to keep them in localApprovedRewards anymore
      const filteredLocal = localApprovedRewards.filter(localReward => 
        !appRewards.some(appReward => appReward.id === localReward.id)
      );
      
      setLocalApprovedRewards(filteredLocal);
      
      // If any recently processed rewards appear in appRewards, remove them from tracking
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
  
  // Combine app rewards with locally approved rewards first
  const allRewards = [...(appRewards || []), ...localApprovedRewards];
  
  // Then add mock rewards if they don't already exist in the combined rewards
  if (mockRewards) {
    mockRewards.forEach(mockReward => {
      const existsInAllRewards = allRewards.some(
        reward => reward.title === mockReward.title
      );
      
      if (!existsInAllRewards) {
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
    // First find the reward in the pending rewards
    const reward = localPendingRewards.find(r => r.id === rewardId);
    if (!reward) return;

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
      // The approved reward will be fetched for both partners on the next data refresh
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
    
    // Add to recently processed IDs to prevent it from reappearing in pending
    setRecentlyProcessedIds(prev => [...prev, rewardId]);
    
    // Update local state immediately for UI feedback
    setLocalPendingRewards(prev => prev.filter(r => r.id !== rewardId));
    
    // Delete the reward from the database completely
    console.log("Deleting rejected reward from database:", rewardId);
    const success = await rejectReward(rewardId);
    
    if (success) {
      toast.success('Reward rejected and removed');
    } else {
      // Revert local change if backend fails
      setRecentlyProcessedIds(prev => prev.filter(id => id !== rewardId));
      setLocalPendingRewards(prev => [...prev, reward]);
      toast.error('Failed to reject reward');
    }
  };

  return {
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
  };
}
