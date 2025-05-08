
import { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Reward } from '@/types';
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
  
  // Update local state when app state changes
  useEffect(() => {
    setLocalPendingRewards(pendingRewards || []);
  }, [pendingRewards]);
  
  // Combine app rewards with mock rewards and locally approved rewards
  const allRewards = [...(appRewards || []), ...localApprovedRewards];
  
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
    const reward = localPendingRewards.find(r => r.id === rewardId);
    if (!reward) return;

    // Add to local approved rewards immediately
    setLocalApprovedRewards(prev => [...prev, reward]);
    
    // Remove from pending rewards locally
    setLocalPendingRewards(prev => prev.filter(r => r.id !== rewardId));
    
    // Update in the backend
    const success = await approveReward(rewardId);
    if (success) {
      toast.success('Reward approved successfully');
    } else {
      // If backend update fails, revert local changes
      setLocalApprovedRewards(prev => prev.filter(r => r.id !== rewardId));
      setLocalPendingRewards(prev => [...prev, reward]);
      toast.error('Failed to approve reward');
    }
  };
  
  // Handle rejecting a reward
  const handleRejectReward = async (rewardId: string) => {
    // Remove from pending rewards locally first
    const reward = localPendingRewards.find(r => r.id === rewardId);
    if (reward) {
      setLocalPendingRewards(prev => prev.filter(r => r.id !== rewardId));
    }
    
    const success = await rejectReward(rewardId);
    if (success) {
      toast.success('Reward rejected');
    } else {
      // Revert local change if backend fails
      if (reward) {
        setLocalPendingRewards(prev => [...prev, reward]);
      }
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
