
import { supabase } from '@/integrations/supabase/client';
import { Reward } from '@/types';
import { toast } from '@/components/ui/sonner';

/**
 * Creates a new reward proposal in the database
 */
export async function proposeReward(
  reward: Omit<Reward, "id" | "status" | "createdById" | "createdAt">,
  currentUserId: string | undefined,
  refreshData: () => void
): Promise<boolean> {
  try {
    if (!currentUserId) {
      toast.error('You must be logged in to propose rewards');
      return false;
    }

    console.log('Proposing new reward:', reward);
    
    const { error } = await supabase
      .from('rewards')
      .insert({
        title: reward.title,
        description: reward.description,
        points_cost: reward.pointsCost,
        image_icon: reward.imageIcon,
        status: 'pending',
        created_by_id: currentUserId,
      });
      
    if (error) {
      console.error('Error proposing reward:', error);
      toast.error('Failed to propose reward: ' + error.message);
      return false;
    }
    
    toast.success('Reward proposed for approval');
    refreshData();
    return true;
  } catch (error: any) {
    console.error('Exception while proposing reward:', error);
    toast.error('Failed to propose reward');
    return false;
  }
}

/**
 * Approves a reward by changing its status to 'approved'
 */
export async function approveReward(
  rewardId: string,
  refreshData: () => void
): Promise<boolean> {
  try {
    console.log('Approving reward ID:', rewardId);
    
    const { error } = await supabase
      .from('rewards')
      .update({ status: 'approved' })
      .eq('id', rewardId);
      
    if (error) {
      console.error('Error approving reward:', error);
      toast.error('Failed to approve reward: ' + error.message);
      return false;
    }
    
    toast.success('Reward approved');
    refreshData();
    return true;
  } catch (error: any) {
    console.error('Exception while approving reward:', error);
    toast.error('Failed to approve reward');
    return false;
  }
}

/**
 * Rejects a reward by deleting it from the database
 */
export async function rejectReward(
  rewardId: string,
  refreshData: () => void
): Promise<boolean> {
  try {
    console.log('Rejecting reward ID:', rewardId);
    
    // Only delete from database if it's a real reward (not mock data)
    if (rewardId.startsWith('mock-')) {
      console.log('Skipping database delete for mock reward');
      return true;
    }
    
    const { error } = await supabase
      .from('rewards')
      .delete()
      .eq('id', rewardId);
      
    if (error) {
      console.error('Error rejecting reward:', error);
      toast.error('Failed to reject reward: ' + error.message);
      return false;
    }
    
    toast.success('Reward rejected');
    refreshData();
    return true;
  } catch (error: any) {
    console.error('Exception while rejecting reward:', error);
    toast.error('Failed to reject reward');
    return false;
  }
}

/**
 * Deletes a reward from the database
 */
export async function deleteReward(
  rewardId: string,
  refreshData: () => void
): Promise<boolean> {
  try {
    console.log('Deleting reward ID:', rewardId);
    
    // Only delete from database if it's a real reward (not mock data)
    if (rewardId.startsWith('mock-')) {
      console.log('Skipping database delete for mock reward');
      return true;
    }
    
    const { error } = await supabase
      .from('rewards')
      .delete()
      .eq('id', rewardId);
      
    if (error) {
      console.error('Error deleting reward:', error);
      toast.error('Failed to delete reward: ' + error.message);
      return false;
    }
    
    toast.success('Reward deleted');
    refreshData();
    return true;
  } catch (error: any) {
    console.error('Exception while deleting reward:', error);
    toast.error('Failed to delete reward');
    return false;
  }
}

/**
 * Redeems a reward and marks points as redeemed
 */
export async function redeemReward(
  rewardId: string,
  pointsCost: number,
  currentUserId: string | undefined,
  refreshData: () => void
): Promise<boolean> {
  try {
    if (!currentUserId) {
      toast.error('You must be logged in to redeem rewards');
      return false;
    }
    
    // For mock rewards, just show a success message
    if (rewardId.startsWith('mock-')) {
      toast.success('Mock reward redeemed');
      return true;
    }
    
    // Get unredeemed brownie points
    const { data: availablePoints, error: pointsError } = await supabase
      .from('brownie_points')
      .select('*')
      .eq('to_user_id', currentUserId)
      .eq('redeemed', false)
      .order('created_at', { ascending: true });
      
    if (pointsError) {
      console.error('Error fetching available points:', pointsError);
      toast.error('Failed to fetch available points');
      return false;
    }
    
    if (!availablePoints || availablePoints.length === 0) {
      toast.error('No available points to redeem');
      return false;
    }
    
    // Calculate total available points
    const totalAvailable = availablePoints.reduce((sum, point) => sum + point.points, 0);
    
    if (totalAvailable < pointsCost) {
      toast.error(`Not enough points to redeem this reward (need ${pointsCost}, have ${totalAvailable})`);
      return false;
    }
    
    // Mark points as redeemed
    let remainingCost = pointsCost;
    const pointsToUpdate = [];
    
    for (const point of availablePoints) {
      if (remainingCost <= 0) break;
      
      pointsToUpdate.push(point.id);
      remainingCost -= point.points;
    }
    
    if (pointsToUpdate.length > 0) {
      const { error: updateError } = await supabase
        .from('brownie_points')
        .update({ redeemed: true })
        .in('id', pointsToUpdate);
        
      if (updateError) {
        console.error('Error redeeming points:', updateError);
        toast.error('Failed to redeem points');
        return false;
      }
    }
    
    toast.success('Reward redeemed successfully!');
    refreshData();
    return true;
  } catch (error: any) {
    console.error('Exception while redeeming reward:', error);
    toast.error('Failed to redeem reward');
    return false;
  }
}
