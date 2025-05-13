
import { BrowniePointType } from '@/types';

// Helper function to calculate summary statistics
export const calculateSummaryStats = (
  tasksData: any[], 
  browniePointsData: any[], 
  oneWeekAgo: Date, 
  userId: string, 
  partnerId: string | null
) => {
  // Default values for when there's no data or partner
  const defaultSummary = {
    userTaskCount: 0,
    partnerTaskCount: 0,
    totalTasks: 0,
    userContribution: 50,
    mentalTasks: 0,
    physicalTasks: 0,
    userPoints: 0,
    partnerPoints: 0,
    sentBrowniePoints: 0,
    browniePointsRemaining: Infinity // No limit on brownie points
  };

  if (tasksData.length === 0 && !partnerId) {
    // No tasks and no partner, use default summary
    return defaultSummary;
  }

  if (tasksData.length > 0) {
    const userTasks = tasksData.filter((t: any) => t.user_id === userId);
    const partnerTasks = partnerId ? tasksData.filter((t: any) => t.user_id === partnerId) : [];
    
    const userTaskCount = userTasks.length;
    const partnerTaskCount = partnerTasks.length;
    const totalTasks = userTaskCount + partnerTaskCount;
    
    const userContribution = totalTasks > 0 ? Math.round((userTaskCount / totalTasks) * 100) : 50;
    
    const mentalTasks = tasksData.filter((t: any) => t.type === 'mental' || t.type === 'both').length;
    const physicalTasks = tasksData.filter((t: any) => t.type === 'physical' || t.type === 'both').length;
    
    // Only count approved tasks for points calculation
    const approvedUserTasks = userTasks.filter((t: any) => t.status === 'approved');
    const approvedPartnerTasks = partnerTasks.filter((t: any) => t.status === 'approved');
    
    const userPoints = approvedUserTasks.reduce((sum: number, task: any) => sum + task.rating, 0);
    const partnerPoints = approvedPartnerTasks.reduce((sum: number, task: any) => sum + task.rating, 0);
    
    // Count brownie points sent this week
    const sentBrowniePoints = browniePointsData ? browniePointsData.filter(
      (p: any) => p.from_user_id === userId && 
      new Date(p.created_at) >= oneWeekAgo
    ).length : 0;
    
    return {
      userTaskCount,
      partnerTaskCount,
      totalTasks,
      userContribution,
      mentalTasks,
      physicalTasks,
      userPoints,
      partnerPoints,
      sentBrowniePoints,
      browniePointsRemaining: Infinity // No limit on brownie points
    };
  } else {
    // No tasks but user exists
    return defaultSummary;
  }
};

// Helper function to calculate task brownie points based on rating
export const calculateTaskBrowniePoints = (taskRating: number): number => {
  // Higher rated tasks earn more points
  // This formula creates a progressive reward system
  // Tasks rated 1-3: 1 point
  // Tasks rated 4-6: 2 points
  // Tasks rated 7-8: 3 points
  // Tasks rated 9-10: 4 points
  if (taskRating <= 3) return 1;
  if (taskRating <= 6) return 2;
  if (taskRating <= 8) return 3;
  return 4; // For ratings 9-10
};

// Helper function to determine points value based on type
export const getPointsValueByType = (type: BrowniePointType): number => {
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
