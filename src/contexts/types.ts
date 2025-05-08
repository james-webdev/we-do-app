
import { User, Task, BrowniePoint, Reward, TaskStatus, TaskRating, TaskType, BrowniePointType, RewardStatus } from '@/types';

export interface AppContextType {
  currentUser: User | null;
  partner: User | null;
  tasks: Task[];
  pendingTasks: Task[];
  browniePoints: BrowniePoint[];
  rewards: Reward[];
  pendingRewards: Reward[]; 
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
  proposeReward: (reward: Omit<Reward, "id" | "status" | "createdById" | "createdAt">) => Promise<boolean>;
  approveReward: (rewardId: string) => Promise<boolean>;
  rejectReward: (rewardId: string) => Promise<boolean>;
  deleteReward: (rewardId: string) => Promise<boolean>;
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
