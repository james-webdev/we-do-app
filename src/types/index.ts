
export type TaskType = 'mental' | 'physical' | 'both';
export type TaskLoad = 'light' | 'medium' | 'heavy';
export type BrowniePointType = 'time' | 'effort' | 'fun';
export type TaskStatus = 'pending' | 'approved' | 'rejected';
export type TaskRating = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export type RewardStatus = 'pending' | 'approved' | 'rejected';

export interface User {
  id: string;
  name: string;
  email: string;
  partnerId: string | null;
}

export interface Task {
  id: string;
  title: string;
  type: TaskType;
  rating: TaskRating; // Changed from level to rating
  userId: string;
  timestamp: Date;
  status: TaskStatus;
  comment?: string;
}

export interface BrowniePoint {
  id: string;
  fromUserId: string;
  toUserId: string;
  type: BrowniePointType;
  message: string;
  redeemed: boolean;
  createdAt: Date;
  points: number;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  imageIcon: string;
  status?: RewardStatus;
  createdById?: string;
}
