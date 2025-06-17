
// Utility functions for task-related features

/**
 * Returns the appropriate CSS class for a task rating badge
 * @param rating The task rating value (1-10)
 * @returns CSS class string
 */
export const getRatingBadgeColor = (rating: number): string => {
  // Each rating gets its own distinct shade of blue or purple
  switch(rating) {
    case 1:
      return 'bg-blue-50 text-blue-800 hover:bg-blue-100 border-blue-200';
    case 2:
      return 'bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-300';
    case 3:
      return 'bg-blue-200 text-blue-800 hover:bg-blue-300 border-blue-400';
    case 4:
      return 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200 border-indigo-300';
    case 5:
      return 'bg-indigo-200 text-indigo-800 hover:bg-indigo-300 border-indigo-400';
    case 6:
      return 'bg-purple-100 text-purple-800 hover:bg-purple-200 border-purple-300';
    case 7:
      return 'bg-purple-200 text-purple-800 hover:bg-purple-300 border-purple-400';
    case 8:
      return 'bg-violet-100 text-violet-800 hover:bg-violet-200 border-violet-300';
    case 9:
      return 'bg-violet-200 text-violet-800 hover:bg-violet-300 border-violet-400';
    case 10:
      return 'bg-violet-300 text-violet-900 hover:bg-violet-400 border-violet-500';
    default:
      return 'bg-blue-50 text-blue-800 hover:bg-blue-100 border-blue-200';
  }
};

/**
 * Calculate the points that will be earned for a task based on its rating
 * @param rating The task rating value (1-10)
 * @returns Description of points to be earned
 */
export const calculateTaskPointsDescription = (rating: number): string => {
  return `Will earn ${rating} brownie point${rating !== 1 ? 's' : ''}`;
};
