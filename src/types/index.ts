
export type TaskType = 'mental' | 'physical' | 'both';
export type TaskLoad = 'light' | 'medium' | 'heavy';
export type BrowniePointType = 'time' | 'effort' | 'fun';

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
  load: TaskLoad;
  userId: string;
  timestamp: Date;
}

export interface BrowniePoint {
  id: string;
  fromUserId: string;
  toUserId: string;
  type: BrowniePointType;
  message: string;
  redeemed: boolean;
  createdAt: Date;
}
