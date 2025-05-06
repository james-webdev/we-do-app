
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { User, Task, BrowniePoint, Reward, TaskStatus, TaskRating } from '@/types';
import { 
  getCurrentUser, 
  getPartner, 
  getTasks, 
  getPendingTasks,
  getBrowniePoints, 
  getTaskSummary,
  addTask,
  updateTaskStatus,
  addBrowniePoint,
  deleteTask,
  deleteBrowniePoint,
  getRewards,
  redeemReward,
  getTotalAvailablePoints
} from '@/lib/api';
import { toast } from '@/components/ui/sonner';

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
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [partner, setPartner] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [pendingTasks, setPendingTasks] = useState<Task[]>([]);
  const [browniePoints, setBrowniePoints] = useState<BrowniePoint[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [availablePoints, setAvailablePoints] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = () => {
    try {
      setIsLoading(true);
      // In a real app, we would fetch the current user from an auth service
      const user = getCurrentUser();
      setCurrentUser(user);

      // Fetch partner
      const partnerInfo = getPartner(user.id);
      if (partnerInfo) {
        setPartner(partnerInfo);
      }

      // Fetch approved tasks
      const userTasks = getTasks(user.id);
      setTasks(userTasks);

      // Fetch pending tasks (tasks from partner that need approval)
      const userPendingTasks = getPendingTasks(user.id);
      setPendingTasks(userPendingTasks);

      // Fetch brownie points
      const userBrowniePoints = getBrowniePoints(user.id);
      setBrowniePoints(userBrowniePoints);

      // Get rewards
      const allRewards = getRewards();
      setRewards(allRewards);

      // Get available points
      const points = getTotalAvailablePoints(user.id);
      setAvailablePoints(points);

      // Get summary data
      const summaryData = getTaskSummary(user.id);
      setSummary(summaryData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const addNewTask = async (taskData: Omit<Task, "id" | "status">) => {
    try {
      // Add task with pending status
      const newTask = addTask({
        ...taskData,
        status: 'pending'
      });
      
      toast.success('Task submitted for partner approval');
      fetchData(); // Refresh all data to update summaries
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error('Failed to add task');
    }
  };

  const approveTask = async (taskId: string) => {
    try {
      const updatedTask = updateTaskStatus(taskId, 'approved');
      if (updatedTask) {
        toast.success('Task approved');
        fetchData(); // Refresh data to update lists
      } else {
        toast.error('Failed to approve task');
      }
    } catch (error) {
      console.error('Error approving task:', error);
      toast.error('Failed to approve task');
    }
  };

  const rejectTask = async (taskId: string, comment: string) => {
    try {
      const updatedTask = updateTaskStatus(taskId, 'rejected', comment);
      if (updatedTask) {
        toast.success('Task rejected');
        fetchData(); // Refresh data to update lists
      } else {
        toast.error('Failed to reject task');
      }
    } catch (error) {
      console.error('Error rejecting task:', error);
      toast.error('Failed to reject task');
    }
  };

  const addNewBrowniePoint = async (pointData: Omit<BrowniePoint, "id" | "createdAt" | "redeemed">) => {
    try {
      const newPoint = addBrowniePoint(pointData);
      setBrowniePoints(prev => [...prev, newPoint]);
      toast.success('Brownie Point sent successfully');
      fetchData(); // Refresh all data to update brownie point limits
    } catch (error) {
      console.error('Error sending brownie point:', error);
      toast.error('Failed to send Brownie Point');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const success = deleteTask(taskId);
      if (success) {
        setTasks(prev => prev.filter(task => task.id !== taskId));
        toast.success('Task deleted successfully');
        fetchData(); // Refresh data to update summaries
      } else {
        toast.error('Failed to delete task');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    }
  };

  const handleDeleteBrowniePoint = async (pointId: string) => {
    try {
      const success = deleteBrowniePoint(pointId);
      if (success) {
        setBrowniePoints(prev => prev.filter(point => point.id !== pointId));
        toast.success('Brownie Point deleted successfully');
        fetchData(); // Refresh data to update brownie point limits
      } else {
        toast.error('Failed to delete Brownie Point');
      }
    } catch (error) {
      console.error('Error deleting Brownie Point:', error);
      toast.error('Failed to delete Brownie Point');
    }
  };

  const handleRedeemReward = async (rewardId: string) => {
    try {
      if (!currentUser) {
        toast.error('User not found');
        return false;
      }
      
      const success = redeemReward(currentUser.id, rewardId);
      if (success) {
        toast.success('Reward redeemed successfully!');
        fetchData(); // Refresh data to update points
        return true;
      } else {
        toast.error('Failed to redeem reward. You may not have enough points.');
        return false;
      }
    } catch (error) {
      console.error('Error redeeming reward:', error);
      toast.error('Failed to redeem reward');
      return false;
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, []);

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
