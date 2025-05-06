import { User, Task, BrowniePoint, TaskType, TaskLoad, BrowniePointType, Reward } from "../types";
import { users, tasks as mockTasks, browniePoints as mockBrowniePoints, mockCurrentUser, mockRewards } from "./mock-data";

// In a real application, these would be API calls to a backend server
// For now, we'll simulate with local storage and mock data

let localTasks = [...mockTasks];
let localBrowniePoints = [...mockBrowniePoints];
let localRewards = [...mockRewards];

// User management
export const getCurrentUser = (): User => {
  return mockCurrentUser;
};

export const getPartner = (userId: string): User | undefined => {
  const user = users.find(u => u.id === userId);
  if (user && user.partnerId) {
    return users.find(u => u.id === user.partnerId);
  }
  return undefined;
};

// Task management
export const getTasks = (userId: string, days: number = 7): Task[] => {
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - days);
  
  return localTasks.filter(task => {
    return task.timestamp >= startDate && (task.userId === userId || getPartner(userId)?.id === task.userId);
  });
};

export const addTask = (task: Omit<Task, "id">): Task => {
  const newTask = { ...task, id: `task${Date.now()}` };
  localTasks.push(newTask);
  return newTask;
};

export const deleteTask = (taskId: string): boolean => {
  const initialLength = localTasks.length;
  localTasks = localTasks.filter(task => task.id !== taskId);
  return localTasks.length !== initialLength;
};

// Brownie Points management
export const getBrowniePoints = (userId: string, days: number = 7): BrowniePoint[] => {
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - days);
  
  return localBrowniePoints.filter(point => {
    return (
      point.createdAt >= startDate && 
      (point.fromUserId === userId || point.toUserId === userId)
    );
  });
};

export const addBrowniePoint = (point: Omit<BrowniePoint, "id" | "createdAt" | "redeemed">): BrowniePoint => {
  // Determine points value based on type
  const pointsValue = getPointsValueByType(point.type);
  
  const newPoint = { 
    ...point, 
    id: `point${Date.now()}`, 
    createdAt: new Date(),
    redeemed: false,
  };
  localBrowniePoints.push(newPoint);
  return newPoint;
};

export const deleteBrowniePoint = (pointId: string): boolean => {
  const initialLength = localBrowniePoints.length;
  localBrowniePoints = localBrowniePoints.filter(point => point.id !== pointId);
  return localBrowniePoints.length !== initialLength;
};

export const redeemBrowniePoint = (pointId: string): BrowniePoint | undefined => {
  const pointIndex = localBrowniePoints.findIndex(p => p.id === pointId);
  if (pointIndex >= 0) {
    localBrowniePoints[pointIndex] = {
      ...localBrowniePoints[pointIndex],
      redeemed: true
    };
    return localBrowniePoints[pointIndex];
  }
  return undefined;
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

// Rewards management
export const getRewards = (): Reward[] => {
  return localRewards;
};

export const getReward = (rewardId: string): Reward | undefined => {
  return localRewards.find(reward => reward.id === rewardId);
};

export const redeemReward = (userId: string, rewardId: string): boolean => {
  // Check if the reward exists
  const reward = getReward(rewardId);
  if (!reward) return false;
  
  // Get unredeemed brownie points received by the user
  const availablePoints = localBrowniePoints
    .filter(point => point.toUserId === userId && !point.redeemed)
    .reduce((sum, point) => sum + point.points, 0);
  
  // Check if user has enough points
  if (availablePoints < reward.pointsCost) {
    return false;
  }
  
  // Redeem points until the cost is covered
  let remainingCost = reward.pointsCost;
  const pointsToRedeem = localBrowniePoints
    .filter(point => point.toUserId === userId && !point.redeemed)
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()); // Oldest first
  
  for (const point of pointsToRedeem) {
    if (remainingCost <= 0) break;
    
    redeemBrowniePoint(point.id);
    remainingCost -= point.points;
  }
  
  return true;
};

// Analytics
export const getTaskSummary = (userId: string, days: number = 7) => {
  const userTasks = getTasks(userId, days);
  const partnerId = getPartner(userId)?.id;
  
  const userTaskCount = userTasks.filter(t => t.userId === userId).length;
  const partnerTaskCount = userTasks.filter(t => t.userId === partnerId).length;
  const totalTasks = userTaskCount + partnerTaskCount;
  
  // Calculate user contribution percentage
  const userContribution = totalTasks > 0 ? Math.round((userTaskCount / totalTasks) * 100) : 50;
  const partnerContribution = 100 - userContribution;
  
  // Calculate mental vs physical load
  const mentalTasks = userTasks.filter(t => t.type === 'mental' || t.type === 'both').length;
  const physicalTasks = userTasks.filter(t => t.type === 'physical' || t.type === 'both').length;
  
  // Calculate load distribution
  const lightTasks = userTasks.filter(t => t.load === 'light').length;
  const mediumTasks = userTasks.filter(t => t.load === 'medium').length;
  const heavyTasks = userTasks.filter(t => t.load === 'heavy').length;
  
  // Count brownie points
  const sentBrowniePoints = localBrowniePoints.filter(
    p => p.fromUserId === userId && p.createdAt >= new Date(Date.now() - days * 24 * 60 * 60 * 1000)
  ).length;
  
  return {
    userTaskCount,
    partnerTaskCount,
    totalTasks,
    userContribution,
    partnerContribution,
    mentalTasks,
    physicalTasks,
    lightTasks,
    mediumTasks,
    heavyTasks,
    sentBrowniePoints,
    browniePointsRemaining: 3 - sentBrowniePoints
  };
};

export const getBrowniePointCount = (userId: string, days: number = 7): number => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return localBrowniePoints.filter(
    p => p.fromUserId === userId && p.createdAt >= startDate
  ).length;
};

export const getTotalAvailablePoints = (userId: string): number => {
  return localBrowniePoints
    .filter(point => point.toUserId === userId && !point.redeemed)
    .reduce((sum, point) => sum + point.points, 0);
};
