
import { supabase } from '@/integrations/supabase/client';
import { BrowniePoint, BrowniePointType } from '@/types';
import { toast } from '@/components/ui/sonner';

export async function addNewBrowniePoint(
  pointData: Omit<BrowniePoint, "id" | "createdAt" | "redeemed">,
  refreshData: () => void
): Promise<void> {
  try {
    // Create individual records for each point
    const pointsToAdd = [];
    const timestamp = new Date().toISOString();
    
    for (let i = 0; i < pointData.points; i++) {
      pointsToAdd.push({
        from_user_id: pointData.fromUserId,
        to_user_id: pointData.toUserId,
        type: pointData.type,
        message: pointData.message,
        redeemed: false,
        created_at: timestamp,
        points: 1 // Each record has exactly 1 point
      });
    }
    
    const { error } = await supabase
      .from('brownie_points')
      .insert(pointsToAdd);
      
    if (error) throw error;
    
    toast.success('Brownie Point sent successfully');
    await refreshData(); // Refresh all data
  } catch (error: any) {
    console.error('Error sending brownie point:', error);
    toast.error(error.message || 'Failed to send Brownie Point');
  }
}

export async function deleteBrowniePoint(
  pointId: string,
  refreshData: () => void
): Promise<void> {
  try {
    const { error } = await supabase
      .from('brownie_points')
      .delete()
      .eq('id', pointId);
      
    if (error) throw error;
    
    toast.success('Brownie Point deleted successfully');
    await refreshData(); // Refresh data
  } catch (error: any) {
    console.error('Error deleting Brownie Point:', error);
    toast.error(error.message || 'Failed to delete Brownie Point');
  }
}
