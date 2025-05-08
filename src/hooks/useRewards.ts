
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
    currentUser,
    proposeReward: appContextProposeReward
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
      
      // For real rewards - use the function from AppContext directly
      const success = await appContextProposeReward(selectedReward.id);
      
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
  
  // Handle reward proposal with correct hook usage
  const proposeReward = async (reward: Omit<Reward, "id" | "status" | "createdById" | "createdAt">) => {
    try {
      console.log('Starting reward proposal process');
      
      if (!currentUser) {
        console.error('No user found when proposing reward');
        toast.error('You must be logged in to propose rewards');
        return false;
      }
      
      console.log('Proposing reward with data:', reward);
      console.log('Current user ID:', currentUser.id);
      
      // Use the appContextProposeReward function that we got from useApp() at the top level
      const success = await appContextProposeReward(reward);
      
      console.log('Propose reward result:', success);
      
      if (success) {
        toast.success('Reward proposed successfully!');
        return true;
      } else {
        toast.error('Failed to propose reward - unsuccessful response');
        return false;
      }
    } catch (error: any) {
      console.error('Exception in proposeReward hook function:', error);
      toast.error(`Failed to propose reward: ${error?.message || 'Unknown error'}`);
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
    proposeReward,
    refreshData
  };
}
