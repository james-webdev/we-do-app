import { supabase } from '@/integrations/supabase/client';
import { Reward, RewardStatus } from '@/types';
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
      console.error('Cannot propose reward: No user ID provided');
      toast.error('You must be logged in to propose rewards');
      return false;
    }

    console.log('Proposing new reward with user ID:', currentUserId);
    console.log('Reward data:', reward);
    
    // Map the JavaScript camelCase fields to the database snake_case fields
    const { data, error } = await supabase
      .from('rewards')
      .insert({
        title: reward.title,
        description: reward.description,
        points_cost: reward.pointsCost,
        image_icon: reward.imageIcon,
        status: 'approved' as const, // All rewards are automatically approved
        created_by_id: currentUserId,
      })
      .select();
      
    if (error) {
      console.error('Database error while proposing reward:', error);
      toast.error('Failed to create reward: ' + error.message);
      return false;
    }
    
    console.log('Reward creation successful, database response:', data);
    toast.success('Reward created successfully');
    
    // Refresh data to show the newly created reward
    refreshData();
    return true;
  } catch (error: any) {
    console.error('Exception while proposing reward:', error);
    toast.error('Failed to create reward: ' + (error.message || 'Unknown error'));
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
    await refreshData();
    return true;
  } catch (error: any) {
    console.error('Exception while deleting reward:', error);
    toast.error('Failed to delete reward');
    return false;
  }
}

/**
 * Redeems a reward and deletes used points, creating individual 1-point records for any remainder
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
      .eq('redeemed', false as boolean)
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
    
    // Track which points to delete and what new points to create
    let remainingCost = pointsCost;
    const pointsToDelete = [];
    const newPointsToCreate = [];
    
    for (const point of availablePoints) {
      if (remainingCost <= 0) break;
      
      if (point.points <= remainingCost) {
        // Use this entire point record - mark for deletion
        pointsToDelete.push(point.id);
        remainingCost -= point.points;
      } else {
        // Need to split this point record
        // 1. Mark original for deletion
        pointsToDelete.push(point.id);
        
        // 2. Create individual 1-point records for the remaining points
        const remainingPoints = point.points - remainingCost;
        for (let i = 0; i < remainingPoints; i++) {
          newPointsToCreate.push({
            from_user_id: point.from_user_id,
            to_user_id: point.to_user_id,
            type: point.type,
            message: point.message,
            points: 1, // Each record has exactly 1 point
            redeemed: false,
            created_at: point.created_at // Keep the original timestamp
          });
        }
        
        remainingCost = 0;
      }
    }
    
    // Process all updates
    const success = true;
    
    // 1. Delete used points
    if (pointsToDelete.length > 0) {
      const { error: deleteError } = await supabase
        .from('brownie_points')
        .delete()
        .in('id', pointsToDelete);
        
      if (deleteError) {
        console.error('Error deleting used points:', deleteError);
        toast.error('Failed to delete used points');
        return false;
      }
    }
    
    // 2. Create new points for any remainder
    if (newPointsToCreate.length > 0) {
      const { error: insertError } = await supabase
        .from('brownie_points')
        .insert(newPointsToCreate);
        
      if (insertError) {
        console.error('Error creating new point records:', insertError);
        toast.error('Failed to create new point records');
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
