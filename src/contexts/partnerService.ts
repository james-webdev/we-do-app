
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { ProfileResult } from './types';

export async function connectPartner(
  partnerEmail: string,
  currentUserId: string | undefined,
  currentUserPartnerId: string | null | undefined,
  refreshData: () => void
): Promise<boolean> {
  try {
    if (!currentUserId) {
      toast.error('User not authenticated');
      return false;
    }
    
    if (currentUserPartnerId) {
      toast.error('You already have a partner connected');
      return false;
    }

    // Use our security definer function to find partner by email
    const { data: partnerData, error: rpcError } = await supabase
      .rpc('get_profile_by_email', {
        email_param: partnerEmail
      })
      .maybeSingle();
    
    if (rpcError) {
      console.error('Error finding partner:', rpcError);
      toast.error('Failed to find user with that email');
      return false;
    }
    
    if (!partnerData) {
      toast.error('No user found with that email address');
      return false;
    }
    
    // Type assertion for partnerData
    const partnerResult = partnerData as ProfileResult;
    
    if (partnerResult.id === currentUserId) {
      toast.error('You cannot connect with yourself');
      return false;
    }
    
    if (partnerResult.partner_id) {
      toast.error('This user is already connected with someone else');
      return false;
    }
    
    // Use security definer function to update both user profiles
    const { error: updateCurrentError } = await supabase.rpc('update_user_partner', {
      user_id_param: currentUserId,
      partner_id_param: partnerResult.id
    });
    
    if (updateCurrentError) {
      console.error('Error updating current user:', updateCurrentError);
      toast.error('Failed to connect with partner');
      return false;
    }
    
    const { error: updatePartnerError } = await supabase.rpc('update_user_partner', {
      user_id_param: partnerResult.id, 
      partner_id_param: currentUserId
    });
    
    if (updatePartnerError) {
      console.error('Error updating partner user:', updatePartnerError);
      // Rollback the first update if the second fails
      await supabase.rpc('update_user_partner', {
        user_id_param: currentUserId,
        partner_id_param: null
      });
        
      toast.error('Failed to connect with partner');
      return false;
    }
    
    toast.success(`Successfully connected with ${partnerResult.name}`);
    await refreshData(); // Refresh data
    return true;
  } catch (error: any) {
    console.error('Error connecting partner:', error);
    toast.error(error.message || 'Failed to connect with partner');
    return false;
  }
}
