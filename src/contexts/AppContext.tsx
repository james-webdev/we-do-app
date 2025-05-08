import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { User, Task, BrowniePoint, Reward, TaskStatus, TaskRating, TaskType, BrowniePointType, RewardStatus } from '@/types';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

// Define types for the RPC function results to fix TypeScript errors
type ProfileResult = {
  id: string;
  name: string;
  email: string;
  partner_id: string | null;
  created_at: string;
};

type TaskResult = {
  id: string;
  title: string;
  type: string;
  rating: number;
  user_id: string;
  timestamp: string;
  status: string;
  comment: string | null;
  created_at: string;
};

interface AppContextType {
  currentUser: User | null;
  partner: User | null;
  tasks: Task[];
  pendingTasks: Task[];
  browniePoints: BrowniePoint[];
  rewards: Reward[];
  pendingRewards: Reward[]; // New: rewards pending approval
  summary: any;
  availablePoints: number;
  isLoading: boolean;
  refreshData: () => void;
  addNewTask: (task: Omit<Task, "id" | "status">) => Promise<void>;
  approveTask: (taskId: string) => Promise<void>;
  rejectTask: (taskId: string, comment: string) => Promise<boolean>;
  addNewBrowniePoint: (point: Omit<BrowniePoint, "id" | "createdAt" | "redeemed">) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  deleteBrowniePoint: (pointId: string) => Promise<void>;
  redeemReward: (rewardId: string) => Promise<boolean>;
  connectPartner: (partnerEmail: string) => Promise<boolean>;
  hasPartner: boolean;
  proposeReward: (reward: Omit<Reward, "id" | "status" | "createdById" | "createdAt">) => Promise<boolean>; // New
  approveReward: (rewardId: string) => Promise<boolean>; // New
  rejectReward: (rewardId: string) => Promise<boolean>; // New
  deleteReward: (rewardId: string) => Promise<boolean>; // New
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [partner, setPartner] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [pendingTasks, setPendingTasks] = useState<Task[]>([]);
  const [browniePoints, setBrowniePoints] = useState<BrowniePoint[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [pendingRewards, setPendingRewards] = useState<Reward[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [availablePoints, setAvailablePoints] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasPartner, setHasPartner] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshAttempt, setLastRefreshAttempt] = useState<number>(0);

