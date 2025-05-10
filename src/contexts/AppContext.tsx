import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { User, Task, BrowniePoint, TaskStatus, TaskRating, TaskType, BrowniePointType } from '@/types';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { AppContextType, ProfileResult, TaskResult } from './types';
import { calculateSummaryStats } from './appContextUtils';
import { 
  addNewTask,
  approveTask, 
  rejectTask, 
  deleteTask 
} from './taskService';
import { 
  addNewBrowniePoint, 
  deleteBrowniePoint 
} from './browniePointService';
import { connectPartner } from './partnerService';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [partner, setPartner] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [pendingTasks, setPendingTasks] = useState<Task[]>([]);
  const [browniePoints, setBrowniePoints] = useState<BrowniePoint[]>([]);
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
            const summaryStats = calculateSummaryStats(fetchedTasksData, [], oneWeekAgo, user.id, profileResult.partner_id);
            setSummary(summaryStats);
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

  // Initialize data when user changes
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

  // Wrapper for connectPartner
  const handleConnectPartner = async (partnerEmail: string) => {
    return await connectPartner(partnerEmail, currentUser?.id, currentUser?.partnerId, fetchData);
  };

  // Create wrapper functions that use the imported service functions
  const handleAddNewTask = async (taskData: Omit<Task, "id" | "status">) => {
    await addNewTask(taskData, currentUser?.id, currentUser?.partnerId, fetchData);
  };

  const handleApproveTask = async (taskId: string) => {
    await approveTask(taskId, currentUser?.id, partner?.id, fetchData);
  };

  const handleRejectTask = async (taskId: string, comment: string) => {
    return await rejectTask(taskId, comment, fetchData);
  };

  const handleAddNewBrowniePoint = async (pointData: Omit<BrowniePoint, "id" | "createdAt" | "redeemed">) => {
    await addNewBrowniePoint(pointData, fetchData);
  };

  const handleDeleteTask = async (taskId: string) => {
    await deleteTask(taskId, fetchData);
  };

  const handleDeleteBrowniePoint = async (pointId: string) => {
    await deleteBrowniePoint(pointId, fetchData);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        partner,
        tasks,
        pendingTasks,
        browniePoints,
        summary,
        availablePoints,
        isLoading,
        refreshData: fetchData,
        addNewTask: handleAddNewTask,
        approveTask: handleApproveTask,
        rejectTask: handleRejectTask,
        addNewBrowniePoint: handleAddNewBrowniePoint,
        deleteTask: handleDeleteTask,
        deleteBrowniePoint: handleDeleteBrowniePoint,
        connectPartner: handleConnectPartner,
        hasPartner
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
