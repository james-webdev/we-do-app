
import { User, Task, BrowniePoint, TaskType, TaskLoad, BrowniePointType } from "../types";
import { users, tasks as mockTasks, browniePoints as mockBrowniePoints, mockCurrentUser } from "./mock-data";

// In a real application, these would be API calls to a backend server
// For now, we'll simulate with local storage and mock data

let localTasks = [...mockTasks];
let localBrowniePoints = [...mockBrowniePoints];

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
  const newPoint = { 
    ...point, 
    id: `point${Date.now()}`, 
    createdAt: new Date(),
    redeemed: false
  };
  localBrowniePoints.push(newPoint);
  return newPoint;
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
