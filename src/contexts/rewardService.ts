
import { supabase } from '@/integrations/supabase/client';
import { Reward } from '@/types';
import { toast } from '@/components/ui/sonner';

export async function proposeReward(
  reward: Omit<Reward, "id" | "status" | "createdById" | "createdAt">,
  currentUserId: string | undefined,
  currentUserPartnerId: string | null | undefined,
  refreshData: () => void
): Promise<boolean> {
  try {
    if (!currentUserId) {
      toast.error('User not authenticated');
      return false;
    }
    
    if (!currentUserPartnerId) {
      toast.error('You need to connect with a partner first');
      return false;
    }

    const { data, error } = await supabase
      .from('rewards')
      .insert({
        title: reward.title,
        description: reward.description,
        points_cost: reward.pointsCost,
        image_icon: reward.imageIcon,
        status: 'pending',
        created_by_id: currentUserId,
        created_at: new Date().toISOString()
      })
      .select()
      .single();
      
    if (error) {
      console.error('Error proposing reward:', error);
      toast.error(error.message || 'Failed to propose reward');
      return false;
    }
    
    console.log("Reward proposed successfully:", data);
    toast.success('Reward proposal submitted for partner approval');
    
    // Add a slight delay before refreshing data to allow the database to update
    setTimeout(() => {
      refreshData();
    }, 300);
    
    return true;
  } catch (error: any) {
    console.error('Error proposing reward:', error);
    toast.error(error.message || 'Failed to propose reward');
    return false;
  }
}

export async function approveReward(
  rewardId: string,
  refreshData: () => void
): Promise<boolean> {
  try {
    console.log(`Approving reward ID: ${rewardId}`);
    
    // Update the reward status to 'approved' in the database
    const { error } = await supabase
      .from('rewards')
      .update({ status: 'approved' })
      .eq('id', rewardId);
      
    if (error) {
      console.error('Error approving reward:', error);
      toast.error(error.message || 'Failed to approve reward');
      return false;
    }
    
    // After approval, trigger a data refresh to update both users' rewards lists
    console.log('Reward approved successfully, refreshing data');
    
    // Add a slight delay before refreshing data to allow the database to update
    setTimeout(() => {
      refreshData();
    }, 300);
    
    return true;
  } catch (error: any) {
    console.error('Error approving reward:', error);
    toast.error(error.message || 'Failed to approve reward');
    return false;
  }
}

export async function rejectReward(
  rewardId: string,
  refreshData: () => void
): Promise<boolean> {
  try {
    console.log(`Rejecting and removing reward ID: ${rewardId}`);
    
    // First, verify the reward exists before attempting to delete
    const { data: checkReward, error: checkError } = await supabase
      .from('rewards')
      .select('id')
      .eq('id', rewardId)
      .single();
      
    if (checkError || !checkReward) {
      console.error('Error checking reward existence:', checkError);
      toast.error('Failed to find the reward to reject');
      return false;
    }
    
    // Delete the rejected reward from the database completely
    const { error } = await supabase
      .from('rewards')
      .delete()
      .eq('id', rewardId);
      
    if (error) {
      console.error('Error deleting rejected reward:', error);
      toast.error(error.message || 'Failed to reject reward');
      return false;
    }
    
    toast.success('Reward rejected and removed');
    console.log(`Successfully deleted reward ID: ${rewardId} from database`);
    
    // Add a slight delay before refreshing data to allow the database to update
    setTimeout(() => {
      refreshData();
    }, 300);
    
    return true;
  } catch (error: any) {
    console.error('Error rejecting reward:', error);
    toast.error(error.message || 'Failed to reject reward');
    return false;
  }
}

export async function deleteReward(
  rewardId: string,
  currentUserId: string | undefined,
  refreshData: () => void
): Promise<boolean> {
  try {
    if (!currentUserId) {
      toast.error('User not authenticated');
      return false;
    }

    console.log(`Deleting reward ID: ${rewardId}`);
    
    // First, verify the reward exists before attempting to delete
    const { data: checkReward, error: checkError } = await supabase
      .from('rewards')
      .select('id')
      .eq('id', rewardId)
      .single();
      
    if (checkError || !checkReward) {
      console.error('Error checking reward existence:', checkError);
      toast.error('Failed to find the reward to delete');
      return false;
    }

    const { error } = await supabase
      .from('rewards')
      .delete()
      .eq('id', rewardId);
      
    if (error) {
      console.error('Error deleting reward:', error);
      toast.error(error.message || 'Failed to delete reward');
      return false;
    }
    
    toast.success('Reward deleted successfully');
    console.log(`Successfully deleted reward ID: ${rewardId} from database`);
    
    // Add a slight delay before refreshing data to allow the database to update
    setTimeout(() => {
      refreshData();
    }, 300);
    
    return true;
  } catch (error: any) {
    console.error('Error deleting reward:', error);
    toast.error(error.message || 'Failed to delete reward');
    return false;
  }
}

export async function redeemReward(
  rewardId: string,
  rewards: Reward[],
  availablePoints: number,
  currentUserId: string | undefined,
  refreshData: () => void
): Promise<boolean> {
  try {
    if (!currentUserId) {
      toast.error('User not authenticated');
      return false;
    }
    
    // Get the reward details
    const reward = rewards.find(r => r.id === rewardId);
    if (!reward) {
      toast.error('Reward not found');
      return false;
    }
    
    // Check if user has enough points
    if (availablePoints < reward.pointsCost) {
      toast.error('Not enough points to redeem this reward');
      return false;
    }
    
    // In a real app, we'd mark specific points as redeemed
    // For now, we'll mark the oldest unredeemed points as redeemed
    const { data: pointsToRedeem, error: fetchError } = await supabase
      .from('brownie_points')
      .select('*')
      .eq('to_user_id', currentUserId)
      .eq('redeemed', false)
      .order('created_at', { ascending: true });
      
    if (fetchError) throw fetchError;
    
    if (pointsToRedeem) {
      let remainingCost = reward.pointsCost;
      const pointsToUpdate = [];
      
      for (const point of pointsToRedeem) {
        if (remainingCost <= 0) break;
        
        pointsToUpdate.push(point.id);
        remainingCost -= point.points;
      }
      
      // Update points to redeemed
      if (pointsToUpdate.length > 0) {
        const { error: updateError } = await supabase
          .from('brownie_points')
          .update({ redeemed: true })
          .in('id', pointsToUpdate);
          
        if (updateError) throw updateError;
      }
    }
    
    toast.success('Reward redeemed successfully!');
    
    // Add a slight delay before refreshing data to allow the database to update
    setTimeout(() => {
      refreshData();
    }, 300);
    
    return true;
  } catch (error: any) {
    console.error('Error redeeming reward:', error);
    toast.error(error.message || 'Failed to redeem reward');
    return false;
  }
}
