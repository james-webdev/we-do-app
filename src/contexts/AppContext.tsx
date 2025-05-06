
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { User, Task, BrowniePoint, Reward, TaskStatus, TaskRating, TaskType, BrowniePointType } from '@/types';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

interface AppContextType {
  currentUser: User | null;
  partner: User | null;
  tasks: Task[];
  pendingTasks: Task[];
  browniePoints: BrowniePoint[];
  rewards: Reward[];
  summary: any;
  availablePoints: number;
  isLoading: boolean;
  refreshData: () => void;
  addNewTask: (task: Omit<Task, "id" | "status">) => Promise<void>;
  approveTask: (taskId: string) => Promise<void>;
  rejectTask: (taskId: string, comment: string) => Promise<void>;
  addNewBrowniePoint: (point: Omit<BrowniePoint, "id" | "createdAt" | "redeemed">) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  deleteBrowniePoint: (pointId: string) => Promise<void>;
  redeemReward: (rewardId: string) => Promise<boolean>;
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
  const [summary, setSummary] = useState<any>(null);
  const [availablePoints, setAvailablePoints] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Get current user profile using a direct query with the auth token
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profileError) {
        console.error('Error fetching user profile:', profileError);
        toast.error('Failed to load user profile');
        setIsLoading(false);
        return;
      }
      
      if (profileData) {
        const currentUserData: User = {
          id: profileData.id,
          name: profileData.name,
          email: profileData.email,
          partnerId: profileData.partner_id
        };
        
        setCurrentUser(currentUserData);
        
        // Get partner info if available
        if (profileData.partner_id) {
          const { data: partnerData, error: partnerError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', profileData.partner_id)
            .single();
          
          if (!partnerError && partnerData) {
            setPartner({
              id: partnerData.id,
              name: partnerData.name,
              email: partnerData.email,
              partnerId: partnerData.partner_id
            });
          } else {
            console.log('Partner not found or error:', partnerError);
            setPartner(null);
          }
        } else {
          // No partner set yet
          setPartner(null);
        }
        
        // Get approved tasks if partner exists
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        let fetchedTasksData: any[] = [];
        let fetchedBrowniePointsData: any[] = [];

        try {
          const whereClause = profileData.partner_id 
            ? `user_id.eq.${user.id},user_id.eq.${profileData.partner_id}` 
            : `user_id.eq.${user.id}`;
            
          const { data: tasksData, error: tasksError } = await supabase
            .from('tasks')
            .select('*')
            .or(whereClause)
            .eq('status', 'approved')
            .gte('timestamp', oneWeekAgo.toISOString());
            
          if (tasksError) {
            console.error('Error fetching tasks:', tasksError);
          } else if (tasksData) {
            fetchedTasksData = tasksData;
            const formattedTasks: Task[] = tasksData.map(task => ({
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
          }
        } catch (error) {
          console.error('Error in tasks fetch:', error);
        }
        
        // Get pending tasks if partner exists
        if (profileData.partner_id) {
          try {
            const { data: pendingTasksData, error: pendingError } = await supabase
              .from('tasks')
              .select('*')
              .eq('user_id', profileData.partner_id)
              .eq('status', 'pending');
              
            if (!pendingError && pendingTasksData) {
              const formattedPendingTasks: Task[] = pendingTasksData.map(task => ({
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
            }
          } catch (error) {
            console.error('Error in pending tasks fetch:', error);
          }
        } else {
          // No partner, so no pending tasks
          setPendingTasks([]);
        }
        
        // Get brownie points
        try {
          const pointsQuery = profileData.partner_id 
            ? `from_user_id.eq.${user.id},to_user_id.eq.${user.id}` 
            : `from_user_id.eq.${user.id},to_user_id.eq.${user.id}`;
            
          const { data: browniePointsData, error: brownieError } = await supabase
            .from('brownie_points')
            .select('*')
            .or(pointsQuery)
            .gte('created_at', oneWeekAgo.toISOString());
            
          if (!brownieError && browniePointsData) {
            fetchedBrowniePointsData = browniePointsData;
            const formattedPoints: BrowniePoint[] = browniePointsData.map(point => ({
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
          }
        } catch (error) {
          console.error('Error in brownie points fetch:', error);
        }
        
        // Calculate available points (points received that are not redeemed)
        try {
          const { data: availablePointsData, error: availableError } = await supabase
            .from('brownie_points')
            .select('points')
            .eq('to_user_id', user.id)
            .eq('redeemed', false);
            
          if (!availableError && availablePointsData) {
            const points = availablePointsData.reduce((sum, point) => sum + point.points, 0);
            setAvailablePoints(points);
          }
        } catch (error) {
          console.error('Error calculating available points:', error);
        }
        
        // Get rewards (currently from mock data, would be from Supabase in real app)
        setRewards([
          {
            id: '1',
            title: 'Dinner Out',
            description: 'Partner cooks dinner of your choice',
            pointsCost: 10,
            imageIcon: '🍽️'
          },
          {
            id: '2',
            title: 'Movie Night',
            description: 'Your choice of movie plus snacks',
            pointsCost: 5,
            imageIcon: '🎬'
          },
          {
            id: '3',
            title: 'Sleep In',
            description: 'Partner takes morning duties',
            pointsCost: 8,
            imageIcon: '😴'
          }
        ]);
        
        // Calculate summary statistics using the fetched data
        calculateSummaryStats(fetchedTasksData, fetchedBrowniePointsData, oneWeekAgo, user.id, profileData.partner_id);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to calculate summary statistics
  const calculateSummaryStats = (
    tasksData: any[], 
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
        
      if (error) throw error;
      
      toast.success('Task submitted for partner approval');
      await fetchData(); // Refresh all data
    } catch (error: any) {
      console.error('Error adding task:', error);
      toast.error(error.message || 'Failed to add task');
    }
  };

  const approveTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status: 'approved' })
        .eq('id', taskId);
        
      if (error) throw error;
      
      toast.success('Task approved');
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
    } catch (error: any) {
      console.error('Error rejecting task:', error);
      toast.error(error.message || 'Failed to reject task');
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

  // Initial data fetch when user changes
  useEffect(() => {
    if (user) {
      // Small delay to ensure auth is fully initialized
      const timer = setTimeout(() => {
        fetchData();
      }, 100);
      
      return () => clearTimeout(timer);
    } else {
      // Reset states when user logs out
      setCurrentUser(null);
      setPartner(null);
      setTasks([]);
      setPendingTasks([]);
      setBrowniePoints([]);
      setSummary(null);
      setAvailablePoints(0);
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
        redeemReward: handleRedeemReward
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
