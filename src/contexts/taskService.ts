
import { supabase } from '@/integrations/supabase/client';
import { Task, TaskStatus, TaskRating, TaskType } from '@/types';
import { toast } from '@/components/ui/sonner';
import { calculateTaskBrowniePoints } from './appContextUtils';

export async function addNewTask(
  taskData: Omit<Task, "id" | "status">,
  currentUserId: string | undefined,
  currentUserPartnerId: string | null | undefined,
  refreshData: () => void
): Promise<void> {
  try {
    if (!currentUserId) {
      toast.error('User not authenticated');
      return;
    }
    
    if (!currentUserPartnerId) {
      toast.error('You need to connect with a partner first');
      return;
    }
    
    console.log("Submitting new task for approval:", taskData);
    
    // Insert task with pending status
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        title: taskData.title,
        type: taskData.type,
        rating: taskData.rating,
        user_id: currentUserId,
        timestamp: taskData.timestamp.toISOString(),
        status: 'pending',
        created_at: new Date().toISOString()
      })
      .select()
      .single();
      
    if (error) {
      console.error("Error submitting task:", error);
      throw error;
    }
    
    console.log("Task submitted successfully:", data);
    toast.success('Task submitted for partner approval');
    
    // Add a slight delay before refreshing data to allow the database to update
    setTimeout(() => {
      refreshData(); // Refresh all data to update pendingTasks for the partner
    }, 300);
  } catch (error: any) {
    console.error('Error adding task:', error);
    toast.error(error.message || 'Failed to add task');
  }
}

export async function approveTask(
  taskId: string, 
  currentUserId: string | undefined, 
  partnerId: string | null | undefined,
  refreshData: () => void
): Promise<void> {
  try {
    // First update the task status to approved
    const { error, data } = await supabase
      .from('tasks')
      .update({ status: 'approved' })
      .eq('id', taskId)
      .select('*')
      .single();
      
    if (error) throw error;
    
    if (data && currentUserId && partnerId) {
      // Calculate brownie points to award based on task rating
      const pointsToAward = calculateTaskBrowniePoints(data.rating);
      
      // Award brownie points to the task creator
      // Points are sent from the partner who approved the task to the task creator
      if (data.user_id !== currentUserId) {
        // Only award points if the task was created by the partner (not self-approval)
        const { error: brownieError } = await supabase
          .from('brownie_points')
          .insert({
            from_user_id: currentUserId,
            to_user_id: data.user_id,
            type: 'effort', // Default to effort type for task-based rewards
            message: `Reward for completing task: ${data.title}`,
            redeemed: false,
            created_at: new Date().toISOString(),
            points: pointsToAward
          });
          
        if (brownieError) {
          console.error('Error awarding brownie points:', brownieError);
          // Continue despite error in awarding points
        } else {
          toast.success(`Task approved! ${pointsToAward} brownie point${pointsToAward > 1 ? 's' : ''} awarded.`);
        }
      } else {
        // Just show approval toast without points for self-approval
        toast.success('Task approved');
      }
    } else {
      toast.success('Task approved');
    }
    
    await refreshData(); // Refresh data
  } catch (error: any) {
    console.error('Error approving task:', error);
    toast.error(error.message || 'Failed to approve task');
  }
}

export async function rejectTask(
  taskId: string, 
  comment: string,
  refreshData: () => void
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('tasks')
      .update({ 
        status: 'rejected',
        comment 
      })
      .eq('id', taskId);
      
    if (error) throw error;
    
    toast.success('Task rejected');
    await refreshData(); // Refresh data
    return true; // Return success status
  } catch (error: any) {
    console.error('Error rejecting task:', error);
    toast.error(error.message || 'Failed to reject task');
    return false; // Return failure status
  }
}

export async function deleteTask(
  taskId: string,
  refreshData: () => void
): Promise<void> {
  try {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);
      
    if (error) throw error;
    
    toast.success('Task deleted successfully');
    await refreshData(); // Refresh data
  } catch (error: any) {
    console.error('Error deleting task:', error);
    toast.error(error.message || 'Failed to delete task');
  }
}
