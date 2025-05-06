
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { User, Task, BrowniePoint } from '@/types';
import { 
  getCurrentUser, 
  getPartner, 
  getTasks, 
  getBrowniePoints, 
  getTaskSummary,
  addTask,
  addBrowniePoint,
  deleteTask
} from '@/lib/api';
import { toast } from '@/components/ui/sonner';

interface AppContextType {
  currentUser: User | null;
  partner: User | null;
  tasks: Task[];
  browniePoints: BrowniePoint[];
  summary: any;
  isLoading: boolean;
  refreshData: () => void;
  addNewTask: (task: Omit<Task, "id">) => Promise<void>;
  addNewBrowniePoint: (point: Omit<BrowniePoint, "id" | "createdAt" | "redeemed">) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [partner, setPartner] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [browniePoints, setBrowniePoints] = useState<BrowniePoint[]>([]);
  const [summary, setSummary] = useState<any>(null);
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

      // Fetch tasks and brownie points
      const userTasks = getTasks(user.id);
      setTasks(userTasks);

      const userBrowniePoints = getBrowniePoints(user.id);
      setBrowniePoints(userBrowniePoints);

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

  const addNewTask = async (taskData: Omit<Task, "id">) => {
    try {
      const newTask = addTask(taskData);
      setTasks(prev => [...prev, newTask]);
      toast.success('Task added successfully');
      fetchData(); // Refresh all data to update summaries
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error('Failed to add task');
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
        browniePoints,
        summary,
        isLoading,
        refreshData: fetchData,
        addNewTask,
        addNewBrowniePoint,
        deleteTask: handleDeleteTask
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
