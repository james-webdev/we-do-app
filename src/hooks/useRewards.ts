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
  const [useMockRewards, setUseMockRewards] = useState<boolean>(true);
  
  // Keep track of recently processed reward IDs to prevent them from reappearing
  const [recentlyProcessedIds, setRecentlyProcessedIds] = useState<string[]>([]);
  
  // Check if we have real rewards from the database and should stop using mock data
  useEffect(() => {
    // If we have any real rewards from the database, stop using mock rewards
    if (appRewards && appRewards.length > 0) {
      setUseMockRewards(false);
    }
  }, [appRewards]);
  
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
  
  // Only add mock rewards if explicitly using mock rewards and there are no other rewards available
  // This ensures we keep showing mock rewards until user explicitly deletes them
  const finalRewards = useMockRewards ? [...allRewards, ...mockRewards] : allRewards;

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
    
    // Check if it's a mock reward (their IDs typically start with "reward")
    const isMockReward = showDeleteConfirm.id.startsWith('reward');
    
    if (isMockReward) {
      console.log("Deleting a mock reward locally");
      // For mock rewards, just update the local state to stop showing it
      setUseMockRewards(false);
      toast.success('Mock reward removed');
      setShowDeleteConfirm(null);
    } else {
      // For real database rewards, delete from the database
      const success = await deleteReward(showDeleteConfirm.id);
      
      if (success) {
        console.log(`Successfully deleted reward ${showDeleteConfirm.id} from database`);
        setShowDeleteConfirm(null);
        
        // Remove the reward locally immediately
        setLocalApprovedRewards(prev => prev.filter(r => r.id !== showDeleteConfirm.id));
        
        // Add to recently processed IDs
        setRecentlyProcessedIds(prev => [...prev, showDeleteConfirm.id]);
        
        toast.success('Reward deleted successfully');
        
        // Force a refresh to ensure the database is in sync
        setTimeout(() => {
          refreshData();
        }, 500);
      } else {
        console.error(`Failed to delete reward ${showDeleteConfirm.id}`);
        toast.error('Failed to delete reward');
      }
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
      }, 1000); // Increase timeout to ensure deletion completes
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
