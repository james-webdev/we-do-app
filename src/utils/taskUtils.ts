
// Utility functions for task-related features

/**
 * Returns the appropriate CSS class for a task rating badge
 * @param rating The task rating value (1-10)
 * @returns CSS class string
 */
export const getRatingBadgeColor = (rating: number): string => {
  if (rating <= 2) return 'bg-green-100 text-green-800 hover:bg-green-200';
  if (rating <= 4) return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
  if (rating <= 6) return 'bg-orange-100 text-orange-800 hover:bg-orange-200';
  if (rating <= 8) return 'bg-red-100 text-red-800 hover:bg-red-200';
  return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
};

/**
 * Calculate the points that will be earned for a task based on its rating
 * @param rating The task rating value (1-10)
 * @returns Description of points to be earned
 */
export const calculateTaskPointsDescription = (rating: number): string => {
  if (rating <= 3) return "Will earn 1 brownie point";
  if (rating <= 6) return "Will earn 2 brownie points";
  if (rating <= 8) return "Will earn 3 brownie points";
  return "Will earn 4 brownie points";
};
