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
  
  // Keep track of recently approved reward IDs to prevent them from reappearing in pending
  const [recentlyApprovedIds, setRecentlyApprovedIds] = useState<string[]>([]);
  
  // Update local pending rewards when app state changes
  useEffect(() => {
    // Filter out any recently approved rewards from the pending rewards
    if (pendingRewards) {
      const filteredPendingRewards = pendingRewards.filter(
        reward => !recentlyApprovedIds.includes(reward.id)
      );
      setLocalPendingRewards(filteredPendingRewards);
    } else {
      setLocalPendingRewards([]);
    }
  }, [pendingRewards, recentlyApprovedIds]);
  
  // Update local approved rewards when app rewards change
  useEffect(() => {
    // Keep previously locally approved rewards that aren't yet in appRewards
    // This prevents them from disappearing during refresh cycles
    const newLocalApproved = [...localApprovedRewards];
    
    // Remove any rewards that now exist in appRewards to prevent duplicates
    const filteredLocal = newLocalApproved.filter(localReward => 
      !appRewards || !appRewards.some(appReward => appReward.id === localReward.id)
    );
    
    setLocalApprovedRewards(filteredLocal);
    
    // If any recently approved rewards appear in appRewards, remove them from tracking
    if (appRewards && recentlyApprovedIds.length > 0) {
      const stillRecentlyApproved = recentlyApprovedIds.filter(id => 
        !appRewards.some(appReward => appReward.id === id)
      );
      
      if (stillRecentlyApproved.length !== recentlyApprovedIds.length) {
        setRecentlyApprovedIds(stillRecentlyApproved);
      }
    }
  }, [appRewards]);
  
  // Combine app rewards with mock rewards and locally approved rewards
  const allRewards = [...(appRewards || []), ...localApprovedRewards];
  
  // Add mock rewards if they don't already exist in the app rewards
  if (mockRewards) {
    mockRewards.forEach(mockReward => {
      const existsInAppRewards = appRewards && appRewards.some(
        appReward => appReward.title === mockReward.title
      );
      
      const existsInLocalApproved = localApprovedRewards.some(
        localReward => localReward.title === mockReward.title
      );
      
      if (!existsInAppRewards && !existsInLocalApproved) {
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
    const reward = localPendingRewards.find(r => r.id === rewardId);
    if (!reward) return;

    // Add to recently approved IDs to prevent it from reappearing in pending
    setRecentlyApprovedIds(prev => [...prev, rewardId]);
    
    // Remove from pending rewards locally
    setLocalPendingRewards(prev => prev.filter(r => r.id !== rewardId));
    
    // Add to local approved rewards immediately with the status changed to 'approved'
    const approvedReward: Reward = {
      ...reward,
      status: 'approved' as RewardStatus
    };
    
    setLocalApprovedRewards(prev => [...prev, approvedReward]);
    
    // Update in the backend
    const success = await approveReward(rewardId);
    
    if (success) {
      toast.success('Reward approved successfully');
      // We keep the reward in localApprovedRewards until the next refresh brings it in from appRewards
    } else {
      // If backend update fails, revert local changes
      setRecentlyApprovedIds(prev => prev.filter(id => id !== rewardId));
      setLocalPendingRewards(prev => [...prev, reward]);
      setLocalApprovedRewards(prev => prev.filter(r => r.id !== rewardId));
      toast.error('Failed to approve reward');
    }
  };
  
  // Handle rejecting a reward
  const handleRejectReward = async (rewardId: string) => {
    // Remove from pending rewards locally first
    const reward = localPendingRewards.find(r => r.id === rewardId);
    if (!reward) return;
    
    // Add to recently approved IDs to prevent it from reappearing in pending
    setRecentlyApprovedIds(prev => [...prev, rewardId]);
    
    setLocalPendingRewards(prev => prev.filter(r => r.id !== rewardId));
    
    const success = await rejectReward(rewardId);
    if (success) {
      toast.success('Reward rejected');
    } else {
      // Revert local change if backend fails
      setRecentlyApprovedIds(prev => prev.filter(id => id !== rewardId));
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
