
export type TaskType = 'mental' | 'physical' | 'both';
export type TaskLoad = 'light' | 'medium' | 'heavy';
export type BrowniePointType = 'time' | 'effort' | 'fun';
export type TaskStatus = 'pending' | 'approved' | 'rejected';
export type TaskLevel = 'easy' | 'normal' | 'hard' | 'expert' | 'master';

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
  level: TaskLevel; // Changed from points to level
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
}