  const fetchData = async () => {
    if (!user) {
      console.log("No user found, skipping data fetch");
      setIsLoading(false);
      return;
    }
    
    // Prevent multiple simultaneous refresh requests
    if (isRefreshing) {
      console.log("Already refreshing data, skipping duplicate request");
      return;
    }

    // Implement throttling - don't allow refreshes more frequently than every 5 seconds
    const now = Date.now();
    if (now - lastRefreshAttempt < 5000) {
      console.log("Refresh attempt too soon after previous attempt, skipping");
      return;
    }
    
    setLastRefreshAttempt(now);
    setIsRefreshing(true);
    
    try {
      setIsLoading(true);
      console.log("Fetching profile data for user:", user.id);
      
      // Use our security definer function to get the current user's profile
      const { data: profileData, error: profileError } = await supabase
        .rpc('get_profile_by_id', { user_id: user.id })
        .maybeSingle();
      
      if (profileError) {
        console.error('Error fetching user profile:', profileError);
        toast.error('Failed to load user profile');
        setIsLoading(false);
        return;
      }
      
      if (profileData) {
        console.log("Profile data loaded successfully", profileData);
        // Use explicit type assertion to fix TypeScript errors
        const profileResult = profileData as ProfileResult;
        
        const currentUserData: User = {
          id: profileResult.id,
          name: profileResult.name,
          email: profileResult.email,
          partnerId: profileResult.partner_id
        };
        
        setCurrentUser(currentUserData);
        setHasPartner(!!profileResult.partner_id);
        
        // Get partner info if available
        if (profileResult.partner_id) {
          console.log("Fetching partner data for:", profileResult.partner_id);
          // Use the security definer function for partner data
          const { data: partnerData, error: partnerError } = await supabase
            .rpc('get_profile_by_id', { user_id: profileResult.partner_id })
            .maybeSingle();
          
          if (!partnerError && partnerData) {
            console.log("Partner data loaded successfully", partnerData);
            // Use explicit type assertion
            const partnerResult = partnerData as ProfileResult;
            
            setPartner({
              id: partnerResult.id,
              name: partnerResult.name,
              email: partnerResult.email,
              partnerId: partnerResult.partner_id
            });
          } else {
            console.log('Partner not found or error:', partnerError);
            setPartner(null);
          }
        } else {
          // No partner set yet
          setPartner(null);
        }

        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        // Store tasks data at a higher scope so we can use it later
        let fetchedTasksData: TaskResult[] = [];

        // Key change: Use the security definer function for fetching tasks
        try {
          console.log("Fetching tasks using security definer function");
          const { data: tasksResult, error: tasksError } = await supabase
            .rpc('get_tasks_for_user', { user_id: user.id });

          if (tasksError) {
            console.error('Error fetching tasks:', tasksError);
            toast.error('Failed to load tasks. Please try again later.');
            throw tasksError;
          } else if (tasksResult) {
            // Use explicit type assertion
            fetchedTasksData = tasksResult as TaskResult[];
            console.log("Tasks loaded successfully:", fetchedTasksData.length);
            
            // Filter for approved tasks within the last week
            const approvedRecentTasks = fetchedTasksData
              .filter(task => 
                task.status === 'approved' && 
                new Date(task.timestamp) >= oneWeekAgo
              );

            const formattedTasks: Task[] = approvedRecentTasks.map(task => ({
              id: task.id,
              title: task.title,
              type: task.type as TaskType,
              rating: task.rating as TaskRating,
              userId: task.user_id,
              timestamp: new Date(task.timestamp),
              status: task.status as TaskStatus,
              comment: task.comment
            }));
            
            setTasks(formattedTasks);

            // Filter for pending tasks from partner
            if (profileResult.partner_id) {
              console.log("Checking for pending tasks from partner:", profileResult.partner_id);
              const pendingPartnerTasks = fetchedTasksData.filter(task => 
                task.status === 'pending' && 
                task.user_id === profileResult.partner_id
              );
              
              console.log("Found pending partner tasks:", pendingPartnerTasks.length);
              
              const formattedPendingTasks: Task[] = pendingPartnerTasks.map(task => ({
                id: task.id,
                title: task.title,
                type: task.type as TaskType,
                rating: task.rating as TaskRating,
                userId: task.user_id,
                timestamp: new Date(task.timestamp),
                status: task.status as TaskStatus,
                comment: task.comment
              }));
              
              setPendingTasks(formattedPendingTasks);
            } else {
              console.log("No partner found, no pending tasks to load");
              setPendingTasks([]);
            }
            
            // Calculate summary stats using the fetched data
            calculateSummaryStats(fetchedTasksData, [], oneWeekAgo, user.id, profileResult.partner_id);
          }
        } catch (error) {
          console.error('Error in tasks fetch:', error);
          // Don't reset to empty array on error - keep existing data
          fetchedTasksData = fetchedTasksData.length > 0 ? fetchedTasksData : []; 
        }
        
        // Get brownie points - since we now have simple RLS policies, we can query directly
        try {
          // Get sent brownie points
          console.log("Fetching brownie points sent by user");
          const { data: sentPoints, error: sentPointsError } = await supabase
            .from('brownie_points')
            .select('*')
            .eq('from_user_id', user.id)
            .gte('created_at', oneWeekAgo.toISOString());

          if (sentPointsError) {
            console.error('Error fetching sent brownie points:', sentPointsError);
          }

          // Get received brownie points
          console.log("Fetching brownie points received by user");
          const { data: receivedPoints, error: receivedPointsError } = await supabase
            .from('brownie_points')
            .select('*')
            .eq('to_user_id', user.id)
            .gte('created_at', oneWeekAgo.toISOString());

          if (receivedPointsError) {
            console.error('Error fetching received brownie points:', receivedPointsError);
          }

          // Combine points
          const fetchedBrowniePointsData = [...(sentPoints || []), ...(receivedPoints || [])];
          console.log("Brownie points loaded:", fetchedBrowniePointsData.length);
          
          const formattedPoints: BrowniePoint[] = fetchedBrowniePointsData.map(point => ({
            id: point.id,
            fromUserId: point.from_user_id,
            toUserId: point.to_user_id,
            type: point.type as BrowniePointType,
            message: point.message,
            redeemed: point.redeemed,
            createdAt: new Date(point.created_at),
            points: point.points
          }));
          
          setBrowniePoints(formattedPoints);
          
          // Calculate available points
          try {
            console.log("Calculating available points for user:", user.id);
            const { data: availablePointsData, error: availableError } = await supabase
              .from('brownie_points')
              .select('points')
              .eq('to_user_id', user.id)
              .eq('redeemed', false);
              
            if (!availableError && availablePointsData) {
              const points = availablePointsData.reduce((sum, point) => sum + point.points, 0);
              console.log("Available points:", points);
              setAvailablePoints(points);
            }
          } catch (error) {
            console.error('Error calculating available points:', error);
          }
          
          // Get rewards - Both approved rewards and pending rewards from partner
          try {
            console.log("Fetching rewards for user:", user.id);
            // Get all approved rewards - these should be visible to both partners
            const { data: rewardsData, error: rewardsError } = await supabase
              .from('rewards')
              .select('*')
              .eq('status', 'approved');
              
            if (rewardsError) {
              console.error('Error fetching rewards:', rewardsError);
            } else if (rewardsData) {
              console.log("Approved rewards loaded:", rewardsData.length);
              
              const formattedRewards: Reward[] = rewardsData.map(reward => ({
                id: reward.id,
                title: reward.title,
                description: reward.description,
                pointsCost: reward.points_cost,
                imageIcon: reward.image_icon,
                status: reward.status as RewardStatus,
                createdById: reward.created_by_id,
                createdAt: new Date(reward.created_at)
              }));
              
              setRewards(formattedRewards);
            }
            
            // Get pending rewards from partner
            if (profileResult.partner_id) {
              console.log("Fetching pending rewards from partner:", profileResult.partner_id);
              const { data: pendingRewardsData, error: pendingRewardsError } = await supabase
                .from('rewards')
                .select('*')
                .eq('status', 'pending')
                .eq('created_by_id', profileResult.partner_id);
                
              if (pendingRewardsError) {
                console.error('Error fetching pending rewards:', pendingRewardsError);
              } else if (pendingRewardsData) {
                console.log("Pending rewards loaded:", pendingRewardsData.length);
                
                const formattedPendingRewards: Reward[] = pendingRewardsData.map(reward => ({
                  id: reward.id,
                  title: reward.title,
                  description: reward.description,
                  pointsCost: reward.points_cost,
                  imageIcon: reward.image_icon,
                  status: reward.status as RewardStatus,
                  createdById: reward.created_by_id,
                  createdAt: new Date(reward.created_at)
                }));
                
                setPendingRewards(formattedPendingRewards);
              }
            }
          } catch (error) {
            console.error('Error in rewards fetch:', error);
          }
          
          // Calculate available points
          try {
            console.log("Calculating available points for user:", user.id);
            const { data: availablePointsData, error: availableError } = await supabase
              .from('brownie_points')
              .select('points')
              .eq('to_user_id', user.id)
              .eq('redeemed', false);
              
            if (!availableError && availablePointsData) {
              const points = availablePointsData.reduce((sum, point) => sum + point.points, 0);
              console.log("Available points:", points);
              setAvailablePoints(points);
            }
          } catch (error) {
            console.error('Error calculating available points:', error);
          }
        } catch (error) {
          console.error('Error in brownie points fetch:', error);
        }
      } else {
        console.warn("Profile data not found for user:", user.id);
        setCurrentUser(null);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data. Please try again.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Helper function to calculate summary statistics
  const calculateSummaryStats = (
    tasksData: TaskResult[], 
    browniePointsData: any[], 
    oneWeekAgo: Date, 
    userId: string, 
    partnerId: string | null
  ) => {
    // Default values for when there's no data or partner
    const defaultSummary = {
      userTaskCount: 0,
      partnerTaskCount: 0,
      totalTasks: 0,
      userContribution: 50,
      mentalTasks: 0,
      physicalTasks: 0,
      userPoints: 0,
      partnerPoints: 0,
      sentBrowniePoints: 0,
      browniePointsRemaining: 3
    };

    if (tasksData.length === 0 && !partnerId) {
      // No tasks and no partner, use default summary
      setSummary(defaultSummary);
      return;
    }

    if (tasksData.length > 0) {
      const userTasks = tasksData.filter(t => t.user_id === userId);
      const partnerTasks = partnerId ? tasksData.filter(t => t.user_id === partnerId) : [];
      
      const userTaskCount = userTasks.length;
      const partnerTaskCount = partnerTasks.length;
      const totalTasks = userTaskCount + partnerTaskCount;
      
      const userContribution = totalTasks > 0 ? Math.round((userTaskCount / totalTasks) * 100) : 50;
      
      const mentalTasks = tasksData.filter(t => t.type === 'mental' || t.type === 'both').length;
      const physicalTasks = tasksData.filter(t => t.type === 'physical' || t.type === 'both').length;
      
      const userPoints = userTasks.reduce((sum, task) => sum + task.rating, 0);
      const partnerPoints = partnerTasks.reduce((sum, task) => sum + task.rating, 0);
      
      // Count brownie points sent this week
      const sentBrowniePoints = browniePointsData ? browniePointsData.filter(
        p => p.from_user_id === userId && 
        new Date(p.created_at) >= oneWeekAgo
      ).length : 0;
      
      setSummary({
        userTaskCount,
        partnerTaskCount,
        totalTasks,
        userContribution,
        mentalTasks,
        physicalTasks,
        userPoints,
        partnerPoints,
        sentBrowniePoints,
        browniePointsRemaining: 3 - sentBrowniePoints
      });
    } else {
      // No tasks but user exists
      setSummary(defaultSummary);
    }
  };

  const addNewTask = async (taskData: Omit<Task, "id" | "status">) => {
    try {
      if (!currentUser) {
        toast.error('User not authenticated');
        return;
      }
      
      if (!currentUser.partnerId) {
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
          user_id: currentUser.id,
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
        fetchData(); // Refresh all data to update pendingTasks for the partner
      }, 300);
    } catch (error: any) {
      console.error('Error adding task:', error);
      toast.error(error.message || 'Failed to add task');
    }
  };

  const calculateTaskBrowniePoints = (taskRating: number): number => {
    // Higher rated tasks earn more points
    // This formula creates a progressive reward system
    // Tasks rated 1-3: 1 point
    // Tasks rated 4-6: 2 points
    // Tasks rated 7-8: 3 points
    // Tasks rated 9-10: 4 points
    if (taskRating <= 3) return 1;
    if (taskRating <= 6) return 2;
    if (taskRating <= 8) return 3;
    return 4; // For ratings 9-10
  };

  const approveTask = async (taskId: string) => {
    try {
      // First update the task status to approved
      const { error, data } = await supabase
        .from('tasks')
        .update({ status: 'approved' })
        .eq('id', taskId)
        .select('*')
        .single();
        
      if (error) throw error;
      
      if (data && currentUser && partner) {
        // Calculate brownie points to award based on task rating
        const pointsToAward = calculateTaskBrowniePoints(data.rating);
        
        // Award brownie points to the task creator
        // Points are sent from the partner who approved the task to the task creator
        if (data.user_id !== currentUser.id) {
          // Only award points if the task was created by the partner (not self-approval)
          const { error: brownieError } = await supabase
            .from('brownie_points')
            .insert({
              from_user_id: currentUser.id,
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
      
      await fetchData(); // Refresh data
    } catch (error: any) {
      console.error('Error approving task:', error);
      toast.error(error.message || 'Failed to approve task');
    }
  };

  const rejectTask = async (taskId: string, comment: string) => {
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
      await fetchData(); // Refresh data
      return true; // Return success status
    } catch (error: any) {
      console.error('Error rejecting task:', error);
      toast.error(error.message || 'Failed to reject task');
      return false; // Return failure status
    }
  };

  const addNewBrowniePoint = async (pointData: Omit<BrowniePoint, "id" | "createdAt" | "redeemed">) => {
    try {
      // Determine points value based on type
      const pointsValue = getPointsValueByType(pointData.type);
      
      const { error } = await supabase
        .from('brownie_points')
        .insert({
          from_user_id: pointData.fromUserId,
          to_user_id: pointData.toUserId,
          type: pointData.type,
          message: pointData.message,
          redeemed: false,
          created_at: new Date().toISOString(),
          points: pointData.points
        });
        
      if (error) throw error;
      
      toast.success('Brownie Point sent successfully');
      await fetchData(); // Refresh all data
    } catch (error: any) {
      console.error('Error sending brownie point:', error);
      toast.error(error.message || 'Failed to send Brownie Point');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);
        
      if (error) throw error;
      
      toast.success('Task deleted successfully');
      await fetchData(); // Refresh data
    } catch (error: any) {
      console.error('Error deleting task:', error);
      toast.error(error.message || 'Failed to delete task');
    }
  };

  const handleDeleteBrowniePoint = async (pointId: string) => {
    try {
      const { error } = await supabase
        .from('brownie_points')
        .delete()
        .eq('id', pointId);
        
      if (error) throw error;
      
      toast.success('Brownie Point deleted successfully');
      await fetchData(); // Refresh data
    } catch (error: any) {
      console.error('Error deleting Brownie Point:', error);
      toast.error(error.message || 'Failed to delete Brownie Point');
    }
  };

  const handleRedeemReward = async (rewardId: string) => {
    try {
      if (!currentUser) {
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
        .eq('to_user_id', currentUser.id)
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
      await fetchData(); // Refresh data
      return true;
    } catch (error: any) {
      console.error('Error redeeming reward:', error);
      toast.error(error.message || 'Failed to redeem reward');
      return false;
    }
  };

  // Add the deleteReward function
  const handleDeleteReward = async (rewardId: string) => {
    try {
      if (!currentUser) {
        toast.error('User not authenticated');
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
      
      // Add a slight delay before refreshing data to allow the database to update
      setTimeout(() => {
        fetchData();
      }, 300);
      
      return true;
    } catch (error: any) {
      console.error('Error deleting reward:', error);
      toast.error(error.message || 'Failed to delete reward');
      return false;
    }
  };

  // Updated connect partner function to use security definer function
  const connectPartner = async (partnerEmail: string) => {
    try {
      if (!currentUser) {
        toast.error('User not authenticated');
        return false;
      }
      
      if (currentUser.partnerId) {
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
      
      if (partnerResult.id === currentUser.id) {
        toast.error('You cannot connect with yourself');
        return false;
      }
      
      if (partnerResult.partner_id) {
        toast.error('This user is already connected with someone else');
        return false;
      }
      
      // Use security definer function to update both user profiles
      const { error: updateCurrentError } = await supabase.rpc('update_user_partner', {
        user_id_param: currentUser.id,
        partner_id_param: partnerResult.id
      });
      
      if (updateCurrentError) {
        console.error('Error updating current user:', updateCurrentError);
        toast.error('Failed to connect with partner');
        return false;
      }
      
      const { error: updatePartnerError } = await supabase.rpc('update_user_partner', {
        user_id_param: partnerResult.id, 
        partner_id_param: currentUser.id
      });
      
      if (updatePartnerError) {
        console.error('Error updating partner user:', updatePartnerError);
        // Rollback the first update if the second fails
        await supabase.rpc('update_user_partner', {
          user_id_param: currentUser.id,
          partner_id_param: null
        });
          
        toast.error('Failed to connect with partner');
        return false;
      }
      
      toast.success(`Successfully connected with ${partnerResult.name}`);
      await fetchData(); // Refresh data
      return true;
    } catch (error: any) {
      console.error('Error connecting partner:', error);
      toast.error(error.message || 'Failed to connect with partner');
      return false;
    }
  };

  // Helper function to determine points value based on type
  const getPointsValueByType = (type: BrowniePointType): number => {
    switch (type) {
      case 'time':
        return 2;
      case 'effort':
        return 3;
      case 'fun':
        return 1;
      default:
        return 1;
    }
  };

  // Updated proposeReward to use Supabase
  const proposeReward = async (reward: Omit<Reward, "id" | "status" | "createdById" | "createdAt">): Promise<boolean> => {
    try {
      if (!currentUser) {
        toast.error('User not authenticated');
        return false;
      }
      
      if (!currentUser.partnerId) {
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
          created_by_id: currentUser.id,
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
        fetchData();
      }, 300);
      
      return true;
    } catch (error: any) {
      console.error('Error proposing reward:', error);
      toast.error(error.message || 'Failed to propose reward');
      return false;
    }
  };

  // Updated approveReward to use Supabase - ensures rewards are visible to both partners
  const approveReward = async (rewardId: string): Promise<boolean> => {
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
        fetchData();
      }, 300);
      
      return true;
    } catch (error: any) {
      console.error('Error approving reward:', error);
      toast.error(error.message || 'Failed to approve reward');
      return false;
    }
  };

  // Updated rejectReward to use Supabase
  const rejectReward = async (rewardId: string): Promise<boolean> => {
    try {
      console.log(`Rejecting and removing reward ID: ${rewardId}`);
      
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
      
      // Add a slight delay before refreshing data to allow the database to update
      setTimeout(() => {
        fetchData();
      }, 300);
      
      return true;
    } catch (error: any) {
      console.error('Error rejecting reward:', error);
      toast.error(error.message || 'Failed to reject reward');
      return false;
    }
  };

  // Initial data fetch when user changes
  useEffect(() => {
    if (user) {
      console.log('User authenticated, fetching data for:', user.id);
      fetchData();
    } else {
      console.log('No user, resetting app state');
      // Reset states when user logs out
      setCurrentUser(null);
      setPartner(null);
      setTasks([]);
      setPendingTasks([]);
      setBrowniePoints([]);
      setSummary(null);
      setAvailablePoints(0);
      setIsLoading(false);
    }
  }, [user]);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        partner,
        tasks,
        pendingTasks,
        browniePoints,
        rewards,
        pendingRewards,
        summary,
        availablePoints,
        isLoading,
        refreshData: fetchData,
        addNewTask,
        approveTask,
        rejectTask,
        addNewBrowniePoint,
        deleteTask: handleDeleteTask,
        deleteBrowniePoint: handleDeleteBrowniePoint,
        redeemReward: handleRedeemReward,
        connectPartner,
        hasPartner,
        proposeReward,
        approveReward,
        rejectReward,
        deleteReward: handleDeleteReward
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
