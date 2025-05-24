
import { User, Task, BrowniePoint, TaskStatus, TaskRating, TaskType, BrowniePointType, Reward, RewardStatus } from '@/types';

export interface AppContextType {
  currentUser: User | null;
  partner: User | null;
  tasks: Task[];
  pendingTasks: Task[];
  browniePoints: BrowniePoint[];
  rewards: Reward[];
  summary: any;
  availablePoints: number;
  totalPointsEarned: number;
  isLoading: boolean;
  refreshData: () => void;
  addNewTask: (task: Omit<Task, "id" | "status">) => Promise<void>;
  approveTask: (taskId: string) => Promise<void>;
  rejectTask: (taskId: string, comment: string) => Promise<boolean>;
  addNewBrowniePoint: (point: Omit<BrowniePoint, "id" | "createdAt" | "redeemed">) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  deleteBrowniePoint: (pointId: string) => Promise<void>;
  connectPartner: (partnerEmail: string) => Promise<boolean>;
  proposeReward: (reward: Omit<Reward, "id" | "status" | "createdById" | "createdAt">) => Promise<boolean>;
  deleteReward: (rewardId: string) => Promise<boolean>;
  redeemReward: (rewardId: string) => Promise<boolean>;
  hasPartner: boolean;
}

// Define types for the RPC function results to fix TypeScript errors
export type ProfileResult = {
  id: string;
  name: string;
  email: string;
  partner_id: string | null;
  created_at: string;
};

export type TaskResult = {
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
