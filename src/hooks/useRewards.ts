
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
    pendingRewards,
    refreshData,
    currentUser
  } = useApp();
  
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<Reward | null>(null);
  const [showMockRewards, setShowMockRewards] = useState<boolean>(true);
  
  // Determine if we should show mock rewards based on if we have real rewards
  useEffect(() => {
    if (appRewards && appRewards.length > 0) {
      setShowMockRewards(false);
    }
  }, [appRewards]);
  
  // Calculate final list of rewards to display
  const approvedRewards = [...(appRewards || [])];
  
  // Add mock rewards if needed and no real rewards exist
  const displayRewards = showMockRewards ? 
    [...approvedRewards, ...mockRewards] : 
    approvedRewards;
  
  // Handle reward redemption
  const handleRedeemClick = (reward: Reward) => {
    setSelectedReward(reward);
  };
  
  const handleRedeemConfirm = async () => {
    if (!selectedReward) return;
    
    try {
      // For mock rewards
      if (selectedReward.id.startsWith('mock-')) {
        if (availablePoints < selectedReward.pointsCost) {
          toast.error('Not enough points to redeem this reward');
          return;
        }
        toast.success('Mock reward redeemed!');
        setSelectedReward(null);
        return;
      }
      
      // For real rewards
      const success = await useApp().redeemReward(selectedReward.id);
      
      if (success) {
        setSelectedReward(null);
      }
    } catch (error) {
      console.error('Error redeeming reward:', error);
      toast.error('Failed to redeem reward');
    }
  };
  
  // Handle reward deletion
  const handleDeleteClick = (reward: Reward) => {
    setShowDeleteConfirm(reward);
  };
  
  const handleDeleteConfirm = async () => {
    if (!showDeleteConfirm) return;
    
    try {
      // For mock rewards
      if (showDeleteConfirm.id.startsWith('mock-')) {
        setShowMockRewards(false);
        toast.success('Mock reward removed');
        setShowDeleteConfirm(null);
        return;
      }
      
      // For real rewards
      const success = await useApp().deleteReward(showDeleteConfirm.id);
      
      if (success) {
        setShowDeleteConfirm(null);
      }
    } catch (error) {
      console.error('Error deleting reward:', error);
      toast.error('Failed to delete reward');
    }
  };
  
  // Handle reward approval
  const handleApproveReward = async (rewardId: string) => {
    try {
      await useApp().approveReward(rewardId);
    } catch (error) {
      console.error('Error approving reward:', error);
      toast.error('Failed to approve reward');
    }
  };
  
  // Handle reward rejection
  const handleRejectReward = async (rewardId: string) => {
    try {
      await useApp().rejectReward(rewardId);
    } catch (error) {
      console.error('Error rejecting reward:', error);
      toast.error('Failed to reject reward');
    }
  };
  
  // Handle reward proposal
  const proposeReward = async (reward: Omit<Reward, "id" | "status" | "createdById" | "createdAt">) => {
    try {
      console.log('Proposing reward with current user:', currentUser?.id);
      if (!currentUser) {
        toast.error('You must be logged in to propose rewards');
        return false;
      }
      
      return await useApp().proposeReward(reward);
    } catch (error) {
      console.error('Error proposing reward:', error);
      toast.error('Failed to propose reward');
      return false;
    }
  };

  return {
    allRewards: displayRewards,
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
    proposeReward,
    refreshData
  };
}
